import { z } from "zod";

export const updateQuoteItemFinancialSchema = z.object({
  id: z.string().uuid("Invalid quote item ID"),
  unitPrice: z.number().int("Unit price must be a whole number").min(0, "Unit price cannot be negative"),
  discountPercentage: z
    .number()
    .int("Discount percentage must be a whole number")
    .min(0, "Discount cannot be less than 0%")
    .max(100, "Discount cannot exceed 100%"),
  notes: z.string().max(2000, "Notes cannot exceed 2000 characters").optional(),
});

export const updateQuoteFinancialsSchema = z.object({
  quoteId: z.string().uuid("Invalid quote ID"),
  shippingCost: z.number().int("Shipping cost must be a whole number").min(0, "Shipping cost cannot be negative"),
  currency: z.string().trim().default("NPR"),
  items: z.array(updateQuoteItemFinancialSchema).min(1, "Quote must contain at least one line item"),
});

export const updateQuoteStatusSchema = z.object({
  quoteId: z.string().uuid("Invalid quote ID"),
  status: z.enum(["pending", "under_review", "manager_assigned", "quoted", "completed", "rejected"], {
    message: "Invalid quotation status",
  }),
  adminNotes: z.string().trim().max(5000, "Admin notes cannot exceed 5000 characters").optional(),
});

export const addQuoteActivityNoteSchema = z.object({
  quoteId: z.string().uuid("Invalid quote ID"),
  message: z.string().trim().min(1, "Note message cannot be empty").max(2000, "Note message cannot exceed 2000 characters"),
});

export const assignQuoteManagerSchema = z.object({
  quoteId: z.string().uuid("Invalid quote ID"),
  managerId: z.string().trim().min(1, "Manager ID is required"),
  managerName: z.string().trim().max(100, "Manager name cannot exceed 100 characters").optional(),
});

export const sendQuoteProposalEmailSchema = z.object({
  quoteId: z.string().uuid("Invalid quote ID"),
  customMessage: z.string().trim().max(2000, "Custom message cannot exceed 2000 characters").optional(),
});

export type UpdateQuoteItemFinancialSchemaType = z.infer<typeof updateQuoteItemFinancialSchema>;
export type UpdateQuoteFinancialsSchemaType = z.infer<typeof updateQuoteFinancialsSchema>;
export type UpdateQuoteStatusSchemaType = z.infer<typeof updateQuoteStatusSchema>;
export type AddQuoteActivityNoteSchemaType = z.infer<typeof addQuoteActivityNoteSchema>;
export type AssignQuoteManagerSchemaType = z.infer<typeof assignQuoteManagerSchema>;
export type SendQuoteProposalEmailSchemaType = z.infer<typeof sendQuoteProposalEmailSchema>;
