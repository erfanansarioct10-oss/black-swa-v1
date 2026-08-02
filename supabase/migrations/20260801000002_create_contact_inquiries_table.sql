-- Migration: Create Contact & Service Inquiries Table and RLS
-- Description: Creates contact_inquiries table with email and status indexes, enables RLS, and adds insert policy.

CREATE TABLE IF NOT EXISTS "public"."contact_inquiries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"full_name" text NOT NULL,
	"company_name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"service_slug" text,
	"message" text NOT NULL,
	"status" text DEFAULT 'new' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

-- B-Tree Performance Indexes
CREATE INDEX IF NOT EXISTS "idx_contact_inquiries_email" ON "public"."contact_inquiries" ("email");
CREATE INDEX IF NOT EXISTS "idx_contact_inquiries_status" ON "public"."contact_inquiries" ("status");

-- Enable Row Level Security (RLS)
ALTER TABLE "public"."contact_inquiries" ENABLE ROW LEVEL SECURITY;

-- Allow public & authenticated users to submit contact inquiries
CREATE POLICY "Allow public insert to contact_inquiries"
  ON "public"."contact_inquiries"
  FOR INSERT
  TO public
  WITH CHECK (true);
