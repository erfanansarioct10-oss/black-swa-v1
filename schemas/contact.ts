import { z } from "zod";

export const contactInquirySchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name cannot exceed 100 characters"),
  companyName: z
    .string()
    .trim()
    .min(2, "Company or organization name is required")
    .max(150, "Company name cannot exceed 150 characters"),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Please provide a valid corporate email address"),
  phone: z.string().trim().optional(),
  serviceSlug: z.string().trim().optional(),
  message: z
    .string()
    .trim()
    .min(10, "Inquiry message must be at least 10 characters")
    .max(3000, "Inquiry message cannot exceed 3000 characters"),
  turnstileToken: z.string().optional(),
});

export type ContactInquirySchemaType = z.infer<typeof contactInquirySchema>;
