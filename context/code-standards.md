# Code Standards

> This document defines the coding standards for the Black Swan International project.
>
> Every AI agent MUST follow these standards when writing, modifying, or reviewing code.
>
> Consistency is more important than personal preference.

---

# Core Principles

Every implementation must be:

- Type-safe
- Readable
- Reusable
- Modular
- Secure
- Maintainable
- Production-ready

Avoid shortcuts that reduce long-term maintainability.

---

# Mobile-First Development

The entire application must be designed and implemented using a **mobile-first approach**.

Mobile is the default breakpoint.

Every component, page, layout, and feature must be designed for small screens first before progressively enhancing for larger devices.

Development order:

```text
Mobile (Default)

↓

Tablet (md)

↓

Laptop (lg)

↓

Desktop (xl)

↓

Large Desktop (2xl)
```

Rules:

- Design for the smallest viewport first.
- Never design desktop layouts before mobile.
- Build responsive layouts using Tailwind's mobile-first breakpoint system.
- Every page must function correctly on devices as small as **320px** wide.
- Interactive elements must remain easily tappable on touch devices.
- Avoid horizontal scrolling.
- Ensure proper spacing and readable typography on small screens.
- Optimize navigation for mobile users before desktop users.

When implementing responsive layouts:

- Start with the base (mobile) styles.
- Add breakpoint modifiers (`sm`, `md`, `lg`, `xl`, `2xl`) only when necessary.
- Never use desktop as the default layout.

Example:

Good:

```tsx
<div className="flex flex-col gap-4 lg:flex-row">
```

Bad:

```tsx
<div className="flex-row lg:flex-col">
```

Every pull request should be visually verified on:

- Mobile
- Tablet
- Desktop

No feature is considered complete unless it works correctly on all supported breakpoints.

# TypeScript

The project uses TypeScript in **strict mode**.

Rules:

- Never use `any`
- Prefer `unknown` over `any`
- Always define explicit types when needed
- Infer types where appropriate
- Use interfaces for object contracts
- Use type aliases for unions and utility types
- Export shared types from dedicated files

Bad

```ts
const data: any = response;
```

Good

```ts
const data: ProductResponse = response;
```

---

# React Components

Prefer functional components only.

Rules:

- One component per file
- Named exports only
- Keep components focused
- Avoid deeply nested JSX
- Split reusable UI into smaller components

Prefer:

```tsx
export function ProductCard() {}
```

Avoid:

```tsx
export default function ProductCard() {}
```

---

# Server vs Client Components

Default to **Server Components**.

Only use `"use client"` when required.

Examples:

✅ Forms

✅ Browser APIs

✅ Event handlers

✅ Interactive UI

Do NOT make entire pages client components without justification.

---

# Server Actions

Server Actions are the preferred mutation layer.

Examples:

- Create Quote
- Update Product
- Delete Category
- Update Settings

Avoid unnecessary Route Handlers.

---

# Validation

Every external input must be validated using Zod.

Examples:

- Forms
- Search parameters
- API payloads
- Environment variables

Never trust client input.

---

# Database

Database access must use:

- Drizzle ORM

Rules:

- Never bypass Drizzle
- Prefer transactions
- Avoid raw SQL
- Keep queries inside the data layer
- Never access the database directly from UI components

---

# Authentication

Authentication is handled entirely by Clerk.

Rules:

- Never implement custom auth
- Never use Supabase Auth
- Always verify permissions server-side
- Never trust client-side role checks

---

# Imports

Import order:

```text
React / Next.js

↓

Third-party packages

↓

Project aliases (@/)

↓

Relative imports
```

Example:

```ts
import Link from "next/link";

import { z } from "zod";

import { Button } from "@/components/ui/button";

import "./styles.css";
```

---

# Naming Conventions

## Components

PascalCase

```text
ProductCard.tsx
QuoteTable.tsx
```

---

## Hooks

camelCase with `use`

```text
useProducts.ts

useQuote.ts
```

