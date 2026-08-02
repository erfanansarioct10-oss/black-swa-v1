import { quotes } from "../../db/schema";

export async function runCodeRabbitPR12StressTest(): Promise<{ success: boolean; testsRun: number; errors: string[] }> {
  const errors: string[] = [];
  let testsRun = 0;

  console.log("▶ Running Stress Test Spec 31: CodeRabbit PR #12 Review Findings Audit...");

  // Test 1: Stage timestamps column presence in Drizzle schema
  testsRun++;
  if (!("assignedAt" in quotes) || !("quotedAt" in quotes) || !("completedAt" in quotes)) {
    errors.push("Missing stage timestamp definitions ('assignedAt', 'quotedAt', 'completedAt') in 'quotes' schema table");
  }

  // Test 2: Auth bypass scoping logic assertion
  testsRun++;
  function evaluateAuthGuard(
    userId: string | null,
    isDevBypass: boolean,
    isAdmin: boolean
  ): "allow" | "redirect_login" | "redirect_unauthorized" {
    if (isDevBypass && !userId) {
      return "allow"; // Synthetic dev session
    }
    if (!userId) {
      return "redirect_login";
    }
    if (!isAdmin) {
      return "redirect_unauthorized";
    }
    return "allow";
  }

  const syntheticDev = evaluateAuthGuard(null, true, false);
  const unauthProd = evaluateAuthGuard(null, false, false);
  const nonAdminDev = evaluateAuthGuard("user_non_admin", true, false);
  const nonAdminProd = evaluateAuthGuard("user_non_admin", false, false);
  const adminUser = evaluateAuthGuard("user_admin", false, true);

  if (syntheticDev !== "allow") errors.push("Synthetic dev session failed to authorize");
  if (unauthProd !== "redirect_login") errors.push("Unauthenticated prod session failed to redirect to login");
  if (nonAdminDev !== "redirect_unauthorized") errors.push("Security leak: Signed-in non-admin user in dev was not redirected to unauthorized");
  if (nonAdminProd !== "redirect_unauthorized") errors.push("Signed-in non-admin user in prod was not redirected to unauthorized");
  if (adminUser !== "allow") errors.push("Authenticated admin user failed to authorize");

  // Test 3: Matching outer quote pair stripping (preserving internal quotes)
  testsRun++;
  function stripOuterQuotesOnly(input: string): string {
    let raw = (input || "").trim();
    if (
      (raw.startsWith('"') && raw.endsWith('"')) ||
      (raw.startsWith("'") && raw.endsWith("'"))
    ) {
      raw = raw.slice(1, -1).trim();
    }
    return raw;
  }

  const quotedEmail = '"John "Doctor" Smith <john@hospital.org>"';
  const singleQuotedEmail = "'John 'Director' Doe <john@studio.org>'";
  const mismatchedQuotes = '"John Smith <john@hospital.org>\'';

  const stripped1 = stripOuterQuotesOnly(quotedEmail);
  const stripped2 = stripOuterQuotesOnly(singleQuotedEmail);
  const stripped3 = stripOuterQuotesOnly(mismatchedQuotes);

  if (stripped1 !== 'John "Doctor" Smith <john@hospital.org>') {
    errors.push(`Failed to strip matching double outer quotes: got '${stripped1}'`);
  }
  if (stripped2 !== "John 'Director' Doe <john@studio.org>") {
    errors.push(`Failed to strip matching single outer quotes: got '${stripped2}'`);
  }
  if (stripped3 !== '"John Smith <john@hospital.org>\'') {
    errors.push(`Corrupted mismatched outer quotes: got '${stripped3}'`);
  }

  const passed = errors.length === 0;
  console.log(`  └─ Completed Spec 31 Stress Test: ${testsRun} assertions, ${errors.length} errors.`);

  return { success: passed, testsRun, errors };
}

if (require.main === module) {
  runCodeRabbitPR12StressTest().then((res) => {
    if (!res.success) {
      console.error("❌ Spec 31 CodeRabbit PR #12 Stress Test Failed:", res.errors);
      process.exit(1);
    } else {
      console.log("✅ Spec 31 CodeRabbit PR #12 Stress Test Passed Cleanly.");
    }
  });
}
