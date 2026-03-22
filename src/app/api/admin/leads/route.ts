import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/db";
import {
  users,
  agencies,
  leads,
  leadMatches,
  billingEvents,
} from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { z } from "zod";
import { stripe } from "@/lib/stripe";
import { ONBOARDING_FEE_CENTS, LEAD_FEE_CENTS } from "@/lib/lead-pricing";

const confirmLeadSchema = z.object({
  matchId: z.string().uuid(),
  action: z.enum(["confirm", "reject"]),
  adminNote: z.string().max(2000).optional(),
});

// GET /api/admin/leads — List all delivered leads for admin review
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [user] = await db
      .select({ role: users.role })
      .from(users)
      .where(eq(users.id, session.user.id))
      .limit(1);

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const allMatches = await db
      .select({
        matchId: leadMatches.id,
        matchStatus: leadMatches.status,
        matchScore: leadMatches.matchScore,
        adminConfirmed: leadMatches.adminConfirmed,
        adminConfirmedAt: leadMatches.adminConfirmedAt,
        deliveredAt: leadMatches.deliveredAt,
        acceptedAt: leadMatches.acceptedAt,
        leadId: leads.id,
        firstName: leads.firstName,
        lastName: leads.lastName,
        email: leads.email,
        phone: leads.phone,
        careType: leads.careType,
        careDescription: leads.careDescription,
        zip: leads.zip,
        city: leads.city,
        state: leads.state,
        urgency: leads.urgency,
        paymentType: leads.paymentType,
        score: leads.score,
        budgetMin: leads.budgetMin,
        budgetMax: leads.budgetMax,
        hoursPerWeek: leads.hoursPerWeek,
        leadCreatedAt: leads.createdAt,
        agencyId: agencies.id,
        agencyName: agencies.name,
        agencyEmail: users.email,
        agencyPhone: agencies.phone,
        stripeCustomerId: agencies.stripeCustomerId,
      })
      .from(leadMatches)
      .innerJoin(leads, eq(leads.id, leadMatches.leadId))
      .innerJoin(agencies, eq(agencies.id, leadMatches.agencyId))
      .innerJoin(users, eq(users.id, agencies.userId))
      .orderBy(desc(leadMatches.deliveredAt));

    const pendingReview = allMatches.filter((m) => !m.adminConfirmed && m.matchStatus !== "passed").length;
    const confirmed = allMatches.filter((m) => m.adminConfirmed).length;

    return NextResponse.json({
      matches: allMatches,
      summary: {
        total: allMatches.length,
        pendingReview,
        confirmed,
      },
    });
  } catch (error) {
    console.error("Admin leads fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch leads" },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/leads — Confirm or reject a lead (triggers billing on confirm)
export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [user] = await db
      .select({ role: users.role })
      .from(users)
      .where(eq(users.id, session.user.id))
      .limit(1);

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const parsed = confirmLeadSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { matchId, action } = parsed.data;

    // Get the match
    const [match] = await db
      .select({
        id: leadMatches.id,
        leadId: leadMatches.leadId,
        agencyId: leadMatches.agencyId,
        adminConfirmed: leadMatches.adminConfirmed,
        status: leadMatches.status,
        careType: leads.careType,
        firstName: leads.firstName,
        lastName: leads.lastName,
      })
      .from(leadMatches)
      .innerJoin(leads, eq(leads.id, leadMatches.leadId))
      .where(eq(leadMatches.id, matchId))
      .limit(1);

    if (!match) {
      return NextResponse.json({ error: "Match not found" }, { status: 404 });
    }

    if (match.adminConfirmed) {
      return NextResponse.json(
        { error: "Lead already confirmed" },
        { status: 409 }
      );
    }

    if (action === "reject") {
      // Admin rejects — no charge, update lead status
      await db
        .update(leadMatches)
        .set({ status: "expired" })
        .where(eq(leadMatches.id, matchId));

      return NextResponse.json({ success: true, action: "rejected" });
    }

    // ── Admin confirms — charge the agency $300 + $2,000 ──
    const [agency] = await db
      .select({
        id: agencies.id,
        stripeCustomerId: agencies.stripeCustomerId,
        name: agencies.name,
      })
      .from(agencies)
      .where(eq(agencies.id, match.agencyId))
      .limit(1);

    if (!agency?.stripeCustomerId) {
      return NextResponse.json(
        { error: "Agency has no payment method on file" },
        { status: 400 }
      );
    }

    const leadDesc = `${match.careType.replace(/_/g, " ")} — ${match.firstName} ${match.lastName.charAt(0)}.`;
    const charges: { type: "onboarding_fee" | "lead_charge"; amountCents: number; description: string }[] = [
      {
        type: "onboarding_fee",
        amountCents: ONBOARDING_FEE_CENTS,
        description: `Onboarding fee: ${leadDesc}`,
      },
      {
        type: "lead_charge",
        amountCents: LEAD_FEE_CENTS,
        description: `Lead fee: ${leadDesc}`,
      },
    ];

    const billingResults: { type: string; paymentIntentId: string | null; status: string }[] = [];

    for (const charge of charges) {
      let paymentIntentId: string | null = null;
      let chargeStatus: "succeeded" | "failed" = "failed";
      let failureReason: string | null = null;

      try {
        const paymentIntent = await stripe.paymentIntents.create({
          amount: charge.amountCents,
          currency: "usd",
          customer: agency.stripeCustomerId,
          description: charge.description,
          metadata: {
            matchId: match.id,
            leadId: match.leadId,
            agencyId: agency.id,
            chargeType: charge.type,
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
        failureReason =
          stripeErr instanceof Error ? stripeErr.message : "Payment failed";
      }

      await db.insert(billingEvents).values({
        agencyId: agency.id,
        leadId: match.leadId,
        leadMatchId: match.id,
        type: charge.type,
        amountCents: charge.amountCents,
        careType: match.careType,
        stripePaymentIntentId: paymentIntentId,
        status: chargeStatus,
        failureReason,
      });

      billingResults.push({
        type: charge.type,
        paymentIntentId,
        status: chargeStatus,
      });
    }

    // Mark as admin-confirmed
    await db
      .update(leadMatches)
      .set({
        adminConfirmed: true,
        adminConfirmedAt: new Date(),
        adminConfirmedByUserId: session.user.id,
      })
      .where(eq(leadMatches.id, matchId));

    const allSucceeded = billingResults.every((r) => r.status === "succeeded");

    return NextResponse.json({
      success: true,
      action: "confirmed",
      charges: billingResults,
      allChargesSucceeded: allSucceeded,
    });
  } catch (error) {
    console.error("Admin confirm lead error:", error);
    return NextResponse.json(
      { error: "Failed to confirm lead" },
      { status: 500 }
    );
  }
}
