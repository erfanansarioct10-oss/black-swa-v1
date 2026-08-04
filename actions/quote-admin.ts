"use server";

import { isRedirectError } from "next/dist/client/components/redirect-error";
import { revalidatePath } from "next/cache";
import { and, desc, eq } from "drizzle-orm";

import { db } from "@/db";
import { customers, leads, quoteActivityLogs, quoteItems, quotes } from "@/db/schema";
import { requireAdminAuth } from "@/lib/admin-auth";
import {
  addQuoteActivityNoteSchema,
  assignQuoteManagerSchema,
  sendQuoteProposalEmailSchema,
  updateQuoteFinancialsSchema,
  updateQuoteStatusSchema,
  type AddQuoteActivityNoteSchemaType,
  type AssignQuoteManagerSchemaType,
  type SendQuoteProposalEmailSchemaType,
  type UpdateQuoteFinancialsSchemaType,
  type UpdateQuoteStatusSchemaType,
} from "@/schemas/quote-admin";
import type { ActionResponse } from "@/types/quote";
import { sendQuoteProposalEmail } from "@/lib/email";

export interface QuoteDetailData {
  quote: typeof quotes.$inferSelect;
  items: (typeof quoteItems.$inferSelect)[];
  customer: (typeof customers.$inferSelect) | null;
  linkedLead: (typeof leads.$inferSelect) | null;
  activityLogs: (typeof quoteActivityLogs.$inferSelect)[];
}

/**
 * Retrieves full quotation record, line items, customer details, linked lead, and activity logs.
 */
export async function getAdminQuoteDetailAction(quoteId: string): Promise<ActionResponse<QuoteDetailData>> {
  try {
    await requireAdminAuth();

    const [quoteRecord] = await db
      .select()
      .from(quotes)
      .where(eq(quotes.id, quoteId))
      .limit(1);

    if (!quoteRecord) {
      return { success: false, error: "Quotation record not found" };
    }

    const items = await db
      .select()
      .from(quoteItems)
      .where(eq(quoteItems.quoteId, quoteId));

    let customerRecord: typeof customers.$inferSelect | null = null;
    if (quoteRecord.customerId) {
      const [foundCustomer] = await db
        .select()
        .from(customers)
        .where(eq(customers.id, quoteRecord.customerId))
        .limit(1);
      customerRecord = foundCustomer || null;
    }

    let linkedLeadRecord: typeof leads.$inferSelect | null = null;
    const [foundLead] = await db
      .select()
      .from(leads)
      .where(eq(leads.quoteId, quoteId))
      .limit(1);
    linkedLeadRecord = foundLead || null;

    const activityLogs = await db
      .select()
      .from(quoteActivityLogs)
      .where(eq(quoteActivityLogs.quoteId, quoteId))
      .orderBy(desc(quoteActivityLogs.createdAt));

    return {
      success: true,
      data: {
        quote: quoteRecord,
        items,
        customer: customerRecord,
        linkedLead: linkedLeadRecord,
        activityLogs,
      },
    };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error("[GET_ADMIN_QUOTE_DETAIL_ERROR]", error);
    return { success: false, error: "Failed to load quotation details" };
  }
}

/**
 * Updates line item pricing, discounts, shipping, subtotal, 13% VAT, and grand total.
 */
