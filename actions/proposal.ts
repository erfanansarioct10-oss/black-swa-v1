"use server";

import { isRedirectError } from "next/dist/client/components/redirect-error";
import { revalidatePath } from "next/cache";
import { after } from "next/server";
import { and, count, desc, eq, sql } from "drizzle-orm";

import { db } from "@/db";
import { leads, proposalVersions, quoteActivityLogs, quoteItems, quotes } from "@/db/schema";

import { requireAdminAuth } from "@/lib/admin-auth";
import { sendQuoteProposalEmail } from "@/lib/email";
import {
  createProposalVersionSchema,
  dispatchProposalEmailSchema,
  submitNegotiationRequestSchema,
  trackProposalViewSchema,
  type CreateProposalVersionSchemaType,
  type DispatchProposalEmailSchemaType,
  type SubmitNegotiationRequestSchemaType,
} from "@/schemas/proposal";

import type { ActionResponse } from "@/types/quote";

export type ProposalVersionItem = typeof proposalVersions.$inferSelect;

/**
 * Creates a new immutable proposal version snapshot and sets expiration timestamp.
 */
export async function createProposalVersionAction(
  input: CreateProposalVersionSchemaType
): Promise<ActionResponse<ProposalVersionItem>> {
  try {
    const authSession = await requireAdminAuth();
    const validated = createProposalVersionSchema.parse(input);

    const [existingQuote] = await db
      .select()
      .from(quotes)
      .where(eq(quotes.id, validated.quoteId))
      .limit(1);

    if (!existingQuote) {
      return { success: false, error: "Quotation record not found" };
    }

    const items = await db
      .select()
      .from(quoteItems)
      .where(eq(quoteItems.quoteId, validated.quoteId));

    const [versionCountResult] = await db
      .select({ count: count() })
      .from(proposalVersions)
      .where(eq(proposalVersions.quoteId, validated.quoteId));

    const nextVersionNumber = Number(versionCountResult?.count || 0) + 1;
    const now = new Date();
    const expiresAt = new Date(now.getTime() + validated.validityDays * 24 * 60 * 60 * 1000);

    const snapshotObj = {
      referenceId: existingQuote.referenceId,
      fullName: existingQuote.fullName,
      email: existingQuote.email,
      phone: existingQuote.phone,
      companyName: existingQuote.companyName,
      items,
      financials: {
        subtotal: existingQuote.subtotal,
        vatAmount: existingQuote.vatAmount,
        shippingCost: existingQuote.shippingCost,
        discountTotal: existingQuote.discountTotal,
        grandTotal: existingQuote.grandTotal,
        currency: existingQuote.currency,
      },
    };

    let newVersionRecord: ProposalVersionItem | undefined;

    await db.transaction(async (tx) => {
      const [inserted] = await tx
        .insert(proposalVersions)
        .values({
          quoteId: validated.quoteId,
          versionNumber: nextVersionNumber,
          subtotal: existingQuote.subtotal,
          vatAmount: existingQuote.vatAmount,
          shippingCost: existingQuote.shippingCost,
          discountTotal: existingQuote.discountTotal,
          grandTotal: existingQuote.grandTotal,
          currency: existingQuote.currency,
          validityDays: validated.validityDays,
          expiresAt,
          customMessage: validated.customMessage || null,
          termsAndConditions: validated.termsAndConditions || null,
          dispatchedByClerkUserId: authSession.userId,
          snapshotData: JSON.stringify(snapshotObj),
        })
        .returning();

      newVersionRecord = inserted;

      // Update quote status to 'quoted' if not already past that stage
      if (existingQuote.status === "pending" || existingQuote.status === "under_review" || existingQuote.status === "manager_assigned") {
        await tx
          .update(quotes)
          .set({
            status: "quoted",
            quotedAt: existingQuote.quotedAt || now,
            updatedAt: now,
          })
          .where(eq(quotes.id, validated.quoteId));
      }

      await tx.insert(quoteActivityLogs).values({
        quoteId: validated.quoteId,
        authorClerkUserId: authSession.userId,
        authorName: authSession.isDevBypass ? "Dev Administrator" : "Admin Staff",
        actionType: "proposal_version_created",
        message: `Generated official proposal revision v${nextVersionNumber} (Grand Total: ${existingQuote.currency} Rs. ${existingQuote.grandTotal.toLocaleString("en-NP")}, Valid for ${validated.validityDays} days)`,
      });
    });

    if (!newVersionRecord) {
      return { success: false, error: "Failed to persist proposal version" };
    }

    revalidatePath("/admin/quotes");
    revalidatePath(`/admin/quotes/${validated.quoteId}`);
    revalidatePath(`/quote/track/${existingQuote.referenceId}`);

    return {
      success: true,
      data: newVersionRecord,
    };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error("[CREATE_PROPOSAL_VERSION_ERROR]", error);
    return { success: false, error: "Failed to generate proposal version" };
  }
}

