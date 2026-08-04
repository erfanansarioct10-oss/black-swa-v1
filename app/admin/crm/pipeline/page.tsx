import { getPipelineDataAction } from "@/actions/pipeline";
import { PipelineKanban } from "@/components/admin/crm/pipeline-kanban";
import { requireAdminAuth } from "@/lib/admin-auth";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sales Pipeline Kanban | Admin Portal | Black Swan",
  description: "Interactive B2B sales pipeline Kanban board with live valuation and SLA stale lead monitoring.",
};

export const dynamic = "force-dynamic";

export default async function SalesPipelinePage() {
  await requireAdminAuth();

  const res = await getPipelineDataAction();

  if (!res.success || !res.data) {
    return (
      <div className="flex h-64 items-center justify-center rounded-lg border border-dashed p-6 text-center">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Failed to load Sales Pipeline</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {res.error || "An error occurred while building the pipeline Kanban view."}
          </p>
        </div>
      </div>
    );
  }

  return <PipelineKanban initialData={res.data} />;
}
