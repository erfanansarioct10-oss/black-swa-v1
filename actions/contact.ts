"use server";

import { after } from "next/server";
import { db } from "@/db";
import { contactInquiries } from "@/db/schema";
import { contactInquirySchema, type ContactInquirySchemaType } from "@/schemas/contact";
import { sendContactInquiryConfirmationEmail } from "@/lib/email";
import { sendTelegramContactInquiryAlert } from "@/lib/telegram";
import { verifyTurnstileToken } from "@/lib/turnstile";
import type { ActionResponse } from "@/types/quote";



/**
 * Submits a contact or service inquiry, records it in the database, and triggers async background notifications.
 */
export async function submitContactInquiryAction(
  input: ContactInquirySchemaType
): Promise<ActionResponse<{ message: string }>> {
  try {
    const validated = contactInquirySchema.safeParse(input);
    if (!validated.success) {
      return {
        success: false,
        error: validated.error.issues[0]?.message || "Invalid contact inquiry details.",
      };
    }

    const isTurnstileValid = await verifyTurnstileToken(validated.data.turnstileToken);
    if (!isTurnstileValid) {
      return {
        success: false,
        error: "Security verification failed. Please refresh and complete the bot protection check.",
      };
    }

    // Persist contact inquiry record into PostgreSQL
    await db.insert(contactInquiries).values({
      fullName: validated.data.fullName,
      companyName: validated.data.companyName,
      email: validated.data.email,
      phone: validated.data.phone || null,
      serviceSlug: validated.data.serviceSlug || null,
      message: validated.data.message,
      status: "new",
    });


    after(async () => {
      const results = await Promise.allSettled([
        sendContactInquiryConfirmationEmail({
          email: validated.data.email,
          fullName: validated.data.fullName,
          companyName: validated.data.companyName,
          phone: validated.data.phone,
          serviceSlug: validated.data.serviceSlug,
          message: validated.data.message,
        }),
        sendTelegramContactInquiryAlert({
          fullName: validated.data.fullName,
          email: validated.data.email,
          companyName: validated.data.companyName,
          phone: validated.data.phone,
          serviceSlug: validated.data.serviceSlug,
          message: validated.data.message,
        }),
      ]);

      results.forEach((res, index) => {
        const serviceName = index === 0 ? "Resend Email" : "Telegram Alert";
        if (res.status === "rejected") {
          console.error(`[${serviceName} Dispatch Rejected]:`, res.reason);
        } else if (!res.value.success) {
          console.warn(`[${serviceName} Dispatch Warning]:`, res.value.error);
        }
      });
    });

    return {
      success: true,
      data: { message: "Inquiry submitted successfully." },
    };
  } catch (error) {
    console.error("Error submitting contact inquiry:", error);
    return {
      success: false,
      error: "An unexpected error occurred while processing your inquiry. Please try again.",
    };
  }
}
