/**
 * Integration Test Script for Phase 4D: Command Center, Quick Search & System Health Monitor
 * 
 * Usage:
 *   pnpm run test:phase4d
 */

import Module from "module";
import process from "process";

// Mock Next.js 'server-only' package so server actions can execute in node CLI
const originalRequire = Module.prototype.require;
// @ts-ignore overriding require for CLI test execution
Module.prototype.require = function (id: string) {
  if (id === "server-only") {
    return {};
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return originalRequire.apply(this, arguments as any);
};

// Set environment flags for development testing bypass
process.env.ADMIN_DEV_BYPASS = "true";
(process.env as Record<string, string>).NODE_ENV = "development";


async function runPhase4DTests() {
  console.log("=================================================");
  console.log("  BLACK SWAN V1 — PHASE 4D INTEGRATION TEST SUITE ");
  console.log("=================================================\n");

  let passedTests = 0;
  let failedTests = 0;

  // Dynamically import server actions after environment variables and module mocks are set
  const {
    adminSearchAction,
    getAdminNotificationsAction,
    assignQuoteToSelfAction,
    updateInquiryStatusAction,
  } = await import("../actions/admin");

  // -------------------------------------------------------------
  // Test 1: Unread Executive Notifications Drawer
  // -------------------------------------------------------------
  console.log("🔔 Test 1: Testing getAdminNotificationsAction()...");
  try {
    const notifResult = await getAdminNotificationsAction();
    if (notifResult.success && notifResult.data) {
      console.log("  ✅ Notifications Query Succeeded!");
      console.log(`     Total Unread Directives: ${notifResult.data.totalUnread}`);
      console.log(`     Unassigned RFQs Count:   ${notifResult.data.unassignedQuotesCount}`);
      console.log(`     New Inquiries Count:     ${notifResult.data.newInquiriesCount}`);
      if (notifResult.data.items.length > 0) {
        console.log("     Sample Notification Item:");
        console.log(`       - [${notifResult.data.items[0].type.toUpperCase()}] ${notifResult.data.items[0].title}`);
      }
      passedTests++;
    } else {
      console.error("  ❌ Notifications Query Failed:", notifResult.error);
      failedTests++;
    }
  } catch (err) {
    console.error("  ❌ Notifications Query Threw Error:", err);
    failedTests++;
  }

  console.log("\n-------------------------------------------------\n");

  // -------------------------------------------------------------
  // Test 2: Global Admin Quick Search
  // -------------------------------------------------------------
  console.log("🔎 Test 2: Testing adminSearchAction()...");

  try {
    const searchResult = await adminSearchAction("RFQ");
    if (searchResult.success && searchResult.data) {
      console.log("  ✅ Quick Search Succeeded!");
      console.log(`     Matching RFQs Found:      ${searchResult.data.quotes.length}`);
      console.log(`     Matching Inquiries Found: ${searchResult.data.inquiries.length}`);
      passedTests++;
    } else {
      console.error("  ❌ Quick Search Failed:", searchResult.error);
      failedTests++;
    }
  } catch (err) {
    console.error("  ❌ Quick Search Threw Error:", err);
    failedTests++;
  }

  console.log("\n-------------------------------------------------\n");

  // -------------------------------------------------------------
  // Test 3: Quote Assignment Guard on Already Assigned Quote
  // -------------------------------------------------------------
  console.log("🔒 Test 3: Testing assignQuoteToSelfAction() guard on invalid/already-assigned ID...");
  try {
    const invalidAssignResult = await assignQuoteToSelfAction("00000000-0000-0000-0000-000000000000");
    if (!invalidAssignResult.success && invalidAssignResult.error) {
      console.log("  ✅ Assignment Guard Succeeded!");
      console.log(`     Rejection Message: "${invalidAssignResult.error}"`);
      passedTests++;
    } else {
      console.error("  ❌ Assignment Guard Failed: Allowed invalid assignment.");
      failedTests++;
    }
  } catch (err) {
    console.error("  ❌ Assignment Guard Threw Error:", err);
    failedTests++;
  }

  console.log("\n=================================================");
  console.log(`  TEST RESULTS: ${passedTests} PASSED, ${failedTests} FAILED`);
  console.log("=================================================\n");

  if (failedTests > 0) {
    process.exit(1);
  }
  process.exit(0);
}

runPhase4DTests().catch((err) => {
  console.error("Fatal error during test execution:", err);
  process.exit(1);
});
