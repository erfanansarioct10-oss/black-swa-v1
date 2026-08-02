"use server";

import { isRedirectError } from "next/dist/client/components/redirect-error";
import { revalidatePath } from "next/cache";
import { and, count, desc, eq, ilike, inArray, or, sql } from "drizzle-orm";

import { db } from "@/db";
import { contactInquiries, customers, quotes } from "@/db/schema";
import { requireAdminAuth } from "@/lib/admin-auth";
import {
  createCustomerSchema,
  customerFilterSchema,
  updateCustomerSchema,
  type CreateCustomerInput,
  type CustomerFilterInput,
  type CustomerStatus,
  type OrganizationType,
  type UpdateCustomerInput,
} from "@/schemas/customer";
import type { ActionResponse } from "@/types/quote";

export interface CustomerStatsData {
  totalAccounts: number;
  healthcareClients: number;
  broadcastNetworks: number;
  activeProspects: number;
}

export interface CustomerListItem {
  id: string;
  organizationName: string;
  organizationType: string;
  primaryContactName: string;
  primaryContactEmail: string;
  primaryContactPhone?: string | null;
  city?: string | null;
  country?: string | null;
  status: string;
  leadSource?: string | null;
  taxRegistrationId?: string | null;
  createdAt: string;
  updatedAt: string;
  linkedQuotesCount?: number;
}

