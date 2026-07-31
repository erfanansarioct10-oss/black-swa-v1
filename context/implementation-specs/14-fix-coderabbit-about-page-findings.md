# Implementation Spec 14: Fix CodeRabbit About Page Review Findings

> **Spec ID:** `14-fix-coderabbit-about-page-findings`  
> **Target Branch / PR:** `about-us` / PR #6  
> **Status:** Complete  
> **Created Date:** 2026-07-31  

---

## Executive Summary

This specification documents the technical remediation plan for CodeRabbit review findings on the About Us page implementation (commit `7407abf` / PR #6). The fixes address capability pillar image duplication, WAI-ARIA roving tabindex and keyboard navigation in the capabilities tablist, visually hidden section headings for HTML5 document outline compliance, standardized ultra-small font utilities, and progress tracker alignment.

---

## 1. What We Are Going to Do

List of files modified and created:

| # | Target File | Action Required |
| --- | --- | --- |
| 1 | `constants/about.ts` | **[MODIFY]** Assign 5 distinct image paths (`ott-platform.png`, `amc-support.png`) to `ABOUT_PILLARS`. |
| 2 | `public/about/ott-platform.png` | **[NEW]** Photorealistic AI-generated image asset for OTT Video Platforms pillar. |
| 3 | `public/about/amc-support.png` | **[NEW]** Photorealistic AI-generated image asset for AMC Maintenance Contracts pillar. |
| 4 | `components/sections/about/about-what-we-do.tsx` | **[MODIFY]** Add `onKeyDown` ArrowLeft/ArrowRight navigation, roving `tabIndex`, and replace `text-2xs` with `text-[10px]`. |
| 5 | `components/sections/about/about-how-we-assist.tsx` | **[MODIFY]** Replace `text-2xs` label utility with explicit `text-[10px]`. |
| 6 | `components/sections/about/about-stats.tsx` | **[MODIFY]** Add visually hidden `<h2 className="sr-only">` section label for screen reader hierarchy. |
| 7 | `context/progress-tracker.md` | **[MODIFY]** Update `Current Goal` to reflect completed About Us page implementation. |

---

## 2. Why We Are Doing This

1. **Accessibility Compliance (WCAG 2.1 AA & WAI-ARIA):**
   - Roving `tabIndex` (`0` for active tab, `-1` for inactive tabs) and `ArrowLeft` / `ArrowRight` keyboard navigation satisfy WAI-ARIA 1.2 Tabs Pattern specs.
   - Adding `<h2 className="sr-only">` ensures screen readers can navigate section landmarks without missing header nodes.
2. **Visual Distinction & UX Excellence:**
   - Every service capability pillar requires a unique visual representation rather than repeating identical image assets across tabs.
3. **Typography & Styling Consistency:**
   - Standardizing custom small label classes to explicit `text-[10px]` prevents unstyled fallback rendering.

---

## 3. How We Are Going to Implement It

### Step 1: Distinct Image Assets & Data Model Update

Assign unique image paths in `constants/about.ts`:
- `broadcast-integrator`: `/about/broadcast-headend.png`
- `headend-systems`: `/about/noc-operations.png`
- `ott-services`: `/about/ott-platform.png`
- `it-software`: `/about/engineering-team.png`
- `amc-contracts`: `/about/amc-support.png`

### Step 2: Keyboard Navigation & Roving Tabindex in `about-what-we-do.tsx`

Implement `handleKeyDown` on `role="tablist"`:
```tsx
const handleKeyDown = (e: React.KeyboardEvent) => {
  const currentIndex = ABOUT_PILLARS.findIndex((p) => p.id === activeTabId);
  if (e.key === "ArrowRight") {
    e.preventDefault();
    const nextIndex = (currentIndex + 1) % ABOUT_PILLARS.length;
    setActiveTabId(ABOUT_PILLARS[nextIndex].id);
    document.getElementById(`tab-${ABOUT_PILLARS[nextIndex].id}`)?.focus();
  } else if (e.key === "ArrowLeft") {
    e.preventDefault();
    const prevIndex = (currentIndex - 1 + ABOUT_PILLARS.length) % ABOUT_PILLARS.length;
    setActiveTabId(ABOUT_PILLARS[prevIndex].id);
    document.getElementById(`tab-${ABOUT_PILLARS[prevIndex].id}`)?.focus();
  }
};
```
Apply `tabIndex={isActive ? 0 : -1}` to each button.

### Step 3: Accessible Section Landmarks

Add sr-only heading inside `AboutStats`:
```tsx
<h2 className="sr-only">Key Performance Statistics &amp; Engineering Track Record</h2>
```

---

## 4. Required Data & Data Sources

| Data Requirement | Origin / Source | Usage |
| --- | --- | --- |
| Pillar Images | `public/about/*.png` | Rendered in `AboutWhatWeDo` active tab detail container |
| About Constants | `constants/about.ts` | Shared data structure driving statistics and capability pillars |

---

## 5. What Could Possibly Go Wrong & Mitigation Plan

| Potential Risk | Root Cause | Prevention / Mitigation Strategy |
| --- | --- | --- |
| **Keyboard Focus Jump** | Imperfect `getElementById` focus targets. | Explicitly construct matching `id={`tab-${pillar.id}`}` on each button before invoking `.focus()`. |
| **Asset Load Delays** | Large png images slowing down desktop tab view. | Next.js `<Image fill sizes="(min-width: 1024px) 35vw, 90vw" />` automatically generates responsive WebP variants. |

---

## 6. Verification & Definition of Done

1. `pnpm run lint` completes with 0 errors and 0 warnings.
2. `pnpm run build` generates 100% static routes cleanly.
3. Git commit and push to `origin/about-us`.
