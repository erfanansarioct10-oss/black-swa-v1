**Actionable comments posted: 17**

> [!NOTE]
> Due to the large number of review comments, Critical, Major severity comments were prioritized as inline comments.

> [!CAUTION]
> Some comments are outside the diff and can’t be posted inline due to platform limitations.
>
> <details>
> <summary>⚠️ Outside diff range comments (1)</summary><blockquote>
>
> <details>
> <summary>components/layout/top-utility-bar.tsx (1)</summary><blockquote>
>
> `1-41`: _📐 Maintainability & Code Quality_ | _🟡 Minor_ | _⚡ Quick win_
>
> **Wire `TopUtilityBar` into the public layout.** It isn’t rendered by `app/(public)/layout.tsx` or the root `app/layout.tsx`, so it will never appear unless it’s imported into one of those shells.
>
> <details>
> <summary>🤖 Prompt for AI Agents</summary>
>
> ```
> Verify each finding against current code. Fix only still-valid issues, skip the
> rest with a brief reason, keep changes minimal, and validate.
>
> In `@components/layout/top-utility-bar.tsx` around lines 1 - 41, Render the
> existing TopUtilityBar component from the public layout shell, preferably
> app/(public)/layout.tsx, so it appears across public pages. Import TopUtilityBar
> and place it at the appropriate top-level position in the layout while
> preserving the existing page content and root layout behavior.
> ```
>
> </details>
>
> <!-- cr-comment:v1:805b0dbc61f4ac832a392449 -->
>
> </blockquote></details>
>
> </blockquote></details>

<details>
<summary>🟡 Minor comments (10)</summary><blockquote>

<details>
<summary>app/globals.css-165-179 (1)</summary><blockquote>

`165-179`: _🎯 Functional Correctness_ | _🟡 Minor_ | _⚡ Quick win_

**Scope the icon color override to explicit component classes.**

These selectors match arbitrary rounded containers and override intended SVG utility colors—including destructive or warning states—with blue. Replace the `class*="rounded-*"` rules and `!important` overrides with an opt-in icon-container class.

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@app/globals.css` around lines 165 - 179, Replace the broad rounded-container
selectors in the icon color override with an explicit opt-in icon-container
class used by intended components only. Remove the global .text-emerald-400 and
.text-emerald-500 !important overrides, preserving each icon’s existing utility
color unless its container explicitly opts into the override.
```

</details>

<!-- cr-comment:v1:7cb339e7213dfe94911b4fa9 -->

</blockquote></details>
<details>
<summary>lib/seo.ts-21-24 (1)</summary><blockquote>

`21-24`: _🎯 Functional Correctness_ | _🟡 Minor_ | _⚡ Quick win_

**Avoid appending the site name twice in metadata titles.**

`app/layout.tsx` already applies the `"%s | Black Swan International"` template, so `lib/seo.ts#L21-L24` should return the plain page title and keep `fullTitle` only for Open Graph/Twitter. Update `context/implementation-specs/05-seo-compliance-and-technical-optimization.md#L92-L123` to match.

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@lib/seo.ts` around lines 21 - 24, The metadata title returned by the SEO
helper is duplicated by the layout template. In lib/seo.ts lines 21-24, return
the plain page title for the metadata title while retaining fullTitle for Open
Graph and Twitter fields; update
context/implementation-specs/05-seo-compliance-and-technical-optimization.md
lines 92-123 to document this behavior.
```

</details>

<!-- cr-comment:v1:9e919bd655a5dbe3f9ba4504 -->

</blockquote></details>
<details>
<summary>context/progress-tracker.md-34-34 (1)</summary><blockquote>

`34-34`: _🗄️ Data Integrity & Integration_ | _🟡 Minor_ | _⚡ Quick win_

**Correct the stale advantage asset extension.**

The tracker references `public/advantages/*.jpg`, while the supplied implementation context uses `.webp` assets. Stale paths will mislead verification and future contributors.

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@context/progress-tracker.md` at line 34, Update the Enterprise Advantage &
Trust Grid entry in the progress tracker to reference the supplied
public/advantages/*.webp assets instead of *.jpg, leaving the rest of the
implementation summary unchanged.
```

</details>

<!-- cr-comment:v1:82313aafdc6f4f31490ce81e -->

</blockquote></details>
<details>
<summary>context/implementation-specs/01-fix-coderabbit-pr-review-findings.md-140-146 (1)</summary><blockquote>

`140-146`: _📐 Maintainability & Code Quality_ | _🟡 Minor_ | _⚡ Quick win_

**Keep the completed spec synchronized with ESLint configuration.**

The documented `nextTs` glob list omits `constants/**` and `context/**`, while `eslint.config.mjs` now includes both. Update the spec to match the implemented globs or reference the configuration directly.

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@context/implementation-specs/01-fix-coderabbit-pr-review-findings.md` around
lines 140 - 146, Update the Step 9 `nextTs.map` documentation to include the
`constants/**/*.{ts,tsx}` and `context/**/*.{ts,tsx}` globs implemented in
`eslint.config.mjs`, or replace the explicit list with a direct reference to
that configuration.
```

</details>

<!-- cr-comment:v1:b2819162a2820e009abc01fa -->

</blockquote></details>
<details>
<summary>context/seo.md-131-155 (1)</summary><blockquote>

`131-155`: _📐 Maintainability & Code Quality_ | _🟡 Minor_ | _⚡ Quick win_

**Add language identifiers to fenced Markdown examples.**

`markdownlint` reports unlabeled fences at these ranges. Use `text`, `ts`, or the appropriate language identifier.

