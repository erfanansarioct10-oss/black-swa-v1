<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

# 🚨 AI Agent Initialization Rules

> **STOP. Read this before making any changes to the project.**

This repository is designed to be developed by both humans and AI coding agents. To ensure consistency, maintainability, and architectural integrity, **every AI agent MUST follow the workflow below before writing, modifying, or deleting any code.**

---

# Mandatory Startup Workflow

Before touching any file in this repository, you **MUST** complete the following steps **in order**:

1. Read `context/project-overview.md`
2. Read `context/architecture.md`
3. Read `context/code-standards.md`
4. Read `context/ui-context.md`
5. Read `context/ai-workflow-rules.md`
6. Read `context/progress-tracker.md`
7. Read `context/seo.md`

Do **NOT** begin implementation until the complete project context has been loaded.

---

# Official AI Skills

This repository includes official AI Skills located inside:

```text
.agents/
```

These skills are part of the project's development workflow and **must be treated as the primary implementation reference**.

Current installed skills include:

- Clerk
- Clerk Next.js Patterns
- Clerk Organizations
- Clerk Backend API
- Clerk Testing
- Supabase
- Supabase PostgreSQL Best Practices
- Vercel AI SDK

Additional skills may be added over time.

---

# Skill Usage Policy

Whenever implementing functionality covered by an installed AI Skill, you **MUST** consult the corresponding skill before writing code.

Examples:

| Task               | Required Skill                     |
| ------------------ | ---------------------------------- |
| Authentication     | Clerk                              |
| User Management    | Clerk Organizations                |
| RBAC               | Clerk Organizations                |
| Sessions           | Clerk Next.js                      |
| Database           | Supabase                           |
| PostgreSQL Queries | Supabase PostgreSQL Best Practices |
| AI Features        | Vercel AI SDK                      |

Do **NOT** rely solely on model memory when an official project skill exists.

Always follow the implementation patterns defined by the installed skill.

---

# Tool & Service CLI Usage Rules

Whenever performing tasks related to specific project tools and services, agents **MUST** utilize their official CLI utilities rather than writing manual workarounds or ad-hoc scripts:

| Tool / Service      | Preferred CLI Command   | Specific Tasks & Use Cases                                                                                                                                          |
| :------------------ | :---------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Supabase**        | `pnpm exec supabase`    | Local stack management (`start`, `stop`, `status`), database migrations (`migration new`, `db pull`), schema diffing, and local SQL execution.                      |
| **Clerk**           | `clerk`                 | User & organization management, local webhook testing, session impersonation, environment verification (`clerk doctor`), and env key resolution (`clerk env pull`). |
| **Drizzle ORM**     | `pnpm exec drizzle-kit` | Generating schema migrations (`drizzle-kit generate`), direct schema pushing (`drizzle-kit push`), and launching database GUI (`drizzle-kit studio`).               |
| **shadcn/ui**       | `npx shadcn@latest`     | Adding new component primitives (`npx shadcn@latest add <component>`) and updating UI configuration.                                                                |
| **Package Manager** | `pnpm`                  | Dependency management (`pnpm add`), build/lint/dev execution (`pnpm dev`, `pnpm build`).                                                                            |

### Rules for CLI Usage:

- **CLI over Manual Creation**: Always use `npx shadcn@latest add` for new components and `supabase migration new` / `drizzle-kit generate` for schema changes instead of manually copy-pasting files.
- **Discover via `--help`**: Never guess command flags or signatures; discover commands via `--help`.
- **Local Environment Consistency**: Rely on `pnpm exec supabase start` for local development with Docker Desktop.

---

# Development Philosophy

Implementation order should always be:

Project Context

↓

Official AI Skill

↓

Architecture

↓

Implementation

Never reverse this process.

---

# Do Not Invent Patterns

Do **NOT** introduce:

- unofficial APIs
- deprecated methods
- outdated syntax
- custom authentication flows
- custom database patterns
- random third-party libraries
- architecture that conflicts with this project

If an official AI Skill exists for a technology, it takes precedence over prior knowledge.

---

# Project Source of Truth

The following documents define the project:

1. `AGENTS.md`
2. `context/project-overview.md`
3. `context/architecture.md`
4. `context/code-standards.md`
5. `context/ui-context.md`
6. `context/ai-workflow-rules.md`
7. `context/progress-tracker.md`
8. `context/seo.md`

If any implementation conflicts with these documents, **the project documentation always takes precedence**.

---

## Mobile-First Rule

This project follows a **mobile-first development philosophy**.

All UI implementations MUST begin with the mobile breakpoint and progressively enhance for larger screens using Tailwind CSS responsive utilities.

Desktop-first implementations are not permitted unless explicitly requested.

---

# Final Rule

Before every new task, ask yourself:

- Have I loaded the project context?
- Have I identified the relevant technology?
- Have I consulted the matching AI Skill in `.agents/`?
- Does my implementation follow the project architecture?
- Does my implementation follow the project's coding standards?

If the answer to any of these questions is **No**, stop and complete the required steps before continuing.

---

**Consistency is more important than speed.**

Always prefer project standards, official AI Skills, and documented architecture over assumptions or generic framework knowledge.
