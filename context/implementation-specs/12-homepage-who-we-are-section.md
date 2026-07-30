# Implementation Spec 12: Homepage Who We Are (About Us) Section

> **Spec ID:** 12-homepage-who-we-are-section  
> **Target Branch / PR:** main  
> **Status:** Draft / Pending Approval  
> **Created Date:** 2026-07-30  

---

## Executive Summary

This specification outlines the technical design and step-by-step implementation for adding a dedicated **"Who We Are" (About Us)** section on the public homepage (`app/(public)/page.tsx`), positioned directly below the main Hero section and directly above the Brand Marquee section (`components/sections/brand-marquee.tsx`).

The section highlights Black Swan International's 15+ year legacy as an industrial leader in mission-critical Medical Technology and Broadcast Computer Hardware. On the left, it displays an optimized executive portrait card using `/about/ceo.webp` (compressed from the original 2.1 MB PNG down to ~71 KB, ~96.6% size reduction, with the legacy `ceo.png` deleted). On the right, it presents a compelling brand narrative, key enterprise checkmark highlights, and a primary call-to-action button (`Read Our Full Story`) redirecting visitors to the main About page (`/about`).

---

## 1. What We Are Going to Do

List of files to be created, modified, or deleted:

| #   | Target File | Action Required |
| --- | ----------- | --------------- |
| 1   | `public/about/ceo.webp` | **[NEW/COMPRESSED]** High-efficiency WebP executive image (~71 KB). |
| 2   | `public/ceo.png` | **[DELETE]** Unoptimized raw PNG asset (~2.1 MB) deleted. |
| 3   | `components/sections/who-we-are-section.tsx` | **[NEW]** Modern responsive section component with CEO portrait card, legacy copy, key highlights, and CTA. |
| 4   | `app/(public)/page.tsx` | **[MODIFY]** Import and embed `<WhoWeAreSection />` between Hero section and `<BrandMarquee />`. |
| 5   | `context/progress-tracker.md` | **[MODIFY]** Update tracker status to reflect Who We Are section implementation. |
| 6   | `context/implementation-specs/12-homepage-who-we-are-section.md` | **[NEW]** Technical implementation spec document. |

---

## 2. Why We Are Doing This

1. **Project Standards Alignment:**
   - Adheres to Next.js App Router & Server Components conventions (`context/architecture.md`).
   - Follows Mobile-First development principles (`context/code-standards.md`, `context/ui-context.md`).
   - Supports B2B lead generation and brand trust building (`context/project-overview.md`).
2. **Accessibility & Usability:**
   - Provides clean visual hierarchy, semantic HTML elements (`<section>`, `<h2>`, `<p>`), and descriptive `alt` text for screen readers.
   - Interactive CTA button uses touch-friendly padding (`py-3.5 px-7`, minimum 44px height) and visible focus rings.
3. **Data Hygiene & Performance:**
   - Image optimization: Converting `public/ceo.png` (2,128,952 bytes) to `public/ceo.webp` (71,454 bytes) eliminates 2.05 MB of unneeded payload, dramatically improving mobile page load and Core Web Vitals (LCP/CLS).

---

## 3. How We Are Going to Implement It

### Step 1: Component Definition (`components/sections/who-we-are-section.tsx`)

Create a Server Component `WhoWeAreSection` styled with Tailwind CSS and `lucide-react` icons (`Building2`, `ShieldCheck`, `CheckCircle2`, `ArrowRight`, `Award`).

The component uses a CSS Grid layout configured for mobile-first order:
- **Mobile View (`< lg`)**:
  1. Section Badge (`WHO WE ARE`) & Heading (`Pioneering Medical & Broadcast Hardware...`) at the top of the image.
  2. Executive CEO portrait card (`/ceo.webp`).
  3. Company narrative story, 4 feature checkmarks, and "Read Our Full Story" CTA button below the image.
- **Desktop View (`lg:`)**:
  - Left column (`lg:col-span-5`): Executive CEO portrait card (`/ceo.webp`).
  - Right column (`lg:col-span-7`): Header block (top) and narrative, checkmark grid, and CTA button (bottom).

