import { runCustomerManagementStressTest } from "./33-customer-management-stress";
import { runLeadManagementStressTest } from "./34-lead-management-stress";
import { runCodeRabbitPR14StressTest } from "./35-coderabbit-pr14-stress";
import { runQuoteWorkbenchStressTest } from "./36-quote-workbench-stress";
import { runPipelineCrmStressTest } from "./37-pipeline-crm-stress";

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

  // Spec 35: CodeRabbit PR #14 Review Findings Audit
  const spec35Result = await runCodeRabbitPR14StressTest();
  totalTests += spec35Result.testsRun;
  if (!spec35Result.success) {
    allErrors.push(...spec35Result.errors.map((e) => `[Spec 35 PR #14 Review Audit] ${e}`));
  }

  // Spec 36: Phase 5C Quotation Workbench & Interactive Proposal Builder
  const spec36Result = await runQuoteWorkbenchStressTest();
  totalTests += spec36Result.testsRun;
  if (!spec36Result.success) {
    allErrors.push(...spec36Result.errors.map((e) => `[Spec 36 Quote Workbench] ${e}`));
  }

  // Spec 37: Phase 5D Automated Pipeline Workflows & CRM Dashboards
  const spec37Result = await runPipelineCrmStressTest();
  totalTests += spec37Result.testsRun;
  if (!spec37Result.success) {
    allErrors.push(...spec37Result.errors.map((e) => `[Spec 37 Pipeline CRM] ${e}`));
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
