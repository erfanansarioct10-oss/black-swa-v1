/**
 * Integration & Stress Test Script for Phase 5A: Customer & Account Management Core
 * 
 * Usage:
 *   npx tsx scripts/test-phase5a-customers.ts
 */

import Module from "module";
import process from "process";
import type { CreateCustomerInput } from "../schemas/customer";

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

async function runPhase5AStressTests() {
  console.log("=================================================================");
  console.log("  BLACK SWAN V1 — PHASE 5A CUSTOMER MANAGEMENT STRESS TEST SUITE ");
  console.log("=================================================================\n");

  let passedTests = 0;
  let failedTests = 0;

  // Import customer server actions
  const {
    createCustomerAction,
    getCustomersAction,
    getCustomerByIdAction,
    updateCustomerAction,
    deleteCustomerAction,
    getCustomerStatsAction,
  } = await import("../actions/customer");

  const createdCustomerIds: string[] = [];


  // -----------------------------------------------------------------
  // Test 1: Baseline Customer KPI Stats Query
  // -----------------------------------------------------------------
  console.log("📊 Test 1: Fetching initial customer account stats...");
  try {
    const statsRes = await getCustomerStatsAction();
    if (statsRes.success && statsRes.data) {
      console.log("  ✅ Baseline Customer KPI Stats Query Succeeded!");
      console.log(`     Total Accounts:       ${statsRes.data.totalAccounts}`);
      console.log(`     Healthcare Clients:   ${statsRes.data.healthcareClients}`);
      console.log(`     Broadcast Networks:   ${statsRes.data.broadcastNetworks}`);
      console.log(`     Active Prospects:     ${statsRes.data.activeProspects}`);
      passedTests++;
    } else {
      console.error("  ❌ Baseline Customer KPI Query Failed:", statsRes.error);
      failedTests++;
    }
  } catch (err) {
    console.error("  ❌ Baseline Customer KPI Query Threw Exception:", err);
    failedTests++;
  }

  console.log("\n-----------------------------------------------------------------\n");

  // -----------------------------------------------------------------
  // Test 2: Bulk Concurrent Customer Account Creation
  // -----------------------------------------------------------------
  console.log("🚀 Test 2: Executing concurrent customer account creation test...");
  const sampleCustomers: CreateCustomerInput[] = [
    {
      organizationName: "Phase 5A Test Bir Hospital Medical Center",
      organizationType: "hospital",
      primaryContactName: "Dr. Ramesh Thapa",
      primaryContactEmail: "ramesh.thapa@phase5a-birhospital.np",
      primaryContactPhone: "+977 9851012345",
      address: "Kanti Path, Tripureshwor",
      city: "Kathmandu",
      country: "Nepal",
      taxRegistrationId: "PAN-30098214",
      leadSource: "website_rfq",
      status: "active",
      notes: "Primary tertiary healthcare facility client account.",
    },
    {
      organizationName: "Phase 5A Test Kantipur Television Network",
      organizationType: "broadcast_studio",
      primaryContactName: "Bikash Shrestha",
      primaryContactEmail: "bikash.s@phase5a-kantipur.np",
      primaryContactPhone: "+977 9801234567",
      address: "Tinkune",
      city: "Kathmandu",
      country: "Nepal",
      taxRegistrationId: "PAN-60192837",
      leadSource: "direct_inquiry",
      status: "active",
      notes: "Major HD broadcast studio client with annual playout maintenance contract.",
    },
    {
      organizationName: "Phase 5A Test Annapurna Media Network",
      organizationType: "media_network",
      primaryContactName: "Deepak Gurung",
      primaryContactEmail: "deepak.g@phase5a-annapurna.np",
      primaryContactPhone: "+977 9841122334",
      city: "Lalitpur",
      country: "Nepal",
      leadSource: "outreach",
      status: "prospect",
      notes: "Prospect interested in SDI ingest multi-channel servers.",
    },
    {
      organizationName: "Phase 5A Test Norvic International Clinic",
      organizationType: "clinic",
      primaryContactName: "Dr. Sunita Sharma",
      primaryContactEmail: "sunita.s@phase5a-norvic.np",
      city: "Kathmandu",
      country: "Nepal",
      leadSource: "referral",
      status: "active",
      notes: "Specialized cardiac clinic equipment account.",
    },
  ];


  try {
    const createPromises = sampleCustomers.map((custInput) => createCustomerAction(custInput));
    const createResults = await Promise.all(createPromises);

    let allCreated = true;
    for (let i = 0; i < createResults.length; i++) {
      const res = createResults[i];
      if (res.success && res.data?.id) {
        createdCustomerIds.push(res.data.id);
      } else {
        allCreated = false;
        console.error(`  ❌ Customer Creation #${i + 1} Failed:`, res.error);
      }
    }

    if (allCreated && createdCustomerIds.length === sampleCustomers.length) {
      console.log(`  ✅ Successfully created ${createdCustomerIds.length} customer accounts concurrently!`);
      console.log(`     Generated Customer IDs: ${createdCustomerIds.join(", ")}`);
      passedTests++;
    } else {
      failedTests++;
    }
  } catch (err) {
    console.error("  ❌ Concurrent Customer Creation Threw Exception:", err);
    failedTests++;
  }

  console.log("\n-----------------------------------------------------------------\n");

  // -----------------------------------------------------------------
  // Test 3: Search, Type Filter & Directory Pagination Query
  // -----------------------------------------------------------------
  console.log("🔎 Test 3: Testing customer directory search, type filter, and pagination...");
  try {
    const filterRes = await getCustomersAction({
      query: "Phase 5A Test",
      organizationType: "all",
      status: "all",
      page: 1,
      pageSize: 10,
    });

    if (filterRes.success && filterRes.data) {
      console.log("  ✅ Customer Directory Query Succeeded!");
      console.log(`     Total Accounts Found:   ${filterRes.data.pagination.total}`);
      console.log(`     Returned Rows Count:    ${filterRes.data.customers.length}`);
      if (filterRes.data.customers.length > 0) {
        console.log(`     Sample Account:         "${filterRes.data.customers[0].organizationName}" (${filterRes.data.customers[0].organizationType})`);
      }
      passedTests++;
    } else {
      console.error("  ❌ Customer Directory Query Failed:", filterRes.error);
      failedTests++;
    }
  } catch (err) {
    console.error("  ❌ Customer Directory Query Threw Exception:", err);
    failedTests++;
  }

  console.log("\n-----------------------------------------------------------------\n");

  // -----------------------------------------------------------------
  // Test 4: Customer Profile Retrieval & Transaction History Aggregation
  // -----------------------------------------------------------------
  if (createdCustomerIds.length > 0) {
    const targetCustId = createdCustomerIds[0];
    console.log(`👤 Test 4: Testing Customer Profile & Linked Transaction Query for ID ${targetCustId}...`);

    try {
      const detailRes = await getCustomerByIdAction(targetCustId);
      if (detailRes.success && detailRes.data) {
        console.log("  ✅ Customer Profile Query Succeeded!");
        console.log(`     Organization:           "${detailRes.data.customer.organizationName}"`);
        console.log(`     Primary Contact Email:  "${detailRes.data.customer.primaryContactEmail}"`);
        console.log(`     Linked Quotes Count:    ${detailRes.data.linkedQuotes.length}`);
        console.log(`     Linked Inquiries Count: ${detailRes.data.linkedInquiries.length}`);
        passedTests++;
      } else {
        console.error("  ❌ Customer Profile Query Failed:", detailRes.error);
        failedTests++;
      }
    } catch (err) {
      console.error("  ❌ Customer Profile Query Threw Exception:", err);
      failedTests++;
    }
  }

  console.log("\n-----------------------------------------------------------------\n");

  // -----------------------------------------------------------------
  // Test 5: Customer Profile Updates & Archiving Workflow
  // -----------------------------------------------------------------
  if (createdCustomerIds.length > 1) {
    const updateCustId = createdCustomerIds[1];
    console.log(`✏️ Test 5: Testing Customer Update & Status Mutation on ID ${updateCustId}...`);

    try {
      const updateRes = await updateCustomerAction({
        id: updateCustId,
        organizationName: "Phase 5A Test Kantipur HD Media Network",
        primaryContactPhone: "+977 9801999888",
        status: "active",
        notes: "Updated client status to active with expanded broadcast suite contract.",
      });


      if (updateRes.success) {
        console.log("  ✅ Customer Profile Update Action Succeeded!");

        const updatedProfile = await getCustomerByIdAction(updateCustId);
        if (updatedProfile.success && updatedProfile.data) {
          console.log(`     Updated Org Name:       "${updatedProfile.data.customer.organizationName}"`);
          console.log(`     Updated Phone:          "${updatedProfile.data.customer.primaryContactPhone}"`);
          console.log(`     Updated Notes:          "${updatedProfile.data.customer.notes}"`);
          passedTests++;
        } else {
          console.error("  ❌ Failed to verify updated customer profile:", updatedProfile.error);
          failedTests++;
        }
      } else {
        console.error("  ❌ Customer Update Action Failed:", updateRes.error);
        failedTests++;
      }
    } catch (err) {
      console.error("  ❌ Customer Update Threw Exception:", err);
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

runPhase5AStressTests().catch((err) => {
  console.error("Fatal exception during customer stress test execution:", err);
  process.exit(1);
});
