import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export interface AdminAuthSession {
  userId: string;
  orgId: string | null;
  orgRole: string | null;
  isDevBypass: boolean;
}

/**
 * Server-side helper to enforce administrative authorization.
 * Verifies that the current user has 'admin' or 'org:admin' role in Clerk.
 * Enforces non-production bypass for local development testing and strict production gating.
 */
export async function requireAdminAuth(): Promise<AdminAuthSession> {
  const { userId, orgId, orgRole, has } = await auth();
  const isDev = process.env.NODE_ENV !== "production";

  if (isDev) {
    return {
      userId: userId ?? "dev_admin_user",
      orgId: orgId ?? null,
      orgRole: orgRole ?? "admin",
      isDevBypass: true,
    };
  }

  if (!userId) {
    redirect("/admin/login");
  }

  const isAdmin = has({ role: "admin" }) || has({ role: "org:admin" });

  if (!isAdmin) {
    redirect("/admin/unauthorized");
  }

  return {
    userId,
    orgId: orgId ?? null,
    orgRole: orgRole ?? null,
    isDevBypass: false,
  };
}
