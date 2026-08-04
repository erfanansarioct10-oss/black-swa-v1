# Feature Stress Test Plan 38: Phase 5D Automated Proposal Generation & Customer Dispatch

> **Stress Test ID:** 38-phase-5d-automated-proposal-generation-and-customer-dispatch  
> **Corresponding Spec:** [`context/implementation-specs/38-phase-5d-automated-proposal-generation-and-customer-dispatch.md`](../implementation-specs/38-phase-5d-automated-proposal-generation-and-customer-dispatch.md)  
> **Status:** Verified Clean  
> **Created Date:** 2026-08-03  

---

## Executive Summary & Feature Surface Map

This feature stress test plan evaluates the security, resilience, data integrity, and error handling of **Phase 5D: Automated Proposal Generation & Customer Dispatch**.

### Target Attack & Stress Surface

| Surface Type | Path / Target | Associated Roles / Auth Level |
| --- | --- | --- |
| **Server Action** | `actions/proposal.ts` (`createProposalVersionAction`) | Admin Only (`requireAdminAuth`) |
| **Server Action** | `actions/proposal.ts` (`dispatchProposalEmailAction`) | Admin Only (`requireAdminAuth`) |
| **Server Action** | `actions/proposal.ts` (`recordProposalViewAction`) | Public Customer Access / Token Verified |
| **Database Table** | `public.proposal_versions` (Supabase DB) | Authenticated + RLS Policy |
| **UI Component** | `components/admin/quotes/quote-proposal-preview.tsx` | Admin UI Client Component |
| **UI Component** | `components/admin/quotes/proposal-version-history.tsx` | Admin UI Client Component |
| **Public Tracking** | `app/(public)/quote/track/[referenceId]/page.tsx` | Public Customer View |

---

## 1. OWASP Top 10 (2026) Security Audit & Attack Matrix

| OWASP Vector | Specific Vulnerability Scenario | Expected Prevention / Defense | Test Command |
| --- | --- | --- | --- |
| **A01:2026 (Broken Access Control)** | Unauthenticated user invokes `createProposalVersionAction` or `dispatchProposalEmailAction`. | Server action calls `requireAdminAuth()`, rejecting unauthenticated calls with error response. | `npx tsx scripts/stress/38-proposal-generation-stress.ts` |
| **A02:2026 (Cryptographic Failures)** | Weak token generation or exposing lookup tokens in API responses. | High-entropy UUID lookup tokens generated server-side using `crypto.randomUUID()`. | Checked in `actions/quote.ts` |
| **A03:2026 (Injection & Abuse)** | Malicious SQL strings passed into `quoteId` or `referenceId`. | Parameterized queries using Drizzle ORM `eq()` and Zod `.uuid()` validation schemas. | `npx tsx scripts/stress/38-proposal-generation-stress.ts` |
| **A04:2026 (Insecure Design)** | Client submitting validity period of 9999 days or negative days. | Zod schema enforces `.min(1).max(180)` boundary constraints. | `npx tsx scripts/stress/38-proposal-generation-stress.ts` |
| **A05:2026 (Security Misconfiguration)** | Unprotected table in Supabase DB without Row-Level Security. | `proposal_versions` table explicitly enables RLS with authenticated SELECT policy. | `supabase/migrations/20260804000000_create_proposal_versions_table.sql` |
| **A09:2026 (Logging & Auditing)** | Proposal dispatch or customer view events occurring without audit records. | Activity logs written to `quote_activity_logs` table on dispatch and customer view. | Verified in `actions/proposal.ts` |

---

## 2. Supabase RLS & Database Resilience Stress Suite

### RLS Policy Isolation Tests
- **Test Scenario 1 (Cross-Tenant & Unauthenticated Isolation):** Verify RLS policies on `proposal_versions`.
- **Expected Result:** RLS is enabled (`ALTER TABLE proposal_versions ENABLE ROW LEVEL SECURITY;`). Read policy restricts unauthorized writes.

### Database Lock Contention & Transaction Limits
- **Test Scenario 2 (Version Snapshot Concurrency):** Simultaneous proposal version creations for the same `quoteId`.
- **Expected Result:** Drizzle ORM transactions compute version numbers sequentially (`count() + 1`) without deadlock or constraint collision.

---

## 3. Terminal & Script-Driven Automated Test Suite

Executed via terminal CLI utilities:

```bash
# Execute standalone Phase 5D Proposal Generation stress script
npx tsx scripts/stress/38-proposal-generation-stress.ts

# Execute TypeScript typecheck
npx tsc --noEmit

# Execute ESLint validation
pnpm run lint
```

---

## 4. Concurrency, Race Conditions & State Mutation Stress Scenarios

| Stress Vector | Simulation Method | Success Criteria |
| --- | --- | --- |
| **Double Email Dispatch** | Rapid double-click on "Dispatch Email" button. | Client UI disables button during async action; server records dispatch cleanly. |
| **Simultaneous Customer View Receipts** | Multiple clients accessing `/quote/track/[referenceId]` concurrently. | `view_count` increments atomically (`viewCount + 1`) in database transaction. |

---

## 5. Boundary Data, Malicious Inputs & Payload Fuzzing Specs

- **Validity Days Out-of-Bounds:** Submitting `0`, `-5`, or `365` days rejected by Zod `.min(1).max(180)` constraints.
- **Custom Message Overflow:** Strings exceeding 2,000 characters rejected by Zod `.max(2000)` constraint.
- **Malformed Reference ID:** Whitespace-only or invalid reference IDs handled gracefully with structured error returns.

---

## 6. System Resilience & Failure Recovery

- **Resend API Unavailable:** If `RESEND_API_KEY` is absent or network fails, `sendQuoteProposalEmail` logs a warning in local dev and returns mock success or handled error without crashing Next.js server actions.
- **Next.js `after()` Execution Safety:** Background logging tasks run asynchronously inside `after()`, preventing background notification failures from disrupting HTTP response completion.

---

## 7. Execution Workflow, Verification Commands & Definition of Done

To mark this stress test plan **Verified Clean**, all the following conditions have been met:

1. `pnpm run lint` executed with **0 errors and 0 warnings**.
2. `npx tsc --noEmit` compiled cleanly with **0 errors**.
3. Terminal stress test `npx tsx scripts/stress/38-proposal-generation-stress.ts` executed with **6/6 tests passed**.
4. Database migration applied cleanly via `pnpm db:push`.
