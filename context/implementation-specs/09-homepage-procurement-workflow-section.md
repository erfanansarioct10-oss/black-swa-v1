# Implementation Spec 09: Homepage Procurement Workflow Section

> **Spec ID:** 09-homepage-procurement-workflow-section  
> **Target Branch / PR:** main  
> **Status:** Complete  
> **Created Date:** 2026-07-30  

---

## Executive Summary

This specification outlines the addition of a **4-Step Enterprise Procurement Workflow ("How It Works")** section to the Black Swan International public homepage (`app/(public)/page.tsx`), placed directly after the **Enterprise Quality & Uptime Guarantees** section (`EnterpriseAdvantageSection`). 

Because Black Swan operates on a **Quote-First B2B business model** (no direct consumer e-commerce checkout), educating enterprise buyers on the structured procurement workflow (Consultation → Custom Engineering → Factory QA → White-Glove Deployment) reduces buyer friction, increases trust, and drives quotation conversions.

---

## 1. What We Are Going to Do

List of files to be created and modified:

| #   | Target File | Action Required |
| --- | ----------- | --------------- |
| 1   | `constants/procurement-workflow.ts` | **[NEW]** Strongly-typed dataset `PROCUREMENT_STEPS` containing step data, icons, descriptions, and deliverable badges. |
| 2   | `components/sections/procurement-workflow-section.tsx` | **[NEW]** Mobile-first 4-step horizontal card grid component matching the metallic charcoal visual language. |
| 3   | `app/(public)/page.tsx` | **[MODIFY]** Render `<ProcurementWorkflowSection />` directly after `<EnterpriseAdvantageSection />`. |
| 4   | `context/progress-tracker.md` | **[MODIFY]** Document implementation progress and status. |

---

## 2. Why We Are Doing This

1. **Project Standards Alignment:** Follows `context/architecture.md` (Server Components by default, modular section components) and `context/ui-context.md` (Mobile-First responsive card grids, metallic gray color palette, accessible Lucide icons).
2. **B2B Trust & UX:** Enterprise medical and broadcast hardware purchasers require a clear understanding of compliance, SLA mapping, factory burn-in QA, and white-glove site deployment before initiating multi-thousand dollar quotes.
3. **Design Language Consistency:** Extends the visual theme established in `EnterpriseAdvantageSection` (`bg-brand-charcoal`, `border-brand-marble/80`, metallic glow, clear step hierarchy).

---

## 3. How We Are Going to Implement It

### Step 1: Data Models & Shared Constants

Create `constants/procurement-workflow.ts`:

```typescript
import { FileText, Cpu, ShieldCheck, Truck, type LucideIcon } from "lucide-react";

export interface ProcurementStepItem {
  id: string;
  stepNumber: string;
  title: string;
  desc: string;
  deliverable: string;
  iconName: "FileText" | "Cpu" | "ShieldCheck" | "Truck";
}

export const PROCUREMENT_STEPS: ProcurementStepItem[] = [
  {
    id: "consultation",
    stepNumber: "01",
    title: "Technical Consultation & Custom Spec",
    desc: "In-depth engineering assessment of your clinical DICOM/PACS or broadcast SMPTE ST 2110 hardware requirements.",
    deliverable: "Custom Spec Proposal",
    iconName: "FileText",
  },
  {
    id: "engineering",
    stepNumber: "02",
    title: "Custom Engineering & SLA Mapping",
    desc: "Tier-1 component BOM selection, thermal & power profiling, rack sizing, and 4-hour SLA field warranty mapping.",
    deliverable: "BOM & SLA Contract",
    iconName: "Cpu",
  },
  {
    id: "testing",
    stepNumber: "03",
    title: "Factory QA & 72-Hour Burn-in",
    desc: "72-hour continuous load stress testing, ISO 13485 medical device QA, and SMPTE video signal validation.",
    deliverable: "QA Certificate",
    iconName: "ShieldCheck",
  },
  {
    id: "deployment",
    stepNumber: "04",
    title: "White-Glove Deployment & SLA Support",
    desc: "Insured climate-controlled transport, on-site rack integration, cabling, and 24/7 dedicated engineering support.",
    deliverable: "Live System Handoff",
    iconName: "Truck",
  },
];

export function getProcurementStepIcon(iconName: ProcurementStepItem["iconName"]): LucideIcon {
  switch (iconName) {
    case "FileText":
      return FileText;
    case "Cpu":
      return Cpu;
    case "ShieldCheck":
      return ShieldCheck;
    case "Truck":
      return Truck;
    default:
      return FileText;
  }
}
```

### Step 2: Component Implementation

Create `components/sections/procurement-workflow-section.tsx`:
- Header section with badge (`Enterprise Procurement Process`), title (`How We Deliver Mission-Critical Infrastructure`), and subtitle.
- 4-column responsive grid (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8`).
- Step cards styled with `bg-brand-charcoal`, `border-brand-marble/80`, metallic grey accents, cyan/blue glowing step numbers (`01` - `04`), step icons, titles, descriptions, and deliverable badges.
- Desktop connecting process track (`hidden lg:block`).

### Step 3: Page Integration

Modify `app/(public)/page.tsx`:
- Import `ProcurementWorkflowSection`.
- Render `<ProcurementWorkflowSection />` between `<EnterpriseAdvantageSection />` and `<section className="py-16 sm:py-24...">` (Product Categories Overview).

---

## 4. When We Are Going to Do It

```text
Phase 1: Shared Dataset & Helper Functions
    │
    ▼
Phase 2: Procurement Workflow UI Component
    │
    ▼
Phase 3: Integration into Homepage (page.tsx)
    │
    ▼
Phase 4: Progress Tracker & Documentation Update
    │
    ▼
Phase 5: Automated Build & Lint Verification
```

---

## 5. Required Data & Data Sources

| Data Requirement | Origin / Source | Usage |
| ---------------- | --------------- | ----- |
| Step Titles & Descriptions | `constants/procurement-workflow.ts` | Rendered in workflow cards |
| Icons | `lucide-react` via `getProcurementStepIcon()` | Visual step icons |

---

## 6. What Could Possibly Go Wrong & Mitigation Plan

| Potential Risk | Root Cause | Prevention / Mitigation Strategy |
| -------------- | ---------- | -------------------------------- |
| **Mobile Grid Overflow** | Fixed pixel widths or horizontal process connectors breaking small viewports. | Mobile-first layout (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`); hide horizontal connector track on mobile/tablet (`hidden lg:block`). |
| **Color Scheme Mismatch** | Using uncurated blue or generic light backgrounds. | Restrict styling strictly to design system tokens (`bg-brand-charcoal`, `bg-brand-onyx`, `border-brand-marble/80`, `text-slate-300`). |

---

## 7. Verification & Definition of Done

1. `pnpm run lint` executes with zero errors and zero warnings.
2. `pnpm run build` compiles cleanly without TypeScript or Next.js build errors.
3. Responsive behavior verified across Mobile (320px+), Tablet, and Desktop breakpoints.
