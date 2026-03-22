import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  uuid,
  varchar,
  jsonb,
  pgEnum,
  real,
} from "drizzle-orm/pg-core";

export const subscriptionStatusEnum = pgEnum("subscription_status", [
  "trialing",
  "active",
  "past_due",
  "canceled",
  "incomplete",
]);

export const onboardingStatusEnum = pgEnum("onboarding_status", [
  "pending",
  "in_progress",
  "complete",
]);

// ── Users ────────────────────────────────────────────────────────────
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: varchar("name", { length: 255 }),
  emailVerified: boolean("email_verified").default(false).notNull(),
  emailVerifyToken: text("email_verify_token"),
  emailVerifyExpires: timestamp("email_verify_expires"),
  passwordResetToken: text("password_reset_token"),
  passwordResetExpires: timestamp("password_reset_expires"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ── Agencies ─────────────────────────────────────────────────────────
export const agencies = pgTable("agencies", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id)
    .unique(),
  name: varchar("name", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  website: varchar("website", { length: 500 }),
  address: text("address"),
  city: varchar("city", { length: 100 }),
  state: varchar("state", { length: 2 }),
  zip: varchar("zip", { length: 10 }),

  // Service area — stored as JSON array of zip codes or radius
  serviceAreaZips: jsonb("service_area_zips").$type<string[]>().default([]),
  serviceRadiusMiles: integer("service_radius_miles").default(25),

  // Specialties
  specialties: jsonb("specialties")
    .$type<string[]>()
    .default([]),

  // Capacity
  maxLeadsPerMonth: integer("max_leads_per_month").default(50),
  currentCapacity: integer("current_capacity").default(0),

  // Onboarding
  onboardingStatus: onboardingStatusEnum("onboarding_status")
    .default("pending")
    .notNull(),

  // Stripe
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  subscriptionStatus: subscriptionStatusEnum("subscription_status"),
  subscriptionPriceId: text("subscription_price_id"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ── Lead Pipeline Enums ──────────────────────────────────────────────
export const leadStatusEnum = pgEnum("lead_status", [
  "new",
  "qualified",
  "disqualified",
  "matched",
  "delivered",
  "expired",
]);

export const leadScoreEnum = pgEnum("lead_score", ["hot", "warm", "cold"]);

export const leadMatchStatusEnum = pgEnum("lead_match_status", [
  "pending",
  "delivered",
  "viewed",
  "contacted",
  "expired",
]);

export const careTypeEnum = pgEnum("care_type", [
  "personal_care",
  "companion_care",
  "skilled_nursing",
  "dementia_care",
  "respite_care",
  "live_in_care",
  "post_surgery",
  "hospice_support",
  "other",
]);

export const urgencyEnum = pgEnum("urgency", [
  "immediate",
  "within_week",
  "within_month",
  "exploring",
]);

export const paymentTypeEnum = pgEnum("payment_type", [
  "private_pay",
  "long_term_care_insurance",
  "medicare",
  "medicaid",
  "va_benefits",
  "other",
]);

// ── Leads ────────────────────────────────────────────────────────────
export const leads = pgTable("leads", {
  id: uuid("id").defaultRandom().primaryKey(),

  // Family / requester info
  firstName: varchar("first_name", { length: 100 }).notNull(),
  lastName: varchar("last_name", { length: 100 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  relationToPatient: varchar("relation_to_patient", { length: 100 }),

  // Care recipient
  patientFirstName: varchar("patient_first_name", { length: 100 }),
  patientAge: integer("patient_age"),
  careType: careTypeEnum("care_type").notNull(),
  careDescription: text("care_description"),

  // Location
  zip: varchar("zip", { length: 10 }).notNull(),
  city: varchar("city", { length: 100 }),
  state: varchar("state", { length: 2 }),

  // Urgency & budget
  urgency: urgencyEnum("urgency").notNull(),
  paymentType: paymentTypeEnum("payment_type").notNull(),
  budgetMin: integer("budget_min"),
  budgetMax: integer("budget_max"),
  hoursPerWeek: integer("hours_per_week"),

  // Pipeline fields
  status: leadStatusEnum("status").default("new").notNull(),
  score: leadScoreEnum("score"),
  scoreFactors: jsonb("score_factors").$type<Record<string, number>>(),
  isPrivatePay: boolean("is_private_pay").default(false).notNull(),
  matchCount: integer("match_count").default(0).notNull(),
  maxMatches: integer("max_matches").default(3).notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ── Lead Matches (lead ↔ agency assignments) ─────────────────────────
export const leadMatches = pgTable("lead_matches", {
  id: uuid("id").defaultRandom().primaryKey(),
  leadId: uuid("lead_id")
    .notNull()
    .references(() => leads.id),
  agencyId: uuid("agency_id")
    .notNull()
    .references(() => agencies.id),
  status: leadMatchStatusEnum("status").default("pending").notNull(),
  matchScore: real("match_score"), // 0-100 geo/specialty match quality
  deliveredAt: timestamp("delivered_at"),
  viewedAt: timestamp("viewed_at"),
  contactedAt: timestamp("contacted_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ── Sessions (for NextAuth) ──────────────────────────────────────────
export const sessions = pgTable("sessions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
  sessionToken: text("session_token").notNull().unique(),
  expires: timestamp("expires").notNull(),
});
