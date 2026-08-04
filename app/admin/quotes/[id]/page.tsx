import { notFound } from "next/navigation";

import { getProposalVersionsAction } from "@/actions/proposal";
import { getAdminQuoteDetailAction } from "@/actions/quote-admin";
import { QuoteWorkbench } from "@/components/admin/quotes/quote-workbench";
import { requireAdminAuth } from "@/lib/admin-auth";
import { generatePageMetadata } from "@/lib/seo";

export const metadata = generatePageMetadata({
  title: "Admin Quotation Workbench | Admin Portal",
  description: "Interactive line-item pricing workbench, status stepper, and proposal PDF generator.",
  path: "/admin/quotes",
});

interface QuoteWorkbenchPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AdminQuoteWorkbenchPage({ params }: QuoteWorkbenchPageProps) {
  await requireAdminAuth();
  const { id } = await params;

  const [res, versionsRes] = await Promise.all([
    getAdminQuoteDetailAction(id),
    getProposalVersionsAction(id),
  ]);

  if (!res.success || !res.data) {
    notFound();
  }

  const initialVersions = versionsRes.success && versionsRes.data ? versionsRes.data : [];

  return (
    <div className="space-y-6 pb-16">
      <QuoteWorkbench data={res.data} initialVersions={initialVersions} />
    </div>
  );
}

