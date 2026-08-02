# Implementation Spec 34: Phase 5B - Lead Management & Inquiry Processing

> **Spec ID:** 34-phase-5b-lead-management-and-inquiry-processing  
> **Target Branch / PR:** `phase5`  
> **Status:** Complete  
> **Created Date:** 2026-08-02  

---

## Executive Summary

Phase 5B implements the **Lead Management & Inquiry Processing** module for the Black Swan International administrative portal under `/admin/leads`. This system provides a structured pipeline for capturing, qualifying, assigning, and converting inbound sales leads originating from website RFQ submissions (`quotes`), contact/service inquiries (`contact_inquiries`), trade shows, direct referrals, or outbound sales efforts. It bridges the gap between raw inbound communications and permanent B2B customer accounts (`customers`), featuring automated lead-to-customer conversion, priority/status tracking, estimated pipeline valuation, and assigned account manager tracking.

---

## 1. What We Are Going to Do

| #   | Target File | Action Required |
| --- | ----------- | --------------- |
| 1   | `db/schema.ts` | **[MODIFY]** Define `leads` Drizzle ORM table schema, status/priority/source enums, performance indexes, and optional foreign keys (`customerId`, `quoteId`, `inquiryId`). |
| 2   | `supabase/migrations/20260802000001_create_leads_table.sql` | **[NEW]** SQL migration script creating the `leads` table, B-Tree performance indexes, and Supabase Row-Level Security (RLS) policies. |
| 3   | `schemas/lead.ts` | **[NEW]** Zod validation schemas (`createLeadSchema`, `updateLeadSchema`, `leadFilterSchema`, `convertLeadSchema`). |
| 4   | `actions/lead.ts` | **[NEW]** Type-safe Server Actions (`getLeadsAction`, `getLeadByIdAction`, `createLeadAction`, `updateLeadAction`, `convertLeadToCustomerAction`, `getLeadStatsAction`) protected by `requireAdminAuth()`. |
| 5   | `app/admin/leads/page.tsx` | **[NEW]** Responsive Lead Portal directory page featuring summary KPI metric cards, multi-filter controls, interactive lead data table, and Create Lead modal dialog. |
| 6   | `app/admin/leads/[id]/page.tsx` | **[NEW]** Comprehensive Lead Detail & Workflow view displaying contact details, source attribution, priority indicators, linked transaction history (RFQ / Inquiry), internal activity notes, and Lead-to-Customer conversion trigger. |
| 7   | `components/admin/leads/lead-table.tsx` | **[NEW]** Interactive Client Component data table for displaying lead directory records with priority badges, status indicators, and quick workflow actions. |
| 8   | `components/admin/leads/lead-form-modal.tsx` | **[NEW]** Reusable modal dialog component for manually creating and updating lead records. |
| 9   | `components/admin/leads/convert-lead-modal.tsx` | **[NEW]** Modal dialog component for executing the automated Lead-to-Customer conversion workflow. |
| 10  | `constants/admin-navigation.ts` | **[MODIFY]** Register `/admin/leads` entry under "CRM & Operations" and update `ICON_MAP` with `Target` icon. |
| 11  | `context/implementation-specs/README.md` | **[MODIFY]** Register Spec 34 in the specification index. |
| 12  | `context/progress-tracker.md` | **[MODIFY]** Update current progress status with Phase 5B Spec 34 details. |

---

## 2. Why We Are Doing This

1. **Structured Inbound Lead Pipeline:** Raw contact inquiries and RFQ submissions currently exist in separate tables (`contact_inquiries` and `quotes`). The `leads` table consolidates lead qualification, allowing sales teams to track prospect intent, estimated deal value, and priority before formal account creation.
2. **Automated Lead-to-Customer Conversion Workflow:** Once a lead is qualified, administrative staff can convert it with one click into a full B2B customer record (`customers`), automatically linking historical quotes and contact inquiries to maintain seamless transaction history.
3. **Executive Pipeline Visibility:** Aggregating estimated lead value across statuses (`new`, `contacted`, `qualified`, `unqualified`, `converted`) gives executive leadership real-time visibility into active sales funnels and prospective revenue.
4. **Role-Based Security & Performance (`lib/admin-auth.ts` & Supabase RLS):** All Server Actions are protected server-side with `requireAdminAuth()`, and the database schema includes expression indexes and RLS policies matching project standards (`context/architecture.md`).
5. **Mobile-First Responsive UX (`context/ui-context.md`):** Responsive directory and detailed workflow screens designed for seamless operation on mobile (320px+), tablet, and desktop viewports using shadcn/ui.

