# Implementation Spec 24: Pre-Commit Audit Polish & Code Deduplication

> **Spec ID:** 24-pre-commit-audit-polish-and-code-deduplication  
> **Target Branch / PR:** `main` (pre-push polish)  
> **Status:** Complete  
> **Created Date:** 2026-08-01

---

## Executive Summary

During the full-codebase pre-commit audit, 3 minor non-blocking code quality issues were identified. All relate to code duplication (violating `context/code-standards.md` § "Reusability" and "Forbidden Practices → Duplicate utilities") and an unnecessary image preloading directive. This spec addresses:

1. **Duplicated `verifyTurnstileToken()` function** — identical 34-line function copy-pasted across both server action files.
2. **Duplicated `escapeHtml()` utility** — two slightly different implementations in `lib/email.ts` and `lib/telegram.ts`.
3. **Unnecessary `priority` on below-the-fold brand marquee images** — the first 3 brand logos in Row 1 have `priority={true}` despite being well below the viewport fold.

No new features, no database changes, no breaking changes.

---

## 1. What We Are Going to Do

| #   | Target File                                    | Action Required                                                                                       |
| --- | ---------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| 1   | `lib/turnstile.ts`                             | **[NEW]** Extract shared `verifyTurnstileToken()` function into a dedicated server-side utility.      |
| 2   | `actions/quote.ts`                             | Remove inline `verifyTurnstileToken()` (L23-57), import from `@/lib/turnstile`.                       |
| 3   | `actions/contact.ts`                           | Remove inline `verifyTurnstileToken()` (L14-48), import from `@/lib/turnstile`.                       |
| 4   | `lib/html.ts`                                  | **[NEW]** Extract shared `escapeHtml()` utility with 5-character superset escaping.                   |
| 5   | `lib/email.ts`                                 | Remove local `escapeHtml()` function (L151-158), import from `@/lib/html`.                            |
| 6   | `lib/telegram.ts`                              | Remove local `escapeHtml()` function (L92-97), import from `@/lib/html`.                              |
| 7   | `components/sections/brand-marquee.tsx`         | Change `priority={idx < 3}` to `priority={false}` on L70, ensuring all marquee images lazy load.     |

---

## 2. Why We Are Doing This

1. **Project Standards Alignment:**
   - `context/code-standards.md` § "Reusability": _"Before creating new code: Search existing components, hooks, utilities, schemas. Avoid duplication."_
   - `context/code-standards.md` § "Forbidden Practices": _"Never introduce: Duplicate utilities."_
   - `context/architecture.md` § "Forbidden Patterns": _"Duplicate business logic."_
   
2. **Performance — Image Loading:**
   - `context/seo.md` § "Core Web Vitals": LCP < 2.5s target. Reserving `priority` for above-the-fold images (hero + logo only) prevents unnecessary early fetches of below-the-fold brand logos, reducing initial bandwidth contention and improving LCP.
   - `context/ui-context.md` § "Performance": _"Prefer lazy loading."_

3. **Maintainability:**
   - Having a single source of truth for Turnstile verification logic means security patches (e.g., changing the verification endpoint or bypass rules) only need to be applied once.
   - A shared `escapeHtml()` function ensures consistent XSS-safe HTML output across all template generators.

---

## 3. How We Are Going to Implement It

### Step 1: Extract `verifyTurnstileToken()` to `lib/turnstile.ts`

Create a new server-side utility file:

```ts
// lib/turnstile.ts

/**
 * Server-side validation of Cloudflare Turnstile anti-bot token.
 * Shared across all server actions that accept user-submitted forms.
 */
export async function verifyTurnstileToken(token?: string): Promise<boolean> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  // If Turnstile is not configured or using test dummy keys, bypass check safely
  if (!secretKey || !siteKey || secretKey.startsWith("1x000000")) return true;
  if (!token) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[Turnstile Dev Warning]: No token provided, bypassing in non-production environment.");
      return true;
    }
    return false;
  }

  try {
    const formData = new URLSearchParams();
    formData.append("secret", secretKey);
    formData.append("response", token);

    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        body: formData,
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );

    const data = await response.json();
    return Boolean(data.success);
  } catch (error) {
    console.error("[Turnstile Verification Exception]:", error);
    return process.env.NODE_ENV !== "production";
  }
}
```

Then in `actions/quote.ts`:
- Delete the inline `verifyTurnstileToken` function (lines 23-57).
- Add import: `import { verifyTurnstileToken } from "@/lib/turnstile";`

Then in `actions/contact.ts`:
- Delete the inline `verifyTurnstileToken` function (lines 14-48).
- Add import: `import { verifyTurnstileToken } from "@/lib/turnstile";`

### Step 2: Extract `escapeHtml()` to `lib/html.ts`

