# Implementation Spec 05: SEO Compliance & Technical Optimization

> **Spec ID:** 05-seo-compliance-and-technical-optimization  
> **Target Branch / PR:** main / feature/seo-compliance  
> **Status:** Complete  
> **Created Date:** 2026-07-30

---

## Executive Summary

This specification outlines the comprehensive technical implementation required to bring the Black Swan International web application into full compliance with `context/seo.md`. 

While the current codebase maintains clean visual styling, mobile responsiveness, and semantic HTML5 sections (`<header>`, `<main>`, `<footer>`), it currently lacks core SEO metadata, dynamic sitemaps, search engine robot directives, canonical URL resolution, and Schema.org structured data. This specification establishes a robust, maintainable SEO architecture utilizing Next.js Metadata APIs, dynamic route generators (`robots.ts`, `sitemap.ts`), reusable JSON-LD schema components, and structured metadata constants across all public routes.

---

## 1. What We Are Going to Do

| #   | Target File | Action Required |
| --- | ----------- | --------------- |
| 1   | `constants/site.ts` | **[NEW]** Define site-wide default SEO constants, base URLs, Open Graph fallback image references, and corporate metadata. |
| 2   | `lib/seo.ts` | **[NEW]** Helper utilities for constructing normalized page metadata, canonical URLs, and schema generator functions. |
| 3   | `components/seo/json-ld.tsx` | **[NEW]** Reusable Server Component for rendering valid `<script type="application/ld+json">` tags (`Organization`, `WebSite`, `Product`, `Service`, `ContactPage`, `BreadcrumbList`, `LocalBusiness`). |
| 4   | `components/ui/breadcrumbs.tsx` | **[NEW]** Accessible, visual breadcrumbs component for hierarchical routes with integrated `BreadcrumbList` JSON-LD schema. |
| 5   | `app/robots.ts` | **[NEW]** Dynamic Next.js Metadata route generating production crawl directives and development indexing blocks for `robots.txt`. |
| 6   | `app/sitemap.ts` | **[NEW]** Dynamic Next.js Metadata route generating `sitemap.xml` for static and dynamic public routes. |
| 7   | `app/layout.tsx` | **[MODIFY]** Replace Next.js starter metadata ("Create Next App") with comprehensive site-wide default metadata (`metadataBase`, title template, description, keywords, Open Graph, Twitter cards, robots, icons). |
| 8   | `app/(public)/page.tsx` | **[MODIFY]** Add route metadata export and `Organization` / `WebSite` JSON-LD schemas. |
| 9   | `app/(public)/about/page.tsx` | **[MODIFY]** Add route metadata export, breadcrumbs, and `AboutPage` / `Organization` JSON-LD schemas. |
| 10  | `app/(public)/contact/page.tsx` | **[MODIFY]** Extract client form logic into a dedicated component (`components/contact/contact-form.tsx`) to allow server-side metadata export and `ContactPage` / `LocalBusiness` JSON-LD schema injection. |
| 11  | `app/(public)/privacy/page.tsx` | **[MODIFY]** Add route metadata export and breadcrumbs. |
| 12  | `app/(public)/products/page.tsx` | **[MODIFY]** Extract client catalog filter logic into a component (`components/products/product-catalog.tsx`) to enable server metadata export, canonical query handling, and `Product` / `ItemList` structured data. |
| 13  | `app/(public)/quote/page.tsx` | **[MODIFY]** Extract client quote cart logic into a component (`components/quote/quote-request.tsx`) to enable server metadata export and breadcrumbs. |
| 14  | `app/(public)/services/page.tsx` | **[MODIFY]** Add route metadata export, breadcrumbs, and `Service` JSON-LD schemas. |
| 15  | `app/(public)/terms/page.tsx` | **[MODIFY]** Add route metadata export and breadcrumbs. |

---

## 2. Why We Are Doing This

1. **Project Standards Alignment:** Fulfills all 24 sections of `context/seo.md`, eliminating Next.js boilerplate ("Create Next App") and providing search platforms (Google, Bing, Perplexity, ChatGPT Search, Gemini) with factual B2B metadata.
2. **Dynamic Search Engine Indexing:** Ensures search bots can parse dynamic site structure via `sitemap.xml` and respect administrative/API route disallow rules via `robots.txt`.
3. **Structured Data & AI Search (GEO/LLMO):** Schema.org JSON-LD scripts enable traditional search engines and AI assistants to extract accurate corporate profiles, product offerings, certifications, and service specs without ambiguity.
4. **Canonical URL Hygiene:** Prevents duplicate content penalties by standardizing `metadataBase` and `alternates.canonical` across desktop and mobile parameter variations.

---

## 3. How We Are Going to Implement It

### Step 1: Site Metadata Constants & Helper Functions

Create `constants/site.ts` with centralized platform information:

```ts
export const SITE_CONFIG = {
  name: "Black Swan International",
  shortName: "Black Swan",
  description:
    "Enterprise medical imaging processors, telehealth hardware gateways, broadcast media servers, and studio IT computing infrastructure.",
  url: process.env.NEXT_PUBLIC_APP_URL || "https://blackswaninternational.com",
  ogImage: "/hero.webp",
  author: "Black Swan International",
  keywords: [
    "Medical Technology Hardware",
    "DICOM Imaging Workstations",
    "Telehealth Hardware Gateways",
    "Broadcast Media Servers",
    "Industrial Network Switches",
    "Enterprise IT Hardware",
  ],
};
```

Create `lib/seo.ts` to construct standardized `Metadata` objects cleanly:

```ts
import type { Metadata } from "next";
import { SITE_CONFIG } from "@/constants/site";

export function generatePageMetadata({
  title,
  description,
  path = "",
  keywords = [],
}: {
  title: string;
  description: string;
  path?: string;
  keywords?: string[];
}): Metadata {
  const pageUrl = `${SITE_CONFIG.url}${path}`;
  const fullTitle = `${title} | ${SITE_CONFIG.name}`;

  return {
    title: fullTitle,
    description,
    keywords: [...SITE_CONFIG.keywords, ...keywords],
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: fullTitle,
      description,
      url: pageUrl,
      siteName: SITE_CONFIG.name,
      images: [
        {
          url: SITE_CONFIG.ogImage,
          width: 1200,
          height: 630,
          alt: `${SITE_CONFIG.name} Hardware Solutions`,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [SITE_CONFIG.ogImage],
    },
  };
}
```

### Step 2: JSON-LD Structured Data Server Component

Create `components/seo/json-ld.tsx` for type-safe Schema.org injection:

```tsx
interface JsonLdProps {
  data: Record<string, unknown> | Record<string, unknown>[];
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
```

### Step 3: Next.js Technical SEO Routes (`robots.ts` & `sitemap.ts`)

Create `app/robots.ts`:

```ts
import type { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/constants/site";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = SITE_CONFIG.url;

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
```

Create `app/sitemap.ts`:

```ts
import type { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/constants/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_CONFIG.url;
  const lastModified = new Date();

  const routes = [
    "",
    "/about",
    "/services",
    "/products",
    "/contact",
    "/quote",
    "/privacy",
    "/terms",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified,
    changeFrequency: route === "" || route === "/products" ? "daily" : "monthly",
    priority: route === "" ? 1.0 : route === "/products" || route === "/services" ? 0.8 : 0.5,
  }));
}
```

### Step 4: Page Refactoring for Server Metadata & Client Interactivity

For client pages (e.g. `app/(public)/contact/page.tsx` and `app/(public)/products/page.tsx`):
- Extract interactivity into nested client components (`components/contact/contact-form.tsx`, `components/products/product-catalog.tsx`, `components/quote/quote-request.tsx`).
- Keep `page.tsx` as a Server Component to export static/dynamic `Metadata` and render JSON-LD structured data.

---

## 4. When We Are Going to Do It

```text
Phase 1: Shared Utilities & Infrastructure
    ├── constants/site.ts & lib/seo.ts
    ├── components/seo/json-ld.tsx
    └── components/ui/breadcrumbs.tsx
    │
    ▼
Phase 2: Technical Routes & Root Layout Metadata
    ├── app/robots.ts
    ├── app/sitemap.ts
    └── app/layout.tsx metadata refactor
    │
    ▼
Phase 3: Page Refactoring & Metadata Integration
    ├── app/(public)/page.tsx + JSON-LD
    ├── app/(public)/about/page.tsx + Breadcrumbs + JSON-LD
    ├── app/(public)/services/page.tsx + Breadcrumbs + JSON-LD
    ├── app/(public)/privacy/page.tsx & app/(public)/terms/page.tsx
    ├── Refactor contact/ page -> ContactForm client component + Server Metadata
    ├── Refactor products/ page -> ProductCatalog client component + Server Metadata
    └── Refactor quote/ page -> QuoteRequest client component + Server Metadata
    │
    ▼
Phase 4: Verification & Build Validation
    ├── pnpm run lint
    └── pnpm run build (typechecking & static metadata generation)
```

---

## 5. Required Data & Data Sources

| Data Requirement | Origin / Source | Usage |
| ---------------- | --------------- | ----- |
| Corporate Details | `constants/contact.ts` & `constants/site.ts` | Title templates, Open Graph, Organization/LocalBusiness JSON-LD |
| Public Routes | Next.js App Router structure | `sitemap.ts` generation |
| Certifications Data | `constants/certifications.ts` | Medical & Broadcast hardware authority schema annotations |

---

## 6. What Could Possibly Go Wrong & Mitigation Plan

| Potential Risk | Root Cause | Prevention / Mitigation Strategy |
| -------------- | ---------- | -------------------------------- |
| **Server/Client Component Metadata Conflict** | Attempting to export `metadata` from a file marked `"use client"`. | Separate page shell (`Server Component`) from interactive forms/filters (`Client Component`). |
| **Hydration Mismatch on JSON-LD** | Dynamic timestamping or unescaped characters in JSON stringification. | Standardize `dangerouslySetInnerHTML` with `JSON.stringify()` on sanitized JSON-LD primitives. |
| **Missing Environment Base URL** | `process.env.NEXT_PUBLIC_APP_URL` undefined in production build. | Fall back to fallback domain `"https://blackswaninternational.com"` in `constants/site.ts`. |

---

## 7. Verification & Definition of Done

1. `pnpm run lint` executes with zero errors and zero warnings.
2. `pnpm run build` compiles cleanly, successfully generating `robots.txt` and `sitemap.xml`.
3. Every public route (`/`, `/about`, `/contact`, `/privacy`, `/products`, `/quote`, `/services`, `/terms`) exhibits unique `<title>`, `<meta name="description">`, `<link rel="canonical">`, Open Graph, Twitter cards, and Schema.org JSON-LD scripts in production HTML output.

---

## 8. Agent Workflow Integration

> [!IMPORTANT]
> **Mandatory User Permission Rule:** After drafting this specification and updating `context/progress-tracker.md`, AI agents MUST NOT immediately start coding. Agents MUST present this specification to the user and obtain explicit permission before making any code changes.
