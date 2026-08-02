import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export interface AdminAuthSession {
  userId: string;
  orgId: string | null;
  orgRole: string | null;
  isDevBypass: boolean;
}

/**
 * Checks whether the current Clerk session has administrative role authorization ('admin' or 'org:admin').
 */
export function isAdminSession(has: (params: { role: string }) => boolean): boolean {
  return has({ role: "admin" }) || has({ role: "org:admin" });
}

/**
 * Server-side helper to enforce administrative authorization.
 * Verifies that the current user has 'admin' or 'org:admin' role in Clerk.
 * Supports explicit development bypass when ADMIN_DEV_BYPASS="true" in non-production environments.
 */
export async function requireAdminAuth(): Promise<AdminAuthSession> {
  const { userId, orgId, orgRole, has } = await auth();
  const isDevBypass = process.env.NODE_ENV !== "production" && process.env.ADMIN_DEV_BYPASS === "true";

  if (isDevBypass && !userId) {
    return {
      userId: "dev_admin_user",
      orgId: null,
      orgRole: "admin",
      isDevBypass: true,
    };
  }

  if (!userId) {
    redirect("/admin/login");
  }

  const isAdmin = isAdminSession(has);

  if (!isAdmin && !isDevBypass) {
    redirect("/admin/unauthorized");
  }

  return {
    userId,
    orgId: orgId ?? null,
    orgRole: orgRole ?? null,
    isDevBypass,
  };
}
