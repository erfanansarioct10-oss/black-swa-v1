# Architecture

> This document defines the architectural rules of the Black Swan International platform.
>
> Every AI agent MUST follow these rules when creating, modifying, or refactoring code.
>
> If an implementation conflicts with this document, the implementation is considered incorrect.

---

# Architecture Philosophy

Black Swan follows a modern full-stack architecture built around the Next.js App Router.

Core principles:

- Server Components by default
- Server Actions for mutations
- Type-safe development
- Feature-first organization
- Thin UI components
- Centralized business logic
- Reusable shared components
- Secure-by-default architecture

The application should remain scalable, maintainable, and easy to extend.

---

# High-Level Architecture

```text
┌───────────────────────────────────────────────┐
│                 Client Browser                │
└───────────────────────────────────────────────┘
                     │
                     ▼
┌───────────────────────────────────────────────┐
│               Next.js App Router              │
│         (Server + Client Components)          │
└───────────────────────────────────────────────┘
                     │
         ┌───────────┴───────────┐
         ▼                       ▼
 Server Components         Client Components
         │                       │
         └───────────┬───────────┘
                     ▼
             Server Actions
                     │
              Zod Validation
                     │
              Business Logic
                     │
               Drizzle ORM
                     │
          Supabase PostgreSQL
```

---

# Project Layers

Every feature should follow this flow:

```text
UI

↓

Validation

↓

Server Action

↓

Business Logic

↓

Database

↓

Revalidation

↓

Updated UI
```

Business logic should never live inside UI components.

---

# Authentication Architecture

Authentication is handled entirely by Clerk.

```text
User

↓

Clerk Authentication

↓

Session Validation

↓

Role Verification

↓

Server Action

↓

Database Operation
```

Rules:

- Never implement custom authentication.
- Never use Supabase Auth.
- Never bypass Clerk middleware.
- Always verify permissions on the server.

---

# Database Architecture

Database Provider:

- Supabase PostgreSQL

ORM:

- Drizzle ORM

Rules:

- All database access must go through Drizzle.
- Never write raw SQL unless absolutely necessary.
- Prefer transactions for multi-step mutations.
- Database schema is the single source of truth.

---

# Validation Flow

Every external input must be validated.

```text
Client Input

↓

Zod Schema

↓

Server Action

↓

Business Logic

↓

Database
```

Never trust client-side validation alone.

---

# State Management

Preferred order:

1. Server Components
2. URL Search Params
3. React State
4. Context API (when appropriate)

Avoid unnecessary global state.

Do not introduce Redux unless explicitly approved.

---

# Rendering Strategy

Default:

- Server Components

Use Client Components only when required for:

- Browser APIs
- Event handlers
- Interactive UI
- Local state

Always minimize client-side JavaScript.

---

# Routing

Use the Next.js App Router.

Preferred conventions:

```text
app/

(layout)

(page)

loading.tsx

error.tsx

not-found.tsx
```

Avoid legacy Pages Router patterns.

---

# Server Actions

Server Actions are the preferred mutation layer.

Use Route Handlers only when:

- External APIs require endpoints
- Webhooks
- File uploads requiring handlers
- Third-party integrations

Do not create REST endpoints unnecessarily.

---

# File Organization

Preferred project structure:

```text
app/
components/
features/
actions/
db/
lib/
schemas/
types/
hooks/
constants/
emails/
public/
context/
.agents/
```

Every directory should have a single responsibility.

---

# Feature Organization

Each feature should encapsulate its own:

- Components
- Actions
- Validation
- Types
- Utilities

Avoid scattering related files throughout the project.

---

# Security Principles

Every implementation must consider:

- Authentication
- Authorization
- Input validation
- Output sanitization
- Rate limiting
- CSRF protection
- Secure cookies
- Audit logging

Security is not optional.

---

# External Services

Current integrations:

- Clerk
- Supabase
- Resend
- Telegram Bot API
- Cloudflare Turnstile
- Vercel AI SDK

Whenever implementing functionality involving these services, consult the corresponding AI Skill under `.agents/` before writing code.

---

# AI Skills Integration

The `.agents/` directory contains official implementation guides.

AI agents must use these skills whenever applicable.

Examples:

| Technology           | Required Skill                     |
| -------------------- | ---------------------------------- |
| Clerk Authentication | Clerk Skills                       |
| Organizations        | Clerk Organizations                |
| PostgreSQL           | Supabase PostgreSQL Best Practices |
| Database             | Supabase Skills                    |
| AI Features          | Vercel AI SDK                      |

Never replace official implementation patterns with assumptions.

---

# Performance Guidelines

Prefer:

- Server Components
- Streaming
- Suspense
- Partial Prerendering (where appropriate)
- Optimized Images
- Lazy Loading

Avoid unnecessary client-side rendering.

---

# Error Handling

All errors should be:

- Typed
- User-friendly
- Logged appropriately
- Safe for production

Never expose sensitive server information to clients.

---

# Logging

Development:

- Useful debugging information

Production:

- Structured logs
- No unnecessary console statements
- No sensitive data

---

# Forbidden Patterns

Do NOT introduce:

- Express.js
- NestJS
- Prisma
- Supabase Auth
- Redux
- Local JSON storage
- Duplicate business logic
- Raw SQL without justification
- Authentication inside Client Components

---

# Architectural Decision Priority

Whenever making implementation decisions, follow this priority:

1. AGENTS.md
2. Context documents
3. Official AI Skills (`.agents/`)
4. Existing project architecture
5. Framework documentation

If unsure, follow the existing architecture instead of introducing a new pattern.

---

# Architecture Goal

Every feature added to this project should be:

- Consistent
- Modular
- Secure
- Type-safe
- Scalable
- Maintainable
- Production-ready

Architecture consistency is more important than implementation speed.