export async function updateQuoteFinancialsAction(
  input: UpdateQuoteFinancialsSchemaType
): Promise<ActionResponse<{ grandTotal: number }>> {
  try {
    const authSession = await requireAdminAuth();
    const validated = updateQuoteFinancialsSchema.parse(input);

    const [existingQuote] = await db
      .select()
      .from(quotes)
      .where(eq(quotes.id, validated.quoteId))
      .limit(1);

    if (!existingQuote) {
      return { success: false, error: "Quotation record not found" };
    }

    let calculatedSubtotal = 0;
    let totalDiscountAmount = 0;

    await db.transaction(async (tx) => {
      for (const itemInput of validated.items) {
        const rawLineTotal = itemInput.unitPrice * itemInput.discountPercentage; // calculation scratch
        const discountFraction = itemInput.discountPercentage / 100;
        const lineTotal = Math.round(itemInput.unitPrice * (1 - discountFraction));
        const itemTotalPrice = lineTotal;

        calculatedSubtotal += itemTotalPrice;
        totalDiscountAmount += Math.round(itemInput.unitPrice * discountFraction);

        await tx
          .update(quoteItems)
          .set({
            unitPrice: itemInput.unitPrice,
            discountPercentage: itemInput.discountPercentage,
            totalPrice: itemTotalPrice,
            notes: itemInput.notes,
          })
          .where(and(eq(quoteItems.id, itemInput.id), eq(quoteItems.quoteId, validated.quoteId)));
      }

      const vatAmount = Math.round(calculatedSubtotal * 0.13); // 13% Nepalese VAT
      const grandTotal = calculatedSubtotal + vatAmount + validated.shippingCost;

      await tx
        .update(quotes)
        .set({
          subtotal: calculatedSubtotal,
          vatAmount,
          shippingCost: validated.shippingCost,
          discountTotal: totalDiscountAmount,
          grandTotal,
          currency: validated.currency,
          updatedAt: new Date(),
        })
        .where(eq(quotes.id, validated.quoteId));

      await tx.insert(quoteActivityLogs).values({
        quoteId: validated.quoteId,
        authorClerkUserId: authSession.userId,
        authorName: authSession.isDevBypass ? "Dev Administrator" : "Admin Staff",
        actionType: "financial_update",
        message: `Updated quotation line items and recalculated grand total: NPR Rs. ${grandTotal.toLocaleString("en-NP")} (Subtotal: Rs. ${calculatedSubtotal.toLocaleString("en-NP")}, 13% VAT: Rs. ${vatAmount.toLocaleString("en-NP")})`,
      });
    });

    revalidatePath("/admin/quotes");
    revalidatePath(`/admin/quotes/${validated.quoteId}`);
    revalidatePath(`/quote/track/${existingQuote.referenceId}`);

    const [updatedQuote] = await db
      .select({ grandTotal: quotes.grandTotal })
      .from(quotes)
      .where(eq(quotes.id, validated.quoteId))
      .limit(1);

    return {
      success: true,
      data: { grandTotal: updatedQuote?.grandTotal || 0 },
    };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error("[UPDATE_QUOTE_FINANCIALS_ERROR]", error);
    return { success: false, error: "Failed to update quote financials" };
  }
}

/**
 * Updates quotation status lifecycle stage and auto-syncs linked CRM lead stage.
 */
export async function updateQuoteStatusAction(
  input: UpdateQuoteStatusSchemaType
): Promise<ActionResponse<{ status: string }>> {
  try {
    const authSession = await requireAdminAuth();
    const validated = updateQuoteStatusSchema.parse(input);

    const [existingQuote] = await db
      .select()
      .from(quotes)
      .where(eq(quotes.id, validated.quoteId))
      .limit(1);

    if (!existingQuote) {
      return { success: false, error: "Quotation record not found" };
    }

    const now = new Date();
    const updates: Partial<typeof quotes.$inferInsert> = {
      status: validated.status,
      updatedAt: now,
    };

    if (validated.adminNotes !== undefined) {
      updates.adminNotes = validated.adminNotes;
    }

    if (validated.status === "quoted" && !existingQuote.quotedAt) {
      updates.quotedAt = now;
    } else if (validated.status === "completed" && !existingQuote.completedAt) {
      updates.completedAt = now;
    }

    await db.transaction(async (tx) => {
      await tx.update(quotes).set(updates).where(eq(quotes.id, validated.quoteId));

      // Auto-sync linked CRM Lead if present
      if (validated.status === "completed") {
        await tx
          .update(leads)
          .set({ status: "converted", updatedAt: now })
          .where(eq(leads.quoteId, validated.quoteId));
      } else if (validated.status === "quoted") {
        await tx
          .update(leads)
          .set({ status: "qualified", updatedAt: now })
          .where(eq(leads.quoteId, validated.quoteId));
      }

      await tx.insert(quoteActivityLogs).values({
        quoteId: validated.quoteId,
        authorClerkUserId: authSession.userId,
        authorName: authSession.isDevBypass ? "Dev Administrator" : "Admin Staff",
        actionType: "status_change",
        message: `Changed quotation status from '${existingQuote.status}' to '${validated.status}'`,
      });
    });

    revalidatePath("/admin/quotes");
    revalidatePath(`/admin/quotes/${validated.quoteId}`);
    revalidatePath(`/quote/track/${existingQuote.referenceId}`);

    return {
      success: true,
      data: { status: validated.status },
    };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error("[UPDATE_QUOTE_STATUS_ERROR]", error);
    return { success: false, error: "Failed to update quote status" };
  }
}

/**
 * Appends a manual staff note / internal audit entry to the activity log.
 */
