# Implementation Spec 38: Phase 5D Automated Proposal Generation & Customer Dispatch

> **Spec ID:** 38-phase-5d-automated-proposal-generation-and-customer-dispatch  
> **Target Branch / PR:** `main`  
> **Status:** Draft  
> **Created Date:** 2026-08-03  

---

## Executive Summary

Phase 5D builds the **Automated Proposal Generation & Customer Dispatch System** for the Black Swan International platform under `/admin/quotes/[id]` and related Server Actions. 

This phase equips managing directors and sales engineers with:
1. **Branded Printable & PDF Proposal Generator:** Official corporate letterhead formatting with itemized hardware breakdowns, unit pricing, 13% Nepalese VAT tax calculations, shipping estimates, payment terms, validity period tracking (default 30 days), custom technical notes, and print-media CSS isolation (`@media print`).
2. **One-Click Proposal Email Dispatch:** Automated Resend API email integration utilizing Next.js `after()` non-blocking background execution, dispatching responsive HTML emails with direct tracking links and itemized summaries to clients.
3. **Proposal Versioning & Expiration Tracking:** Database persistence of immutable proposal revisions (`proposal_versions` table), tracking version numbers, validity expiration timestamps (`expires_at`), dispatched-by audit records, customer view receipt tracking (`viewed_at`, `view_count`, `last_viewed_at`), and status updates.
4. **Enterprise Security & Data Integrity:** Strict Clerk role authorization (`requireAdminAuth`), Zod payload validation (`schemas/proposal.ts`), and Supabase PostgreSQL Row-Level Security (RLS) policies.

---

## 1. What We Are Going to Do

| #   | Target File                                                                                           | Action Required                                                                                                                     |
| --- | ----------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| 1   | `db/schema.ts`                                                                                        | **[MODIFY]** Define `proposalVersions` table schema with version numbers, validity days, expiration timestamps, and view tracking. |
| 2   | `supabase/migrations/20260804000000_create_proposal_versions_table.sql`                             | **[NEW]** SQL migration script creating `proposal_versions` table, foreign keys, indexes, and Supabase RLS policies.              |
| 3   | `schemas/proposal.ts`                                                                                 | **[NEW]** Zod validation schemas for creating proposal versions, dispatching emails, and recording view receipts.                 |
| 4   | `actions/proposal.ts`                                                                                | **[NEW]** Server Actions for proposal versioning, Resend email dispatch with Next.js `after()`, and customer view tracking.          |
| 5   | `lib/email.ts`                                                                                        | **[MODIFY]** Enhance proposal email HTML generator with versioning details, validity warnings, and branded layout.                 |
| 6   | `components/admin/quotes/quote-proposal-preview.tsx`                                                 | **[MODIFY]** Update preview with version history drawer, expiration status badge, custom technical notes, and print isolation.    |
| 7   | `components/admin/quotes/proposal-version-history.tsx`                                               | **[NEW]** Component displaying past proposal revisions, dispatch timestamps, view counts, and total comparisons.                  |
| 8   | `app/quote/track/[referenceId]/page.tsx`                                                              | **[MODIFY]** Trigger `recordProposalViewAction` upon customer view to log receipt and increment view count.                        |
| 9   | `context/implementation-specs/README.md`                                                             | **[MODIFY]** Register spec 38 in Specification Registry Index.                                                                      |
| 10  | `context/progress-tracker.md`                                                                         | **[MODIFY]** Update current phase to Phase 5D and mark spec 38 as In Progress.                                                     |

---

## 2. Why We Are Doing This

1. **Enterprise B2B Workflow Automation:** B2B medical and broadcast hardware procurements require official, version-controlled quotation documents. Manual PDF creation is error-prone; automated generation enforces standard pricing, Nepalese VAT compliance, and corporate branding.
2. **Real-Time Customer Engagement Visibility:** Sales directors need visibility into whether a customer has opened and viewed an issued proposal (`viewed_at`, `view_count`, `last_viewed_at`) to optimize follow-ups and CRM lead conversion.
3. **Audit Trail & Immutable Revisions:** Quotation revisions frequently occur during contract negotiation. Maintaining a `proposal_versions` audit log ensures past quotes cannot be disputed or overwritten.
4. **Architectural Compliance:** Adheres to Next.js 16 Server Actions, Clerk RBAC (`requireAdminAuth`), Drizzle ORM transactions, and non-blocking background dispatch via Next.js `after()`.

