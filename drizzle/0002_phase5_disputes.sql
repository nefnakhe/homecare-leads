-- Phase 5: Admin + Disputes
-- Add user role, dispute enums, and disputes table

-- User role enum
DO $$ BEGIN
  CREATE TYPE "user_role" AS ENUM ('user', 'admin');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "role" "user_role" DEFAULT 'user' NOT NULL;

-- Dispute enums
DO $$ BEGIN
  CREATE TYPE "dispute_reason" AS ENUM (
    'invalid_contact',
    'not_private_pay',
    'wrong_location',
    'duplicate_lead',
    'not_seeking_care',
    'other'
  );
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "dispute_status" AS ENUM (
    'open',
    'under_review',
    'approved',
    'denied'
  );
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- Disputes table
CREATE TABLE IF NOT EXISTS "disputes" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "agency_id" uuid NOT NULL REFERENCES "agencies"("id"),
  "lead_id" uuid NOT NULL REFERENCES "leads"("id"),
  "lead_match_id" uuid NOT NULL REFERENCES "lead_matches"("id"),
  "billing_event_id" uuid NOT NULL REFERENCES "billing_events"("id"),
  "reason" "dispute_reason" NOT NULL,
  "description" text NOT NULL,
  "status" "dispute_status" DEFAULT 'open' NOT NULL,
  "amount_cents" integer NOT NULL,
  "admin_note" text,
  "resolved_at" timestamp,
  "resolved_by_user_id" uuid,
  "refund_billing_event_id" uuid,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);
