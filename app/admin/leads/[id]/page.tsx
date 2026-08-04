import { notFound } from "next/navigation";
import { getLeadByIdAction } from "@/actions/lead";
import { LeadDetailClient } from "@/components/admin/leads/lead-detail-client";

export const metadata = {
  title: "Lead Workflow & Detail Overview | Black Swan Admin",
  description: "Detailed sales lead overview, qualification notes, transaction history, and customer conversion.",
};

interface LeadDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AdminLeadDetailPage({ params }: LeadDetailPageProps) {
  const { id } = await params;

  const res = await getLeadByIdAction(id);

  if (!res.success || !res.data) {
    notFound();
  }

  return <LeadDetailClient data={res.data} />;
}
