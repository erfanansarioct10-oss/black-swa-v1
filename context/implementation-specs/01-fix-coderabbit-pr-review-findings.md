# Implementation Spec 01: Fix CodeRabbit PR Review Findings

> **Spec ID:** 01-fix-coderabbit-pr-review-findings  
> **Target Branch / PR:** PR #1 (`feat: add public pages, layout components, and UI system`)  
> **Status:** Draft / Pending Approval  
> **Created Date:** 2026-07-30  

---

## Executive Summary

Following the initial PR commit and automated CodeRabbit code review, 11 inline findings were identified across layout components, accessibility, quote cart state management, brand messaging consistency, public forms, legal route handling, ESLint configurations, and progress documentation.

This document details the exact technical plan to systematically verify, fix, and validate every unresolved finding while maintaining strict adherence to the project standards (`AGENTS.md`, `context/architecture.md`, `context/code-standards.md`, and `context/ui-context.md`).

---

## 1. What We Are Going to Do

We will resolve all 11 CodeRabbit findings across 12 specific files:

| # | Target File | Action Required |
|---|---|---|
| 1 | `public/logo (2).webp` | Rename file to `public/logo.png` (fixing PNG bytes / WebP extension mismatch and spaces in filename); update references in headers & footers. |
| 2 | `constants/contact.ts` | **[NEW]** Create central source of truth for company contact details (phone, email, address, operating hours). |
| 3 | `context/quote-cart-context.tsx` | **[NEW]** Implement React Context & `useQuoteCart` hook with `localStorage` persistence for client-side Quote Cart state. |
| 4 | `components/layout/top-utility-bar.tsx` | Consume `CONTACT_INFO` constant and render component in public layout. |
| 5 | `app/(public)/layout.tsx` | Wrap public pages in `QuoteCartProvider` and render `TopUtilityBar` above `MainHeader`. |
| 6 | `components/layout/main-header.tsx` | Add `aria-current="page"` to active nav links, update logo source to `/logo.png`, and add Quote Cart item count badge. |
| 7 | `components/layout/mobile-nav.tsx` | Refactor drawer using `shadcn/ui Sheet` for accessible focus trapping, Esc key handling, and aria states; consume `CONTACT_INFO`; update logo path. |
| 8 | `components/layout/public-footer.tsx` | Consume `CONTACT_INFO` constants, update logo path to `/logo.png`. |
| 9 | `app/(public)/privacy/page.tsx` & `terms/page.tsx` | **[NEW]** Create Privacy Policy and Terms of Service page shells to eliminate 404 dead links. |
| 10 | `app/(public)/page.tsx` | Update hero badge, heading, description, image alt text, and product category links to strictly represent industrial machinery & equipment. |
| 11 | `app/(public)/contact/page.tsx` | Add client state, form `name` attributes, Zod/native validation, loading state, and success/error alert feedback. |
| 12 | `app/(public)/products/page.tsx` | Add client-side search input, category filtering (synced with URL params), and "Add to Quote Cart" actions. |
| 13 | `app/(public)/quote/page.tsx` | Render dynamic Quote Cart items, quantity controls, clear cart, and enable RFQ submission form only when cart has items. |
| 14 | `eslint.config.mjs` | Scope `nextTs` mappings strictly to TypeScript files (`.ts`, `.tsx`) and add `.jsx` to `nextVitals`. |
| 15 | `context/progress-tracker.md` | Replace absolute Windows `file:///c:/black-swan-v1/` URIs with relative paths, remove `.env.local` entry. |

---

## 2. Why We Are Doing This

1. **Accessibility Compliance (`AGENTS.md` & `code-standards.md`):**
   - Navigation elements without `aria-current="page"` leave screen reader users without context regarding which page is active.
   - Unmounted or non-inert drawer menus retain focusable child elements in the tab index when closed, causing severe keyboard accessibility failures.
   - Using `shadcn/ui Sheet` guarantees built-in WAI-ARIA dialog patterns (Focus Trap, Esc to close, focus return to trigger element).

2. **Domain Positioning Consistency (`project-overview.md`):**
   - The platform is explicitly built for *Black Swan International* as an industrial equipment and heavy machinery B2B provider.
   - Text references to "Broadcast/Media Tech" on the homepage conflict directly with the product catalog and company purpose.

