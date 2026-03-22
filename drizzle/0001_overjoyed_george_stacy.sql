CREATE TYPE "public"."billing_event_status" AS ENUM('pending', 'succeeded', 'failed', 'refunded');--> statement-breakpoint
CREATE TYPE "public"."billing_event_type" AS ENUM('lead_charge', 'exclusive_upgrade', 'refund');--> statement-breakpoint
ALTER TYPE "public"."lead_match_status" ADD VALUE 'accepted' BEFORE 'expired';--> statement-breakpoint
ALTER TYPE "public"."lead_match_status" ADD VALUE 'passed' BEFORE 'expired';--> statement-breakpoint
CREATE TABLE "billing_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"agency_id" uuid NOT NULL,
	"lead_id" uuid NOT NULL,
	"lead_match_id" uuid NOT NULL,
	"type" "billing_event_type" NOT NULL,
	"amount_cents" integer NOT NULL,
	"care_type" "care_type" NOT NULL,
	"is_exclusive" boolean DEFAULT false NOT NULL,
	"stripe_payment_intent_id" text,
	"status" "billing_event_status" DEFAULT 'pending' NOT NULL,
	"failure_reason" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "lead_matches" ADD COLUMN "is_exclusive" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "lead_matches" ADD COLUMN "accepted_at" timestamp;--> statement-breakpoint
ALTER TABLE "lead_matches" ADD COLUMN "passed_at" timestamp;--> statement-breakpoint
ALTER TABLE "billing_events" ADD CONSTRAINT "billing_events_agency_id_agencies_id_fk" FOREIGN KEY ("agency_id") REFERENCES "public"."agencies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "billing_events" ADD CONSTRAINT "billing_events_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "billing_events" ADD CONSTRAINT "billing_events_lead_match_id_lead_matches_id_fk" FOREIGN KEY ("lead_match_id") REFERENCES "public"."lead_matches"("id") ON DELETE no action ON UPDATE no action;