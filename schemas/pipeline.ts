import { z } from "zod";

/**
 * Valid pipeline lead stages.
 */
export const leadStageEnum = z.enum([
  "new",
  "contacted",
  "assessment",
  "proposal_sent",
  "negotiation",
  "closed_won",
  "closed_lost",
]);

export type LeadStage = z.infer<typeof leadStageEnum>;

/**
 * Schema for updating a lead's pipeline stage.
 */
export const updateLeadStageSchema = z.object({
  leadId: z.string().uuid("Invalid lead ID format"),
  newStage: leadStageEnum,
  note: z.string().max(1000, "Notes cannot exceed 1000 characters").optional(),
});

export type UpdateLeadStageInput = z.infer<typeof updateLeadStageSchema>;

/**
 * Schema for CRM date horizon filters.
 */
export const crmDateHorizonEnum = z.enum(["7d", "30d", "ytd", "all"]);
export type CrmDateHorizon = z.infer<typeof crmDateHorizonEnum>;

export const crmDateHorizonSchema = z.object({
  horizon: crmDateHorizonEnum.default("30d"),
});

/**
 * Schema for exporting CRM data.
 */
export const crmExportSchema = z.object({
  exportType: z.enum(["customers", "leads", "quotes"]),
  format: z.enum(["csv", "json"]),
  horizon: crmDateHorizonEnum.default("all"),
});

export type CrmExportInput = z.infer<typeof crmExportSchema>;

/**
 * Sanitizes string values to prevent CSV Formula Injection attacks (=, +, -, @, \t, \r).
 */
export function sanitizeCsvField(val: unknown): string {
  if (val === null || val === undefined) {
    return '""';
  }

  let str = String(val).trim();

  // Protect against CSV formula injection
  const SENSITIVE_PREFIXES = ["=", "+", "-", "@", "\t", "\r"];
  if (SENSITIVE_PREFIXES.some((prefix) => str.startsWith(prefix))) {
    str = `'${str}`;
  }

  // Escape internal double quotes and enclose in quotes
  const escapedStr = str.replace(/"/g, '""');
  return `"${escapedStr}"`;
}

