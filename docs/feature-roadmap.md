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

- [x] Drizzle ORM Schema (`quotes` and `quote_items` tables with reference IDs & lookup tokens)
- [x] Zod Input Validation Schemas (`schemas/quote.ts`)
- [x] Type-Safe Server Actions (`actions/quote.ts` for creation, retrieval, and status lookup)
- [x] Database Migration & Push Verification (`pnpm db:push`)

## Phase 3B: Interactive Quote Cart & Multi-Step RFQ Wizard UI

- [x] Enhanced Quote Cart Context & Provider (item custom technical specs/notes)
- [x] Step 1: Equipment & Cart Review (quantity controls, custom item notes)
- [x] Step 2: Contact & Enterprise Project Details (Contact, Hospital/Company, Email, Phone, Specs, Timeline, Budget)
- [x] Step 3: Anti-Bot Verification & Final Review (Cloudflare Turnstile, terms, submission)
- [x] Confirmation View (RFQ reference display, turnaround expectations, direct link)

## Phase 3C: Automated Notifications & Integration Pipeline

- [x] Resend Branded HTML Email Receipt (Customer confirmation with hardware summary & tracking link)
- [x] Telegram Bot API Real-Time Alerts (Instant management alert with RFQ details & reference link)
- [x] Email & Notification Delivery Error Handling & Logging

## Phase 3D: Public Quote Tracking Portal

- [x] Public Search Lookup Page (`/quote/track` with Reference ID & Email form)
- [x] Dynamic Status Tracking Page (`/quote/track/[referenceId]`)
- [x] Live RFQ Visual Progress Timeline (Submitted -> Under Review -> Manager Assigned -> Quoted -> Completed)
- [x] Equipment List Breakdown & Original Project Specifications
- [x] Assigned Account Manager Contact Card
- [x] Issued Quotation PDF Download Interface

---

# Phase 4

Dashboard

## Phase 4A: Admin Shell, Responsive Layout & Security Architecture

- [x] Responsive Admin Layout (`app/admin/layout.tsx`) with Collapsible Desktop Sidebar & Mobile Navigation Sheet (`constants/admin-navigation.ts`, `AdminShellProvider`, `AdminSidebar`, `AdminMobileNav`, `AdminHeader`)
- [x] Server-Side Clerk Role-Based Authorization Guard (`org:admin` / `admin` role protection)
- [x] Admin Header Navigation Bar (Breadcrumbs, Quick Actions, User Button, Notifications Indicator)
- [x] Mobile-First Responsive Shell Testing (320px+ Touch Support & Layout Isolation)


## Phase 4B: Executive Metrics & Activity Overview Dashboard

- [x] Executive KPI Summary Cards (Pending RFQs, Active Inquiries, Total Quotes, System Health)
- [x] Real-Time Executive Dashboard Overview Page (`app/admin/page.tsx`)
- [x] Recent Activity Stream (Latest RFQ submissions, inquiry dispatches, status changes)
- [x] High-Priority Pending Items Alert Box & Action Directives


## Phase 4C: Advanced Analytics, Funnel Visualizations & Data Insights

- [x] Dedicated Analytics Portal (`app/admin/analytics/page.tsx`)
- [x] Interactive Chart Visualizations (RFQ Submission Trends, Equipment Category Popularity, Budget Distribution)
- [x] Conversion Funnel & SLA Response Time Analytics (Submission -> Under Review -> Manager Assigned -> Quoted -> Completed/Closed)
- [x] Preset Horizon Date Range Controls (7 Days, 30 Days, Year-to-Date, All Time)


## Phase 4D: Command Center, Quick Search & Executive Notification Center

- [x] Global Admin Command Palette (`Ctrl+K` / `Cmd+K` Quick RFQ & Inquiry Lookup Modal)
- [x] Unread Notification Bell Drawer (Quick Preview of Pending Directives, RFQs & Inquiries)
- [x] Administrative Quick Search Server Action & Data Lookup Integration (`actions/admin.ts`)
- [x] Directives & Management Portal Views (`/admin/quotes`, `/admin/inquiries`)


---

# Phase 5

CRM & Quotation Pipeline System

## Phase 5A: Customer & Account Management Core

- [x] Database Schema Extensions (`customers` table with enterprise details, contact history, and foreign keys in Drizzle ORM)
- [x] Customer Directory Interface (`app/admin/customers/page.tsx` with search, filtering, and summary metrics)
- [x] Customer Profile & Account Details View (`app/admin/customers/[id]/page.tsx` with transaction history, associated RFQs, and contact logs)
- [x] Customer CRUD Server Actions & Zod Schemas (`actions/customer.ts`, `schemas/customer.ts`)

## Phase 5B: Lead Management & Inquiry Processing

- [x] Lead Tracking & Conversion Engine (Convert public contact inquiries & RFQ submissions into formal CRM Lead entities)
- [x] Lead Management Portal (`app/admin/leads/page.tsx` with source attribution, priority scoring, and status filters)
- [x] Lead Detail & Activity Log View (`app/admin/leads/[id]/page.tsx` with internal communication history and notes)
- [x] Lead Workflow Server Actions (`actions/lead.ts` for status progression, lead scoring, and account director assignment)


## Phase 5C: Quotation Workbench & Interactive Proposal Builder

- [ ] Comprehensive Admin RFQ Workbench (`app/admin/quotes/[id]/page.tsx` with line-item hardware specification controls)
- [ ] Interactive Hardware Pricing & Discount Estimator (Custom line-item pricing adjustments, volume discounts, shipping, warranty, and tax calculations)
- [ ] Quote Status Lifecycle Management (Pending -> Assigned -> In Review -> Quoted -> Won / Lost / Cancelled with audit trail logging)
- [ ] Internal Quotation Notes & Team Collaboration Sidebar (`actions/quote-admin.ts`)

## Phase 5D: Automated Proposal Generation & Customer Dispatch

- [ ] Dynamic Branded PDF Quotation Generator (Itemized hardware breakdown, official company header, terms & conditions, validity period)
- [ ] One-Click Customer Proposal Email Dispatch (Resend integration with direct proposal PDF download/link)
- [ ] Proposal Expiration & Revision Tracking (Quote versioning, expiration dates, and tracking customer view receipts)

## Phase 5E: Visual Lead Pipeline Kanban & Sales Funnel

- [ ] Interactive Sales Pipeline Kanban Board (`app/admin/crm/pipeline/page.tsx` with drag-and-drop stage movement: New Lead -> Contacted -> Assessment -> Proposal Sent -> Negotiation -> Closed)
- [ ] Stage SLA & Stale Lead Alert System (High-priority indicators for leads/RFQs stuck in negotiation or pending review)
- [ ] Direct Stage Transition Server Actions (`actions/pipeline.ts`)

## Phase 5F: CRM Analytics, Export & Integration Center

- [ ] Sales & Conversion Analytics Dashboard (`app/admin/crm/analytics/page.tsx` with Win/Loss ratios, average cycle time, and pipeline valuation)
- [ ] Enterprise CSV/JSON Data Export (Export customers, leads, and quotations for ERP/accounting synchronization)
- [ ] Bulk Management Operations (Bulk assignment, bulk status updates, and record archiving)

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
