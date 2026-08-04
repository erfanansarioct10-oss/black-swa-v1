# Implementation Spec 37: Phase 5D Automated Pipeline Workflows & CRM Dashboards

> **Spec ID:** 37-phase-5d-automated-pipeline-workflows-and-crm-dashboards  
> **Target Branch / PR:** `phase5d`  
> **Status:** Complete  
> **Created Date:** 2026-08-03  

---

## Executive Summary

Phase 5D introduces **Automated Pipeline Workflows & CRM Dashboards** for Black Swan International's admin portal. This module builds upon Phase 5A (Customer Database), Phase 5B (Lead Management), and Phase 5C (Quotation Workbench) to establish an end-to-end B2B sales pipeline management system.

Key deliverables include:
1. **Interactive Sales Pipeline Kanban Board (`/admin/crm/pipeline/page.tsx`):** Stage progression columns (`New Lead` -> `Contacted` -> `Assessment` -> `Proposal Sent` -> `Negotiation` -> `Closed Won` / `Closed Lost`), real-time pipeline valuation in Nepalese Rupees (`Rs. NPR`), and SLA/stale lead indicators (>48h in negotiation/review).
2. **Executive CRM Analytics & Conversion Insights (`/admin/crm/analytics/page.tsx`):** Win/Loss metrics, average sales cycle length, pipeline conversion funnels, and dynamic date horizon filters (7 Days, 30 Days, YTD, All Time).
3. **Enterprise Data Export Center (`actions/crm-export.ts`):** Sanitized CSV and JSON export data streams for accounts, leads, and quotation records, equipped with anti-CSV-injection safeguards and Clerk RBAC protection (`requireAdminAuth`).
4. **Pipeline Server Actions & Validation Schemas (`actions/pipeline.ts` & `schemas/pipeline.ts`):** Type-safe mutations for atomic stage transitions, SLA calculations, activity log creation, and analytics queries.
5. **Automated Stress Testing & Audit Suite (`scripts/stress/37-pipeline-crm-stress.ts`):** CLI runner verifying stage bounds, SLA calculations, export sanitization, and registering Spec 37 in the master Phase 5 stress suite.

---

## 1. What We Are Going to Do

List of files to be created, modified, or registered:

| # | Target File | Action Required | Responsibility |
|---|-------------|-----------------|----------------|
| 1 | `schemas/pipeline.ts` | **[NEW]** | Zod schemas for stage updates, SLA flags, date horizon filters, and export parameters. |
| 2 | `actions/pipeline.ts` | **[NEW]** | Type-safe Server Actions for Kanban stage movement, SLA detection, and analytics. |
| 3 | `actions/crm-export.ts` | **[NEW]** | Server Actions generating sanitized CSV & JSON export streams for customers, leads, and quotes. |
| 4 | `app/admin/crm/pipeline/page.tsx` | **[NEW]** | Interactive Sales Pipeline Kanban Board page route. |
| 5 | `components/admin/crm/pipeline-kanban.tsx` | **[NEW]** | Kanban board component with column valuations, stage shift controls, and SLA badges. |
| 6 | `app/admin/crm/analytics/page.tsx` | **[NEW]** | Executive CRM Analytics & Conversion Insights page route. |
| 7 | `components/admin/crm/crm-analytics-view.tsx` | **[NEW]** | Win/Loss ratio cards, cycle duration analytics, valuation metrics, and conversion funnel view. |
| 8 | `constants/admin-navigation.ts` | **[MODIFY]** | Add CRM Pipeline and CRM Analytics sub-links under CRM & Operations section. |
| 9 | `context/implementation-specs/37-phase-5d-automated-pipeline-workflows-and-crm-dashboards.md` | **[NEW]** | Technical specification document. |
| 10 | `context/feature-stress-test/37-phase-5d-pipeline-crm.md` | **[NEW]** | Feature stress test plan document. |
| 11 | `scripts/stress/37-pipeline-crm-stress.ts` | **[NEW]** | Automated TypeScript stress test runner. |
| 12 | `scripts/stress/run-phase5-stress-suite.ts` | **[MODIFY]** | Register Spec 37 runner into master Phase 5 stress suite runner. |
| 13 | `context/implementation-specs/README.md` | **[MODIFY]** | Register Spec 37 in the specification index. |
| 14 | `context/feature-stress-test/README.md` | **[MODIFY]** | Register Spec 37 in the stress test index. |
| 15 | `context/progress-tracker.md` | **[MODIFY]** | Set Phase 5D as Current Phase & Goal. |

