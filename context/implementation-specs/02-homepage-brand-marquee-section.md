# Implementation Spec 02: Homepage Dual-Row Brand Marquee Section

> **Spec ID:** 02-homepage-brand-marquee-section  
> **Target Branch / PR:** feature/homepage-brand-marquee  
> **Status:** Complete  
> **Created Date:** 2026-07-30  

---

## Executive Summary

This specification defines the completed technical implementation for adding an industrial, trust-building dual-row brand logo marquee section on the homepage (`app/(public)/page.tsx`) immediately following the Hero section. The section features a centered trust header with a pill badge, subtle blue radial ambient lighting glow, narrow left/right edge blending masks, priority image preloading, and two counter-scrolling infinite marquees built using pure CSS keyframe animations to maintain high mobile performance and strict adherence to the project's metallic brand palette.

---

## 1. What We Are Going to Do

List of files created, modified, or deleted:

| #   | Target File | Action Required |
| --- | ----------- | --------------- |
| 1   | `app/globals.css` | **[MODIFY]** Added `@keyframes marquee` (leftward, 70s) and `@keyframes marquee-reverse` (rightward, 70s) animation classes with hardware acceleration settings. |
| 2   | `public/brands/` | **[NEW]** Directory storing 18 WebP brand logo assets (`.webp`). |
| 3   | `constants/brands.ts` | **[NEW]** Defined typed brand logo arrays for Row 1 and Row 2 with titles and asset paths. |
| 4   | `components/sections/brand-marquee.tsx` | **[NEW]** Created `BrandMarquee` server component with dual-row infinite track, edge gradient fade masks, priority image preloading, and trust header. |
| 5   | `app/(public)/page.tsx` | **[MODIFY]** Imported and placed `<BrandMarquee />` directly below the Hero section. |

---

## 2. Why We Are Doing This

1. **Trust-Building & Social Proof:** Enterprise B2B buyers looking for medical imaging technology and broadcast hardware require high authority signals immediately after evaluating the hero value proposition.
2. **Project Standards & Performance Alignment (`context/ui-context.md` & `context/code-standards.md`):**
   - Pure CSS hardware-accelerated animations (`will-change: transform`) ensure 60 FPS smooth rendering on mobile devices without layout thrashing or external JS bundle bloat.
   - Priority Image Preloading (`priority={true}`) ensures zero pop-in delay on initial page load.
   - Strict color consistency: Logo cards leverage the navbar accent token (`bg-accent` / `#e2e8f0` and `border-border/80`).
   - Mobile-First: Mobile layout handles tight viewports (320px+) gracefully without horizontal overflow.

---

## 3. How We Implemented It

### Step 1: CSS Animation Utility (`app/globals.css`)

Added marquee keyframes and helper classes to `app/globals.css`:

```css
@keyframes marquee {
  0% { transform: translateX(0%); }
  100% { transform: translateX(-50%); }
}

@keyframes marquee-reverse {
  0% { transform: translateX(-50%); }
  100% { transform: translateX(0%); }
}

.animate-marquee {
  animation: marquee 70s linear infinite;
  will-change: transform;
}

.animate-marquee-reverse {
  animation: marquee-reverse 70s linear infinite;
  will-change: transform;
}
```

### Step 2: Brand Constants (`constants/brands.ts`)

Defined 18 WebP brand logo arrays for Row 1 and Row 2:

```typescript
export interface BrandLogo {
  id: string;
  name: string;
  category: "medical" | "broadcast" | "hardware";
  imageSrc: string;
}

export const BRAND_LOGOS_ROW_1: BrandLogo[] = [
  { id: "kantipur", name: "Kantipur Media Group", category: "broadcast", imageSrc: "/brands/kantipur.webp" },
  { id: "norvic", name: "Norvic International Hospital", category: "medical", imageSrc: "/brands/norvic.webp" },
  { id: "ap1", name: "AP1 HD Television", category: "broadcast", imageSrc: "/brands/ap1.webp" },
  { id: "army", name: "Nepal Army Medical & IT", category: "medical", imageSrc: "/brands/army.webp" },
  { id: "annapurna", name: "Annapurna Media Network", category: "broadcast", imageSrc: "/brands/annapurna.webp" },
  { id: "cg", name: "Chaudhary Group", category: "hardware", imageSrc: "/brands/cg-new.webp" },
  { id: "gnn", name: "Global News Network", category: "broadcast", imageSrc: "/brands/gnn.webp" },
  { id: "space", name: "Space 4K Television", category: "broadcast", imageSrc: "/brands/space.webp" },
  { id: "zee", name: "Zee Network", category: "broadcast", imageSrc: "/brands/zee.webp" },
];

export const BRAND_LOGOS_ROW_2: BrandLogo[] = [
  { id: "patanjali", name: "Patanjali Healthcare", category: "medical", imageSrc: "/brands/patanjali.webp" },
  { id: "mountain", name: "Mountain Television", category: "broadcast", imageSrc: "/brands/mountain.webp" },
  { id: "police", name: "Nepal Police Infrastructure", category: "hardware", imageSrc: "/brands/police.webp" },
  { id: "nntv", name: "Nepal Network TV", category: "broadcast", imageSrc: "/brands/nntv.webp" },
  { id: "bagmati", name: "Bagmati Television", category: "broadcast", imageSrc: "/brands/bagmati.webp" },
  { id: "aastha", name: "Aastha Network", category: "broadcast", imageSrc: "/brands/aastha.webp" },
  { id: "dharma", name: "Dharma TV", category: "broadcast", imageSrc: "/brands/dharma.webp" },
  { id: "bhakti", name: "Bhakti Darshan TV", category: "broadcast", imageSrc: "/brands/bhakti.webp" },
  { id: "deuti", name: "Deuti Media", category: "broadcast", imageSrc: "/brands/deuti.webp" },
];
```

