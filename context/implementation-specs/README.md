# Implementation Specifications Guide

> Location: `context/implementation-specs/`

This directory contains structured, detailed technical specification documents for complex features, architectural refactoring, bug fixes, and CodeRabbit/PR review resolutions across the Black Swan International platform.

Every AI coding agent **MUST** follow the guidelines and specification template documented below whenever instructed to write an implementation spec.

---

## 1. Purpose of Implementation Specs

Implementation specs serve as technical design blueprints before code execution. They ensure that:

- Every proposed change strictly adheres to project architecture (`context/architecture.md`), coding standards (`context/code-standards.md`), and UI guidelines (`context/ui-context.md`).
- Architectural risks, edge cases, and data sources are identified before mutating code.
- Developers and human reviewers can evaluate the technical approach, rationale, and scope prior to implementation.

---

## 2. File Naming Convention

All specification files inside `context/implementation-specs/` **MUST** follow a two-digit sequential prefix followed by a concise kebab-case title:

```text
context/implementation-specs/
├── README.md
├── 01-fix-coderabbit-pr-review-findings.md
└── 02-[feature-name].md
```

- **Prefix:** `01-`, `02-`, `03-`, etc. (incremented sequentially).
- **Format:** `.md` (Markdown).

---

## 3. Mandatory Specification Template

Every implementation specification file **MUST** include the following sections and answer the core questions: **What, Why, How, When, Required Data, Risks & Mitigations, and Verification**.

Copy and adapt this standard markdown template when creating new specs:

````markdown
# Implementation Spec [ID]: [Feature or Task Title]

