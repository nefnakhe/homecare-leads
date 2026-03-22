import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/db";
import { agencies, leadMatches } from "@/db/schema";
import { eq, and } from "drizzle-orm";

// POST /api/leads/mine/pass — Pass on a lead match (no charge)
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
      .select({ id: agencies.id })
      .from(agencies)
      .where(eq(agencies.userId, session.user.id))
      .limit(1);

    if (!agency) {
      return NextResponse.json({ error: "No agency profile" }, { status: 404 });
    }

    // Verify ownership and valid status
    const [match] = await db
      .select({ id: leadMatches.id, status: leadMatches.status })
      .from(leadMatches)
      .where(
        and(eq(leadMatches.id, matchId), eq(leadMatches.agencyId, agency.id))
      )
      .limit(1);

    if (!match) {
      return NextResponse.json({ error: "Match not found" }, { status: 404 });
    }

    if (match.status === "accepted") {
      return NextResponse.json(
        { error: "Cannot pass on an accepted lead" },
        { status: 400 }
      );
    }

    if (match.status === "passed") {
      return NextResponse.json({ error: "Already passed" }, { status: 409 });
    }

    await db
      .update(leadMatches)
      .set({ status: "passed", passedAt: new Date() })
      .where(eq(leadMatches.id, matchId));

    // Decrement agency capacity since they passed
    const [agencyFull] = await db
      .select({ currentCapacity: agencies.currentCapacity })
      .from(agencies)
      .where(eq(agencies.id, agency.id))
      .limit(1);

    if (agencyFull && (agencyFull.currentCapacity ?? 0) > 0) {
      await db
        .update(agencies)
        .set({ currentCapacity: (agencyFull.currentCapacity ?? 0) - 1 })
        .where(eq(agencies.id, agency.id));
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Pass lead error:", error);
    return NextResponse.json(
      { error: "Failed to pass on lead" },
      { status: 500 }
    );
  }
}