export async function addQuoteActivityNoteAction(
  input: AddQuoteActivityNoteSchemaType
): Promise<ActionResponse<{ id: string }>> {
  try {
    const authSession = await requireAdminAuth();
    const validated = addQuoteActivityNoteSchema.parse(input);

    const [inserted] = await db
      .insert(quoteActivityLogs)
      .values({
        quoteId: validated.quoteId,
        authorClerkUserId: authSession.userId,
        authorName: authSession.isDevBypass ? "Dev Administrator" : "Admin Staff",
        actionType: "note_added",
        message: validated.message,
      })
      .returning({ id: quoteActivityLogs.id });

    revalidatePath(`/admin/quotes/${validated.quoteId}`);

    return {
      success: true,
      data: { id: inserted.id },
    };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error("[ADD_QUOTE_ACTIVITY_NOTE_ERROR]", error);
    return { success: false, error: "Failed to record activity note" };
  }
}

/**
 * Assigns an account manager / managing director to the quotation record.
 */
export async function assignQuoteManagerAction(
  input: AssignQuoteManagerSchemaType
): Promise<ActionResponse<{ managerId: string }>> {
  try {
    const authSession = await requireAdminAuth();
    const validated = assignQuoteManagerSchema.parse(input);

    const now = new Date();
    await db.transaction(async (tx) => {
      await tx
        .update(quotes)
        .set({
          assignedManagerId: validated.managerId,
          assignedAt: now,
          status: "manager_assigned",
          updatedAt: now,
        })
        .where(eq(quotes.id, validated.quoteId));

      await tx.insert(quoteActivityLogs).values({
        quoteId: validated.quoteId,
        authorClerkUserId: authSession.userId,
        authorName: authSession.isDevBypass ? "Dev Administrator" : "Admin Staff",
        actionType: "manager_assigned",
        message: `Assigned quotation to Account Manager (${validated.managerName || validated.managerId})`,
      });
    });

    revalidatePath("/admin/quotes");
    revalidatePath(`/admin/quotes/${validated.quoteId}`);

    return {
      success: true,
      data: { managerId: validated.managerId },
    };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error("[ASSIGN_QUOTE_MANAGER_ERROR]", error);
    return { success: false, error: "Failed to assign manager" };
  }
}

/**
 * Dispatches formal PDF proposal email receipt via Resend and logs customer dispatch.
 */
export async function sendQuoteProposalEmailAction(
  input: SendQuoteProposalEmailSchemaType
): Promise<ActionResponse<{ sent: boolean }>> {
  try {
    const authSession = await requireAdminAuth();
    const validated = sendQuoteProposalEmailSchema.parse(input);

    const [existingQuote] = await db
      .select()
      .from(quotes)
      .where(eq(quotes.id, validated.quoteId))
      .limit(1);

    if (!existingQuote) {
      return { success: false, error: "Quotation record not found" };
    }

    const trackUrl = `${process.env.NEXT_PUBLIC_APP_URL || "https://blackswan.com.np"}/quote/track/${existingQuote.referenceId}`;

    const emailSubject = `Official Quotation Proposal #${existingQuote.referenceId} - Black Swan International`;
    const emailHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
        <h2 style="color: #0f172a;">Black Swan International</h2>
        <p>Dear ${existingQuote.fullName},</p>
        <p>Your official quotation proposal for reference <strong>#${existingQuote.referenceId}</strong> has been issued and is ready for review.</p>
        ${validated.customMessage ? `<div style="background-color: #f8fafc; padding: 12px; border-left: 4px solid #0284c7; margin: 16px 0;">${validated.customMessage}</div>` : ""}
        <p style="margin-top: 24px;">
          <a href="${trackUrl}" style="display: inline-block; background-color: #0f172a; color: #ffffff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 600;">
            View & Download Official Quotation Proposal
          </a>
        </p>
        <p style="color: #64748b; font-size: 14px; margin-top: 32px;">If you have any questions, please reply directly to this email or contact your assigned account manager.</p>
      </div>
    `;

    await sendQuoteProposalEmail({
      to: existingQuote.email,
      subject: emailSubject,
      html: emailHtml,
    });

    await db.insert(quoteActivityLogs).values({
      quoteId: validated.quoteId,
      authorClerkUserId: authSession.userId,
      authorName: authSession.isDevBypass ? "Dev Administrator" : "Admin Staff",
      actionType: "email_sent",
      message: `Dispatched official quotation proposal email to ${existingQuote.email}`,
    });

    revalidatePath(`/admin/quotes/${validated.quoteId}`);

    return {
      success: true,
      data: { sent: true },
    };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error("[SEND_QUOTE_PROPOSAL_EMAIL_ERROR]", error);
    return { success: false, error: "Failed to dispatch proposal email" };
  }
}
