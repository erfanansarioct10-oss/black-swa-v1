# Implementation Spec 16: Fix CodeRabbit Review Findings for Services System

> **Spec ID:** `16-fix-coderabbit-services-page-findings`  
> **Target Branch / PR:** `about-us` / PR #7  
> **Status:** Approved  
> **Created Date:** 2026-07-31  

---

## Executive Summary

Remediate CodeRabbit PR review findings following commit `49215b1`. Fixes address text wording & typo cleanups in `constants/services.ts`, dynamic count binding on `/services`, WAI-ARIA `aria-pressed` accessibility on filter tabs, `FAQPage` JSON-LD structured data on `/services/[slug]`, accurate `publishedDate` in `app/sitemap.ts`, clean service query fallback in `ContactFormInner`, and specification alignment.

---

## 1. What We Are Going to Do

| # | Target File | Action Required |
| - | ----------- | --------------- |
| 1 | `constants/services.ts` | Fix typos: remove duplicate "rundowns" in NRCS desc, change "a intuitive" to "an intuitive", remove duplicate "Fill/Key". |
| 2 | `app/(public)/services/page.tsx` | Bind count strings to `{ALL_SERVICES.length}` instead of hardcoded `15`. |
| 3 | `components/services/services-client-grid.tsx` | Add `aria-pressed={isActive}` and `type="button"` to category filter tabs. |
| 4 | `app/sitemap.ts` | Set `lastModified: new Date(serv.blogContent.publishedDate)` for service sitemap entries. |
| 5 | `app/(public)/services/[slug]/page.tsx` | Emit `FAQPage` JSON-LD structured data alongside `Service` and `TechArticle`. |
| 6 | `components/contact/contact-form.tsx` | Fallback `defaultServiceName` to `undefined` if raw query string fails to match `ALL_SERVICES`. |
| 7 | `context/implementation-specs/15-services-page-and-detail-blog-system.md` | Align spec documentation with light theme implementation. |
| 8 | `context/implementation-specs/README.md` | Index Spec 16 in registry. |
| 9 | `context/progress-tracker.md` | Document completion of Spec 16. |

---

## 2. Rationale & Quality Improvements

1. **WAI-ARIA Accessibility:** Exposes active tab filter state (`aria-pressed`) to screen readers (`context/ui-context.md`).
2. **SEO & Rich Snippets:** `FAQPage` JSON-LD qualifies `/services/[slug]` pages for Google & AI search FAQ rich results (`context/seo.md`).
3. **Data Integrity:** Eliminates copy typos and hardcoded string drift across the service catalog.

---

## 3. Verification Plan

1. Run `pnpm run lint` - verify 0 errors and 0 warnings.
2. Run `pnpm run build` - verify 100% clean TypeScript build & dynamic SSG generation.