---

## 3. How We Are Going to Implement It

### Step 1: Database Schema & Migration (`db/schema.ts` & `supabase/migrations/`)

1. Define the `leads` Drizzle ORM table in `db/schema.ts`:
   ```ts
   export const leads = pgTable("leads", {
     id: uuid("id").primaryKey().defaultRandom(),
     title: text("title").notNull(),
     contactName: text("contact_name").notNull(),
     email: text("email").notNull(),
     phone: text("phone"),
     companyName: text("company_name"),
     leadSource: text("lead_source", {
       enum: ["website_rfq", "direct_inquiry", "referral", "trade_show", "outreach"],
     }).notNull().default("website_rfq"),
     status: text("status", {
       enum: ["new", "contacted", "qualified", "unqualified", "converted"],
     }).notNull().default("new"),
     priority: text("priority", {
       enum: ["low", "medium", "high", "urgent"],
     }).notNull().default("medium"),
     estimatedValue: integer("estimated_value").default(0),
     assignedManagerId: text("assigned_manager_id"),
     notes: text("notes"),
     customerId: uuid("customer_id").references(() => customers.id, { onDelete: "set null" }),
     quoteId: uuid("quote_id").references(() => quotes.id, { onDelete: "set null" }),
     inquiryId: uuid("inquiry_id").references(() => contactInquiries.id, { onDelete: "set null" }),
     createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
     updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
   }, (table) => [
     index("idx_leads_email").on(sql`lower(${table.email})`),
     index("idx_leads_status").on(table.status),
     index("idx_leads_priority").on(table.priority),
     index("idx_leads_source").on(table.leadSource),
     index("idx_leads_customer_id").on(table.customerId),
   ]);
   ```

2. Create SQL migration file `supabase/migrations/20260802000001_create_leads_table.sql`:
   - Table creation with DEFAULT constraints and foreign key references.
   - B-Tree indexes (`idx_leads_email`, `idx_leads_status`, `idx_leads_priority`, `idx_leads_source`).
   - Enable Row-Level Security (RLS) and add access policy for `authenticated` users.

### Step 2: Zod Validation Schemas (`schemas/lead.ts`)

Create Zod validation schemas:
- `createLeadSchema`: Validates title, contactName, email, phone, companyName, leadSource, status, priority, estimatedValue, assignedManagerId, notes, quoteId, inquiryId.
- `updateLeadSchema`: Extends `createLeadSchema` with `id` UUID parameter and partial fields.
- `leadFilterSchema`: Validates pagination (`page`, `pageSize`), search query string, status filter, priority filter, and source filter.
- `convertLeadSchema`: Validates `leadId`, target `organizationName`, `organizationType`, tax ID, and notes for automated customer record creation.

### Step 3: Type-Safe Server Actions (`actions/lead.ts`)

Implement Server Actions enforcing `requireAdminAuth()`:
- `getLeadsAction(params)`: Search, multi-filter, pagination, and status breakdown counts.
- `getLeadByIdAction(id)`: Detailed lead entity with linked RFQ / contact inquiry context and customer account data.
- `createLeadAction(data)`: Validate input, create record in `leads`, and revalidate `/admin/leads`.
- `updateLeadAction(id, data)`: Update lead attributes (status, priority, estimated value, notes, assigned manager) and revalidate paths.
- `convertLeadToCustomerAction(data)`: Atomically create a new `customers` record, update the lead's status to `converted`, set `customerId`, and link existing quotes/inquiries matching the lead's email.
- `getLeadStatsAction()`: Aggregate KPI metrics (Total Leads, New Inbound, Qualified Prospects, Estimated Pipeline Value).

### Step 4: Lead Management Directory UI (`app/admin/leads/page.tsx`)