---

## Utilities

camelCase

```text
formatPrice.ts

calculateTotal.ts
```

---

## Types

PascalCase

```ts
Product;

QuoteRequest;

DashboardStats;
```

---

## Constants

UPPER_SNAKE_CASE

```ts
MAX_UPLOAD_SIZE;

DEFAULT_PAGE_SIZE;
```

---

## Files

Use kebab-case where appropriate.

Example:

```text
product-card.tsx

quote-table.tsx

user-profile.tsx
```

---

# Folder Organization

Organize by feature whenever possible.

Example:

```text
features/

products/

quotes/

dashboard/

cms/
```

Avoid placing unrelated logic together.

---

# Component Size

Guidelines:

- Components: ~200 lines maximum
- Hooks: Keep focused
- Actions: Single responsibility
- Utilities: One purpose

If a file becomes difficult to understand, split it.

---

# Reusability

Before creating new code:

- Search existing components
- Search existing hooks
- Search existing utilities
- Search existing schemas

Avoid duplication.

---

# Styling

Use:

- Tailwind CSS
- shadcn/ui

Do NOT:

- Write unnecessary custom CSS
- Mix multiple styling systems
- Use inline styles unless required

---

# Accessibility

Every UI component should support:

- Keyboard navigation
- Screen readers
- Semantic HTML
- Proper labels
- Focus visibility

Accessibility is required, not optional.

---

# Error Handling

Every error should be:

- Typed
- User-friendly
- Logged appropriately

Do NOT expose internal server errors to users.

---

# Logging

Development:

- Useful console output

Production:

- No unnecessary console statements
- No sensitive information
- Structured logging where appropriate

---

# Performance

Prefer:

- Server Components
- Streaming
- Suspense
- Lazy loading
- Optimized images
- Memoization only when necessary

Avoid premature optimization.

---

# Environment Variables

Rules:

- Validate with Zod
- Never hardcode secrets
- Never expose server secrets to the client
- Use `NEXT_PUBLIC_` only for values intended for the browser

---

# Comments

Write comments that explain **why**, not **what**.

Good:

```ts
// Clerk role check is required because dashboard routes are protected.
```

Bad:

```ts
// Increment i
i++;
```

---

# AI Skills Usage

Before implementing functionality related to any installed technology, consult the matching AI Skill inside `.agents/`.

Examples:

| Feature        | Required Skill                     |
| -------------- | ---------------------------------- |
| Authentication | Clerk                              |
| Organizations  | Clerk Organizations                |
| Database       | Supabase                           |
| PostgreSQL     | Supabase PostgreSQL Best Practices |
| AI Features    | Vercel AI SDK                      |

Do not invent implementation patterns when an official skill exists.

---

# Pull Request Checklist

Before considering a task complete, verify:

- [ ] Type-safe
- [ ] Uses Server Components where possible
- [ ] Uses Server Actions for mutations
- [ ] Zod validation implemented
- [ ] Clerk authorization verified
- [ ] Drizzle used for database access
- [ ] No duplicate code
- [ ] Responsive UI
- [ ] Accessible UI
- [ ] Error handling included
- [ ] Follows project architecture
- [ ] Follows installed AI Skills
- [ ] Mobile-first implementation
- [ ] Responsive on all supported breakpoints
- [ ] Touch-friendly interactions
- [ ] No horizontal overflow

---

# Forbidden Practices

Never introduce:

- `any`
- Default exports
- Supabase Auth
- Prisma
- Express.js
- Redux
- Duplicate components
- Duplicate utilities
- Business logic inside UI components
- Direct database access from React components
- Hardcoded secrets
- Deprecated framework APIs

---

# Final Rule

When multiple implementations are possible, always choose the one that:

1. Follows the project architecture.
2. Follows the official AI Skill.
3. Matches the existing codebase.
4. Is easiest to maintain.
5. Is fully type-safe.

Code should look like it was written by one engineering team—not multiple AI models.
