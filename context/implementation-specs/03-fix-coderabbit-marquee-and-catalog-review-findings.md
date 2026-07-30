# Implementation Spec 03: Fix CodeRabbit Marquee & Product Catalog Review Findings

> **Spec ID:** 03-fix-coderabbit-marquee-and-catalog-review-findings  
> **Target Branch / PR:** main  
> **Status:** Draft  
> **Created Date:** 2026-07-30  

---

## Executive Summary

This specification addresses 6 CodeRabbit code review findings across the product catalog filtering page (`app/(public)/products/page.tsx`), global marquee CSS animation preferences (`app/globals.css`), brand constants (`constants/brands.ts`), brand marquee section component (`components/sections/brand-marquee.tsx`), and implementation documentation (`context/implementation-specs/02-homepage-brand-marquee-section.md` and `context/implementation-specs/README.md`).

Key improvements include:
1. Category query parameter normalization and validation for product filtering.
2. Accessibility enhancements for screen readers in the marquee section (`aria-hidden` and `sr-only` fallback list).
3. `prefers-reduced-motion` CSS media query support.
4. Image preloading (`priority`) optimization in the marquee component.
5. Brand asset path cleanup.
6. Documentation section structure and markdown fence fixes.

---

## 1. What We Are Going to Do

List of files created or modified:

| #   | Target File | Action Required |
| --- | ----------- | --------------- |
| 1   | `app/(public)/products/page.tsx` | **[MODIFY]** Normalize `categoryParam` to lowercase, validate against allowed categories (`all`, `medical`, `broadcast`), default invalid queries to `all`, and ensure `<select>` value sync. |
| 2   | `app/globals.css` | **[MODIFY]** Add `@media (prefers-reduced-motion: reduce)` block to pause/disable `.animate-marquee` and `.animate-marquee-reverse` animations. |
| 3   | `constants/brands.ts` | **[MODIFY]** Update `cg` brand `imageSrc` from `/brands/cg-new.webp` to `/brands/cg.webp`. |
| 4   | `components/sections/brand-marquee.tsx` | **[MODIFY]** Extract 4x array repetition to a helper function, set `aria-hidden="true"` on decorative tracks, add an `sr-only` brand list for screen reader accessibility, and remove/optimize `priority` preloading. |
| 5   | `context/implementation-specs/02-homepage-brand-marquee-section.md` | **[MODIFY]** Add `@media (prefers-reduced-motion: reduce)` to spec Step 1, insert dedicated Section 6 (What Could Possibly Go Wrong & Mitigation Plan), and renumber Verification section to Section 7. |
| 6   | `context/implementation-specs/README.md` | **[MODIFY]** Remove stray code-fence delimiters around Section 8 (Agent Workflow Integration). |

---

## 2. Why We Are Doing This

1. **Accessibility (WCAG 2.1 & Project Standards):** Continuous infinite scrolling animations without `prefers-reduced-motion` support can cause vestibular motion trigger issues. Repeating brand images 4x in decorative marquee tracks causes screen readers to redundantly announce each brand up to 4 times per row.
2. **Robust Input Validation (Architecture & Security Principles):** Query parameters like `?category=INVALID` or `?category=MEDICAL` should fail gracefully to safe defaults (`all`) while maintaining controlled React select state.
3. **Performance Optimization:** Marking 18 non-hero decorative marquee logos with `priority={true}` creates excessive network preload requests on page load. Limiting or removing `priority` improves core web vitals.
4. **Data & Spec Integrity:** Asset paths should strictly align with standard conventions (`cg.webp`), and specification documents must strictly match standard repository layout rules.

---

## 3. How We Are Going to Implement It

### Step 1: Product Catalog Category Validation (`app/(public)/products/page.tsx`)

Validate category search parameter using strict allowed set (`"all" | "medical" | "broadcast"`):

