# Implementation Spec 20: Phase 3D - Public Quote Tracking Portal (`/quote/track/[referenceId]`)

> **Spec ID:** 20-phase-3d-public-quote-tracking-portal  
> **Target Branch / PR:** `main`  
> **Status:** Draft  
> **Created Date:** 2026-08-01

---

## Executive Summary

Phase 3D establishes the public quote tracking portal (`/quote/track` and `/quote/track/[referenceId]`) for Black Swan International. This feature allows B2B buyers (medical center procurement leads, broadcast station directors) to track the real-time status of their quotation requests using either their RFQ Reference ID (e.g. `RFQ-20260801-9F2C`) and email verification or a direct secure token link from their confirmation email. The portal features a 5-step visual progress timeline, equipment line items breakdown, assigned account manager contact card, and quotation documentation/PDF download interface.

---

## 1. What We Are Going to Do

| #   | Target File | Action Required |
| --- | --- | --- |
| 1   | `app/(public)/quote/track/page.tsx` | **[NEW]** Public Search Lookup Page for RFQ reference lookup (Reference ID + Email address verification form). |
| 2   | `app/(public)/quote/track/[referenceId]/page.tsx` | **[NEW]** Dynamic Status Tracking Page supporting search params `token` and `email` or inline lookup modal. |
| 3   | `components/quote/quote-tracking-search-form.tsx` | **[NEW]** Search lookup form component with Zod validation (`quoteTrackingLookupSchema`) and navigation handler. |
| 4   | `components/quote/quote-tracking-details.tsx` | **[NEW]** Comprehensive tracking UI with progress timeline, manager card, equipment list, and quotation PDF/print interface. |
| 5   | `components/quote/quote-tracking-timeline.tsx` | **[NEW]** 5-stage responsive stepper indicator component for RFQ status visualization. |
| 6   | `context/implementation-specs/README.md` | **[MODIFY]** Register Spec 20 in the specification registry index. |
| 7   | `context/progress-tracker.md` | **[MODIFY]** Update progress tracker for Phase 3D completion status. |

---

## 2. Why We Are Doing This

1. **Self-Service Transparency & Trust (`context/project-overview.md`):**  
   Enterprise procurement leads require clear status updates (Pending -> Under Review -> Manager Assigned -> Quoted -> Completed) without calling customer support.
2. **Direct Link Resolution via Confirmation Emails (`context/architecture.md`):**  
   Automated confirmation emails send links containing secure `lookupToken` parameters (`/quote/track/[referenceId]?token=[uuid]`), allowing instant access without password barriers.
3. **Mobile-First Responsive Usability (`context/code-standards.md`, `context/ui-context.md`):**  
   The tracking portal must be fully responsive down to 320px screen width with clean touch controls and clear typography hierarchy.

---

## 3. How We Are Going to Implement It

### Step 1: Search Lookup Page (`app/(public)/quote/track/page.tsx` & `components/quote/quote-tracking-search-form.tsx`)
- Server Page with SEO metadata (`generatePageMetadata`), rendering breadcrumbs `Home > Request Quote > Track Quote`.
- Client form component (`QuoteTrackingSearchForm`) using `react-hook-form` + `@hookform/resolvers/zod` with `quoteTrackingLookupSchema`.
- Input fields: Reference ID (uppercase placeholder `RFQ-YYYYMMDD-XXXX`) and Email Address.
- On submit, redirects user to `/quote/track/${referenceId}?email=${encodeURIComponent(email)}`.

### Step 2: Dynamic Tracking Detail Page (`app/(public)/quote/track/[referenceId]/page.tsx`)
- Server Component accepting `params: Promise<{ referenceId: string }>` and `searchParams: Promise<{ token?: string; email?: string }>`.
- Data Fetching Logic:
  - If `token` present: Calls `getQuoteByLookupTokenAction(token)`.
  - If `email` present: Calls `getQuoteByTrackingAction({ referenceId, email })`.
  - If neither or fetch unsuccessful: Renders inline lookup verification card asking the user for their email address.
- When record is successfully fetched, renders `QuoteTrackingDetails`.

### Step 3: Visual Progress Timeline Component (`components/quote/quote-tracking-timeline.tsx`)
- Step stages:
  1. `pending`: **RFQ Submitted** (Received & Logged)
  2. `under_review`: **Under Review** (Engineering & Spec Audit)
  3. `manager_assigned`: **Manager Assigned** (Dedicated Director Handling)
  4. `quoted`: **Quotation Issued** (Formal Pricing Ready)
  5. `completed`: **Completed** (Procurement Finalized)
- Responsive visual stepper (horizontal on desktop, vertical on small mobile viewports) with icons, status colors, and active/completed states.

### Step 4: Full Tracking Detail View (`components/quote/quote-tracking-details.tsx`)
- Header Card: Reference ID badge, status pill, creation date.
- Visual Timeline section.
- **Assigned Account Manager Card**: Shows assigned Managing Director details or default assigned engineering team fallback contact info (`support@blackswan.com.np`, +977 1-4XXXXXX).
- **Project Specifications Card**: Contact details, company name, budget range, timeline, project scope text.
- **Requested Equipment Items Breakdown Table**: Product title, category, quantity, item notes/specifications.
- **Official Quotation Interface**: If status is `quoted` or `completed`, shows "Print / Download Official Quotation (PDF)" button triggering native print window formatted for official proposal output, plus a direct button to contact assigned manager.

---

## 4. When We Are Going to Do It

```text
Phase 1: Build Visual Stepper & Form (`quote-tracking-timeline.tsx`, `quote-tracking-search-form.tsx`)
    │
    ▼
Phase 2: Build Tracking Detail View (`quote-tracking-details.tsx`)
    │
    ▼
Phase 3: Route Pages Integration (`/quote/track/page.tsx` & `/quote/track/[referenceId]/page.tsx`)
    │
    ▼
Phase 4: Specification & Progress Updates (`README.md`, `progress-tracker.md`)
    │
    ▼
Phase 5: Verification (Build, Linting, Typecheck & Manual UX validation)
```

---

## 5. Required Data & Data Sources

| Data Requirement | Origin / Source | Usage |
| --- | --- | --- |
| Reference ID & Email | Form input or search params | Verification and database lookup parameters. |
| Lookup Token | Query string `?token=...` | Direct email verification bypass. |
| Quote & Items Record | `quotes` and `quote_items` tables via `getQuoteByTrackingAction` or `getQuoteByLookupTokenAction` | Full tracking portal rendering data. |

---

## 6. What Could Possibly Go Wrong & Mitigation Plan

| Potential Risk | Root Cause | Prevention / Mitigation Strategy |
| --- | --- | --- |
| **Invalid or Unmatched Reference ID / Email** | User typos in reference ID or email address. | Display user-friendly alert card with instructions and link back to lookup form. |
| **Direct Access Without Email or Token** | User directly visits `/quote/track/RFQ-1234` without params. | Render inline email verification form on the page instead of 404 or blank screen. |
| **Print / PDF Layout Distortion** | Default CSS headers/footers in browser print. | Use custom `@media print` rules for clean single-page invoice layout. |

---

## 7. Verification & Definition of Done

1. `pnpm run lint` passes with 0 errors and 0 warnings.
2. `pnpm exec tsc --noEmit` passes with 0 errors.
3. `/quote/track` renders search lookup form and correctly routes to `/quote/track/[referenceId]`.
4. Visual progress timeline accurately highlights current quote status.
5. Desktop and mobile viewports render without horizontal overflow (tested down to 320px).
