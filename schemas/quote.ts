import { z } from "zod";

export const quoteItemSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  productTitle: z.string().min(1, "Product title is required"),
  category: z.string().min(1, "Category is required"),
  quantity: z
    .number()
    .int("Quantity must be a whole number")
    .min(1, "Quantity must be at least 1"),
  notes: z.string().max(2000, "Notes cannot exceed 2000 characters").optional(),
});

export const createQuoteSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name cannot exceed 100 characters"),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Please provide a valid email address"),
  phone: z
    .string()
    .trim()
    .min(7, "Phone number must be at least 7 digits")
    .max(25, "Phone number cannot exceed 25 characters"),
  companyName: z.string().trim().max(150, "Company name cannot exceed 150 characters").optional(),
  projectScope: z.string().trim().max(5000, "Project scope cannot exceed 5000 characters").optional(),
  budgetRange: z.string().trim().max(100, "Budget range cannot exceed 100 characters").optional(),
  timeline: z.string().trim().max(100, "Timeline cannot exceed 100 characters").optional(),
  turnstileToken: z.string().optional(),
  items: z
    .array(quoteItemSchema)
    .min(1, "Quote request cart must contain at least one equipment item"),
});

export const quoteTrackingLookupSchema = z.object({
  referenceId: z
    .string()
    .trim()
    .min(1, "Quote Reference ID is required")
    .toUpperCase(),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Email address is required for verification"),
});

export type QuoteItemSchemaType = z.infer<typeof quoteItemSchema>;
export type CreateQuoteSchemaType = z.infer<typeof createQuoteSchema>;
export type QuoteTrackingLookupSchemaType = z.infer<typeof quoteTrackingLookupSchema>;
