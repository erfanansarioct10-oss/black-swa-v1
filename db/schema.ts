import { sql } from "drizzle-orm";
import { index, integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

// Starter table for Clerk profiles sync
export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  clerkUserId: text("clerk_user_id").notNull().unique(),
  email: text("email").notNull(),
  fullName: text("full_name"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// Quote Request Header table
export const quotes = pgTable("quotes", {
  id: uuid("id").primaryKey().defaultRandom(),
  referenceId: text("reference_id").notNull().unique(),
  lookupToken: text("lookup_token").notNull().unique(),
  clerkUserId: text("clerk_user_id"),
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


