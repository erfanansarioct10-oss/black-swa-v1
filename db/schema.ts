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
  subtotal: integer("subtotal").default(0).notNull(),
  vatAmount: integer("vat_amount").default(0).notNull(),
  shippingCost: integer("shipping_cost").default(0).notNull(),
  discountTotal: integer("discount_total").default(0).notNull(),
  grandTotal: integer("grand_total").default(0).notNull(),
  currency: text("currency").default("NPR").notNull(),
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
  unitPrice: integer("unit_price").default(0).notNull(),
  discountPercentage: integer("discount_percentage").default(0).notNull(),
  totalPrice: integer("total_price").default(0).notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("idx_quote_items_quote_id").on(table.quoteId),
]);

// Quote Activity Logs & Audit Trail table
export const quoteActivityLogs = pgTable("quote_activity_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  quoteId: uuid("quote_id")
    .notNull()
    .references(() => quotes.id, { onDelete: "cascade" }),
  authorClerkUserId: text("author_clerk_user_id").notNull(),
  authorName: text("author_name").notNull(),
  actionType: text("action_type").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("idx_quote_activity_quote_id").on(table.quoteId),
  index("idx_quote_activity_action_type").on(table.actionType),
]);

// Proposal Versions & Revision Audit Trail table
export const proposalVersions = pgTable("proposal_versions", {
  id: uuid("id").primaryKey().defaultRandom(),
  quoteId: uuid("quote_id")
    .notNull()
    .references(() => quotes.id, { onDelete: "cascade" }),
  versionNumber: integer("version_number").notNull().default(1),
  subtotal: integer("subtotal").notNull().default(0),
  vatAmount: integer("vat_amount").notNull().default(0),
  shippingCost: integer("shipping_cost").notNull().default(0),
  discountTotal: integer("discount_total").notNull().default(0),
  grandTotal: integer("grand_total").notNull().default(0),
  currency: text("currency").notNull().default("NPR"),
  validityDays: integer("validity_days").notNull().default(30),
  expiresAt: timestamp("expires_at", { withTimezone: true }),
  customMessage: text("custom_message"),
  termsAndConditions: text("terms_and_conditions"),
  dispatchedAt: timestamp("dispatched_at", { withTimezone: true }),
  dispatchedByClerkUserId: text("dispatched_by_clerk_user_id"),
  viewedAt: timestamp("viewed_at", { withTimezone: true }),
  viewCount: integer("view_count").notNull().default(0),
  lastViewedAt: timestamp("last_viewed_at", { withTimezone: true }),
  snapshotData: text("snapshot_data"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("idx_proposal_versions_quote_id").on(table.quoteId),
  index("idx_proposal_versions_version").on(table.quoteId, table.versionNumber),
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
    enum: ["new", "contacted", "qualified", "unqualified", "converted", "assessment", "proposal_sent", "negotiation", "closed_won", "closed_lost"],
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

