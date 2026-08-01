# Feature Roadmap

---

# Phase 1

Foundation

- [x] Planning
- [x] Architecture
- [x] Clerk
- [x] Supabase
- [x] Context System

---

# Phase 2

Public Website

- [x] Homepage
- [x] About
- [x] Products
- [x] Services
- [x] Contact

---

# Phase 3

Quote System

## Phase 3A: Database Schema & Server Actions
- [ ] Drizzle ORM Schema (`quotes` and `quote_items` tables with reference IDs & lookup tokens)
- [ ] Zod Input Validation Schemas (`schemas/quote.ts`)
- [ ] Type-Safe Server Actions (`actions/quote.ts` for creation, retrieval, and status lookup)
- [ ] Database Migration & Push Verification (`pnpm db:push`)

## Phase 3B: Interactive Quote Cart & Multi-Step RFQ Wizard UI
- [ ] Enhanced Quote Cart Context & Provider (item custom technical specs/notes)
- [ ] Step 1: Equipment & Cart Review (quantity controls, custom item notes)
- [ ] Step 2: Contact & Enterprise Project Details (Contact, Hospital/Company, Email, Phone, Specs, Timeline, Budget)
- [ ] Step 3: Anti-Bot Verification & Final Review (Cloudflare Turnstile, terms, submission)
- [ ] Confirmation View (RFQ reference display, turnaround expectations, direct link)

## Phase 3C: Automated Notifications & Integration Pipeline
- [ ] Resend Branded HTML Email Receipt (Customer confirmation with hardware summary & tracking link)
- [ ] Telegram Bot API Real-Time Alerts (Instant management alert with RFQ details & reference link)
- [ ] Email & Notification Delivery Error Handling & Logging

## Phase 3D: Public Quote Tracking Portal
- [ ] Public Search Lookup Page (`/quote/track` with Reference ID & Email form)
- [ ] Dynamic Status Tracking Page (`/quote/track/[referenceId]`)
- [ ] Live RFQ Visual Progress Timeline (Submitted -> Under Review -> Manager Assigned -> Quoted -> Completed)
- [ ] Equipment List Breakdown & Original Project Specifications
- [ ] Assigned Account Manager Contact Card
- [ ] Issued Quotation PDF Download Interface

---

# Phase 4

Dashboard

- Dashboard
- Analytics

---

# Phase 5

CRM

- Customer Management
- Leads
- Quotes

---

# Phase 6

CMS

- Pages
- Media
- SEO

---

# Phase 7

Reports

---

# Phase 8

Optimization

Performance

SEO

Accessibility

Testing

---

# Phase 9

Deployment

Production Launch