import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/db";
import { agencies, leads, leadMatches } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { sendLeadIntroEmail } from "@/lib/email";

// POST /api/leads/mine/accept — Agency acknowledges a lead (no charge — charges on admin confirmation)
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

    const [agency] = await db
      .select()
      .from(agencies)
      .where(eq(agencies.userId, session.user.id))
      .limit(1);

    if (!agency) {
      return NextResponse.json({ error: "No agency profile" }, { status: 404 });
    }

    const [match] = await db
      .select({
        matchId: leadMatches.id,
        matchStatus: leadMatches.status,
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

    // Update match status to accepted (no charge — admin confirms later)
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

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Accept lead error:", error);
    return NextResponse.json(
      { error: "Failed to accept lead" },
      { status: 500 }
    );
  }
}
