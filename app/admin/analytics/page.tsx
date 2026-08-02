import { Suspense } from "react";
import { gte } from "drizzle-orm";

import { AnalyticsFilterBar, PresetRange } from "@/components/admin/analytics/analytics-filter-bar";
import { AnalyticsCharts, BudgetDistribution, CategoryBreakdown, TrendPoint } from "@/components/admin/analytics/analytics-charts";
import { ConversionFunnelSla, FunnelStage, SlaBreakdown } from "@/components/admin/analytics/conversion-funnel-sla";
import { ExecutiveThroughputCards, ThroughputMetrics } from "@/components/admin/analytics/executive-throughput-cards";
import { db } from "@/db";
import { quoteItems, quotes } from "@/db/schema";
import { requireAdminAuth } from "@/lib/admin-auth";
import { generatePageMetadata } from "@/lib/seo";


export const metadata = generatePageMetadata({
  title: "Executive Analytics & Insights | Admin Portal",
  description: "Advanced commercial pipeline analytics, equipment popularity, conversion funnels, and SLA response monitoring.",
  path: "/admin/analytics",
});

interface PageProps {
  searchParams: Promise<{ range?: string }>;
}

export default async function AnalyticsPage({ searchParams }: PageProps) {
  await requireAdminAuth();

  const resolvedParams = await searchParams;
  const rawRange = resolvedParams?.range as PresetRange;
  const VALID_RANGES: PresetRange[] = ["7d", "30d", "ytd", "all"];
  const rangeParam: PresetRange = VALID_RANGES.includes(rawRange) ? rawRange : "30d";

  // Calculate start date based on selected preset horizon
  const now = new Date();
  let startDate: Date | null = new Date();

  if (rangeParam === "7d") {
    startDate.setDate(now.getDate() - 7);
  } else if (rangeParam === "30d") {
    startDate.setDate(now.getDate() - 30);
  } else if (rangeParam === "ytd") {
    startDate = new Date(now.getFullYear(), 0, 1);
  } else if (rangeParam === "all") {
    startDate = null;
  }

  // Base date filter condition
  const dateFilter = startDate ? gte(quotes.createdAt, startDate) : undefined;
  const itemDateFilter = startDate ? gte(quoteItems.createdAt, startDate) : undefined;

  let throughputMetrics: ThroughputMetrics = {
    totalPipelineVolumeNpr: 0,
    totalQuotesInPeriod: 0,
    averageSlaHours: 0,
    overallConversionRate: 0,
    quotedAndCompletedCount: 0,
    topCategoryName: "N/A",
    topCategoryItemsCount: 0,
  };

  let trendPoints: TrendPoint[] = [];
  let categoryBreakdowns: CategoryBreakdown[] = [];
  let budgetDistributions: BudgetDistribution[] = [];
  let funnelStages: FunnelStage[] = [];
  let slaBreakdown: SlaBreakdown = {
    assignmentAvgHours: 0,
    quotingAvgHours: 0,
    completionAvgHours: 0,
  };

  try {
    // 1. Fetch filtered quotes
    const filteredQuotes = await db
      .select({
        status: quotes.status,
        budgetRange: quotes.budgetRange,
        createdAt: quotes.createdAt,
        updatedAt: quotes.updatedAt,
        assignedAt: quotes.assignedAt,
        assignedManagerId: quotes.assignedManagerId,
        quotedAt: quotes.quotedAt,
        completedAt: quotes.completedAt,
      })
      .from(quotes)
      .where(dateFilter);

    const totalQuotesCount = filteredQuotes.length;

    // 2. Calculate budget distribution & pipeline volume estimate
    const budgetMap = new Map<string, number>();
    let estimatedVolumeNpr = 0;

    const BUDGET_ESTIMATES: Record<string, number> = {
      "Under 1,000,000 NPR": 750000,
      "1,000,000 - 5,000,000 NPR": 3000000,
      "5,000,000 - 10,000,000 NPR": 7500000,
      "10,000,000+ NPR": 15000000,
    };

    filteredQuotes.forEach((q) => {
      const bRange = q.budgetRange || "Unspecified";
      budgetMap.set(bRange, (budgetMap.get(bRange) || 0) + 1);
      estimatedVolumeNpr += BUDGET_ESTIMATES[bRange] || 2500000;
    });

    budgetDistributions = Array.from(budgetMap.entries()).map(([range, count]) => ({
      range,
      count,
      percentage: totalQuotesCount > 0 ? (count / totalQuotesCount) * 100 : 0,
    }));

    // 3. Conversion Funnel Stages
    const submissionCount = totalQuotesCount;
    const underReviewCount = filteredQuotes.filter((q) =>
      ["under_review", "manager_assigned", "quoted", "completed"].includes(q.status)
    ).length;
    const managerAssignedCount = filteredQuotes.filter((q) =>
      ["manager_assigned", "quoted", "completed"].includes(q.status)
    ).length;
    const quotedCount = filteredQuotes.filter((q) =>
      ["quoted", "completed"].includes(q.status)
    ).length;
    const completedCount = filteredQuotes.filter((q) => q.status === "completed").length;

    funnelStages = [
      {
        stageName: "Submission",
        count: submissionCount,
        conversionPercent: 100,
        dropoffPercent: 0,
      },
      {
        stageName: "Under Review",
        count: underReviewCount,
        conversionPercent: submissionCount > 0 ? (underReviewCount / submissionCount) * 100 : 0,
        dropoffPercent: submissionCount > 0 ? ((submissionCount - underReviewCount) / submissionCount) * 100 : 0,
      },
      {
        stageName: "Manager Assigned",
        count: managerAssignedCount,
        conversionPercent: submissionCount > 0 ? (managerAssignedCount / submissionCount) * 100 : 0,
        dropoffPercent: underReviewCount > 0 ? ((underReviewCount - managerAssignedCount) / underReviewCount) * 100 : 0,
      },
      {
        stageName: "Quoted",
        count: quotedCount,
        conversionPercent: submissionCount > 0 ? (quotedCount / submissionCount) * 100 : 0,
        dropoffPercent: managerAssignedCount > 0 ? ((managerAssignedCount - quotedCount) / managerAssignedCount) * 100 : 0,
      },
      {
        stageName: "Completed / Closed",
        count: completedCount,
        conversionPercent: submissionCount > 0 ? (completedCount / submissionCount) * 100 : 0,
        dropoffPercent: quotedCount > 0 ? ((quotedCount - completedCount) / quotedCount) * 100 : 0,
      },
    ];

    // 4. SLA Response Time Calculations using measured stage timestamps
    let totalAssignmentHours = 0;
    let assignmentCount = 0;
    let totalQuotingHours = 0;
    let quotingCount = 0;
    let totalCompletionHours = 0;
    let completionCount = 0;

    filteredQuotes.forEach((q) => {
      const created = new Date(q.createdAt).getTime();

      if (q.assignedAt) {
        const diffHours = (new Date(q.assignedAt).getTime() - created) / (1000 * 60 * 60);
        totalAssignmentHours += Math.max(diffHours, 0);
        assignmentCount++;
      }
      if (q.quotedAt) {
        const diffHours = (new Date(q.quotedAt).getTime() - created) / (1000 * 60 * 60);
        totalQuotingHours += Math.max(diffHours, 0);
        quotingCount++;
      }
      if (q.completedAt) {
        const diffHours = (new Date(q.completedAt).getTime() - created) / (1000 * 60 * 60);
        totalCompletionHours += Math.max(diffHours, 0);
        completionCount++;
      }
    });

    slaBreakdown = {
      assignmentAvgHours: assignmentCount > 0 ? totalAssignmentHours / assignmentCount : 0,
      quotingAvgHours: quotingCount > 0 ? totalQuotingHours / quotingCount : 0,
      completionAvgHours: completionCount > 0 ? totalCompletionHours / completionCount : 0,
    };


    // 5. Query quote_items for Equipment Popularity
    const filteredItems = await db
      .select({
        category: quoteItems.category,
        quantity: quoteItems.quantity,
      })
      .from(quoteItems)
      .where(itemDateFilter);

    const categoryMap = new Map<string, number>();
    let totalItemsRequested = 0;

    filteredItems.forEach((item) => {
      categoryMap.set(item.category, (categoryMap.get(item.category) || 0) + item.quantity);
      totalItemsRequested += item.quantity;
    });

    categoryBreakdowns = Array.from(categoryMap.entries())
      .map(([category, count]) => ({
        category,
        count,
        percentage: totalItemsRequested > 0 ? (count / totalItemsRequested) * 100 : 0,
      }))
      .sort((a, b) => b.count - a.count);

    const topCat = categoryBreakdowns[0] || { category: "N/A", count: 0 };

    // 6. Time-Series Trend Aggregation (grouped by full ISO date & sorted chronologically)
    const trendMap = new Map<string, { date: Date; count: number }>();
    filteredQuotes.forEach((q) => {
      const d = new Date(q.createdAt);
      const isoKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      const existing = trendMap.get(isoKey);
      if (existing) {
        existing.count++;
      } else {
        trendMap.set(isoKey, { date: d, count: 1 });
      }
    });

    trendPoints = Array.from(trendMap.values())
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .map(({ date, count }) => ({
        label: `${date.getMonth() + 1}/${date.getDate()}`,
        count,
      }));

    if (trendPoints.length === 0) {
      trendPoints = [
        { label: "W1", count: 0 },
        { label: "W2", count: 0 },
        { label: "W3", count: 0 },
        { label: "W4", count: 0 },
      ];
    }

    // 7. Final Throughput Metrics
    throughputMetrics = {
      totalPipelineVolumeNpr: estimatedVolumeNpr,
      totalQuotesInPeriod: totalQuotesCount,
      averageSlaHours: slaBreakdown.assignmentAvgHours,
      overallConversionRate: totalQuotesCount > 0 ? (quotedCount / totalQuotesCount) * 100 : 0,
      quotedAndCompletedCount: quotedCount,
      topCategoryName: topCat.category,
      topCategoryItemsCount: topCat.count,
    };
  } catch (error) {
    console.error("Failed to query analytics metrics:", error);
  }

  return (
    <div className="space-y-6">
      {/* Top Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/80 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Executive Analytics &amp; Insights
            </h1>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Commercial pipeline throughput, equipment demand breakdown, conversion funnels, and SLA performance metrics.
          </p>
        </div>
      </div>

      {/* Date Range Filter Bar */}
      <Suspense fallback={<div className="h-16 bg-card border border-border rounded-xl animate-pulse" />}>
        <AnalyticsFilterBar />
      </Suspense>

      {/* Executive Throughput KPI Cards Grid */}
      <ExecutiveThroughputCards metrics={throughputMetrics} />

      {/* 5-Stage Conversion Funnel & SLA Response Performance */}
      <ConversionFunnelSla funnel={funnelStages} sla={slaBreakdown} />

      {/* RFQ Submission Trends, Category Popularity & Budget Distribution */}
      <AnalyticsCharts
        trends={trendPoints}
        categories={categoryBreakdowns}
        budgets={budgetDistributions}
      />
    </div>
  );
}
