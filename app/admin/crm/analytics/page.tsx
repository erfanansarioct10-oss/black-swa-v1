import { getPipelineAnalyticsAction } from "@/actions/pipeline";
import { CrmAnalyticsView } from "@/components/admin/crm/crm-analytics-view";
import { requireAdminAuth } from "@/lib/admin-auth";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Executive CRM Analytics | Admin Portal | Black Swan",
  description: "Executive B2B CRM metrics, Win/Loss analytics, conversion funnels, and enterprise data exports.",
};

export const dynamic = "force-dynamic";

export default async function CrmAnalyticsPage() {
  await requireAdminAuth();

  const res = await getPipelineAnalyticsAction("30d");

  if (!res.success || !res.metrics) {
    return (
      <div className="flex h-64 items-center justify-center rounded-lg border border-dashed p-6 text-center">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Failed to load CRM Analytics</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {res.error || "An error occurred while computing executive CRM metrics."}
          </p>
        </div>
      </div>
    );
  }

  return <CrmAnalyticsView initialMetrics={res.metrics} initialHorizon="30d" />;
}
