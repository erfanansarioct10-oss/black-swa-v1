/**
 * Server-side validation of Cloudflare Turnstile anti-bot token.
 * Shared across all server actions that accept user-submitted forms.
 */
export async function verifyTurnstileToken(token?: string): Promise<boolean> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  // If Turnstile is not configured or using test dummy keys, bypass check safely
  if (!secretKey || !siteKey || secretKey.startsWith("1x000000")) return true;
  if (!token) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[Turnstile Dev Warning]: No token provided, bypassing in non-production environment.");
      return true;
    }
    return false;
  }

  try {
    const formData = new URLSearchParams();
    formData.append("secret", secretKey);
    formData.append("response", token);

    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        body: formData,
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );

    const data = await response.json();
    return Boolean(data.success);
  } catch (error) {
    console.error("[Turnstile Verification Exception]:", error);
    return process.env.NODE_ENV !== "production";
  }
}
