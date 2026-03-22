import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/db";
import { agencies, leads, leadMatches, billingEvents } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { stripe } from "@/lib/stripe";
import { getLeadPriceCents } from "@/lib/lead-pricing";
import { sendLeadIntroEmail } from "@/lib/email";

// POST /api/leads/mine/accept — Accept a lead match, charge per-lead fee
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { matchId } = await req.json();
    if (!matchId) {
      return NextResponse.json({ error: "matchId required" }, { status: 400 });
    }

    // Get agency
    const [agency] = await db
      .select()
      .from(agencies)
      .where(eq(agencies.userId, session.user.id))
      .limit(1);

    if (!agency) {
      return NextResponse.json({ error: "No agency profile" }, { status: 404 });
    }

    if (!agency.stripeCustomerId) {
      return NextResponse.json(
        { error: "No payment method on file. Please subscribe first." },
        { status: 402 }
      );
    }

    // Get the match + lead
    const [match] = await db
      .select({
        matchId: leadMatches.id,
        matchStatus: leadMatches.status,
        isExclusive: leadMatches.isExclusive,
        leadId: leadMatches.leadId,
        agencyId: leadMatches.agencyId,
        careType: leads.careType,
        firstName: leads.firstName,
        lastName: leads.lastName,
        email: leads.email,
        phone: leads.phone,
        city: leads.city,
        state: leads.state,
        zip: leads.zip,
        careDescription: leads.careDescription,
      })
      .from(leadMatches)
      .innerJoin(leads, eq(leads.id, leadMatches.leadId))
      .where(
        and(eq(leadMatches.id, matchId), eq(leadMatches.agencyId, agency.id))
      )
      .limit(1);

    if (!match) {
      return NextResponse.json({ error: "Match not found" }, { status: 404 });
    }

    if (match.matchStatus === "accepted") {
      return NextResponse.json({ error: "Already accepted" }, { status: 409 });
    }

    if (match.matchStatus === "passed" || match.matchStatus === "expired") {
      return NextResponse.json(
        { error: "Cannot accept a passed or expired lead" },
        { status: 400 }
      );
    }

    // Calculate price
    const amountCents = getLeadPriceCents(match.careType, match.isExclusive);

    // Create Stripe PaymentIntent and charge immediately
    let paymentIntentId: string | null = null;
    let chargeStatus: "succeeded" | "failed" = "failed";
    let failureReason: string | null = null;

    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amountCents,
        currency: "usd",
        customer: agency.stripeCustomerId,
        description: `Lead charge: ${match.careType.replace(/_/g, " ")} — ${match.firstName} ${match.lastName.charAt(0)}.`,
        metadata: {
          matchId: match.matchId,
          leadId: match.leadId,
          agencyId: agency.id,
          careType: match.careType,
          isExclusive: String(match.isExclusive),
        },
        confirm: true,
        automatic_payment_methods: {
          enabled: true,
          allow_redirects: "never",
        },
      });

      paymentIntentId = paymentIntent.id;
      chargeStatus =
        paymentIntent.status === "succeeded" ? "succeeded" : "failed";
      if (paymentIntent.status !== "succeeded") {
        failureReason = `Payment status: ${paymentIntent.status}`;
      }
    } catch (stripeErr: unknown) {
      const msg =
        stripeErr instanceof Error ? stripeErr.message : "Payment failed";
      failureReason = msg;

      // Create billing event with failed status
      await db.insert(billingEvents).values({
        agencyId: agency.id,
        leadId: match.leadId,
        leadMatchId: match.matchId,
        type: "lead_charge",
        amountCents,
        careType: match.careType,
        isExclusive: match.isExclusive,
        stripePaymentIntentId: null,
        status: "failed",
        failureReason: msg,
      });

      return NextResponse.json(
        { error: "Payment failed", detail: msg },
        { status: 402 }
      );
    }

    // Record billing event
    await db.insert(billingEvents).values({
      agencyId: agency.id,
      leadId: match.leadId,
      leadMatchId: match.matchId,
      type: "lead_charge",
      amountCents,
      careType: match.careType,
      isExclusive: match.isExclusive,
      stripePaymentIntentId: paymentIntentId,
      status: chargeStatus,
      failureReason,
    });

    if (chargeStatus !== "succeeded") {
      return NextResponse.json(
        { error: "Payment did not succeed", detail: failureReason },
        { status: 402 }
      );
    }

    // Update match status to accepted
    await db
      .update(leadMatches)
      .set({ status: "accepted", acceptedAt: new Date() })
      .where(eq(leadMatches.id, matchId));

    // Send auto-intro email to family (non-blocking)
    sendLeadIntroEmail(
      match.email,
      match.firstName,
      agency.name,
      agency.phone || "",
      {
        careType: match.careType,
        city: match.city,
        state: match.state,
      }
    ).catch((err) => console.error("Intro email error:", err));

    return NextResponse.json({
      success: true,
      amountCents,
      paymentIntentId,
    });
  } catch (error) {
    console.error("Accept lead error:", error);
    return NextResponse.json(
      { error: "Failed to accept lead" },
      { status: 500 }
    );
  }
}
