# Feature Stress Test Plan 37: Phase 5D Automated Pipeline Workflows & CRM Dashboards

> **Stress Test ID:** 37-phase-5d-pipeline-crm  
> **Corresponding Spec:** `context/implementation-specs/37-phase-5d-automated-pipeline-workflows-and-crm-dashboards.md`  
> **Status:** Verified Clean  
> **Created Date:** 2026-08-03  

---

## Executive Summary & Feature Surface Map

This stress test plan audits **Phase 5D: Automated Pipeline Workflows & CRM Dashboards** for Black Swan International. It targets stage progression bounds, SLA stale lead algorithms, Win/Loss analytics queries, and CSV/JSON export sanitization.

### Target Attack & Stress Surface

| Surface Type | Path / Target | Associated Roles / Auth Level |
|--------------|---------------|-------------------------------|
| **Server Action** | `actions/pipeline.ts` (`updateLeadStageAction`, `getPipelineDataAction`, `getPipelineAnalyticsAction`) | Admin Only (`requireAdminAuth`) |
| **Server Action** | `actions/crm-export.ts` (`exportCrmDataAction`) | Admin Only (`requireAdminAuth`) |
| **Database Tables** | `leads`, `customers`, `quotes`, `quote_activity_logs` | Supabase PostgreSQL + RLS |

---

## 1. OWASP Top 10 (2026) Security Audit & Attack Matrix

| OWASP Vector | Specific Vulnerability Scenario | Expected Prevention / Defense | Test Script / CLI Command |
|--------------|---------------------------------|-------------------------------|---------------------------|
| **A01:2026 (Broken Access Control)** | Unauthenticated call to `exportCrmDataAction` or `updateLeadStageAction`. | `requireAdminAuth()` blocks invocation immediately. | `pnpm exec tsx scripts/stress/37-pipeline-crm-stress.ts` |
| **A03:2026 (Injection & CSV Formula Abuse)** | Lead title contains `=CMD|' /C calc'!A0` or `@SUM(A1:A10)`. | CSV generator prefixes formula characters (`=`, `+`, `-`, `@`, `\t`, `\r`) with `'`. | `pnpm exec tsx scripts/stress/37-pipeline-crm-stress.ts` |
| **A04:2026 (Insecure Design & Boundary Shifts)** | Transitioning lead to invalid stage string (e.g. `HACKED_STAGE`). | Zod schema validation rejects invalid stage strings cleanly. | `pnpm exec tsx scripts/stress/37-pipeline-crm-stress.ts` |
| **A09:2026 (Security Logging & Audit Trails)** | Stage change occurs without generating activity trail. | Activity log entry automatically inserted into `quote_activity_logs` or lead log when linked. | `pnpm exec tsx scripts/stress/37-pipeline-crm-stress.ts` |

---

## 2. Supabase RLS & Database Resilience Stress Suite

1. **Stage Mutation Bounds Test:**
   - Attempt stage progression across all valid stages (`new` -> `contacted` -> `assessment` -> `proposal_sent` -> `negotiation` -> `closed_won`).
   - Confirm atomic status update and timestamp tracking.

2. **SLA Stale Lead Detection Test:**
   - Query leads with `updatedAt` set to 50 hours ago in `negotiation` stage vs 10 hours ago.
   - Confirm `isStale` SLA flag evaluates to `true` for >48h lead and `false` for <48h lead.

3. **Win/Loss & Cycle Duration Analytics Test:**
   - Compute Win Rate % with zero closed leads (check division by zero safety).
   - Compute Win Rate % and average sales cycle days across simulated won/lost leads.

---

## 3. Terminal & Script-Driven Automated Test Suite

```bash
# Execute Phase 5D standalone stress runner
pnpm exec tsx scripts/stress/37-pipeline-crm-stress.ts

# Execute master Phase 5 stress suite
pnpm exec tsx scripts/stress/run-phase5-stress-suite.ts
```

---

## 4. Concurrency, Race Conditions & State Mutation Stress Scenarios

| Stress Vector | Simulation Method | Success Criteria |
|---------------|-------------------|------------------|
| **Concurrent Stage Updates** | `Promise.all([updateStage(id, 'negotiation'), updateStage(id, 'closed_won')])` | Serial execution; final state is valid enum value with corresponding audit log entry. |
| **Export Under Load** | Multi-page CRM export request for 1,000 lead records. | Formatted CSV/JSON returned under 500ms without memory leakage. |

---

## 5. Boundary Data, Malicious Inputs & Payload Fuzzing Specs

- **CSV Formula Injections:** String payloads starting with `=`, `+`, `-`, `@`, `\t`, `\r`.
- **Invalid Date Horizon Presets:** Inputs like `invalid_horizon`, `999d`, `select * from users`.
- **Extreme Valuations:** Lead estimated value of `0`, `999,999,999` NPR.

---

## 6. System Resilience & Failure Recovery

- Safe fallback for missing linked quote/customer during pipeline render.
- Return zeroed metrics if database contains zero lead or quote records.

---

## 7. Execution Workflow, Verification Commands & Definition of Done

1. Run `pnpm exec tsx scripts/stress/37-pipeline-crm-stress.ts` - All assertions pass.
2. Run `pnpm exec tsx scripts/stress/run-phase5-stress-suite.ts` - All Phase 5 suites pass.
3. Run `pnpm run build` - Production build passes with zero errors.
