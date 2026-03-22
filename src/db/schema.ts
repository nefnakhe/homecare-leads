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

export const userRoleEnum = pgEnum("user_role", ["user", "admin"]);

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
  role: userRoleEnum("role").default("user").notNull(),
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

  // Admin approval (license, service area verification)
  adminApproved: boolean("admin_approved").default(false).notNull(),

  // Stripe
  stripeCustomerId: text("stripe_customer_id"),

  // Priority Pass ($197 for 3 months — leads delivered before free agencies)
  priorityPassPurchasedAt: timestamp("priority_pass_purchased_at"),
  priorityPassExpiresAt: timestamp("priority_pass_expires_at"),

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
  "accepted",
  "passed",
  "expired",
]);

export const billingEventTypeEnum = pgEnum("billing_event_type", [
  "lead_charge",
  "onboarding_fee",
  "priority_pass",
  "refund",
]);

export const billingEventStatusEnum = pgEnum("billing_event_status", [
  "pending",
  "succeeded",
  "failed",
  "refunded",
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
  maxMatches: integer("max_matches").default(1).notNull(),

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
  isExclusive: boolean("is_exclusive").default(true).notNull(),
  deliveredAt: timestamp("delivered_at"),
  viewedAt: timestamp("viewed_at"),
  contactedAt: timestamp("contacted_at"),
  acceptedAt: timestamp("accepted_at"),
  passedAt: timestamp("passed_at"),
  // Admin confirmation (triggers billing)
  adminConfirmed: boolean("admin_confirmed").default(false).notNull(),
  adminConfirmedAt: timestamp("admin_confirmed_at"),
  adminConfirmedByUserId: uuid("admin_confirmed_by_user_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ── Billing Events (audit trail) ─────────────────────────────────────
export const billingEvents = pgTable("billing_events", {
  id: uuid("id").defaultRandom().primaryKey(),
  agencyId: uuid("agency_id")
    .notNull()
    .references(() => agencies.id),
  leadId: uuid("lead_id").references(() => leads.id),
  leadMatchId: uuid("lead_match_id").references(() => leadMatches.id),
  type: billingEventTypeEnum("type").notNull(),
  amountCents: integer("amount_cents").notNull(),
  careType: careTypeEnum("care_type"),
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  status: billingEventStatusEnum("status").default("pending").notNull(),
  failureReason: text("failure_reason"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ── Disputes ────────────────────────────────────────────────────────
export const disputeReasonEnum = pgEnum("dispute_reason", [
  "invalid_contact",
  "not_private_pay",
  "wrong_location",
  "duplicate_lead",
  "not_seeking_care",
  "other",
]);

export const disputeStatusEnum = pgEnum("dispute_status", [
  "open",
  "under_review",
  "approved",
  "denied",
]);

export const disputes = pgTable("disputes", {
  id: uuid("id").defaultRandom().primaryKey(),
  agencyId: uuid("agency_id")
    .notNull()
    .references(() => agencies.id),
  leadId: uuid("lead_id")
    .notNull()
    .references(() => leads.id),
  leadMatchId: uuid("lead_match_id")
    .notNull()
    .references(() => leadMatches.id),
  billingEventId: uuid("billing_event_id")
    .notNull()
    .references(() => billingEvents.id),
  reason: disputeReasonEnum("reason").notNull(),
  description: text("description").notNull(),
  status: disputeStatusEnum("status").default("open").notNull(),
  amountCents: integer("amount_cents").notNull(),
  adminNote: text("admin_note"),
  resolvedAt: timestamp("resolved_at"),
  resolvedByUserId: uuid("resolved_by_user_id"),
  refundBillingEventId: uuid("refund_billing_event_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
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
