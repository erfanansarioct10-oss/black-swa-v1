import { z } from "zod";

export const createProposalVersionSchema = z.object({
  quoteId: z.string().uuid("Invalid quotation ID"),
  validityDays: z
    .number()
    .int("Validity days must be an integer")
    .min(1, "Validity period must be at least 1 day")
    .max(180, "Validity period cannot exceed 180 days")
    .default(30),
  customMessage: z
    .string()
    .trim()
    .max(2000, "Custom message cannot exceed 2000 characters")
    .optional(),
  termsAndConditions: z
    .string()
    .trim()
    .max(5000, "Terms and conditions cannot exceed 5000 characters")
    .optional(),
});

export const dispatchProposalEmailSchema = z.object({
  quoteId: z.string().uuid("Invalid quotation ID"),
  proposalVersionId: z.string().uuid("Invalid proposal version ID").optional(),
  customMessage: z
    .string()
    .trim()
    .max(2000, "Custom message cannot exceed 2000 characters")
    .optional(),
});

export const trackProposalViewSchema = z.object({
  referenceId: z.string().trim().min(1, "Reference ID is required"),
  lookupToken: z.string().trim().optional(),
});

export const submitNegotiationRequestSchema = z.object({
  referenceId: z.string().trim().min(1, "Reference ID is required"),
  customerNotes: z
    .string()
    .trim()
    .min(10, "Please provide at least 10 characters describing your request")
    .max(2000, "Message cannot exceed 2000 characters"),
});

export type CreateProposalVersionSchemaType = z.infer<typeof createProposalVersionSchema>;
export type DispatchProposalEmailSchemaType = z.infer<typeof dispatchProposalEmailSchema>;
export type TrackProposalViewSchemaType = z.infer<typeof trackProposalViewSchema>;
export type SubmitNegotiationRequestSchemaType = z.infer<typeof submitNegotiationRequestSchema>;

