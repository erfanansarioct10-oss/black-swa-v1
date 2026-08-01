# Implementation Spec 18: Phase 3B - Interactive Quote Cart & Multi-Step RFQ Wizard UI

> **Spec ID:** 18-phase-3b-interactive-quote-cart-and-multi-step-rfq-wizard-ui  
> **Target Branch / PR:** `main`  
> **Status:** Draft  
> **Created Date:** 2026-08-01

---

## Executive Summary

Phase 3B enhances the Black Swan International quotation experience by transforming the static single-form Quote Request view into a stateful, interactive, multi-step **RFQ Wizard UI** powered by an expanded **Quote Cart Context**.

This sub-phase integrates directly with the Server Actions (`createQuoteAction`) built in Phase 3A, allowing prospective healthcare, broadcasting, and enterprise hardware procurement clients to review line items, add custom technical specifications per line item, provide contact and budget details, verify via Cloudflare Turnstile anti-bot protection, and submit official RFQs with instant reference ID feedback.

---

## 1. What We Are Going to Do

| #   | Target File | Action Required |
| --- | --- | --- |
| 1   | `components/providers/quote-cart-provider.tsx` | **[MODIFY]** Enhance `QuoteCartItem` with `notes?: string` and add `updateNotes` method. |
| 2   | `components/quote/rfq-wizard-steps.tsx` | **[NEW]** Modular step components for Step 1 (Cart Review), Step 2 (Project & Contact Details), and Step 3 (Verification & Final Review). |
| 3   | `components/quote/rfq-wizard-progress.tsx` | **[NEW]** Mobile-first accessible step progress header indicator. |
| 4   | `components/quote/rfq-confirmation.tsx` | **[NEW]** Professional RFQ confirmation card displaying Reference ID, email receipt summary, turnaround SLA, and tracking portal entry link. |
| 5   | `components/quote/quote-request.tsx` | **[MODIFY]** Refactor main container to orchestrate the Multi-Step RFQ Wizard flow with client state, Zod validation, and `createQuoteAction` call. |
| 6   | `context/implementation-specs/README.md` | **[MODIFY]** Register Spec 18 in the specification index. |
| 7   | `context/progress-tracker.md` | **[MODIFY]** Record progress for Phase 3B implementation. |

---

## 2. Why We Are Doing This

1. **Project Standards Alignment (`context/architecture.md` & `docs/feature-roadmap.md`):**
   - Implements the planned Phase 3B features of the B2B Quote-First business model.
   - Leverages React 19 Client Components for step transitions and React State while delegating mutations strictly to `createQuoteAction` (Server Action).
2. **User Experience & Conversion Rate:**
   - Multi-step wizards reduce cognitive load for high-value enterprise equipment quotes compared to massive single page forms.
   - Item-specific technical notes allow medical physics / broadcast engineers to specify exact custom requirements (e.g. DICOM compliance, dual PSU, rackmount kits) per product.
3. **Bot Prevention & System Security:**
   - Integrated Cloudflare Turnstile verification (`@marsidev/react-turnstile`) prevents spam and automated RFQ creation before hit limits.
4. **Mobile-First Responsiveness (`context/ui-context.md` & `context/code-standards.md`):**
   - Designed for 320px+ viewports with sticky step controls, touch-friendly (+/-) quantity selectors, and mobile-friendly step indicators.

---

## 3. How We Are Going to Implement It

### Step 1: Enhance Quote Cart Context (`components/providers/quote-cart-provider.tsx`)

- Update `QuoteCartItem` interface:
  ```ts
  export interface QuoteCartItem {
    id: string;
    name: string;
    sku: string;
    category: string;
    quantity: number;
    notes?: string;
  }
  ```
- Update `QuoteCartContextType` to include:
  ```ts
  updateNotes: (id: string, notes: string) => void;
  ```
- Update `isQuoteCartItem` validator and `localStorage` JSON parser to safely read/write `notes`.

### Step 2: Build Step Progress Indicator (`components/quote/rfq-wizard-progress.tsx`)