---

## 3. How We Are Going to Implement It

### Step 1: Database Schema & Migrations

In `db/schema.ts`:
```typescript
export const proposalVersions = pgTable("proposal_versions", {
  id: uuid("id").primaryKey().defaultRandom(),
  quoteId: uuid("quote_id")
    .notNull()
    .references(() => quotes.id, { onDelete: "cascade" }),
  versionNumber: integer("version_number").notNull().default(1),
  subtotal: integer("subtotal").notNull().default(0),
  vatAmount: integer("vat_amount").notNull().default(0),
  shippingCost: integer("shipping_cost").notNull().default(0),
  discountTotal: integer("discount_total").notNull().default(0),
  grandTotal: integer("grand_total").notNull().default(0),
  currency: text("currency").notNull().default("NPR"),
  validityDays: integer("validity_days").notNull().default(30),
  expiresAt: timestamp("expires_at", { withTimezone: true }),
  customMessage: text("custom_message"),
  termsAndConditions: text("terms_and_conditions"),
  dispatchedAt: timestamp("dispatched_at", { withTimezone: true }),
  dispatchedByClerkUserId: text("dispatched_by_clerk_user_id"),
  viewedAt: timestamp("viewed_at", { withTimezone: true }),
  viewCount: integer("view_count").notNull().default(0),
  lastViewedAt: timestamp("last_viewed_at", { withTimezone: true }),
  snapshotData: text("snapshot_data"), // JSON stringified line items snapshot
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("idx_proposal_versions_quote_id").on(table.quoteId),
  index("idx_proposal_versions_version").on(table.quoteId, table.versionNumber),
]);
```

SQL Migration (`supabase/migrations/20260804000000_create_proposal_versions_table.sql`):
```sql
CREATE TABLE IF NOT EXISTS proposal_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id UUID NOT NULL REFERENCES quotes(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL DEFAULT 1,
  subtotal INTEGER NOT NULL DEFAULT 0,
  vat_amount INTEGER NOT NULL DEFAULT 0,
  shipping_cost INTEGER NOT NULL DEFAULT 0,
  discount_total INTEGER NOT NULL DEFAULT 0,
  grand_total INTEGER NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'NPR',
  validity_days INTEGER NOT NULL DEFAULT 30,
  expires_at TIMESTAMPTZ,
  custom_message TEXT,
  terms_and_conditions TEXT,
  dispatched_at TIMESTAMPTZ,
  dispatched_by_clerk_user_id TEXT,
  viewed_at TIMESTAMPTZ,
  view_count INTEGER NOT NULL DEFAULT 0,
  last_viewed_at TIMESTAMPTZ,
  snapshot_data TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE proposal_versions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for authenticated users" ON proposal_versions
  FOR SELECT TO authenticated USING (true);
```

### Step 2: Zod Validation Schemas (`schemas/proposal.ts`)

```typescript
import { z } from "zod";

export const createProposalVersionSchema = z.object({
  quoteId: z.string().uuid("Invalid quotation ID"),
  validityDays: z.number().int().min(1).max(180).default(30),
  customMessage: z.string().trim().max(2000).optional(),
  termsAndConditions: z.string().trim().max(5000).optional(),
});

export const dispatchProposalEmailSchema = z.object({
  quoteId: z.string().uuid("Invalid quotation ID"),
  proposalVersionId: z.string().uuid("Invalid proposal version ID").optional(),
  customMessage: z.string().trim().max(2000).optional(),
});

export const trackProposalViewSchema = z.object({
  referenceId: z.string().trim().min(1),
  lookupToken: z.string().trim().optional(),
});

export type CreateProposalVersionSchemaType = z.infer<typeof createProposalVersionSchema>;
export type DispatchProposalEmailSchemaType = z.infer<typeof dispatchProposalEmailSchema>;
export type TrackProposalViewSchemaType = z.infer<typeof trackProposalViewSchema>;
```

### Step 3: Server Actions (`actions/proposal.ts`)

