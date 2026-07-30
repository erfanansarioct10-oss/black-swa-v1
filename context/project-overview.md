# Project Overview

> This document defines the purpose, goals, technology stack, architectural principles, and development philosophy of the Black Swan International platform.
>
> Every AI coding agent MUST read this document before making architectural or implementation decisions.

---

# Project

**Black Swan International**

A modern B2B solutions platform built with **Next.js 16+ App Router**.

This project consists of two major systems:

1. Public Marketing Website
2. Secure Administrative Portal

The website is designed primarily for **lead generation**, **product discovery**, and **quotation management** for **Medical Technology** and **Broadcasting Computer Hardware** infrastructure.

Customers browse medical imaging systems, telehealth hardware gateways, broadcast processing workstations, media encoding servers, and studio IT hardware, build a quote cart, and submit quotation requests. Internal staff manage those requests through a secure CRM-like dashboard.

---

# Primary Business Goals

- Build a professional medical & broadcast technology B2B platform
- Improve SEO and discoverability
- Replace manual quotation workflow
- Centralize products and services
- Provide a modern admin dashboard
- Create a scalable CRM for quotation management
- Support future business growth without major rewrites

---

# Core Features

## Public Website

- Homepage
- About
- Services
- Product Catalog
- Product Details
- Contact
- Quote Cart
- Quote Request
- SEO Optimization

---

## Admin Portal

- Dashboard
- Quote Management
- CRM
- Product Management
- Category Management
- Service Management
- Media Library
- CMS
- User Management
- Reports
- Settings

---

# Technology Stack

## Framework

- Next.js 16+
- React 19
- TypeScript

---

## Styling

- Tailwind CSS
- shadcn/ui

---

## Authentication

- Clerk

Authentication, organizations, roles, permissions, and session management are handled entirely by Clerk.

Supabase Authentication MUST NOT be used.

---

## Database

Supabase PostgreSQL

---

## ORM

Drizzle ORM

---

## Validation

Zod

Every external input must be validated using Zod before entering business logic.

---

## Storage

Supabase Storage

---

## Email

Resend

---

## Notifications

Telegram Bot API

---

## Bot Protection

Cloudflare Turnstile

---

## Deployment

Vercel

---

# Development Philosophy

This project prioritizes:

- Type safety
- Security
- Scalability
- Maintainability
- Performance
- Accessibility
- SEO
- Clean architecture

Every implementation should favor long-term maintainability over short-term convenience.

---

# Architectural Principles

The project follows these principles:

- Server Components by default
- Server Actions preferred for mutations
- Route Handlers only when necessary
- Type-safe database access through Drizzle
- Runtime validation through Zod
- Authentication handled by Clerk
- PostgreSQL hosted by Supabase
- Modern React patterns only
- Feature-based organization
- Reusable UI components

---

# AI Skills

This repository contains official AI Skills inside:

.agents/

These skills are part of the project architecture.

They are NOT optional.

Whenever implementing functionality covered by one of these skills, AI agents MUST consult the corresponding skill before writing code.

Current installed skills include:

- Clerk
- Clerk Next.js
- Clerk Organizations
- Clerk Backend API
- Clerk Testing
- Supabase
- Supabase PostgreSQL Best Practices
- Vercel AI SDK

Additional skills may be added over time.

---

# AI Development Rule

AI agents must never generate implementations purely from memory when an official project skill exists.

Instead they must:

1. Identify the relevant technology.
2. Locate the corresponding skill inside `.agents/`.
3. Follow the implementation patterns provided by that skill.
4. Adapt those patterns to the project architecture.

Example:

Authentication work
→ Use Clerk skills.

Database work
→ Use Supabase + PostgreSQL best-practice skills.

AI functionality
→ Use Vercel AI SDK skill.

Never invent APIs or patterns that differ from the installed skills.

---

# Forbidden Technologies

Do NOT introduce:

- Express.js
- NestJS
- Prisma
- Supabase Auth
- Firebase
- Local JSON databases
- Redux
- jQuery

unless explicitly approved.

---

# Quote-First Business Model

This is NOT an e-commerce application.

Customers do NOT purchase products online.

Workflow:

Browse Medical & Broadcast Hardware

↓

Add to Quote Cart

↓

Submit Quote Request

↓

Admin Reviews

↓

Managing Director Assigned

↓

Quotation Sent

↓

Business Negotiation

Any implementation that introduces shopping cart checkout, payment gateways, or customer order processing is considered outside the project scope unless future requirements explicitly change.

---

# Code Quality Expectations

Every contribution should be:

- Production-ready
- Fully typed
- Secure
- Responsive
- Accessible
- Reusable
- Tested
- Documented where necessary

Temporary code, placeholder logic, hacks, duplicated implementations, or experimental patterns should never be committed.

---

# Source of Truth

The following documents define the complete project:

1. AGENTS.md
2. context/project-overview.md
3. context/architecture.md
4. context/code-standards.md
5. context/ui-context.md
6. context/ai-workflow-rules.md
7. context/progress-tracker.md

If there is any conflict, these documents take precedence over assumptions or generic framework knowledge.
