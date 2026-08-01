# Implementation Spec 19: Phase 3C - Automated Notifications & Integration Pipeline (Resend & Telegram)

> **Spec ID:** 19-phase-3c-automated-notifications-and-integration-pipeline  
> **Target Branch / PR:** `main`  
> **Status:** Draft  
> **Created Date:** 2026-08-01

---

## Executive Summary

Phase 3C establishes the automated notification and integration pipeline for the Black Swan International quotation system. When a client submits an RFQ via `createQuoteAction`, the platform will immediately dispatch two real-time notifications:
1. **Resend Branded HTML Email Receipt:** Delivered to the customer's email address with full equipment breakdown, reference ID, SLA response expectations, and a direct link to track their quotation status.
2. **Telegram Bot API Management Alert:** Delivered instantly to the internal management Telegram channel, alerting Managing Directors of high-priority enterprise leads with client contact details, budget range, and hardware requirements.

---

## 1. What We Are Going to Do

| #   | Target File | Action Required |
| --- | --- | --- |
| 1   | `lib/email.ts` | **[NEW]** Resend client configuration and helper function `sendQuoteConfirmationEmail()`. |
| 2   | `emails/quote-confirmation.tsx` | **[NEW]** React Email / HTML template for branded customer quotation receipt. |
| 3   | `lib/telegram.ts` | **[NEW]** Telegram Bot API client helper `sendTelegramQuoteAlert()`. |
| 4   | `actions/quote.ts` | **[MODIFY]** Integrate non-blocking notification dispatches inside `createQuoteAction`. |
| 5   | `context/implementation-specs/README.md` | **[MODIFY]** Register Spec 19 in the specification registry index. |
| 6   | `context/progress-tracker.md` | **[MODIFY]** Update progress tracker for Phase 3C. |

---

## 2. Why We Are Doing This

1. **Enterprise Customer Assurance & Brand Trust (`context/project-overview.md`):**
   - High-value B2B buyers (hospitals, broadcast networks) expect immediate receipt confirmation with reference numbers and SLA commitments.
2. **Real-time Sales Team Alerting:**
   - Managing Directors need immediate notification of incoming RFQs to meet the target response SLA (under 2 business hours).
3. **Non-blocking Architectural Resilience (`context/architecture.md`):**
   - Notification delivery failures (e.g. invalid email address or Telegram API downtime) must never fail the underlying PostgreSQL database transaction for quote creation.

---

## 3. How We Are Going to Implement It

### Step 1: Resend Email Integration (`lib/email.ts` & `emails/quote-confirmation.tsx`)
- Utilize `resend` package installed in `package.json`.
- Environment variable: `RESEND_API_KEY` (with dev fallback logger if unconfigured).
- Build clean, responsive HTML email template using inline styles & modern typography matching Black Swan International design tokens.
- Function `sendQuoteConfirmationEmail(params)` accepts `email`, `fullName`, `referenceId`, `lookupToken`, `companyName`, and `items`.

### Step 2: Telegram Bot API Integration (`lib/telegram.ts`)
- Environment variables: `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`.
- Function `sendTelegramQuoteAlert(params)` formats Markdown/HTML alert message:
  ```text
  🚨 *NEW B2B RFQ SUBMITTED*
  • Reference: `RFQ-20260801-9F2C`
  • Contact: Dr. Alexander Vance
  • Email: a.vance@stjude-health.org
  • Phone: +1 (555) 019-2834
  • Company: St. Jude Medical Center
  • Budget: $100,000 - $250,000
  • Timeline: 1 - 3 months
  • Items: 3 hardware items requested
  ```
- Posts payload via `fetch` to `https://api.telegram.org/bot<TOKEN>/sendMessage`.

### Step 3: Server Action Dispatch (`actions/quote.ts`)
- In `createQuoteAction`, after successful database transaction, invoke both notification handlers asynchronously via `Promise.allSettled()`:
  ```ts
  // Non-blocking background dispatch
  Promise.allSettled([
    sendQuoteConfirmationEmail({ ... }),
    sendTelegramQuoteAlert({ ... }),
  ]).catch((err) => console.error("Notification dispatch error:", err));
  ```

---

## 4. When We Are Going to Do It

```text
Phase 1: Build Notification Libraries (`lib/email.ts`, `lib/telegram.ts`, `emails/quote-confirmation.tsx`)
    │
    ▼
Phase 2: Integrate Non-blocking Dispatch in `actions/quote.ts`
    │
    ▼
Phase 3: Verification (Linting, TypeScript compilation, Delivery tests)
```

---

## 5. Required Data & Data Sources

| Data Requirement | Origin / Source | Usage |
| --- | --- | --- |
| Customer Email & Name | `CreateQuoteInput` | Recipient address and personalized greeting. |
| Quote Reference ID | Generated in `createQuoteAction` | Tracking reference in email and Telegram. |
| Line Items & Notes | `quote_items` table / input array | Equipment table in email receipt & Telegram summary. |
| API Keys | `.env` (`RESEND_API_KEY`, `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`) | Third-party service authentication. |

---

## 6. What Could Possibly Go Wrong & Mitigation Plan

| Potential Risk | Root Cause | Prevention / Mitigation Strategy |
| --- | --- | --- |
| **Missing API Keys in Local Dev** | Unconfigured Resend/Telegram environment variables. | Log graceful dev warnings to console without throwing exceptions. |
| **Email API Rate Limits or Failures** | Third-party service downtime. | Wrap notification dispatches in `Promise.allSettled()` so quote creation succeeds regardless. |

---

## 7. Verification & Definition of Done

1. `pnpm run lint` passes with 0 errors and 0 warnings.
2. `pnpm exec tsc --noEmit` passes with 0 errors.
3. Submitting a quote in the UI triggers background email and Telegram dispatch without blocking response time.
