# Security Guide

---

# Security Principles

Security is mandatory.

Every feature must consider:

- Authentication
- Authorization
- Validation
- Least privilege

---

# Authentication

Clerk only.

Never use Supabase Auth.

---

# Authorization

Server-side RBAC.

Never trust client permissions.

---

# Validation

Zod everywhere.

---

# Rate Limiting

Turnstile

↓

Middleware

↓

Server Action

---

# Database

Parameterized queries only.

Drizzle ORM.

---

# Secrets

Never commit:

.env

Never expose server secrets.

---

# Cookies

HttpOnly

Secure

SameSite=Lax

---

# File Uploads

Validate:

- MIME
- Size
- Extension

---

# Audit Logs

Log:

- Login
- User changes
- Product changes
- Quote changes

---

# AI Security Rules

Never:

- expose secrets
- bypass Clerk
- trust client input
- disable validation
