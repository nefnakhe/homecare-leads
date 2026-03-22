import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe, PRIORITY_PASS } from "@/lib/stripe";
import { db } from "@/db";
import { agencies, billingEvents } from "@/db/schema";
import { eq } from "drizzle-orm";
import Stripe from "stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = headers();
  const sig = headersList.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const agencyId = session.metadata?.agencyId;
      const checkoutType = session.metadata?.type;

      if (agencyId && checkoutType === "priority_pass") {
        const now = new Date();
        const expiresAt = new Date(now);
        expiresAt.setMonth(expiresAt.getMonth() + PRIORITY_PASS.durationMonths);

        await db
          .update(agencies)
          .set({
            priorityPassPurchasedAt: now,
            priorityPassExpiresAt: expiresAt,
            updatedAt: now,
          })
          .where(eq(agencies.id, agencyId));

        // Record billing event
        await db.insert(billingEvents).values({
          agencyId,
          type: "priority_pass",
          amountCents: PRIORITY_PASS.priceCents,
          stripePaymentIntentId: session.payment_intent as string,
          status: "succeeded",
        });
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
