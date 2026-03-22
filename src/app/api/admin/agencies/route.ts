import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/db";
import { users, agencies } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { z } from "zod";

const approveAgencySchema = z.object({
  agencyId: z.string().uuid(),
  approved: z.boolean(),
});

// GET /api/admin/agencies — List all agencies for admin review
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

    const allAgencies = await db
      .select({
        id: agencies.id,
        name: agencies.name,
        email: users.email,
        phone: agencies.phone,
        website: agencies.website,
        city: agencies.city,
        state: agencies.state,
        zip: agencies.zip,
        serviceAreaZips: agencies.serviceAreaZips,
        specialties: agencies.specialties,
        onboardingStatus: agencies.onboardingStatus,
        adminApproved: agencies.adminApproved,
        stripeCustomerId: agencies.stripeCustomerId,
        priorityPassExpiresAt: agencies.priorityPassExpiresAt,
        createdAt: agencies.createdAt,
      })
      .from(agencies)
      .innerJoin(users, eq(users.id, agencies.userId))
      .orderBy(desc(agencies.createdAt));

    return NextResponse.json({ agencies: allAgencies });
  } catch (error) {
    console.error("Admin agencies fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch agencies" },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/agencies — Approve or revoke agency
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
    const parsed = approveAgencySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed" },
        { status: 400 }
      );
    }

    await db
      .update(agencies)
      .set({
        adminApproved: parsed.data.approved,
        updatedAt: new Date(),
      })
      .where(eq(agencies.id, parsed.data.agencyId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin approve agency error:", error);
    return NextResponse.json(
      { error: "Failed to update agency" },
      { status: 500 }
    );
  }
}
