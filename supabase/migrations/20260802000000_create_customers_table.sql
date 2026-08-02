-- Migration: Create Customers & Accounts Table and RLS Policies
-- Description: Creates customers table with performance indexes, enables RLS, adds FK on quotes table, and configures access policies.

CREATE TABLE IF NOT EXISTS "public"."customers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_name" text NOT NULL,
	"organization_type" text DEFAULT 'enterprise' NOT NULL,
	"primary_contact_name" text NOT NULL,
	"primary_contact_email" text NOT NULL,
	"primary_contact_phone" text,
	"address" text,
	"city" text,
	"state" text,
	"postal_code" text,
	"country" text DEFAULT 'Nepal',
	"tax_registration_id" text,
	"lead_source" text DEFAULT 'website_rfq',
	"status" text DEFAULT 'lead' NOT NULL,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

-- Add optional customer_id foreign key to quotes table if not present
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'quotes' 
        AND column_name = 'customer_id'
    ) THEN
        ALTER TABLE "public"."quotes" ADD COLUMN "customer_id" uuid REFERENCES "public"."customers"("id") ON DELETE SET NULL;
    END IF;
END $$;

-- B-Tree Performance Indexes
CREATE INDEX IF NOT EXISTS "idx_customers_email" ON "public"."customers" (lower("primary_contact_email"));
CREATE INDEX IF NOT EXISTS "idx_customers_org_name" ON "public"."customers" (lower("organization_name"));
CREATE INDEX IF NOT EXISTS "idx_customers_status" ON "public"."customers" ("status");
CREATE INDEX IF NOT EXISTS "idx_customers_org_type" ON "public"."customers" ("organization_type");
CREATE INDEX IF NOT EXISTS "idx_quotes_customer_id" ON "public"."quotes" ("customer_id");

-- Enable Row Level Security (RLS)
ALTER TABLE "public"."customers" ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Allow authenticated administrative access to customers
CREATE POLICY "Allow authenticated read and write access to customers"
  ON "public"."customers"
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
