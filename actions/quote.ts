"use server";

import crypto from "crypto";
import { auth } from "@clerk/nextjs/server";
import { and, eq, sql } from "drizzle-orm";

import { db } from "@/db";
import { quoteItems, quotes } from "@/db/schema";
import { sendQuoteConfirmationEmail } from "@/lib/email";
import { sendTelegramQuoteAlert } from "@/lib/telegram";
import {
  createQuoteSchema,
  quoteTrackingLookupSchema,
  type CreateQuoteSchemaType,
  type QuoteTrackingLookupSchemaType,
} from "@/schemas/quote";
import type { ActionResponse, QuoteWithItems } from "@/types/quote";

/**
 * Creates a new quotation request header and its line items inside an atomic database transaction.
 */
export async function createQuoteAction(
  rawInput: CreateQuoteSchemaType
): Promise<ActionResponse<{ referenceId: string; lookupToken: string }>> {
  try {
    const validated = createQuoteSchema.parse(rawInput);

    // Optional user identity from Clerk auth
    const { userId } = await auth();

    // Format Reference ID: RFQ-YYYYMMDD-XXXX (e.g. RFQ-20260801-9F2C)
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const randomHex = crypto.randomBytes(2).toString("hex").toUpperCase();
    const referenceId = `RFQ-${dateStr}-${randomHex}`;

    // Unique UUID for secure public tracking link
    const lookupToken = crypto.randomUUID();

    const result = await db.transaction(async (tx) => {
      const [insertedQuote] = await tx
        .insert(quotes)
        .values({
          referenceId,
          lookupToken,
          clerkUserId: userId || null,
          fullName: validated.fullName,
          email: validated.email,
          phone: validated.phone,
          companyName: validated.companyName || null,
          projectScope: validated.projectScope || null,
          budgetRange: validated.budgetRange || null,
          timeline: validated.timeline || null,
          status: "pending",
        })
        .returning({
          id: quotes.id,
          referenceId: quotes.referenceId,
          lookupToken: quotes.lookupToken,
        });

      if (!insertedQuote) {
        throw new Error("Failed to create quote record header.");
      }

      const itemsToInsert = validated.items.map((item) => ({
        quoteId: insertedQuote.id,
        productId: item.productId,
        productTitle: item.productTitle,
        category: item.category,
        quantity: item.quantity,
        notes: item.notes || null,
      }));

      await tx.insert(quoteItems).values(itemsToInsert);

      return insertedQuote;
    });

    // Asynchronously dispatch Resend email & Telegram alert non-blockingly
    Promise.allSettled([
      sendQuoteConfirmationEmail({
        email: validated.email,
        fullName: validated.fullName,
        referenceId: result.referenceId,
        lookupToken: result.lookupToken,
        companyName: validated.companyName,
        items: validated.items,
      }),
      sendTelegramQuoteAlert({
        referenceId: result.referenceId,
        fullName: validated.fullName,
        email: validated.email,
        phone: validated.phone,
        companyName: validated.companyName,
        budgetRange: validated.budgetRange,
        timeline: validated.timeline,
        projectScope: validated.projectScope,
        items: validated.items,
      }),
    ]).catch((err) => {
      console.error("[Notification Dispatch Background Error]:", err);
    });

    return {
      success: true,
      data: {
        referenceId: result.referenceId,
        lookupToken: result.lookupToken,
      },
    };
  } catch (error) {
    console.error("Error creating quote request:", error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : "An unexpected error occurred while processing your quote request.";
    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Retrieves a quotation request and line items by reference ID and customer email address.
 */
export async function getQuoteByTrackingAction(
  rawInput: QuoteTrackingLookupSchemaType
): Promise<ActionResponse<QuoteWithItems>> {
  try {
    const validated = quoteTrackingLookupSchema.parse(rawInput);

    const [quoteRecord] = await db
      .select()
      .from(quotes)
      .where(
        and(
          eq(quotes.referenceId, validated.referenceId),
          sql`LOWER(${quotes.email}) = LOWER(${validated.email})`
        )
      )
      .limit(1);

    if (!quoteRecord) {
      return {
        success: false,
        error: "No quotation request found matching the provided Reference ID and email address.",
      };
    }

    const items = await db
      .select()
      .from(quoteItems)
      .where(eq(quoteItems.quoteId, quoteRecord.id));

    return {
      success: true,
      data: {
        ...quoteRecord,
        status: quoteRecord.status as QuoteWithItems["status"],
        items,
      },
    };
  } catch (error) {
    console.error("Error fetching quote by tracking:", error);
    return {
      success: false,
      error: "Unable to retrieve quotation request. Please verify your reference ID and email.",
    };
  }
}

/**
 * Retrieves a quotation request and line items by secure lookup token.
 */
export async function getQuoteByLookupTokenAction(
  lookupToken: string
): Promise<ActionResponse<QuoteWithItems>> {
  try {
    if (!lookupToken || typeof lookupToken !== "string") {
      return {
        success: false,
        error: "Invalid lookup token.",
      };
    }

    const [quoteRecord] = await db
      .select()
      .from(quotes)
      .where(eq(quotes.lookupToken, lookupToken))
      .limit(1);

    if (!quoteRecord) {
      return {
        success: false,
        error: "Quotation request not found.",
      };
    }

    const items = await db
      .select()
      .from(quoteItems)
      .where(eq(quoteItems.quoteId, quoteRecord.id));

    return {
      success: true,
      data: {
        ...quoteRecord,
        status: quoteRecord.status as QuoteWithItems["status"],
        items,
      },
    };
  } catch (error) {
    console.error("Error fetching quote by lookup token:", error);
    return {
      success: false,
      error: "Failed to fetch quotation details.",
    };
  }
}