---

## 2. Why We Are Doing This

1. **Project Architecture Alignment (`context/architecture.md`):** Consolidates CRM operations into a unified Kanban pipeline and executive dashboard with Clerk RBAC security (`requireAdminAuth`), Drizzle ORM queries, and Next.js 16 App Router Server Components.
2. **Quote-First B2B Model (`context/project-overview.md`):** Medical & Broadcast Technology procurements rely on multi-stage consultations, technical reviews, and custom proposals. The Kanban pipeline maps directly to this high-value enterprise workflow.
3. **Data Integrity & Export Security:** Enterprise ERP integration requires sanitized CSV/JSON exports protected against CSV Formula Injection attacks (`=`, `+`, `-`, `@`, `\t`, `\r`) while preserving financial precision in integer NPR units (`Rs.`).
4. **Service Level Agreement (SLA) & Stale Lead Tracking:** Identifies leads and quotes stuck in negotiation or review beyond 48 hours to eliminate sales friction and prevent opportunity drop-offs.

---

## 3. How We Are Going to Implement It

### Step 1: Validation Schemas (`schemas/pipeline.ts`)

Define Zod schemas for:
- `leadStageUpdateSchema`: Validate `leadId`, `newStage` (`new`, `contacted`, `assessment`, `proposal_sent`, `negotiation`, `closed_won`, `closed_lost`), and optional `note`.
- `crmDateHorizonSchema`: Validate date horizons (`7d`, `30d`, `ytd`, `all`).
- `crmExportSchema`: Validate `exportType` (`customers`, `leads`, `quotes`), `format` (`csv`, `json`), and `dateHorizon`.

### Step 2: Pipeline & Export Server Actions (`actions/pipeline.ts` & `actions/crm-export.ts`)

1. **`actions/pipeline.ts`**:
   - `updateLeadStageAction`: Enforces `requireAdminAuth()`, updates lead `status` (and syncs with quote/customer status if linked), logs action in activity logs, and updates `updatedAt`.
   - `getPipelineDataAction`: Fetches active leads grouped into the 6 pipeline stages, calculates per-stage financial valuation sum, and computes SLA warning flags (>48h since last update in active stages).
   - `getPipelineAnalyticsAction`: Calculates Win/Loss totals, Win Rate %, Average Sales Cycle duration (days between `createdAt` and completion/won), pipeline conversion funnel metrics, and total pipeline valuation.

2. **`actions/crm-export.ts`**:
   - `exportCrmDataAction`: Enforces `requireAdminAuth()`, queries target entity (`customers`, `leads`, or `quotes`), sanitizes all string fields against CSV injection using formula prefix escaping (`'` prefix for `=`, `+`, `-`, `@`), formats JSON or CSV payloads, and returns a download payload.

### Step 3: UI Components (`components/admin/crm/...`)

1. **`components/admin/crm/pipeline-kanban.tsx`**:
   - Mobile-first responsive layout with stage columns (`New Lead`, `Contacted`, `Assessment`, `Proposal Sent`, `Negotiation`, `Closed Won/Lost`).
   - Per-stage aggregate financial valuation header (formatted in `Rs. NPR`).
   - Lead cards showing company, contact, estimated value, priority badge, manager assignment, and SLA Stale Alert badge (>48h).
   - Quick stage transition controls (Move Forward / Move Backward / Mark Won / Mark Lost).

