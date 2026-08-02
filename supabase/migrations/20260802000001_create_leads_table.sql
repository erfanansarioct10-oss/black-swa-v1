-- Migration: Create Leads Table, Indexes & RLS Policies
-- Description: Creates the leads table for lead management and inbound pipeline, configures B-Tree indexes, and enables Row Level Security (RLS).

CREATE TABLE IF NOT EXISTS "public"."leads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"contact_name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"company_name" text,
	"lead_source" text DEFAULT 'website_rfq' NOT NULL,
	"status" text DEFAULT 'new' NOT NULL,
	"priority" text DEFAULT 'medium' NOT NULL,
	"estimated_value" integer DEFAULT 0,
	"assigned_manager_id" text,
	"notes" text,
	"customer_id" uuid REFERENCES "public"."customers"("id") ON DELETE SET NULL,
	"quote_id" uuid REFERENCES "public"."quotes"("id") ON DELETE SET NULL,
	"inquiry_id" uuid REFERENCES "public"."contact_inquiries"("id") ON DELETE SET NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

-- B-Tree Performance Indexes
CREATE INDEX IF NOT EXISTS "idx_leads_email" ON "public"."leads" (lower("email"));
CREATE INDEX IF NOT EXISTS "idx_leads_status" ON "public"."leads" ("status");
CREATE INDEX IF NOT EXISTS "idx_leads_priority" ON "public"."leads" ("priority");
CREATE INDEX IF NOT EXISTS "idx_leads_source" ON "public"."leads" ("lead_source");
CREATE INDEX IF NOT EXISTS "idx_leads_customer_id" ON "public"."leads" ("customer_id");

-- Enable Row Level Security (RLS)
ALTER TABLE "public"."leads" ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Allow authenticated administrative access to leads
CREATE POLICY "Allow authenticated read and write access to leads"
  ON "public"."leads"
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
