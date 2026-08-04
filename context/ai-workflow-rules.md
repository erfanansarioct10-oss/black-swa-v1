# AI Workflow Rules

> This document defines the mandatory workflow that every AI coding agent must follow when working on the Black Swan International project.
>
> These rules exist to ensure consistent, maintainable, and production-ready implementations.
>
> Every AI agent MUST follow this workflow before, during, and after every task.

---

# Primary Rule

Never begin implementation immediately.

Every task starts with understanding the project context.

Think first.

Implement second.

---

# Mandatory Startup Sequence

Before touching any code, always read the following files in order:

1. `AGENTS.md`
2. `context/project-overview.md`
3. `context/architecture.md`
4. `context/code-standards.md`
5. `context/ui-context.md`
6. `context/ai-workflow-rules.md`
7. `context/progress-tracker.md`

Do not skip any document.

---

# Understand Before Implementing

Before writing code, determine:

- What feature is being built?
- Which part of the application does it belong to?
- Does a similar implementation already exist?
- Which AI Skill applies?
- Which architecture rules apply?
- Which UI rules apply?

Never assume.

Always investigate first.

---

# Official AI Skills Workflow

This repository contains official implementation skills inside:

```text
.agents/
```

Current skills include:

- Clerk
- Clerk Organizations
- Clerk Backend API
- Clerk Next.js
- Clerk Testing
- Supabase
- Supabase PostgreSQL Best Practices
- Vercel AI SDK
- Graphify

Whenever a feature involves one of these technologies:

STOP.

Read the corresponding AI Skill first.

Only then begin implementation.

Never generate implementations purely from memory.

---

# Feature Development Workflow

Every task should follow this order:

```text
Understand Requirement

↓

Read Context Files

↓

Identify Required AI Skill

↓

Study Existing Code

↓

Plan Implementation

↓

Implement

↓

Validate

↓

Test

↓

Update Progress Tracker
```

Never skip steps.

---

# Search & Query Graph Before Creating

Before creating anything new:

1. Query `graphify-out/graph.json` via `/graphify query` or `/graphify path` to understand existing component relationships.
2. Search for:

- Existing components
- Existing hooks
- Existing actions
- Existing utilities
- Existing schemas
- Existing types
- Existing layouts

Prefer extending existing code over creating duplicates.

---

# Architecture Compliance

Every implementation must follow:

- Project architecture
- Folder structure
- Existing patterns
- Naming conventions
- TypeScript standards
- UI standards

Never introduce a new architectural pattern without approval.

---

# Mobile-First Development

All user interfaces must be built using a **mobile-first approach**.

Implementation order:

```text
Mobile

↓

Tablet

↓

Laptop

↓

Desktop
```

Rules:

- Mobile layout first
- Responsive enhancements second
- No desktop-first development
- Verify every UI at mobile breakpoints before desktop

Every UI task must be tested for:

- 320px
- 375px
- 768px
- 1024px
- 1440px+

---

# Implementation Rules

Always:

- Use TypeScript
- Use strict typing
- Use Server Components by default
- Use Server Actions for mutations
- Validate with Zod
- Use Drizzle ORM
- Use Clerk Authentication
- Use shadcn/ui components
- Follow Tailwind CSS conventions

Never bypass project standards.

---

# Before Writing Code

Ask yourself:

- Does this already exist?
- Is there an AI Skill for this?
- Does it follow the architecture?
- Is it reusable?
- Is it mobile-first?
- Is it accessible?

If the answer is "No", rethink the implementation.

---

# During Development

Keep code:

- Small
- Modular
- Typed
- Reusable
- Consistent

Avoid:

- Copy-paste programming
- Overengineering
- Premature optimization
- Temporary hacks

---

# Security Checklist

Every feature should verify:

- Authentication
- Authorization
- Input validation
- Secure database access
- Error handling

Never trust client input.

---

# Performance Checklist

Prefer:

- Server Components
- Streaming
- Lazy loading
- Optimized images
- Efficient database queries

Avoid unnecessary client-side rendering.

---

# UI Checklist

Before completing UI work verify:

- Mobile-first
- Responsive
- Accessible
- Consistent spacing
- Consistent typography
- Uses shared components
- Uses shadcn/ui
- No horizontal overflow

---

# Database Rules

Always:

- Use Drizzle
- Inspect `db/schema.ts` for current Drizzle ORM table definitions, read and analyze all SQL migration files in `supabase/migrations/`, and verify that any proposed schema modification, query, or Server Action aligns with existing Supabase PostgreSQL RLS policies and performance indexes before modifying or executing code
- Use transactions where appropriate
- Keep queries inside server code
- Validate data before writing

Never:

- Use raw SQL unnecessarily
- Access the database from client components

---

# Authentication Rules

Always:

- Use Clerk
- Verify permissions server-side
- Protect private routes
- Follow installed Clerk Skills

Never:

- Use Supabase Auth
- Create custom authentication logic
- Trust client-side authorization

---

# Error Handling

Every implementation should include:

- Graceful error handling
- User-friendly messages
- Proper logging
- Safe fallbacks

Never expose internal server errors.

---

# Definition of Done

A task is complete only if:

- Architecture followed
- AI Skill followed
- Type-safe
- Mobile-first
- Responsive
- Accessible
- Secure
- Tested
- No duplicated code
- Knowledge graph updated (`/graphify --update`) if files were created, moved, or deleted
- Documentation updated if needed

---

# Update Progress

After completing any significant task:

Update:

```text
context/progress-tracker.md
```

Include:

- Completed work
- Current status
- Decisions made
- Remaining work
- Known issues

The progress tracker should always reflect the current state of the project.

---

# Forbidden Practices

Never:

- Skip reading context
- Ignore AI Skills
- Invent APIs
- Ignore project architecture
- Introduce duplicate components
- Ignore mobile responsiveness
- Add unnecessary dependencies
- Change folder structure without reason
- Leave TODOs without explanation
- Commit placeholder code

---

# Final Rule

Before marking a task complete, ask:

- Did I follow AGENTS.md?
- Did I read every context file?
- Did I use the correct AI Skill?
- Did I follow the project architecture?
- Is the implementation mobile-first?
- Is the implementation production-ready?

If any answer is **No**, the task is **not complete**.

---

# Project Philosophy

Consistency beats creativity.

Maintainability beats cleverness.

Official AI Skills beat assumptions.

Project standards beat personal preferences.

Every contribution should look as though it was written by the same senior engineering team.
