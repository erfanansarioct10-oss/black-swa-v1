/**
 * Escapes HTML special characters to prevent XSS in dynamically generated HTML templates.
 * Covers the 5 standard HTML-unsafe characters required for email and messaging templates.
 * Safe for HTML text nodes and quoted attribute values; not safe for unquoted attributes, script, or style contexts.
 */
export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
