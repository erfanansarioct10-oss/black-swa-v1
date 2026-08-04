import {
  convertLeadToCustomerAction,
  createLeadAction,
  getLeadByIdAction,
  getLeadsAction,
  getLeadStatsAction,
  updateLeadAction,
} from "../../actions/lead";

export async function runLeadManagementStressTest(): Promise<{ success: boolean; testsRun: number; errors: string[] }> {
  const errors: string[] = [];
  let testsRun = 0;

  console.log("▶ Running Stress Test Spec 34: Phase 5B Lead Management & Inquiry Processing...");

  const origDevBypass = process.env.ADMIN_DEV_BYPASS;
  process.env.ADMIN_DEV_BYPASS = "true";

  try {
    // Test 1: Lead KPI Stats Retrieval & Aggregation Bounds
    testsRun++;
    const statsResult = await getLeadStatsAction();
    if (!statsResult.success || !statsResult.data) {
      errors.push(`Failed to retrieve lead stats: ${statsResult.error}`);
    } else {
      const { totalLeads, newInbound, qualifiedProspects, estimatedPipelineValue } = statsResult.data;
      if (typeof totalLeads !== "number" || totalLeads < 0) {
        errors.push("Invalid totalLeads in lead stats");
      }
      if (typeof newInbound !== "number" || newInbound < 0) {
        errors.push("Invalid newInbound in lead stats");
      }
      if (typeof qualifiedProspects !== "number" || qualifiedProspects < 0) {
        errors.push("Invalid qualifiedProspects in lead stats");
      }
      if (typeof estimatedPipelineValue !== "number" || estimatedPipelineValue < 0) {
        errors.push("Invalid estimatedPipelineValue in lead stats");
      }
    }

    // Test 2: Search & Multi-Filter Query Fuzzing
    testsRun++;
    const sqliSearch = await getLeadsAction({ search: "' OR '1'='1 --", page: 1, pageSize: 10 });
    if (!sqliSearch.success) {
      errors.push(`SQL injection lead search payload failed: ${sqliSearch.error}`);
    }

    const xssSearch = await getLeadsAction({ search: "<script>alert('lead_xss')</script>", page: 1, pageSize: 10 });
    if (!xssSearch.success) {
      errors.push(`XSS lead search payload failed: ${xssSearch.error}`);
    }

    const multiFilter = await getLeadsAction({
      status: "new",
      priority: "urgent",
      source: "website_rfq",
      page: 1,
      pageSize: 5,
    });
    if (!multiFilter.success || !multiFilter.data) {
      errors.push(`Multi-filter lead query failed: ${multiFilter.error}`);
    }

    // Test 3: Lead Creation, Update & Pipeline Bounds Validation
    testsRun++;
    const uniqueLeadEmail = `lead.stress.${Date.now()}@example.com`;
    const createPayload = {
      title: "Broadcast Infrastructure Modernization Inquiry",
      contactName: "Lead Tester",
      email: uniqueLeadEmail,
      phone: "+977-9811111111",
      companyName: "Stress Test Broadcasting Ltd",
      leadSource: "website_rfq" as const,
      status: "new" as const,
      priority: "high" as const,
      estimatedValue: 250000,
      notes: "High priority lead for studio hardware expansion.",
    };

    const createResult = await createLeadAction(createPayload);
    if (!createResult.success || !createResult.data) {
      errors.push(`Failed to create lead record: ${createResult.error}`);
    } else {
      const createdLeadId = createResult.data.id;

      // Retrieve lead detail
      const detailResult = await getLeadByIdAction(createdLeadId);
      if (!detailResult.success || !detailResult.data) {
        errors.push(`Failed to retrieve lead detail by ID: ${detailResult.error}`);
      } else {
        if (detailResult.data.lead.email !== uniqueLeadEmail) {
          errors.push(`Lead email mismatch: expected ${uniqueLeadEmail}, got ${detailResult.data.lead.email}`);
        }
      }

      // Update lead state transition and manager assignment
      const updateResult = await updateLeadAction(createdLeadId, {
        status: "qualified",
        priority: "urgent",
        estimatedValue: 300000,
        assignedManagerId: "mgr_director_01",
        notes: "Qualified after technical director consultation call.",
      });
      if (!updateResult.success) {
        errors.push(`Failed to update lead record: ${updateResult.error}`);
      }

      // Test 4: Lead to Customer Conversion Workflow & Double Conversion Resilience
      testsRun++;
      const convertResult = await convertLeadToCustomerAction({
        leadId: createdLeadId,
        organizationName: "Stress Test Broadcasting Ltd",
        organizationType: "broadcast_studio",
        taxRegistrationId: "PAN-987654321",
        notes: "Converted via automated stress test suite.",
      });

      if (!convertResult.success || !convertResult.data) {
        errors.push(`Failed to convert lead to customer: ${convertResult.error}`);
      } else {
        const { customerId, leadId } = convertResult.data;
        if (leadId !== createdLeadId) {
          errors.push(`Converted leadId mismatch: expected ${createdLeadId}, got ${leadId}`);
        }
        if (!customerId) {
          errors.push("Conversion returned empty customerId");
        }

        // Test double conversion resilience
        const doubleConvertResult = await convertLeadToCustomerAction({
          leadId: createdLeadId,
          organizationName: "Stress Test Broadcasting Ltd",
          organizationType: "broadcast_studio",
          notes: "Attempting double conversion",
        });

        if (!doubleConvertResult.success) {
          errors.push(`Double conversion attempt failed unexpectedly: ${doubleConvertResult.error}`);
        } else if (doubleConvertResult.data?.customerId !== customerId) {
          errors.push("Double conversion created duplicate customer instead of matching existing customerId");
        }
      }
    }

    // Test 5: Non-Existent Lead Lookup Handling
    testsRun++;
    const nonExistentLeadId = "00000000-0000-0000-0000-000000000000";
    const invalidLookup = await getLeadByIdAction(nonExistentLeadId);
    if (invalidLookup.success) {
      errors.push("Non-existent lead lookup returned success, expected failure");
    }

  } catch (err) {
    errors.push(`Lead management stress test error: ${err instanceof Error ? err.message : String(err)}`);
  } finally {
    if (origDevBypass === undefined) {
      delete process.env.ADMIN_DEV_BYPASS;
    } else {
      process.env.ADMIN_DEV_BYPASS = origDevBypass;
    }
  }


  const passed = errors.length === 0;
  console.log(`  └─ Completed Spec 34 Stress Test: ${testsRun} assertions, ${errors.length} errors.`);

  return { success: passed, testsRun, errors };
}

if (require.main === module) {
  runLeadManagementStressTest().then((res) => {
    if (!res.success) {
      console.error("❌ Spec 34 Lead Management Stress Test Failed:", res.errors);
      process.exit(1);
    } else {
      console.log("✅ Spec 34 Lead Management Stress Test Passed Cleanly.");
    }
  });
}