/**
 * Retrieves all proposal version revisions for a specific quote ID.
 */
export async function getProposalVersionsAction(
  quoteId: string
): Promise<ActionResponse<ProposalVersionItem[]>> {
  try {
    await requireAdminAuth();

    const versions = await db
      .select()
      .from(proposalVersions)
      .where(eq(proposalVersions.quoteId, quoteId))
      .orderBy(desc(proposalVersions.versionNumber));

    return {
      success: true,
      data: versions,
    };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error("[GET_PROPOSAL_VERSIONS_ERROR]", error);
    return { success: false, error: "Failed to load proposal version history" };
  }
}

/**
 * Dispatches formal proposal email receipt to client and updates version dispatch audit record.
 */
export async function dispatchProposalEmailAction(
  input: DispatchProposalEmailSchemaType
): Promise<ActionResponse<{ sent: boolean; dispatchedAt: string }>> {
  try {
    const authSession = await requireAdminAuth();
    const validated = dispatchProposalEmailSchema.parse(input);

    const [existingQuote] = await db
      .select()
      .from(quotes)
      .where(eq(quotes.id, validated.quoteId))
      .limit(1);

    if (!existingQuote) {
      return { success: false, error: "Quotation record not found" };
    }

    // Get specified or latest proposal version
    let versionRecord: ProposalVersionItem | undefined;
    if (validated.proposalVersionId) {
      const [found] = await db
        .select()
        .from(proposalVersions)
        .where(eq(proposalVersions.id, validated.proposalVersionId))
        .limit(1);
      versionRecord = found;
    } else {
      const [latest] = await db
        .select()
        .from(proposalVersions)
        .where(eq(proposalVersions.quoteId, validated.quoteId))
        .orderBy(desc(proposalVersions.versionNumber))
        .limit(1);
      versionRecord = latest;
    }

    const now = new Date();
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://blackswan.com.np";
    const trackUrl = `${baseUrl}/quote/track/${encodeURIComponent(existingQuote.referenceId)}?token=${encodeURIComponent(existingQuote.lookupToken)}`;

    const emailSubject = `Official Quotation Proposal #${existingQuote.referenceId} ${versionRecord ? `(v${versionRecord.versionNumber})` : ""} - Black Swan International`;
    const customMessageText = validated.customMessage || versionRecord?.customMessage || "";

    const emailHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
        <div style="background-color: #0f172a; padding: 24px; border-radius: 8px 8px 0 0; text-align: left;">
          <span style="font-size: 10px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #94a3b8;">Black Swan International</span>
          <h2 style="color: #ffffff; margin: 4px 0 0 0; font-size: 20px;">Official Commercial Proposal</h2>
        </div>
        <div style="padding: 24px;">
          <p style="font-size: 15px; color: #1e293b;">Dear <strong>${existingQuote.fullName}</strong>,</p>
          <p style="font-size: 14px; color: #475569; line-height: 1.6;">
            Your official quotation proposal for reference <strong>#${existingQuote.referenceId}</strong> ${versionRecord ? `(Revision v${versionRecord.versionNumber})` : ""} has been issued by our executive team.
          </p>
          
          <div style="background-color: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 16px; margin: 20px 0;">
            <div style="font-size: 11px; font-weight: 700; uppercase; color: #64748b; letter-spacing: 1px;">Proposal Overview</div>
            <div style="font-size: 18px; font-weight: 800; color: #0f172a; margin-top: 4px;">Rs. ${existingQuote.grandTotal.toLocaleString("en-NP")} ${existingQuote.currency}</div>
            <div style="font-size: 12px; color: #64748b; margin-top: 2px;">Includes Subtotal, 13% Nepalese VAT Tax & Delivery</div>
            ${versionRecord?.expiresAt ? `<div style="font-size: 12px; color: #b45309; font-weight: 600; margin-top: 6px;">Validity Expiration: ${new Date(versionRecord.expiresAt).toLocaleDateString("en-NP")}</div>` : ""}
          </div>

          ${customMessageText ? `<div style="background-color: #eff6ff; border-left: 4px solid #0284c7; padding: 14px; border-radius: 4px; font-size: 14px; color: #1e40af; margin: 20px 0;"><strong>Executive Note:</strong><br />${customMessageText}</div>` : ""}

          <div style="text-align: center; margin: 32px 0 16px 0;">
            <a href="${trackUrl}" target="_blank" style="display: inline-block; background-color: #0f172a; color: #ffffff; padding: 14px 32px; border-radius: 8px; font-weight: 700; text-decoration: none; font-size: 14px;">
              View & Download Official Quotation Proposal
            </a>
          </div>
        </div>
        <div style="border-top: 1px solid #e2e8f0; padding-top: 16px; text-align: center; font-size: 12px; color: #64748b;">
          <p style="margin: 0;">Black Swan International &bull; Medical Technology & Broadcast Hardware</p>
          <p style="margin: 4px 0 0 0;">Kathmandu, Nepal | Info: info@blackswan.com.np</p>
        </div>
      </div>
    `;

    const dispatchResult = await sendQuoteProposalEmail({
      to: existingQuote.email,
      subject: emailSubject,
      html: emailHtml,
    });

    if (!dispatchResult.success) {
      return { success: false, error: dispatchResult.error || "Email dispatch failed" };
    }

    await db.transaction(async (tx) => {
      if (versionRecord) {
        await tx
          .update(proposalVersions)
          .set({
            dispatchedAt: now,
            dispatchedByClerkUserId: authSession.userId,
            customMessage: customMessageText || versionRecord.customMessage,
          })
          .where(eq(proposalVersions.id, versionRecord.id));
      }

      await tx
        .update(quotes)
        .set({
          status: "quoted",
          quotedAt: existingQuote.quotedAt || now,
          updatedAt: now,
        })
        .where(eq(quotes.id, validated.quoteId));

      await tx.insert(quoteActivityLogs).values({
        quoteId: validated.quoteId,
        authorClerkUserId: authSession.userId,
        authorName: authSession.isDevBypass ? "Dev Administrator" : "Admin Staff",
        actionType: "proposal_dispatched",
        message: `Dispatched official quotation proposal ${versionRecord ? `v${versionRecord.versionNumber}` : ""} email receipt to ${existingQuote.email}`,
      });
    });

    after(async () => {
      // Async background logging / secondary tasks if needed
      console.log(`[Proposal Dispatch Success] Quote ${existingQuote.referenceId} sent to ${existingQuote.email}`);
    });

    revalidatePath("/admin/quotes");
    revalidatePath(`/admin/quotes/${validated.quoteId}`);
    revalidatePath(`/quote/track/${existingQuote.referenceId}`);

    return {
      success: true,
      data: {
        sent: true,
        dispatchedAt: now.toISOString(),
      },
    };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error("[DISPATCH_PROPOSAL_EMAIL_ERROR]", error);
    return { success: false, error: "Failed to dispatch proposal email" };
  }
}

/**
 * Public action invoked when a customer accesses the public proposal tracking portal.
 * Increments view count and updates receipt timestamps on the latest proposal version.
 */
export async function recordProposalViewAction(
  referenceId: string
): Promise<ActionResponse<{ viewCount: number; viewedAt: string }>> {
  try {
    const trimmedRef = (referenceId || "").trim();
    if (!trimmedRef) {
      return { success: false, error: "Reference ID is required" };
    }

    const [existingQuote] = await db
      .select()
      .from(quotes)
      .where(sql`UPPER(${quotes.referenceId}) = UPPER(${trimmedRef})`)
      .limit(1);

    if (!existingQuote) {
      return { success: false, error: "Quotation record not found" };
    }

    const [latestVersion] = await db
      .select()
      .from(proposalVersions)
      .where(eq(proposalVersions.quoteId, existingQuote.id))
      .orderBy(desc(proposalVersions.versionNumber))
      .limit(1);

    const now = new Date();
    let updatedViewCount = 1;

    if (latestVersion) {
      updatedViewCount = latestVersion.viewCount + 1;
      await db
        .update(proposalVersions)
        .set({
          viewedAt: latestVersion.viewedAt || now,
          lastViewedAt: now,
          viewCount: updatedViewCount,
        })
        .where(eq(proposalVersions.id, latestVersion.id));
    }

    // Consolidate client view receipt in audit trail (updates single log entry instead of flooding duplicate rows)
    const [existingViewLog] = await db
      .select()
      .from(quoteActivityLogs)
      .where(
        and(
          eq(quoteActivityLogs.quoteId, existingQuote.id),
          eq(quoteActivityLogs.actionType, "proposal_viewed")
        )
      )
      .limit(1);

    const viewMessage = `Customer accessed and viewed official quotation proposal #${existingQuote.referenceId} (Total views: ${updatedViewCount})`;

    if (existingViewLog) {
      await db
        .update(quoteActivityLogs)
        .set({
          message: viewMessage,
          createdAt: now,
        })
        .where(eq(quoteActivityLogs.id, existingViewLog.id));
    } else {
      await db.insert(quoteActivityLogs).values({
        quoteId: existingQuote.id,
        authorClerkUserId: "system_customer_tracking",
        authorName: "Client View Receipt",
        actionType: "proposal_viewed",
        message: viewMessage,
        createdAt: now,
      });
    }


    return {
      success: true,
      data: {
        viewCount: updatedViewCount,
        viewedAt: now.toISOString(),
      },
    };
  } catch (error) {
    console.error("[RECORD_PROPOSAL_VIEW_ERROR]", error);
    return { success: false, error: "Failed to record view receipt" };
  }
}

