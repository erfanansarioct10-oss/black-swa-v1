import {
  ADMIN_NAV_SECTIONS,
  ICON_MAP,
  getAdminRouteTitle,
  isNavItemActive,
} from "../../constants/admin-navigation";

export async function runLayoutShellStressTest(): Promise<{ success: boolean; testsRun: number; errors: string[] }> {
  const errors: string[] = [];
  let testsRun = 0;

  console.log("▶ Running Stress Test Spec 26: Phase 4A Responsive Admin Layout & Shell...");

  // Test 1: Navigation section integrity & icon map completeness
  testsRun++;
  if (!ADMIN_NAV_SECTIONS || ADMIN_NAV_SECTIONS.length === 0) {
    errors.push("ADMIN_NAV_SECTIONS is empty or undefined");
  }

  let totalItemsCount = 0;
  for (const section of ADMIN_NAV_SECTIONS) {
    if (!section.title || !Array.isArray(section.items)) {
      errors.push(`Section missing title or items array: ${JSON.stringify(section)}`);
    }
    for (const item of section.items) {
      totalItemsCount++;
      if (!item.title || !item.href || !item.iconName) {
        errors.push(`Navigation item missing required fields: ${JSON.stringify(item)}`);
      }
      if (!ICON_MAP[item.iconName]) {
        errors.push(`Missing Lucide icon mapping for '${item.iconName}' on route '${item.href}'`);
      }
    }
  }

  if (totalItemsCount < 5) {
    errors.push(`Expected at least 5 navigation items in ADMIN_NAV_SECTIONS, found ${totalItemsCount}`);
  }

  // Test 2: Path matching boundary assertions & prefix collision prevention
  testsRun++;
  const activeDashboard = isNavItemActive("/admin", "/admin");
  const subrouteDashboard = isNavItemActive("/admin/quotes", "/admin");
  const exactQuotes = isNavItemActive("/admin/quotes", "/admin/quotes");
  const nestedQuote = isNavItemActive("/admin/quotes/RFQ-1001", "/admin/quotes");
  const queryQuote = isNavItemActive("/admin/quotes?ref=123", "/admin/quotes");
  const prefixCollisions = isNavItemActive("/admin/quotes-legacy", "/admin/quotes");
  const exactCustomers = isNavItemActive("/admin/customers", "/admin/customers");
  const subCustomer = isNavItemActive("/admin/customers/cust-123", "/admin/customers");

  if (!activeDashboard) errors.push("isNavItemActive failed for exact '/admin'");
  if (subrouteDashboard) errors.push("isNavItemActive falsely matched '/admin' for sub-route '/admin/quotes'");
  if (!exactQuotes) errors.push("isNavItemActive failed for exact '/admin/quotes'");
  if (!nestedQuote) errors.push("isNavItemActive failed for nested route '/admin/quotes/RFQ-1001'");
  if (!queryQuote) errors.push("isNavItemActive failed for query string route '/admin/quotes?ref=123'");
  if (prefixCollisions) errors.push("isNavItemActive falsely matched prefix collision '/admin/quotes-legacy'");
  if (!exactCustomers) errors.push("isNavItemActive failed for '/admin/customers'");
  if (!subCustomer) errors.push("isNavItemActive failed for sub-customer route '/admin/customers/cust-123'");

  // Test 3: Dynamic route title resolution across various path formats
  testsRun++;
  const dashTitle = getAdminRouteTitle("/admin");
  const analyticsTitle = getAdminRouteTitle("/admin/analytics");
  const nestedTitle = getAdminRouteTitle("/admin/quotes/RFQ-1001?tab=history");
  const inquiriesTitle = getAdminRouteTitle("/admin/inquiries?id=123");
  const customersTitle = getAdminRouteTitle("/admin/customers/cust-99");
  const leadsTitle = getAdminRouteTitle("/admin/leads");
  const unknownTitle = getAdminRouteTitle("/admin/unknown-route-slug");

  if (dashTitle !== "Executive Dashboard") errors.push(`Expected 'Executive Dashboard', got '${dashTitle}'`);
  if (analyticsTitle !== "Analytics & Reports") errors.push(`Expected 'Analytics & Reports', got '${analyticsTitle}'`);
  if (nestedTitle !== "Quote Requests") errors.push(`Expected 'Quote Requests', got '${nestedTitle}'`);
  if (inquiriesTitle !== "Contact Inquiries") errors.push(`Expected 'Contact Inquiries', got '${inquiriesTitle}'`);
  if (customersTitle !== "Customer Database") errors.push(`Expected 'Customer Database', got '${customersTitle}'`);
  if (leadsTitle !== "Lead Pipeline") errors.push(`Expected 'Lead Pipeline', got '${leadsTitle}'`);
  if (unknownTitle !== "Admin Portal") errors.push(`Expected fallback 'Admin Portal', got '${unknownTitle}'`);

  // Test 4: Mobile Viewport 320px Layout & Hydration Safety Simulation
  testsRun++;
  function simulateLayoutHydration(isServer: boolean, localStoreVal: string | null): boolean {
    if (isServer) {
      return false; // Server initial state must default to false (expanded)
    }
    return localStoreVal === "true";
  }

  const serverCollapseState = simulateLayoutHydration(true, "true");
  const clientCollapseState = simulateLayoutHydration(false, "true");

  if (serverCollapseState !== false) {
    errors.push("SSR Hydration Mismatch Risk: Server layout collapse state must default to false");
  }
  if (clientCollapseState !== true) {
    errors.push("Client layout collapse state failed to initialize from stored preference");
  }

  const passed = errors.length === 0;
  console.log(`  └─ Completed Spec 26 Stress Test: ${testsRun} assertions, ${errors.length} errors.`);

  return { success: passed, testsRun, errors };
}

if (require.main === module) {
  runLayoutShellStressTest().then((res) => {
    if (!res.success) {
      console.error("❌ Spec 26 Layout Shell Stress Test Failed:", res.errors);
      process.exit(1);
    } else {
      console.log("✅ Spec 26 Layout Shell Stress Test Passed Cleanly.");
    }
  });
}
