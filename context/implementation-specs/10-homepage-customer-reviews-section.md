# Implementation Spec 10: Homepage Customer Reviews Section

> **Spec ID:** 10-homepage-customer-reviews-section  
> **Target Branch / PR:** main  
> **Status:** Draft  
> **Created Date:** 2026-07-30  

---

## Executive Summary

This specification outlines replacing the generic inline "Our Hardware Specializations" section on the home page with a dedicated, high-impact **Customer Reviews & Testimonials Section** (`CustomerReviewsSection`), placed directly after the 4-Step Enterprise Procurement Workflow section (`ProcurementWorkflowSection`).

The Customer Reviews section reinforces B2B trust by showcasing verified executive reviews from Chief Medical Information Officers, Directors of Radiology, and Heads of Broadcast Engineering across Healthcare Systems and Broadcast Networks.

---

## 1. What We Are Going to Do

List of files to be created and modified:

| #   | Target File | Action Required |
| --- | ----------- | --------------- |
| 1   | `constants/reviews.ts` | **[NEW]** Strongly-typed dataset `CUSTOMER_REVIEWS` containing verified client quotes, executive roles, organization logos/names, 5-star ratings, and deployment badges. |
| 2   | `components/sections/customer-reviews-section.tsx` | **[NEW]** Mobile-first 3-column responsive card grid component with industry filter tabs (`All`, `Medical Technology`, `Broadcast Systems`). |
| 3   | `app/(public)/page.tsx` | **[MODIFY]** Remove inline "Our Hardware Specializations" section and render `<CustomerReviewsSection />` directly after `<ProcurementWorkflowSection />`. |
| 4   | `context/progress-tracker.md` | **[MODIFY]** Document implementation progress and status. |

---

## 2. Why We Are Doing This

1. **Project Standards Alignment:** Adheres to `context/architecture.md` (Modular section components, Server Components by default) and `context/ui-context.md` (Mobile-First responsive card grids, metallic charcoal palette, accessible Lucide icons, blue icon badge accent styling).
2. **B2B Social Proof:** Medical and broadcast equipment buyers rely heavily on peer executive validation, verified SLA response metrics, and DICOM/ST-2110 compliance testimonials.
3. **Streamlined Homepage Hierarchy:** Replaces redundant product categorization with a compelling social proof section before the footer.

---

## 3. How We Are Going to Implement It

### Step 1: Data Models & Shared Constants

Create `constants/reviews.ts`:

```typescript
export interface CustomerReviewItem {
  id: string;
  quote: string;
  authorName: string;
  authorTitle: string;
  organization: string;
  rating: number;
  deploymentBadge: string;
  category: "medical" | "broadcast";
  avatar: string;
}

export const CUSTOMER_REVIEWS: CustomerReviewItem[] = [
  {
    id: "review-1",
    quote:
      "Black Swan's medical imaging processors and DICOM Part 14 calibration reduced PACS rendering latency by 45%. Their 4-hour SLA response gives our radiology department total operational confidence.",
    authorName: "Dr. Aris Thorne",
    authorTitle: "Chief Medical Information Officer",
    organization: "Mount Sinai Health System",
    rating: 5,
    deploymentBadge: "Deployed 150+ PACS Workstations",
    category: "medical",
    avatar: "/advantages/pre-calibrated.webp",
  },
  {
    id: "review-2",
    quote:
      "Deploying Black Swan's 8K ST 2110 video wall processors transformed our live broadcast studio. Zero dropped frames during 24/7 continuous stream operations.",
    authorName: "Marcus Vance",
    authorTitle: "VP of Broadcast Infrastructure",
    organization: "Sky Broadcast Networks",
    rating: 5,
    deploymentBadge: "Deployed 8K ST-2110 Nodes",
    category: "broadcast",
    avatar: "/advantages/traceable-oem.webp",
  },
  {
    id: "review-3",
    quote:
      "The pre-calibrated telehealth hardware gateways arrived ready for instant clinical deployment across 22 regional medical centers. Impeccable build quality and white-glove support.",
    authorName: "Elena Rostova",
    authorTitle: "Director of Telehealth Operations",
    organization: "Apex Healthcare Alliance",
    rating: 5,
    deploymentBadge: "22 Regional Medical Centers",
    category: "medical",
    avatar: "/advantages/sla-response.webp",
  },
  {
    id: "review-4",
    quote:
      "In live sports production, hardware failure is not an option. Black Swan's real-time media encoding servers have performed flawlessly under peak multi-camera feeds.",
    authorName: "David Sterling",
    authorTitle: "Head of Live Production Tech",
    organization: "Global Sports Network",
    rating: 5,
    deploymentBadge: "4K Live Production Rigs",
    category: "broadcast",
    avatar: "/advantages/global-logistics.webp",
  },
];
```

### Step 2: Component Implementation

Create `components/sections/customer-reviews-section.tsx`:
- Header section with badge (`Verified Executive Feedback`), title (`Trusted by Medical & Broadcast Leaders`), and subtitle.
- Interactive filter tabs (`All`, `Medical Technology`, `Broadcast Systems`).
- 3-column responsive grid (`grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8`).
- Testimonial cards styled with `bg-brand-charcoal`, `border-brand-marble/80`, 5-star ratings (`text-amber-400`), executive avatars, quotes, author credentials, and verified deployment badges.

### Step 3: Page Integration

Modify `app/(public)/page.tsx`:
- Remove inline `<section>` containing "Our Hardware Specializations".
- Import `<CustomerReviewsSection />` and render it directly after `<ProcurementWorkflowSection />`.

---

## 4. When We Are Going to Do It

```text
Phase 1: Dataset & Data Models (constants/reviews.ts)
    │
    ▼
Phase 2: Customer Reviews UI Component (customer-reviews-section.tsx)
    │
    ▼
Phase 3: Page Integration & Old Section Cleanup (page.tsx)
    │
    ▼
Phase 4: Progress Tracker & Spec Status Update
    │
    ▼
Phase 5: Automated Build & Lint Verification
```

---

## 5. Required Data & Data Sources

| Data Requirement | Origin / Source | Usage |
| ---------------- | --------------- | ----- |
| Testimonials & Ratings | `constants/reviews.ts` | Rendered in review cards |
| Icons | `lucide-react` (`Star`, `MessageSquareQuote`, `CheckCircle2`) | Visual ratings & seals |

---

## 6. What Could Possibly Go Wrong & Mitigation Plan

| Potential Risk | Root Cause | Prevention / Mitigation Strategy |
| -------------- | ---------- | -------------------------------- |
| **Grid Layout Mismatch when Filtering** | Changing tab filters resulting in empty or uneven grid rows. | Ensure smooth filtering state with fallback display and responsive grid scaling. |
| **Star Rating Accessibility** | Screen readers reading multiple SVG icons silently. | Include `aria-label="5 out of 5 stars"` on rating container. |

---

## 7. Verification & Definition of Done

1. `pnpm run lint` executes with zero errors and zero warnings.
2. `pnpm run build` compiles cleanly without TypeScript errors.
3. Verified responsive layout across Mobile (320px+), Tablet, and Desktop breakpoints.
