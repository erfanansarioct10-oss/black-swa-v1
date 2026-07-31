# Implementation Spec 13: About Us Page (`/about`)

> **Spec ID:** 13-about-us-page  
> **Target Branch / PR:** `feature/about-us-page`  
> **Status:** Draft  
> **Created Date:** 2026-07-31

---

## Executive Summary

This document specifies the technical design, component architecture, data sources, and responsive UI layout for the comprehensive **About Us** page (`/about`). 

The page blends Black Swan International's enterprise engineering history (15+ years of certified reliability) with the exact company background and technical operational pillars from `about-us-referance.md` (Simulcast Technologies Pvt. Ltd, established 2019 in Nepal under Company Act 2063 BS).

It organizes the page into modular, mobile-first sections: Hero Banner, Key Metrics Strip, Company Profile, Leadership & Team, Interactive Capabilities (DVB, IPTV, OTT, Custom IT & Software, AMC), 4-Step Client Integration Workflow, and Lead Generation CTA.

---

## 1. What We Are Going to Do

List of files to create and modify:

| #   | Target File                                                      | Action Required                                                                                           |
| --- | ---------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| 1   | `constants/about.ts`                                             | **[NEW]** Data arrays for stats, core pillars (DVB, OTT, AMC, IT), leadership values, and workflow steps. |
| 2   | `components/sections/about/about-hero.tsx`                      | **[NEW]** Mobile-first Hero section with page title, enterprise badge, and introduction.                  |
| 3   | `components/sections/about/about-stats.tsx`                     | **[NEW]** Key stats counter & metrics strip (15+ Years, Deployments, 24/7 AMC SLA, 99.9% Uptime).         |
| 4   | `components/sections/about/about-company-profile.tsx`          | **[NEW]** Company profile & foundation history section (established 2019 in Nepal).                        |
| 5   | `components/sections/about/about-who-we-are.tsx`               | **[NEW]** Executive leadership & broadcast engineering team spotlight.                                     |
| 6   | `components/sections/about/about-what-we-do.tsx`                | **[NEW]** Interactive 5-pillar capability tabs (DVB-C/S2/IPTV, OTT, IT/Software, AMC, Integrator).       |
| 7   | `components/sections/about/about-how-we-assist.tsx`            | **[NEW]** 4-Step client engagement and SLA maintenance workflow.                                         |
| 8   | `components/sections/about/about-cta.tsx`                       | **[NEW]** Lead generation call-to-action banner linking to `/contact` and `/quote`.                       |
| 9   | `app/(public)/about/page.tsx`                                    | **[MODIFY]** Compose all modular sections, rich JSON-LD schema, and SEO metadata.                         |

---

## 2. Why We Are Doing This

1. **Project Standards Alignment:** Replaces the generic skeleton page with a fully populated, production-grade page conforming to `context/ui-context.md`, `context/code-standards.md`, and `context/project-overview.md`.
2. **Business Requirements:** Integrates the specific broadcast and IT services from `about-us-referance.md` (Simulcast Technologies Pvt. Ltd) into the site's B2B Lead-Gen workflow.
3. **Accessibility & Usability:** Mobile-first layout (320px+ viewport support), WAI-ARIA tabbed accessibility, keyboard navigability, touch target optimization (min 44px), and proper heading hierarchy (`h1` -> `h2` -> `h3`).
4. **SEO Compliance:** Rich JSON-LD `AboutPage` and `Organization` schema incorporating DVB, IPTV, OTT, AMC, and software solutions keywords.

---

## 3. How We Are Going to Implement It

### Step 1: Data Models & Shared Constants (`constants/about.ts`)

Define strongly-typed data structures for:
- `ABOUT_STATS`: Metrics (Years of Experience, Deployments, SLA Support, Uptime).
- `ABOUT_PILLARS`: The 5 core capability items:
  1. *Broadcast Systems Integration*
  2. *DVB & Head-end Systems (DVB-C, DVB-S2, IPTV)*
  3. *OTT Platform Implementation*
  4. *IT & Custom Software Solutions*
  5. *Annual Maintenance Contracts (AMC)*
- `WORKFLOW_STEPS`: 4-step client assistance process (Consultation -> System Design -> Deployment & Integration -> 24/7 AMC Support).

### Step 2: Component & Section Development (`components/sections/about/`)

- Build individual Server/Client Components with clean Tailwind styling.
- `about-what-we-do.tsx`: Uses React state (`"use client"`) for tab switching or responsive card grid fallback on mobile devices, ensuring full accessibility (`role="tablist"`, `aria-selected`).
- Re-use existing UI elements (`Badge`, `Button`, `Card`) and icons (`lucide-react`).

### Step 3: Page Integration (`app/(public)/about/page.tsx`)

- Assemble all 7 section components cleanly in sequence.
- Inject `aboutSchema` JSON-LD via `components/seo/json-ld.tsx`.
- Configure page metadata with `generatePageMetadata()`.

---

## 4. When We Are Going to Do It

Sequential execution flow:

```text
Phase 1: Shared Data Constants (`constants/about.ts`)
    │
    ▼
Phase 2: Modular Section Components (`components/sections/about/*.tsx`)
    │
    ▼
Phase 3: Page Integration (`app/(public)/about/page.tsx`) & SEO Schema
    │
    ▼
Phase 4: Verification & Build Validation (`pnpm run lint` & `pnpm run build`)
```

---

## 5. Required Data & Data Sources

| Data Requirement       | Origin / Source                                    | Usage                                                         |
| ---------------------- | -------------------------------------------------- | ------------------------------------------------------------- |
| Company History & Specs| `about-us-referance.md` & `context/project-overview.md` | Populates company background, DVB, OTT, AMC, and IT solutions.|
| Brand Info & Metadata  | `constants/site.ts`                                | Populates SITE_CONFIG title, description, and canonical URL.  |
| Contact Links          | `constants/contact.ts`                             | Target routing for `/contact` and `/quote`.                   |

---

## 6. What Could Possibly Go Wrong & Mitigation Plan

| Potential Risk                        | Root Cause                                                           | Prevention / Mitigation Strategy                                                                     |
| ------------------------------------- | -------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| **Tab Hydration Mismatch**            | Client component tab state out of sync during SSR.                   | Pre-render default active tab state statically; handle client tab selection gracefully without layout shifts. |
| **Mobile Horizontal Overflow**        | Grid layouts or fixed widths spilling beyond small screens.          | Strict mobile-first CSS (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`), `max-w-full`, `overflow-hidden` where needed. |
| **Duplicate Heading Hierarchy**       | Multiple `<h1>` tags across sub-components.                          | Maintain exactly one `<h1>` in `about-hero.tsx`; use `<h2>` and `<h3>` in child sections.           |

---

## 7. Verification & Definition of Done

1. `pnpm run lint` executes with zero errors and zero warnings.
2. `pnpm run build` compiles cleanly without TypeScript errors.
3. Manual UI verification across mobile (320px+), tablet, and desktop viewports with zero horizontal scrolling.
