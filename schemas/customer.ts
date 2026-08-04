import { z } from "zod";

export const ORGANIZATION_TYPES = [
  { value: "hospital", label: "Hospital / Healthcare Facility" },
  { value: "clinic", label: "Medical Clinic / Diagnostic Center" },
  { value: "broadcast_studio", label: "Broadcast Studio / Production" },
  { value: "media_network", label: "Media Network / Streaming Infrastructure" },
  { value: "enterprise", label: "General Enterprise / Partner" },
] as const;

export const CUSTOMER_STATUSES = [
  { value: "active", label: "Active Client", color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20" },
  { value: "lead", label: "Inbound Lead", color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20" },
  { value: "prospect", label: "Active Prospect", color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20" },
  { value: "archived", label: "Archived", color: "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20" },
] as const;

export const LEAD_SOURCES = [
  { value: "website_rfq", label: "Website RFQ Submission" },
  { value: "direct_inquiry", label: "Direct Email / Contact Inquiry" },
  { value: "referral", label: "Client / Partner Referral" },
  { value: "trade_show", label: "Trade Show / Expo" },
  { value: "outreach", label: "Direct Sales Outreach" },
] as const;

export const organizationTypeEnum = z.enum([
  "hospital",
  "clinic",
  "broadcast_studio",
  "media_network",
  "enterprise",
]);

export const customerStatusEnum = z.enum([
  "active",
  "lead",
  "prospect",
  "archived",
]);

export const leadSourceEnum = z.enum([
  "website_rfq",
  "direct_inquiry",
  "referral",
  "trade_show",
  "outreach",
]);

export const createCustomerSchema = z.object({
  organizationName: z
    .string()
    .min(2, "Organization name must be at least 2 characters")
    .max(150, "Organization name cannot exceed 150 characters"),
  organizationType: organizationTypeEnum.default("enterprise"),
  primaryContactName: z
    .string()
    .min(2, "Primary contact name must be at least 2 characters")
    .max(100, "Primary contact name cannot exceed 100 characters"),
  primaryContactEmail: z
    .string()
    .email("Invalid email address")
    .max(120, "Email address cannot exceed 120 characters"),
  primaryContactPhone: z.string().max(30, "Phone number cannot exceed 30 characters").optional().or(z.literal("")),
  address: z.string().max(250, "Address cannot exceed 250 characters").optional().or(z.literal("")),
  city: z.string().max(100, "City cannot exceed 100 characters").optional().or(z.literal("")),
  state: z.string().max(100, "State cannot exceed 100 characters").optional().or(z.literal("")),
  postalCode: z.string().max(20, "Postal code cannot exceed 20 characters").optional().or(z.literal("")),
  country: z.string().max(100).optional().default("Nepal"),
  taxRegistrationId: z.string().max(50, "Tax ID cannot exceed 50 characters").optional().or(z.literal("")),
  leadSource: leadSourceEnum.optional().default("website_rfq"),
  status: customerStatusEnum.default("lead"),
  notes: z.string().max(2000, "Notes cannot exceed 2000 characters").optional().or(z.literal("")),
});

export const updateCustomerSchema = createCustomerSchema.partial().extend({
  id: z.string().uuid("Invalid customer ID"),
});

export const customerFilterSchema = z.object({
  query: z.string().optional(),
  organizationType: z.string().optional(),
  status: z.string().optional(),
  page: z.number().int().positive().optional().default(1),
  pageSize: z.number().int().positive().optional().default(10),
});

export type CreateCustomerInput = z.infer<typeof createCustomerSchema>;
export type UpdateCustomerInput = z.infer<typeof updateCustomerSchema>;
export type CustomerFilterInput = z.infer<typeof customerFilterSchema>;
export type OrganizationType = z.infer<typeof organizationTypeEnum>;
export type CustomerStatus = z.infer<typeof customerStatusEnum>;
export type LeadSource = z.infer<typeof leadSourceEnum>;
