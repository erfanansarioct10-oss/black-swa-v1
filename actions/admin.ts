"use server";

import { isRedirectError } from "next/dist/client/components/redirect-error";
import { revalidatePath } from "next/cache";
import { and, desc, eq, ilike, isNull, or, sql } from "drizzle-orm";

import { db } from "@/db";
import { contactInquiries, quoteActivityLogs, quotes } from "@/db/schema";

import { requireAdminAuth } from "@/lib/admin-auth";
import type { ActionResponse } from "@/types/quote";

export interface AdminSearchResultItem {
  id: string;
  type: "rfq" | "inquiry";
  title: string;
  subtitle: string;
  badge: string;
  href: string;
  createdAt: string;
}

export interface AdminSearchResponseData {
  quotes: AdminSearchResultItem[];
  inquiries: AdminSearchResultItem[];
}

export interface AdminNotificationItem {
  id: string;
  type: "rfq" | "inquiry";
  title: string;
  subtitle: string;
  referenceId?: string | null;
  status: string;
  createdAt: string;
  href: string;
}

export interface AdminNotificationsData {
  totalUnread: number;
  unassignedQuotesCount: number;
  newInquiriesCount: number;
  items: AdminNotificationItem[];
}

function safeRevalidatePath(path: string) {
  try {
    revalidatePath(path);
  } catch {
    // Suppress revalidatePath error when called outside Next.js request context (e.g. CLI script tests)
  }
}

/**
 * Searches across RFQs (reference ID, customer name, company, email) and contact inquiries.
 * Protected by server-side Clerk role authorization.
 */
export async function adminSearchAction(
  query: string
): Promise<ActionResponse<AdminSearchResponseData>> {
  try {
    await requireAdminAuth();

    const trimmed = (query || "").trim();
    if (!trimmed || trimmed.length < 2 || trimmed.length > 500) {
      return {
        success: true,
        data: { quotes: [], inquiries: [] },
      };
    }


    const searchPattern = `%${trimmed}%`;

    const [matchedQuotes, matchedInquiries] = await Promise.all([
      db
        .select()
        .from(quotes)
        .where(
          or(
            ilike(quotes.referenceId, searchPattern),
            ilike(quotes.fullName, searchPattern),
            ilike(quotes.companyName, searchPattern),
            ilike(quotes.email, searchPattern)
          )
        )
        .orderBy(desc(quotes.createdAt))
        .limit(5),
      db
        .select()
        .from(contactInquiries)
        .where(
          or(
            ilike(contactInquiries.fullName, searchPattern),
            ilike(contactInquiries.companyName, searchPattern),
            ilike(contactInquiries.email, searchPattern),
            ilike(contactInquiries.message, searchPattern)
          )
        )
        .orderBy(desc(contactInquiries.createdAt))
        .limit(5),
    ]);

    const formattedQuotes: AdminSearchResultItem[] = matchedQuotes.map((q) => ({
      id: q.id,
      type: "rfq",
      title: `${q.referenceId} — ${q.fullName}`,
      subtitle: `${q.companyName || "Direct Client"} • ${q.email}`,
      badge: q.status.toUpperCase(),
      href: `/admin/quotes?ref=${encodeURIComponent(q.referenceId)}`,
      createdAt: q.createdAt.toISOString(),
    }));

    const formattedInquiries: AdminSearchResultItem[] = matchedInquiries.map((i) => ({
      id: i.id,
      type: "inquiry",
      title: `Inquiry from ${i.fullName}`,
      subtitle: `${i.companyName} • ${i.serviceSlug ? `Service: ${i.serviceSlug}` : i.email}`,
      badge: i.status.toUpperCase(),
      href: `/admin/inquiries?id=${encodeURIComponent(i.id)}`,
      createdAt: i.createdAt.toISOString(),
    }));

    return {
      success: true,
      data: {
        quotes: formattedQuotes,
        inquiries: formattedInquiries,
      },
    };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    console.error("Error executing adminSearchAction:", error);
    return {
      success: false,
      error: "Failed to execute administrative search.",
    };
  }
}

/**
 * Retrieves unread notification items requiring executive action (unassigned pending RFQs, new inquiries, and customer revision requests).
 * Protected by server-side Clerk role authorization.
 */