Build responsive directory portal:
- **KPI Summary Cards:** Total Leads, New Inbound, Qualified Prospects, Estimated Pipeline Value ($ / NPR).
- **Multi-Filter Bar:** Search input (debounced), Status dropdown, Priority selector, Source selector.
- **Lead Table Component (`components/admin/leads/lead-table.tsx`):** Priority badges (`urgent` = red, `high` = orange, `medium` = blue, `low` = gray), status pills, estimated value, quick actions (call, email, view details, convert).
- **Create Lead Modal (`components/admin/leads/lead-form-modal.tsx`):** Dialog for manual lead entry.

### Step 5: Lead Detail & Conversion View (`app/admin/leads/[id]/page.tsx`)

Build lead workflow page:
- **Header:** Lead title, priority badge, status pill, created date, and "Convert to Customer Account" action button.
- **Details Grid:** Contact metadata, organization info, lead source attribution, estimated value, assigned manager.
- **Linked Context Tabs/Cards:** Associated RFQ quote (`quotes`) or contact inquiry (`contact_inquiries`) if converted/linked.
- **Activity Log & Notes:** Team text area with instant Server Action update.
- **Conversion Modal (`components/admin/leads/convert-lead-modal.tsx`):** Workflow dialog confirming organization type, contact info, and executing `convertLeadToCustomerAction`.

---

## 4. When We Are Going to Do It

```text
Phase 1: Database Schema & SQL Migration (db/schema.ts & supabase/migrations/20260802000001_create_leads_table.sql)
    │
    ▼
Phase 2: Zod Validation & Server Actions (schemas/lead.ts & actions/lead.ts)
    │
    ▼
Phase 3: Directory Table & Form Components (lead-table.tsx, lead-form-modal.tsx, convert-lead-modal.tsx)
    │
    ▼
Phase 4: Admin Directory & Lead Detail Pages (app/admin/leads/page.tsx & app/admin/leads/[id]/page.tsx)
    │
    ▼
Phase 5: Navigation Registration, Progress Tracking & Verification (pnpm build, pnpm lint)
```

---

## 5. Required Data & Data Sources

| Data Requirement | Origin / Source | Usage |
| ---------------- | --------------- | ----- |
| Lead Records | `leads` table (Supabase PostgreSQL) | Primary CRM lead pipeline entity |
| Linked Customers | `customers` table (`leads.customer_id`) | Post-conversion client account reference |
| Linked RFQs | `quotes` table (`leads.quote_id` / matching email) | Inbound quote context |
| Linked Contact Inquiries | `contact_inquiries` table (`leads.inquiry_id` / matching email) | Inbound message context |
| Admin Session Security | `lib/admin-auth.ts` (`requireAdminAuth()`) | Server-side role guard for all lead management actions |

---

## 6. What Could Possibly Go Wrong & Mitigation Plan

| Potential Risk | Root Cause | Prevention / Mitigation Strategy |
| -------------- | ---------- | -------------------------------- |
| **Duplicate Customer Accounts on Conversion** | User attempts to convert a lead whose company/email already exists in `customers`. | Server action checks for existing customer by email (`primaryContactEmail`), updating existing customer or linking lead if match is found. |
| **Case-Sensitivity in Email / Search** | Direct SQL equality searches miss case variations. | Use LOWER() expression index (`idx_leads_email`) and Drizzle `ilike` queries for email and title/company matching. |
| **Unauthenticated Action Invocation** | Server actions called without session verification. | Call `requireAdminAuth()` as the first line of every server action in `actions/lead.ts`. |
| **Pipeline Valuation Overflow** | Large corporate quotes with high estimated numeric values. | Store `estimatedValue` as 64-bit integer or numeric with boundary validation in Zod (`z.number().min(0).max(1000000000)`). |

---

## 7. Verification & Definition of Done

1. `pnpm build` compiles cleanly with zero TypeScript or linting errors.
2. `db/schema.ts` updated and local migration `supabase/migrations/20260802000001_create_leads_table.sql` applied.
3. Server Actions (`actions/lead.ts`) verified with `requireAdminAuth()` security guard.
4. `/admin/leads` directory page renders KPI cards, multi-filter, lead table, and Create Lead modal dialog.
5. `/admin/leads/[id]` lead detail page renders contact info, priority/status controls, activity notes, linked RFQ/inquiry context, and Lead-to-Customer conversion workflow.
6. `/admin/leads` registered in `constants/admin-navigation.ts` under "CRM & Operations".
