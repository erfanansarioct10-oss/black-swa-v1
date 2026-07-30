# Implementation Spec 06: Homepage Featured Products Section

> **Spec ID:** 06-homepage-featured-products-section  
> **Target Branch / PR:** `featured-product`  
> **Status:** Draft (Pending User Approval)  
> **Created Date:** 2026-07-30

---

## Executive Summary

Implement an enterprise B2B **Featured Products Section** on the homepage (`app/(public)/page.tsx`), placed immediately following the `<CertificationsSection />` and before `<Product Categories Overview>`.

Following our `/grill-me` alignment session, the section adopts a **Spotlight + Card Grid Layout**:
- **Hero Spotlight Card (Left)**: 1 flagship equipment item featuring rich technical specifications, compliance badges (ISO 13485, IEC 60601-1, DICOM Part 14), stock availability badge, and primary "Add to Quote" CTA.
- **Companion Cards Grid (Right)**: 3 featured products displaying category tags, key specs summaries, SKUs, and quick "Add to Quote" buttons.
- **Aesthetic Tone**: Clean white background surface (matching the Certifications section) with sleek **charcoal contrast** cards (`bg-brand-charcoal`, `border-brand-marble`, `text-white`) for high industrial trust and visual depth.
- **Interactivity & State**: Seamless integration with `useQuoteCart()` state. Clicking "Add to Quote" provides immediate checkmark visual feedback.
- **Catalog Navigation**: Includes a primary CTA button at the section footer ("Explore Full Hardware Catalog") routing to `/products`.

---

## 1. What We Are Going to Do

| #   | Target File | Action Required |
| --- | ----------- | --------------- |
| 1   | `constants/products.ts` | **[MODIFY]** Extend `SampleProduct` interface and `SAMPLE_PRODUCTS` dataset with `isSpotlight?: boolean`, `specs: string[]`, `compliance: string[]`, `badge?: string`, and `stockStatus?: string`. |
| 2   | `components/sections/featured-products-section.tsx` | **[NEW]** Create responsive `FeaturedProductsSection` component implementing Spotlight + Card Grid layout, charcoal contrast styling, and quote cart integration. |
| 3   | `app/(public)/page.tsx` | **[MODIFY]** Import and render `<FeaturedProductsSection />` after `<CertificationsSection />`. |
| 4   | `context/progress-tracker.md` | **[MODIFY]** Update progress tracker under `In Progress` and `Completed`. |

---

## 2. Why We Are Doing This

1. **Project Standards Alignment (`context/ui-context.md` & `context/project-overview.md`):**
   - Black Swan is a high-trust B2B Medical & Broadcast hardware platform. Featuring high-spec equipment directly on the home page accelerates product discovery and quote cart additions.
2. **Mobile-First Responsive Design:**
   - Stacked column layout on mobile (320px+ viewport), expanding to a 12-column split grid on desktop (`lg:` breakpoint) ensuring 0 horizontal overflow.
3. **Quote-First Architecture:**
   - Enhances lead generation by allowing direct addition of flagship products to the Quote Cart straight from the homepage.

---

## 3. How We Are Going to Implement It

### Step 1: Extended Hardware Product Types & Dataset

In `constants/products.ts`:

```typescript
export interface SampleProduct {
  id: string;
  name: string;
  category: "medical" | "broadcast";
  categoryDisplay: string;
  sku: string;
  desc: string;
  isSpotlight?: boolean;
  specs: string[];
  compliance: string[];
  badge?: string;
  stockStatus: string;
}
```

Update `SAMPLE_PRODUCTS` with detailed specs and compliance data:
- `prod-1` (Spotlight Hero): *UltraHD Medical Imaging Workstation - MedVision X1*
  - Badge: "Flagship Medical Workstation"
  - Specs: ["DICOM Part 14 Grayscale Calibration", "Dual Intel Xeon / NVIDIA RTX A6000 GPU", "Real-Time 3D Mammography Rendering"]
  - Compliance: ["ISO 13485", "IEC 60601-1", "FDA Registered"]
  - Stock Status: "In Stock • Enterprise Configurable"
