# Implementation Spec 33: Phase 5A - Customer & Account Management Core

> **Spec ID:** 33-phase-5a-customer-and-account-management-core  
> **Target Branch / PR:** `phase5`  
> **Status:** Complete  
> **Created Date:** 2026-08-02  

---

## Executive Summary

Phase 5A implements the core Customer & Account Management module for the Black Swan International administrative portal under `/admin/customers`. This feature establishes a single source of truth for B2B client accounts across healthcare (hospitals, clinics) and broadcast media sectors (studios, networks, enterprise accounts). It connects organizational profiles with transaction histories (quotations requested, contact inquiries submitted), providing administrative staff with account visibility, search filtering, and management capabilities.

---

## 1. What We Are Going to Do

| #   | Target File | Action Required |
| --- | ----------- | --------------- |
| 1   | `db/schema.ts` | **[MODIFY]** Define `customers` Drizzle ORM table schema, relations, and add optional `customerId` to `quotes` table. |
| 2   | `supabase/migrations/20260802000000_create_customers_table.sql` | **[NEW]** SQL migration script creating `customers` table, B-Tree performance indexes, and Supabase RLS security policies. |
| 3   | `schemas/customer.ts` | **[NEW]** Zod validation schemas for creating, updating, searching, and filtering customer accounts. |
| 4   | `actions/customer.ts` | **[NEW]** Type-safe Server Actions (`getCustomersAction`, `getCustomerByIdAction`, `createCustomerAction`, `updateCustomerAction`, `deleteCustomerAction`, `getCustomerStatsAction`) protected by `requireAdminAuth()`. |
| 5   | `app/admin/customers/page.tsx` | **[NEW]** Responsive Customer Directory portal page featuring summary KPI cards, search/filter controls, directory data table, and Create Customer modal dialog. |
| 6   | `app/admin/customers/[id]/page.tsx` | **[NEW]** Detailed Customer Account Overview page displaying organization metadata, contact details, linked RFQ transaction history (`quotes`), contact inquiries (`contact_inquiries`), internal team notes sidebar, and Edit Customer modal. |
| 7   | `components/admin/customers/customer-table.tsx` | **[NEW]** Interactive Client Component data table for displaying customer directory records with status badges and quick contact actions. |
| 8   | `components/admin/customers/customer-form-modal.tsx` | **[NEW]** Reusable modal dialog component for creating and editing customer account details. |
| 9   | `constants/admin-navigation.ts` | **[MODIFY]** Verify `/admin/customers` entry in the `ADMIN_NAV_SECTIONS` constant. |
| 10  | `context/implementation-specs/README.md` | **[MODIFY]** Register Spec 33 in the specification index. |
| 11  | `context/progress-tracker.md` | **[MODIFY]** Update current progress status with Phase 5A Spec 33 details. |

---

## 2. Why We Are Doing This

1. **Centralized B2B Account Repository:** Medical and broadcast equipment procurements require long negotiation cycles. Managing contact information, tax registration IDs, and notes in a centralized database (`customers`) replaces fragmented communication.
2. **Transaction History Aggregation:** Linking customer profiles with RFQ quotes (`quotes`) and service inquiries (`contact_inquiries`) gives account managers instant access to past client engagements and equipment requests.
3. **Role-Based Security Alignment (`lib/admin-auth.ts` & Supabase RLS):** Enforces strict administrative authorization guards (`requireAdminAuth()`) on all mutations and queries, aligning with project security standards (`context/architecture.md`).
4. **Mobile-First & Accessible Admin UX (`context/ui-context.md`):** Builds responsive directory and detail views tailored for mobile, tablet, and desktop viewports using shadcn/ui components.

---

## 3. How We Are Going to Implement It

### Step 1: Database Schema & Migration (`db/schema.ts` & `supabase/migrations/`)

1. Define the `customers` Drizzle ORM table:
   ```ts
   export const customers = pgTable("customers", {
     id: uuid("id").primaryKey().defaultRandom(),
     organizationName: text("organization_name").notNull(),
     organizationType: text("organization_type", {
       enum: ["hospital", "clinic", "broadcast_studio", "media_network", "enterprise"],
     }).notNull().default("enterprise"),
     primaryContactName: text("primary_contact_name").notNull(),
     primaryContactEmail: text("primary_contact_email").notNull(),
     primaryContactPhone: text("primary_contact_phone"),
     address: text("address"),
     city: text("city"),
     state: text("state"),
     postalCode: text("postal_code"),
     country: text("country").default("Nepal"),
     taxRegistrationId: text("tax_registration_id"),
     leadSource: text("lead_source", {
       enum: ["website_rfq", "direct_inquiry", "referral", "trade_show", "outreach"],
     }).default("website_rfq"),
     status: text("status", {
       enum: ["active", "lead", "prospect", "archived"],
     }).notNull().default("lead"),
     notes: text("notes"),
     createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
     updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
   }, (table) => [
     index("idx_customers_email").on(sql`lower(${table.primaryContactEmail})`),
     index("idx_customers_org_name").on(sql`lower(${table.organizationName})`),
     index("idx_customers_status").on(table.status),
     index("idx_customers_org_type").on(table.organizationType),
   ]);
   ```
2. Add optional `customerId` foreign key on `quotes` table:
   ```ts
   customerId: uuid("customer_id").references(() => customers.id, { onDelete: "set null" }),
   ```
3. Generate SQL migration file `supabase/migrations/20260802000000_create_customers_table.sql` enabling Row Level Security (RLS) and adding B-Tree performance indexes.

