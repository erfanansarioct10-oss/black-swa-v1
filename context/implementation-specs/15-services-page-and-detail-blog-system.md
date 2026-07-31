# Implementation Spec 15: Services Page & 15 Service Detail / Blog System

> **Spec ID:** 15-services-page-and-detail-blog-system  
> **Target Branch / PR:** feature/services-page-and-detail-blog-system  
> **Status:** Approved  
> **Created Date:** 2026-07-31  

---

## Executive Summary

Rebuild the `/services` route into an enterprise-grade broadcast and media technology service catalog displaying 15 specialized engineering services. Each service will feature a custom high-resolution AI-generated visual asset, category filter tabs, a direct "Inquire About Service" button, and an individual dynamic detail / blog article page under `/services/[slug]`.

---

## 1. What We Are Going to Do

| #   | Target File | Action Required |
| --- | ----------- | --------------- |
| 1   | `constants/services.ts` | **[MODIFY]** Expand dataset with 15 complete services, category labels, SLA badges, key features, deliverables, and full engineering blog article content. |
| 2   | `public/services/*.webp` (15 files) | **[NEW]** Generate 15 high-tech broadcast visual assets using AI matching the dark metallic charcoal studio aesthetic. |
| 3   | `components/services/services-client-grid.tsx` | **[NEW]** Client component for tab state filtering ("All", "Automation & Newsroom", "Media Asset Management", "Graphics & Processing", "Signal & Distribution") and responsive 3-column service cards. |
| 4   | `app/(public)/services/page.tsx` | **[MODIFY]** Rebuild main `/services` page with header, breadcrumbs, category tabs, card grid, and Schema.org `Service` catalog JSON-LD. |
| 5   | `app/(public)/services/[slug]/page.tsx` | **[NEW]** Dynamic SSG detail & engineering blog page for all 15 services with breadcrumbs, hero section, 4 key features grid, full blog article body, prefilled `InquiryForm` sidebar, and Schema.org JSON-LD (`Service` & `TechArticle`). |
| 6   | `context/implementation-specs/README.md` | **[MODIFY]** Update specification index with Spec 15. |
| 7   | `context/progress-tracker.md` | **[MODIFY]** Move Services page implementation to In Progress / Completed. |

---

## 2. Why We Are Doing This

1. **Project Standards Alignment:** Fulfills B2B lead generation goals (`context/project-overview.md`), follows mobile-first design (`context/ui-context.md`), and adheres to Next.js 16 App Router SSG conventions (`context/architecture.md`).
2. **SEO & AI Search (LLMO) Superiority:** Dedicated `/services/[slug]` pages for all 15 services provide unique indexable URLs with rich Schema.org `Service` and `TechArticle` metadata, making Black Swan discoverable across search engines and AI assistants (`context/seo.md`).
3. **High-Converting User Journey:** Customers browsing services can read a technical blog deep-dive or click "Inquire About Service" to immediately launch a prefilled inquiry form on `/contact?service=[slug]`.

---

## 3. How We Are Going to Implement It

### Step 1: 15 Services Data Architecture (`constants/services.ts`)

Define all 15 broadcast services with full structured data:
1. `playout-scheduler` - Playout Scheduler Automation
2. `nrcs` - NRCS (Newsroom Computer System)
3. `ingest-system` - Ingest System
4. `mam` - MAM (Media Asset Management)
5. `realtime-3d-cg` - Real-Time 3D CG
6. `character-generator` - Character Generator (CG)
7. `multiviewer` - Multiviewer
8. `videowall-processor` - VideoWall Processor
9. `sms` - SMS (Subscriber Management System)
10. `iptv` - IPTV
11. `tv-distribution` - TV Distribution
12. `equipment-sales` - Broadcast Equipment Sales
13. `ob-van-solution` - OB Van Solution
14. `teleport-services` - Teleport & Satellite Services
15. `cas` - Conditional Access System (CAS)

### Step 2: AI Image Generation

Use `generate_image` to generate 15 realistic broadcast technology visuals saved under `public/services/`:
- Futuristic broadcast control room, dark obsidian server racks, SDI/IP patching, satellite ground stations, and OB vans in dark metallic charcoal with subtle cyan/blue ambient lighting.

### Step 3: Main Services Page (`app/(public)/services/page.tsx` & `components/services/services-client-grid.tsx`)

- Implement category filter tabs.
- Render cards with dark metallic charcoal cards (`bg-brand-charcoal border-brand-marble/80`), icon seals, AI image headers, short descriptions, "Read More" button (`/services/[slug]`), and "Inquire About Service" button (`/contact?service=[slug]`).

### Step 4: Individual Service Detail & Engineering Blog Page (`app/(public)/services/[slug]/page.tsx`)

- Dynamic SSG route (`generateStaticParams` for all 15 slugs).
- Full page layout:
  - Hero with breadcrumbs, SLA badge, title, subtitle, AI banner image, and action buttons.
  - Left column: Technical Overview, Core Features Grid, Technical Engineering Blog Article, Deliverables & SLA Checklist.
  - Right column: Sticky Inquiry Card embedding prefilled `InquiryForm` (`components/contact/inquiry-form.tsx`).
- Schema.org JSON-LD structured data.

---

## 4. When We Are Going to Do It

```text
Phase 1: Dataset & AI Image Generation
    │
    ▼
Phase 2: Client Grid & Category Filtering Component
    │
    ▼
Phase 3: Main /services Page Reconstruction
    │
    ▼
Phase 4: Dynamic /services/[slug] Detail & Blog Page Implementation
    │
    ▼
Phase 5: Documentation & Build Verification (pnpm run lint & pnpm run build)
```

---

## 5. Required Data & Data Sources

| Data Requirement | Origin / Source | Usage |
| ---------------- | --------------- | ----- |
| 15 Services Data | `constants/services.ts` | Services grid, category filters, and detail/blog pages |
| Service Images | `public/services/*.webp` | Card headers and detail hero banners |
| Contact Form | `components/contact/inquiry-form.tsx` | Sticky inquiry sidebar on detail pages |

---

## 6. Technical Risks & Mitigation Plan

| Potential Risk | Root Cause | Prevention / Mitigation Strategy |
| -------------- | ---------- | -------------------------------- |
| Missing dynamic SSG params | Dynamic routes without `generateStaticParams` cause runtime SSR fallbacks. | Export `generateStaticParams` returning all 15 valid service slugs. |
| Hydration error on tab state | Reading URL search params on server without client wrapper. | Wrap client tab filter in `ServicesClientGrid`. |
| Image loading performance | Unoptimized image sizing. | Use Next.js `<Image>` with priority loading on hero banners. |

---

## 7. Verification & Definition of Done

1. `pnpm run lint` executes with zero errors.
2. `pnpm run build` compiles cleanly, generating static routes for `/services` and all 15 `/services/[slug]` pages.
3. Responsive visual inspection on mobile (320px+), tablet, and desktop viewports.