/**
 * Records a customer commercial negotiation / revision request for an issued quotation.
 */
export async function submitNegotiationRequestAction(
  input: SubmitNegotiationRequestSchemaType
): Promise<ActionResponse<{ recordedAt: string }>> {
  try {
    const validated = submitNegotiationRequestSchema.parse(input);

    const [existingQuote] = await db
      .select()
      .from(quotes)
      .where(eq(quotes.referenceId, validated.referenceId))
      .limit(1);

    if (!existingQuote) {
      return { success: false, error: "Quotation record not found" };
    }

    const now = new Date();

    // Log customer negotiation activity in quote audit stream
    await db.insert(quoteActivityLogs).values({
      quoteId: existingQuote.id,
      authorClerkUserId: "system_customer_negotiation",
      authorName: `Client (${existingQuote.fullName})`,
      actionType: "revision_requested",
      message: `Customer requested commercial negotiation/revision for #${existingQuote.referenceId}: "${validated.customerNotes}"`,
    });

    // Shift linked lead status to negotiation stage in CRM Sales Pipeline
    await db
      .update(leads)
      .set({
        status: "negotiation",
        updatedAt: now,
      })
      .where(eq(leads.quoteId, existingQuote.id));

    revalidatePath("/admin");
    revalidatePath("/admin/crm/pipeline");
    revalidatePath(`/admin/quotes/${existingQuote.id}`);
    revalidatePath(`/quote/track/${existingQuote.referenceId}`);


    return {
      success: true,
      data: {
        recordedAt: now.toISOString(),
      },
    };
  } catch (error) {
    console.error("[SUBMIT_NEGOTIATION_REQUEST_ERROR]", error);
    return { success: false, error: "Failed to submit negotiation request" };
  }
}

