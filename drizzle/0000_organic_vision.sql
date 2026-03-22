CREATE TYPE "public"."care_type" AS ENUM('personal_care', 'companion_care', 'skilled_nursing', 'dementia_care', 'respite_care', 'live_in_care', 'post_surgery', 'hospice_support', 'other');--> statement-breakpoint
CREATE TYPE "public"."lead_match_status" AS ENUM('pending', 'delivered', 'viewed', 'contacted', 'expired');--> statement-breakpoint
CREATE TYPE "public"."lead_score" AS ENUM('hot', 'warm', 'cold');--> statement-breakpoint
CREATE TYPE "public"."lead_status" AS ENUM('new', 'qualified', 'disqualified', 'matched', 'delivered', 'expired');--> statement-breakpoint
CREATE TYPE "public"."onboarding_status" AS ENUM('pending', 'in_progress', 'complete');--> statement-breakpoint
CREATE TYPE "public"."payment_type" AS ENUM('private_pay', 'long_term_care_insurance', 'medicare', 'medicaid', 'va_benefits', 'other');--> statement-breakpoint
CREATE TYPE "public"."subscription_status" AS ENUM('trialing', 'active', 'past_due', 'canceled', 'incomplete');--> statement-breakpoint
CREATE TYPE "public"."urgency" AS ENUM('immediate', 'within_week', 'within_month', 'exploring');--> statement-breakpoint
CREATE TABLE "agencies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"phone" varchar(20),
	"website" varchar(500),
	"address" text,
	"city" varchar(100),
	"state" varchar(2),
	"zip" varchar(10),
	"service_area_zips" jsonb DEFAULT '[]'::jsonb,
	"service_radius_miles" integer DEFAULT 25,
	"specialties" jsonb DEFAULT '[]'::jsonb,
	"max_leads_per_month" integer DEFAULT 50,
	"current_capacity" integer DEFAULT 0,
	"onboarding_status" "onboarding_status" DEFAULT 'pending' NOT NULL,
	"stripe_customer_id" text,
	"stripe_subscription_id" text,
	"subscription_status" "subscription_status",
	"subscription_price_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "agencies_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "lead_matches" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"lead_id" uuid NOT NULL,
	"agency_id" uuid NOT NULL,
	"status" "lead_match_status" DEFAULT 'pending' NOT NULL,
	"match_score" real,
	"delivered_at" timestamp,
	"viewed_at" timestamp,
	"contacted_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "leads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"first_name" varchar(100) NOT NULL,
	"last_name" varchar(100) NOT NULL,
	"email" varchar(255) NOT NULL,
	"phone" varchar(20) NOT NULL,
	"relation_to_patient" varchar(100),
	"patient_first_name" varchar(100),
	"patient_age" integer,
	"care_type" "care_type" NOT NULL,
	"care_description" text,
	"zip" varchar(10) NOT NULL,
	"city" varchar(100),
	"state" varchar(2),
	"urgency" "urgency" NOT NULL,
	"payment_type" "payment_type" NOT NULL,
	"budget_min" integer,
	"budget_max" integer,
	"hours_per_week" integer,
	"status" "lead_status" DEFAULT 'new' NOT NULL,
	"score" "lead_score",
	"score_factors" jsonb,
	"is_private_pay" boolean DEFAULT false NOT NULL,
	"match_count" integer DEFAULT 0 NOT NULL,
	"max_matches" integer DEFAULT 3 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"session_token" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "sessions_session_token_unique" UNIQUE("session_token")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"password_hash" text NOT NULL,
	"name" varchar(255),
	"email_verified" boolean DEFAULT false NOT NULL,
	"email_verify_token" text,
	"email_verify_expires" timestamp,
	"password_reset_token" text,
	"password_reset_expires" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "agencies" ADD CONSTRAINT "agencies_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lead_matches" ADD CONSTRAINT "lead_matches_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lead_matches" ADD CONSTRAINT "lead_matches_agency_id_agencies_id_fk" FOREIGN KEY ("agency_id") REFERENCES "public"."agencies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;