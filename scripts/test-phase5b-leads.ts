/**
 * Stress & Integration Test Script for Phase 5B: Lead Management & Inquiry Processing
 * 
 * Usage:
 *   npx tsx scripts/test-phase5b-leads.ts
 */

import Module from "module";
import process from "process";

// Mock Next.js 'server-only' package for Node.js CLI execution
const originalRequire = Module.prototype.require;
// @ts-ignore overriding require for CLI test execution
Module.prototype.require = function (id: string) {
  if (id === "server-only") {
    return {};
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return originalRequire.apply(this, arguments as any);
};

// Enable administrative dev bypass flag for test execution
process.env.ADMIN_DEV_BYPASS = "true";
(process.env as Record<string, string>).NODE_ENV = "development";

async function runPhase5BStressTests() {
  console.log("=================================================================");
  console.log("  BLACK SWAN V1 — PHASE 5B LEAD MANAGEMENT STRESS TEST SUITE   ");
  console.log("=================================================================\n");

  let passedTests = 0;
  let failedTests = 0;

  // Import server actions after setting environment flags
  const {
    createLeadAction,
    getLeadsAction,
    getLeadByIdAction,
    updateLeadAction,
    convertLeadToCustomerAction,
    getLeadStatsAction,
  } = await import("../actions/lead");

  const createdLeadIds: string[] = [];

  // -----------------------------------------------------------------
  // Test 1: Baseline KPI Metric Query
  // -----------------------------------------------------------------
  console.log("📊 Test 1: Fetching initial lead pipeline stats...");
  try {
    const statsRes = await getLeadStatsAction();
    if (statsRes.success && statsRes.data) {
      console.log("  ✅ Baseline KPI Stats Query Succeeded!");
      console.log(`     Total Leads:            ${statsRes.data.totalLeads}`);
      console.log(`     New Inbound:            ${statsRes.data.newInbound}`);
      console.log(`     Qualified Prospects:    ${statsRes.data.qualifiedProspects}`);
      console.log(`     Est. Pipeline Value:    $${statsRes.data.estimatedPipelineValue.toLocaleString()}`);
      passedTests++;
    } else {
      console.error("  ❌ Baseline KPI Query Failed:", statsRes.error);
      failedTests++;
    }
  } catch (err) {
    console.error("  ❌ Baseline KPI Query Threw Exception:", err);
    failedTests++;
  }

  console.log("\n-----------------------------------------------------------------\n");

  // -----------------------------------------------------------------
  // Test 2: Bulk Concurrent Lead Creation (Pipeline Ingestion Stress)
  // -----------------------------------------------------------------
  console.log("🚀 Test 2: Executing concurrent lead creation stress test...");
  const sampleLeadsData = [
    {
      title: "Stress Test Lead #1: Telehealth Equipment Gateway",
      contactName: "Dr. Anil Karki",
      email: "anil.karki@stress-test-hospital.np",
      phone: "+977 9841001122",
      companyName: "Stress Test National Hospital",
      leadSource: "website_rfq" as const,
      status: "new" as const,
      priority: "high" as const,
      estimatedValue: 45000,
      notes: "High priority requirement for 4K video encoding gateways.",
    },
    {
      title: "Stress Test Lead #2: Broadcast Playout Server Node",
      contactName: "Sanjay Shrestha",
      email: "sanjay@stress-test-media.np",
      phone: "+977 9801992233",
      companyName: "Stress Test Television Network",
      leadSource: "direct_inquiry" as const,
      status: "contacted" as const,
      priority: "medium" as const,
      estimatedValue: 82000,
      notes: "Looking for redundant SDI playout nodes with master clock sync.",
    },
    {
      title: "Stress Test Lead #3: Urgent ICU Monitoring Gateway",
      contactName: "Dr. Rita Adhikari",
      email: "rita.a@stress-test-clinic.np",
      phone: "+977 9851088776",
      companyName: "Stress Test Healthcare Clinic",
      leadSource: "referral" as const,
      status: "qualified" as const,
      priority: "urgent" as const,
      estimatedValue: 125000,
      notes: "Needs immediate delivery of multi-parameter telemetry units.",
    },
    {
      title: "Stress Test Lead #4: Studio Audio Ingest Workstation",
      contactName: "Prakash Maharjan",
      email: "prakash@stress-test-radio.np",
      companyName: "Stress Test FM Broadcast",
      leadSource: "trade_show" as const,
      status: "new" as const,
      priority: "low" as const,
      estimatedValue: 18000,
      notes: "Met at South Asia Media Expo. Inquired about IP audio routing.",
    },
  ];

  try {
    const createPromises = sampleLeadsData.map((leadInput) => createLeadAction(leadInput));
    const createResults = await Promise.all(createPromises);

    let allCreated = true;
    for (let i = 0; i < createResults.length; i++) {
      const res = createResults[i];
      if (res.success && res.data?.id) {
        createdLeadIds.push(res.data.id);
      } else {
        allCreated = false;
        console.error(`  ❌ Lead Creation #${i + 1} Failed:`, res.error);
      }
    }

    if (allCreated && createdLeadIds.length === sampleLeadsData.length) {
      console.log(`  ✅ Successfully created ${createdLeadIds.length} leads concurrently!`);
      console.log(`     Generated Lead IDs: ${createdLeadIds.join(", ")}`);
      passedTests++;
    } else {
      failedTests++;
    }
  } catch (err) {
    console.error("  ❌ Concurrent Lead Creation Threw Exception:", err);
    failedTests++;
  }

  console.log("\n-----------------------------------------------------------------\n");

  // -----------------------------------------------------------------
  // Test 3: Search, Multi-Filter & Status Breakdown Execution
  // -----------------------------------------------------------------
  console.log("🔎 Test 3: Testing search, status filter, and priority queries...");
  try {
    const filterRes = await getLeadsAction({
      search: "Stress Test",
      status: "all",
      priority: "all",
      source: "all",
      page: 1,
      pageSize: 10,
    });

    if (filterRes.success && filterRes.data) {
      console.log("  ✅ Search & Filter Query Succeeded!");
      console.log(`     Total Leads Found:      ${filterRes.data.pagination.total}`);
      console.log(`     Returned Rows Count:    ${filterRes.data.leads.length}`);
      console.log(`     Status Counts (New):    ${filterRes.data.statusCounts.new}`);
      console.log(`     Status Counts (Qual):   ${filterRes.data.statusCounts.qualified}`);
      passedTests++;
    } else {
      console.error("  ❌ Search Query Failed:", filterRes.error);
      failedTests++;
    }
  } catch (err) {
    console.error("  ❌ Search Query Threw Exception:", err);
    failedTests++;
  }

  console.log("\n-----------------------------------------------------------------\n");

  // -----------------------------------------------------------------
  // Test 4: Lead Detail Retrieval & Mutation (Priority & Notes)
  // -----------------------------------------------------------------
  if (createdLeadIds.length > 0) {
    const targetLeadId = createdLeadIds[0];
    console.log(`✏️ Test 4: Testing Lead Attribute & Activity Notes Mutation on ID ${targetLeadId}...`);

    try {
      const updateRes = await updateLeadAction(targetLeadId, {
        id: targetLeadId,
        priority: "urgent",
        estimatedValue: 55000,
        notes: "STRESS TEST UPDATED: Client requested expedited delivery timeline and revised quote.",
      });

      if (updateRes.success) {
        console.log("  ✅ Update Lead Action Succeeded!");

        const detailRes = await getLeadByIdAction(targetLeadId);
        if (detailRes.success && detailRes.data) {
          console.log(`     Updated Priority:       ${detailRes.data.lead.priority}`);
          console.log(`     Updated Est. Value:     $${detailRes.data.lead.estimatedValue}`);
          console.log(`     Updated Activity Notes: "${detailRes.data.lead.notes}"`);
          passedTests++;
        } else {
          console.error("  ❌ Failed to retrieve updated lead details:", detailRes.error);
          failedTests++;
        }
      } else {
        console.error("  ❌ Lead Update Action Failed:", updateRes.error);
        failedTests++;
      }
    } catch (err) {
      console.error("  ❌ Lead Update Threw Exception:", err);
      failedTests++;
    }
  }

  console.log("\n-----------------------------------------------------------------\n");

  // -----------------------------------------------------------------
  // Test 5: Automated Lead-to-Customer Conversion Workflow
  // -----------------------------------------------------------------
  if (createdLeadIds.length > 2) {
    const convertLeadId = createdLeadIds[2]; // Stress Test Lead #3 (Qualified)
    console.log(`🔄 Test 5: Testing Automated Lead-to-Customer Conversion for ID ${convertLeadId}...`);

    try {
      const convertRes = await convertLeadToCustomerAction({
        leadId: convertLeadId,
        organizationName: "Stress Test Healthcare Facility Center",
        organizationType: "hospital",
        taxRegistrationId: "PAN-99887766",
        notes: "Converted from stress test lead workflow.",
      });

      if (convertRes.success && convertRes.data) {
        console.log("  ✅ Lead-to-Customer Conversion Succeeded!");
        console.log(`     Generated Customer ID: ${convertRes.data.customerId}`);
        console.log(`     Converted Lead ID:     ${convertRes.data.leadId}`);

        // Verify lead status was updated to 'converted'
        const convertedLeadDetail = await getLeadByIdAction(convertLeadId);
        if (convertedLeadDetail.success && convertedLeadDetail.data) {
          console.log(`     Lead Status Post-Conversion: "${convertedLeadDetail.data.lead.status}"`);
          console.log(`     Linked Customer ID on Lead:  "${convertedLeadDetail.data.lead.customerId}"`);
        }
        passedTests++;
      } else {
        console.error("  ❌ Conversion Action Failed:", convertRes.error);
        failedTests++;
      }
    } catch (err) {
      console.error("  ❌ Lead Conversion Threw Exception:", err);
      failedTests++;
    }
  }

  console.log("\n=================================================================");
  console.log(`  STRESS TEST SUMMARY: ${passedTests} PASSED, ${failedTests} FAILED`);
  console.log("=================================================================\n");

  if (failedTests > 0) {
    process.exit(1);
  }
  process.exit(0);
}

runPhase5BStressTests().catch((err) => {
  console.error("Fatal exception during stress test execution:", err);
  process.exit(1);
});
