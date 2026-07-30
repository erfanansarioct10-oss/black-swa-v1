# Implementation Spec 07: Homepage Popular Services Section

> **Spec ID:** 07-homepage-popular-services-section  
> **Target Branch / PR:** `featured-product`  
> **Status:** Draft (Pending User Approval)  
> **Created Date:** 2026-07-30

---

## Executive Summary

Implement an enterprise **Popular Engineering & Integration Services Section** on the homepage (`app/(public)/page.tsx`), placed immediately following the `<FeaturedProductsSection />`.

Following our `/grill-me` alignment session:
- **Layout**: 4 Feature List Cards in a 2x2 responsive grid (`grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8`).
- **Aesthetic Tone**: Dark charcoal background surface (`bg-brand-onyx` / `bg-brand-charcoal` with subtle ambient radial glow, matching the Certifications section aesthetic) for optimal visual contrast after the white Featured Products section.
- **Card Design**: Metallic charcoal cards (`bg-brand-charcoal text-white rounded-2xl border border-brand-marble/80 p-6 sm:p-7 hover:border-slate-400/60 hover:shadow-xl hover:-translate-y-1 transition-all duration-300`) with icon seals, SLA badges, key deliverables, and direct inquiry actions.
- **Inquiry Routing**: "Inquire About Service" buttons route directly to `/contact?service=[service-slug]` with `cursor-pointer`.

---

## 1. What We Are Going to Do

| #   | Target File | Action Required |
| --- | ----------- | --------------- |
| 1   | `constants/services.ts` | **[NEW]** Define strongly-typed `POPULAR_SERVICES` dataset with service IDs, titles, categories, SLA badges, descriptions, key deliverables, and contact inquiry slugs. |
| 2   | `components/sections/popular-services-section.tsx` | **[NEW]** Create responsive `PopularServicesSection` component featuring metallic charcoal feature cards, SLA badges, key deliverables list, and inquiry links. |
| 3   | `app/(public)/contact/page.tsx` | **[MODIFY]** Support reading `?service=` URL parameter via `useSearchParams()` (wrapped inside `<Suspense>`) to pre-select service in the contact form. |
| 4   | `app/(public)/page.tsx` | **[MODIFY]** Import and render `<PopularServicesSection />` after `<FeaturedProductsSection />`. |
| 5   | `context/progress-tracker.md` | **[MODIFY]** Update progress tracker under `In Progress`. |

---

## 2. Why We Are Doing This

1. **Project Standards Alignment (`context/project-overview.md`):**
   - Black Swan International delivers both high-end Medical/Broadcast computer hardware AND technical system integration services (DICOM calibration, 12G-SDI routing, 24/7 SLA maintenance).
2. **Lead Generation & Conversion:**
   - Provides clear call-to-actions for enterprise clients seeking turnkey hardware assembly and SLAs, routing inquiries seamlessly to the contact form.
3. **Visual Hierarchy & Rhythm:**
   - Uses a dark charcoal background matching the Certifications section to create an alternating visual rhythm between light and dark sections on the homepage.

---

## 3. How We Are Going to Implement It

### Step 1: Services Dataset (`constants/services.ts`)

```typescript
export interface ServiceItem {
  id: string;
  slug: string;
  title: string;
  category: "medical" | "broadcast" | "custom" | "maintenance";
  categoryLabel: string;
  slaBadge: string;
  desc: string;
  deliverables: string[];
  iconName: string;
}
```

Define 4 flagship engineering services:
1. `medical-integration`: **Medical Hardware System Integration**
   - SLA Badge: "HIPAA & DICOM Certified"
   - Deliverables: ["Custom radiology processing workstation assembly", "PACS network SFP+ fiber integration", "DICOM Part 14 grayscale display calibration"]
2. `broadcast-assembly`: **Broadcast Media Server Assembly**
   - SLA Badge: "SMPTE ST 2110 Ready"
   - Deliverables: ["12G-SDI 8K video encoder cluster cabling", "Multi-GPU studio video wall processor tuning", "Redundant hitless failover IP routing"]
