import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL || "Black Swan International <quotes@blackswaninternational.com>";

export interface SendQuoteConfirmationEmailParams {
  email: string;
  fullName: string;
  referenceId: string;
  lookupToken: string;
  companyName?: string | null;
  items: Array<{
    productTitle: string;
    category: string;
    quantity: number;
    notes?: string | null;
  }>;
}

/**
 * Generates responsive inline HTML for customer quote confirmation receipts.
 */
export function generateQuoteConfirmationHtml(params: SendQuoteConfirmationEmailParams): string {
  const { fullName, referenceId, companyName, items } = params;
  if (!process.env.NEXT_PUBLIC_APP_URL) {
    console.warn(
      "[Email Warning]: NEXT_PUBLIC_APP_URL environment variable is not set. Falling back to http://localhost:3000 for tracking link."
    );
  }
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const trackingUrl = `${baseUrl}/quote/track?referenceId=${encodeURIComponent(referenceId)}`;

  const itemsRowsHtml = items
    .map(
      (item) => `
      <tr style="border-bottom: 1px solid #e5e7eb;">
        <td style="padding: 12px 16px; font-size: 14px; font-weight: 600; color: #111827;">
          ${escapeHtml(item.productTitle)}
          ${
            item.notes
              ? `<div style="font-size: 12px; font-style: italic; color: #6b7280; margin-top: 4px;">Specs: ${escapeHtml(
                  item.notes
                )}</div>`
              : ""
          }
        </td>
        <td style="padding: 12px 16px; font-size: 12px; color: #4b5563; font-weight: 500; text-transform: uppercase;">
          ${escapeHtml(item.category)}
        </td>
        <td style="padding: 12px 16px; font-size: 14px; font-family: monospace; font-weight: 700; color: #111827; text-align: center;">
          ${item.quantity}
        </td>
      </tr>
    `
    )
    .join("");

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Quotation Receipt - ${escapeHtml(referenceId)}</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1f2937;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f3f4f6; padding: 32px 16px;">
        <tr>
          <td align="center">
            <table role="presentation" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e5e7eb; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
              
              <!-- Header -->
              <tr>
                <td style="background-color: #0f172a; padding: 28px 32px; text-align: left;">
                  <span style="font-size: 10px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #94a3b8;">Black Swan International</span>
                  <h1 style="margin: 6px 0 0 0; font-size: 22px; font-weight: 800; color: #ffffff;">Quotation Request Receipt</h1>
                </td>
              </tr>

              <!-- Content Body -->
              <tr>
                <td style="padding: 32px;">
                  <p style="margin: 0 0 16px 0; font-size: 15px; line-height: 1.5; color: #374151;">
                    Dear <strong>${escapeHtml(fullName)}</strong>,
                  </p>
                  <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 1.6; color: #4b5563;">
                    Thank you for submitting your commercial RFQ to Black Swan International. Your quotation request has been received and assigned to our sales engineering team.
                  </p>

                  <!-- Reference Box -->
                  <div style="background-color: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 16px 20px; margin-bottom: 24px;">
                    <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #64748b;">Official Reference ID</div>
                    <div style="font-size: 20px; font-family: monospace; font-weight: 800; color: #0f172a; margin-top: 4px;">${escapeHtml(referenceId)}</div>
                    ${
                      companyName
                        ? `<div style="font-size: 12px; color: #475569; margin-top: 4px;">Organization: <strong>${escapeHtml(companyName)}</strong></div>`
                        : ""
                    }
                  </div>

                  <!-- Equipment Summary Table -->
                  <h3 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #1e293b;">Requested Hardware Equipment</h3>
                  <table width="100%" cellspacing="0" cellpadding="0" style="border-collapse: collapse; margin-bottom: 24px; border: 1px solid #e5e7eb; border-radius: 6px; overflow: hidden;">
                    <thead>
                      <tr style="background-color: #f1f5f9; text-align: left;">
                        <th style="padding: 10px 16px; font-size: 11px; font-weight: 700; text-transform: uppercase; color: #475569;">Equipment</th>
                        <th style="padding: 10px 16px; font-size: 11px; font-weight: 700; text-transform: uppercase; color: #475569;">Category</th>
                        <th style="padding: 10px 16px; font-size: 11px; font-weight: 700; text-transform: uppercase; color: #475569; text-align: center;">Qty</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${itemsRowsHtml}
                    </tbody>
                  </table>

                  <!-- SLA Note -->
                  <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 14px 16px; margin-bottom: 24px; font-size: 13px; color: #166534; line-height: 1.5;">
                    <strong>Turnaround SLA:</strong> An assigned Sales Director will review your equipment specifications and issue an official B2B quotation PDF with tailored pricing and lead times in <strong>under 2 business hours</strong>.
                  </div>

                  <!-- CTA Button -->
                  <div style="text-align: center; margin: 28px 0 12px 0;">
                    <a href="${trackingUrl}" target="_blank" style="display: inline-block; background-color: #0f172a; color: #ffffff; text-decoration: none; padding: 12px 28px; font-size: 14px; font-weight: 700; border-radius: 8px; box-shadow: 0 1px 2px rgba(0,0,0,0.1);">
                      Track Quotation Status
                    </a>
                  </div>

                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 20px 32px; text-align: center; font-size: 12px; color: #64748b;">
                  <p style="margin: 0 0 4px 0; font-weight: 600; color: #334155;">Black Swan International &bull; B2B Hardware Solutions</p>
                  <p style="margin: 0;">Medical Technology & Broadcast Computer Hardware Systems</p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Dispatches a customer quote confirmation receipt via Resend Email API.
 */
export async function sendQuoteConfirmationEmail(
  params: SendQuoteConfirmationEmailParams
): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    if (!resend) {
      console.warn(
        `[Email Dev Fallback] RESEND_API_KEY is not configured. Email receipt for ${params.referenceId} skipped in local environment.`
      );
      return { success: true, id: "dev-fallback-mock-id" };
    }

    const htmlContent = generateQuoteConfirmationHtml(params);

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [params.email],
      subject: `Quotation Request Confirmed [Ref: ${params.referenceId}] - Black Swan International`,
      html: htmlContent,
    });

    if (error) {
      console.error("[Resend Email Error]:", error);
      return { success: false, error: error.message };
    }

    return { success: true, id: data?.id };
  } catch (err) {
    console.error("[Resend Exception]:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown email dispatch error",
    };
  }
}
