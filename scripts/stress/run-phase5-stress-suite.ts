import { runCustomerManagementStressTest } from "./33-customer-management-stress";
import { runLeadManagementStressTest } from "./34-lead-management-stress";

async function runPhase5StressSuite() {
  console.log("================================================================");
  console.log("🚀 STARTING PHASE 5 FEATURE STRESS TEST & SECURITY AUDIT SUITE");
  console.log("================================================================\n");

  const startTime = Date.now();
  let totalTests = 0;
  const allErrors: string[] = [];

  // Spec 33: Phase 5A Customer & Account Management Core
  const spec33Result = await runCustomerManagementStressTest();
  totalTests += spec33Result.testsRun;
  if (!spec33Result.success) {
    allErrors.push(...spec33Result.errors.map((e) => `[Spec 33 Customer Core] ${e}`));
  }

  // Spec 34: Phase 5B Lead Management & Inquiry Processing
  const spec34Result = await runLeadManagementStressTest();
  totalTests += spec34Result.testsRun;
  if (!spec34Result.success) {
    allErrors.push(...spec34Result.errors.map((e) => `[Spec 34 Lead Management] ${e}`));
  }

  const durationMs = Date.now() - startTime;

  console.log("\n================================================================");
  console.log("📊 PHASE 5 STRESS TEST SUITE SUMMARY REPORT");
  console.log("================================================================");
  console.log(`⏱️ Total Execution Time: ${durationMs}ms`);
  console.log(`🧪 Total Test Assertions Run: ${totalTests}`);
  console.log(`❌ Total Security / Concurrency Errors Detected: ${allErrors.length}`);

  if (allErrors.length > 0) {
    console.error("\n❌ STRESS TEST SUITE FAILED WITH THE FOLLOWING ERRORS:");
    allErrors.forEach((err, idx) => console.error(`  ${idx + 1}. ${err}`));
    process.exit(1);
  } else {
    console.log("\nVERIFIED CLEAN ✅");
    console.log("All Phase 5A & 5B stress scenarios, security audits, and concurrency checks passed cleanly with 0 errors!");
    process.exit(0);
  }
}

runPhase5StressSuite().catch((err) => {
  console.error("Fatal exception during Phase 5 stress suite execution:", err);
  process.exit(1);
});
