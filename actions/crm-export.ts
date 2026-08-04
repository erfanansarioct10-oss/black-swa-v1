"use me";
"use server";

import { db } from "@/db";
import { customers, leads, quotes } from "@/db/schema";
import { requireAdminAuth } from "@/lib/admin-auth";
import { CrmExportInput, crmExportSchema, sanitizeCsvField } from "@/schemas/pipeline";
import { desc, gte } from "drizzle-orm";

/**
 * Server Action generating sanitized CSV or JSON export streams for enterprise CRM data.
 */
export async function exportCrmDataAction(input: CrmExportInput): Promise<{
  success: boolean;
  payload?: string;
  fileName?: string;
  contentType?: string;
  error?: string;
}> {
  await requireAdminAuth();

  const parseResult = crmExportSchema.safeParse(input);
  if (!parseResult.success) {
    return {
      success: false,
      error: parseResult.error.issues[0]?.message || "Invalid export parameters",
    };
  }

  const { exportType, format, horizon } = parseResult.data;

  try {
    const now = new Date();
    let startDate = new Date(0);

    if (horizon === "7d") {
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else if (horizon === "30d") {
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    } else if (horizon === "ytd") {
      startDate = new Date(now.getFullYear(), 0, 1);
    }

    const timestampStr = now.toISOString().slice(0, 10);
    const fileName = `black-swan-${exportType}-${horizon}-${timestampStr}.${format}`;
    const contentType = format === "json" ? "application/json" : "text/csv";

    if (exportType === "customers") {
      const records = await db
        .select()
        .from(customers)
        .where(gte(customers.createdAt, startDate))
        .orderBy(desc(customers.createdAt));

      if (format === "json") {
        return {
          success: true,
          payload: JSON.stringify(records, null, 2),
          fileName,
          contentType,
        };
      }

      // Format CSV
      const headers = [
        "ID",
        "Organization Name",
        "Organization Type",
        "Contact Name",
        "Contact Email",
        "Contact Phone",
        "City",
        "Country",
        "Lead Source",
        "Status",
        "Created At",
      ];

      const rows = records.map((c) => [
        sanitizeCsvField(c.id),
        sanitizeCsvField(c.organizationName),
        sanitizeCsvField(c.organizationType),
        sanitizeCsvField(c.primaryContactName),
        sanitizeCsvField(c.primaryContactEmail),
        sanitizeCsvField(c.primaryContactPhone),
        sanitizeCsvField(c.city),
        sanitizeCsvField(c.country),
        sanitizeCsvField(c.leadSource),
        sanitizeCsvField(c.status),
        sanitizeCsvField(c.createdAt ? new Date(c.createdAt).toISOString() : ""),
      ]);

      const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
      return { success: true, payload: csvContent, fileName, contentType };
    }

    if (exportType === "leads") {
      const records = await db
        .select()
        .from(leads)
        .where(gte(leads.createdAt, startDate))
        .orderBy(desc(leads.createdAt));

      if (format === "json") {
        return {
          success: true,
          payload: JSON.stringify(records, null, 2),
          fileName,
          contentType,
        };
      }

      const headers = [
        "ID",
        "Title",
        "Contact Name",
        "Email",
        "Phone",
        "Company Name",
        "Lead Source",
        "Status",
        "Priority",
        "Estimated Value (NPR)",
        "Assigned Manager",
        "Created At",
        "Updated At",
      ];

      const rows = records.map((l) => [
        sanitizeCsvField(l.id),
        sanitizeCsvField(l.title),
        sanitizeCsvField(l.contactName),
        sanitizeCsvField(l.email),
        sanitizeCsvField(l.phone),
        sanitizeCsvField(l.companyName),
        sanitizeCsvField(l.leadSource),
        sanitizeCsvField(l.status),
        sanitizeCsvField(l.priority),
        sanitizeCsvField(l.estimatedValue),
        sanitizeCsvField(l.assignedManagerId),
        sanitizeCsvField(l.createdAt ? new Date(l.createdAt).toISOString() : ""),
        sanitizeCsvField(l.updatedAt ? new Date(l.updatedAt).toISOString() : ""),
      ]);

      const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
      return { success: true, payload: csvContent, fileName, contentType };
    }

    if (exportType === "quotes") {
      const records = await db
        .select()
        .from(quotes)
        .where(gte(quotes.createdAt, startDate))
        .orderBy(desc(quotes.createdAt));

      if (format === "json") {
        return {
          success: true,
          payload: JSON.stringify(records, null, 2),
          fileName,
          contentType,
        };
      }

      const headers = [
        "ID",
        "Reference ID",
        "Full Name",
        "Email",
        "Phone",
        "Company Name",
        "Status",
        "Subtotal (NPR)",
        "VAT Amount (NPR)",
        "Shipping Cost (NPR)",
        "Grand Total (NPR)",
        "Created At",
      ];

      const rows = records.map((q) => [
        sanitizeCsvField(q.id),
        sanitizeCsvField(q.referenceId),
        sanitizeCsvField(q.fullName),
        sanitizeCsvField(q.email),
        sanitizeCsvField(q.phone),
        sanitizeCsvField(q.companyName),
        sanitizeCsvField(q.status),
        sanitizeCsvField(q.subtotal),
        sanitizeCsvField(q.vatAmount),
        sanitizeCsvField(q.shippingCost),
        sanitizeCsvField(q.grandTotal),
        sanitizeCsvField(q.createdAt ? new Date(q.createdAt).toISOString() : ""),
      ]);

      const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
      return { success: true, payload: csvContent, fileName, contentType };
    }

    return { success: false, error: "Unsupported export entity target" };
  } catch (error) {
    console.error("Error exporting CRM data:", error);
    return {
      success: false,
      error: "Failed to generate enterprise data export stream",
    };
  }
}
