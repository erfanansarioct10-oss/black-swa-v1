# Implementation Spec 17: Phase 3A - Quote Database Schema & Server Actions

> **Spec ID:** 17-phase-3a-quote-database-schema-and-server-actions  
> **Target Branch / PR:** phase3A  
> **Status:** Complete  
> **Created Date:** 2026-08-01

---

## Executive Summary

Phase 3A establishes the foundational data architecture and backend execution layer for the **Quote System** of the Black Swan International platform. As part of our **Quote-First B2B business model**, customers construct customized quote requests for Medical Technology and Broadcast Computer Hardware. 

This specification details the creation of Drizzle ORM database schemas (`quotes` and `quote_items`), Zod validation schemas (`schemas/quote.ts`), type-safe Server Actions (`actions/quote.ts`), and database schema synchronization (`pnpm db:push`).

---

## 1. What We Are Going to Do

List of target files to create and modify:

| #   | Target File | Action Required |
| --- | --- | --- |
| 1   | [`db/schema.ts`](../../db/schema.ts) | **[MODIFY]** Define `quotes` and `quote_items` tables using Drizzle ORM pgTable syntax. |
| 2   | [`schemas/quote.ts`](../../schemas/quote.ts) | **[NEW]** Create Zod validation schemas for quote items, quote submission payloads, and tracking lookups. |
| 3   | [`actions/quote.ts`](../../actions/quote.ts) | **[NEW]** Implement `"use server"` Server Actions for quote creation, token lookup, and reference tracking. |
| 4   | [`types/quote.ts`](../../types/quote.ts) | **[NEW]** Export clean TypeScript interfaces and infer Zod types for backend and frontend sharing. |
| 5   | [`context/progress-tracker.md`](../progress-tracker.md) | **[MODIFY]** Update phase status and completion logs for Phase 3A. |

---

## 2. Why We Are Doing This

1. **Alignment with Quote-First B2B Architecture (`context/project-overview.md`):** Black Swan International operates on a B2B RFQ model instead of standard e-commerce checkout. A robust transactional schema for quotes and line items is required before building cart UI (Phase 3B) or email/Telegram notifications (Phase 3C).
2. **Type Safety & Data Integrity (`context/code-standards.md`):** Drizzle ORM schema acts as the single source of truth for the database. Zod schemas guarantee runtime validation for all inputs before database persistence.
3. **Security & Privacy (`context/architecture.md`):** Public quote tracking requires a secure, unguessable `lookupToken` (UUID) alongside a user-friendly `referenceId` (`RFQ-YYYYMMDD-XXXX`) to prevent enumeration attacks when users track quotes at `/quote/track`.

---

## 3. How We Are Going to Implement It

### Step 1: Drizzle ORM Schema (`db/schema.ts`)

Define two relational tables: `quotes` and `quote_items`.

```ts
import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const quotes = pgTable("quotes", {
  id: uuid("id").primaryKey().defaultRandom(),
  referenceId: text("reference_id").notNull().unique(), // e.g. RFQ-20260801-7A9B
  lookupToken: text("lookup_token").notNull().unique(), // Secure token for tracking URL
  clerkUserId: text("clerk_user_id"), // Optional: linked if submitted by authenticated user
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  companyName: text("company_name"),
  projectScope: text("project_scope"),
  budgetRange: text("budget_range"),
  timeline: text("timeline"),
  status: text("status").notNull().default("pending"), // pending | under_review | manager_assigned | quoted | completed | rejected
  assignedManagerId: text("assigned_manager_id"),
  adminNotes: text("admin_notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const quoteItems = pgTable("quote_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  quoteId: uuid("quote_id")
    .notNull()
    .references(() => quotes.id, { onDelete: "cascade" }),
  productId: text("product_id").notNull(),
  productTitle: text("product_title").notNull(),
  category: text("category").notNull(),
  quantity: integer("quantity").notNull().default(1),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});
```

### Step 2: Zod Schemas & TypeScript Types (`schemas/quote.ts` & `types/quote.ts`)