3. **Quote-First Core Architecture (`project-overview.md`):**
   - Black Swan operates on a quote-cart model, not traditional e-commerce checkout.
   - Presentational product buttons that do not store items prevent users from building a quotation request, breaking the core workflow.

4. **Data Hygiene & Maintenance:**
   - Image assets whose file headers do not match their file extensions (`.png` content inside `.webp` filename) break image optimization pipelines and can cause decoding failures.
   - Hardcoding contact details across 4 separate components creates maintenance drift.
   - Absolute local filesystem paths (`file:///c:/...`) in tracked Markdown docs break rendering on GitHub and in non-Windows developer environments.

---

## 3. How We Are Going to Implement It

### Step 1: Shared Contact Constants & State Management
- **File:** `constants/contact.ts`
  ```typescript
  export const CONTACT_INFO = {
    phone: {
      display: "+1 (800) 555-0199",
      href: "tel:+18005550199",
    },
    email: {
      display: "sales@blackswan-intl.com",
      href: "mailto:sales@blackswan-intl.com",
    },
    address: {
      line1: "100 Industrial Parkway",
      suite: "Suite 400",
      district: "Industrial District",
      full: "100 Industrial Parkway, Suite 400, Industrial District",
    },
    hours: {
      display: "Mon - Fri: 8:00 AM - 5:00 PM EST",
    },
  } as const;
  ```

- **File:** `context/quote-cart-context.tsx`
  - Define `QuoteItem` type (`id`, `name`, `sku`, `category`, `quantity`).
  - Provide `addItem`, `removeItem`, `updateQuantity`, `clearCart`, `items`, and `itemCount`.
  - Persist state to `localStorage` with a `mounted` check to avoid SSR hydration mismatches in Next.js App Router.

### Step 2: Image Asset & Header/Footer Refactoring
- Rename `public/logo (2).webp` to `public/logo.png`.
- In `components/layout/top-utility-bar.tsx`, `components/layout/main-header.tsx`, `components/layout/mobile-nav.tsx`, and `components/layout/public-footer.tsx`:
  - Consume `CONTACT_INFO`.
  - Update `src="/logo (2).webp"` to `src="/logo.png"`.
  - In `main-header.tsx`, add `aria-current={isActive ? "page" : undefined}`.
  - In `main-header.tsx`, add a Quote Cart badge link showing `itemCount`.

### Step 3: Mobile Drawer Refactoring via `shadcn/ui Sheet`
- In `components/layout/mobile-nav.tsx`:
  - Replace custom fixed `div` drawer with `Sheet`, `SheetTrigger`, `SheetContent`, `SheetTitle`, `SheetHeader`.
  - Pass `side="right"`.
  - Close sheet on navigation click.

### Step 4: Legal Route Creation
- Create `app/(public)/privacy/page.tsx` with Privacy Policy structure.
- Create `app/(public)/terms/page.tsx` with Terms of Service structure.

### Step 5: Homepage Alignment
- In `app/(public)/page.tsx`:
  - Replace "Next-Gen Media Tech & Broadcast Solutions" with "Certified Heavy Industrial Equipment & Machinery".
  - Replace hero paragraph text to describe heavy industrial pumps, mechanical seals, control valves, precision bearings, and custom fabrication.
  - Update hero image `alt` to "Black Swan Industrial Equipment Showcase".
  - Ensure category links point to `/products?category=pumps`, `/products?category=seals`, `/products?category=valves`, `/products?category=bearings`.

### Step 6: Contact Form Interactivity
- In `app/(public)/contact/page.tsx`:
  - Add `"use client"` directive.
  - Add inputs with explicit `name` attributes: `fullName`, `companyName`, `email`, `phone`, `message`.
  - Add `onSubmit` handler, state variables (`submitting`, `submitted`, `error`).
  - Display success alert banner with option to reset form.

### Step 7: Products Catalog Interactivity & Quote Cart Integration
- In `app/(public)/products/page.tsx`:
  - Add `"use client"` directive.
  - Read category filter from `useSearchParams()`.
  - Filter `sampleProducts` by search query state and category selection.
  - Replace static `/quote` link on cards with an "Add to Quote Cart" button that triggers `addItem(prod)` and shows feedback.

