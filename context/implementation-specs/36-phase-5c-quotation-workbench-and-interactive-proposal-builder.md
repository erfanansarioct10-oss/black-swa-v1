# Implementation Spec 36: Phase 5C Quotation Workbench & Interactive Proposal Builder

> **Spec ID:** 36-phase-5c-quotation-workbench-and-interactive-proposal-builder  
> **Target Branch / PR:** main  
> **Status:** Draft  
> **Created Date:** 2026-08-03

---

## Executive Summary

Phase 5C & 5D establishes the core administrative sales operations platform for Black Swan International: the **Quotation Workbench, Interactive Line-Item Proposal Builder, Automated Resend PDF Dispatch Pipeline, CRM Sync Engine, and Activity Audit Trails**.

This specification defines the database schema extensions, Zod validation logic, type-safe Server Actions, responsive admin UI workbench, PDF proposal compilation, public track portal download integration, and stress testing suite required to operate high-value medical hardware and broadcast technology quotations.

---

## 1. What We Are Going to Do

| #   | Target File | Action Required |
| --- | ----------- | --------------- |
| 1   | `db/schema.ts` | **[MODIFY]** Add financial columns to `quotes` (`subtotal`, `vatAmount`, `shippingCost`, `discountTotal`, `grandTotal`, `currency`) and `quoteItems` (`unitPrice`, `discountPercentage`, `totalPrice`); create `quoteActivityLogs` table. |
| 2   | `schemas/quote-admin.ts` | **[NEW]** Define Zod schemas for workbench financial updates, line-item adjustments, status lifecycle transitions, activity notes, and proposal email dispatch. |
| 3   | `actions/quote-admin.ts` | **[NEW]** Implement type-safe Server Actions (`updateQuoteFinancialsAction`, `updateQuoteStatusAction`, `addQuoteActivityNoteAction`, `assignQuoteManagerAction`, `sendQuoteProposalEmailAction`). |
| 4   | `app/admin/quotes/page.tsx` | **[MODIFY]** Enhance quotation directory table with grand total columns, assigned manager badges, and quick drawer actions. |
| 5   | `app/admin/quotes/[id]/page.tsx` | **[NEW]** Build comprehensive Admin RFQ Workbench page featuring financial calculation controls, status stepper, customer profile links, and activity logs. |
| 6   | `components/admin/quotes/quote-workbench.tsx` | **[NEW]** Core interactive container component for line-item pricing calculations, VAT estimation, and status workflow controls. |
| 7   | `components/admin/quotes/quote-proposal-preview.tsx` | **[NEW]** Dynamic, printable HTML/PDF proposal component for internal staff preview and Resend customer dispatch. |
| 8   | `components/admin/quotes/quote-activity-sidebar.tsx` | **[NEW]** Real-time activity timeline and team collaboration notes sidebar. |
| 9   | `app/quote/track/[referenceId]/page.tsx` | **[MODIFY]** Update public quote tracking portal to render itemized financial breakdown and PDF proposal download trigger. |
| 10  | `scripts/stress/36-quote-workbench-stress.ts` | **[NEW]** Automated TypeScript stress test suite verifying financial math, status transitions, CRM lead sync, and activity logs. |
| 11  | `context/feature-stress-test/36-phase-5c-quotation-workbench.md` | **[NEW]** Feature stress spec detailing OWASP security scenarios, RLS verification, and edge case assertions. |
| 12  | `context/progress-tracker.md` | **[MODIFY]** Update progress tracker with Phase 5C specification status. |
| 13  | `context/implementation-specs/README.md` | **[MODIFY]** Register Spec 36 in the registry index. |

---

## 2. Why We Are Doing This

1. **Project Standards Alignment:** Fulfills the B2B quote-first business model outlined in `context/project-overview.md` by turning public RFQs into formal negotiated proposals without introducing B2C e-commerce checkout.
2. **Financial Precision & Tax Compliance:** Implements mandatory Nepalese 13% VAT tax calculations, line-item volume discounts, subtotal tracking, and gross revenue estimation in NPR.
3. **CRM & Lead Lifecycle Synchronization:** Automatically transitions linked `leads` records (e.g. to `qualified` or `converted`) and syncs `customers` accounts when quote statuses move through `under_review` -> `quoted` -> `completed` / `won`.
4. **Auditability & Operations Accountability:** Creates structured audit logs for every pricing change, status update, account manager assignment, and customer proposal email dispatch.

---

## 3. How We Are Going to Implement It

### Step 1: Database Schema & Migration (`db/schema.ts`)

