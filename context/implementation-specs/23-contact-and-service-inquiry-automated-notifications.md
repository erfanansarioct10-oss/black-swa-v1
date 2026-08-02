# Implementation Spec 23: Contact & Service Inquiry Automated Notifications

> **Spec ID:** 23-contact-and-service-inquiry-automated-notifications  
> **Target Branch / PR:** phase3A  
> **Status:** Draft / Pending Approval  
> **Created Date:** 2026-08-01  

---

## Executive Summary

Enable end-to-end automated notifications for general contact submissions and service-specific inquiries across the Black Swan International platform. When a customer submits a contact inquiry on `/contact` or a service inquiry from any of the 15 service detail pages (`/services/[slug]`), the system will validate the request, issue a branded confirmation receipt email to the user (via **Resend Email API**), and send an instant management alert to the administration channel (via **Telegram Bot API**).

---

## 1. What We Are Going to Do

| 1   | `db/schema.ts` | **[MODIFY]** Define `contactInquiries` PostgreSQL table for DB persistence. |
| 2   | `schemas/contact.ts` | **[NEW]** Define `contactInquirySchema` Zod validation schema. |
| 3   | `actions/contact.ts` | **[NEW]** Create `submitContactInquiryAction` Server Action with DB persistence, Turnstile verification, and Next.js 16 `after()` background dispatch. |
| 4   | `lib/email.ts` | **[MODIFY]** Add `SendContactInquiryEmailParams`, HTML template generator `generateContactInquiryHtml()`, and `sendContactInquiryConfirmationEmail()`. |
| 5   | `lib/telegram.ts` | **[MODIFY]** Add `SendTelegramContactInquiryParams` and `sendTelegramContactInquiryAlert()` helper function. |
| 6   | `components/contact/inquiry-form.tsx` | **[MODIFY]** Wire up real Server Action, Turnstile widget, validation error states, and responsive submission UI. |
| 7   | `context/implementation-specs/README.md` | **[MODIFY]** Register Spec 23 in the specification registry index. |

---

## 2. Why We Are Doing This

1. **Project Architecture Standards:** Aligns with `context/architecture.md` (UI -> Zod Validation -> Server Action -> Resend/Telegram Dispatch).
2. **Customer Trust & Engagement:** Provides immediate email proof-of-inquiry to potential B2B enterprise clients with clear 1-business-day response SLA expectations.
3. **Operational Speed:** Notifies Managing Directors instantly via Telegram, reducing response lead time from days to under 2 hours.

---

## 3. How We Are Going to Implement It

### Step 1: Validation Schema (`schemas/contact.ts`)

```typescript
import { z } from "zod";

export const contactInquirySchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name cannot exceed 100 characters"),
  companyName: z
    .string()
    .trim()
    .min(2, "Company or organization name is required")
    .max(150, "Company name cannot exceed 150 characters"),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Please provide a valid corporate email address"),
  phone: z.string().trim().optional(),
  serviceSlug: z.string().trim().optional(),
  message: z
    .string()
    .trim()
    .min(10, "Inquiry message must be at least 10 characters")
    .max(3000, "Inquiry message cannot exceed 3000 characters"),
  turnstileToken: z.string().optional(),
});

export type ContactInquirySchemaType = z.infer<typeof contactInquirySchema>;
```

### Step 2: Email & Telegram Helpers (`lib/email.ts` & `lib/telegram.ts`)

- **Resend Email Helper (`lib/email.ts`):** `sendContactInquiryConfirmationEmail()` sends HTML receipt using `Resend`.
- **Telegram Bot Alert (`lib/telegram.ts`):** `sendTelegramContactInquiryAlert()` posts HTML formatted alert to Telegram chat room.

### Step 3: Server Action (`actions/contact.ts`)

```typescript
"use server";

import { after } from "next/server";
import { contactInquirySchema, type ContactInquirySchemaType } from "@/schemas/contact";
import { sendContactInquiryConfirmationEmail } from "@/lib/email";
import { sendTelegramContactInquiryAlert } from "@/lib/telegram";
import type { ActionResponse } from "@/types/quote";

export async function submitContactInquiryAction(
  input: ContactInquirySchemaType
): Promise<ActionResponse<{ message: string }>> {
  const validated = contactInquirySchema.safeParse(input);
  if (!validated.success) {
    return {
      success: false,
      error: validated.error.issues[0]?.message || "Invalid contact inquiry details.",
    };
  }

  // Background non-blocking notification dispatch via Next.js 16 after()
  after(async () => {
    await Promise.allSettled([
      sendContactInquiryConfirmationEmail(validated.data),
      sendTelegramContactInquiryAlert(validated.data),
    ]);
  });

  return {
    success: true,
    data: { message: "Inquiry submitted successfully." },
  };
}
```

### Step 4: UI Form Component (`components/contact/inquiry-form.tsx`)

Replace the simulated submission hook with `submitContactInquiryAction` call, displaying server-side errors, loading spinners, and Turnstile bot protection.

---

## 4. When We Are Going to Do It

```text
Phase 1: Schemas & Helpers (schemas/contact.ts, lib/email.ts, lib/telegram.ts)
    │
    ▼
Phase 2: Server Action Implementation (actions/contact.ts)
    │
    ▼
Phase 3: Form Component Wiring (components/contact/inquiry-form.tsx)
    │
    ▼
Phase 4: Registry Update (context/implementation-specs/README.md)
    │
    ▼
Phase 5: Verification (pnpm run lint, pnpm exec tsc --noEmit, pnpm run build)
```

---

## 5. Required Data & Data Sources

| Data Requirement | Origin / Source | Usage |
| ---------------- | --------------- | ----- |
| Inquiry Form Input | `components/contact/inquiry-form.tsx` | User input fields for contact/service inquiry |
| Default Service Context | `useSearchParams()` (`/contact?service=<slug>`) | Pre-fills service context into form message |
| Resend API Key | `process.env.RESEND_API_KEY` | Customer confirmation email dispatch |
| Telegram Bot Token & Chat ID | `process.env.TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` | Management alert dispatch |

---

## 6. What Could Possibly Go Wrong & Mitigation Plan

| Potential Risk | Root Cause | Prevention / Mitigation Strategy |
| -------------- | ---------- | -------------------------------- |
| **Missing Email/Telegram Env Keys** | Dev environment lacks API keys. | Gracefully log dev fallback warnings without crashing or throwing errors to user. |
| **Slow External API Network Calls** | Email/Telegram API latency. | Execute notifications inside Next.js 16 `after()` background handler. |
| **Form Pre-fill Hydration Mismatch** | Reading `searchParams` on SSR. | Component wrapped in `<Suspense fallback={...}>` in `components/contact/contact-form.tsx`. |

---

## 7. Verification & Definition of Done

1. `pnpm run lint` executes with 0 errors and 0 warnings.
2. `pnpm exec tsc --noEmit` compiles with 0 errors.
3. `pnpm run build` generates all static and dynamic routes cleanly.
