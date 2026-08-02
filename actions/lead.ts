"use server";

import { isRedirectError } from "next/dist/client/components/redirect-error";
import { revalidatePath } from "next/cache";
import { and, count, desc, eq, ilike, inArray, or, sql, sum } from "drizzle-orm";

import { db } from "@/db";
import { contactInquiries, customers, leads, quotes } from "@/db/schema";
import { requireAdminAuth } from "@/lib/admin-auth";
import {
  convertLeadSchema,
  createLeadSchema,
  leadFilterSchema,
  updateLeadSchema,
  type ConvertLeadInput,
  type CreateLeadInput,
  type LeadFilterInput,
  type LeadPriority,
  type LeadSource,
  type LeadStatus,
  type UpdateLeadInput,
} from "@/schemas/lead";
import type { ActionResponse } from "@/types/quote";

export interface LeadStatsData {
  totalLeads: number;
  newInbound: number;
  qualifiedProspects: number;
  estimatedPipelineValue: number;
}

export interface LeadListItem {
  id: string;
  title: string;
  contactName: string;
  email: string;
  phone?: string | null;
  companyName?: string | null;
  leadSource: string;
  status: string;
  priority: string;
  estimatedValue: number;
  assignedManagerId?: string | null;
  notes?: string | null;
  customerId?: string | null;
  quoteId?: string | null;
  inquiryId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface LeadListResponseData {
  leads: LeadListItem[];
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
  statusCounts: {
    new: number;
    contacted: number;
    qualified: number;
    unqualified: number;
    converted: number;
  };
}

export interface LeadDetailResponseData {
  lead: typeof leads.$inferSelect;
  linkedCustomer?: typeof customers.$inferSelect | null;
  linkedQuote?: typeof quotes.$inferSelect | null;
  linkedInquiry?: typeof contactInquiries.$inferSelect | null;
}

/**
 * Retrieves aggregate KPI metrics for lead management dashboard.
 */
export async function getLeadStatsAction(): Promise<ActionResponse<LeadStatsData>> {
  try {
    await requireAdminAuth();

    const [statsResult] = await db
      .select({
        totalLeads: count(),
        newInbound: count(sql`CASE WHEN ${leads.status} = 'new' THEN 1 END`),
        qualifiedProspects: count(sql`CASE WHEN ${leads.status} = 'qualified' THEN 1 END`),
        totalPipelineValue: sum(sql`CASE WHEN ${leads.status} NOT IN ('unqualified', 'converted') THEN ${leads.estimatedValue} ELSE 0 END`),
      })
      .from(leads);

    return {
      success: true,
      data: {
        totalLeads: Number(statsResult?.totalLeads ?? 0),
        newInbound: Number(statsResult?.newInbound ?? 0),
        qualifiedProspects: Number(statsResult?.qualifiedProspects ?? 0),
        estimatedPipelineValue: Number(statsResult?.totalPipelineValue ?? 0),
      },
    };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error("[getLeadStatsAction] Error:", error);
    return {
      success: false,
      error: "Failed to load lead analytics metrics",
    };
  }
}

/**
 * Retrieves paginated leads with search, multi-filter, and status metrics.
 */
export async function getLeadsAction(
  params: LeadFilterInput
): Promise<ActionResponse<LeadListResponseData>> {
  try {
    await requireAdminAuth();

    const validated = leadFilterSchema.parse(params);
    const { page, pageSize, search, status, priority, source } = validated;

    const conditions = [];

    if (search && search.trim() !== "") {
      const query = `%${search.trim()}%`;
      conditions.push(
        or(
          ilike(leads.title, query),
          ilike(leads.contactName, query),
          ilike(leads.email, query),
          ilike(leads.companyName, query)
        )
      );
    }

    if (status && status !== "all") {
      conditions.push(eq(leads.status, status as LeadStatus));
    }

    if (priority && priority !== "all") {
      conditions.push(eq(leads.priority, priority as LeadPriority));
    }

    if (source && source !== "all") {
      conditions.push(eq(leads.leadSource, source as LeadSource));
    }


    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    const offset = (page - 1) * pageSize;

    const [totalCountResult] = await db
      .select({ count: count() })
      .from(leads)
      .where(whereClause);

    const total = Number(totalCountResult?.count ?? 0);
    const totalPages = Math.ceil(total / pageSize) || 1;

    const rows = await db
      .select()
      .from(leads)
      .where(whereClause)
      .orderBy(desc(leads.createdAt))
      .limit(pageSize)
      .offset(offset);

    // Calculate status breakdown counts
    const [countsResult] = await db
      .select({
        newCount: count(sql`CASE WHEN ${leads.status} = 'new' THEN 1 END`),
        contactedCount: count(sql`CASE WHEN ${leads.status} = 'contacted' THEN 1 END`),
        qualifiedCount: count(sql`CASE WHEN ${leads.status} = 'qualified' THEN 1 END`),
        unqualifiedCount: count(sql`CASE WHEN ${leads.status} = 'unqualified' THEN 1 END`),
        convertedCount: count(sql`CASE WHEN ${leads.status} = 'converted' THEN 1 END`),
      })
      .from(leads);

    const formattedLeads: LeadListItem[] = rows.map((lead) => ({
      id: lead.id,
      title: lead.title,
      contactName: lead.contactName,
      email: lead.email,
      phone: lead.phone,
      companyName: lead.companyName,
      leadSource: lead.leadSource,
      status: lead.status,
      priority: lead.priority,
      estimatedValue: lead.estimatedValue ?? 0,
      assignedManagerId: lead.assignedManagerId,
      notes: lead.notes,
      customerId: lead.customerId,
      quoteId: lead.quoteId,
      inquiryId: lead.inquiryId,
      createdAt: lead.createdAt.toISOString(),
      updatedAt: lead.updatedAt.toISOString(),
    }));

    return {
      success: true,
      data: {
        leads: formattedLeads,
        pagination: {
          total,
          page,
          pageSize,
          totalPages,
        },
        statusCounts: {
          new: Number(countsResult?.newCount ?? 0),
          contacted: Number(countsResult?.contactedCount ?? 0),
          qualified: Number(countsResult?.qualifiedCount ?? 0),
          unqualified: Number(countsResult?.unqualifiedCount ?? 0),
          converted: Number(countsResult?.convertedCount ?? 0),
        },
      },
    };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error("[getLeadsAction] Error:", error);
    return {
      success: false,
      error: "Failed to retrieve lead records",
    };
  }
}

/**
 * Retrieves detailed lead entity along with linked customer, RFQ, or inquiry context.
 */
export async function getLeadByIdAction(
  id: string
): Promise<ActionResponse<LeadDetailResponseData>> {
  try {
    await requireAdminAuth();

    if (!id || typeof id !== "string") {
      return { success: false, error: "Invalid Lead ID" };
    }

    const [lead] = await db
      .select()
      .from(leads)
      .where(eq(leads.id, id))
      .limit(1);

    if (!lead) {
      return { success: false, error: "Lead record not found" };
    }

    let linkedCustomer = null;
    let linkedQuote = null;
    let linkedInquiry = null;

    if (lead.customerId) {
      const [c] = await db.select().from(customers).where(eq(customers.id, lead.customerId)).limit(1);
      linkedCustomer = c ?? null;
    }

    if (lead.quoteId) {
      const [q] = await db.select().from(quotes).where(eq(quotes.id, lead.quoteId)).limit(1);
      linkedQuote = q ?? null;
    }

    if (lead.inquiryId) {
      const [inq] = await db.select().from(contactInquiries).where(eq(contactInquiries.id, lead.inquiryId)).limit(1);
      linkedInquiry = inq ?? null;
    }

    return {
      success: true,
      data: {
        lead,
        linkedCustomer,
        linkedQuote,
        linkedInquiry,
      },
    };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error("[getLeadByIdAction] Error:", error);
    return {
      success: false,
      error: "Failed to retrieve lead details",
    };
  }
}

/**
 * Creates a new lead record manually or captures from inquiry/RFQ.
 */
export async function createLeadAction(
  input: CreateLeadInput
): Promise<ActionResponse<{ id: string }>> {
  try {
    await requireAdminAuth();

    const validated = createLeadSchema.parse(input);

    const [newLead] = await db
      .insert(leads)
      .values({
        title: validated.title,
        contactName: validated.contactName,
        email: validated.email.toLowerCase(),
        phone: validated.phone || null,
        companyName: validated.companyName || null,
        leadSource: validated.leadSource,
        status: validated.status,
        priority: validated.priority,
        estimatedValue: validated.estimatedValue ?? 0,
        assignedManagerId: validated.assignedManagerId || null,
        notes: validated.notes || null,
        quoteId: validated.quoteId || null,
        inquiryId: validated.inquiryId || null,
      })
      .returning({ id: leads.id });

    try {
      revalidatePath("/admin/leads");
      revalidatePath("/admin");
    } catch {
      // Ignore revalidation when executed outside Next.js server context (e.g. CLI scripts)
    }

    return {
      success: true,
      data: { id: newLead.id },
    };

  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error("[createLeadAction] Error:", error);
    return {
      success: false,
      error: "Failed to create lead record",
    };
  }
}

/**
 * Updates lead status, priority, estimated value, manager assignment, or internal notes.
 */
export async function updateLeadAction(
  id: string,
  input: UpdateLeadInput
): Promise<ActionResponse<{ id: string }>> {
  try {
    await requireAdminAuth();

    const validated = updateLeadSchema.parse({ ...input, id });

    const [existing] = await db
      .select()
      .from(leads)
      .where(eq(leads.id, id))
      .limit(1);

    if (!existing) {
      return { success: false, error: "Lead record not found" };
    }

    const updateData: Partial<typeof leads.$inferInsert> = {
      updatedAt: new Date(),
    };

    if (validated.title !== undefined) updateData.title = validated.title;
    if (validated.contactName !== undefined) updateData.contactName = validated.contactName;
    if (validated.email !== undefined) updateData.email = validated.email.toLowerCase();
    if (validated.phone !== undefined) updateData.phone = validated.phone || null;
    if (validated.companyName !== undefined) updateData.companyName = validated.companyName || null;
    if (validated.leadSource !== undefined) updateData.leadSource = validated.leadSource;
    if (validated.status !== undefined) updateData.status = validated.status;
    if (validated.priority !== undefined) updateData.priority = validated.priority;
    if (validated.estimatedValue !== undefined) updateData.estimatedValue = validated.estimatedValue;
    if (validated.assignedManagerId !== undefined) updateData.assignedManagerId = validated.assignedManagerId || null;
    if (validated.notes !== undefined) updateData.notes = validated.notes || null;

    await db
      .update(leads)
      .set(updateData)
      .where(eq(leads.id, id));

    try {
      revalidatePath("/admin/leads");
      revalidatePath(`/admin/leads/${id}`);
      revalidatePath("/admin");
    } catch {
      // Ignore revalidation when executed outside Next.js server context (e.g. CLI scripts)
    }

    return {
      success: true,
      data: { id },
    };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error("[updateLeadAction] Error:", error);
    return {
      success: false,
      error: "Failed to update lead record",
    };
  }
}

/**
 * Converts a qualified lead into a formal B2B customer account and links transactions.
 */
export async function convertLeadToCustomerAction(
  input: ConvertLeadInput
): Promise<ActionResponse<{ customerId: string; leadId: string }>> {
  try {
    await requireAdminAuth();

    const validated = convertLeadSchema.parse(input);

    const [lead] = await db
      .select()
      .from(leads)
      .where(eq(leads.id, validated.leadId))
      .limit(1);

    if (!lead) {
      return { success: false, error: "Lead record not found" };
    }

    const emailLower = lead.email.toLowerCase();

    // Perform atomic lead conversion & customer association within a database transaction
    const customerId = await db.transaction(async (tx) => {
      const [existingCustomer] = await tx
        .select({ id: customers.id })
        .from(customers)
        .where(eq(sql`lower(${customers.primaryContactEmail})`, emailLower))
        .limit(1);

      let resolvedId = existingCustomer?.id;

      if (!resolvedId) {
        const [newCust] = await tx
          .insert(customers)
          .values({
            organizationName: validated.organizationName,
            organizationType: validated.organizationType,
            primaryContactName: lead.contactName,
            primaryContactEmail: emailLower,
            primaryContactPhone: lead.phone || null,
            taxRegistrationId: validated.taxRegistrationId || null,
            leadSource: lead.leadSource,
            status: "active",
            notes: validated.notes || lead.notes || null,
          })
          .onConflictDoNothing()
          .returning({ id: customers.id });

        if (newCust?.id) {
          resolvedId = newCust.id;
        } else {
          // If conflict occurred in concurrent insertion, query existing customer record
          const [existing] = await tx
            .select({ id: customers.id })
            .from(customers)
            .where(eq(sql`lower(${customers.primaryContactEmail})`, emailLower))
            .limit(1);
          resolvedId = existing?.id;
        }
      }


      if (!resolvedId) {
        throw new Error("Failed to create or resolve customer record");
      }

      // Update lead record
      await tx
        .update(leads)
        .set({
          status: "converted",
          customerId: resolvedId,
          companyName: validated.organizationName,
          updatedAt: new Date(),
        })
        .where(eq(leads.id, lead.id));

      // Link any quotes matching lead email
      await tx
        .update(quotes)
        .set({ customerId: resolvedId, updatedAt: new Date() })
        .where(and(eq(sql`lower(${quotes.email})`, emailLower), sql`${quotes.customerId} IS NULL`));

      return resolvedId;
    });


    try {
      revalidatePath("/admin/leads");
      revalidatePath(`/admin/leads/${lead.id}`);
      revalidatePath("/admin/customers");
      revalidatePath(`/admin/customers/${customerId}`);
      revalidatePath("/admin");
    } catch {
      // Ignore revalidation when executed outside Next.js server context (e.g. CLI scripts)
    }

    return {
      success: true,
      data: {

        customerId,
        leadId: lead.id,
      },
    };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error("[convertLeadToCustomerAction] Error:", error);
    return {
      success: false,
      error: "Failed to convert lead to customer account",
    };
  }
}
