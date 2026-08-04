"use server";

import { db } from "@/db";
import { leads, quoteActivityLogs, quotes } from "@/db/schema";
import { requireAdminAuth } from "@/lib/admin-auth";
import {
  CrmDateHorizon,
  LeadStage,
  UpdateLeadStageInput,
  updateLeadStageSchema,
} from "@/schemas/pipeline";
import { and, desc, eq, gte } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export interface PipelineLeadItem {
  id: string;
  title: string;
  contactName: string;
  email: string;
  phone: string | null;
  companyName: string | null;
  leadSource: string;
  status: string;
  priority: string;
  estimatedValue: number;
  assignedManagerId: string | null;
  notes: string | null;
  customerId: string | null;
  quoteId: string | null;
  createdAt: Date;
  updatedAt: Date;
  isStale: boolean;
}

export interface PipelineColumn {
  id: LeadStage | "closed";
  title: string;
  leads: PipelineLeadItem[];
  totalValue: number;
  count: number;
}

export interface PipelineData {
  columns: PipelineColumn[];
  totalPipelineValue: number;
  totalLeads: number;
  staleCount: number;
}

export interface PipelineAnalyticsMetrics {
  wonLeadsCount: number;
  lostLeadsCount: number;
  totalClosed: number;
  winRate: number;
  wonRevenue: number;
  totalPipelineValuation: number;
  avgSalesCycleDays: number;
  funnel: {
    stage: string;
    count: number;
    value: number;
    conversionRate: number;
  }[];
}

/**
 * Updates a lead's pipeline stage atomically and creates an audit trail.
 */
export async function updateLeadStageAction(input: UpdateLeadStageInput) {
  const user = await requireAdminAuth();

  const parseResult = updateLeadStageSchema.safeParse(input);
  if (!parseResult.success) {
    return {
      success: false,
      error: parseResult.error.issues[0]?.message || "Invalid input parameters",
    };
  }

  const { leadId, newStage, note } = parseResult.data;

  try {
    const existingLeads = await db.select().from(leads).where(eq(leads.id, leadId)).limit(1);
    if (!existingLeads.length) {
      return { success: false, error: "Lead record not found" };
    }

    const lead = existingLeads[0];
    const previousStage = lead.status;

    // Update lead status and timestamp
    const [updatedLead] = await db
      .update(leads)
      .set({
        status: newStage,
        updatedAt: new Date(),
        ...(note ? { notes: lead.notes ? `${lead.notes}\n[Stage Shift Note]: ${note}` : note } : {}),
      })
      .where(eq(leads.id, leadId))
      .returning();

    // If lead is linked to a quote, add activity log entry
    if (lead.quoteId) {
      await db.insert(quoteActivityLogs).values({
        quoteId: lead.quoteId,
        authorClerkUserId: user.userId,
        authorName: user.userId || "Admin User",
        actionType: "pipeline_stage_shift",
        message: `Lead "${lead.title}" stage shifted from "${previousStage}" to "${newStage}"${note ? ` Note: ${note}` : ""}`,
      });
    }

    revalidatePath("/admin/crm/pipeline");
    revalidatePath("/admin/crm/analytics");
    revalidatePath("/admin/leads");
    revalidatePath(`/admin/leads/${leadId}`);

    return {
      success: true,
      lead: updatedLead,
    };
  } catch (error) {
    console.error("Error updating lead stage:", error);
    return {
      success: false,
      error: "Failed to update lead stage due to a server error",
    };
  }
}

/**
 * Helper to auto-sync RFQ quotations into the leads table for the Sales Pipeline Kanban board.
 */
