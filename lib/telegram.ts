import { escapeHtml } from "@/lib/html";

export interface SendTelegramQuoteAlertParams {
  referenceId: string;
  fullName: string;
  email: string;
  phone: string;
  companyName?: string | null;
  budgetRange?: string | null;
  timeline?: string | null;
  projectScope?: string | null;
  items: Array<{
    productTitle: string;
    category: string;
    quantity: number;
    notes?: string | null;
  }>;
}

async function sendTelegramMessage(
  text: string,
  devContext: string
): Promise<{ success: boolean; error?: string }> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.warn(
      `[Telegram Dev Fallback] TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is not configured. ${devContext} skipped in local environment.`
    );
    return { success: true };
  }

  try {
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "HTML",
      }),
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[Telegram Bot API Error]:", errorText);
      return { success: false, error: `Telegram API returned status ${response.status}` };
    }

    return { success: true };
  } catch (err) {
    console.error("[Telegram Alert Exception]:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown Telegram alert error",
    };
  }
}

/**
 * Sends an instant management alert to the internal Telegram channel via Telegram Bot API.
 */
export async function sendTelegramQuoteAlert(
  params: SendTelegramQuoteAlertParams
): Promise<{ success: boolean; error?: string }> {
  const itemsSummary = params.items
    .map(
      (item, idx) =>
        `  ${idx + 1}. <b>${escapeHtml(item.productTitle)}</b> (x${item.quantity}) - <i>${escapeHtml(
          item.category
        )}</i>${item.notes ? `\n     └ Specs: ${escapeHtml(item.notes)}` : ""}`
    )
    .join("\n");

  const messageText = `
🚨 <b>NEW B2B QUOTATION REQUEST</b>

📌 <b>Reference ID:</b> <code>${escapeHtml(params.referenceId)}</code>
👤 <b>Contact Name:</b> ${escapeHtml(params.fullName)}
✉️ <b>Email:</b> <code>${escapeHtml(params.email)}</code>
📞 <b>Phone:</b> ${escapeHtml(params.phone)}
🏢 <b>Company:</b> ${escapeHtml(params.companyName || "N/A")}
💰 <b>Budget:</b> ${escapeHtml(params.budgetRange || "Not specified")}
⏱️ <b>Timeline:</b> ${escapeHtml(params.timeline || "Not specified")}

📦 <b>Requested Hardware (${params.items.length}):</b>
${itemsSummary}

${params.projectScope ? `📝 <b>Project Scope:</b>\n<i>${escapeHtml(params.projectScope)}</i>\n` : ""}
⏰ <b>Action Required:</b> Response SLA &lt; 2 business hours.
`.trim();

  return sendTelegramMessage(messageText, `Alert for ${params.referenceId}`);
}

export interface SendTelegramContactInquiryParams {
  fullName: string;
  email: string;
  companyName: string;
  phone?: string | null;
  serviceSlug?: string | null;
  message: string;
}

/**
 * Sends an instant management alert for contact / service inquiries to the internal Telegram channel.
 */
export async function sendTelegramContactInquiryAlert(
  params: SendTelegramContactInquiryParams
): Promise<{ success: boolean; error?: string }> {
  const messageText = `
📩 <b>NEW CONTACT / SERVICE INQUIRY</b>

👤 <b>Name:</b> ${escapeHtml(params.fullName)}
🏢 <b>Company:</b> ${escapeHtml(params.companyName)}
✉️ <b>Email:</b> <code>${escapeHtml(params.email)}</code>
${params.phone ? `📞 <b>Phone:</b> ${escapeHtml(params.phone)}\n` : ""}${params.serviceSlug ? `⚙️ <b>Service Context:</b> <code>${escapeHtml(params.serviceSlug)}</code>\n` : ""}
📝 <b>Message:</b>
<i>${escapeHtml(params.message)}</i>

⏰ <b>Action Required:</b> Response SLA &lt; 1 business day.
`.trim();

  return sendTelegramMessage(messageText, "Contact inquiry alert");
}


