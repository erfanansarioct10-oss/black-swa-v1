# Feature Stress Test Plan 34: Phase 5B — Lead Management & Inquiry Processing

> **Stress Test ID:** 34-phase-5b-lead-management-and-inquiry-processing  
> **Corresponding Spec:** `context/implementation-specs/34-phase-5b-lead-management-and-inquiry-processing.md`  
> **Status:** Verified Clean  
> **Created Date:** 2026-08-02

---

## Executive Summary & Feature Surface Map

This document details the technical security audit, state transition bound fuzzing, concurrency resilience, and RLS policy verification plan for the Phase 5B Lead Management & Inquiry Processing module. Surface under test includes the `leads` database table (`db/schema.ts`), lead validation schemas (`schemas/lead.ts`), lead server actions (`actions/lead.ts`), directory portal (`/admin/leads`), and lead detail workflow page (`/admin/leads/[id]`).

### Target Attack & Stress Surface

| Surface Type | Path / Target | Associated Roles / Auth Level |
| --- | --- | --- |
| **Database Table** | `public.leads` (Supabase DB) | Authenticated + RLS Policy |
| **Server Action** | `actions/lead.ts` (`getLeadStatsAction`) | Admin Auth Session (`requireAdminAuth`) |
| **Server Action** | `actions/lead.ts` (`getLeadsAction`) | Admin Auth Session (`requireAdminAuth`) |
| **Server Action** | `actions/lead.ts` (`getLeadByIdAction`) | Admin Auth Session (`requireAdminAuth`) |
| **Server Action** | `actions/lead.ts` (`createLeadAction`) | Admin Auth Session (`requireAdminAuth`) |
| **Server Action** | `actions/lead.ts` (`updateLeadAction`) | Admin Auth Session (`requireAdminAuth`) |
| **Server Action** | `actions/lead.ts` (`convertLeadToCustomerAction`) | Admin Auth Session (`requireAdminAuth`) |
| **Zod Schema** | `schemas/lead.ts` | Server-side Input Validation Layer |
| **Directory Page** | `/admin/leads` | Admin Auth Session (`requireAdminAuth`) |
| **Detail Page** | `/admin/leads/[id]` | Admin Auth Session (`requireAdminAuth`) |

---

## 1. OWASP Top 10 (2026) Security Audit & Attack Matrix

| OWASP Vector | Specific Vulnerability Scenario | Expected Prevention / Defense | Test Script / CLI Command |
| --- | --- | --- | --- |
| **A01:2026 (Broken Access Control)** | Unauthorized user attempts to call `convertLeadToCustomerAction` or update lead status/priority. | All server actions enforce `requireAdminAuth()` as first statement. | `pnpm exec tsx scripts/stress/34-lead-management-stress.ts` |
| **A03:2026 (Injection & Payload Abuse)** | Attacker submits SQL injection strings into lead `search`, `title`, or `companyName`. | Drizzle ORM `ilike` parameterized bindings neutralize query strings cleanly. | `pnpm exec tsx scripts/stress/34-lead-management-stress.ts` |
| **A04:2026 (Insecure Design & Pipeline Bounds)** | Attacker submits negative or ultra-large estimated lead values (`-500`, `999,999,999,999`). | Zod `coerce.number().min(0).max(1000000000)` enforces strict valuation boundaries. | `pnpm exec tsx scripts/stress/34-lead-management-stress.ts` |
| **A04:2026 (State Machine Flaws)** | Double conversion attempt of an already converted lead entity. | `convertLeadToCustomerAction` checks existing customer by email (`primaryContactEmail`) or updates existing customer gracefully. | `pnpm exec tsx scripts/stress/34-lead-management-stress.ts` |
| **A05:2026 (Security Misconfiguration)** | Direct database access to `leads` table without admin role. | Supabase RLS policy requires `auth.role() = 'authenticated'`. | `pnpm exec tsx scripts/stress/34-lead-management-stress.ts` |

---

## 2. Supabase RLS & Database Resilience Stress Suite

### RLS Policy & Database Integrity Tests
- **Test Scenario 1 (Multi-Tenant & Role Isolation):** Direct query access to `leads` table without valid session claims returns 0 rows or is blocked by RLS policies.
- **Expected Result:** Unauthenticated requests fail fast at the auth layer before database query execution.
- **Test Scenario 2 (Foreign Key Cascades on Customer Conversion):** Converting lead to customer links existing unlinked `quotes` matching the lead's email.
- **Expected Result:** `quotes.customerId` is automatically populated for unlinked quotes matching `lower(email)`.

---

## 3. Terminal & Script-Driven Automated Test Suite

```bash
# Execute Phase 5B Lead Pipeline Stress Suite
pnpm exec tsx scripts/stress/34-lead-management-stress.ts
```

---

## 4. Concurrency, Race Conditions & State Mutation Stress Scenarios

| Stress Vector | Simulation Method | Success Criteria |
| --- | --- | --- |
| **Concurrent Double Conversion** | `Promise.all([convertLeadToCustomerAction(data), convertLeadToCustomerAction(data)])`. | First call converts lead and creates customer; second call matches existing customer cleanly without creating duplicate `customers` rows. |
| **Concurrent Manager Assignment** | Simultaneous updates of `assignedManagerId` for the same lead. | Lead record updatedAt reflects final timestamp; zero database locking or deadlock exceptions. |
| **Status Breakdown Calculation** | Querying lead stats across millions of records. | `count(sql`CASE WHEN...`)` aggregation resolves efficiently with index coverage on `status`. |

---

## 5. Boundary Data, Malicious Inputs & Payload Fuzzing Specs

- **Pipeline Valuation Limits:** `estimatedValue` bounds tested at 0, 10,000,000, and overflow values (>1,000,000,000).
- **Lead Lifecycle State Transitions:** Enforces valid `status` enum values (`"new"`, `"contacted"`, `"qualified"`, `"unqualified"`, `"converted"`).
- **Priority Enum Validation:** Enforces valid `priority` enum values (`"low"`, `"medium"`, `"high"`, `"urgent"`).
- **Source Enum Validation:** Enforces valid `leadSource` enum values (`"website_rfq"`, `"direct_inquiry"`, `"referral"`, `"trade_show"`, `"outreach"`).

---

## 6. System Resilience & Failure Recovery

- **Non-Existent Lead Operations:** Requesting `getLeadByIdAction` or `updateLeadAction` with a non-existent UUID returns `{ success: false, error: "Lead record not found" }` cleanly.
- **Malformed Filter Inputs:** `getLeadsAction` with negative page numbers or extreme page sizes defaults safely via Zod schema.

---

## 7. Execution Workflow, Verification Commands & Definition of Done

1. `pnpm run lint` completes with zero errors and zero warnings.
2. `pnpm exec tsc --noEmit` completes with zero errors.
3. Automated stress runner `pnpm exec tsx scripts/stress/34-lead-management-stress.ts` passes with zero failures.
