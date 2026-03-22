-- Phase 6: Pricing model update
-- Remove subscription tiers, add Priority Pass + per-lead billing ($300 + $2,000)

-- Add new billing event types
ALTER TYPE "billing_event_type" ADD VALUE IF NOT EXISTS 'onboarding_fee';
ALTER TYPE "billing_event_type" ADD VALUE IF NOT EXISTS 'priority_pass';

-- Add Priority Pass and admin approval fields to agencies
ALTER TABLE "agencies" ADD COLUMN IF NOT EXISTS "admin_approved" boolean NOT NULL DEFAULT false;
ALTER TABLE "agencies" ADD COLUMN IF NOT EXISTS "priority_pass_purchased_at" timestamp;
ALTER TABLE "agencies" ADD COLUMN IF NOT EXISTS "priority_pass_expires_at" timestamp;

-- Remove subscription fields from agencies
ALTER TABLE "agencies" DROP COLUMN IF EXISTS "stripe_subscription_id";
ALTER TABLE "agencies" DROP COLUMN IF EXISTS "subscription_status";
ALTER TABLE "agencies" DROP COLUMN IF EXISTS "subscription_price_id";

-- Add admin confirmation fields to lead_matches
ALTER TABLE "lead_matches" ADD COLUMN IF NOT EXISTS "admin_confirmed" boolean NOT NULL DEFAULT false;
ALTER TABLE "lead_matches" ADD COLUMN IF NOT EXISTS "admin_confirmed_at" timestamp;
ALTER TABLE "lead_matches" ADD COLUMN IF NOT EXISTS "admin_confirmed_by_user_id" uuid;

-- Change lead_matches.is_exclusive default to true (all leads exclusive now)
ALTER TABLE "lead_matches" ALTER COLUMN "is_exclusive" SET DEFAULT true;

-- Change leads.max_matches default to 1 (exclusive, 1 agency per lead)
ALTER TABLE "leads" ALTER COLUMN "max_matches" SET DEFAULT 1;

-- Make billing_events.lead_id and lead_match_id nullable (for priority_pass events)
ALTER TABLE "billing_events" ALTER COLUMN "lead_id" DROP NOT NULL;
ALTER TABLE "billing_events" ALTER COLUMN "lead_match_id" DROP NOT NULL;
ALTER TABLE "billing_events" ALTER COLUMN "care_type" DROP NOT NULL;

-- Remove is_exclusive from billing_events
ALTER TABLE "billing_events" DROP COLUMN IF EXISTS "is_exclusive";
