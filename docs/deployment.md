# Deployment Guide

---

# Platform

Vercel

---

# Database

Supabase

---

# Storage

Supabase Storage

---

# Environment Variables

Production

Preview

Development

---

# Required Secrets

CLERK_SECRET_KEY

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

DATABASE_URL

SUPABASE_URL

SUPABASE_ANON_KEY

RESEND_API_KEY

TURNSTILE_SECRET

TELEGRAM_TOKEN

---

# Build

npm run lint

↓

npm run typecheck

↓

npm run build

↓

Deploy

---

# Post Deployment

Verify:

- Authentication
- Database
- Images
- Email
- Quote Forms