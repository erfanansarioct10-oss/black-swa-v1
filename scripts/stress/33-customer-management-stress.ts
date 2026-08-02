import {
  createCustomerAction,
  deleteCustomerAction,
  getCustomerByIdAction,
  getCustomersAction,
  getCustomerStatsAction,
  updateCustomerAction,
} from "../../actions/customer";

export async function runCustomerManagementStressTest(): Promise<{ success: boolean; testsRun: number; errors: string[] }> {
  const errors: string[] = [];
  let testsRun = 0;

  console.log("▶ Running Stress Test Spec 33: Phase 5A Customer Management Core...");

  const origDevBypass = process.env.ADMIN_DEV_BYPASS;
  process.env.ADMIN_DEV_BYPASS = "true";

  try {
    // Test 1: Stats & Overview Metrics Retrieval
    testsRun++;
    const statsResult = await getCustomerStatsAction();
    if (!statsResult.success || !statsResult.data) {
      errors.push(`Failed to retrieve customer stats: ${statsResult.error}`);
    } else {
      const { totalAccounts, healthcareClients, broadcastNetworks, activeProspects } = statsResult.data;
      if (typeof totalAccounts !== "number" || totalAccounts < 0) {
        errors.push("Invalid totalAccounts in customer stats");
      }
      if (typeof healthcareClients !== "number" || healthcareClients < 0) {
        errors.push("Invalid healthcareClients in customer stats");
      }
      if (typeof broadcastNetworks !== "number" || broadcastNetworks < 0) {
        errors.push("Invalid broadcastNetworks in customer stats");
      }
      if (typeof activeProspects !== "number" || activeProspects < 0) {
        errors.push("Invalid activeProspects in customer stats");
      }
    }

    // Test 2: Search Filter Payload Fuzzing (SQLi, XSS, Unicode, Extreme Lengths)
    testsRun++;
    const sqliSearch = await getCustomersAction({ query: "' OR '1'='1 --", page: 1, pageSize: 10 });
    if (!sqliSearch.success) {
      errors.push(`SQL injection query payload failed: ${sqliSearch.error}`);
    }

    const xssSearch = await getCustomersAction({ query: "<script>alert('xss')</script>", page: 1, pageSize: 10 });
    if (!xssSearch.success) {
      errors.push(`XSS search query payload failed: ${xssSearch.error}`);
    }

    const longSearch = await getCustomersAction({ query: "A".repeat(500), page: 1, pageSize: 10 });
    if (!longSearch.success) {
      errors.push(`Long search query payload failed: ${longSearch.error}`);
    }

    // Test 3: Pagination & Enum Filter Bounds
    testsRun++;
    const hospitalFilter = await getCustomersAction({ organizationType: "hospital", page: 1, pageSize: 5 });
    if (!hospitalFilter.success || !hospitalFilter.data) {
      errors.push(`Hospital organization filter failed: ${hospitalFilter.error}`);
    }

    const activeFilter = await getCustomersAction({ status: "active", page: 1, pageSize: 10 });
    if (!activeFilter.success || !activeFilter.data) {
      errors.push(`Active status filter failed: ${activeFilter.error}`);
    }

    // Test 4: Customer Creation, Retrieval, Update, and Archival Lifecycle
    testsRun++;
    const uniqueEmail = `stress.test.${Date.now()}@example.com`;
    const createPayload = {
      organizationName: "Stress Test Medical Facility",
      organizationType: "hospital" as const,
      primaryContactName: "Dr. Stress Tester",
      primaryContactEmail: uniqueEmail,
      primaryContactPhone: "+977-9800000000",
      address: "123 Healthcare Way",
      city: "Kathmandu",
      country: "Nepal",
      taxRegistrationId: "TAX-12345678",
      leadSource: "website_rfq" as const,
      status: "lead" as const,
      notes: "Initial stress test account payload.",
    };

    const createResult = await createCustomerAction(createPayload);
    if (!createResult.success || !createResult.data) {
      errors.push(`Failed to create customer account: ${createResult.error}`);
    } else {
      const createdId = createResult.data.id;

      // Retrieve created customer profile detail
      const detailResult = await getCustomerByIdAction(createdId);
      if (!detailResult.success || !detailResult.data) {
        errors.push(`Failed to retrieve created customer profile: ${detailResult.error}`);
      } else {
        if (detailResult.data.customer.primaryContactEmail !== uniqueEmail) {
          errors.push(`Created email mismatch: expected ${uniqueEmail}, got ${detailResult.data.customer.primaryContactEmail}`);
        }
      }

      // Update customer record
      const updateResult = await updateCustomerAction({
        id: createdId,
        organizationName: "Stress Test Medical Facility (Updated)",
        status: "active",
      });
      if (!updateResult.success) {
        errors.push(`Failed to update customer account: ${updateResult.error}`);
      }

      // Soft delete (archive) customer record
      const deleteResult = await deleteCustomerAction(createdId);
      if (!deleteResult.success) {
        errors.push(`Failed to archive customer account: ${deleteResult.error}`);
      }
    }

    // Test 5: Non-Existent Customer Lookup Handling
    testsRun++;
    const nonExistentId = "00000000-0000-0000-0000-000000000000";
    const invalidLookup = await getCustomerByIdAction(nonExistentId);
    if (invalidLookup.success) {
      errors.push("Non-existent customer lookup returned success, expected failure");
    }

  } catch (err) {
    errors.push(`Customer management stress test error: ${err instanceof Error ? err.message : String(err)}`);
  } finally {
    if (origDevBypass === undefined) {
      delete process.env.ADMIN_DEV_BYPASS;
    } else {
      process.env.ADMIN_DEV_BYPASS = origDevBypass;
    }
  }


  const passed = errors.length === 0;
  console.log(`  └─ Completed Spec 33 Stress Test: ${testsRun} assertions, ${errors.length} errors.`);

  return { success: passed, testsRun, errors };
}

if (require.main === module) {
  runCustomerManagementStressTest().then((res) => {
    if (!res.success) {
      console.error("❌ Spec 33 Customer Management Stress Test Failed:", res.errors);
      process.exit(1);
    } else {
      console.log("✅ Spec 33 Customer Management Stress Test Passed Cleanly.");
    }
  });
}
