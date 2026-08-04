/**
 * Stress & Security Audit Suite for Phase 5D Proposal Generation & Customer Dispatch
 * Usage: npx tsx scripts/stress/38-proposal-generation-stress.ts
 */

import {
  createProposalVersionSchema,
  dispatchProposalEmailSchema,
  trackProposalViewSchema,
} from "../../schemas/proposal";

async function runProposalGenerationStressSuite() {
  console.log("==================================================================");
  console.log("🧪 PHASE 5D STRESS & SECURITY AUDIT SUITE: PROPOSAL GENERATION");
  console.log("==================================================================\n");

  let passedTests = 0;
  let totalTests = 0;

  function assert(condition: boolean, testName: string) {
    totalTests++;
    if (condition) {
      console.log(`  ✅ [PASS] ${testName}`);
      passedTests++;
    } else {
      console.error(`  ❌ [FAIL] ${testName}`);
    }
  }

  // 1. Zod Validation: createProposalVersionSchema
  console.log("1. Testing Zod Validation: createProposalVersionSchema");
  const validVersionInput = {
    quoteId: "123e4567-e89b-12d3-a456-426614174000",
    validityDays: 30,
    customMessage: "Official commercial discount applied.",
    termsAndConditions: "Standard 50% advance payment required.",
  };

  const parsedVersion = createProposalVersionSchema.safeParse(validVersionInput);
  assert(parsedVersion.success === true, "Valid proposal version schema parses successfully");

  const invalidValidityInput = {
    quoteId: "123e4567-e89b-12d3-a456-426614174000",
    validityDays: 365, // Exceeds max 180 days limit
  };
  const parsedInvalidValidity = createProposalVersionSchema.safeParse(invalidValidityInput);
  assert(parsedInvalidValidity.success === false, "Fails validation when validityDays exceeds 180 days limit");

  // 2. Zod Validation: dispatchProposalEmailSchema
  console.log("\n2. Testing Zod Validation: dispatchProposalEmailSchema");
  const validDispatchInput = {
    quoteId: "123e4567-e89b-12d3-a456-426614174000",
    customMessage: "Please review the attached proposal proposal.",
  };
  const parsedDispatch = dispatchProposalEmailSchema.safeParse(validDispatchInput);
  assert(parsedDispatch.success === true, "Valid email dispatch schema parses successfully");

  const invalidQuoteIdDispatch = {
    quoteId: "invalid-uuid-string",
  };
  const parsedInvalidDispatch = dispatchProposalEmailSchema.safeParse(invalidQuoteIdDispatch);
  assert(parsedInvalidDispatch.success === false, "Rejects invalid UUID format for quoteId in dispatch schema");

  // 3. Zod Validation: trackProposalViewSchema
  console.log("\n3. Testing Zod Validation: trackProposalViewSchema");
  const validTrackInput = {
    referenceId: "RFQ-20260803-ABCD1234",
    lookupToken: "b456-789a-bcde",
  };
  const parsedTrack = trackProposalViewSchema.safeParse(validTrackInput);
  assert(parsedTrack.success === true, "Valid proposal tracking receipt parses successfully");

  const emptyTrackInput = {
    referenceId: "   ",
  };
  const parsedEmptyTrack = trackProposalViewSchema.safeParse(emptyTrackInput);
  assert(parsedEmptyTrack.success === false, "Rejects whitespace-only referenceId in view tracking schema");

  // Summary
  console.log("\n==================================================================");
  console.log(`📊 STRESS SUITE SUMMARY: ${passedTests}/${totalTests} TESTS PASSED`);
  console.log("==================================================================");

  if (passedTests < totalTests) {
    process.exit(1);
  }
}

runProposalGenerationStressSuite().catch((err) => {
  console.error("Fatal error during stress suite:", err);
  process.exit(1);
});