```typescript
// Add financial header columns to quotes
subtotal: integer("subtotal").default(0).notNull(),
vatAmount: integer("vat_amount").default(0).notNull(), // 13% VAT default
shippingCost: integer("shipping_cost").default(0).notNull(),
discountTotal: integer("discount_total").default(0).notNull(),
grandTotal: integer("grand_total").default(0).notNull(),
currency: text("currency").default("NPR").notNull(),

// Add financial columns to quote_items
unitPrice: integer("unit_price").default(0).notNull(),
discountPercentage: integer("discount_percentage").default(0).notNull(),
totalPrice: integer("total_price").default(0).notNull(),

// Create quote_activity_logs table
export const quoteActivityLogs = pgTable("quote_activity_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  quoteId: uuid("quote_id").notNull().references(() => quotes.id, { onDelete: "cascade" }),
  authorClerkUserId: text("author_clerk_user_id").notNull(),
  authorName: text("author_name").notNull(),
  actionType: text("action_type").notNull(), // e.g. "status_change", "financial_update", "note_added", "email_sent"
  message: text("message").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("idx_quote_activity_quote_id").on(table.quoteId),
]);
```

### Step 2: Validation Schemas (`schemas/quote-admin.ts`)

- Define Zod input schemas with explicit boundaries (`.min()`, `.max()`, string trimming, non-negative integer coercions) for:
  - `updateQuoteFinancialsSchema`
  - `updateQuoteStatusSchema`
  - `addQuoteActivityNoteSchema`
  - `sendQuoteProposalEmailSchema`

### Step 3: Server Actions & CRM Sync (`actions/quote-admin.ts`)

- `updateQuoteFinancialsAction`: Calculates line-item totals, subtotal, 13% VAT, shipping, and grand total in a Drizzle transaction, logging a `financial_update` activity record.
- `updateQuoteStatusAction`: Updates quote status, logs `status_change`, and automatically updates linked `leads` stage (`status = 'converted'` when quote is `completed` / `won`).
- `sendQuoteProposalEmailAction`: Dispatches branded Resend email to customer with HTML invoice preview and public proposal download link.

### Step 4: Admin Workbench UI (`app/admin/quotes/[id]/page.tsx` & components)

- Build responsive, mobile-first Admin RFQ Workbench with:
  - 5-stage status stepper (`pending` -> `under_review` -> `manager_assigned` -> `quoted` -> `completed`).
  - Interactive line-item table with inline price & discount inputs.
  - Live summary card displaying Subtotal, 13% VAT, Discount Total, Shipping, and Grand Total in NPR (`Rs.`).
  - Proposal preview drawer & Resend dispatch action button.
  - Tabbed activity log timeline and team internal notes box.

---

## 4. When We Are Going to Do It

```text
Phase 1: Database Migration & Drizzle ORM Schema Updates
    │
    ▼
Phase 2: Zod Schemas & Type-Safe Server Actions Implementation
    │
    ▼
Phase 3: Admin Workbench UI & Interactive Component Engineering
    │
    ▼
Phase 4: Resend Proposal Dispatch & Public Track Portal Integration
    │
    ▼
Phase 5: Automated Stress Test Suite & Security Verification
```

---

## 5. Required Data & Data Sources

| Data Requirement | Origin / Source | Usage |
| ---------------- | --------------- | ----- |
| Quote Header & Lines | Supabase PostgreSQL (`quotes`, `quote_items`) via Drizzle ORM | Workbench pricing interface & status stepper |
| Staff Admin Identity | Clerk Server Auth (`auth()`, `currentUser()`) | RBAC protection & author attribution on activity logs |
| Customer Profile | Supabase PostgreSQL (`customers`) | Account linkage & primary contact info |
| Notification Pipeline | Resend Email API & Telegram Bot API | Proposal email dispatch & staff management alerts |

---

## 6. What Could Possibly Go Wrong & Mitigation Plan

| Potential Risk | Root Cause | Prevention / Mitigation Strategy |
| -------------- | ---------- | -------------------------------- |
| **Financial Rounding Mismatch** | Floating point arithmetic errors in price calculations. | Store all monetary figures as whole integer units (NPR cents/rupees) and compute VAT using explicit rounding (`Math.round`). |
| **Stale Lead / Customer Status Sync** | Unhandled exception during quote status update leaves linked lead unchanged. | Wrap quote status updates and lead stage transitions inside a single atomic Drizzle database transaction (`db.transaction()`). |
| **Unprotected Admin Actions** | Missing Clerk role guard on server action. | Enforce `verifyAdminRole()` server authorization guard at the top of every admin quote Server Action. |
| **SSR Hydration Mismatch on Currency Formatting** | Locale-dependent formatting differences between node server and client browser. | Use explicit deterministic number formatters with standard `'en-NP'` locale and NPR currency symbol. |

---

## 7. Verification & Definition of Done

1. `pnpm db:push` executes clean migration for financial columns and `quote_activity_logs` table.
2. `pnpm run lint` & `pnpm run typecheck` pass with zero errors and zero warnings.
3. `pnpm build` completes Next.js 16 production compilation cleanly.
4. Stress test script `pnpm exec tsx scripts/stress/36-quote-workbench-stress.ts` passes all assertions with 0 errors.

---

## 8. Agent Workflow Integration

> [!IMPORTANT]
> **Mandatory User Permission Rule:** After drafting this specification, AI agents MUST present the plan to the user and obtain explicit permission before making any code changes.