```typescript
const VALID_CATEGORIES = ["all", "medical", "broadcast"] as const;

const rawCategory = searchParams.get("category")?.toLowerCase() || "all";
const activeCategory = (VALID_CATEGORIES as readonly string[]).includes(rawCategory)
  ? rawCategory
  : "all";
```

### Step 2: Reduced Motion Support (`app/globals.css`)

Add media query for users who prefer reduced motion:

```css
@media (prefers-reduced-motion: reduce) {
  .animate-marquee,
  .animate-marquee-reverse {
    animation-play-state: paused;
  }
}
```

### Step 3: Brand Asset Path Standardization (`constants/brands.ts`)

Update `cg` brand entry to point to standard `/brands/cg.webp`:

```typescript
{
  id: "cg",
  name: "Chaudhary Group",
  category: "hardware",
  imageSrc: "/brands/cg.webp",
}
```

### Step 4: Brand Marquee Component Refactoring (`components/sections/brand-marquee.tsx`)

1. **Array Duplication Helper:**
   ```typescript
   const repeatArray = <T,>(arr: T[], times = 4): T[] =>
     Array.from({ length: times }, () => arr).flat();

   const row1 = repeatArray(BRAND_LOGOS_ROW_1);
   const row2 = repeatArray(BRAND_LOGOS_ROW_2);
   ```

2. **Screen Reader Accessibility & Priority Optimization:**
   - Mark the scrolling tracks container with `aria-hidden="true"`.
   - Provide an `sr-only` block containing a non-duplicated list of featured brand partner names.
   - Limit `priority={true}` to only the first 2-3 visible items of Row 1 (e.g. `idx < 3`) and set `priority={false}` for row 2 and duplicate copies.

### Step 5: Spec Documentation Updates

- Update `context/implementation-specs/02-homepage-brand-marquee-section.md` section numbers and include reduced motion CSS.
- Remove stray markdown fences around Section 8 in `context/implementation-specs/README.md`.

---

## 4. When We Are Going to Do It

```text
Phase 1: Brand Constants & Global CSS Styles
    │
    ▼
Phase 2: Product Catalog Category Validation
    │
    ▼
Phase 3: BrandMarquee Component Accessibility & Preload Optimization
    │
    ▼
Phase 4: Implementation Specification Documentation Updates
    │
    ▼
Phase 5: Automated Verification (Lint & Build Validation)
```

---

## 5. Required Data & Data Sources

| Data Requirement | Origin / Source | Usage |
| ---------------- | --------------- | ----- |
| Product Categories | `app/(public)/products/page.tsx` (`VALID_CATEGORIES`) | Allowed filter parameters (`"all"`, `"medical"`, `"broadcast"`) |
| Brand Logo Metadata | `constants/brands.ts` | `BRAND_LOGOS_ROW_1` and `BRAND_LOGOS_ROW_2` arrays |

---

## 6. What Could Possibly Go Wrong & Mitigation Plan

| Potential Risk | Root Cause | Prevention / Mitigation Strategy |
| -------------- | ---------- | -------------------------------- |
| **Controlled Select Mismatch** | URL query parameter contains uppercase or invalid category value. | Normalize parameter with `.toLowerCase()` and validate against allowed list. |
| **Accessibility Tree Pollution** | Marquee tracks repeat images 4x for continuous scroll. | Set `aria-hidden="true"` on decorative tracks and provide an `sr-only` single list of brands. |
| **High Network Preload Overhead** | 18 logos marked with `priority={true}`. | Limit `priority` to initial 2-3 visible viewport items only. |
| **Unintended Animation Stutter** | Reduced motion styles removing keyframe offsets incorrectly. | Use `animation-play-state: paused` so layout alignment is perfectly preserved. |

---

## 7. Verification & Definition of Done

1. `pnpm run lint` executes with 0 errors and 0 warnings.
2. `pnpm run build` compiles without TypeScript or build errors.
3. Accessible screen reader verification ensures brand names are announced once.
