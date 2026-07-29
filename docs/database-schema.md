# Database Schema

> This document defines the complete database design of the Black Swan International platform.

---

# Database

Provider:

- Supabase PostgreSQL

ORM:

- Drizzle ORM

---

# Design Principles

- Normalize data where appropriate.
- Use UUID primary keys.
- Store timestamps in UTC.
- Use soft deletes only when required.
- Prefer foreign keys over duplicated data.
- Index frequently queried columns.

---

# Tables

## Users

Purpose:

Stores application users.

Fields:

- id
- clerkId
- email
- firstName
- lastName
- role
- status
- createdAt
- updatedAt

Relationships:

- One user can manage many quotations.

---

## Products

Purpose:

Industrial products displayed on the website.

Fields:

- id
- name
- slug
- description
- categoryId
- featuredImage
- status
- seoTitle
- seoDescription
- createdAt
- updatedAt

---

## Categories

...

---

## Quote Requests

...

---

## Quote Items

...

---

## Services

...

---

## CMS Pages

...

---

## Media

...

---

## Settings

...

---

## Audit Logs

...

---

# Relationships

Products

↓

Category

↓

Quote Items

↓

Quote Request

↓

Assigned User

---

# Enums

Product Status

- Draft
- Published
- Archived

Quote Status

- Pending
- Assigned
- In Review
- Quoted
- Won
- Lost
- Cancelled

User Roles

- Super Admin
- Managing Director
- Sales Manager
- Sales Executive
- Content Manager

---

# Index Strategy

Document every important index.

---

# Migration Rules

- Never edit existing migrations.
- Always create new migrations.
- Review generated SQL before applying.

---

# Database Rules

- Drizzle only.
- No Prisma.
- No raw SQL unless justified.
- Transactions for multi-step writes.