### Step 2: Zod Validation Schemas (`schemas/customer.ts`)

Create Zod validation schemas for input sanitization:
- `createCustomerSchema`: Validates organizationName, organizationType, primaryContactName, primaryContactEmail, phone, location fields, tax ID, leadSource, status, and notes.
- `updateCustomerSchema`: Includes `id` UUID parameter along with partial update fields.
- `customerFilterSchema`: Handles page, pageSize, search string, organizationType filter, and status filter.

### Step 3: Type-Safe Server Actions (`actions/customer.ts`)

Build Server Actions enforcing `requireAdminAuth()`:
- `getCustomersAction(params)`: Returns paginated list of accounts with filtering and metric totals.
- `getCustomerByIdAction(id)`: Returns full customer profile along with related quotes and contact inquiries.
- `createCustomerAction(data)`: Validates input, inserts new record into `customers`, and revalidates path `/admin/customers`.
- `updateCustomerAction(id, data)`: Updates existing customer record and revalidates `/admin/customers` and `/admin/customers/[id]`.
- `deleteCustomerAction(id)`: Soft-deletes (sets status to `archived`) or deletes account record.
- `getCustomerStatsAction()`: Computes total counts for executive summary cards.

### Step 4: Customer Directory Portal (`app/admin/customers/page.tsx`)

Implement responsive directory UI:
- **KPI Summary Row:** Cards for Total Accounts, Healthcare Clients, Broadcast Networks, and Active Prospects.
- **Directory Controls:** Search bar with debounce, Organization Type filter, and Status filter.
- **Directory Table (`components/admin/customers/customer-table.tsx`):** Renders account rows, type badges, contact actions (email/phone links), status tags, and view details action button.
- **Create Customer Modal (`components/admin/customers/customer-form-modal.tsx`):** Sheet/Modal dialog wrapping Zod form with toast notifications on submit.

### Step 5: Customer Profile Overview (`app/admin/customers/[id]/page.tsx`)

Implement account view:
- **Header:** Organization title, type badge, status badge, created date, and Edit/Delete buttons.
- **Details Card:** Primary contact info, tax ID, complete address details, lead source, and timestamp metadata.
- **RFQ History Table:** Displays quotes associated with the customer's email or organization name, showing status badge, reference ID link (`/admin/quotes`), items count, and created timestamp.
- **Inquiries History Table:** Displays linked contact inquiries (`contact_inquiries`).
- **Internal Notes Sidebar:** Text area allowing admin staff to add/update internal notes with instant server action execution.

---

## 4. When We Are Going to Do It

```text
Phase 1: Database Schema & SQL Migration (db/schema.ts, SQL migration)
    │
    ▼
Phase 2: Zod Schemas & Server Actions (schemas/customer.ts, actions/customer.ts)
    │
    ▼
Phase 3: Directory Table & Form Components (customer-table.tsx, customer-form-modal.tsx)
    │
    ▼
Phase 4: Admin Directory & Profile Pages (app/admin/customers/page.tsx & [id]/page.tsx)
    │
    ▼
Phase 5: Navigation, Progress Tracker & Verification (pnpm build, pnpm lint)
```

---

## 5. Required Data & Data Sources

| Data Requirement | Origin / Source | Usage |
| ---------------- | --------------- | ----- |
| Customer Profiles | `customers` table (Supabase PostgreSQL) | Main account entity records |
| Linked RFQ Quotes | `quotes` table (`quotes.email` / `quotes.company_name` / `quotes.customer_id`) | Transaction history tab in profile view |
| Linked Contact Inquiries | `contact_inquiries` table (`contact_inquiries.email` / `company_name`) | Inquiry history tab in profile view |
| Admin Session Auth | `lib/admin-auth.ts` (`requireAdminAuth()`) | Enforcing administrative authorization on Server Actions |

---

## 6. What Could Possibly Go Wrong & Mitigation Plan

| Potential Risk | Root Cause | Prevention / Mitigation Strategy |
| -------------- | ---------- | -------------------------------- |
| **Orphaned Quotes on Customer Delete** | Deleting a customer record could break references if strict foreign key exists. | Use `ON DELETE SET NULL` on optional `quotes.customer_id` foreign key constraint, and match transaction history by email/company fallback. |
| **Case-Sensitivity in Email / Org Search** | Database search queries using exact string match miss lowercase/uppercase variations. | Create expression indexes `idx_customers_email` (`lower(primary_contact_email)`) and `idx_customers_org_name` (`lower(organization_name)`), using `ilike` in Drizzle queries. |
| **Unauthenticated Data Exposure** | Server actions called without role validation. | Invoke `requireAdminAuth()` as the first statement in every Server Action in `actions/customer.ts`. |
| **SSR Hydration Mismatch on Modal State** | Client dialog open/close state rendering on server. | Keep dialog component state inside Client Components with explicit mount handling. |

---

## 7. Verification & Definition of Done

1. `pnpm build` compiles cleanly with zero TypeScript or linting errors.
2. Database schema updated with `pnpm db:push` or local migration execution.
3. Server Actions (`actions/customer.ts`) verified with `requireAdminAuth()` guard.
4. `/admin/customers` directory page renders KPI cards, directory table, search/filter, and Create Customer modal.
5. `/admin/customers/[id]` profile page renders account metadata, transaction history (quotes & inquiries), and internal notes.
6. Navigation link in `/admin` sidebar functions properly across mobile, tablet, and desktop viewports.