- Render a clean 3-step visual tracker (Step 1: Equipment, Step 2: Details, Step 3: Review & Submit).
- High-contrast active step states, completed checkmarks, and mobile step text (`Step X of 3`).

### Step 3: Implement Wizard Steps (`components/quote/rfq-wizard-steps.tsx`)

- **Step 1: Equipment Review & Custom Notes**
  - Item listing with quantity controls, SKU, category badges.
  - Expandable / inline textarea for custom line-item technical specs.
  - Clear cart confirmation modal/trigger.
- **Step 2: Contact & Enterprise Project Details**
  - Form fields: Full Name, Corporate Email, Phone Number, Company/Hospital Name, Budget Range (dropdown), Timeline (dropdown), Project Scope (textarea).
  - Validation: Performed using `createQuoteSchema` partial checks.
- **Step 3: Verification & Final Submission**
  - Summary of cart items and quantities.
  - Summary of client & project details.
  - Cloudflare Turnstile anti-bot widget.
  - Terms of Service & Privacy consent checkbox.
  - Submit button triggering `createQuoteAction`.

### Step 4: Confirmation View (`components/quote/rfq-confirmation.tsx`)

- Render success state with `referenceId` (e.g., `RFQ-20260801-9F2C`).
- Display instructions and button linking to public tracking route `/quote/track` (or `/quote/track/${referenceId}`).

---

## 4. When We Are Going to Do It

```text
Phase 1: Quote Cart Context Enhancement (`components/providers/quote-cart-provider.tsx`)
    │
    ▼
Phase 2: Wizard Component Architecture & Sub-components (`rfq-wizard-progress.tsx`, `rfq-wizard-steps.tsx`, `rfq-confirmation.tsx`)
    │
    ▼
Phase 3: Wizard Orchestrator Refactoring (`components/quote/quote-request.tsx`)
    │
    ▼
Phase 4: Verification (Linting, TypeScript compilation, Mobile UI audit)
```

---

## 5. Required Data & Data Sources

| Data Requirement | Origin / Source | Usage |
| --- | --- | --- |
| Cart Items | `QuoteCartContext` (`localStorage`) | Line items list and line notes. |
| User Identity (Optional) | `@clerk/nextjs` (`useUser`) | Pre-populates Name and Email if user is signed in. |
| Validation Schemas | `schemas/quote.ts` (`createQuoteSchema`) | Client & Server input validation. |
| Server Action | `actions/quote.ts` (`createQuoteAction`) | Submits quote header and line items to PostgreSQL. |
| Turnstile Site Key | `process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Anti-bot verification token generation. |

---

## 6. What Could Possibly Go Wrong & Mitigation Plan

| Potential Risk | Root Cause | Prevention / Mitigation Strategy |
| --- | --- | --- |
| **`localStorage` Hydration Mismatch** | Reading client `localStorage` during SSR rendering. | Defer cart display until `mounted === true` via `useSyncExternalStore`. |
| **Turnstile Widget Failures in Local Dev** | Missing or unconfigured Turnstile Site Key in local `.env`. | Gracefully fallback to auto-mocking or allowing submit in development mode if Turnstile site key is absent. |
| **Data Loss on Step Navigation** | Step state reset when navigating back and forth. | Keep entire wizard state in top-level `QuoteRequest` client component state. |
| **Unvalidated Form Progression** | Advancing to Step 3 with missing required fields. | Validate Step 2 fields using Zod before allowing progression to Step 3. |

---

## 7. Verification & Definition of Done

1. `pnpm run lint` executes with zero errors.
2. `pnpm run build` (or `pnpm exec tsc --noEmit`) passes without type errors.
3. Interactive multi-step form tested end-to-end:
   - Items added from product catalog appear in Step 1.
   - Per-item notes saved in cart context.
   - Step 2 inputs validated properly.
   - Step 3 submits quote action successfully and generates an RFQ Reference ID.
   - Confirmation screen displays generated Reference ID and clears cart.
4. Mobile responsiveness verified down to 320px.

---

## 8. Agent Workflow Integration

> [!IMPORTANT]
> **Mandatory User Permission Rule:** AI agents MUST present the plan to the user and obtain explicit permission before executing code changes.
