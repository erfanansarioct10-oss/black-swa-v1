# Feature Stress Test Plan 36: Phase 5C — Quotation Workbench & Interactive Proposal Builder

> **Stress Test ID:** 36-phase-5c-quotation-workbench  
> **Corresponding Spec:** `context/implementation-specs/36-phase-5c-quotation-workbench-and-interactive-proposal-builder.md`  
> **Status:** Verified Clean  
> **Created Date:** 2026-08-03

---

## Executive Summary & Feature Surface Map

This document details the technical security audit, financial math validation, state transition bound fuzzing, concurrency resilience, and RLS policy verification plan for the Phase 5C Quotation Workbench & Interactive Proposal Builder module. Surface under test includes financial extensions on `quotes` and `quote_items`, `quote_activity_logs` table (`db/schema.ts`), admin quote validation schemas (`schemas/quote-admin.ts`), server actions (`actions/quote-admin.ts`), admin workbench (`/admin/quotes/[id]`), and public track portal (`/quote/track/[referenceId]`).

### Target Attack & Stress Surface

| Surface Type | Path / Target | Associated Roles / Auth Level |
| --- | --- | --- |
| **Database Tables** | `public.quotes`, `public.quote_items`, `public.quote_activity_logs` | Authenticated + RLS Policy |
| **Server Action** | `actions/quote-admin.ts` (`getAdminQuoteDetailAction`) | Admin Auth Session (`requireAdminAuth`) |
| **Server Action** | `actions/quote-admin.ts` (`updateQuoteFinancialsAction`) | Admin Auth Session (`requireAdminAuth`) |
| **Server Action** | `actions/quote-admin.ts` (`updateQuoteStatusAction`) | Admin Auth Session (`requireAdminAuth`) |
| **Server Action** | `actions/quote-admin.ts` (`addQuoteActivityNoteAction`) | Admin Auth Session (`requireAdminAuth`) |
| **Server Action** | `actions/quote-admin.ts` (`assignQuoteManagerAction`) | Admin Auth Session (`requireAdminAuth`) |
| **Server Action** | `actions/quote-admin.ts` (`sendQuoteProposalEmailAction`) | Admin Auth Session (`requireAdminAuth`) |
| **Zod Schema** | `schemas/quote-admin.ts` | Server-side Input Validation Layer |
| **Workbench Page** | `/admin/quotes/[id]` | Admin Auth Session (`requireAdminAuth`) |
| **Track Page** | `/quote/track/[referenceId]` | Public with Verification Email / Token |

---

## 1. OWASP Top 10 (2026) Security Audit & Attack Matrix

| OWASP Vector | Specific Vulnerability Scenario | Expected Prevention / Defense | Test Script / CLI Command |
| --- | --- | --- | --- |
| **A01:2026 (Broken Access Control)** | Unauthorized user attempts to invoke `updateQuoteFinancialsAction` or `updateQuoteStatusAction`. | All server actions enforce `requireAdminAuth()` as first statement. | `pnpm exec tsx scripts/stress/36-quote-workbench-stress.ts` |
| **A03:2026 (Injection & Payload Abuse)** | Attacker submits malicious script payloads into `adminNotes`, custom email messages, or activity notes. | Zod `.trim()`, `.max()`, and React DOM escaping neutralize XSS payloads cleanly. | `pnpm exec tsx scripts/stress/36-quote-workbench-stress.ts` |
| **A04:2026 (Financial & Discount Bounds)** | Attacker inputs negative unit prices or discount percentages > 100%. | Zod `min(0)` and `max(100)` enforce mathematical boundaries. | `pnpm exec tsx scripts/stress/36-quote-workbench-stress.ts` |
| **A04:2026 (State Machine Integrity)** | Invalid quotation status string submitted. | Zod `enum(["pending", "under_review", "manager_assigned", "quoted", "completed", "rejected"])` blocks invalid status strings. | `pnpm exec tsx scripts/stress/36-quote-workbench-stress.ts` |
| **A05:2026 (Security Misconfiguration)** | Direct query access to `quote_activity_logs` table without admin role. | Supabase RLS policy requires `auth.role() = 'authenticated'`. | `pnpm exec tsx scripts/stress/36-quote-workbench-stress.ts` |

---

## 2. Financial Math & Tax Calculation Fuzzing Specs

- **Nepalese 13% VAT Calculation:** `vatAmount = Math.round(subtotal * 0.13)`.
- **Line Item Discount Math:** `lineTotal = Math.round(unitPrice * quantity * (1 - discountPercentage / 100))`.
- **Grand Total Equation:** `grandTotal = subtotal + vatAmount + shippingCost`.
- **Integer Storage Safety:** All monetary amounts stored as whole integer NPR units to prevent floating-point rounding errors.

---

## 3. Terminal & Script-Driven Automated Test Suite

```bash
# Execute Phase 5C Quotation Workbench Stress Suite
pnpm exec tsx scripts/stress/36-quote-workbench-stress.ts
```

---

## 4. Execution Workflow, Verification Commands & Definition of Done

1. `pnpm run lint` completes with zero errors and zero warnings.
2. `pnpm exec tsc --noEmit` completes with zero errors.
3. Automated stress runner `pnpm exec tsx scripts/stress/36-quote-workbench-stress.ts` passes with zero failures (`VERIFIED CLEAN ✅`).