Also applies to: 308-318, 330-340, 360-368

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@context/seo.md` around lines 131 - 155, Add an appropriate language
identifier to the fenced Markdown examples in the SEO documentation, including
the shown route listing and the additional ranges at 308-318, 330-340, and
360-368. Use text for plain route or content listings, and use ts or another
accurate identifier where the fenced content is code, without changing the
example contents.
```

</details>

<!-- cr-comment:v1:0409d5960c5e55cad39279ed -->

_Source: Linters/SAST tools_

</blockquote></details>
<details>
<summary>components/contact/contact-form.tsx-18-19 (1)</summary><blockquote>

`18-19`: _🎯 Functional Correctness_ | _🟡 Minor_ | _⚡ Quick win_

**`errorMessage` is set but never populated with a real error — the error UI is unreachable.**

`errorMessage` is only ever reset to `null` (Lines 29, 47); nothing calls `setErrorMessage` with an actual message, since `handleSubmit` never performs a real request that could fail. The error banner at Lines 141-146 is effectively dead code until real submission logic exists.

Also applies to: 27-36, 141-146

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@components/contact/contact-form.tsx` around lines 18 - 19, The contact form’s
error state and banner are unreachable because handleSubmit does not perform a
real submission or populate errorMessage. Implement the actual request in
handleSubmit, catch submission failures, and call setErrorMessage with a
user-facing message so the existing error UI can render; retain clearing the
message when a new submission begins.
```

</details>

<!-- cr-comment:v1:5a22bff6a2711c21a212d995 -->

</blockquote></details>
<details>
<summary>components/quote/quote-request.tsx-241-241 (1)</summary><blockquote>

`241-241`: _📐 Maintainability & Code Quality_ | _🟡 Minor_ | _⚡ Quick win_

**Conflicting padding utilities on the submit button.**

The class list has both `py-3.5` and a trailing `pt-3`, which is likely an unintentional leftover causing asymmetric vertical padding on the primary CTA.

<details>
<summary>🎨 Proposed fix</summary>

```diff
-            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-foreground text-background text-sm font-bold shadow hover:opacity-90 transition-opacity disabled:opacity-50 pt-3"
+            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-foreground text-background text-sm font-bold shadow hover:opacity-90 transition-opacity disabled:opacity-50"
```

</details>

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@components/quote/quote-request.tsx` at line 241, Remove the trailing pt-3
utility from the submit button’s className, preserving py-3.5 as the sole
vertical padding definition so the primary CTA remains symmetrically padded.
```

</details>

<!-- cr-comment:v1:1140866e65fae909526529c3 -->

</blockquote></details>
<details>
<summary>components/quote/quote-request.tsx-134-161 (1)</summary><blockquote>

`134-161`: _🎯 Functional Correctness_ | _🟡 Minor_ | _⚡ Quick win_

**Icon-only quantity/remove buttons lack accessible names.**

The Minus/Plus quantity buttons (Lines 134-150) render only an icon with no `aria-label`, and the remove button (Lines 154-161) relies solely on `title`, which isn't a reliably announced accessible name across screen readers.

<details>
<summary>♿ Proposed fix</summary>

```diff
                   <button
                     type="button"
                     onClick={() => updateQuantity(item.id, item.quantity - 1)}
+                    aria-label={`Decrease quantity of ${item.name}`}
                     className="p-2 hover:bg-muted text-muted-foreground hover:text-foreground rounded-l-lg transition-colors"
                   >
                     <Minus className="h-3.5 w-3.5" />
                   </button>
                   <span className="px-3 text-xs font-mono font-bold text-foreground">
                     {item.quantity}
                   </span>
                   <button
                     type="button"
                     onClick={() => updateQuantity(item.id, item.quantity + 1)}
+                    aria-label={`Increase quantity of ${item.name}`}
                     className="p-2 hover:bg-muted text-muted-foreground hover:text-foreground rounded-r-lg transition-colors"
                   >
                     <Plus className="h-3.5 w-3.5" />
                   </button>
                 </div>

                 {/* Remove Button */}
                 <button
                   type="button"
                   onClick={() => removeItem(item.id)}
+                  aria-label={`Remove ${item.name} from quote cart`}
                   className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                   title="Remove Item"
                 >
```

</details>

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@components/quote/quote-request.tsx` around lines 134 - 161, Update the
quantity controls and remove button in the quote item controls to provide
explicit accessible names: add descriptive aria-labels to the Minus and Plus
buttons and to the button invoking removeItem. Preserve the existing click
handlers, icons, titles, and styling.
```

</details>

<!-- cr-comment:v1:195a9d899a4ddb08fe89ca51 -->

</blockquote></details>
<details>
<summary>components/sections/featured-products-section.tsx-22-34 (1)</summary><blockquote>

`22-34`: _🎯 Functional Correctness_ | _🟡 Minor_ | _⚡ Quick win_

**Stale timeout can prematurely revert "Added" state on rapid re-clicks.**

Each click schedules a new 1500ms timeout without clearing any pending one for the same product. If a user clicks "Add to Quote" again before the first timeout fires, the earlier timeout still resets `addedIds[prod.id]` to `false`, causing the UI to flicker back to "Add to Quote Cart" even though a more recent click just happened.

<details>
<summary>🐛 Proposed fix to track/clear per-product timeouts</summary>

