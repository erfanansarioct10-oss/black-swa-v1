# Feature Stress Test Plan 27: Phase 4A Sub-Task 2 — Clerk Role Authorization Guard

> **Stress Test ID:** 27-phase-4a-clerk-role-authorization-guard  
> **Corresponding Spec:** `context/implementation-specs/27-phase-4a-clerk-role-authorization-guard.md`  
> **Status:** Verified Clean  
> **Created Date:** 2026-08-02

---

## Executive Summary & Feature Surface Map

This document establishes the technical security audit, privilege escalation stress test, and role boundary verification plan for `lib/admin-auth.ts` (`requireAdminAuth()` and `isAdminSession()`), middleware routing in `proxy.ts`, and the `/admin/unauthorized` fallback route (`app/admin/unauthorized/page.tsx`).

### Target Attack & Stress Surface

| Surface Type | Path / Target | Associated Roles / Auth Level |
| --- | --- | --- |
| **Server Auth Guard** | `lib/admin-auth.ts` (`requireAdminAuth`) | Server-Side Clerk Role Verification |
| **Middleware Routing** | `proxy.ts` (`clerkMiddleware`) | Next.js Edge Middleware Request Interceptor |
| **Fallback Page** | `app/admin/unauthorized/page.tsx` | Unauthenticated / Unauthorized Client Fallback |

---

## 1. OWASP Top 10 (2026) Security Audit & Attack Matrix

| OWASP Vector | Specific Vulnerability Scenario | Expected Prevention / Defense | Test Script / CLI Command |
| --- | --- | --- | --- |
| **A01:2026 (Broken Access Control)** | Non-admin user attempts direct URL navigation to `/admin/quotes` or `/admin/analytics`. | `requireAdminAuth()` checks `isAdminSession(has)` on server; redirects non-admin to `/admin/unauthorized`. | `pnpm exec tsx scripts/stress/27-clerk-auth-guard-stress.ts` |
| **A01:2026 (Privilege Escalation)** | Signed-in user attempts to bypass role checks by manipulating client headers or cookies. | Clerk JWT claims and `auth().has({ role: "admin" })` are verified exclusively on the server. | `pnpm exec tsx scripts/stress/27-clerk-auth-guard-stress.ts` |
| **A05:2026 (Security Misconfiguration)** | Setting `ADMIN_DEV_BYPASS="true"` in production environment allows unauthorized access. | Dev bypass logic explicitly checks `process.env.NODE_ENV !== "production"`. | `pnpm exec tsx scripts/stress/27-clerk-auth-guard-stress.ts` |
| **A07:2026 (Auth Failures)** | Unauthenticated user accesses `/admin` without valid Clerk session token. | Middleware intercepts request and redirects to `/admin/login?redirect_url=...`. | `pnpm exec tsx scripts/stress/27-clerk-auth-guard-stress.ts` |

---

## 2. Supabase RLS & Database Resilience Stress Suite

### Role-Based Authorization Policy Tests
- **Test Scenario 1 (Server Auth Pre-Filter):** Database actions in `actions/admin.ts` invoke `requireAdminAuth()` before making Drizzle ORM calls, preventing unauthenticated query execution.
- **Expected Result:** Requests from unauthenticated or non-admin sessions fail fast at the auth layer before database connection execution.

---

## 3. Terminal & Script-Driven Automated Test Suite

```bash
# Execute Phase 4A Clerk Auth Guard stress tests
pnpm exec tsx scripts/stress/27-clerk-auth-guard-stress.ts
```

---

## 4. Concurrency, Race Conditions & State Mutation Stress Scenarios

| Stress Vector | Simulation Method | Success Criteria |
| --- | --- | --- |
| **Dev Bypass Scope Guard** | Signed-in non-admin user accesses `/admin` when `ADMIN_DEV_BYPASS="true"`. | System checks signed-in session first; redirects non-admin user to `/admin/unauthorized`. |
| **Concurrent Auth Requests** | Invoking 50 concurrent `requireAdminAuth()` calls. | Server evaluates session claims cleanly without race conditions or thread state leaks. |

---

## 5. Boundary Data, Malicious Inputs & Payload Fuzzing Specs

- **Invalid Role Claims:** Passing arbitrary strings (`"super_user"`, `"root"`, `"manager"`) to `isAdminSession()`. Verified return: `false` unless explicitly `"admin"` or `"org:admin"`.
- **Redirect URL Preserving:** Encoded query strings (`/admin/quotes?ref=RFQ-1001`) preserved cleanly in `redirect_url` query parameters during auth redirects.

---

## 6. System Resilience & Failure Recovery

- **Clerk Auth API Outage / Error:** Graceful exception handling in `requireAdminAuth()`. In production, uncaught errors redirect cleanly without disclosing server stack traces.

---

## 7. Execution Workflow, Verification Commands & Definition of Done

1. `pnpm run lint` completes with zero errors and zero warnings.
2. `pnpm exec tsc --noEmit` completes with zero errors.
3. Automated test runner `pnpm exec tsx scripts/stress/27-clerk-auth-guard-stress.ts` passes with zero failures.