export interface CustomerListResponseData {
  customers: CustomerListItem[];
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

export interface CustomerDetailResponseData {
  customer: typeof customers.$inferSelect;
  linkedQuotes: Array<typeof quotes.$inferSelect>;
  linkedInquiries: Array<typeof contactInquiries.$inferSelect>;
}

/**
 * Retrieves a paginated list of customers matching optional search and status filters.
 * Protected by server-side Clerk role authorization.
 */
export async function getCustomersAction(
  filterInput?: CustomerFilterInput
): Promise<ActionResponse<CustomerListResponseData>> {
  try {
    await requireAdminAuth();

    const parsedFilter = customerFilterSchema.parse(filterInput || {});
    const { query, organizationType, status, page = 1, pageSize = 10 } = parsedFilter;

    const conditions = [];

    if (query && query.trim() !== "") {
      const searchPattern = `%${query.trim()}%`;
      conditions.push(
        or(
          ilike(customers.organizationName, searchPattern),
          ilike(customers.primaryContactName, searchPattern),
          ilike(customers.primaryContactEmail, searchPattern),
          ilike(customers.taxRegistrationId, searchPattern),
          ilike(customers.city, searchPattern)
        )
      );
    }

    if (organizationType && organizationType !== "all") {
      conditions.push(eq(customers.organizationType, organizationType as OrganizationType));
    }

    if (status && status !== "all") {
      conditions.push(eq(customers.status, status as CustomerStatus));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [totalCountResult] = await db
      .select({ count: count() })
      .from(customers)
      .where(whereClause);

    const total = Number(totalCountResult?.count || 0);
    const totalPages = Math.ceil(total / pageSize) || 1;
    const offset = (page - 1) * pageSize;

    const resultRows = await db
      .select()
      .from(customers)
      .where(whereClause)
      .orderBy(desc(customers.createdAt))
      .limit(pageSize)
      .offset(offset);

    const customerIds = resultRows.map((c) => c.id);
    let quoteCountsMap: Record<string, number> = {};

    if (customerIds.length > 0) {
      const quoteCounts = await db
        .select({
          customerId: quotes.customerId,
          count: count(),
        })
        .from(quotes)
        .where(inArray(quotes.customerId, customerIds))
        .groupBy(quotes.customerId);

      quoteCounts.forEach((q) => {
        if (q.customerId) {
          quoteCountsMap[q.customerId] = Number(q.count || 0);
        }
      });
    }

    const formattedCustomers: CustomerListItem[] = resultRows.map((c) => ({
      id: c.id,
      organizationName: c.organizationName,
      organizationType: c.organizationType,
      primaryContactName: c.primaryContactName,
      primaryContactEmail: c.primaryContactEmail,
      primaryContactPhone: c.primaryContactPhone,
      city: c.city,
      country: c.country,
      status: c.status,
      leadSource: c.leadSource,
      taxRegistrationId: c.taxRegistrationId,
      createdAt: c.createdAt.toISOString(),
      updatedAt: c.updatedAt.toISOString(),
      linkedQuotesCount: quoteCountsMap[c.id] || 0,
    }));

    return {
      success: true,
      data: {
        customers: formattedCustomers,
        pagination: {
          total,
          page,
          pageSize,
          totalPages,
        },
      },
    };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    console.error("Error executing getCustomersAction:", error);
    return {
      success: false,
      error: "Failed to retrieve customer accounts.",
    };
  }
}

/**
 * Retrieves executive statistical metrics for the customer directory header.
 */
export async function getCustomerStatsAction(): Promise<ActionResponse<CustomerStatsData>> {
  try {
    await requireAdminAuth();

    const [totalRes, healthcareRes, broadcastRes, prospectRes] = await Promise.all([
      db.select({ count: count() }).from(customers),
      db
        .select({ count: count() })
        .from(customers)
        .where(inArray(customers.organizationType, ["hospital", "clinic"])),
      db
        .select({ count: count() })
        .from(customers)
        .where(inArray(customers.organizationType, ["broadcast_studio", "media_network"])),
      db
        .select({ count: count() })
        .from(customers)
        .where(eq(customers.status, "prospect")),
    ]);

    return {
      success: true,
      data: {
        totalAccounts: Number(totalRes[0]?.count || 0),
        healthcareClients: Number(healthcareRes[0]?.count || 0),
        broadcastNetworks: Number(broadcastRes[0]?.count || 0),
        activeProspects: Number(prospectRes[0]?.count || 0),
      },
    };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    console.error("Error executing getCustomerStatsAction:", error);
    return {
      success: false,
      error: "Failed to load customer stats.",
    };
  }
}

/**
 * Retrieves detailed customer account data along with linked RFQs and inquiries.
 */
export async function getCustomerByIdAction(
  id: string
): Promise<ActionResponse<CustomerDetailResponseData>> {
  try {
    await requireAdminAuth();

    if (!id) {
      return { success: false, error: "Customer ID is required." };
    }

    const [customerRow] = await db
      .select()
      .from(customers)
      .where(eq(customers.id, id))
      .limit(1);

    if (!customerRow) {
      return { success: false, error: "Customer account not found." };
    }

    const emailPattern = customerRow.primaryContactEmail.toLowerCase();
    const orgNamePattern = customerRow.organizationName.toLowerCase();

    const [linkedQuotes, linkedInquiries] = await Promise.all([
      db
        .select()
        .from(quotes)
        .where(
          or(
            eq(quotes.customerId, customerRow.id),
            sql`lower(${quotes.email}) = ${emailPattern}`,
            sql`lower(${quotes.companyName}) = ${orgNamePattern}`
          )
        )
        .orderBy(desc(quotes.createdAt)),
      db
        .select()
        .from(contactInquiries)
        .where(
          or(
            sql`lower(${contactInquiries.email}) = ${emailPattern}`,
            sql`lower(${contactInquiries.companyName}) = ${orgNamePattern}`
          )
        )
        .orderBy(desc(contactInquiries.createdAt)),
    ]);

    return {
      success: true,
      data: {
        customer: customerRow,
        linkedQuotes,
        linkedInquiries,
      },
    };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    console.error("Error executing getCustomerByIdAction:", error);
    return {
      success: false,
      error: "Failed to retrieve customer account details.",
    };
  }
}

/**
 * Creates a new customer account record.
 */
export async function createCustomerAction(
  rawInput: CreateCustomerInput
): Promise<ActionResponse<typeof customers.$inferSelect>> {
  try {
    await requireAdminAuth();

    const validated = createCustomerSchema.parse(rawInput);

    const [created] = await db
      .insert(customers)
      .values({
        organizationName: validated.organizationName.trim(),
        organizationType: validated.organizationType,
        primaryContactName: validated.primaryContactName.trim(),
        primaryContactEmail: validated.primaryContactEmail.trim().toLowerCase(),
        primaryContactPhone: validated.primaryContactPhone?.trim() || null,
        address: validated.address?.trim() || null,
        city: validated.city?.trim() || null,
        state: validated.state?.trim() || null,
        postalCode: validated.postalCode?.trim() || null,
        country: validated.country?.trim() || "Nepal",
        taxRegistrationId: validated.taxRegistrationId?.trim() || null,
        leadSource: validated.leadSource,
        status: validated.status,
        notes: validated.notes?.trim() || null,
        updatedAt: new Date(),
      })
      .returning();

    try {
      revalidatePath("/admin/customers");
      revalidatePath("/admin");
    } catch {
      // Ignore revalidation when executed outside Next.js server context (e.g. CLI scripts)
    }

    return {
      success: true,
      data: created,
    };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    console.error("Error executing createCustomerAction:", error);
    return {
      success: false,
      error: "Failed to create customer account.",
    };
  }
}

/**
 * Updates an existing customer account record.
 */
export async function updateCustomerAction(
  rawInput: UpdateCustomerInput
): Promise<ActionResponse<typeof customers.$inferSelect>> {
  try {
    await requireAdminAuth();

    const validated = updateCustomerSchema.parse(rawInput);

    const updatePayload: Partial<typeof customers.$inferInsert> = {
      updatedAt: new Date(),
    };

    if (validated.organizationName !== undefined) updatePayload.organizationName = validated.organizationName.trim();
    if (validated.organizationType !== undefined) updatePayload.organizationType = validated.organizationType;
    if (validated.primaryContactName !== undefined) updatePayload.primaryContactName = validated.primaryContactName.trim();
    if (validated.primaryContactEmail !== undefined) updatePayload.primaryContactEmail = validated.primaryContactEmail.trim().toLowerCase();
    if (validated.primaryContactPhone !== undefined) updatePayload.primaryContactPhone = validated.primaryContactPhone?.trim() || null;
    if (validated.address !== undefined) updatePayload.address = validated.address?.trim() || null;
    if (validated.city !== undefined) updatePayload.city = validated.city?.trim() || null;
    if (validated.state !== undefined) updatePayload.state = validated.state?.trim() || null;
    if (validated.postalCode !== undefined) updatePayload.postalCode = validated.postalCode?.trim() || null;
    if (validated.country !== undefined) updatePayload.country = validated.country?.trim() || "Nepal";
    if (validated.taxRegistrationId !== undefined) updatePayload.taxRegistrationId = validated.taxRegistrationId?.trim() || null;
    if (validated.leadSource !== undefined) updatePayload.leadSource = validated.leadSource;
    if (validated.status !== undefined) updatePayload.status = validated.status;
    if (validated.notes !== undefined) updatePayload.notes = validated.notes?.trim() || null;

    const [updated] = await db
      .update(customers)
      .set(updatePayload)
      .where(eq(customers.id, validated.id))
      .returning();

    if (!updated) {
      return { success: false, error: "Customer account not found." };
    }

    try {
      revalidatePath("/admin/customers");
      revalidatePath(`/admin/customers/${validated.id}`);
    } catch {
      // Ignore revalidation when executed outside Next.js server context (e.g. CLI scripts)
    }

    return {
      success: true,
      data: updated,
    };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    console.error("Error executing updateCustomerAction:", error);
    return {
      success: false,
      error: "Failed to update customer account.",
    };
  }
}

/**
 * Soft deletes (archives) or removes a customer account.
 */
export async function deleteCustomerAction(
  id: string
): Promise<ActionResponse<{ message: string }>> {
  try {
    await requireAdminAuth();

    if (!id) {
      return { success: false, error: "Customer ID is required." };
    }

    await db
      .update(customers)
      .set({
        status: "archived",
        updatedAt: new Date(),
      })
      .where(eq(customers.id, id));

    try {
      revalidatePath("/admin/customers");
      revalidatePath(`/admin/customers/${id}`);
    } catch {
      // Ignore revalidation when executed outside Next.js server context (e.g. CLI scripts)
    }


    return {
      success: true,
      data: { message: "Customer account archived successfully." },
    };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    console.error("Error executing deleteCustomerAction:", error);
    return {
      success: false,
      error: "Failed to archive customer account.",
    };
  }
}