```diff
+import { useRef, useState } from "react";
-import { useState } from "react";
 ...
 export function FeaturedProductsSection() {
   const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});
+  const timeoutsRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
   const { addItem } = useQuoteCart();

   const handleAddToQuote = (prod: SampleProduct) => {
     addItem({
       id: prod.id,
       name: prod.name,
       sku: prod.sku,
       category: prod.categoryDisplay,
     });

     setAddedIds((prev) => ({ ...prev, [prod.id]: true }));
-    setTimeout(() => {
+    if (timeoutsRef.current[prod.id]) {
+      clearTimeout(timeoutsRef.current[prod.id]);
+    }
+    timeoutsRef.current[prod.id] = setTimeout(() => {
       setAddedIds((prev) => ({ ...prev, [prod.id]: false }));
     }, 1500);
   };
```

</details>

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@components/sections/featured-products-section.tsx` around lines 22 - 34,
Update handleAddToQuote to track pending timeout handles per product ID and
clear the existing handle before scheduling a new 1500ms reset. Store the newly
scheduled handle for prod.id, and remove it when the timeout completes so only
the latest click can reset addedIds[prod.id].
```

</details>

<!-- cr-comment:v1:086618cc9db4a749b12ced01 -->

</blockquote></details>
<details>
<summary>app/(public)/products/page.tsx-16-41 (1)</summary><blockquote>

`16-41`: _🗄️ Data Integrity & Integration_ | _🟡 Minor_ | _⚡ Quick win_

**Use a numeric price or drop `offers`**

`price: "Request Quote"` may fit Schema.org’s broader typing, but it won’t satisfy Google Product rich-results requirements. For quote-only products, omit the `offers` block instead of emitting a placeholder price.

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@app/`(public)/products/page.tsx around lines 16 - 41, Update the
`itemListSchema` mapping so quote-only products do not emit an `offers` block
with the nonnumeric `"Request Quote"` price. Remove `offers` for these products
while preserving the existing product metadata and valid offer data if a numeric
price is available.
```

</details>

<!-- cr-comment:v1:1f3db954a7b7064f4ce13f21 -->

</blockquote></details>

</blockquote></details>

<details>
<summary>🧹 Nitpick comments (10)</summary><blockquote>

<details>
<summary>next.config.ts (1)</summary><blockquote>

`4-11`: _🔒 Security & Privacy_ | _🔵 Trivial_ | _⚡ Quick win_

**Constrain the remote image pattern.**

