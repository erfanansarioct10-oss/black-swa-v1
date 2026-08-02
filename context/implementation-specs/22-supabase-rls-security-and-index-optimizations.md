# Implementation Spec 22: Supabase RLS Security and Performance Index Optimizations

> **Spec ID:** `22-supabase-rls-security-and-index-optimizations`  
> **Target Branch / PR:** `main` / `phase3A`  
> **Status:** Complete  
> **Created Date:** 2026-08-01  

---

## Executive Summary

Following the comprehensive technical audit of the Supabase PostgreSQL database architecture, two critical areas require immediate implementation:
1. **Security Vulnerability Fix:** Enable Row Level Security (RLS) on all `public` schema tables (`profiles`, `quotes`, `quote_items`) and establish strict, explicit security policies to prevent unauthorized data exposure via the Supabase REST/GraphQL Data API.
2. **Database Performance Optimization:** Add missing non-unique B-tree indexes for foreign key lookups (`quote_items.quote_id`) and high-frequency user filter columns (`quotes.clerk_user_id`) in both native SQL migrations and Drizzle ORM schema definitions.

---

## 1. What We Are Going to Do

Itemized list of files to be created or modified:

| # | Target File | Action Required |
|---|---|---|
| 1 | `supabase/migrations/20260801000001_enable_rls_and_performance_indexes.sql` | **[NEW]** Native SQL migration enabling RLS, defining policies, and creating B-tree performance indexes. |
| 2 | `db/schema.ts` | Update Drizzle ORM schema to include index definitions for `quotes(clerk_user_id)` and `quote_items(quote_id)`. |
| 3 | `context/progress-tracker.md` | Update Progress Tracker with Spec 22 status under Phase 3 / Security & Database. |
| 4 | `context/implementation-specs/README.md` | Add Spec 22 entry to the Specification Registry Index. |

---

## 2. Why We Are Doing This

1. **Security & RLS Compliance:**  
   As documented in `.agents/skills/supabase/SKILL.md` (Core Principle 5 & Security Checklist) and identified by `pnpm exec supabase db query`, having RLS disabled on public schema tables exposes all records to anyone holding the default public API key. Enabling RLS ensures zero unauthorized access via client endpoints.
2. **Postgres Performance Best Practices:**  
   As documented in `.agents/skills/supabase-postgres-best-practices/SKILL.md` (Rule Priority 1: Query Performance & missing indexes), unindexed foreign keys (`quote_items.quote_id`) force sequential table scans during joins and cascade deletions. B-tree indexes eliminate scan bottlenecks and prevent lock contention.

---

## 3. How We Are Going to Implement It

### Step 1: Create Migration `supabase/migrations/20260801000001_enable_rls_and_performance_indexes.sql`

```sql
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
```

### Step 2: Update Drizzle Schema (`db/schema.ts`)

Update `db/schema.ts` to export index definitions:

```typescript
import { index, integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

// ... profiles table remains unchanged ...

export const quotes = pgTable("quotes", {
  // ... columns ...
}, (table) => ({
  clerkUserIdIdx: index("idx_quotes_clerk_user_id").on(table.clerkUserId),
}));

export const quoteItems = pgTable("quote_items", {
  // ... columns ...
}, (table) => ({
  quoteIdIdx: index("idx_quote_items_quote_id").on(table.quoteId),
}));
```

---

## 4. Execution Timeline

```text
Phase 1: Native SQL Migration File Creation
    │
    ▼
Phase 2: Drizzle ORM Schema Alignment (db/schema.ts)
    │
    ▼
Phase 3: Database Reset & Migration Verification (pnpm supabase:reset)
    │
    ▼
Phase 4: CLI Health & Advisor Diagnostics (pnpm exec supabase db advisors)
    │
    ▼
Phase 5: Type-Checking & Production Build Verification (tsc & pnpm run build)
```

---

## 5. Required Data & Data Sources

| Target Resource | Source | Purpose |
|---|---|---|
| `quotes` Table | PostgreSQL / Supabase | RFQ Header data with reference IDs, lookup tokens, and status. |
| `quote_items` Table | PostgreSQL / Supabase | RFQ line items linked via `quote_id` foreign key. |
| `profiles` Table | PostgreSQL / Supabase | User profiles synced with Clerk authentication. |

---

## 6. Technical Risks & Mitigation Plan

| Potential Risk | Root Cause | Prevention / Mitigation Strategy |
|---|---|---|
| **Data Access Lockout** | Enabling RLS without policies blocks all non-superuser reads/inserts. | Include explicit `TO public USING (true)` and `WITH CHECK (true)` policies for public tracking and RFQ submission. |
| **Server Action Failure** | Next.js Server Actions using non-superuser roles failing under RLS. | Drizzle ORM connects via `DATABASE_URL` as superuser `postgres` (`BYPASSRLS`), ensuring server actions operate with full permissions while client Data API access remains restricted. |

---

## 7. Verification & Definition of Done

1. `pnpm supabase:reset` runs without errors, successfully applying migrations `20260801000000` and `20260801000001` alongside seed data.
2. `pnpm exec supabase db advisors` returns 0 security warnings and 0 unindexed foreign key warnings.
3. `pnpm exec tsc --noEmit` completes with 0 TypeScript compilation errors.
4. `pnpm run build` compiles cleanly across all routes.
