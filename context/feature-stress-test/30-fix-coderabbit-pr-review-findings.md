# Feature Stress Test Plan 30: Fix CodeRabbit PR Review Findings (PR #11)

> **Stress Test ID:** 30-fix-coderabbit-pr-review-findings  
> **Corresponding Spec:** `context/implementation-specs/30-fix-coderabbit-pr-review-findings.md`  
> **Status:** Verified Clean  
> **Created Date:** 2026-08-02

---

## Executive Summary & Feature Surface Map

This document details the stress testing and vulnerability audit plan covering the 11 security, correctness, and code quality items resolved in PR #11 (Spec 30). Key verification targets include auth redirect query string preservation in `proxy.ts`, `<SignIn fallbackRedirectUrl="/admin" />`, dev bypass flag hardening, sender email environment variable normalization in `lib/email.ts`, and navigation icon/title map deduplication in `constants/admin-navigation.ts`.

### Target Attack & Stress Surface

| Surface Type | Path / Target | Associated Roles / Auth Level |
| --- | --- | --- |
| **Middleware Redirects** | `proxy.ts` | Next.js Edge Middleware |
| **Auth Login View** | `app/admin/login/[[...login]]/page.tsx` | Public Auth Route |
| **Server Auth Guard** | `lib/admin-auth.ts` | Server-Side Auth Logic |
| **Email Utility** | `lib/email.ts` | Environment Variable Sanitization |
| **Nav Constants** | `constants/admin-navigation.ts` | Single Source of Truth Navigation Map |

---

## 1. OWASP Top 10 (2026) Security Audit & Attack Matrix

| OWASP Vector | Specific Vulnerability Scenario | Expected Prevention / Defense | Test Script / CLI Command |
| --- | --- | --- | --- |
| **A01:2026 (Broken Access Control)** | Dev bypass flag defaulting to true without explicit env override. | `lib/admin-auth.ts` requires `NODE_ENV !== "production"` AND `ADMIN_DEV_BYPASS === "true"`. | `pnpm exec tsx scripts/stress/30-coderabbit-pr11-stress.ts` |
| **A07:2026 (Identification & Auth)** | Loss of query parameters (`?status=pending`) during unauthenticated login redirect. | `proxy.ts` preserves `pathname + search` in `redirect_url` parameter; Clerk `<SignIn />` uses `fallbackRedirectUrl`. | `pnpm exec tsx scripts/stress/30-coderabbit-pr11-stress.ts` |
| **A08:2026 (Data Integrity)** | Malformed quote strings in `RESEND_FROM_EMAIL` env var causing email provider rejection. | `lib/email.ts` trims whitespace and strips leading/trailing quotes cleanly. | `pnpm exec tsx scripts/stress/30-coderabbit-pr11-stress.ts` |

---

## 2. Supabase RLS & Database Resilience Stress Suite

### Middleware Performance Isolation
- **Test Scenario 1 (Header Inspection Overhead):** `proxy.ts` attaches `x-pathname` header and evaluates role routing without making extra DB calls.
- **Expected Result:** Middleware execution completes in `<2ms`.

---

## 3. Terminal & Script-Driven Automated Test Suite

```bash
# Execute Phase 4 PR #11 CodeRabbit Findings stress tests
pnpm exec tsx scripts/stress/30-coderabbit-pr11-stress.ts
```

---

## 4. Concurrency, Race Conditions & State Mutation Stress Scenarios

| Stress Vector | Simulation Method | Success Criteria |
| --- | --- | --- |
| **Prefix-Aware Route Matching** | Testing `isNavItemActive("/admin/quotes/123", "/admin/quotes")`. | Returns `true`; testing exact match `/admin` returns `false` for sub-routes cleanly. |
| **Email Environment Sanitization** | Testing `FROM_EMAIL` with values `"\"Sender\" <mail@domain.com>"`, `'mail@domain.com'`, and leading spaces. | Strips quotes and whitespace cleanly to valid email format. |

---

## 5. Boundary Data, Malicious Inputs & Payload Fuzzing Specs

- **Accessibility Labels:** Collapsed sidebar icon-only links render explicit `aria-label` matching navigation title for screen reader accessibility.
- **Dynamic Route Title Lookup:** `getAdminRouteTitle()` maps nested paths cleanly using shared `ADMIN_NAV_SECTIONS`.

---

## 6. System Resilience & Failure Recovery

- **Invalid Environment Variables:** `lib/email.ts` provides fallback `"Black Swan International <onboarding@resend.dev>"` if `RESEND_FROM_EMAIL` is missing or invalid.

---

## 7. Execution Workflow, Verification Commands & Definition of Done

1. `pnpm run lint` completes with zero errors and zero warnings.
2. `pnpm exec tsc --noEmit` completes with zero errors.
3. Automated test runner `pnpm exec tsx scripts/stress/30-coderabbit-pr11-stress.ts` passes with zero failures.
