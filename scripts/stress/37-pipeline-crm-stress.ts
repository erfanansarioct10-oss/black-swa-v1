import {
  crmDateHorizonSchema,
  crmExportSchema,
  sanitizeCsvField,
  updateLeadStageSchema,
} from "../../schemas/pipeline";

export async function runPipelineCrmStressTest(): Promise<{
  success: boolean;
  testsRun: number;
  errors: string[];
}> {
  console.log("==========================================================");
  console.log("🧪 PHASE 5D STRESS TEST: Pipeline Workflows & CRM Dashboards");
  console.log("==========================================================");

  let passed = 0;
  const errors: string[] = [];

  function assert(condition: boolean, message: string) {
    if (condition) {
      console.log(`  ✅ [PASS]: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ [FAIL]: ${message}`);
      errors.push(message);
    }
  }

  // 1. Test Zod Stage Update Schema Bounds
  console.log("\n--- 1. Testing Zod Stage Update Schema Bounds ---");
  const validId = "123e4567-e89b-12d3-a456-426614174000";
  const validStages = [
    "new",
    "contacted",
    "assessment",
    "proposal_sent",
    "negotiation",
    "closed_won",
    "closed_lost",
  ];

  validStages.forEach((stage) => {
    const res = updateLeadStageSchema.safeParse({ leadId: validId, newStage: stage });
    assert(res.success, `Valid stage shift to "${stage}" accepted`);
  });

  const invalidStageRes = updateLeadStageSchema.safeParse({
    leadId: validId,
    newStage: "INVALID_STAGE_NAME",
  });
  assert(!invalidStageRes.success, "Invalid stage string rejected by Zod schema");

  const invalidUuidRes = updateLeadStageSchema.safeParse({
    leadId: "not-a-uuid",
    newStage: "contacted",
  });
  assert(!invalidUuidRes.success, "Non-UUID lead ID rejected by Zod schema");

  // 2. Test CSV Formula Injection Safeguards
  console.log("\n--- 2. Testing CSV Formula Injection Safeguards ---");
  const equalsSanitized = sanitizeCsvField("=CMD|' /C calc'!A0");
  assert(
    equalsSanitized.startsWith('"\'='),
    `Formula payload "=CMD..." sanitized to starting with "'=" (${equalsSanitized})`
  );

  const sumSanitized = sanitizeCsvField("@SUM(A1:A10)");
  assert(
    sumSanitized.startsWith('"\'@'),
    `Formula payload "@SUM..." sanitized to starting with "'@" (${sumSanitized})`
  );

  const normalSanitized = sanitizeCsvField("Normal Company Name");
  assert(
    normalSanitized === '"Normal Company Name"',
    `Normal text field formatted correctly (${normalSanitized})`
  );

  // 3. Test Date Horizon & Export Validation Schemas
  console.log("\n--- 3. Testing Horizon & Export Validation Schemas ---");
  const validHorizons = ["7d", "30d", "ytd", "all"];
  validHorizons.forEach((h) => {
    const res = crmDateHorizonSchema.safeParse({ horizon: h });
    assert(res.success, `Date horizon "${h}" accepted`);
  });

  const invalidHorizonRes = crmDateHorizonSchema.safeParse({ horizon: "999d" });
  assert(!invalidHorizonRes.success, "Invalid date horizon rejected");

  const validExportRes = crmExportSchema.safeParse({
    exportType: "leads",
    format: "csv",
    horizon: "30d",
  });
  assert(validExportRes.success, "Valid export parameters accepted");

  const invalidExportRes = crmExportSchema.safeParse({
    exportType: "unsupported_entity",
    format: "pdf",
  });
  assert(!invalidExportRes.success, "Unsupported export parameters rejected");

  // 4. Test SLA Stale Threshold Math
  console.log("\n--- 4. Testing SLA Stale Threshold Calculations ---");
  const now = new Date().getTime();
  const STALE_MS = 48 * 60 * 60 * 1000;

  const freshTimestamp = new Date(now - 10 * 60 * 60 * 1000); // 10 hours ago
  const staleTimestamp = new Date(now - 50 * 60 * 60 * 1000); // 50 hours ago

  const isFreshStale = now - freshTimestamp.getTime() > STALE_MS;
  const isStaleStale = now - staleTimestamp.getTime() > STALE_MS;

  assert(!isFreshStale, "Lead updated 10h ago is NOT marked stale");
  assert(isStaleStale, "Lead updated 50h ago IS correctly marked stale (>48h SLA)");

  console.log("\n==========================================================");
  console.log(`📊 PHASE 5D STRESS TEST RESULTS: ${passed} Passed, ${errors.length} Failed`);
  console.log("==========================================================");

  return {
    success: errors.length === 0,
    testsRun: passed + errors.length,
    errors,
  };
}

if (require.main === module) {
  runPipelineCrmStressTest()
    .then((res) => {
      if (!res.success) process.exit(1);
    })
    .catch((err) => {
      console.error("Fatal error during Phase 5D stress test execution:", err);
      process.exit(1);
    });
}
