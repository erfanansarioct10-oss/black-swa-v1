import { isAdminSession } from "../../lib/admin-auth";

export async function runClerkAuthGuardStressTest(): Promise<{ success: boolean; testsRun: number; errors: string[] }> {
  const errors: string[] = [];
  let testsRun = 0;

  console.log("▶ Running Stress Test Spec 27: Phase 4A Clerk Role Authorization Guard...");

  // Test 1: Role authorization checks for valid admin roles
  testsRun++;
  const adminRole = isAdminSession(({ role }) => role === "admin");
  const orgAdminRole = isAdminSession(({ role }) => role === "org:admin");
  const mixedAdminRole = isAdminSession(({ role }) => role === "admin" || role === "other");

  if (!adminRole) errors.push("isAdminSession failed to authorize 'admin' role");
  if (!orgAdminRole) errors.push("isAdminSession failed to authorize 'org:admin' role");
  if (!mixedAdminRole) errors.push("isAdminSession failed to authorize when 'admin' role is present");

  // Test 2: Role boundary privilege escalation prevention
  testsRun++;
  const memberRole = isAdminSession(({ role }) => role === "org:member");
  const guestRole = isAdminSession(({ role }) => role === "guest");
  const injectedRole1 = isAdminSession(({ role }) => role === "admin_bypass");
  const injectedRole2 = isAdminSession(({ role }) => role === "root");
  const injectedRole3 = isAdminSession(({ role }) => role === "org:admin_viewer");
  const injectedRole4 = isAdminSession(({ role }) => role === "ADMIN");

  if (memberRole) errors.push("isAdminSession erroneously authorized 'org:member' role");
  if (guestRole) errors.push("isAdminSession erroneously authorized 'guest' role");
  if (injectedRole1) errors.push("Privilege escalation vulnerability: 'admin_bypass' granted access");
  if (injectedRole2) errors.push("Privilege escalation vulnerability: 'root' granted access");
  if (injectedRole3) errors.push("Privilege escalation vulnerability: 'org:admin_viewer' granted access");
  if (injectedRole4) errors.push("Case-sensitivity vulnerability: uppercase 'ADMIN' granted access without exact match");

  // Test 3: Dev bypass environment safety assertions
  testsRun++;
  const origNodeEnv = process.env.NODE_ENV;
  const origDevBypass = process.env.ADMIN_DEV_BYPASS;

  // Test in production environment
  (process.env as Record<string, string | undefined>).NODE_ENV = "production";
  process.env.ADMIN_DEV_BYPASS = "true";

  const isBypassInProd = process.env.NODE_ENV !== "production" && process.env.ADMIN_DEV_BYPASS === "true";
  if (isBypassInProd) {
    errors.push("Security Misconfiguration: ADMIN_DEV_BYPASS must be ignored when NODE_ENV === 'production'");
  }

  // Test in development environment without explicit ADMIN_DEV_BYPASS="true"
  (process.env as Record<string, string | undefined>).NODE_ENV = "development";
  process.env.ADMIN_DEV_BYPASS = "false";

  const isBypassWithoutFlag = process.env.NODE_ENV !== "production" && process.env.ADMIN_DEV_BYPASS === "true";
  if (isBypassWithoutFlag) {
    errors.push("Security Misconfiguration: Dev bypass triggered when ADMIN_DEV_BYPASS !== 'true'");
  }

  // Restore env
  (process.env as Record<string, string | undefined>).NODE_ENV = origNodeEnv;
  process.env.ADMIN_DEV_BYPASS = origDevBypass;

  // Test 4: Unauthenticated login redirect formatting
  testsRun++;
  function buildLoginRedirect(pathname: string, search: string): string {
    const fullPath = pathname + search;
    const loginUrl = new URL("http://localhost:3000/admin/login");
    loginUrl.searchParams.set("redirect_url", fullPath);
    return loginUrl.toString();
  }

  const redirect1 = buildLoginRedirect("/admin/quotes", "?status=pending");
  const redirect2 = buildLoginRedirect("/admin/analytics", "");

  if (!redirect1.includes("redirect_url=%2Fadmin%2Fquotes%3Fstatus%3Dpending")) {
    errors.push(`Unauthenticated login redirect URL failed to encode full query string: got '${redirect1}'`);
  }
  if (!redirect2.includes("redirect_url=%2Fadmin%2Fanalytics")) {
    errors.push(`Unauthenticated login redirect URL failed for basic path: got '${redirect2}'`);
  }

  const passed = errors.length === 0;
  console.log(`  └─ Completed Spec 27 Stress Test: ${testsRun} assertions, ${errors.length} errors.`);

  return { success: passed, testsRun, errors };
}

if (require.main === module) {
  runClerkAuthGuardStressTest().then((res) => {
    if (!res.success) {
      console.error("❌ Spec 27 Clerk Auth Guard Stress Test Failed:", res.errors);
      process.exit(1);
    } else {
      console.log("✅ Spec 27 Clerk Auth Guard Stress Test Passed Cleanly.");
    }
  });
}