- `prod-2`: *Live Broadcast Video Encoding Server 8K*
  - Specs: ["12G-SDI Uncompressed Video Inputs", "SMPTE ST 2110 IP Transport", "< 5ms Hardware Encoding Latency"]
  - Compliance: ["SMPTE Certified", "FCC Class A", "RoHS"]
- `prod-3`: *Telehealth Hardware Gateway & Monitor Hub*
  - Specs: ["HIPAA-Compliant Encrypted Hardware", "Multi-Sensor Bio-Telemetry Ports", "24/7 Redundant Failover Modems"]
  - Compliance: ["HIPAA Compliant", "CE MDR", "ISO 27001"]
- `prod-4`: *Studio Video Wall Processor Computer*
  - Specs: ["Multi-GPU PCIe Gen5 Canvas Engine", "Ultra-Wide 8K Studio Display Driver", "Hot-Swappable Redundant Power"]
  - Compliance: ["FCC Class A", "CE Certified", "RoHS"]

---

### Step 2: Featured Products Component (`components/sections/featured-products-section.tsx`)

Implement `"use client"` component:
- State management for temporary "Added to Quote" checkmark feedback (`addedIds` record).
- Grid layout:
  - Outer container: `bg-background py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full`.
  - Header: Section badge "Featured Hardware", heading "Flagship Infrastructure & Hardware", subheading.
  - Grid: `grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch`.
  - Spotlight Column (`lg:col-span-6`):
    - `bg-brand-onyx text-white p-7 sm:p-8 rounded-2xl border border-brand-marble shadow-lg flex flex-col justify-between`.
    - Flagship badge, title, detailed description, specs list with check icons, compliance badges flex row, stock indicator, and prominent "Add to Quote" button.
  - Companion Cards Column (`lg:col-span-6`):
    - `flex flex-col gap-6`.
    - 3 cards with charcoal accent borders (`bg-brand-charcoal text-white p-5 rounded-xl border border-brand-marble/60`), key tech specs, SKU badge, and quick "Add to Quote" action button.
  - Footer CTA: `flex justify-center pt-8`, button linking to `/products` with `ArrowRight` icon.

---

### Step 3: Homepage Integration (`app/(public)/page.tsx`)

Import `FeaturedProductsSection` and place it immediately after `<CertificationsSection />`.

```tsx
{/* Certifications & Compliance Section */}
<CertificationsSection />

{/* Featured Products Spotlight & Grid Section */}
<FeaturedProductsSection />

{/* Product Categories Overview */}
```

---

## 4. When We Are Going to Do It

```text
Phase 1: Extend Product Dataset (constants/products.ts)
    │
    ▼
Phase 2: Build FeaturedProductsSection Component (components/sections/featured-products-section.tsx)
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
| `SAMPLE_PRODUCTS` | `constants/products.ts` | Source for featured products list, specs, compliance tags, and SKUs. |
| Quote Cart Action | `useQuoteCart()` from `components/providers/quote-cart-provider.tsx` | Dispatches item additions to quote cart state & local storage. |
| Navigation Route | Next.js `<Link href="/products">` | Route navigation to hardware catalog page. |

---

## 6. What Could Possibly Go Wrong & Mitigation Plan

| Potential Risk | Root Cause | Prevention / Mitigation Strategy |
| -------------- | ---------- | -------------------------------- |
| **Quote Cart State Mismatch** | Product object signature missing required fields in `addItem()`. | Pass exact `id`, `name`, `sku`, and `category` as expected by `QuoteItem`. |
| **Mobile Horizontal Overflow** | Long spec strings or badges pushing card bounds on 320px screens. | Use responsive flex wrapping (`flex-wrap`), text wrapping, and mobile-tested padding (`p-4 sm:p-6`). |
| **Hydration Issues** | Client interactive state rendered on server. | Mark `featured-products-section.tsx` explicitly with `"use client"`. |

---

## 7. Verification & Definition of Done

1. `pnpm run lint` completes with **0 errors and 0 warnings**.
2. `pnpm run build` succeeds cleanly.
3. Responsive design verified on 320px mobile, tablet, and desktop viewports.
4. "Add to Quote" updates the quote cart badge count in real-time.
