-- Migration: Add Quote Financial Columns and Activity Logs Table
-- Description: Adds subtotal, vat_amount, shipping_cost, discount_total, grand_total, currency to quotes; adds unit_price, discount_percentage, total_price to quote_items; creates quote_activity_logs table with RLS policies and performance B-tree indexes.

-- ==========================================
-- 1. Add Financial Columns to quotes
-- ==========================================
ALTER TABLE "public"."quotes" ADD COLUMN IF NOT EXISTS "subtotal" integer NOT NULL DEFAULT 0;
ALTER TABLE "public"."quotes" ADD COLUMN IF NOT EXISTS "vat_amount" integer NOT NULL DEFAULT 0;
ALTER TABLE "public"."quotes" ADD COLUMN IF NOT EXISTS "shipping_cost" integer NOT NULL DEFAULT 0;
ALTER TABLE "public"."quotes" ADD COLUMN IF NOT EXISTS "discount_total" integer NOT NULL DEFAULT 0;
ALTER TABLE "public"."quotes" ADD COLUMN IF NOT EXISTS "grand_total" integer NOT NULL DEFAULT 0;
ALTER TABLE "public"."quotes" ADD COLUMN IF NOT EXISTS "currency" text NOT NULL DEFAULT 'NPR';

-- ==========================================
-- 2. Add Financial Columns to quote_items
-- ==========================================
ALTER TABLE "public"."quote_items" ADD COLUMN IF NOT EXISTS "unit_price" integer NOT NULL DEFAULT 0;
ALTER TABLE "public"."quote_items" ADD COLUMN IF NOT EXISTS "discount_percentage" integer NOT NULL DEFAULT 0;
ALTER TABLE "public"."quote_items" ADD COLUMN IF NOT EXISTS "total_price" integer NOT NULL DEFAULT 0;

-- ==========================================
-- 3. Create quote_activity_logs Table
-- ==========================================
CREATE TABLE IF NOT EXISTS "public"."quote_activity_logs" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "quote_id" uuid NOT NULL REFERENCES "public"."quotes"("id") ON DELETE CASCADE,
  "author_clerk_user_id" text NOT NULL,
  "author_name" text NOT NULL,
  "action_type" text NOT NULL,
  "message" text NOT NULL,
  "created_at" timestamp with time zone NOT NULL DEFAULT now()
);

-- Performance B-Tree Indexes
CREATE INDEX IF NOT EXISTS "idx_quote_activity_quote_id" ON "public"."quote_activity_logs" ("quote_id");
CREATE INDEX IF NOT EXISTS "idx_quote_activity_action_type" ON "public"."quote_activity_logs" ("action_type");

-- ==========================================
-- 4. Enable Row Level Security (RLS) & Policies
-- ==========================================
ALTER TABLE "public"."quote_activity_logs" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated quote activity log select"
  ON "public"."quote_activity_logs"
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated quote activity log insert"
  ON "public"."quote_activity_logs"
  FOR INSERT
  TO authenticated
  WITH CHECK (true);
