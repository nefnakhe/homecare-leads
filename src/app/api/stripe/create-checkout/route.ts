import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { stripe, PRIORITY_PASS } from "@/lib/stripe";
import { db } from "@/db";
import { agencies } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { type } = await req.json();

    const userId = (session.user as { id: string }).id;

    const [agency] = await db
      .select()
      .from(agencies)
      .where(eq(agencies.userId, userId))
      .limit(1);

    if (!agency) {
      return NextResponse.json(
        { error: "Complete onboarding first" },
        { status: 400 }
      );
    }

    // Create or retrieve Stripe customer
    let customerId = agency.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: session.user.email!,
        name: agency.name,
        metadata: { agencyId: agency.id, userId },
      });
      customerId = customer.id;

      await db
        .update(agencies)
        .set({ stripeCustomerId: customerId, updatedAt: new Date() })
        .where(eq(agencies.id, agency.id));
    }

    if (type === "priority_pass") {
      // Priority Pass: one-time $197 charge
      const checkoutSession = await stripe.checkout.sessions.create({
        customer: customerId,
        mode: "payment",
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: "Priority Pass — 3 Months",
                description:
                  "Get leads delivered before free agencies for 3 months",
              },
              unit_amount: PRIORITY_PASS.priceCents,
            },
            quantity: 1,
          },
        ],
        success_url: `${process.env.NEXTAUTH_URL}/dashboard?priority_pass=success`,
        cancel_url: `${process.env.NEXTAUTH_URL}/dashboard?priority_pass=cancelled`,
        metadata: { agencyId: agency.id, type: "priority_pass" },
      });

      return NextResponse.json({ url: checkoutSession.url });
    }

    if (type === "setup_payment") {
      // Setup payment method for per-lead billing (no charge now)
      const checkoutSession = await stripe.checkout.sessions.create({
        customer: customerId,
        mode: "setup",
        payment_method_types: ["card"],
        success_url: `${process.env.NEXTAUTH_URL}/dashboard?payment_setup=success`,
        cancel_url: `${process.env.NEXTAUTH_URL}/dashboard?payment_setup=cancelled`,
        metadata: { agencyId: agency.id, type: "setup_payment" },
      });

      return NextResponse.json({ url: checkoutSession.url });
    }

    return NextResponse.json({ error: "Invalid checkout type" }, { status: 400 });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
