# Implementation Spec 29: Phase 4C — Advanced Analytics, Funnel Visualizations & Data Insights

> **Spec ID:** 29-phase-4c-advanced-analytics-and-visualizations  
> **Target Branch / PR:** `phase4A`  
> **Status:** Complete  

> **Created Date:** 2026-08-02  

---

## Executive Summary

Phase 4C establishes the Executive Analytics Portal for Black Swan International at `/admin/analytics`. The portal provides executive leadership, managing directors, and procurement analysts with deep data insights into commercial pipeline volume, equipment category demand, budget range distributions, 5-stage commercial conversion funnels, and Service Level Agreement (SLA) response times.

The system queries Supabase PostgreSQL via Drizzle ORM (`quotes`, `quote_items`, and `contact_inquiries` tables) and supports real-time preset time horizon filtering (7 Days, 30 Days, Year-to-Date, All Time) with URL query state persistence (`useSearchParams`).

---

## 1. What We Are Going to Do

| #   | Target File | Action Required |
| --- | ----------- | --------------- |
| 1   | `context/implementation-specs/29-phase-4c-advanced-analytics-and-visualizations.md` | **[NEW]** Technical specification blueprint for Phase 4C. |
| 2   | `components/admin/analytics/analytics-filter-bar.tsx` | **[NEW]** Preset range filter bar (7d, 30d, ytd, all) with URL query state persistence. |
| 3   | `components/admin/analytics/executive-throughput-cards.tsx` | **[NEW]** 4 High-level throughput KPI cards (Pipeline Volume, SLA Response Time, Conversion Rate, Top Category). |
| 4   | `components/admin/analytics/analytics-charts.tsx` | **[NEW]** Interactive submission trends line/area visualization, equipment category popularity breakdown, and commercial budget distribution chart. |
| 5   | `components/admin/analytics/conversion-funnel-sla.tsx` | **[NEW]** 5-Stage commercial conversion funnel visualizer and SLA response time tracking breakdown. |
| 6   | `app/admin/analytics/page.tsx` | **[NEW]** Executive analytics portal page querying Supabase via Drizzle ORM with date range filtering. |
| 7   | `context/implementation-specs/README.md` | **[MODIFY]** Register Spec 29 in the specification registry. |
| 8   | `context/progress-tracker.md` | **[MODIFY]** Update Phase 4C progress and execution state. |

---

## 2. Why We Are Doing This

1. **Executive Pipeline Intelligence:** Executive decision-makers require real-time visibility into commercial RFQ throughput, total active pipeline volume, and equipment demand patterns to make strategic procurement decisions.
2. **Bottleneck Identification & SLA Tracking:** Tracking the duration from RFQ submission to manager assignment and quotation dispatch helps streamline internal review workflows and maintain strict SLA response targets.
3. **Data-Driven Category Insights:** Aggregating requested equipment quantities (`quote_items`) pinpoints top performing product categories (e.g. Medical Imaging, Telehealth Gateways, Broadcast Encoders, Studio IT Workstations).
4. **URL State & Deep Linking:** Storing date range selections in URL search parameters (`?range=30d`) enables persistent view states, bookmarking, and shareable executive reporting links.
5. **Mobile-First & Accessibility:** In adherence to `context/code-standards.md` and `context/ui-context.md`, all charts, funnel visualizers, and filter bars must render cleanly on screen widths from 320px up to 4K displays.

---

## 3. How We Are Going to Implement It

### Step 1: Date Range Filter Bar (`components/admin/analytics/analytics-filter-bar.tsx`)
- Client component (`"use client"`) using `useSearchParams`, `useRouter`, and `usePathname`.
- Interactive preset options: `7 Days` (`7d`), `30 Days` (`30d`), `Year to Date` (`ytd`), `All Time` (`all`).
- Seamlessly pushes updated query parameters to the URL string without trigger full page reloads.

### Step 2: High-Level Executive Throughput Cards (`components/admin/analytics/executive-throughput-cards.tsx`)
- Server-rendered responsive 4-card grid displaying:
  1. **Total Commercial Pipeline Volume**: Financial aggregate estimation based on submitted RFQ budget ranges or volume calculations.
  2. **Average SLA Response Time**: Average duration from RFQ creation to manager assignment/quote dispatch (in hours/days).
  3. **Overall Conversion Rate**: Percentage of RFQs reaching `quoted` or `completed` status vs. total submissions in range.
  4. **Top Performing Category**: Highest-demand equipment category extracted from `quote_items` breakdown.

