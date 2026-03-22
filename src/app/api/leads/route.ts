import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { leads, agencies, leadMatches, users } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { scoreLead } from "@/lib/lead-scoring";
import { matchLeadToAgencies } from "@/lib/lead-matching";
import { sendLeadNotificationEmail } from "@/lib/email";

const leadSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(7, "Phone number is required"),
  relationToPatient: z.string().optional(),
  patientFirstName: z.string().optional(),
  patientAge: z.number().int().positive().optional(),
  careType: z.enum([
    "personal_care",
    "companion_care",
    "skilled_nursing",
    "dementia_care",
    "respite_care",
    "live_in_care",
    "post_surgery",
    "hospice_support",
    "other",
  ]),
  careDescription: z.string().optional(),
  zip: z.string().min(5, "ZIP code is required"),
  city: z.string().optional(),
  state: z.string().max(2).optional(),
  urgency: z.enum(["immediate", "within_week", "within_month", "exploring"]),
  paymentType: z.enum([
    "private_pay",
    "long_term_care_insurance",
    "medicare",
    "medicaid",
    "va_benefits",
    "other",
  ]),
  budgetMin: z.number().int().nonnegative().optional(),
  budgetMax: z.number().int().nonnegative().optional(),
  hoursPerWeek: z.number().int().positive().optional(),
});

// POST /api/leads — Family submits a care request
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = leadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // ── Private-pay gate ──────────────────────────────────────────────
    const isPrivatePay =
      data.paymentType === "private_pay" ||
      data.paymentType === "long_term_care_insurance";

    if (!isPrivatePay) {
      await db.insert(leads).values({
        ...data,
        isPrivatePay: false,
        status: "disqualified",
      });

      return NextResponse.json(
        {
          message:
            "Thank you for your submission. Unfortunately, our network currently serves private-pay and long-term care insurance clients. We recommend contacting your local Area Agency on Aging for assistance with Medicare/Medicaid options.",
          qualified: false,
        },
        { status: 200 }
      );
    }

    // ── Score the lead ────────────────────────────────────────────────
    const scoreResult = scoreLead({
      urgency: data.urgency,
      paymentType: data.paymentType,
      careType: data.careType,
      budgetMax: data.budgetMax,
      hoursPerWeek: data.hoursPerWeek,
    });

    // ── Save the qualified lead ───────────────────────────────────────
    const [lead] = await db
      .insert(leads)
      .values({
        ...data,
        isPrivatePay: true,
        status: "qualified",
        score: scoreResult.score,
        scoreFactors: scoreResult.factors,
        maxMatches: 1, // All leads are exclusive
      })
      .returning();

    // ── Geo-match to agencies (admin-approved, Priority Pass first) ──
    const allAgencies = await db
      .select({
        id: agencies.id,
        name: agencies.name,
        email: users.email,
        serviceAreaZips: agencies.serviceAreaZips,
        specialties: agencies.specialties,
        maxLeadsPerMonth: agencies.maxLeadsPerMonth,
        currentCapacity: agencies.currentCapacity,
        adminApproved: agencies.adminApproved,
        priorityPassExpiresAt: agencies.priorityPassExpiresAt,
      })
      .from(agencies)
      .innerJoin(users, eq(users.id, agencies.userId))
      .where(eq(agencies.onboardingStatus, "complete"));

    const matches = matchLeadToAgencies(
      data.zip,
      data.careType,
      allAgencies.map((a) => ({
        ...a,
        email: a.email,
        serviceAreaZips: (a.serviceAreaZips as string[]) || [],
        specialties: (a.specialties as string[]) || [],
        maxLeadsPerMonth: a.maxLeadsPerMonth ?? 50,
        currentCapacity: a.currentCapacity ?? 0,
        adminApproved: a.adminApproved,
        priorityPassExpiresAt: a.priorityPassExpiresAt,
      })),
      1 // Exclusive: 1 agency per lead
    );

    if (matches.length > 0) {
      await db.insert(leadMatches).values(
        matches.map((m) => ({
          leadId: lead.id,
          agencyId: m.agencyId,
          matchScore: m.matchScore,
          isExclusive: true,
          status: "delivered" as const,
          deliveredAt: new Date(),
        }))
      );

      await db
        .update(leads)
        .set({
          status: "delivered",
          matchCount: matches.length,
          updatedAt: new Date(),
        })
        .where(eq(leads.id, lead.id));

      for (const match of matches) {
        await db
          .update(agencies)
          .set({
            currentCapacity: sql`${agencies.currentCapacity} + 1`,
            updatedAt: new Date(),
          })
          .where(eq(agencies.id, match.agencyId));
      }

      // Send email notifications (non-blocking)
      const emailPromises = matches.map((m) =>
        sendLeadNotificationEmail(m.agencyEmail, m.agencyName, {
          firstName: data.firstName,
          lastName: data.lastName,
          careType: data.careType,
          zip: data.zip,
          city: data.city,
          state: data.state,
          urgency: data.urgency,
          hoursPerWeek: data.hoursPerWeek,
          score: scoreResult.score,
        }).catch((err) => {
          console.error(`Failed to email agency ${m.agencyId}:`, err);
        })
      );

      Promise.all(emailPromises);
    }

    return NextResponse.json(
      {
        message:
          "Thank you! Your care request has been received. Qualified agencies in your area will reach out shortly.",
        qualified: true,
        leadId: lead.id,
        matchCount: matches.length,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Lead submission error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
