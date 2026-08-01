-- Migration: Enable RLS and Create Performance Indexes
-- Description: Enables Row Level Security on profiles, quotes, and quote_items; adds RLS policies and performance B-tree indexes.

-- ==========================================
-- 1. Performance & Foreign Key B-Tree Indexes
-- ==========================================
CREATE INDEX IF NOT EXISTS "idx_quote_items_quote_id" ON "public"."quote_items" ("quote_id");
CREATE INDEX IF NOT EXISTS "idx_quotes_clerk_user_id" ON "public"."quotes" ("clerk_user_id");

-- ==========================================
-- 2. Enable Row Level Security (RLS)
-- ==========================================
ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."quotes" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."quote_items" ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- 3. RLS Policies for Profiles
-- ==========================================
CREATE POLICY "Allow public read access to profiles"
  ON "public"."profiles"
  FOR SELECT
  TO public
  USING (true);

-- ==========================================
-- 4. RLS Policies for Quotes
-- ==========================================
CREATE POLICY "Allow anonymous and authenticated quote creation"
  ON "public"."quotes"
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow quote lookup by reference or token"
  ON "public"."quotes"
  FOR SELECT
  TO public
  USING (true);

-- ==========================================
-- 5. RLS Policies for Quote Items
-- ==========================================
CREATE POLICY "Allow anonymous and authenticated quote item creation"
  ON "public"."quote_items"
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow quote item lookup"
  ON "public"."quote_items"
  FOR SELECT
  TO public
  USING (true);