```tsx
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Building2, CheckCircle2, ShieldCheck, Award } from "lucide-react";

export function WhoWeAreSection() {
  return (
    <section className="relative w-full bg-gradient-to-b from-white via-slate-50/70 to-white border-b border-slate-200/80 py-14 sm:py-20 lg:py-24 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: CEO Portrait Executive Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md lg:max-w-none">
              {/* Outer Card Wrapper */}
              <div className="relative rounded-2xl bg-white p-3 border border-slate-200/90 shadow-xl overflow-hidden group">
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-slate-100">
                  <Image
                    src="/ceo.webp"
                    alt="Black Swan International Executive Leadership"
                    fill
                    sizes="(min-width: 1024px) 35vw, (min-width: 640px) 60vw, 90vw"
                    className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Subtle vignette gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Floating Badge Overlay */}
                <div className="absolute bottom-6 left-6 right-6 bg-brand-onyx/90 backdrop-blur-md text-white p-4 rounded-xl border border-brand-marble/50 shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="flex shrink-0 items-center justify-center h-10 w-10 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30">
                      <Award className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Executive Board</p>
                      <p className="text-sm font-bold text-white">15+ Years Leadership & Vision</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Company Story & Highlights */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-7 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200/90 text-brand-granite text-xs font-bold uppercase tracking-wider shadow-2xs">
              <Building2 className="h-4 w-4 text-blue-600" />
              <span>Who We Are</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-brand-onyx leading-tight">
              Pioneering Medical & Broadcast Hardware Solutions for Over 15 Years
            </h2>

            <p className="text-sm sm:text-base lg:text-lg text-brand-granite leading-relaxed">
              Founded with a commitment to uncompromised reliability, Black Swan International has built a 15+ year legacy as a trusted technology partner. We specialize in engineering and deploying high-performance medical imaging processors, telehealth hardware gateways, broadcast media servers, and studio IT computing infrastructure across demanding enterprise environments worldwide.
            </p>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
                <CheckCircle2 className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-brand-onyx">ISO 13485 & IEC 60601-1</h4>
                  <p className="text-xs text-brand-granite">Strict compliance for healthcare hardware</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
                <CheckCircle2 className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-brand-onyx">Mission-Critical Reliability</h4>
                  <p className="text-xs text-brand-granite">99.9% uptime architecture & dual redundancy</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
                <CheckCircle2 className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-brand-onyx">SMPTE ST 2110 Ready</h4>
                  <p className="text-xs text-brand-granite">Ultra-low latency IP broadcast workflows</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
                <CheckCircle2 className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-brand-onyx">24/7 Enterprise SLA Support</h4>
                  <p className="text-xs text-brand-granite">Dedicated technical engineering assistance</p>
                </div>
              </div>
            </div>

            {/* Read More CTA */}
            <div className="pt-3 flex justify-center sm:justify-start">
              <Link
                href="/about"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-brand-onyx text-white font-bold text-sm sm:text-base rounded-lg shadow-md hover:bg-brand-charcoal transition-all group"
              >
                <span>Read Our Full Story</span>
                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
```

### Step 2: Homepage Integration (`app/(public)/page.tsx`)

Place `<WhoWeAreSection />` directly between the Hero section `<section>` and `<BrandMarquee />`:

```tsx
import { WhoWeAreSection } from "@/components/sections/who-we-are-section";

// ...
return (
  <div className="flex flex-col w-full">
    <JsonLd data={[organizationSchema, websiteSchema]} />

    {/* Hero Section */}
    <section className="relative ...">
      {/* ... */}
    </section>

    {/* Who We Are (About Us) Legacy Section */}
    <WhoWeAreSection />

    {/* Brand Logos Trust Marquee Section */}
    <BrandMarquee />
    {/* ... */}
  </div>
);
```

---

## 4. When We Are Going to Do It

```text
Phase 1: Asset Preparation & Optimization (Completed: PNG converted to WebP, original PNG deleted)
    │
    ▼
Phase 2: Component Creation (components/sections/who-we-are-section.tsx)
    │
    ▼
Phase 3: Page Integration (app/(public)/page.tsx)
    │
    ▼
Phase 4: Progress Documentation (context/progress-tracker.md)
    │
    ▼
Phase 5: Verification (pnpm run lint & pnpm run build)
```

---

## 5. Required Data & Data Sources

| Data Requirement | Origin / Source | Usage |
| ---------------- | --------------- | ----- |
| Executive Image  | `public/ceo.webp` | Rendered via `<Image>` in `WhoWeAreSection` left column. |
| Company Legacy Details | Inlined in component | Company history, 15+ years experience, and core compliance standards. |
| Navigation Route | `/about` | Target destination for "Read Our Full Story" CTA button. |

---

## 6. What Could Possibly Go Wrong & Mitigation Plan

| Potential Risk | Root Cause | Prevention / Mitigation Strategy |
| -------------- | ---------- | -------------------------------- |
| **Missing Asset Error** | Code referencing deleted `ceo.png`. | Strictly reference `public/ceo.webp` with proper `sizes` and `fill` props in `next/image`. |
| **Layout Shift (CLS)** | Image height/aspect ratio unconstrained during load. | Use responsive wrapper with `aspect-[4/5]` or explicit dimensions and `sizes`. |
| **Mobile Horizontal Overflow** | Long text or grid elements exceeding 320px viewport. | Use `w-full overflow-hidden`, single-column flex/grid layouts on mobile (`grid-cols-1`). |

---

## 7. Verification & Definition of Done

1. `pnpm run lint` executes with zero errors and zero warnings.
2. `pnpm run build` compiles cleanly without TypeScript or static generation errors.
3. Responsive design verified on 320px mobile, tablet, and desktop viewports.
4. "Read Our Full Story" button navigates directly to `/about`.
