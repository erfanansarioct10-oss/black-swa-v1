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

```

---

## 8. Agent Workflow Integration

When working on a feature or review fix:
1. **Load Context:** Read `AGENTS.md` and all files in `context/`.
2. **Draft Spec:** Create `context/implementation-specs/XX-[spec-name].md` using the template above.
3. **Update Progress Tracker:** Add the spec reference to `In Progress` in `context/progress-tracker.md`.
4. **Obtain Approval:** Present the spec to the user for review before making code modifications.
5. **Execute & Validate:** Implement step-by-step, running `pnpm run lint` and `pnpm run build` upon completion.
```