3. `custom-computing`: **Custom Embedded Computing Solutions**
   - SLA Badge: "Bespoke Engineering"
   - Deliverables: ["Tailored micro-architecture firmware configuration", "Specialized I/O expansion card integration", "Thermal & acoustic enclosure optimization"]
4. `enterprise-sla`: **24/7 Enterprise SLA Hardware Support**
   - SLA Badge: "4-Hour On-Site SLA"
   - Deliverables: ["24/7 mission-critical diagnostic monitoring", "Rapid hot-swappable component deployment", "Annual regulatory technical audit binders"]

---

### Step 2: Component Implementation (`components/sections/popular-services-section.tsx`)

- **Outer Section**: `relative bg-brand-onyx text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-y border-brand-marble/40 overflow-hidden`
- **Ambient Lighting**:
  - Background radial glow: `absolute inset-0 bg-radial from-brand-charcoal/70 via-brand-onyx to-brand-onyx pointer-events-none`
  - Soft blur spotlight: `absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] sm:w-[1000px] h-[500px] bg-gradient-to-tr from-blue-600/20 via-slate-400/15 to-indigo-600/20 rounded-full blur-3xl opacity-70 pointer-events-none`
- **Grid Layout**: `grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8`
- **Card Content**:
  - Top row: Category tag (`bg-brand-onyx text-slate-300 border border-brand-marble/60 text-xs px-2.5 py-1 rounded`), SLA badge (`text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full inline-flex items-center gap-1`)
  - Icon + Title: Icon seal (`w-10 h-10 rounded-xl bg-brand-onyx border border-brand-marble/60 flex items-center justify-center text-slate-400`), Title (`text-lg sm:text-xl font-extrabold text-white`)
  - Description: `text-sm text-slate-300 leading-relaxed`
  - Deliverables: Bullet list with `CheckCircle2` icons (`text-slate-400`)
  - Footer Action: "Inquire About Service" link (`Link href="/contact?service=slug" className="cursor-pointer inline-flex items-center gap-1.5 text-xs font-bold text-white hover:text-slate-300 py-2 px-3 rounded-lg bg-brand-onyx border border-brand-marble/60"`)

---

### Step 3: Homepage Integration (`app/(public)/page.tsx`)

Import `PopularServicesSection` and render it right after `<FeaturedProductsSection />`.

---

## 4. When We Are Going to Do It

```text
Phase 1: Create Services Dataset (constants/services.ts)
    │
    ▼
Phase 2: Build PopularServicesSection Component (components/sections/popular-services-section.tsx)
    │
    ▼
Phase 3: Integrate into Homepage (app/(public)/page.tsx)
    │
    ▼
Phase 4: Update Documentation (context/progress-tracker.md)
    │
    ▼
Phase 5: Verification & Quality Checks (pnpm run lint & pnpm run build)
```

---

## 5. Required Data & Data Sources

| Data Requirement | Origin / Source | Usage |
| ---------------- | --------------- | ----- |
| `POPULAR_SERVICES` | `constants/services.ts` | Source for services list, SLA badges, descriptions, and deliverables. |
| Inquiry Route | Next.js `<Link href="/contact?service=...">` | Route navigation to contact inquiry page. |

---

## 6. What Could Possibly Go Wrong & Mitigation Plan

| Potential Risk | Root Cause | Prevention / Mitigation Strategy |
| -------------- | ---------- | -------------------------------- |
| **Missing Service Route** | Clicking inquiry link routes to non-existent route. | Route directly to existing `/contact` route with URL query param `?service=...`. |
| **Icon Mapping Fallback** | Dynamic icon name missing in mapper. | Provide safe default `LucideIcon` fallback. |

---

## 7. Verification & Definition of Done

1. `pnpm run lint` completes with **0 errors and 0 warnings**.
2. `pnpm run build` succeeds cleanly.
3. Responsive 2x2 grid verified across 320px mobile, tablet, and desktop viewports.
4. "Inquire About Service" links use `cursor-pointer` and route to `/contact?service=...`.
