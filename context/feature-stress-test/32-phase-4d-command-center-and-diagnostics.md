# Feature Stress Test Plan 32: Phase 4D — Command Center, Quick Search & Executive Notification Center

> **Stress Test ID:** 32-phase-4d-command-center-and-diagnostics  
> **Corresponding Spec:** `context/implementation-specs/32-phase-4d-command-center-and-diagnostics.md`  
> **Status:** Verified Clean  
> **Created Date:** 2026-08-02

---

## Executive Summary & Feature Surface Map

This document details the technical security audit, payload fuzzing, and concurrency race condition stress plan for the Administrative Command Center (`components/admin/command-palette.tsx`), Executive Action Notification Drawer (`components/admin/notification-drawer.tsx`), Administrative Quick Search Server Action (`adminSearchAction` in `actions/admin.ts`), Quote Self-Assignment Server Action (`assignQuoteToSelfAction`), and Inquiry Status Server Action (`updateInquiryStatusAction`).

### Target Attack & Stress Surface

| Surface Type | Path / Target | Associated Roles / Auth Level |
| --- | --- | --- |
| **Server Action** | `actions/admin.ts` (`adminSearchAction`) | Admin Auth Session (`requireAdminAuth`) |
| **Server Action** | `actions/admin.ts` (`assignQuoteToSelfAction`) | Admin Auth Session (`requireAdminAuth`) |
| **Server Action** | `actions/admin.ts` (`updateInquiryStatusAction`) | Admin Auth Session (`requireAdminAuth`) |
| **Command Palette** | `components/admin/command-palette.tsx` | Accessible Modal (`Cmd+K` / `Ctrl+K`) |
| **Notification Drawer**| `components/admin/notification-drawer.tsx` | Executive Drawer Sheet (`Radix Sheet`) |
| **Management Routes** | `/admin/quotes` & `/admin/inquiries` | Admin Auth Session (`requireAdminAuth`) |

---

## 1. OWASP Top 10 (2026) Security Audit & Attack Matrix

| OWASP Vector | Specific Vulnerability Scenario | Expected Prevention / Defense | Test Script / CLI Command |
| --- | --- | --- | --- |
| **A01:2026 (Broken Access Control)** | Unauthorized user attempts to execute `assignQuoteToSelfAction` or `adminSearchAction`. | Server actions invoke `requireAdminAuth()` at entry point before reading DB. | `pnpm exec tsx scripts/stress/32-command-center-diagnostics-stress.ts` |
| **A03:2026 (Injection & SQLi)** | Attacker passes SQL pattern `' OR '1'='1` or `%` in `adminSearchAction` query input. | Drizzle ORM `ilike` parameterized bindings neutralize input cleanly. | `pnpm exec tsx scripts/stress/32-command-center-diagnostics-stress.ts` |
| **A04:2026 (Insecure Design)** | Attacker passes 100,000+ character string into quick search input field. | Query string trimmed; search skipped if length < 2 or length > 500. | `pnpm exec tsx scripts/stress/32-command-center-diagnostics-stress.ts` |
| **A10:2026 (API Abuse)** | Excessive high-frequency invocation of search server action. | Search results capped at `limit(5)` per category; query execution optimized. | `pnpm exec tsx scripts/stress/32-command-center-diagnostics-stress.ts` |

---

## 2. Supabase RLS & Database Resilience Stress Suite

### Database Concurrency & Race Condition Tests
- **Test Scenario 1 (Double Quote Assignment):** Two managing directors simultaneously invoke `assignQuoteToSelfAction(quoteId)` for the same unassigned RFQ.
- **Expected Result:** Drizzle `where(and(eq(quotes.id, id), isNull(quotes.assignedManagerId)))` atomic update ensures exactly ONE director receives assignment; second call receives `success: false` with clear error message.

---

## 3. Terminal & Script-Driven Automated Test Suite

```bash
# Execute Phase 4D Command Center & Diagnostics stress tests
pnpm exec tsx scripts/stress/32-command-center-diagnostics-stress.ts
```

---

## 4. Concurrency, Race Conditions & State Mutation Stress Scenarios

| Stress Vector | Simulation Method | Success Criteria |
| --- | --- | --- |
| **Atomic Quote Assignment** | `Promise.all([assignQuote(id, "director_1"), assignQuote(id, "director_2")])`. | Exactly 1 call succeeds; database row `assignedManagerId` matches winner; zero corrupt state. |
| **Search Short Query Guard** | Calling `adminSearchAction("a")` or `adminSearchAction("")`. | Returns `{ success: true, data: { quotes: [], inquiries: [] } }` instantly without executing DB query. |

---

## 5. Boundary Data, Malicious Inputs & Payload Fuzzing Specs

- **Payload Fuzzing Inputs:** XSS strings (`<script>alert(1)</script>`), null byte strings (`\0`), unicode overflow, raw SQL injection fragments (`SELECT * FROM quotes`). Verified: safely processed without unhandled exceptions or data leakage.
- **Inquiry Status Transitions:** Enforces valid enum values (`"new"`, `"in_progress"`, `"resolved"`, `"archived"`).

---

## 6. System Resilience & Failure Recovery

- **Zero 404 Routing:** Management routes `/admin/quotes` and `/admin/inquiries` resolve cleanly without routing or render errors.
- **Vercel Cost Optimization:** Background health pingers removed to prevent serverless function execution charges and minimize resource overhead.

---

## 7. Execution Workflow, Verification Commands & Definition of Done

1. `pnpm run lint` completes with zero errors and zero warnings.
2. `pnpm exec tsc --noEmit` completes with zero errors.
3. Automated test runner `pnpm exec tsx scripts/stress/32-command-center-diagnostics-stress.ts` passes with zero failures.