export async function getAdminNotificationsAction(): Promise<ActionResponse<AdminNotificationsData>> {
  try {
    await requireAdminAuth();

    const [unassignedQuotes, newInquiries, revisionRequests, [unassignedTotal], [newInquiriesTotal], [revisionsTotal]] = await Promise.all([
      db
        .select()
        .from(quotes)
        .where(and(eq(quotes.status, "pending"), isNull(quotes.assignedManagerId)))
        .orderBy(desc(quotes.createdAt))
        .limit(10),
      db
        .select()
        .from(contactInquiries)
        .where(eq(contactInquiries.status, "new"))
        .orderBy(desc(contactInquiries.createdAt))
        .limit(10),
      db
        .select({
          id: quoteActivityLogs.id,
          quoteId: quotes.id,
          referenceId: quotes.referenceId,
          fullName: quotes.fullName,
          companyName: quotes.companyName,
          message: quoteActivityLogs.message,
          createdAt: quoteActivityLogs.createdAt,
        })
        .from(quoteActivityLogs)
        .innerJoin(quotes, eq(quoteActivityLogs.quoteId, quotes.id))
        .where(eq(quoteActivityLogs.actionType, "revision_requested"))
        .orderBy(desc(quoteActivityLogs.createdAt))
        .limit(10),
      db
        .select({ count: sql<number>`count(*)` })
        .from(quotes)
        .where(and(eq(quotes.status, "pending"), isNull(quotes.assignedManagerId))),
      db
        .select({ count: sql<number>`count(*)` })
        .from(contactInquiries)
        .where(eq(contactInquiries.status, "new")),
      db
        .select({ count: sql<number>`count(*)` })
        .from(quoteActivityLogs)
        .where(eq(quoteActivityLogs.actionType, "revision_requested")),
    ]);

    const quoteItemsMapped: AdminNotificationItem[] = unassignedQuotes.map((q) => ({
      id: q.id,
      type: "rfq",
      title: `Unassigned RFQ ${q.referenceId}`,
      subtitle: `${q.fullName} (${q.companyName || "Individual Client"})`,
      referenceId: q.referenceId,
      status: q.status,
      createdAt: q.createdAt.toISOString(),
      href: `/admin/quotes?ref=${encodeURIComponent(q.referenceId)}`,
    }));

    const inquiryItemsMapped: AdminNotificationItem[] = newInquiries.map((i) => ({
      id: i.id,
      type: "inquiry",
      title: `New Inquiry from ${i.fullName}`,
      subtitle: i.companyName ? `${i.companyName} — ${i.email}` : i.email,
      referenceId: null,
      status: i.status,
      createdAt: i.createdAt.toISOString(),
      href: `/admin/inquiries?id=${encodeURIComponent(i.id)}`,
    }));

    const revisionItemsMapped: AdminNotificationItem[] = revisionRequests.map((r) => ({
      id: r.id,
      type: "rfq",
      title: `Negotiation Requested: ${r.referenceId}`,
      subtitle: `${r.fullName} (${r.companyName || "Direct Client"})`,
      referenceId: r.referenceId,
      status: "revision_requested",
      createdAt: r.createdAt.toISOString(),
      href: `/admin/quotes/${r.quoteId}`,
    }));

    const combinedItems = [...revisionItemsMapped, ...quoteItemsMapped, ...inquiryItemsMapped].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    const totalUnassigned = Number(unassignedTotal?.count || 0);
    const totalNewInquiries = Number(newInquiriesTotal?.count || 0);
    const totalRevisions = Number(revisionsTotal?.count || 0);

    return {
      success: true,
      data: {
        totalUnread: totalUnassigned + totalNewInquiries + totalRevisions,
        unassignedQuotesCount: totalUnassigned,
        newInquiriesCount: totalNewInquiries,
        items: combinedItems,
      },
    };

  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    console.error("Error executing getAdminNotificationsAction:", error);
    return {
      success: false,
      error: "Failed to retrieve active notifications.",
    };
  }
}

/**
 * Assigns an unassigned quotation request to the current logged-in director.
 */
export async function assignQuoteToSelfAction(
  quoteId: string
): Promise<ActionResponse<{ message: string }>> {
  try {
    const session = await requireAdminAuth();

    const updated = await db
      .update(quotes)
      .set({
        assignedManagerId: session.userId,
        assignedAt: new Date(),
        status: "manager_assigned",
        updatedAt: new Date(),
      })
      .where(and(eq(quotes.id, quoteId), isNull(quotes.assignedManagerId)))
      .returning({ id: quotes.id });

    if (!updated || updated.length === 0) {
      return {
        success: false,
        error: "Quotation request was not found or has already been assigned.",
      };
    }

    safeRevalidatePath("/admin");
    safeRevalidatePath("/admin/quotes");

    return {
      success: true,
      data: { message: "Quotation request successfully assigned." },
    };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    console.error("Error assigning quote to director:", error);
    return {
      success: false,
      error: "Failed to assign quotation request.",
    };
  }
}

const INQUIRY_STATUSES = ["new", "in_progress", "resolved", "archived"] as const;

/**
 * Updates the operational status of a contact inquiry.
 */
export async function updateInquiryStatusAction(
  inquiryId: string,
  status: "new" | "in_progress" | "resolved" | "archived"
): Promise<ActionResponse<{ message: string }>> {
  try {
    await requireAdminAuth();

    if (!INQUIRY_STATUSES.includes(status as (typeof INQUIRY_STATUSES)[number])) {
      return {
        success: false,
        error: "Invalid inquiry status.",
      };
    }

    const updated = await db
      .update(contactInquiries)
      .set({
        status,
        updatedAt: new Date(),
      })
      .where(eq(contactInquiries.id, inquiryId))
      .returning({ id: contactInquiries.id });

    if (!updated || updated.length === 0) {
      return {
        success: false,
        error: "Inquiry was not found.",
      };
    }

    safeRevalidatePath("/admin");
    safeRevalidatePath("/admin/inquiries");

    return {
      success: true,
      data: { message: "Inquiry status updated successfully." },
    };

  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    console.error("Error updating inquiry status:", error);
    return {
      success: false,
      error: "Failed to update inquiry status.",
    };
  }
}