Create a new shared utility file:

```ts
// lib/html.ts

/**
 * Escapes HTML special characters to prevent XSS in dynamically generated HTML templates.
 * Covers the 5 standard HTML-unsafe characters required for email and messaging templates.
 */
export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
```

Then in `lib/email.ts`:
- Delete the local `escapeHtml` function (lines 151-158).
- Add import: `import { escapeHtml } from "@/lib/html";`

Then in `lib/telegram.ts`:
- Delete the local `escapeHtml` function (lines 92-97).
- Add import: `import { escapeHtml } from "@/lib/html";`

> **Note:** The Telegram function previously only escaped 3 characters (`&`, `<`, `>`). The 5-character superset is safe for Telegram's HTML parse mode — double-quote and apostrophe escaping are harmless in Telegram messages and provide defense-in-depth.

### Step 3: Remove `priority` from Brand Marquee Row 1

In `components/sections/brand-marquee.tsx` line 70, change:

```tsx
// Before
priority={idx < 3}

// After
priority={false}
```

This ensures all brand marquee images (both Row 1 and Row 2) consistently use Next.js default lazy loading, reserving `priority` exclusively for the above-the-fold hero image and logo preload.

---

## 4. When We Are Going to Do It

```text
Phase 1: Shared Utilities Extraction
    │ ── Create lib/turnstile.ts
    │ ── Create lib/html.ts
    ▼
Phase 2: Consumer Refactoring
    │ ── Refactor actions/quote.ts (remove duplicate, add import)
    │ ── Refactor actions/contact.ts (remove duplicate, add import)
    │ ── Refactor lib/email.ts (remove duplicate, add import)
    │ ── Refactor lib/telegram.ts (remove duplicate, add import)
    ▼
Phase 3: Image Optimization Fix
    │ ── Update components/sections/brand-marquee.tsx (priority → false)
    ▼
Phase 4: Verification & Build Validation
    │ ── pnpm run lint (0 errors)
    │ ── pnpm run build (exit code 0)
```

---

## 5. Required Data & Data Sources

| Data Requirement                  | Origin / Source                                | Usage                                                  |
| --------------------------------- | ---------------------------------------------- | ------------------------------------------------------ |
| Turnstile verification logic      | Existing `actions/quote.ts` L23-57             | Extracted verbatim to `lib/turnstile.ts`               |
| HTML escape logic (5-char)        | Existing `lib/email.ts` L151-158               | Extracted verbatim to `lib/html.ts`                    |
| Brand marquee image priority prop | Existing `components/sections/brand-marquee.tsx` L70 | Changed from `idx < 3` to `false`                |
| Environment variables             | `.env.local` (TURNSTILE_SECRET_KEY, etc.)      | Referenced by `lib/turnstile.ts` — no changes needed   |

---

## 6. What Could Possibly Go Wrong & Mitigation Plan

| Potential Risk                          | Root Cause                                                         | Prevention / Mitigation Strategy                                                                                               |
| --------------------------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| **Broken Turnstile verification**       | Import path typo or function signature mismatch after extraction.  | Function is copied verbatim. TypeScript compiler will catch any mismatches. Verified by `pnpm run build`.                       |
| **Email/Telegram HTML escaping change** | Telegram previously used 3-char escaping; now uses 5-char version. | The two additional escapes (`"` → `&quot;`, `'` → `&#039;`) are harmless in Telegram HTML mode — they render correctly.         |
| **Broken lazy loading on marquee**      | Setting `priority={false}` might affect initial render of marquee. | The marquee is positioned well below the fold (after Hero + WhoWeAre sections). Lazy loading is the correct behavior for LCP.  |
| **ESLint unused import warnings**       | Forgetting to remove old inline functions after import.            | Spec explicitly documents deletion of inline functions. ESLint + TS compiler will flag unused code.                            |

---

## 7. Verification & Definition of Done

1. `pnpm run lint` executes with **zero errors** and **zero warnings**.
2. `pnpm run build` compiles cleanly with **exit code 0** and all 30 pages generated.
3. `lib/turnstile.ts` is the **single source of truth** for Turnstile verification — no other file contains a `verifyTurnstileToken` function.
4. `lib/html.ts` is the **single source of truth** for HTML escaping — no other file contains an `escapeHtml` function.
5. No `priority={true}` or dynamic `priority` on any brand marquee `<Image>` component.
6. Both `actions/quote.ts` and `actions/contact.ts` import `verifyTurnstileToken` from `@/lib/turnstile`.
7. Both `lib/email.ts` and `lib/telegram.ts` import `escapeHtml` from `@/lib/html`.
8. Manual verification: Submit a test quote and test contact inquiry in dev to confirm Turnstile bypass, email fallback, and Telegram fallback all still function correctly.
