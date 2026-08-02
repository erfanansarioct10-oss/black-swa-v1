import {
  adminSearchAction,
  assignQuoteToSelfAction,
  getAdminNotificationsAction,
  updateInquiryStatusAction,
} from "../../actions/admin";

export async function runCommandCenterDiagnosticsStressTest(): Promise<{ success: boolean; testsRun: number; errors: string[] }> {
  const errors: string[] = [];
  let testsRun = 0;

  console.log("▶ Running Stress Test Spec 32: Phase 4D Command Center & Diagnostics...");

  // Set explicit dev bypass environment for server action execution
  const origDevBypass = process.env.ADMIN_DEV_BYPASS;
  process.env.ADMIN_DEV_BYPASS = "true";

  try {
    // Test 1: Search query payload fuzzing (Short inputs, SQL Injection, XSS payloads, Unicode strings)
    testsRun++;
    const shortSearch = await adminSearchAction("a");
    if (!shortSearch.success || shortSearch.data?.quotes.length !== 0) {
      errors.push("Short search query (<2 chars) failed to return empty dataset instantly");
    }

    const emptySearch = await adminSearchAction("");
    if (!emptySearch.success || emptySearch.data?.quotes.length !== 0) {
      errors.push("Empty search query failed to return empty dataset instantly");
    }

    const sqliSearch = await adminSearchAction("' OR '1'='1 --");
    if (!sqliSearch.success) {
      errors.push(`SQL injection payload error: ${sqliSearch.error}`);
    }

    const xssSearch = await adminSearchAction("<script>alert('xss')</script>");
    if (!xssSearch.success) {
      errors.push(`XSS search payload error: ${xssSearch.error}`);
    }

    const longSearch = await adminSearchAction("A".repeat(600));
    if (!longSearch.success) {
      errors.push(`Extreme length search payload error: ${longSearch.error}`);
    }

    // Test 2: Executive Notification Center Data retrieval
    testsRun++;
    const notifications = await getAdminNotificationsAction();
    if (!notifications.success || !notifications.data) {
      errors.push(`Failed to retrieve admin notification drawer data: ${notifications.error}`);
    } else {
      const { totalUnread, unassignedQuotesCount, newInquiriesCount, items } = notifications.data;
      if (typeof totalUnread !== "number" || totalUnread < 0) {
        errors.push("Total unread notifications count is invalid");
      }
      if (unassignedQuotesCount + newInquiriesCount !== totalUnread) {
        errors.push(`Notification count discrepancy: unassigned (${unassignedQuotesCount}) + new (${newInquiriesCount}) != total (${totalUnread})`);
      }
      if (items.length > totalUnread) {
        errors.push("Returned notification items count exceeds totalUnread");
      }
    }

    // Test 3: Double Quote Assignment Race Condition & Atomic Update Resilience
    testsRun++;
    const nonExistentId = "00000000-0000-0000-0000-000000000000";
    const assignResult = await assignQuoteToSelfAction(nonExistentId);
    if (assignResult.success) {
      errors.push("Assigning non-existent quote returned success: expected failure due to atomic isNull filter");
    }

    // Test 4: Inquiry Status Mutation Validation across enum states
    testsRun++;
    const validStatuses = ["new", "in_progress", "resolved", "archived"] as const;
    for (const status of validStatuses) {
      const updateResult = await updateInquiryStatusAction(nonExistentId, status);
      if (!updateResult.success) {
        errors.push(`Failed status update mutation for status '${status}'`);
      }
    }
  } catch (err) {
    errors.push(`Command center server action error: ${err instanceof Error ? err.message : String(err)}`);
  } finally {
    process.env.ADMIN_DEV_BYPASS = origDevBypass;
  }

  const passed = errors.length === 0;
  console.log(`  └─ Completed Spec 32 Stress Test: ${testsRun} assertions, ${errors.length} errors.`);

  return { success: passed, testsRun, errors };
}

if (require.main === module) {
  runCommandCenterDiagnosticsStressTest().then((res) => {
    if (!res.success) {
      console.error("❌ Spec 32 Command Center Stress Test Failed:", res.errors);
      process.exit(1);
    } else {
      console.log("✅ Spec 32 Command Center Stress Test Passed Cleanly.");
    }
  });
}
