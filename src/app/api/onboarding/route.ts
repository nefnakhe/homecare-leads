import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/db";
import { agencies } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

const onboardingSchema = z.object({
  name: z.string().min(2, "Agency name is required"),
  phone: z.string().min(10, "Valid phone number required"),
  website: z.string().url().optional().or(z.literal("")),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().length(2, "State must be 2-letter abbreviation"),
  zip: z.string().min(5, "ZIP code is required"),
  serviceAreaZips: z.array(z.string()).min(1, "At least one service area ZIP required"),
  serviceRadiusMiles: z.number().min(5).max(100).default(25),
  specialties: z.array(z.string()).min(1, "Select at least one specialty"),
  maxLeadsPerMonth: z.number().min(5).max(500).default(50),
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = onboardingSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const userId = (session.user as { id: string }).id;

    // Check if agency already exists
    const [existing] = await db
      .select()
      .from(agencies)
      .where(eq(agencies.userId, userId))
      .limit(1);

    if (existing) {
      // Update existing
      await db
        .update(agencies)
        .set({
          ...parsed.data,
          onboardingStatus: "complete",
          updatedAt: new Date(),
        })
        .where(eq(agencies.id, existing.id));

      return NextResponse.json({ message: "Agency profile updated", id: existing.id });
    }

    // Create new
    const [agency] = await db
      .insert(agencies)
      .values({
        userId,
        ...parsed.data,
        onboardingStatus: "complete",
      })
      .returning({ id: agencies.id });

    return NextResponse.json(
      { message: "Agency profile created", id: agency.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Onboarding error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;

    const [agency] = await db
      .select()
      .from(agencies)
      .where(eq(agencies.userId, userId))
      .limit(1);

    if (!agency) {
      return NextResponse.json({ agency: null });
    }

    return NextResponse.json({ agency });
  } catch (error) {
    console.error("Get agency error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