async function syncQuotesToLeads() {
  try {
    const allQuotes = await db.select().from(quotes);
    const existingLeads = await db.select().from(leads);
    const existingQuoteIdsInLeads = new Set(existingLeads.map((l) => l.quoteId).filter(Boolean));

    const statusMap: Record<string, string> = {
      pending: "new",
      under_review: "assessment",
      manager_assigned: "contacted",
      quoted: "proposal_sent",
      completed: "closed_won",
      rejected: "closed_lost",
    };

    for (const q of allQuotes) {
      const mappedStatus = statusMap[q.status] || "new";
      const mappedValue = q.grandTotal || q.subtotal || 0;

      if (!existingQuoteIdsInLeads.has(q.id)) {
        await db.insert(leads).values({
          title: `${q.referenceId} — ${q.companyName || q.fullName}`,
          contactName: q.fullName,
          email: q.email,
          phone: q.phone || null,
          companyName: q.companyName || null,
          leadSource: "website_rfq",
          status: mappedStatus as any,
          priority: "high",
          estimatedValue: mappedValue,
          assignedManagerId: q.assignedManagerId || null,
          quoteId: q.id,
          createdAt: q.createdAt,
          updatedAt: q.updatedAt,
        });
      } else {
        const existingLead = existingLeads.find((l) => l.quoteId === q.id);
        if (existingLead) {
          if (existingLead.estimatedValue !== mappedValue || (q.status === "quoted" && existingLead.status !== "proposal_sent" && existingLead.status !== "negotiation")) {
            await db
              .update(leads)
              .set({
                status: mappedStatus as any,
                estimatedValue: mappedValue,
                assignedManagerId: q.assignedManagerId || existingLead.assignedManagerId,
                updatedAt: new Date(),
              })
              .where(eq(leads.id, existingLead.id));
          }
        }
      }
    }
  } catch (err) {
    console.error("[SYNC_QUOTES_TO_LEADS_ERROR]", err);
  }
}

/**
 * Fetches all active leads grouped into pipeline Kanban columns with SLA calculations.
 */
export async function getPipelineDataAction(): Promise<{
  success: boolean;
  data?: PipelineData;
  error?: string;
}> {
  await requireAdminAuth();

  try {
    // Sync RFQ quotes into leads before rendering pipeline
    await syncQuotesToLeads();

    const allLeads = await db.select().from(leads).orderBy(desc(leads.updatedAt));
    const now = new Date().getTime();

    const STALE_THRESHOLD_MS = 48 * 60 * 60 * 1000; // 48 hours

    // Standardize lead items with SLA check
    const processedLeads: PipelineLeadItem[] = allLeads.map((item) => {
      const updatedAtTime = new Date(item.updatedAt).getTime();
      const ageMs = now - updatedAtTime;
      const isTerminal = ["closed_won", "closed_lost", "converted", "unqualified"].includes(item.status);
      const isStale = !isTerminal && ageMs > STALE_THRESHOLD_MS;

      return {
        id: item.id,
        title: item.title,
        contactName: item.contactName,
        email: item.email,
        phone: item.phone,
        companyName: item.companyName,
        leadSource: item.leadSource,
        status: item.status,
        priority: item.priority,
        estimatedValue: item.estimatedValue || 0,
        assignedManagerId: item.assignedManagerId,
        notes: item.notes,
        customerId: item.customerId,
        quoteId: item.quoteId,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        isStale,
      };
    });

    // Define column mapping definitions
    const columnDefs: { id: LeadStage | "closed"; title: string; matchStatuses: string[] }[] = [
      { id: "new", title: "New Lead", matchStatuses: ["new"] },
      { id: "contacted", title: "Contacted", matchStatuses: ["contacted"] },
      { id: "assessment", title: "Assessment", matchStatuses: ["assessment", "qualified"] },
      { id: "proposal_sent", title: "Proposal Sent", matchStatuses: ["proposal_sent"] },
      { id: "negotiation", title: "Negotiation", matchStatuses: ["negotiation"] },
      { id: "closed_won", title: "Closed Won", matchStatuses: ["closed_won", "converted"] },
      { id: "closed_lost", title: "Closed Lost", matchStatuses: ["closed_lost", "unqualified"] },
    ];

    let totalPipelineValue = 0;
    let staleCount = 0;

    const columns: PipelineColumn[] = columnDefs.map((col) => {
      const colLeads = processedLeads.filter((l) => col.matchStatuses.includes(l.status));
      const colValue = colLeads.reduce((sum, l) => sum + l.estimatedValue, 0);

      totalPipelineValue += colValue;
      colLeads.forEach((l) => {
        if (l.isStale) staleCount++;
      });

      return {
        id: col.id,
        title: col.title,
        leads: colLeads,
        totalValue: colValue,
        count: colLeads.length,
      };
    });

    return {
      success: true,
      data: {
        columns,
        totalPipelineValue,
        totalLeads: processedLeads.length,
        staleCount,
      },
    };
  } catch (error) {
    console.error("Error fetching pipeline data:", error);
    return {
      success: false,
      error: "Failed to load pipeline data",
    };
  }
}

/**
 * Calculates executive CRM analytics metrics and conversion funnel data.
 */
