import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/db";
import {
  agencies,
  disputes,
  leads,
  leadMatches,
  billingEvents,
} from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { z } from "zod";

const createDisputeSchema = z.object({
  matchId: z.string().uuid(),
  reason: z.enum([
    "invalid_contact",
    "not_private_pay",
    "wrong_location",
    "duplicate_lead",
    "not_seeking_care",
    "other",
  ]),
  description: z.string().min(10).max(2000),
});

// POST /api/disputes — Agency submits a dispute on an accepted lead
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = createDisputeSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { matchId, reason, description } = parsed.data;

    // Get agency
    const [agency] = await db
      .select()
      .from(agencies)
      .where(eq(agencies.userId, session.user.id))
      .limit(1);

    if (!agency) {
      return NextResponse.json({ error: "No agency profile" }, { status: 404 });
    }

    // Get the match — must be accepted and belong to this agency
    const [match] = await db
      .select({
        matchId: leadMatches.id,
        matchStatus: leadMatches.status,
        leadId: leadMatches.leadId,
        agencyId: leadMatches.agencyId,
      })
      .from(leadMatches)
      .where(
        and(eq(leadMatches.id, matchId), eq(leadMatches.agencyId, agency.id))
      )
      .limit(1);

    if (!match) {
      return NextResponse.json({ error: "Match not found" }, { status: 404 });
    }

    if (match.matchStatus !== "accepted") {
      return NextResponse.json(
        { error: "Can only dispute accepted leads" },
        { status: 400 }
      );
    }

    // Find the successful billing event for this match
    const [billingEvent] = await db
      .select()
      .from(billingEvents)
      .where(
        and(
          eq(billingEvents.leadMatchId, matchId),
          eq(billingEvents.type, "lead_charge"),
          eq(billingEvents.status, "succeeded")
        )
      )
      .limit(1);

    if (!billingEvent) {
      return NextResponse.json(
        { error: "No successful charge found for this lead" },
        { status: 400 }
      );
    }

    // Check if dispute already exists for this match
    const [existingDispute] = await db
      .select({ id: disputes.id })
      .from(disputes)
      .where(eq(disputes.leadMatchId, matchId))
      .limit(1);

    if (existingDispute) {
      return NextResponse.json(
        { error: "A dispute already exists for this lead" },
        { status: 409 }
      );
    }

    // Create dispute
    const [dispute] = await db
      .insert(disputes)
      .values({
        agencyId: agency.id,
        leadId: match.leadId,
        leadMatchId: matchId,
        billingEventId: billingEvent.id,
        reason,
        description,
        amountCents: billingEvent.amountCents,
      })
      .returning();

    return NextResponse.json({ success: true, dispute });
  } catch (error) {
    console.error("Create dispute error:", error);
    return NextResponse.json(
      { error: "Failed to create dispute" },
      { status: 500 }
    );
  }
}

// GET /api/disputes — List disputes for the authenticated agency
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [agency] = await db
      .select({ id: agencies.id })
      .from(agencies)
      .where(eq(agencies.userId, session.user.id))
      .limit(1);

    if (!agency) {
      return NextResponse.json({ error: "No agency profile" }, { status: 404 });
    }

    const agencyDisputes = await db
      .select({
        id: disputes.id,
        reason: disputes.reason,
        description: disputes.description,
        status: disputes.status,
        amountCents: disputes.amountCents,
        adminNote: disputes.adminNote,
        resolvedAt: disputes.resolvedAt,
        createdAt: disputes.createdAt,
        leadFirstName: leads.firstName,
        leadLastName: leads.lastName,
        leadCareType: leads.careType,
        leadCity: leads.city,
        leadState: leads.state,
        leadZip: leads.zip,
      })
      .from(disputes)
      .innerJoin(leads, eq(leads.id, disputes.leadId))
      .where(eq(disputes.agencyId, agency.id))
      .orderBy(desc(disputes.createdAt));

    return NextResponse.json({ disputes: agencyDisputes });
  } catch (error) {
    console.error("Fetch disputes error:", error);
    return NextResponse.json(
      { error: "Failed to fetch disputes" },
      { status: 500 }
    );
  }
}
