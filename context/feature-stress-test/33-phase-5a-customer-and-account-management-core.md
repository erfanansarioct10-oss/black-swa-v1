# Feature Stress Test Plan 33: Phase 5A — Customer & Account Management Core

> **Stress Test ID:** 33-phase-5a-customer-and-account-management-core  
> **Corresponding Spec:** `context/implementation-specs/33-phase-5a-customer-and-account-management-core.md`  
> **Status:** Verified Clean  
> **Created Date:** 2026-08-02

---

## Executive Summary & Feature Surface Map

This document details the technical security audit, payload fuzzing, RLS boundary verification, and concurrency stress testing plan for the Phase 5A Customer & Account Management Core module. Surface under test includes the `customers` database table (`db/schema.ts`), customer Zod validation schemas (`schemas/customer.ts`), customer server actions (`actions/customer.ts`), directory portal (`/admin/customers`), and customer detail profile view (`/admin/customers/[id]`).

### Target Attack & Stress Surface

| Surface Type | Path / Target | Associated Roles / Auth Level |
| --- | --- | --- |
| **Database Table** | `public.customers` (Supabase DB) | Authenticated + RLS Policy |
| **Server Action** | `actions/customer.ts` (`getCustomersAction`) | Admin Auth Session (`requireAdminAuth`) |
| **Server Action** | `actions/customer.ts` (`getCustomerStatsAction`) | Admin Auth Session (`requireAdminAuth`) |
| **Server Action** | `actions/customer.ts` (`getCustomerByIdAction`) | Admin Auth Session (`requireAdminAuth`) |
| **Server Action** | `actions/customer.ts` (`createCustomerAction`) | Admin Auth Session (`requireAdminAuth`) |
| **Server Action** | `actions/customer.ts` (`updateCustomerAction`) | Admin Auth Session (`requireAdminAuth`) |
| **Server Action** | `actions/customer.ts` (`deleteCustomerAction`) | Admin Auth Session (`requireAdminAuth`) |
| **Zod Schema** | `schemas/customer.ts` | Server-side Input Validation Layer |
| **Directory Page** | `/admin/customers` | Admin Auth Session (`requireAdminAuth`) |
| **Detail Page** | `/admin/customers/[id]` | Admin Auth Session (`requireAdminAuth`) |

---

## 1. OWASP Top 10 (2026) Security Audit & Attack Matrix

| OWASP Vector | Specific Vulnerability Scenario | Expected Prevention / Defense | Test Script / CLI Command |
| --- | --- | --- | --- |
| **A01:2026 (Broken Access Control)** | Unauthenticated user attempts to execute `getCustomersAction`, `createCustomerAction`, `updateCustomerAction`, or `deleteCustomerAction`. | All actions invoke `requireAdminAuth()` at entry point before any DB query. | `pnpm exec tsx scripts/stress/33-customer-management-stress.ts` |
| **A03:2026 (Injection & Payload Abuse)** | Attacker submits SQL injection payload `' OR '1'='1` into `query` filter or organization name input. | Drizzle ORM `ilike` parameterized bindings sanitize search filters cleanly. | `pnpm exec tsx scripts/stress/33-customer-management-stress.ts` |
| **A03:2026 (XSS & Script Injection)** | Attacker submits `<script>alert('xss')</script>` in contact name, address, or internal notes. | Input stored as literal string; React automatically context-escapes text nodes on output. | `pnpm exec tsx scripts/stress/33-customer-management-stress.ts` |
| **A04:2026 (Insecure Design)** | Attacker submits string length overflows (e.g. 500+ chars org name, invalid email format, unknown org type). | Zod schema validation (`createCustomerSchema` / `updateCustomerSchema`) rejects invalid payload prior to DB execution. | `pnpm exec tsx scripts/stress/33-customer-management-stress.ts` |
| **A05:2026 (Security Misconfiguration)** | Unauthenticated access to Supabase `customers` table directly via client SDK. | Supabase RLS policy requires `auth.role() = 'authenticated'`. | `pnpm exec tsx scripts/stress/33-customer-management-stress.ts` |

---

## 2. Supabase RLS & Database Resilience Stress Suite

### RLS Policy & Database Integrity Tests
- **Test Scenario 1 (Multi-Tenant & Role Isolation):** Querying `customers` table without valid admin authorization claims returns zero rows or throws an authorization error.
- **Expected Result:** Server-side `requireAdminAuth()` and Supabase RLS policies reject unauthenticated reads/writes.
- **Test Scenario 2 (Foreign Key Cascades on RFQs):** Deleting or archiving a customer linked to existing RFQs (`quotes.customerId`).
- **Expected Result:** `quotes.customerId` foreign key is set to NULL (`ON DELETE SET NULL`), preserving quotation history and reference integrity.

---

## 3. Terminal & Script-Driven Automated Test Suite

```bash
# Execute Phase 5A Customer Core Stress Suite
pnpm exec tsx scripts/stress/33-customer-management-stress.ts
```

---

## 4. Concurrency, Race Conditions & State Mutation Stress Scenarios

| Stress Vector | Simulation Method | Success Criteria |
| --- | --- | --- |
| **Concurrent Customer Updates** | `Promise.all([updateCustomerAction(data1), updateCustomerAction(data2)])`. | Drizzle transaction resolves sequentially; `updatedAt` reflects latest state without row corruption. |
| **Duplicate Contact Search** | Calling `getCustomersAction({ query: "nepal" })` with high frequency. | Expression indexes `idx_customers_email` and `idx_customers_org_name` perform efficiently within SLA bounds. |
| **Soft Delete Archival** | Invoking `deleteCustomerAction(customerId)`. | Sets status to `"archived"`; record remains available for historic RFQ lookup while hidden from active filters. |

---

## 5. Boundary Data, Malicious Inputs & Payload Fuzzing Specs

- **String Length Overflows:** Testing 1,000+ character strings for `organizationName`, `primaryContactName`, `address`, and `notes`. Zod bounds enforced cleanly.
- **Email Sanitization & Normalization:** Ensures `primaryContactEmail` is trimmed and converted to lowercase upon insertion/update.
- **Organization Type Enum Bounds:** Enforces allowed enum values (`"hospital"`, `"clinic"`, `"broadcast_studio"`, `"media_network"`, `"enterprise"`).
- **Tax Registration ID Fuzzing:** Validates string length (max 50 chars) and special character handling.

---

## 6. System Resilience & Failure Recovery

- **Non-Existent Customer Lookup:** Requesting `getCustomerByIdAction("00000000-0000-0000-0000-000000000000")` returns `{ success: false, error: "Customer account not found." }` cleanly without throwing uncaught exceptions.
- **Empty Directory Results:** Querying non-matching search string returns empty dataset with valid zero pagination metadata.

---

## 7. Execution Workflow, Verification Commands & Definition of Done

1. `pnpm run lint` completes with zero errors and zero warnings.
2. `pnpm exec tsc --noEmit` completes with zero errors.
3. Automated stress runner `pnpm exec tsx scripts/stress/33-customer-management-stress.ts` passes with zero failures.