1. `createProposalVersionAction`: Calculates expiration timestamp (`now + validityDays`), snapshots current financial line items, increments version number, inserts into `proposal_versions`, updates quote status to `quoted`, and appends an audit log entry.
2. `dispatchProposalEmailAction`: Validates admin authorization via `requireAdminAuth()`, retrieves the latest proposal version, dispatches branded HTML email using Resend, logs dispatch timestamp, and queues background activity via `after()`.
3. `recordProposalViewAction`: Called when a customer opens `/quote/track/[referenceId]`. Increments `view_count`, sets `viewed_at` (if null) and updates `last_viewed_at` on the latest proposal version.

### Step 4: UI Components & PDF Print Isolation

1. **`components/admin/quotes/quote-proposal-preview.tsx`**:
   - Add Expiration Banner (showing validity period, days remaining, or expired status).
   - Integrate Version History Drawer (`components/admin/quotes/proposal-version-history.tsx`).
   - Add Dispatch Button with modal for custom email text and validity selection.
   - Enforce print-media stylesheet isolation (`@media print`) so action toolbars, sidebars, and navigation headers are strictly hidden when saving as PDF or printing.

---

## 4. When We Are Going to Do It

```text
Phase 1: Database Schema & Migration Setup
    │
    ▼
Phase 2: Zod Schemas & Server Actions (`actions/proposal.ts`)
    │
    ▼
Phase 3: Resend Email Template Enhancement (`lib/email.ts`)
    │
    ▼
Phase 4: Branded PDF UI & Version History Components
    │
    ▼
Phase 5: Public Tracking Receipt Integration (`/quote/track/[referenceId]`)
    │
    ▼
Phase 6: Verification, Typechecking & Build Validation
```

---

## 5. Required Data & Data Sources

| Data Requirement          | Origin / Source                                      | Usage                                                              |
| ------------------------- | ---------------------------------------------------- | ------------------------------------------------------------------ |
| Quotation & Line Items    | `quotes` and `quote_items` Drizzle tables            | Populates official letterhead, item breakdown, and subtotal/VAT.    |
| Proposal Versions         | `proposal_versions` table                            | Displays revision history, expiration status, and view analytics.  |
| Admin Session & Identity | `requireAdminAuth()` (Clerk)                         | Enforces security and records `dispatched_by_clerk_user_id`.       |
| Email Dispatch Service    | Resend API (`lib/email.ts`)                         | Transmits branded proposal emails in background via `after()`.     |
| Customer View Receipt     | `/quote/track/[referenceId]` page mount              | Triggers `recordProposalViewAction` for view receipt tracking.     |

---

## 6. What Could Possibly Go Wrong & Mitigation Plan

| Potential Risk                        | Root Cause                                                                        | Prevention / Mitigation Strategy                                                                     |
| ------------------------------------- | --------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| **PDF Print Layout Overflow**          | Unconstrained tables or screen-only UI elements appearing in PDF print output.    | Wrap document in `#printable-proposal` with `print:m-0 print:p-0 print:border-none print:shadow-none` and apply `print:hidden` to all controls. |
| **Resend Rate Limit / Network Delays**| Synchronous email dispatch blocking user interaction or throwing unhandled errors.| Wrap email dispatch inside Next.js 16 `after()` execution block with error logging.                   |
| **Stale Proposal Expiration**         | Quotations remaining active past 30-day validity without warning.                | Compute `expiresAt` dynamically and display visual `Expired` badge when `now > expiresAt`.            |
| **Unauthorized Dispatch Actions**     | Client calling server actions without proper admin permissions.                   | Enforce `await requireAdminAuth()` at top of all proposal server actions.                            |

---

## 7. Verification & Definition of Done

1. `pnpm run lint` executes with zero errors and zero warnings.
2. `pnpm run typecheck` or `pnpm run build` compiles cleanly with no TypeScript or Next.js build issues.
3. Database migration succeeds via `pnpm db:push` or local Supabase migration execution.
4. Proposal generation, email dispatch modal, version history drawer, and PDF print preview verified on mobile, tablet, and desktop viewports.

---

## 8. Agent Workflow Integration

> [!IMPORTANT]
> **Mandatory Pause for User Approval:** After creating this specification and updating `context/implementation-specs/README.md` and `context/progress-tracker.md`, the AI agent MUST pause execution, present the implementation plan to the user, and obtain explicit approval before writing any code.
