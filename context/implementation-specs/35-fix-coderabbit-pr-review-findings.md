# Implementation Spec 35: Fix CodeRabbit PR Review Findings (Commit 7e695b6)

> **Spec ID:** 35-fix-coderabbit-pr-review-findings  
> **Target Branch / PR:** `phase5b` / PR #14  
> **Status:** Draft / Approved  
> **Created Date:** 2026-08-02  

---

## Executive Summary

This specification outlines the exact technical corrections required to resolve all major security, data integrity, functional correctness, component state management, and stress-testing findings identified by CodeRabbit's automated PR review on commit `7e695b6`.

---

## 1. What We Are Going to Do

| # | Target File | Action Required |
| --- | --- | --- |
| 1 | `db/schema.ts` | Update `customers` table index to `uniqueIndex("idx_customers_email").on(sql\`lower(${table.primaryContactEmail})\`)`. |
| 2 | `supabase/migrations/20260802000000_create_customers_table.sql` | Add UNIQUE constraint on `lower(primary_contact_email)`, CHECK constraints on enums, and restrict RLS policies. |
| 3 | `supabase/migrations/20260802000001_create_leads_table.sql` | Restrict RLS policy for authenticated users on `leads`. |
| 4 | `actions/lead.ts` | Wrap `convertLeadToCustomerAction` operations inside a single atomic `db.transaction(...)`. |
| 5 | `actions/admin.ts` | Add query length check (`> 500`) to `adminSearchAction`, runtime enum validation & row existence check to `updateInquiryStatusAction`, and separate `count(*)` queries to `getAdminNotificationsAction`. |
| 6 | `components/admin/leads/lead-detail-client.tsx` | Inspect `res.success` in action handlers (`handleStatusChange`, `handlePriorityChange`, `handleSaveNotes`), display error message, revert local state on failure, and pass `key` to `LeadFormModal`. |
| 7 | `components/admin/leads/leads-table-container.tsx` | Pass `key={selectedEditLead?.id}` to `LeadFormModal`. |
| 8 | `components/admin/notification-drawer.tsx` | Display toast error when `handleAssignQuote` or `handleMarkInquiryInProgress` fails. |
| 9 | `app/admin/analytics/page.tsx` | Project only required columns in `filteredQuotes` query and calculate SLA metrics strictly using real stage transition timestamps. |
| 10 | `app/admin/quotes/page.tsx` | Implement offset pagination with Next/Previous navigation controls. |
| 11 | `scripts/stress/34-lead-management-stress.ts` | Delete `process.env.ADMIN_DEV_BYPASS` on cleanup when previously undefined. |
| 12 | `scripts/stress/28-executive-metrics-stress.ts` | Update query shapes to use `count(*)` and `orderBy(desc(createdAt))`. |
| 13 | `scripts/stress/32-command-center-diagnostics-stress.ts` | Update test expectations for 600-char query skip and invalid inquiry status update. |

---

## 2. Why We Are Doing This

1. **Data Integrity & Atomicity:** Lead-to-customer conversion currently executes 4 non-transactional SQL statements. A partial failure or race condition can corrupt data or create duplicate customer rows.
2. **Security & Input Validation:** Unbounded search strings and unvalidated enum parameters can lead to performance degradation or unexpected DB state.
3. **Accurate Metrics & Reporting:** SLA metrics must reflect real timestamp differences instead of synthetic floors or `updatedAt` fallbacks.
4. **User Experience & State Isolation:** Server Action errors in admin detail views must be communicated clearly to operators without leaving UI in a false-success state.

---

## 3. How We Are Going to Implement It

### Step 1: Database & Transactions
- Update `db/schema.ts` to use `uniqueIndex` for customer emails.
- Wrap `actions/lead.ts` `convertLeadToCustomerAction` with `db.transaction(async (tx) => { ... })`.

### Step 2: Server Actions & Validation
- Update `adminSearchAction` in `actions/admin.ts` to abort search when query length > 500.
- Update `updateInquiryStatusAction` to validate status string and check `.returning()` for affected rows.
- Use `count(*)` queries in `getAdminNotificationsAction`.

### Step 3: Admin UI & Pagination
- In `lead-detail-client.tsx`, inspect `res.success` and display `errorMsg`.
- In `quotes/page.tsx`, read `page` from searchParams, calculate offset, and render pagination controls.
- In `analytics/page.tsx`, narrow `.select(...)` projection and compute SLA strictly on non-null `assignedAt`, `quotedAt`, `completedAt`.

### Step 4: Stress Tests
- Fix cleanup in `34-lead-management-stress.ts`.
- Align query shapes in `28-executive-metrics-stress.ts`.
- Update assertions in `32-command-center-diagnostics-stress.ts`.

---

## 4. Verification Plan

1. Run `pnpm run lint` & `pnpm run build`.
2. Run `npx tsx scripts/stress/run-phase4-stress-suite.ts`.
3. Run `npx tsx scripts/stress/run-phase5-stress-suite.ts`.
