import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/db";
import { leads, leadMatches, agencies } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";

// GET /api/leads/mine — Fetch leads matched to the authenticated agency
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get agency for this user
    const [agency] = await db
      .select({ id: agencies.id })
      .from(agencies)
      .where(eq(agencies.userId, session.user.id))
      .limit(1);

    if (!agency) {
      return NextResponse.json({ error: "No agency profile" }, { status: 404 });
    }

    // Get all lead matches for this agency with lead details
    const results = await db
      .select({
        matchId: leadMatches.id,
        matchStatus: leadMatches.status,
        matchScore: leadMatches.matchScore,
        isExclusive: leadMatches.isExclusive,
        deliveredAt: leadMatches.deliveredAt,
        viewedAt: leadMatches.viewedAt,
        contactedAt: leadMatches.contactedAt,
        acceptedAt: leadMatches.acceptedAt,
        passedAt: leadMatches.passedAt,
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
        patientFirstName: leads.patientFirstName,
        patientAge: leads.patientAge,
        hoursPerWeek: leads.hoursPerWeek,
        score: leads.score,
        createdAt: leads.createdAt,
      })
      .from(leadMatches)
      .innerJoin(leads, eq(leads.id, leadMatches.leadId))
      .where(eq(leadMatches.agencyId, agency.id))
      .orderBy(desc(leadMatches.deliveredAt));

    return NextResponse.json({ leads: results });
  } catch (error) {
    console.error("Fetch leads error:", error);
    return NextResponse.json(
      { error: "Failed to fetch leads" },
      { status: 500 }
    );
  }
}

// PATCH /api/leads/mine — Update a lead match status (viewed, contacted)
export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { matchId, status } = await req.json();

    if (!matchId || !["viewed", "contacted", "accepted", "passed"].includes(status)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const [agency] = await db
      .select({ id: agencies.id })
      .from(agencies)
      .where(eq(agencies.userId, session.user.id))
      .limit(1);

    if (!agency) {
      return NextResponse.json({ error: "No agency profile" }, { status: 404 });
    }

    const updateData: Record<string, unknown> = { status };
    if (status === "viewed") updateData.viewedAt = new Date();
    if (status === "contacted") updateData.contactedAt = new Date();
    if (status === "accepted") updateData.acceptedAt = new Date();
    if (status === "passed") updateData.passedAt = new Date();

    await db
      .update(leadMatches)
      .set(updateData)
      .where(
        and(
          eq(leadMatches.id, matchId),
          eq(leadMatches.agencyId, agency.id)
        )
      );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update lead match error:", error);
    return NextResponse.json(
      { error: "Failed to update" },
      { status: 500 }
    );
  }
}