Define Zod validation rules:
- `quoteItemSchema`: Validates individual items added to cart (product ID, title, category, quantity >= 1, item-level notes).
- `createQuoteSchema`: Validates full RFQ form submission payload (contact info, optional company info, project specs, items array min 1).
- `quoteTrackingLookupSchema`: Validates search inputs (`referenceId` and `email`) for the tracking portal.

### Step 3: Server Actions (`actions/quote.ts`)

Implement `"use server"` exported actions:
1. `createQuoteAction(payload: CreateQuoteInput)`:
   - Validates input using `createQuoteSchema.parse()`.
   - Generates formatted human-readable `referenceId` (e.g. `RFQ-20260801-XXXX`).
   - Generates random `lookupToken` UUID.
   - Captures Clerk user ID using `auth()` from `@clerk/nextjs/server` if user is logged in.
   - Executes `db.transaction()` to insert the quote record and associated quote items atomically.
   - Returns `{ success: true, referenceId, lookupToken }` or `{ success: false, error }`.

2. `getQuoteByTrackingAction(referenceId: string, email: string)`:
   - Queries `quotes` table joined with `quoteItems` where `referenceId` matches and `email` matches (case-insensitive).
   - Returns quote details & equipment breakdown if verified.

3. `getQuoteByLookupTokenAction(lookupToken: string)`:
   - Queries `quotes` and `quoteItems` by `lookupToken` for direct link tracking.

### Step 4: Database Push (`pnpm db:push`)

Run `pnpm db:push` using `drizzle-kit` to synchronize schema definitions directly with the local Supabase PostgreSQL database on port `54322`.

---

## 4. Execution Timeline

```text
Step 1: Create types/quote.ts & schemas/quote.ts Zod schemas
    │
    ▼
Step 2: Update db/schema.ts with quotes & quote_items tables
    │
    ▼
Step 3: Run `pnpm db:push` to apply migration to Supabase PostgreSQL
    │
    ▼
Step 4: Create actions/quote.ts with Server Actions & transaction logic
    │
    ▼
Step 5: Verify build & linting (`pnpm run lint`, `pnpm run build`)
```

---

## 5. Required Data & Data Sources

| Data Requirement | Origin / Source | Usage |
| --- | --- | --- |
| `quotes` Schema | Drizzle ORM (`db/schema.ts`) | Main database table storing RFQ submissions |
| `quote_items` Schema | Drizzle ORM (`db/schema.ts`) | Line items table referencing `quotes.id` |
| User Identity | Clerk Auth (`@clerk/nextjs/server`) | Optional `clerkUserId` attachment |
| Local Database | Supabase PostgreSQL (`DATABASE_URL`) | Port `54322` local development DB |

---

## 6. What Could Possibly Go Wrong & Mitigation Plan

| Potential Risk | Root Cause | Prevention / Mitigation Strategy |
| --- | --- | --- |
| **Non-Atomic Persistence** | Failure during insertion of line items leaving orphaned quote headers. | Enforce Drizzle `db.transaction()` so quote header and items insert or fail together. |
| **Reference ID Collisions** | Concurrent quote submissions generating identical IDs. | Append random hex string suffix to timestamp-based `referenceId` and enforce database-level UNIQUE constraint. |
| **Database Sync Failure** | Local Supabase Docker container inactive during `pnpm db:push`. | Ensure local Supabase container is active on port `54322` before executing migration commands. |

---

## 7. Verification & Definition of Done

1. `db/schema.ts` updated with clean Drizzle table declarations.
2. `schemas/quote.ts` exported and fully typed.
3. `actions/quote.ts` implemented with Zod validation, Clerk integration, and Drizzle transactions.
4. `pnpm db:push` executed cleanly without SQL errors.
5. `pnpm run lint` and `pnpm run build` pass with zero TypeScript/ESLint errors.

---

## 8. Agent Workflow Integration

> [!IMPORTANT]
> **Mandatory User Permission Rule:** After drafting this implementation spec in `context/implementation-specs/` and updating `context/progress-tracker.md`, AI agents MUST **NOT** immediately start coding. Agents MUST present the plan to the user and obtain explicit permission before making any code changes.
