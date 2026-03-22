import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/db";
import { agencies, billingEvents, leads } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

// GET /api/billing — Fetch billing history for the authenticated agency
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

    const events = await db
      .select({
        id: billingEvents.id,
        type: billingEvents.type,
        amountCents: billingEvents.amountCents,
        careType: billingEvents.careType,
        status: billingEvents.status,
        failureReason: billingEvents.failureReason,
        stripePaymentIntentId: billingEvents.stripePaymentIntentId,
        createdAt: billingEvents.createdAt,
        leadFirstName: leads.firstName,
        leadLastName: leads.lastName,
        leadCity: leads.city,
        leadState: leads.state,
        leadZip: leads.zip,
      })
      .from(billingEvents)
      .leftJoin(leads, eq(leads.id, billingEvents.leadId))
      .where(eq(billingEvents.agencyId, agency.id))
      .orderBy(desc(billingEvents.createdAt));

    // Summary stats
    const totalChargedCents = events
      .filter((e) => e.status === "succeeded")
      .reduce((sum, e) => sum + e.amountCents, 0);
    const totalLeadsCharged = events.filter(
      (e) => (e.type === "lead_charge" || e.type === "onboarding_fee") && e.status === "succeeded"
    ).length;
    const failedCharges = events.filter((e) => e.status === "failed").length;

    return NextResponse.json({
      events,
      summary: {
        totalChargedCents,
        totalLeadsAccepted: totalLeadsCharged,
        failedCharges,
      },
    });
  } catch (error) {
    console.error("Billing fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch billing history" },
      { status: 500 }
    );
  }
}
