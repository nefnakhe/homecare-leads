import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/db";
import {
  users,
  agencies,
  disputes,
  leads,
  billingEvents,
} from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { z } from "zod";
import { stripe } from "@/lib/stripe";

const resolveDisputeSchema = z.object({
  disputeId: z.string().uuid(),
  resolution: z.enum(["approved", "denied"]),
  adminNote: z.string().max(2000).optional(),
});

// GET /api/admin/disputes — List all disputes (admin only)
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check admin role
    const [user] = await db
      .select({ role: users.role })
      .from(users)
      .where(eq(users.id, session.user.id))
      .limit(1);

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const allDisputes = await db
      .select({
        id: disputes.id,
        reason: disputes.reason,
        description: disputes.description,
        status: disputes.status,
        amountCents: disputes.amountCents,
        adminNote: disputes.adminNote,
        resolvedAt: disputes.resolvedAt,
        createdAt: disputes.createdAt,
        updatedAt: disputes.updatedAt,
        agencyId: disputes.agencyId,
        agencyName: agencies.name,
        agencyEmail: users.email,
        leadFirstName: leads.firstName,
        leadLastName: leads.lastName,
        leadEmail: leads.email,
        leadPhone: leads.phone,
        leadCareType: leads.careType,
        leadCity: leads.city,
        leadState: leads.state,
        leadZip: leads.zip,
        billingEventId: disputes.billingEventId,
      })
      .from(disputes)
      .innerJoin(leads, eq(leads.id, disputes.leadId))
      .innerJoin(agencies, eq(agencies.id, disputes.agencyId))
      .innerJoin(users, eq(users.id, agencies.userId))
      .orderBy(desc(disputes.createdAt));

    const summary = {
      total: allDisputes.length,
      open: allDisputes.filter((d) => d.status === "open").length,
      underReview: allDisputes.filter((d) => d.status === "under_review").length,
      approved: allDisputes.filter((d) => d.status === "approved").length,
      denied: allDisputes.filter((d) => d.status === "denied").length,
    };

    return NextResponse.json({ disputes: allDisputes, summary });
  } catch (error) {
    console.error("Admin disputes fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch disputes" },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/disputes — Resolve a dispute (admin only)
export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check admin role
    const [user] = await db
      .select({ role: users.role })
      .from(users)
      .where(eq(users.id, session.user.id))
      .limit(1);

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const parsed = resolveDisputeSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { disputeId, resolution, adminNote } = parsed.data;

    // Get the dispute
    const [dispute] = await db
      .select()
      .from(disputes)
      .where(eq(disputes.id, disputeId))
      .limit(1);

    if (!dispute) {
      return NextResponse.json({ error: "Dispute not found" }, { status: 404 });
    }

    if (dispute.status === "approved" || dispute.status === "denied") {
      return NextResponse.json(
        { error: "Dispute already resolved" },
        { status: 409 }
      );
    }

    let refundBillingEventId: string | null = null;

    // If approved, process refund
    if (resolution === "approved") {
      // Get the original billing event to find the Stripe payment intent
      const [originalBilling] = await db
        .select()
        .from(billingEvents)
        .where(eq(billingEvents.id, dispute.billingEventId))
        .limit(1);

      if (originalBilling?.stripePaymentIntentId) {
        try {
          await stripe.refunds.create({
            payment_intent: originalBilling.stripePaymentIntentId,
            amount: dispute.amountCents,
          });
        } catch (stripeErr) {
          console.error("Stripe refund error:", stripeErr);
          // Continue — record the refund billing event regardless
          // (Stripe may not be configured in dev)
        }
      }

      // Create refund billing event
      const [refundEvent] = await db
        .insert(billingEvents)
        .values({
          agencyId: dispute.agencyId,
          leadId: dispute.leadId,
          leadMatchId: dispute.leadMatchId,
          type: "refund",
          amountCents: dispute.amountCents,
          careType:
            (
              await db
                .select({ careType: leads.careType })
                .from(leads)
                .where(eq(leads.id, dispute.leadId))
                .limit(1)
            )[0]?.careType || "other",
          isExclusive: false,
          status: "refunded",
        })
        .returning();

      refundBillingEventId = refundEvent.id;
    }

    // Update dispute status
    await db
      .update(disputes)
      .set({
        status: resolution,
        adminNote: adminNote || null,
        resolvedAt: new Date(),
        resolvedByUserId: session.user.id,
        refundBillingEventId,
        updatedAt: new Date(),
      })
      .where(eq(disputes.id, disputeId));

    return NextResponse.json({
      success: true,
      resolution,
      refundBillingEventId,
    });
  } catch (error) {
    console.error("Resolve dispute error:", error);
    return NextResponse.json(
      { error: "Failed to resolve dispute" },
      { status: 500 }
    );
  }
}
