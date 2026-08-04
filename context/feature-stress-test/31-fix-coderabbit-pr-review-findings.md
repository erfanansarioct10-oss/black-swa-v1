# Feature Stress Test Plan 31: Fix CodeRabbit PR Review Findings (PR #12)

> **Stress Test ID:** 31-fix-coderabbit-pr-review-findings  
> **Corresponding Spec:** `context/implementation-specs/31-fix-coderabbit-pr-review-findings.md`  
> **Status:** Verified Clean  
> **Created Date:** 2026-08-02

---

## Executive Summary & Feature Surface Map

This document establishes the stress testing, security scoping, and database stage timestamp specification covering the 13 CodeRabbit review findings resolved in PR #12 (Spec 31). Target surfaces include server auth bypass scoping in `lib/admin-auth.ts`, middleware enforcement in `proxy.ts`, SQL migration `20260801000003_add_stage_timestamps_to_quotes.sql`, stage timestamp columns in `db/schema.ts`, and reduced-motion animation guards.

### Target Attack & Stress Surface

| Surface Type | Path / Target | Associated Roles / Auth Level |
| --- | --- | --- |
| **Auth Bypass Scoping** | `lib/admin-auth.ts` / `proxy.ts` | Clerk Auth & Dev Session Scoping |
| **Database Schema** | `db/schema.ts` (`assignedAt`, `quotedAt`, `completedAt`) | Supabase PostgreSQL `quotes` Table |
| **SQL Migration** | `supabase/migrations/20260801000003_add_stage_timestamps_to_quotes.sql` | Drizzle ORM Schema Migration |
| **Motion Accessibility** | `components/admin/pending-directives-alert.tsx` | CSS `motion-safe:` Accessibility Guard |

---

## 1. OWASP Top 10 (2026) Security Audit & Attack Matrix

| OWASP Vector | Specific Vulnerability Scenario | Expected Prevention / Defense | Test Script / CLI Command |
| --- | --- | --- | --- |
| **A01:2026 (Broken Access Control)** | Signed-in user without admin role attempts to access `/admin` while `ADMIN_DEV_BYPASS="true"`. | `lib/admin-auth.ts` inspects `userId` first; authenticated non-admin users are strictly redirected to `/admin/unauthorized`. | `pnpm exec tsx scripts/stress/31-coderabbit-pr12-stress.ts` |
| **A05:2026 (Security Misconfiguration)** | Unenforced role check in middleware when `ADMIN_DEV_BYPASS` is false. | `proxy.ts` strictly evaluates `isAdminSession()` for all production or non-bypass requests. | `pnpm exec tsx scripts/stress/31-coderabbit-pr12-stress.ts` |
| **A08:2026 (Software Integrity)** | Unchecked outer quotes in email configuration strings. | Regex matching `^"(.*)"$` or `^'(.*)'$` strips matching outer quotes only. | `pnpm exec tsx scripts/stress/31-coderabbit-pr12-stress.ts` |

---

## 2. Supabase RLS & Database Resilience Stress Suite

### Database Schema Extension Tests
- **Test Scenario 1 (Stage Timestamps Column Integrity):** Executing migration adding `assigned_at`, `quoted_at`, and `completed_at` timestamp columns with timezone to `public.quotes`.
- **Expected Result:** Database schema updates smoothly without breaking existing quote queries or RLS policies.

---

## 3. Terminal & Script-Driven Automated Test Suite

```bash
# Execute Phase 4 PR #12 CodeRabbit Findings stress tests
pnpm exec tsx scripts/stress/31-coderabbit-pr12-stress.ts
```

---

## 4. Concurrency, Race Conditions & State Mutation Stress Scenarios

| Stress Vector | Simulation Method | Success Criteria |
| --- | --- | --- |
| **Dev Session Scoping Check** | Evaluating `requireAdminAuth()` with synthetic vs. authenticated Clerk session. | Synthetic session receives `dev_admin_user`; authenticated non-admin session triggers redirect exception. |
| **Stage Timestamp Transitions** | Updating quote status to `manager_assigned`, `quoted`, `completed` in sequence. | Correctly populates corresponding stage timestamp column. |

---

## 5. Boundary Data, Malicious Inputs & Payload Fuzzing Specs

- **Reduced-Motion Accessibility:** Animated alert icons use `motion-safe:animate-pulse` to respect user OS accessibility preferences.
- **SSR Hydration Safety in Streams:** `recent-activity-stream.tsx` defers relative timestamp string evaluation until client mount (`mounted` flag).
- **Exact Outer Quote Stripping:** Testing email string `'"john@company.com"'` strips matching outer quote pair cleanly while leaving internal quoted names intact.

---

## 6. System Resilience & Failure Recovery

- **Backward Compatible SLA Calculations:** If stage timestamp columns are null in legacy rows, SLA logic falls back to `updatedAt - createdAt` without crashing.

---

## 7. Execution Workflow, Verification Commands & Definition of Done

1. `pnpm run lint` completes with zero errors and zero warnings.
2. `pnpm exec tsc --noEmit` completes with zero errors.
3. Automated test runner `pnpm exec tsx scripts/stress/31-coderabbit-pr12-stress.ts` passes with zero failures.
