import { z } from "zod";

export const leadSourceEnum = z.enum([
  "website_rfq",
  "direct_inquiry",
  "referral",
  "trade_show",
  "outreach",
]);

export const leadStatusEnum = z.enum([
  "new",
  "contacted",
  "qualified",
  "unqualified",
  "converted",
]);

export const leadPriorityEnum = z.enum([
  "low",
  "medium",
  "high",
  "urgent",
]);

export const createLeadSchema = z.object({
  title: z
    .string()
    .min(2, "Title must be at least 2 characters")
    .max(200, "Title must be at most 200 characters"),
  contactName: z
    .string()
    .min(2, "Contact name must be at least 2 characters")
    .max(100, "Contact name must be at most 100 characters"),
  email: z
    .string()
    .email("Invalid email address")
    .max(255, "Email must be at most 255 characters"),
  phone: z
    .string()
    .max(50, "Phone number must be at most 50 characters")
    .optional()
    .nullable(),
  companyName: z
    .string()
    .max(150, "Company name must be at most 150 characters")
    .optional()
    .nullable(),
  leadSource: leadSourceEnum.default("website_rfq"),
  status: leadStatusEnum.default("new"),
  priority: leadPriorityEnum.default("medium"),
  estimatedValue: z
    .coerce
    .number()
    .min(0, "Estimated value must be 0 or greater")
    .max(1000000000, "Estimated value exceeds maximum allowed")
    .optional()
    .default(0),
  assignedManagerId: z
    .string()
    .max(100, "Manager ID must be at most 100 characters")
    .optional()
    .nullable(),
  notes: z
    .string()
    .max(2000, "Notes must be at most 2000 characters")
    .optional()
    .nullable(),
  quoteId: z.string().uuid("Invalid Quote ID").optional().nullable(),
  inquiryId: z.string().uuid("Invalid Inquiry ID").optional().nullable(),
});

export const updateLeadSchema = z.object({
  id: z.string().uuid("Invalid Lead ID").optional(),
  title: z
    .string()
    .min(2, "Title must be at least 2 characters")
    .max(200, "Title must be at most 200 characters")
    .optional(),
  contactName: z
    .string()
    .min(2, "Contact name must be at least 2 characters")
    .max(100, "Contact name must be at most 100 characters")
    .optional(),
  email: z
    .string()
    .email("Invalid email address")
    .max(255, "Email must be at most 255 characters")
    .optional(),
  phone: z
    .string()
    .max(50, "Phone number must be at most 50 characters")
    .optional()
    .nullable(),
  companyName: z
    .string()
    .max(150, "Company name must be at most 150 characters")
    .optional()
    .nullable(),
  leadSource: leadSourceEnum.optional(),
  status: leadStatusEnum.optional(),
  priority: leadPriorityEnum.optional(),
  estimatedValue: z
    .coerce
    .number()
    .min(0, "Estimated value must be 0 or greater")
    .max(1000000000, "Estimated value exceeds maximum allowed")
    .optional(),
  assignedManagerId: z
    .string()
    .max(100, "Manager ID must be at most 100 characters")
    .optional()
    .nullable(),
  notes: z
    .string()
    .max(2000, "Notes must be at most 2000 characters")
    .optional()
    .nullable(),
});

export const leadFilterSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(1).max(100).default(10),
  search: z.string().optional(),
  status: z.string().optional(),
  priority: z.string().optional(),
  source: z.string().optional(),
});

export const convertLeadSchema = z.object({
  leadId: z.string().uuid("Invalid Lead ID"),
  organizationName: z
    .string()
    .min(2, "Organization name must be at least 2 characters")
    .max(150, "Organization name must be at most 150 characters"),
  organizationType: z.enum([
    "hospital",
    "clinic",
    "broadcast_studio",
    "media_network",
    "enterprise",
  ]).default("enterprise"),
  taxRegistrationId: z
    .string()
    .max(50, "Tax ID must be at most 50 characters")
    .optional()
    .nullable(),
  notes: z
    .string()
    .max(2000, "Notes must be at most 2000 characters")
    .optional()
    .nullable(),
});

export type LeadSource = z.infer<typeof leadSourceEnum>;
export type LeadStatus = z.infer<typeof leadStatusEnum>;
export type LeadPriority = z.infer<typeof leadPriorityEnum>;
export type CreateLeadInput = z.infer<typeof createLeadSchema>;
export type UpdateLeadInput = z.infer<typeof updateLeadSchema>;
export type LeadFilterInput = z.infer<typeof leadFilterSchema>;
export type ConvertLeadInput = z.infer<typeof convertLeadSchema>;