export async function getPipelineAnalyticsAction(horizon: CrmDateHorizon = "30d"): Promise<{
  success: boolean;
  metrics?: PipelineAnalyticsMetrics;
  error?: string;
}> {
  await requireAdminAuth();

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

    const filteredLeads = await db
      .select()
      .from(leads)
      .where(gte(leads.createdAt, startDate))
      .orderBy(desc(leads.createdAt));

    const wonLeads = filteredLeads.filter((l) => ["closed_won", "converted"].includes(l.status));
    const lostLeads = filteredLeads.filter((l) => ["closed_lost", "unqualified"].includes(l.status));

    const wonLeadsCount = wonLeads.length;
    const lostLeadsCount = lostLeads.length;
    const totalClosed = wonLeadsCount + lostLeadsCount;
    const winRate = totalClosed > 0 ? Math.round((wonLeadsCount / totalClosed) * 100) : 0;

    const wonRevenue = wonLeads.reduce((sum, l) => sum + (l.estimatedValue || 0), 0);
    const totalPipelineValuation = filteredLeads.reduce(
      (sum, l) => sum + (l.estimatedValue || 0),
      0
    );

    // Calculate average sales cycle days for won leads
    let totalCycleDays = 0;
    wonLeads.forEach((l) => {
      const created = new Date(l.createdAt).getTime();
      const closed = new Date(l.updatedAt).getTime();
      const diffDays = Math.max(1, Math.round((closed - created) / (1000 * 60 * 60 * 24)));
      totalCycleDays += diffDays;
    });

    const avgSalesCycleDays = wonLeadsCount > 0 ? Math.round(totalCycleDays / wonLeadsCount) : 0;

    // Build stage progression funnel breakdown
    const totalCount = Math.max(1, filteredLeads.length);
    const stageCounts = {
      new: filteredLeads.filter((l) => l.status === "new").length,
      contacted: filteredLeads.filter((l) => l.status === "contacted").length,
      assessment: filteredLeads.filter((l) => ["assessment", "qualified"].includes(l.status)).length,
      proposal_sent: filteredLeads.filter((l) => l.status === "proposal_sent").length,
      negotiation: filteredLeads.filter((l) => l.status === "negotiation").length,
      closed_won: wonLeadsCount,
    };

    const funnel = [
      {
        stage: "New Lead",
        count: stageCounts.new,
        value: filteredLeads
          .filter((l) => l.status === "new")
          .reduce((sum, l) => sum + (l.estimatedValue || 0), 0),
        conversionRate: Math.round((stageCounts.new / totalCount) * 100),
      },
      {
        stage: "Contacted",
        count: stageCounts.contacted,
        value: filteredLeads
          .filter((l) => l.status === "contacted")
          .reduce((sum, l) => sum + (l.estimatedValue || 0), 0),
        conversionRate: Math.round((stageCounts.contacted / totalCount) * 100),
      },
      {
        stage: "Assessment",
        count: stageCounts.assessment,
        value: filteredLeads
          .filter((l) => ["assessment", "qualified"].includes(l.status))
          .reduce((sum, l) => sum + (l.estimatedValue || 0), 0),
        conversionRate: Math.round((stageCounts.assessment / totalCount) * 100),
      },
      {
        stage: "Proposal Sent",
        count: stageCounts.proposal_sent,
        value: filteredLeads
          .filter((l) => l.status === "proposal_sent")
          .reduce((sum, l) => sum + (l.estimatedValue || 0), 0),
        conversionRate: Math.round((stageCounts.proposal_sent / totalCount) * 100),
      },
      {
        stage: "Negotiation",
        count: stageCounts.negotiation,
        value: filteredLeads
          .filter((l) => l.status === "negotiation")
          .reduce((sum, l) => sum + (l.estimatedValue || 0), 0),
        conversionRate: Math.round((stageCounts.negotiation / totalCount) * 100),
      },
      {
        stage: "Closed Won",
        count: stageCounts.closed_won,
        value: wonRevenue,
        conversionRate: Math.round((wonLeadsCount / totalCount) * 100),
      },
    ];

    return {
      success: true,
      metrics: {
        wonLeadsCount,
        lostLeadsCount,
        totalClosed,
        winRate,
        wonRevenue,
        totalPipelineValuation,
        avgSalesCycleDays,
        funnel,
      },
    };
  } catch (error) {
    console.error("Error fetching pipeline analytics:", error);
    return {
      success: false,
      error: "Failed to load CRM analytics metrics",
    };
  }
}
