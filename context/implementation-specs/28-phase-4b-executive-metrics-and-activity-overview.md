# Implementation Spec 28: Phase 4B — Executive Metrics & Activity Overview Dashboard

> **Spec ID:** 28-phase-4b-executive-metrics-and-activity-overview  
> **Target Branch / PR:** `phase4A`  
> **Status:** Complete  
> **Created Date:** 2026-08-02  


---

## Executive Summary

Phase 4B implements the Executive Metrics & Activity Overview Dashboard for the Black Swan International Administrative Portal (`/admin`). This dashboard provides executive leadership and Managing Directors with real-time visibility into incoming commercial quotation requests (RFQs), client service inquiries, processing throughput, system health diagnostics, and urgent actionable directives.

It features 4 responsive Executive KPI Summary Cards, a High-Priority Directives Banner highlighting unassigned RFQs and unreviewed inquiries, and a unified real-time Recent Activity Stream merging RFQs and contact dispatches sorted chronologically.

---

## 1. What We Are Going to Do

| #   | Target File | Action Required |
| --- | ----------- | --------------- |
| 1   | `context/implementation-specs/28-phase-4b-executive-metrics-and-activity-overview.md` | **[NEW]** Technical specification blueprint for Phase 4B. |
| 2   | `components/admin/pending-directives-alert.tsx` | **[NEW]** High-priority executive alert banner component for unassigned RFQs and unreviewed inquiries. |
| 3   | `components/admin/recent-activity-stream.tsx` | **[NEW]** Combined, real-time activity stream displaying RFQ submissions and contact inquiries with filtering tabs and status indicators. |
| 4   | `app/admin/page.tsx` | **[MODIFY]** Upgrade executive dashboard page to query Supabase via Drizzle ORM, render 4 KPI summary cards, priority directives alert banner, and recent activity feed. |
| 5   | `context/implementation-specs/README.md` | **[MODIFY]** Register Spec 28 in the registry index. |
| 6   | `context/progress-tracker.md` | **[MODIFY]** Update current progress status and session notes. |

---

## 2. Why We Are Doing This

1. **Executive Operational Visibility:** Managing Directors require immediate insight into pending customer quotations and active service inquiries upon accessing `/admin`.
2. **Actionable Directive Prioritization:** High-priority, unassigned RFQ submissions require prompt administrative assignment to prevent delayed sales quotes.
3. **Data Aggregation & Efficiency:** Combining RFQ requests and customer inquiries into a unified activity feed eliminates manual switching between separate database views.
4. **Mobile-First Responsiveness & Accessibility:** In accordance with `context/code-standards.md` and `context/ui-context.md`, all metric cards, alert banners, and activity streams must be fully responsive across mobile (320px+), tablet, and desktop viewports.

---

## 3. How We Are Going to Implement It

### Step 1: High-Priority Directives Banner (`components/admin/pending-directives-alert.tsx`)

Build a server/client visual alert banner featuring:
- **Priority Metrics**: Displays unassigned pending RFQs count (`quotes` table where `status = 'pending'` and `assigned_manager_id IS NULL`) and unreviewed contact inquiries count (`contact_inquiries` table where `status = 'new'`).
- **Visual Styling**: High-contrast amber/emerald border, alert shield icon (`AlertTriangle` / `ShieldAlert`), priority pill badge.
- **Directives CTA**: Quick navigation buttons to filter RFQs (`/admin/quotes`) or inquiries (`/admin/inquiries`).

### Step 2: Recent Activity Stream (`components/admin/recent-activity-stream.tsx`)

Build an interactive client/server feed displaying:
- **Unified Data Schema**: Combines RFQ submissions and contact inquiries into a unified sorted array (`created_at desc`).
- **Interactive Filter Tabs**: Allows switching between "All Activity", "RFQs Only", and "Inquiries Only".
- **Item Details**: Displays customer name, company name, equipment category/service slug, status badge (`pending`, `under_review`, `new`, etc.), formatted relative timestamp ("10m ago", "2h ago"), and direct item detail link.

### Step 3: Executive Metrics Dashboard Page (`app/admin/page.tsx`)