> **Spec ID:** [01-kebab-case-title]  
> **Target Branch / PR:** [e.g., PR #1 or feature/branch-name]  
> **Status:** [Draft / Approved / In Progress / Complete]  
> **Created Date:** [YYYY-MM-DD]

---

## Executive Summary

Provide a brief, high-level summary of the task, background context, key objectives, and architectural scope.

---

## 1. What We Are Going to Do

List all files to be created, modified, or deleted in an itemized table:

| #   | Target File                     | Action Required                               |
| --- | ------------------------------- | --------------------------------------------- |
| 1   | `constants/[file].ts`           | **[NEW]** Summary of new file responsibility. |
| 2   | `app/(public)/[route]/page.tsx` | Summary of modifications.                     |
| 3   | `public/[old-asset].png`        | **[DELETE]** Reason for deletion.             |

---

## 2. Why We Are Doing This

Document the rationale, root causes, and architectural justification:

1. **Project Standards Alignment:** Reference specific sections from `context/architecture.md`, `context/code-standards.md`, or `context/project-overview.md`.
2. **Accessibility & Usability:** WCAG compliance, WAI-ARIA standards, touch targets, and focus management.
3. **Data Hygiene & Performance:** Optimization, bundle size reduction, SSR hydration safeguards.

---

## 3. How We Are Going to Implement It

Provide a step-by-step technical breakdown of the code changes:

### Step 1: Data Models & Shared Constants

- Code snippets, TypeScript interfaces, and constant definitions.

### Step 2: Component & Layout Refactoring

- Specific component logic, hooks used, state management details, and JSX structures.

### Step 3: Page & Route Integration

- Integration of state providers, route handlers, Server Actions, or Zod validation schemas.

---

## 4. When We Are Going to Do It

Define a sequential execution timeline (phase flow):

```text
Phase 1: Foundation & Shared State
    │
    ▼
Phase 2: Layouts & Components
    │
    ▼
Phase 3: Page Integration & Form Flows
    │
    ▼
Phase 4: Tooling & Documentation
    │
    ▼
Phase 5: Verification & Build Validation
```
````

---

## 5. Required Data & Data Sources

Detail all data requirements and their exact origins:

| Data Requirement | Origin / Source                                                                  | Usage                                |
| ---------------- | -------------------------------------------------------------------------------- | ------------------------------------ |
| [Data Name]      | [e.g., `constants/contact.ts`, `localStorage`, `useSearchParams()`, Supabase DB] | [Where and how the data is consumed] |

---

## 6. What Could Possibly Go Wrong & Mitigation Plan

Identify technical risks, edge cases, and mitigation strategies:

| Potential Risk                        | Root Cause                                                                    | Prevention / Mitigation Strategy                                           |
| ------------------------------------- | ----------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| **SSR Hydration Mismatch**            | Accessing client-only APIs (`localStorage`, `window`) during SSR.             | Defer client state initialization until component mounts (`mounted` flag). |
| **`useSearchParams()` Suspend Error** | Calling `useSearchParams()` without a `<Suspense>` boundary.                  | Wrap reading component inside `<Suspense fallback={...}>`.                 |
| **Accessibility Regression**          | Unmounted or non-inert drawer menus retaining focusable elements when hidden. | Use `shadcn/ui Sheet` (Radix UI Dialog) for native focus trapping.         |

---

## 7. Verification & Definition of Done

State explicit conditions required for completion:

1. `pnpm run lint` executes with zero errors and zero warnings.
2. `pnpm run build` (or `pnpm run typecheck`) compiles cleanly without TypeScript errors.
3. Manual UI verification across mobile (320px+), tablet, and desktop viewports.

---

## 8. Agent Workflow Integration

> [!IMPORTANT]
> **Mandatory User Permission Rule:** After drafting an implementation spec in `context/implementation-specs/` and updating `context/progress-tracker.md`, AI agents MUST **NOT** immediately start coding. Agents MUST present the plan to the user and obtain explicit permission before making any code changes.

When working on a feature or review fix:

1. **Load Context:** Read `AGENTS.md` and all files in `context/`.
2. **Draft Spec:** Create `context/implementation-specs/XX-[spec-name].md` using the template above.
3. **Update Progress Tracker:** Add the spec reference to `In Progress` in `context/progress-tracker.md`.
4. **Obtain Approval (Mandatory Pause):** Present the implementation spec to the user and request explicit permission to proceed. Do **NOT** immediately start coding.
5. **Execute & Validate:** Implement step-by-step only after receiving explicit user approval, running `pnpm run lint` and `pnpm run build` upon completion.

---

## 9. Specification Registry Index

| Spec ID                                                                                                                                                                 | Title                                                       | Status   | Target Area                                   |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- | -------- | --------------------------------------------- |
| [01-fix-coderabbit-pr-review-findings](01-fix-coderabbit-pr-review-findings.md)                                   | Fix CodeRabbit PR Review Findings                           | Complete | Layouts, Auth, Forms                          |
| [02-homepage-brand-marquee-section](02-homepage-brand-marquee-section.md)                                         | Homepage Dual-Row Brand Marquee Section                     | Complete | Homepage Marquee                              |
| [03-fix-coderabbit-marquee-and-catalog-review-findings](03-fix-coderabbit-marquee-and-catalog-review-findings.md) | Fix Marquee & Catalog Review Findings                       | Complete | Marquee & Catalog                             |
| [04-homepage-certifications-section](04-homepage-certifications-section.md)                                       | Homepage Certifications & Standards Grid                    | Complete | Homepage Certifications                       |
| [05-seo-compliance-and-technical-optimization](05-seo-compliance-and-technical-optimization.md)                   | SEO Architecture & Technical Optimization                   | Complete | Global SEO & Metadata                         |
| [06-homepage-featured-products-section](06-homepage-featured-products-section.md)                                 | Homepage Featured Products Spotlight                        | Complete | Homepage Catalog                              |
| [07-homepage-popular-services-section](07-homepage-popular-services-section.md)                                   | Homepage Popular Services Section                           | Complete | Homepage Services                             |
| [08-homepage-enterprise-advantage-section](08-homepage-enterprise-advantage-section.md)                           | Homepage Enterprise Advantage & Trust Grid                  | Complete | Homepage Advantages                           |
| [09-homepage-procurement-workflow-section](09-homepage-procurement-workflow-section.md)                           | Homepage 4-Step Procurement Workflow                        | Complete | Homepage Workflow                             |
| [10-homepage-customer-reviews-section](10-homepage-customer-reviews-section.md)                                   | Homepage Customer Reviews & Testimonials                    | Complete | Homepage Reviews                              |
| [11-fix-coderabbit-latest-pr-review-findings](11-fix-coderabbit-latest-pr-review-findings.md)                     | Fix Latest CodeRabbit PR Review Findings                    | Complete | Component Refactoring                         |
| [12-homepage-who-we-are-section](12-homepage-who-we-are-section.md)                                               | Homepage Who We Are Section                                 | Complete | Homepage Brand                                |
| [13-about-us-page](13-about-us-page.md)                                                                           | Full-Service About Us Page                                  | Complete | About Us Route                                |
| [14-fix-coderabbit-about-page-findings](14-fix-coderabbit-about-page-findings.md)                                 | Fix CodeRabbit About Page Review Findings                   | Complete | About Page Accessibility & Visuals            |
| [15-services-page-and-detail-blog-system](15-services-page-and-detail-blog-system.md)                             | Services Page & 15 Service Detail / Blog System             | Complete | Services Catalog & Blog Routes                |
| [16-fix-coderabbit-services-page-findings](16-fix-coderabbit-services-page-findings.md)                           | Fix CodeRabbit Review Findings for Services System          | Complete | Services System Cleanups                      |
| [17-phase-3a-quote-database-schema-and-server-actions](17-phase-3a-quote-database-schema-and-server-actions.md)                                                         | Phase 3A: Database Schema & Server Actions                  | Complete | Quote Database & Actions                      |
| [18-phase-3b-interactive-quote-cart-and-multi-step-rfq-wizard-ui](18-phase-3b-interactive-quote-cart-and-multi-step-rfq-wizard-ui.md)                                   | Phase 3B: Interactive Quote Cart & Multi-Step RFQ Wizard UI | Complete | Quote Cart & RFQ Wizard UI                    |
| [19-phase-3c-automated-notifications-and-integration-pipeline](19-phase-3c-automated-notifications-and-integration-pipeline.md)                                         | Phase 3C: Automated Notifications & Integration Pipeline    | Complete | Resend & Telegram Notifications               |
| [20-phase-3d-public-quote-tracking-portal](20-phase-3d-public-quote-tracking-portal.md)                                                                                 | Phase 3D: Public Quote Tracking Portal                      | Complete | Public Quote Tracking Portal (`/quote/track`) |
| [21-phase-3-refinements-and-bug-fixes](21-phase-3-refinements-and-bug-fixes.md)                                                                                         | Phase 3: Quote System Refinements & Bug Fixes               | Complete | Quote System Refinements & UI Fixes           |
| [22-supabase-rls-security-and-index-optimizations](22-supabase-rls-security-and-index-optimizations.md)                                                                 | Supabase RLS Security & Performance Index Optimizations     | Complete | Database RLS & Indexes                        |
| [23-contact-and-service-inquiry-automated-notifications](23-contact-and-service-inquiry-automated-notifications.md)                                                     | Contact & Service Inquiry Automated Notifications           | Complete | Contact Form & Notifications                  |
| [24-pre-commit-audit-polish-and-code-deduplication](24-pre-commit-audit-polish-and-code-deduplication.md)                                                               | Pre-Commit Audit Polish & Code Deduplication                | Complete | Server Actions, Lib Utilities, Marquee        |
| [25-security-vulnerability-overrides](25-security-vulnerability-overrides.md)                                                                                         | Transitive Security Vulnerability Overrides                 | Complete | Package Management (`package.json`)           |
| [26-phase-4a-responsive-admin-layout-and-shell](26-phase-4a-responsive-admin-layout-and-shell.md)                                                                     | Phase 4A Responsive Admin Layout & Collapsible Sidebar Shell| Complete | Admin Shell (`app/admin/layout.tsx`)          |
| [27-phase-4a-clerk-role-authorization-guard](27-phase-4a-clerk-role-authorization-guard.md)                                                           | Phase 4A Server-Side Clerk Role Guard & Security            | Complete | Security Architecture (`lib/admin-auth.ts`)  |
| [28-phase-4b-executive-metrics-and-activity-overview](28-phase-4b-executive-metrics-and-activity-overview.md)                           | Phase 4B Executive Metrics & Activity Overview Dashboard   | Complete | Executive Dashboard (`app/admin/page.tsx`) |
| [29-phase-4c-advanced-analytics-and-visualizations](29-phase-4c-advanced-analytics-and-visualizations.md)               | Phase 4C Advanced Analytics, Funnel Visualizations & Data Insights | Complete | Executive Analytics (`app/admin/analytics/page.tsx`) |
| [30-fix-coderabbit-pr-review-findings](30-fix-coderabbit-pr-review-findings.md)                                                           | Fix CodeRabbit PR Review Findings (PR #11)                 | Complete | Security, Middleware, Navigation & Accessibility |
| [31-fix-coderabbit-pr-review-findings](31-fix-coderabbit-pr-review-findings.md)                                                           | Fix CodeRabbit PR Review Findings (PR #12)                 | Complete | Security, Middleware, Database & Visualizations |
| [32-phase-4d-command-center-and-diagnostics](32-phase-4d-command-center-and-diagnostics.md)                                           | Phase 4D Command Center, Quick Search & Executive Notification Center | Complete | Command Palette, Quick Search & Notifications |
| [33-phase-5a-customer-and-account-management-core](33-phase-5a-customer-and-account-management-core.md)                 | Phase 5A: Customer & Account Management Core                | Complete | Customer Directory & Profiles (`/admin/customers`) |
| [34-phase-5b-lead-management-and-inquiry-processing](34-phase-5b-lead-management-and-inquiry-processing.md)         | Phase 5B: Lead Management & Inquiry Processing              | Complete | Lead Pipeline & Inquiry Management (`/admin/leads`) |
