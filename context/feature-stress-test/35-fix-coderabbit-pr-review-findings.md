# Feature Stress Test & Security Audit Spec 35: CodeRabbit PR Review Findings Audit (PR #14 / Commit 7e695b6)

> **Spec ID:** 35-fix-coderabbit-pr-review-findings  
> **Target Feature / Layer:** Lead Conversion Transactions, Search Length Bounds, Notification Counts, Inquiry Status Validation, Database Indexes & RLS Policies  
> **Status:** Verified Clean ✅  
> **Created Date:** 2026-08-02  

---

## Executive Summary

This stress specification defines automated concurrency, security, boundary, and data integrity test scenarios to validate the resolution of review findings raised by CodeRabbit on PR #14 (commit `7e695b6`).

---

## 1. Attack Vectors & Vulnerability Matrix

| Attack Vector / Risk | OWASP Category | Target Surface | Defense Mechanism Under Test |
| --- | --- | --- | --- |
| Concurrent Lead Conversion Race Condition | A01:2026 Broken Access / Race Condition | `convertLeadToCustomerAction` | Database `db.transaction(...)` atomicity & UNIQUE email index |
| Unbounded Search Query Payload | A04:2026 Insecure Design / DoS | `adminSearchAction` | Length check (`query.length > 500`) returning empty data |
| Invalid Enum Status Injection | A03:2026 Injection / Input Validation | `updateInquiryStatusAction` | Runtime enum check (`INQUIRY_STATUSES.includes`) & `.returning()` check |
| Notification Count Truncation | A04:2026 Insecure Design / Data Accuracy | `getAdminNotificationsAction` | Uncapped `count(*)` aggregate queries |
| Unrestricted Database Policy Access | A01:2026 Broken Access / Supabase RLS | `public.customers` & `public.leads` | RLS policy targeting `service_role` only |

---

## 2. Test Scenarios

### Scenario 1: Concurrent Lead Conversion Atomicity
- Issue two concurrent `convertLeadToCustomerAction` calls with `Promise.all` targeting the same lead and email.
- **Expected Outcome**: Exactly one conversion transaction succeeds, zero duplicate customer rows are created, and unassigned quotes with matching email are correctly linked.

### Scenario 2: Unbounded Search Query Payload Handling
- Pass a 600-character string payload to `adminSearchAction`.
- **Expected Outcome**: The action returns `{ success: true, data: { quotes: [], inquiries: [] } }` instantly without hitting the database.

### Scenario 3: Inquiry Status Validation & Non-Existent ID Rejection
- Pass an invalid status string (`"invalid_status"`) and a non-existent UUID to `updateInquiryStatusAction`.
- **Expected Outcome**: The action returns `{ success: false }` for invalid status and `{ success: false, error: "Inquiry was not found." }` for non-existent UUIDs.

### Scenario 4: Accurately Uncapped Notification Drawer Counts
- Call `getAdminNotificationsAction` and verify `totalUnread = unassignedQuotesCount + newInquiriesCount`.
- **Expected Outcome**: Counts are calculated from DB `count(*)` aggregates rather than array length caps (`.limit(10)`).

### Scenario 5: Environment Variable Bypass Restoration
- Measure `process.env.ADMIN_DEV_BYPASS` state before and after running stress tests.
- **Expected Outcome**: `ADMIN_DEV_BYPASS` key is completely deleted when it was previously `undefined`.

---

## 3. Automated Script Runner

- **Runner Location**: `scripts/stress/35-coderabbit-pr14-stress.ts`
- **Suite Master Integration**: `scripts/stress/run-phase5-stress-suite.ts`

```bash
npx tsx scripts/stress/35-coderabbit-pr14-stress.ts
```

---

## 4. Verification & Clean Execution Log

- **Assertions Run**: 6
- **Errors Found**: 0
- **Status**: VERIFIED CLEAN ✅