### Step 8: Quote Request Page Integration
- In `app/(public)/quote/page.tsx`:
  - Add `"use client"` directive.
  - Consume `useQuoteCart`.
  - If `items.length === 0`, show empty state with link to `/products`.
  - If items exist, render list of items with quantity controls (`+`, `-`, remove).
  - Enable RFQ submission form when items exist. On submit, trigger success banner and `clearCart()`.

### Step 9: Configuration & Progress Tracker Fixes
- In `eslint.config.mjs`:
  - Update `nextTs.map` files target to `["app/**/*.{ts,tsx}", "components/**/*.{ts,tsx}", "lib/**/*.{ts,tsx}", "db/**/*.{ts,tsx}"]`.
  - Include `.jsx` in `nextVitals.map` target.
- In `context/progress-tracker.md`:
  - Replace all `file:///c:/black-swan-v1/...` links with `app/(public)/layout.tsx`, etc.
  - Remove `.env.local` entry line.

---

## 4. When We Are Going to Do It

The execution timeline is ordered sequentially to ensure zero build errors at any phase:

```text
Phase 1: Foundation & Shared State (contact.ts, quote-cart-context.tsx)
    │
    ▼
Phase 2: Assets & Layouts (logo.png, layout.tsx, top-utility-bar, main-header, mobile-nav, public-footer, legal routes)
    │
    ▼
Phase 3: Public Page Interactivity & Form Flows (page.tsx, contact/page.tsx, products/page.tsx, quote/page.tsx)
    │
    ▼
Phase 4: Tooling & Documentation (eslint.config.mjs, progress-tracker.md)
    │
    ▼
Phase 5: Verification & Validation (pnpm run lint, pnpm run typecheck, pnpm run build)
```

---

## 5. Required Data & Data Sources

| Data Requirement | Origin / Source | Usage |
|---|---|---|
| Company Contact Info | `constants/contact.ts` | Displayed across TopUtilityBar, MainHeader, MobileNav, PublicFooter, and ContactPage. |
| Quote Cart State | Client `localStorage` (`blackswan_quote_cart`) via `QuoteCartContext` | Persisted client-side cart items, quantities, badge count. |
| Product Inventory | `sampleProducts` array in `app/(public)/products/page.tsx` (migratable to DB in Phase 3) | Displayed in Product Catalog, filtered by category/search, added to cart. |
| URL Search Category | `useSearchParams()` in `app/(public)/products/page.tsx` | Synchronizes URL query string `?category=pumps` with product filter state. |
| Contact & RFQ Inputs | Form elements in `contact/page.tsx` and `quote/page.tsx` | Validated by Zod schemas / browser constraints before simulated API submission. |

---

## 6. What Could Possibly Go Wrong & Mitigation Plan

| Potential Risk | Root Cause | Prevention / Mitigation Strategy |
|---|---|---|
| **SSR Hydration Mismatch** | `localStorage` access during Server-Side Rendering of `QuoteCartProvider`. | Initialize cart state after component mounts (`useEffect` / `mounted` flag) or defer rendering badge count until client mounted. |
| **`useSearchParams()` Suspend Error** | Accessing `useSearchParams()` in Next.js App Router without a `<Suspense>` boundary. | Wrap `ProductsCatalogContent` inside a `<Suspense fallback={...}>` boundary on `app/(public)/products/page.tsx`. |
| **Accessibility Regression in Mobile Drawer** | Focus trapping breaking when closing modal or double backdrop rendering. | Use `shadcn/ui Sheet` component which wraps Radix UI Dialog primitives and handles portal rendering, focus locking, and keyboard escape natively. |
| **ESLint Glob Mismatch** | Misconfigured file glob matching in `eslint.config.mjs` breaking `pnpm run lint`. | Test `pnpm run lint` immediately after updating `eslint.config.mjs` to ensure clean parsing of `.ts`, `.tsx`, `.js`, and `.mjs` files. |
| **Dead Route Navigation** | Clicking `/privacy` or `/terms` in footer resulting in 404 error. | Create page components in `app/(public)/privacy/page.tsx` and `app/(public)/terms/page.tsx` prior to verifying footer links. |

---

## Verification & Definition of Done

The plan will be considered complete when:
1. `pnpm run lint` executes with zero errors or warnings.
2. `pnpm run typecheck` (or `pnpm run build`) builds the application cleanly without TypeScript errors.
3. Manual verification confirms Quote Cart persistence, contact form feedback, industrial hero text consistency, responsive drawer accessibility, and legal routes.
