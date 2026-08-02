# Implementation Spec 21: Phase 3 Quote System Refinements & Bug Fixes

> **Spec ID:** 21-phase-3-refinements-and-bug-fixes  
> **Target Branch / PR:** `main`  
> **Status:** Complete  
> **Created Date:** 2026-08-01

---

## Executive Summary

This specification resolves 5 UI, formatting, domain configuration, and navigation feedback items identified during manual frontend testing of Phase 3 (Quote System):
1. **Email Tracking Link Domain Fix:** Update `baseUrl` fallback and `.env.local` configuration to prevent unwanted external domain redirections.
2. **PDF Proposal Print Layout Optimization:** Apply `print:hidden` utility classes to `MainHeader`, `PublicFooter`, and `Breadcrumbs` so generated proposal PDFs contain only the clean quotation document.
3. **Nepalese Currency Standardization:** Convert budget range dropdown options from USD ($) to Nepalese Rupees (NPR).
4. **Telegram Alert HTML Formatting:** Migrate Telegram Bot API messaging from legacy Markdown to HTML parse mode, eliminating literal backslash (`\`) escape artifacts.
5. **Global Navigation Enhancements:** Add prominent "Track Quote" action links to the top navbar, mobile navigation drawer, and public footer.

---

## 1. What We Are Going to Do

| #   | Target File | Action Required |
| --- | --- | --- |
| 1   | `.env.local` | **[MODIFY]** Declare `NEXT_PUBLIC_APP_URL="http://localhost:3000"`. |
| 2   | `lib/email.ts` | **[MODIFY]** Update `baseUrl` fallback to `process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"`. |
| 3   | `components/layout/main-header.tsx` | **[MODIFY]** Add `print:hidden` to header and insert "Track Quote" CTA button. |
| 4   | `components/layout/public-footer.tsx` | **[MODIFY]** Add `print:hidden` to footer and insert "Track Quotation Status" link under Quick Links. |
| 5   | `components/layout/mobile-nav.tsx` | **[MODIFY]** Insert "Track Quote" link inside mobile drawer menu. |
| 6   | `components/ui/breadcrumbs.tsx` | **[MODIFY]** Add `print:hidden` to breadcrumbs navigation bar. |
| 7   | `components/quote/rfq-wizard-steps.tsx` | **[MODIFY]** Update budget range select options to Nepalese Rupees (NPR). |
| 8   | `lib/telegram.ts` | **[MODIFY]** Refactor alert message formatting to HTML parse mode (`<b>`, <code>, <i>) with HTML escaping. |
| 9   | `context/implementation-specs/README.md` | **[MODIFY]** Register Spec 21 in specification index. |
| 10  | `context/progress-tracker.md` | **[MODIFY]** Update progress tracker for Spec 21 completion. |

---

## 2. Why We Are Doing This

1. **User Experience & Accurate Domain Resolution:** Email tracking links must point to the local application environment during development rather than unowned third-party domain placeholders.
2. **Professional PDF Proposal Output:** Enterprise clients downloading quote proposals via `window.print()` expect a clean invoice layout free of site headers, footers, or breadcrumbs.
3. **Local Business Context (Nepal Market Alignment):** The platform operates with NPR currency representations for regional B2B hardware procurement.
4. **Clean Telegram Sales Team Notifications:** Replacing legacy Markdown with Telegram Bot API HTML parse mode eliminates character escaping artifacts (`\.`, `\@`, `\1`).
5. **Self-Service Navigation Accessibility:** Providing direct "Track Quote" entry points across header, mobile drawer, and footer improves usability for existing RFQ clients.

---

## 3. How We Are Going to Implement It

### Step 1: Environment & Email Base URL (`.env.local` & `lib/email.ts`)
- Add `NEXT_PUBLIC_APP_URL="http://localhost:3000"` in `.env.local`.
- Update `lib/email.ts`:
  ```ts
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  ```

### Step 2: Print Media Layout Isolation (`main-header.tsx`, `public-footer.tsx`, `breadcrumbs.tsx`)
- Add `print:hidden` to:
  - `<header className="sticky top-0 z-40 ... print:hidden">`
  - `<footer className="bg-brand-onyx ... print:hidden">`
  - `<nav aria-label="Breadcrumb" className={cn("py-2 px-1 print:hidden", className)}>`

### Step 3: Nepalese Rupee (NPR) Currency Options (`rfq-wizard-steps.tsx`)
- Update `budgetRange` options:
  ```html
  <option value="Under NPR 500,000">Under NPR 500,000</option>
  <option value="NPR 500,000 - NPR 2,500,000">NPR 500,000 - NPR 2,500,000</option>
  <option value="NPR 2,500,000 - NPR 10,000,000">NPR 2,500,000 - NPR 10,000,000</option>
  <option value="NPR 10,000,000 - NPR 25,000,000">NPR 10,000,000 - NPR 25,000,000</option>
  <option value="NPR 25,000,000+">NPR 25,000,000+</option>
  ```

### Step 4: Telegram Bot API HTML Messaging (`lib/telegram.ts`)
- Change `parse_mode` from `"Markdown"` to `"HTML"`.
- Use `escapeHtml()` helper and HTML markup (`<b>`, <code>, <i>, &lt;).

### Step 5: Global Track Quote Navigation Links (`main-header.tsx`, `mobile-nav.tsx`, `public-footer.tsx`)
- Add desktop header button with `Search` icon linking to `/quote/track`.
- Add mobile drawer item linking to `/quote/track`.
- Add Quick Links item linking to `/quote/track`.

---

## 4. Verification & Definition of Done

1. `pnpm exec tsc --noEmit` passes with 0 errors.
2. `pnpm run lint` passes with 0 errors and 0 warnings.
3. `pnpm run build` compiles cleanly.
4. All 5 issues verified manually in browser environment.