### Step 3: Interactive Visualizations & Category Popularity (`components/admin/analytics/analytics-charts.tsx`)
- **RFQ Submission Trends**: Pure SVG and Tailwind responsive time-series visualization illustrating daily/weekly quote volume over selected time horizons.
- **Equipment Category Popularity**: Visual progress/bar breakdown comparing demand across categories (Medical Imaging, Telehealth Gateways, Broadcast Encoders, Studio IT Workstations).
- **Commercial Budget Distribution**: Financial budget range distribution across submitted RFQs (`< 1M NPR`, `1M-5M NPR`, `5M-10M NPR`, `10M+ NPR`).

### Step 4: 5-Stage Conversion Funnel & SLA Analytics (`components/admin/analytics/conversion-funnel-sla.tsx`)
- **5-Stage Conversion Funnel**:
  1. `Submission`: Total incoming RFQs (`pending`).
  2. `Under Review`: RFQs transitioned to `under_review`.
  3. `Manager Assigned`: RFQs assigned to Managing Director (`manager_assigned`).
  4. `Quoted`: Official quotation dispatched (`quoted`).
  5. `Completed/Closed`: Finalized contract or quote (`completed`).
- Displays conversion rates and drop-off metrics between consecutive funnel stages.
- **SLA Response Time Breakdown**: Displays creation-to-assignment, assignment-to-quote, and overall resolution averages with target SLA threshold badges.

### Step 5: Executive Analytics Portal Page (`app/admin/analytics/page.tsx`)
- Next.js Server Component protected by `requireAdminAuth()`.
- Resolves `searchParams.range` (default `30d`).
- Performs optimized Drizzle ORM queries across `quotes`, `quote_items`, and `contact_inquiries` using SQL date filters.
- Assembles layout wrapped inside Suspense boundaries for maximum loading responsiveness.

---

## 4. When We Are Going to Do It

```text
Phase 1: Specification & Progress Tracker Registration
    │
    ▼
Phase 2: Filter Controls Component (`components/admin/analytics/analytics-filter-bar.tsx`)
    │
    ▼
Phase 3: Throughput Cards Component (`components/admin/analytics/executive-throughput-cards.tsx`)
    │
    ▼
Phase 4: Charts & Visualizations (`components/admin/analytics/analytics-charts.tsx`)
    │
    ▼
Phase 5: Funnel & SLA Component (`components/admin/analytics/conversion-funnel-sla.tsx`)
    │
    ▼
Phase 6: Page Integration (`app/admin/analytics/page.tsx`)
    │
    ▼
Phase 7: Type Checking & Lint Validation (`pnpm exec tsc --noEmit` & `pnpm run lint`)
```

---

## 5. Required Data & Data Sources

| Data Requirement | Origin / Source | Usage |
| ---------------- | --------------- | ----- |
| Date Range Filter | `useSearchParams()` (`?range=7d\|30d\|ytd\|all`) | Filtering analytical queries |
| RFQ Records & Statuses | Supabase `quotes` table via Drizzle ORM | Calculating volume, SLA, funnel stages, budget range |
| Equipment Demand | Supabase `quote_items` table via Drizzle ORM | Category demand ranking and category breakdown |
| Inquiry Records | Supabase `contact_inquiries` table via Drizzle ORM | Service demand and total pipeline engagement |

---

## 6. What Could Possibly Go Wrong & Mitigation Plan

| Potential Risk | Root Cause | Prevention / Mitigation Strategy |
| -------------- | ---------- | -------------------------------- |
| **`useSearchParams()` Suspense Error** | Reading `useSearchParams` outside a `<Suspense>` boundary in Next.js App Router | Wrap filter bar component inside a `<Suspense fallback={...}>` boundary |
| **Division by Zero in SLA/Conversion** | Zero RFQ records returned for empty date ranges (e.g. 7d) | Handle zero counts explicitly and display `0%` / `N/A` fallbacks |
| **Chart Overflow on Mobile (320px)** | Hardcoded SVG widths or pixel bounds | Use `viewBox="0 0 100 100"` or percentage-based responsive flex/grid wrappers |

---

## 7. Verification & Definition of Done

1. `pnpm exec tsc --noEmit` completes with zero TypeScript errors.
2. `pnpm run lint` completes with zero ESLint errors or warnings.
3. `/admin/analytics` page renders all throughput cards, trend charts, category breakdowns, conversion funnels, and SLA cards correctly.
4. Switching date range filters updates URL parameters and refetches server analytical metrics without hydration errors.