This host-only pattern permits optimization of any path on `images.unsplash.com`. If only specific Unsplash photo paths are intended, add `pathname` and `search` constraints; otherwise remove the entry if unused. Next.js recommends path-scoped remote patterns for this purpose. ([nextjs.org](https://nextjs.org/docs/app/api-reference/components/image?utm_source=openai))

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@next.config.ts` around lines 4 - 11, Constrain the remote pattern in the
images configuration to the intended Unsplash photo paths by adding appropriate
pathname and search restrictions, or remove the images.unsplash.com entry if it
is unused. Do not leave a host-only pattern that permits all paths.
```

</details>

<!-- cr-comment:v1:12a42f372e7c048cc925288c -->

</blockquote></details>
<details>
<summary>eslint.config.mjs (1)</summary><blockquote>

`18-39`: _📐 Maintainability & Code Quality_ | _🔵 Trivial_ | _⚡ Quick win_

**Verify lint coverage for root configuration files.**

The new `files` arrays exclude `next.config.ts` and `eslint.config.mjs`, so `eslint .` may leave those files unconfigured or report no-matching-config warnings. Add a root config glob/config entry, or confirm the exclusion with `pnpm exec eslint --print-config next.config.ts`.

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@eslint.config.mjs` around lines 18 - 39, Update the ESLint configuration
around the nextVitals and nextTs mappings to explicitly cover root configuration
files, including next.config.ts and eslint.config.mjs, or verify and preserve
their intentional exclusion using eslint --print-config. Ensure eslint .
processes these files without unconfigured-file or no-matching-config warnings.
```

</details>

<!-- cr-comment:v1:ada012ef6b1b5ebe2c6c9356 -->

</blockquote></details>
<details>
<summary>context/implementation-specs/02-homepage-brand-marquee-section.md (1)</summary><blockquote>

`122-131`: _🚀 Performance & Scalability_ | _🔵 Trivial_ | _⚡ Quick win_

**Use one Next 16-compatible preload strategy across both marquee specs.**

Both documents prescribe the deprecated `priority` API for decorative marquee images and conflict with the stated goal of limiting eager requests. Use `preload` only for the few genuinely above-the-fold images, or omit preloading for marquee logos.

- `context/implementation-specs/02-homepage-brand-marquee-section.md#L122-L131`: replace `priority` usage and stop preloading all first-copy logos.
- `context/implementation-specs/03-fix-coderabbit-marquee-and-catalog-review-findings.md#L100-L103`: update the remediation plan to use `preload` or no preload.

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@context/implementation-specs/02-homepage-brand-marquee-section.md` around
lines 122 - 131, Update BrandItem in
context/implementation-specs/02-homepage-brand-marquee-section.md (lines
122-131) to remove the deprecated priority-based eager loading and avoid
preloading all first-copy marquee logos; use preload only for genuinely
above-the-fold images or omit preloading. Update the marquee remediation
guidance in
context/implementation-specs/03-fix-coderabbit-marquee-and-catalog-review-findings.md
(lines 100-103) to specify the same Next 16-compatible preload-or-no-preload
strategy.
```

</details>

<!-- cr-comment:v1:aceb7936cffe80c3b114dd04 -->

</blockquote></details>
<details>
<summary>components/quote/quote-request.tsx (1)</summary><blockquote>

`105-110`: _🎯 Functional Correctness_ | _🔵 Trivial_ | _⚡ Quick win_

**Consider a confirmation before clearing the entire cart.**

"Clear Cart" wipes all selected items with a single click and no undo/confirmation, risking accidental data loss for a multi-item RFQ.

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@components/quote/quote-request.tsx` around lines 105 - 110, Update the Clear
Cart button’s onClick behavior in the quote request component to require user
confirmation before invoking clearCart. Only call clearCart when the
confirmation is accepted, preserving the existing styling and clearing behavior
otherwise.
```

</details>

<!-- cr-comment:v1:f414b27fc7d1984fce504b2a -->

</blockquote></details>
<details>
<summary>components/contact/contact-form.tsx (1)</summary><blockquote>

`20-36`: _📐 Maintainability & Code Quality_ | _🔵 Trivial_ | _⚡ Quick win_

**Duplicated form-handling boilerplate across contact and quote forms.** Both components implement near-identical `handleChange` and simulated `setTimeout`-based submit logic independently.

- `components/contact/contact-form.tsx#L20-L36`: extract a shared hook (e.g., `useSimulatedFormSubmit`) covering generic-input `handleChange` and submit/pending state.
- `components/quote/quote-request.tsx#L21-L38`: reuse the same shared hook instead of re-implementing the pattern.

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@components/contact/contact-form.tsx` around lines 20 - 36, Extract the
duplicated generic input change handling and simulated submit/pending state from
contact-form.tsx lines 20-36 into a shared useSimulatedFormSubmit hook, then
update contact-form.tsx to use it. Reuse that hook in quote-request.tsx lines
21-38, removing its independent handleChange and setTimeout-based submit
implementation while preserving both forms’ existing submission behavior.
```

</details>

<!-- cr-comment:v1:b5a1ecdb8902ea4ad8ac0c54 -->

</blockquote></details>
<details>
<summary>constants/advantages.ts (1)</summary><blockquote>

`9-29`: _🎯 Functional Correctness_ | _🔵 Trivial_ | _⚡ Quick win_

**Consider a stricter type for `iconName` to catch typos at compile time.**

`iconName` is typed as `string`, but valid values are constrained to `ICON_MAP` keys. A typo in `ENTERPRISE_ADVANTAGES` would silently fall back to `ShieldCheck` (Line 28) instead of failing type-checking.

<details>
<summary>♻️ Proposed fix for stronger typing</summary>

```diff
 const ICON_MAP: Record<string, LucideIcon> = {
   ShieldCheck,
   Clock,
   CheckCircle2,
   Truck,
 };
+
+type AdvantageIconName = keyof typeof ICON_MAP;

 export interface AdvantageItem {
   id: string;
   title: string;
   metric: string;
   badge: string;
   desc: string;
   image: string;
   points: string[];
-  iconName: string;
+  iconName: AdvantageIconName;
 }

-export function getAdvantageIcon(iconName: string): LucideIcon {
+export function getAdvantageIcon(iconName: AdvantageIconName): LucideIcon {
   return ICON_MAP[iconName] || ShieldCheck;
 }
```

</details>

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@constants/advantages.ts` around lines 9 - 29, Restrict AdvantageItem.iconName
and getAdvantageIcon’s parameter to the keys of ICON_MAP, using a derived key
type so ENTERPRISE_ADVANTAGES entries are checked at compile time. Preserve
ShieldCheck as the existing runtime fallback for invalid dynamic values if
needed, but ensure statically defined icon names cannot contain typos.
```

</details>

<!-- cr-comment:v1:2872a0f125fd344d02d0346f -->

</blockquote></details>
<details>
<summary>constants/certifications.ts (1)</summary><blockquote>

`1-1`: _📐 Maintainability & Code Quality_ | _🔵 Trivial_ | _⚡ Quick win_

**`badgeColor` field is defined with identical values on every certification but never actually used for rendering.** `CertificationItem.badgeColor` is populated identically (`bg-emerald-500/10 text-emerald-400 border-emerald-500/20`) on all 6 entries in `constants/certifications.ts`, but `components/sections/certifications-section.tsx` never reads `cert.badgeColor` — it hardcodes the same classes inline for both the card and dialog badges instead.

- `constants/certifications.ts#L70-179`: either drive the field off `status` (e.g., different colors for "Active" vs "Verified" vs "Under Renewal") or drop it from the data model if styling is meant to be static.
- `components/sections/certifications-section.tsx#L100-108`: if the field is kept, wire the badge `className` to `cert.badgeColor` instead of the hardcoded emerald classes.

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@constants/certifications.ts` at line 1, Resolve the unused
CertificationItem.badgeColor contract by either removing the field from the
certification data/model if badge styling remains static, or using
cert.badgeColor for both card and dialog badge className values in the
certifications section; if retained, assign colors based on each certification’s
status.
```

</details>

<!-- cr-comment:v1:1b87aae4ce5bcdf7488f069d -->

</blockquote></details>
<details>
<summary>components/sections/certifications-section.tsx (1)</summary><blockquote>

`100-108`: _📐 Maintainability & Code Quality_ | _🔵 Trivial_ | _⚡ Quick win_

**`cert.badgeColor` from the data model is unused here.**

The component hardcodes `bg-emerald-500/10 text-emerald-400 border-emerald-500/20` directly instead of using `cert.badgeColor`, which exists in `CertificationItem` for exactly this purpose. See consolidated comment for the paired finding in `constants/certifications.ts`.

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@components/sections/certifications-section.tsx` around lines 100 - 108,
Update the certification rendering in the certifications section to apply
cert.badgeColor for the badge styling instead of hardcoded emerald background,
text, and border classes. Keep the existing cert.categoryLabel content and
surrounding layout unchanged.
```

</details>

<!-- cr-comment:v1:ba5e44dce3c75c5c203e31f4 -->

</blockquote></details>
<details>
<summary>app/(public)/page.tsx (1)</summary><blockquote>

`133-139`: _🚀 Performance & Scalability_ | _🔵 Trivial_ | _⚡ Quick win_

**Add `priority` to the above-the-fold hero image.**

This `<Image>` renders in the initial hero viewport (LCP candidate) but lacks `priority`, so Next.js will lazy-load it by default and may delay LCP — impactful for a marketing site betting on SEO/Core Web Vitals.

<details>
<summary>⚡ Proposed fix</summary>

```diff
               <Image
                 src="/hero.webp"
                 alt="Medical Technology & Broadcast Computer Hardware Showcase"
                 width={900}
                 height={750}
+                priority
+                sizes="(min-width: 1024px) 40vw, 90vw"
                 className="relative z-10 w-full h-auto object-contain filter drop-shadow-[0_10px_20px_rgba(37,99,235,0.12)] drop-shadow-xl scale-105 lg:scale-110 origin-center"
               />
```

</details>
Please confirm current Next.js 16 `Image` behavior/defaults for `priority` and responsive `sizes` before applying.

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@app/`(public)/page.tsx around lines 133 - 139, Update the above-the-fold hero
Image element to mark it as high priority for loading, using the current Next.js
16 image-loading API; also verify and configure an appropriate responsive sizes
value if required for this full-width image. Keep the existing source,
dimensions, styling, and accessibility text unchanged.
```

</details>

<!-- cr-comment:v1:604b76c5901a5fb37a3acfde -->

</blockquote></details>
<details>
<summary>app/(public)/about/page.tsx (1)</summary><blockquote>

`47-81`: _📐 Maintainability & Code Quality_ | _🔵 Trivial_ | _⚡ Quick win_

**Duplicate icon-grid-card pattern across `about` and `services` pages.** Both pages independently implement the same `.map((item, idx) => { const Icon = item.icon; ... })` card markup; extracting a shared `FeatureCard`/`ValueCard` component would remove the duplication.

- `app/(public)/about/page.tsx#L47-L81`: replace the inline values-grid map with a shared card component taking `{ icon, title, desc }`.
- `app/(public)/services/page.tsx#L67-L120`: replace the inline services-grid map with the same shared card component.

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@app/`(public)/about/page.tsx around lines 47 - 81, The duplicated icon-grid
card markup should be extracted into a shared FeatureCard or ValueCard component
accepting icon, title, and desc. Update app/(public)/about/page.tsx lines 47-81
and app/(public)/services/page.tsx lines 67-120 to replace each inline
map-rendered card with the shared component, preserving the existing content and
styling at both sites.
```

</details>

<!-- cr-comment:v1:2805b80db3ff5db82b4aed96 -->

</blockquote></details>

</blockquote></details>

<details>
<summary>🤖 Prompt for all review comments with AI agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

Inline comments:
In `@app/robots.ts`:
- Around line 4-15: Update the robots function to distinguish the production
deployment from preview and development environments using the existing site
configuration or deployment environment signal. Keep the current crawl
directives and sitemap for production, but return a policy that blocks
indexing/crawling outside production, including an appropriate disallow/noindex
directive.

In `@components/contact/contact-form.tsx`:
- Around line 27-36: Replace the simulated timeout in handleSubmit in
components/contact/contact-form.tsx with a request to the actual submission
endpoint, sending the contact inquiry payload and handling failures by setting
the existing error state; only set submitting false and submitted true after a
successful response. Apply the same change to the submission handler in
components/quote/quote-request.tsx, ensuring clearCart() and any success-state
updates occur only after the RFQ request succeeds.
- Around line 1-36: Import the React event types explicitly in ContactForm’s
handleChange and handleSubmit, removing the React. prefix from their
annotations; apply the same type-import and annotation update in
quote-request.tsx for its corresponding handlers.

In `@context/implementation-specs/01-fix-coderabbit-pr-review-findings.md`:
- Around line 64-86: Update the CONTACT_INFO phone and email values to approved
production contact details for Black Swan International, replacing the
placeholder values in the phone.display/phone.href and email.display/email.href
fields; if production values are unavailable, clearly mark these contacts as
development-only so public CTAs and forms cannot use them.

In `@context/implementation-specs/02-homepage-brand-marquee-section.md`:
- Around line 219-226: Add the documented accessibility mitigation to the
marquee section: mark the decorative scrolling track containers with
aria-hidden="true", and add a single non-duplicated sr-only list of brand names
for assistive technologies. Update the marquee component’s track rendering
without changing its visual repetition behavior.

In `@context/implementation-specs/04-homepage-certifications-section.md`:
- Around line 63-69: Remove or gate the regulated certification,
FDA/HIPAA/DICOM, SLA, uptime, and logistics claims in
context/implementation-specs/04-homepage-certifications-section.md:63-69,
context/implementation-specs/06-homepage-featured-products-section.md:68-81,
context/implementation-specs/07-homepage-popular-services-section.md:63-75,
context/implementation-specs/08-homepage-enterprise-advantage-section.md:63-107,
and
context/implementation-specs/09-homepage-procurement-workflow-section.md:61-87
so they are not published until legal and quality owners provide product- and
region-specific evidence; use approved wording and do not present FDA
registration as approval, clearance, or authorization.

In `@context/implementation-specs/10-homepage-customer-reviews-section.md`:
- Around line 24-26: Update the CUSTOMER_REVIEWS dataset to include per-entry
provenance, consent, and approval metadata before labeling testimonials as
verified. If those records are unavailable, mark each testimonial as a
placeholder and remove or qualify the verified claim until sign-off is recorded.

In `@context/progress-tracker.md`:
- Around line 53-56: Update the quote-cart reference in the progress tracker to
use the implemented components/providers/quote-cart-provider.tsx module path,
keeping the described React Context and localStorage persistence behavior
unchanged.
- Line 29: Update the marquee entry in the progress tracker so it does not claim
clean completion while the remediation spec remains Draft with unresolved
accessibility and preload findings. Split the entry into baseline implementation
completion and pending remediation, or keep completion pending until the fixes
described in the remediation spec are implemented and verified.

In `@context/seo.md`:
- Around line 280-300: Update the sitemap strategy documentation to match the
current hardcoded eight-route sitemap implementation: either add source-backed
dynamic generation for categories, CMS pages, and future blog posts, or
explicitly mark those entries as future requirements instead of listing them as
currently included. Keep the documented exclusions aligned with the
implementation.
- Around line 127-155: Update the URL Structure list in the SEO documentation to
match the shipped sitemap routes: replace catalog with products and
privacy-policy with privacy, while retaining terms and the other existing
routes. Do not rename implementation routes or consumers; ensure the documented
slugs exactly match the emitted URLs.
- Around line 256-277: Update the robots configuration in the app/robots.ts
robots-generation function to detect preview or development environments and
return a site-wide Disallow: / rule there. Preserve the production behavior of
allowing / while continuing to disallow /admin/ and /api/; ensure the documented
environment-specific behavior is reflected in the implementation.

In `@public/products/telehealth-gateway.webp`:
- Around line 1-2: Replace the duplicate binary asset
public/products/telehealth-gateway.webp with the canonical byte-identical
content from public/services/custom-computing.webp, preserving the expected WebP
format and exact bytes.
- Line 1: Replace the duplicated binary assets so each listing uses its correct
distinct source image: update the files referenced by
telehealth-gateway.webp/custom-computing.webp and
videowall-processor.webp/enterprise-sla.webp, ensuring neither pair remains
byte-for-byte identical while preserving the intended product and service
imagery.

In `@public/products/videowall-processor.webp`:
- Around line 1-2: The image is byte-identical to
public/services/enterprise-sla.webp; remove this duplicate asset and update any
references to use the existing enterprise-sla.webp file, preserving the intended
image behavior.

In `@public/services/custom-computing.webp`:
- Around line 1-2: Replace public/services/custom-computing.webp with a
byte-identical copy of public/products/telehealth-gateway.webp, preserving the
required WebP asset and avoiding any other changes.

In `@public/services/enterprise-sla.webp`:
- Around line 1-2: Replace the duplicate binary represented by
public/services/enterprise-sla.webp with the canonical contents from
public/products/videowall-processor.webp, preserving the file’s WebP format and
making the two assets byte-identical.

---

Outside diff comments:
In `@components/layout/top-utility-bar.tsx`:
- Around line 1-41: Render the existing TopUtilityBar component from the public
layout shell, preferably app/(public)/layout.tsx, so it appears across public
pages. Import TopUtilityBar and place it at the appropriate top-level position
in the layout while preserving the existing page content and root layout
behavior.

---

Minor comments:
In `@app/`(public)/products/page.tsx:
- Around line 16-41: Update the `itemListSchema` mapping so quote-only products
do not emit an `offers` block with the nonnumeric `"Request Quote"` price.
Remove `offers` for these products while preserving the existing product
metadata and valid offer data if a numeric price is available.

In `@app/globals.css`:
- Around line 165-179: Replace the broad rounded-container selectors in the icon
color override with an explicit opt-in icon-container class used by intended
components only. Remove the global .text-emerald-400 and .text-emerald-500
!important overrides, preserving each icon’s existing utility color unless its
container explicitly opts into the override.

In `@components/contact/contact-form.tsx`:
- Around line 18-19: The contact form’s error state and banner are unreachable
because handleSubmit does not perform a real submission or populate
errorMessage. Implement the actual request in handleSubmit, catch submission
failures, and call setErrorMessage with a user-facing message so the existing
error UI can render; retain clearing the message when a new submission begins.

In `@components/quote/quote-request.tsx`:
- Line 241: Remove the trailing pt-3 utility from the submit button’s className,
preserving py-3.5 as the sole vertical padding definition so the primary CTA
remains symmetrically padded.
- Around line 134-161: Update the quantity controls and remove button in the
quote item controls to provide explicit accessible names: add descriptive
aria-labels to the Minus and Plus buttons and to the button invoking removeItem.
Preserve the existing click handlers, icons, titles, and styling.

In `@components/sections/featured-products-section.tsx`:
- Around line 22-34: Update handleAddToQuote to track pending timeout handles
per product ID and clear the existing handle before scheduling a new 1500ms
reset. Store the newly scheduled handle for prod.id, and remove it when the
timeout completes so only the latest click can reset addedIds[prod.id].

In `@context/implementation-specs/01-fix-coderabbit-pr-review-findings.md`:
- Around line 140-146: Update the Step 9 `nextTs.map` documentation to include
the `constants/**/*.{ts,tsx}` and `context/**/*.{ts,tsx}` globs implemented in
`eslint.config.mjs`, or replace the explicit list with a direct reference to
that configuration.

In `@context/progress-tracker.md`:
- Line 34: Update the Enterprise Advantage & Trust Grid entry in the progress
tracker to reference the supplied public/advantages/*.webp assets instead of
*.jpg, leaving the rest of the implementation summary unchanged.

In `@context/seo.md`:
- Around line 131-155: Add an appropriate language identifier to the fenced
Markdown examples in the SEO documentation, including the shown route listing
and the additional ranges at 308-318, 330-340, and 360-368. Use text for plain
route or content listings, and use ts or another accurate identifier where the
fenced content is code, without changing the example contents.

In `@lib/seo.ts`:
- Around line 21-24: The metadata title returned by the SEO helper is duplicated
by the layout template. In lib/seo.ts lines 21-24, return the plain page title
for the metadata title while retaining fullTitle for Open Graph and Twitter
fields; update
context/implementation-specs/05-seo-compliance-and-technical-optimization.md
lines 92-123 to document this behavior.

---

Nitpick comments:
In `@app/`(public)/about/page.tsx:
- Around line 47-81: The duplicated icon-grid card markup should be extracted
into a shared FeatureCard or ValueCard component accepting icon, title, and
desc. Update app/(public)/about/page.tsx lines 47-81 and
app/(public)/services/page.tsx lines 67-120 to replace each inline map-rendered
card with the shared component, preserving the existing content and styling at
both sites.

In `@app/`(public)/page.tsx:
- Around line 133-139: Update the above-the-fold hero Image element to mark it
as high priority for loading, using the current Next.js 16 image-loading API;
also verify and configure an appropriate responsive sizes value if required for
this full-width image. Keep the existing source, dimensions, styling, and
accessibility text unchanged.

In `@components/contact/contact-form.tsx`:
- Around line 20-36: Extract the duplicated generic input change handling and
simulated submit/pending state from contact-form.tsx lines 20-36 into a shared
useSimulatedFormSubmit hook, then update contact-form.tsx to use it. Reuse that
hook in quote-request.tsx lines 21-38, removing its independent handleChange and
setTimeout-based submit implementation while preserving both forms’ existing
submission behavior.

In `@components/quote/quote-request.tsx`:
- Around line 105-110: Update the Clear Cart button’s onClick behavior in the
quote request component to require user confirmation before invoking clearCart.
Only call clearCart when the confirmation is accepted, preserving the existing
styling and clearing behavior otherwise.

In `@components/sections/certifications-section.tsx`:
- Around line 100-108: Update the certification rendering in the certifications
section to apply cert.badgeColor for the badge styling instead of hardcoded
emerald background, text, and border classes. Keep the existing
cert.categoryLabel content and surrounding layout unchanged.

In `@constants/advantages.ts`:
- Around line 9-29: Restrict AdvantageItem.iconName and getAdvantageIcon’s
parameter to the keys of ICON_MAP, using a derived key type so
ENTERPRISE_ADVANTAGES entries are checked at compile time. Preserve ShieldCheck
as the existing runtime fallback for invalid dynamic values if needed, but
ensure statically defined icon names cannot contain typos.

In `@constants/certifications.ts`:
- Line 1: Resolve the unused CertificationItem.badgeColor contract by either
removing the field from the certification data/model if badge styling remains
static, or using cert.badgeColor for both card and dialog badge className values
in the certifications section; if retained, assign colors based on each
certification’s status.

In `@context/implementation-specs/02-homepage-brand-marquee-section.md`:
- Around line 122-131: Update BrandItem in
context/implementation-specs/02-homepage-brand-marquee-section.md (lines
122-131) to remove the deprecated priority-based eager loading and avoid
preloading all first-copy marquee logos; use preload only for genuinely
above-the-fold images or omit preloading. Update the marquee remediation
guidance in
context/implementation-specs/03-fix-coderabbit-marquee-and-catalog-review-findings.md
(lines 100-103) to specify the same Next 16-compatible preload-or-no-preload
strategy.

In `@eslint.config.mjs`:
- Around line 18-39: Update the ESLint configuration around the nextVitals and
nextTs mappings to explicitly cover root configuration files, including
next.config.ts and eslint.config.mjs, or verify and preserve their intentional
exclusion using eslint --print-config. Ensure eslint . processes these files
without unconfigured-file or no-matching-config warnings.

In `@next.config.ts`:
- Around line 4-11: Constrain the remote pattern in the images configuration to
the intended Unsplash photo paths by adding appropriate pathname and search
restrictions, or remove the images.unsplash.com entry if it is unused. Do not
leave a host-only pattern that permits all paths.
```

</details>

<details>
<summary>🪄 Autofix (Beta)</summary>

Fix all unresolved CodeRabbit comments on this PR:

- [ ] <!-- {"checkboxId": "4b0d0e0a-96d7-4f10-b296-3a18ea78f0b9"} --> Push a commit to this branch (recommended)
- [ ] <!-- {"checkboxId": "ff5b1114-7d8c-49e6-8ac1-43f82af23a33"} --> Create a new PR with the fixes

</details>

---

<details>
<summary>ℹ️ Review info</summary>

<details>
<summary>⚙️ Run configuration</summary>

**Configuration used**: defaults

**Review profile**: CHILL

**Plan**: Pro Plus

**Run ID**: `4b09b715-fee9-4ca5-9974-0c9ac4b23c14`

</details>

<details>
<summary>📥 Commits</summary>

Reviewing files that changed from the base of the PR and between 736a357c36031e7f16f693e91a9938513d4a95b8 and d097274cc83a711db1e29f4346ee455b037ab303.

</details>

<details>
<summary>⛔ Files ignored due to path filters (6)</summary>

- `pnpm-lock.yaml` is excluded by `!**/pnpm-lock.yaml`
- `public/file.svg` is excluded by `!**/*.svg`
- `public/globe.svg` is excluded by `!**/*.svg`
- `public/next.svg` is excluded by `!**/*.svg`
- `public/vercel.svg` is excluded by `!**/*.svg`
- `public/window.svg` is excluded by `!**/*.svg`

</details>

<details>
<summary>📒 Files selected for processing (107)</summary>

- `AGENTS.md`
- `app/(public)/about/page.tsx`
- `app/(public)/contact/page.tsx`
- `app/(public)/layout.tsx`
- `app/(public)/page.tsx`
- `app/(public)/privacy/page.tsx`
- `app/(public)/products/page.tsx`
- `app/(public)/quote/page.tsx`
- `app/(public)/services/page.tsx`
- `app/(public)/terms/page.tsx`
- `app/globals.css`
- `app/layout.tsx`
- `app/page.tsx`
- `app/robots.ts`
- `app/sitemap.ts`
- `components/contact/contact-form.tsx`
- `components/layout/main-header.tsx`
- `components/layout/mobile-nav.tsx`
- `components/layout/public-footer.tsx`
- `components/layout/top-utility-bar.tsx`
- `components/products/product-catalog.tsx`
- `components/providers/quote-cart-provider.tsx`
- `components/quote/quote-request.tsx`
- `components/sections/brand-marquee.tsx`
- `components/sections/certifications-section.tsx`
- `components/sections/customer-reviews-section.tsx`
- `components/sections/enterprise-advantage-section.tsx`
- `components/sections/featured-products-section.tsx`
- `components/sections/popular-services-section.tsx`
- `components/sections/procurement-workflow-section.tsx`
- `components/seo/json-ld.tsx`
- `components/ui/animated-count.tsx`
- `components/ui/badge.tsx`
- `components/ui/breadcrumbs.tsx`
- `components/ui/button.tsx`
- `components/ui/dialog.tsx`
- `components/ui/dropdown-menu.tsx`
- `components/ui/navigation-menu.tsx`
- `components/ui/sheet.tsx`
- `constants/advantages.ts`
- `constants/brands.ts`
- `constants/certifications.ts`
- `constants/contact.ts`
- `constants/procurement-workflow.ts`
- `constants/products.ts`
- `constants/reviews.ts`
- `constants/services.ts`
- `constants/site.ts`
- `context/implementation-specs/01-fix-coderabbit-pr-review-findings.md`
- `context/implementation-specs/02-homepage-brand-marquee-section.md`
- `context/implementation-specs/03-fix-coderabbit-marquee-and-catalog-review-findings.md`
- `context/implementation-specs/04-homepage-certifications-section.md`
- `context/implementation-specs/05-seo-compliance-and-technical-optimization.md`
- `context/implementation-specs/06-homepage-featured-products-section.md`
- `context/implementation-specs/07-homepage-popular-services-section.md`
- `context/implementation-specs/08-homepage-enterprise-advantage-section.md`
- `context/implementation-specs/09-homepage-procurement-workflow-section.md`
- `context/implementation-specs/10-homepage-customer-reviews-section.md`
- `context/implementation-specs/README.md`
- `context/progress-tracker.md`
- `context/project-overview.md`
- `context/seo.md`
- `eslint.config.mjs`
- `lib/seo.ts`
- `next.config.ts`
- `package.json`
- `public/advantages/global-logistics.webp`
- `public/advantages/pre-calibrated.webp`
- `public/advantages/sla-response.webp`
- `public/advantages/traceable-oem.webp`
- `public/brands/aastha.webp`
- `public/brands/annapurna.webp`
- `public/brands/ap1.webp`
- `public/brands/army.webp`
- `public/brands/bagmati.webp`
- `public/brands/bhakti.webp`
- `public/brands/cg-new.webp`
- `public/brands/cg.webp`
- `public/brands/deuti.webp`
- `public/brands/dharma.webp`
- `public/brands/gnn.webp`
- `public/brands/kantipur.webp`
- `public/brands/mountain.webp`
- `public/brands/nntv.webp`
- `public/brands/norvic.webp`
- `public/brands/patanjali.webp`
- `public/brands/police.webp`
- `public/brands/space.webp`
- `public/brands/zee.webp`
- `public/certifications/ce-mdr.webp`
- `public/certifications/fcc-rohs.webp`
- `public/certifications/fda.webp`
- `public/certifications/iec-60601.webp`
- `public/certifications/iso-13485.webp`
- `public/certifications/iso-9001.webp`
- `public/hero.webp`
- `public/logo.webp`
- `public/products/broadcast-8k.webp`
- `public/products/medvision-x1.webp`
- `public/products/pacs-controller.webp`
- `public/products/sdi-router.webp`
- `public/products/telehealth-gateway.webp`
- `public/products/videowall-processor.webp`
- `public/services/broadcast-assembly.webp`
- `public/services/custom-computing.webp`
- `public/services/enterprise-sla.webp`
- `public/services/medical-integration.webp`

</details>

<details>
<summary>💤 Files with no reviewable changes (1)</summary>

- app/page.tsx

</details>

</details>

<!-- This is an auto-generated comment by CodeRabbit for review status -->