2. **`components/admin/crm/crm-analytics-view.tsx`**:
   - Date horizon switcher tabs (7 Days, 30 Days, YTD, All Time).
   - Executive metric cards (Win Rate %, Total Pipeline Value, Won Revenue, Avg Sales Cycle Days).
   - Visual stage conversion funnel with percentage progression steps.
   - Quick CSV/JSON export dropdown powered by `exportCrmDataAction`.

### Step 4: Admin Navigation (`constants/admin-navigation.ts`)

Update `ADMIN_NAV_SECTIONS` under `CRM & Operations`:
- Add `{ title: "Sales Pipeline", href: "/admin/crm/pipeline", iconName: "Target" }`
- Add `{ title: "CRM Analytics", href: "/admin/crm/analytics", iconName: "BarChart3" }`

---

## 4. When We Are Going to Do It

```text
Phase 1: Validation Schemas & Data Layer (`schemas/pipeline.ts`, `actions/pipeline.ts`, `actions/crm-export.ts`)
    │
    ▼
Phase 2: Navigation & Routes (`constants/admin-navigation.ts`, `/admin/crm/pipeline`, `/admin/crm/analytics`)
    │
    ▼
Phase 3: Interactive UI Components (`components/admin/crm/pipeline-kanban.tsx`, `components/admin/crm/crm-analytics-view.tsx`)
    │
    ▼
Phase 4: Automated Stress Suite & Security Audits (`37-pipeline-crm-stress.ts`, `run-phase5-stress-suite.ts`)
    │
    ▼
Phase 5: Production Build Verification (`pnpm run build`)
```

---

## 5. Required Data & Data Sources

| Data Requirement | Origin / Source | Usage |
|------------------|-----------------|-------|
| Lead Pipeline Data | `leads` table (`db/schema.ts`) | Kanban stage columns, SLA flags, valuations |
| Customer Account Data | `customers` table (`db/schema.ts`) | Account links, export streams |
| Quote Financial Data | `quotes` table (`db/schema.ts`) | Quote totals, conversion funnels, export streams |
| Clerk Admin Role | `lib/admin-auth.ts` (`requireAdminAuth`) | Security guard for actions & exports |

---

## 6. What Could Possibly Go Wrong & Mitigation Plan

| Potential Risk | Root Cause | Prevention / Mitigation Strategy |
|----------------|------------|----------------------------------|
| **CSV Injection Vulnerability** | Malicious lead title containing `=cmd|' /C calc'!A0` executed in Excel. | Sanitize string fields by prefixing formula characters (`=`, `+`, `-`, `@`) with `'`. |
| **Invalid Stage Mutations** | Client submitting invalid status strings. | Validate all mutations via Zod `leadStageUpdateSchema` enum checks. |
| **Missing Clerk RBAC Security** | Unauthenticated callers invoking Server Actions. | Enforce `requireAdminAuth()` as first line in every Server Action. |
| **Numeric Division by Zero** | Calculating Win Rate when total closed leads = 0. | Safely handle `0` denominator by returning `0%` win rate. |

---

## 7. Verification & Definition of Done

1. `schemas/pipeline.ts`, `actions/pipeline.ts`, `actions/crm-export.ts` implemented and type-checked.
2. Sales Pipeline Kanban Board route (`/admin/crm/pipeline`) and Executive CRM Analytics route (`/admin/crm/analytics`) fully functional.
3. Enterprise Data Export Center generating sanitized CSV & JSON file downloads.
4. Stress test spec `context/feature-stress-test/37-phase-5d-pipeline-crm.md` and automated runner `scripts/stress/37-pipeline-crm-stress.ts` created and executed via `run-phase5-stress-suite.ts`.
5. `pnpm run build` compiles cleanly with zero TypeScript or Next.js build errors.
