import { runLayoutShellStressTest } from "./26-layout-shell-stress";
import { runClerkAuthGuardStressTest } from "./27-clerk-auth-guard-stress";
import { runExecutiveMetricsStressTest } from "./28-executive-metrics-stress";
import { runAnalyticsVisualizationsStressTest } from "./29-analytics-visualizations-stress";
import { runCodeRabbitPR11StressTest } from "./30-coderabbit-pr11-stress";
import { runCodeRabbitPR12StressTest } from "./31-coderabbit-pr12-stress";
import { runCommandCenterDiagnosticsStressTest } from "./32-command-center-diagnostics-stress";

async function main() {
  console.log("================================================================");
  console.log("⚡ BLACK SWAN INTERNATIONAL — PHASE 4 STRESS TEST SUITE EXECUTION");
  console.log("================================================================\n");

  const results = [
    { spec: "Spec 26 (Phase 4A Admin Layout Shell)", fn: runLayoutShellStressTest },
    { spec: "Spec 27 (Phase 4A Clerk Role Auth Guard)", fn: runClerkAuthGuardStressTest },
    { spec: "Spec 28 (Phase 4B Executive Metrics Dashboard)", fn: runExecutiveMetricsStressTest },
    { spec: "Spec 29 (Phase 4C Advanced Analytics & Visualizations)", fn: runAnalyticsVisualizationsStressTest },
    { spec: "Spec 30 (Fix CodeRabbit PR #11 Findings)", fn: runCodeRabbitPR11StressTest },
    { spec: "Spec 31 (Fix CodeRabbit PR #12 Findings)", fn: runCodeRabbitPR12StressTest },
    { spec: "Spec 32 (Phase 4D Command Center & Diagnostics)", fn: runCommandCenterDiagnosticsStressTest },
  ];

  let totalTestsRun = 0;
  let totalErrors = 0;
  const failedSpecs: string[] = [];

  for (const item of results) {
    try {
      const res = await item.fn();
      totalTestsRun += res.testsRun;
      totalErrors += res.errors.length;
      if (!res.success) {
        failedSpecs.push(item.spec);
      }
    } catch (err) {
      totalErrors++;
      failedSpecs.push(item.spec);
      console.error(`❌ Exception executing ${item.spec}:`, err);
    }
  }

  console.log("\n================================================================");
  console.log("📊 PHASE 4 FEATURE STRESS TESTING SUMMARY REPORT");
  console.log("================================================================");
  console.log(`Total Stress Specifications Executed : 7`);
  console.log(`Total Stress Assertions Run          : ${totalTestsRun}`);
  console.log(`Total Vulnerabilities / Errors Found : ${totalErrors}`);
  console.log(`Phase 4 Stress Suite Clean Status    : ${failedSpecs.length === 0 ? "VERIFIED CLEAN ✅" : "FAILED ❌"}`);

  if (failedSpecs.length > 0) {
    console.error("\nFailed Specifications:");
    failedSpecs.forEach((s) => console.error(`  - ${s}`));
    process.exit(1);
  } else {
    console.log("\nAll Phase 4 feature stress tests executed with ZERO errors.");
    process.exit(0);
  }
}

main().catch((err) => {
  console.error("Fatal error running Phase 4 Stress Suite:", err);
  process.exit(1);
});
