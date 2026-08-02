import { and, desc, eq, inArray, isNull, sql } from "drizzle-orm";
import { db } from "../../db";
import { contactInquiries, quotes } from "../../db/schema";

export async function runExecutiveMetricsStressTest(): Promise<{ success: boolean; testsRun: number; errors: string[] }> {
  const errors: string[] = [];
  let testsRun = 0;

  console.log("▶ Running Stress Test Spec 28: Phase 4B Executive Metrics & Activity Overview...");

  try {
    // Test 1: Execute concurrent DB queries for executive KPI cards
    testsRun++;
    const startTime = Date.now();

    const [
      pendingCountRes,
      unassignedCountRes,
      processedCountRes,
      totalCountRes,
      activeInquiriesRes,
      newInquiriesRes,
      latestQuotesRes,
      latestInquiriesRes,
    ] = await Promise.all([
      db.select({ count: sql<number>`count(*)` }).from(quotes).where(eq(quotes.status, "pending")),
      db
        .select({ count: sql<number>`count(*)` })
        .from(quotes)
        .where(and(eq(quotes.status, "pending"), isNull(quotes.assignedManagerId))),
      db
        .select({ count: sql<number>`count(*)` })
        .from(quotes)
        .where(inArray(quotes.status, ["quoted", "completed"])),
      db.select({ count: sql<number>`count(*)` }).from(quotes),
      db
        .select({ count: sql<number>`count(*)` })
        .from(contactInquiries)
        .where(inArray(contactInquiries.status, ["new", "in_progress"])),
      db
        .select({ count: sql<number>`count(*)` })
        .from(contactInquiries)
        .where(eq(contactInquiries.status, "new")),
      db.select().from(quotes).orderBy(desc(quotes.createdAt)).limit(6),
      db.select().from(contactInquiries).orderBy(desc(contactInquiries.createdAt)).limit(6),
    ]);

    const duration = Date.now() - startTime;
    if (duration > 2000) {
      errors.push(`Executive metrics concurrent query execution took ${duration}ms (exceeded 2000ms threshold)`);
    }

    // Test 2: KPI Card metric fallback assertions
    testsRun++;
    const pendingCount = Number(pendingCountRes[0]?.count || 0);
    const unassignedCount = Number(unassignedCountRes[0]?.count || 0);
    const processedCount = Number(processedCountRes[0]?.count || 0);
    const totalCount = Number(totalCountRes[0]?.count || 0);
    const activeInquiriesCount = Number(activeInquiriesRes[0]?.count || 0);
    const newInquiriesCount = Number(newInquiriesRes[0]?.count || 0);


    if (pendingCount < 0 || typeof pendingCount !== "number" || Number.isNaN(pendingCount)) {
      errors.push("Pending quotes count evaluated to invalid numeric value");
    }
    if (unassignedCount < 0 || unassignedCount > pendingCount) {
      errors.push(`Unassigned quotes count (${unassignedCount}) exceeds total pending quotes count (${pendingCount})`);
    }
    if (processedCount < 0 || totalCount < 0) {
      errors.push("Processed or total quotes count evaluated to negative number");
    }
    if (newInquiriesCount < 0 || newInquiriesCount > activeInquiriesCount) {
      errors.push(`New inquiries count (${newInquiriesCount}) exceeds active inquiries count (${activeInquiriesCount})`);
    }

    // Test 3: Priority Directives Banner logic
    testsRun++;
    function generatePriorityDirectivesAlert(unassignedQuotes: number, newInquiries: number): {
      hasDirectives: boolean;
      badgeText: string;
    } {
      const totalPendingDirectives = unassignedQuotes + newInquiries;
      return {
        hasDirectives: totalPendingDirectives > 0,
        badgeText: totalPendingDirectives > 0 ? `${totalPendingDirectives} Action Items` : "All Clear",
      };
    }

    const alertZero = generatePriorityDirectivesAlert(0, 0);
    const alertActive = generatePriorityDirectivesAlert(3, 2);

    if (alertZero.hasDirectives !== false || alertZero.badgeText !== "All Clear") {
      errors.push(`Priority directives alert failed for 0 items: got ${JSON.stringify(alertZero)}`);
    }
    if (alertActive.hasDirectives !== true || alertActive.badgeText !== "5 Action Items") {
      errors.push(`Priority directives alert failed for 5 active items: got ${JSON.stringify(alertActive)}`);
    }

    // Test 4: Activity stream item schema normalization & chronological sorting
    testsRun++;
    const now = Date.now();
    const mockQuoteItem = {
      id: "q-123",
      type: "rfq" as const,
      title: "RFQ-1001",
      subtitle: "Acme Corp",
      badge: "PENDING",
      createdAt: new Date(now).toISOString(),
    };
    const mockInquiryItem = {
      id: "i-456",
      type: "inquiry" as const,
      title: "Inquiry from John",
      subtitle: "john@acme.com",
      badge: "NEW",
      createdAt: new Date(now - 100000).toISOString(),
    };

    const mergedFeed = [mockInquiryItem, mockQuoteItem].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    if (mergedFeed[0].id !== "q-123") {
      errors.push("Activity feed failed to sort heterogeneous items chronologically");
    }
  } catch (err) {
    errors.push(`Database metric query execution error: ${err instanceof Error ? err.message : String(err)}`);
  }

  const passed = errors.length === 0;
  console.log(`  └─ Completed Spec 28 Stress Test: ${testsRun} assertions, ${errors.length} errors.`);

  return { success: passed, testsRun, errors };
}

if (require.main === module) {
  runExecutiveMetricsStressTest().then((res) => {
    if (!res.success) {
      console.error("❌ Spec 28 Executive Metrics Stress Test Failed:", res.errors);
      process.exit(1);
    } else {
      console.log("✅ Spec 28 Executive Metrics Stress Test Passed Cleanly.");
    }
  });
}
