import { sql } from "drizzle-orm";
import { index, integer, pgTable, text, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";


// Starter table for Clerk profiles sync
export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  clerkUserId: text("clerk_user_id").notNull().unique(),
  email: text("email").notNull(),
  fullName: text("full_name"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// Customers & Accounts table
export const customers = pgTable("customers", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationName: text("organization_name").notNull(),
  organizationType: text("organization_type", {
    enum: ["hospital", "clinic", "broadcast_studio", "media_network", "enterprise"],
  })
    .notNull()
    .default("enterprise"),
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
  })
    .notNull()
    .default("lead"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  uniqueIndex("idx_customers_email").on(sql`lower(${table.primaryContactEmail})`),
  index("idx_customers_org_name").on(sql`lower(${table.organizationName})`),

  index("idx_customers_status").on(table.status),
  index("idx_customers_org_type").on(table.organizationType),
]);

// Quote Request Header table
export const quotes = pgTable("quotes", {
  id: uuid("id").primaryKey().defaultRandom(),
  referenceId: text("reference_id").notNull().unique(),
  lookupToken: text("lookup_token").notNull().unique(),
  clerkUserId: text("clerk_user_id"),
  customerId: uuid("customer_id").references(() => customers.id, { onDelete: "set null" }),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  companyName: text("company_name"),
  projectScope: text("project_scope"),
  budgetRange: text("budget_range"),
  timeline: text("timeline"),
  status: text("status", {
    enum: ["pending", "under_review", "manager_assigned", "quoted", "completed", "rejected"],
  })
    .notNull()
    .default("pending"),
  assignedManagerId: text("assigned_manager_id"),
  adminNotes: text("admin_notes"),
  assignedAt: timestamp("assigned_at", { withTimezone: true }),
  quotedAt: timestamp("quoted_at", { withTimezone: true }),
  completedAt: timestamp("completed_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("idx_quotes_clerk_user_id").on(table.clerkUserId),
  index("idx_quotes_customer_id").on(table.customerId),
  index("idx_quotes_status").on(table.status),
  index("idx_quotes_upper_reference_id").on(sql`upper(${table.referenceId})`),
  index("idx_quotes_lower_email").on(sql`lower(${table.email})`),
]);

// Quote Line Items table
export const quoteItems = pgTable("quote_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  quoteId: uuid("quote_id")
    .notNull()
    .references(() => quotes.id, { onDelete: "cascade" }),
  productId: text("product_id").notNull(),
  productTitle: text("product_title").notNull(),
  category: text("category").notNull(),
  quantity: integer("quantity").notNull().default(1),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("idx_quote_items_quote_id").on(table.quoteId),
]);

// Contact & Service Inquiries table
export const contactInquiries = pgTable("contact_inquiries", {
  id: uuid("id").primaryKey().defaultRandom(),
  fullName: text("full_name").notNull(),
  companyName: text("company_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  serviceSlug: text("service_slug"),
  message: text("message").notNull(),
  status: text("status", {
    enum: ["new", "in_progress", "resolved", "archived"],
  })
    .notNull()
    .default("new"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("idx_contact_inquiries_email").on(table.email),
  index("idx_contact_inquiries_status").on(table.status),
]);

// Leads & Inbound Pipeline table
export const leads = pgTable("leads", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  contactName: text("contact_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  companyName: text("company_name"),
  leadSource: text("lead_source", {
    enum: ["website_rfq", "direct_inquiry", "referral", "trade_show", "outreach"],
  })
    .notNull()
    .default("website_rfq"),
  status: text("status", {
    enum: ["new", "contacted", "qualified", "unqualified", "converted"],
  })
    .notNull()
    .default("new"),
  priority: text("priority", {
    enum: ["low", "medium", "high", "urgent"],
  })
    .notNull()
    .default("medium"),
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