Update `AdminDashboardPage` as a Next.js Server Component:
- **Drizzle ORM Queries**: Executed concurrently via `Promise.all` inside `try/catch`:
  1. `pendingQuotesCount`: `quotes` table where `status = 'pending'`.
  2. `unassignedQuotesCount`: `quotes` table where `status = 'pending'` and `assignedManagerId IS NULL`.
  3. `processedQuotesCount`: `quotes` table where `status != 'pending'`.
  4. `totalQuotesCount`: `quotes` table total count.
  5. `activeInquiriesCount`: `contact_inquiries` table where `status IN ('new', 'in_progress')`.
  6. `newInquiriesCount`: `contact_inquiries` table where `status = 'new'`.
  7. `latestQuotes`: Top 6 quotes ordered by `createdAt desc`.
  8. `latestInquiries`: Top 6 contact inquiries ordered by `createdAt desc`.
- **4 Responsive KPI Cards Grid**:
  1. **Pending RFQs**: Count of pending requests, with unassigned breakdown subtext.
  2. **Active Inquiries**: Count of active inquiries, with unreviewed count subtext.
  3. **Total Quotes Processed**: Count of processed quotes and conversion throughput.
  4. **System Health Status**: Database connection latency and operational status badge.
- **Directives Banner & Activity Stream**: Rendered below KPI cards with desktop sidebar quick actions.

---

## 4. When We Are Going to Do It

```text
Phase 1: Create Implementation Spec 28 & Update Registry / Progress Tracker
    │
    ▼
Phase 2: High-Priority Directives Component (`components/admin/pending-directives-alert.tsx`)
    │
    ▼
Phase 3: Recent Activity Stream Component (`components/admin/recent-activity-stream.tsx`)
    │
    ▼
Phase 4: Executive Dashboard Page Assembly (`app/admin/page.tsx`)
    │
    ▼
Phase 5: Type Safety & Lint Validation (`pnpm exec tsc --noEmit` & `pnpm run lint`)
```

---

## 5. Required Data & Data Sources

| Data Requirement | Origin / Source | Usage |
| ---------------- | --------------- | ----- |
| Pending Quotes Count | Drizzle `db.select().from(quotes).where(eq(quotes.status, 'pending'))` | KPI Card 1 & Priority Alert Banner |
| Unassigned Quotes Count | Drizzle `db.select().from(quotes).where(and(eq(quotes.status, 'pending'), isNull(quotes.assignedManagerId)))` | Priority Alert Banner |
| Processed Quotes Count | Drizzle `db.select().from(quotes).where(ne(quotes.status, 'pending'))` | KPI Card 3 |
| Active Inquiries Count | Drizzle `db.select().from(contactInquiries).where(inArray(contactInquiries.status, ['new', 'in_progress']))` | KPI Card 2 |
| New Inquiries Count | Drizzle `db.select().from(contactInquiries).where(eq(contactInquiries.status, 'new'))` | Priority Alert Banner |
| Latest Activity Items | Drizzle queries on `quotes` and `contactInquiries` ordered by `createdAt desc` | Recent Activity Stream |

---

## 6. What Could Possibly Go Wrong & Mitigation Plan

| Potential Risk | Root Cause | Prevention / Mitigation Strategy |
| -------------- | ---------- | -------------------------------- |
| **Database Query Overhead** | Executing sequential queries sequentially on page render | Execute queries concurrently using `Promise.all` and limit activity stream records. |
| **Schema Inconsistency** | Merging heterogeneous records (`quotes` vs `contactInquiries`) | Map both types into a strictly typed `ActivityItem` union before rendering. |
| **Date Hydration Mismatch** | Client-side formatting of server dates | Use ISO date strings or pre-formatted timestamps passed from Server Component. |

---

## 7. Verification & Definition of Done

1. `pnpm exec tsc --noEmit` completes with 0 errors.
2. `pnpm run lint` completes with 0 errors.
3. 4 executive KPI summary cards render cleanly with responsive layout.
4. High-priority directives alert banner highlights unassigned RFQs and new inquiries.
5. Combined recent activity stream lists real-time items with status badges and links.
