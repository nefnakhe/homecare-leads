import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { db } from "@/db";
import { agencies } from "@/db/schema";
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
      if (agencyId && session.subscription) {
        const subscription = await stripe.subscriptions.retrieve(
          session.subscription as string
        );
        await db
          .update(agencies)
          .set({
            stripeSubscriptionId: subscription.id,
            subscriptionStatus: "active",
            subscriptionPriceId: subscription.items.data[0]?.price.id,
            updatedAt: new Date(),
          })
          .where(eq(agencies.id, agencyId));
      }
      break;
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;
      const status = subscription.status as
        | "active"
        | "past_due"
        | "canceled"
        | "trialing"
        | "incomplete";

      await db
        .update(agencies)
        .set({
          subscriptionStatus: status,
          subscriptionPriceId: subscription.items.data[0]?.price.id,
          updatedAt: new Date(),
        })
        .where(eq(agencies.stripeCustomerId, customerId));
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;
      await db
        .update(agencies)
        .set({
          subscriptionStatus: "canceled",
          updatedAt: new Date(),
        })
        .where(eq(agencies.stripeCustomerId, customerId));
      break;
    }
  }

  return NextResponse.json({ received: true });
}
