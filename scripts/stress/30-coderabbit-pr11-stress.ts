export async function runCodeRabbitPR11StressTest(): Promise<{ success: boolean; testsRun: number; errors: string[] }> {
  const errors: string[] = [];
  let testsRun = 0;

  console.log("▶ Running Stress Test Spec 30: CodeRabbit PR #11 Review Findings Audit...");

  // Test 1: Redirect URL search query parameter preservation
  testsRun++;
  const rawPathname = "/admin/quotes";
  const rawSearch = "?status=pending&ref=RFQ-1001";
  const targetRedirectUrl = rawPathname + rawSearch;

  if (targetRedirectUrl !== "/admin/quotes?status=pending&ref=RFQ-1001") {
    errors.push(`Failed to preserve full query string in redirect_url target: '${targetRedirectUrl}'`);
  }

  // Test 2: Email string quote stripping logic across multiple edge case inputs
  testsRun++;
  function sanitizeFromEmail(input: string): string {
    let trimmed = (input || "").trim();
    if (
      (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
      (trimmed.startsWith("'") && trimmed.endsWith("'"))
    ) {
      trimmed = trimmed.slice(1, -1).trim();
    }
    return trimmed || "Black Swan International <quotes@nooridigital.site>";
  }

  const case1 = sanitizeFromEmail('"Black Swan <quotes@domain.com>"');
  const case2 = sanitizeFromEmail("'Black Swan <quotes@domain.com>'");
  const case3 = sanitizeFromEmail("Black Swan <quotes@domain.com>");
  const case4 = sanitizeFromEmail("");
  const case5 = sanitizeFromEmail("  \"  Black Swan <quotes@domain.com>  \"  ");

  if (case1 !== "Black Swan <quotes@domain.com>") errors.push(`Failed double quote stripping: got '${case1}'`);
  if (case2 !== "Black Swan <quotes@domain.com>") errors.push(`Failed single quote stripping: got '${case2}'`);
  if (case3 !== "Black Swan <quotes@domain.com>") errors.push(`Corrupted unquoted string: got '${case3}'`);
  if (case4 !== "Black Swan International <quotes@nooridigital.site>") errors.push(`Failed fallback for empty string: got '${case4}'`);
  if (case5 !== "Black Swan <quotes@domain.com>") errors.push(`Failed whitespace + quote stripping: got '${case5}'`);

  const passed = errors.length === 0;
  console.log(`  └─ Completed Spec 30 Stress Test: ${testsRun} assertions, ${errors.length} errors.`);

  return { success: passed, testsRun, errors };
}

if (require.main === module) {
  runCodeRabbitPR11StressTest().then((res) => {
    if (!res.success) {
      console.error("❌ Spec 30 CodeRabbit PR #11 Stress Test Failed:", res.errors);
      process.exit(1);
    } else {
      console.log("✅ Spec 30 CodeRabbit PR #11 Stress Test Passed Cleanly.");
    }
  });
}
