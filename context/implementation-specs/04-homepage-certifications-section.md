# Implementation Spec 04: Homepage Certifications Section

> **Spec ID:** 04-homepage-certifications-section  
> **Target Branch / PR:** `main` / Homepage Enhancement  
> **Status:** Draft (Awaiting Approval)  
> **Created Date:** 2026-07-30  

---

## Executive Summary

This specification defines the architectural design, data structures, and visual implementation for a new **Certifications & Compliance** section on the Black Swan International public homepage (`app/(public)/page.tsx`), situated directly below the **Brand Partners** marquee (`<BrandMarquee />`).

The section highlights Black Swan International's credentials across Medical Technology Hardware quality management, electrical safety, EU MDR compliance, FDA infrastructure standards, and Broadcast RF/Environmental compliance.

---

## 1. What We Are Going to Do

List of files to be created or modified:

| #   | Target File                                         | Action Required                                                                                           |
| --- | --------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| 1   | `constants/certifications.ts`                       | **[NEW]** Define `CertificationItem` interface and export structured array of 6 primary certifications.    |
| 2   | `components/sections/certifications-section.tsx`   | **[NEW]** Implement mobile-first interactive card grid section with status badges and detail `Dialog` view. |
| 3   | `app/(public)/page.tsx`                             | **[MODIFY]** Render `<CertificationsSection />` directly after `<BrandMarquee />`.                        |
| 4   | `context/progress-tracker.md`                     | **[MODIFY]** Update `In Progress` and `Completed` tracking for Spec 04.                                   |

---

## 2. Why We Are Doing This

1. **Project Standards Alignment:** Fulfills B2B trust building objectives defined in `context/project-overview.md` and aligns with visual hierarchy rules in `context/ui-context.md`.
2. **Accessibility & Usability:** Adheres to WCAG AAA color contrast, WAI-ARIA dialog focus-trapping (via `shadcn/ui` Dialog), keyboard navigation (`Tab`, `Escape`), and touch target guidelines (minimum 44x44px interactive areas).
3. **Data Hygiene & Performance:** Lightweight TypeScript constants with static icon bindings (`lucide-react`) and zero runtime fetch overhead. Fully compatible with Next.js 16 App Router SSR.

---

## 3. How We Are Going to Implement It

### Step 1: Data Models & Shared Constants (`constants/certifications.ts`)

Define `CertificationItem` interface and structured list of 6 credentials:

```typescript
export interface CertificationItem {
  id: string;
  code: string;
  title: string;
  category: "medical" | "broadcast" | "quality";
  categoryLabel: string;
  issuingBody: string;
  certificateId: string;
  scope: string;
  summary: string;
  details: string;
  auditFrequency: string;
  badgeColor: string;
  iconName: string;
}
```

Primary items included:
1. **ISO 13485:2016**: Medical Devices Quality Management System (TÜV SÜD)
2. **IEC 60601-1**: Medical Electrical Equipment Safety & EMC (BSI Group)
3. **CE MDR Marking**: European Medical Device Regulation & Directives (DEKRA)
4. **FDA Registered**: US FDA Medical Device Infrastructure & Gateway Compliance
5. **ISO 9001:2015**: Quality Management System Standard (TÜV SÜD)
6. **FCC Class A/B & RoHS**: Broadcast Radio Frequency & Environmental Safety Compliance

### Step 2: Component Implementation (`components/sections/certifications-section.tsx`)

- Uses client-side state for modal dialog (`selectedCert`).
- Uses `shadcn/ui` `Dialog`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogDescription` for accessible modal experience.
- Renders responsive grid:
  - Mobile: `grid-cols-1`
  - Tablet: `grid-cols-2`
  - Desktop: `grid-cols-3`
- Visual styling:
  - Soft ambient container: `bg-slate-50/70 border-y border-slate-200/80`
  - Cards: `bg-card border border-border rounded-xl shadow-xs hover:shadow-md hover:-translate-y-1 transition-all`
  - Badges: `inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold`
  - Button: `shadcn/ui Button` with hover effects and focus outline.

### Step 3: Page Integration (`app/(public)/page.tsx`)

Insert component directly below `<BrandMarquee />`:

```tsx
{/* Brand Logos Trust Marquee Section */}
<BrandMarquee />

{/* Certifications & Compliance Section */}
<CertificationsSection />

{/* Product Categories Overview */}
...
```

---

## 4. When We Are Going to Do It

Execution Phases:

```text
Phase 1: Create Data Constants (constants/certifications.ts)
    │
    ▼
Phase 2: Build UI Component & Modal (components/sections/certifications-section.tsx)
    │
    ▼
Phase 3: Integrate into Homepage (app/(public)/page.tsx)
    │
    ▼
Phase 4: Update Progress Tracker & Documentation
    │
    ▼
Phase 5: Build & Lint Verification (pnpm run lint & pnpm run build)
```

---

## 5. Required Data & Data Sources

| Data Requirement       | Origin / Source                                    | Usage                                                  |
| ---------------------- | -------------------------------------------------- | ------------------------------------------------------ |
| Certification Details  | `constants/certifications.ts`                     | Populates card grid & modal detail views               |
| Modal Overlay & State  | React `useState` & `shadcn/ui` Dialog component    | Focus trapping, keyboard accessibility, backdrop click |
| Icons                  | `lucide-react`                                     | Visual badge representations                           |

---

## 6. What Could Possibly Go Wrong & Mitigation Plan

| Potential Risk                 | Root Cause                                                           | Prevention / Mitigation Strategy                                                          |
| ------------------------------ | -------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| **Focus Loss on Modal Close**  | Uncontrolled state teardown when closing dialogs on screen readers.  | Use `shadcn/ui Dialog` (Radix UI) which automatically restores focus to trigger button.   |
| **Hydration Mismatch**         | Non-deterministic icon or date rendering.                            | Static icon mapping objects and fixed string dates.                                       |
| **Mobile Width Overflow**      | Wide code badges or un-wrapped certificate strings on 320px screens. | Use `break-all` / `truncate` CSS classes and flex-wrap layouts for badge tags.          |

---

## 7. Verification & Definition of Done

1. `pnpm run lint` completes with zero errors and zero warnings.
2. `pnpm run build` compiles cleanly with zero type errors.
3. Interactive testing of dialog opening/closing via keyboard (`Enter`, `Space`, `Escape`).
4. Visual verification across mobile (320px), tablet (768px), and desktop (1280px).