### Step 3: Marquee Component (`components/sections/brand-marquee.tsx`)

Built `BrandMarquee` server component with priority image preloading, duplicated row arrays for 100% seamless looping, narrow edge gradient masks, and navbar accent color tokens:

```tsx
import Image from "next/image";
import { ShieldCheck } from "lucide-react";
import { BRAND_LOGOS_ROW_1, BRAND_LOGOS_ROW_2, type BrandLogo } from "@/constants/brands";

function BrandItem({ brand, priority = false }: { brand: BrandLogo; priority?: boolean }) {
  return (
    <div className="group flex items-center justify-center shrink-0 px-6 py-3.5 sm:px-8 sm:py-4.5 bg-accent hover:bg-slate-200/90 rounded-xl border border-border/80 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 select-none">
      <Image
        src={brand.imageSrc}
        alt={brand.name}
        width={360}
        height={140}
        priority={priority}
        className="h-14 sm:h-18 lg:h-20 w-auto max-w-[180px] sm:max-w-[220px] lg:max-w-[250px] object-contain opacity-95 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
      />
    </div>
  );
}

export function BrandMarquee() {
  const row1 = [...BRAND_LOGOS_ROW_1, ...BRAND_LOGOS_ROW_1, ...BRAND_LOGOS_ROW_1, ...BRAND_LOGOS_ROW_1];
  const row2 = [...BRAND_LOGOS_ROW_2, ...BRAND_LOGOS_ROW_2, ...BRAND_LOGOS_ROW_2, ...BRAND_LOGOS_ROW_2];

  return (
    <section className="relative w-full bg-gradient-to-b from-slate-50/80 via-white to-slate-50/80 border-y border-slate-200/80 py-14 sm:py-20 lg:py-24 overflow-hidden">
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-blue-500/5 rounded-full blur-3xl" />

      <div className="pointer-events-none absolute left-0 top-0 bottom-0 z-10 w-12 sm:w-24 lg:w-36 bg-gradient-to-r from-slate-50 via-slate-50/80 to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 z-10 w-12 sm:w-24 lg:w-36 bg-gradient-to-l from-slate-50 via-slate-50/80 to-transparent" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 mb-12 sm:mb-16 text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200/90 text-brand-granite text-xs font-bold uppercase tracking-wider shadow-2xs">
          <ShieldCheck className="h-4 w-4 text-brand-charcoal" />
          <span>Industry Proven Reliability</span>
        </div>

        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-brand-onyx via-brand-charcoal to-brand-onyx uppercase">
          Trusted Brand Partners
        </h2>
        
        <p className="text-sm sm:text-base lg:text-lg text-brand-granite max-w-2xl mx-auto leading-relaxed">
          Powering mission-critical medical technology, healthcare facilities, and broadcast computing infrastructure worldwide.
        </p>
      </div>

      <div className="relative z-10 space-y-6 sm:space-y-8 lg:space-y-10">
        <div className="flex w-max animate-marquee items-center gap-6 sm:gap-8 lg:gap-10">
          {row1.map((logo, idx) => (
            <BrandItem key={`r1-${logo.id}-${idx}`} brand={logo} priority={idx < BRAND_LOGOS_ROW_1.length} />
          ))}
        </div>

        <div className="flex w-max animate-marquee-reverse items-center gap-6 sm:gap-8 lg:gap-10">
          {row2.map((logo, idx) => (
            <BrandItem key={`r2-${logo.id}-${idx}`} brand={logo} priority={idx < BRAND_LOGOS_ROW_2.length} />
          ))}
        </div>
      </div>
    </section>
  );
}
```

### Step 4: Homepage Integration (`app/(public)/page.tsx`)

Placed `<BrandMarquee />` directly below the Hero `<section>` element and above the Product Categories `<section>`.

---

## 4. Execution Timeline

All phases completed successfully:

```text
Phase 1: Brand Assets & Data Foundation (18 WebP logos in public/brands/) [COMPLETED]
    │
    ▼
Phase 2: CSS Animations & Global Tokens (70s linear infinite marquee) [COMPLETED]
    │
    ▼
Phase 3: BrandMarquee Section Component (Navbar accent cards, priority preloading) [COMPLETED]
    │
    ▼
Phase 4: Homepage Route Integration (Integrated in app/(public)/page.tsx) [COMPLETED]
    │
    ▼
Phase 5: Verification & Lint/Build Validation (Passed clean) [COMPLETED]
```

---

## 5. Data & Data Sources

| Data Requirement | Origin / Source | Usage |
| ---------------- | --------------- | ----- |
| Brand Metadata | `constants/brands.ts` | List of 18 brand names, slugs, and WebP paths for dual-row tracks |
| Brand Logo Assets | `public/brands/*.webp` | Compressed WebP files for featured brand partners |
| CSS Theme Tokens | `app/globals.css` | Navbar accent card token (`bg-accent`), border token (`border-border/80`), and marquee keyframes |

---

## 6. Verification & Definition of Done

1. `pnpm run lint` executed with **0 errors and 0 warnings**.
2. `pnpm run build` compiled cleanly without TypeScript or SSR errors.
3. Verified responsive behavior across mobile (320px+), tablet, laptop, and desktop viewports.
4. Dual-row marquee flows smoothly in opposing directions (70s slow-motion) with priority preloading.
