import Link from "next/link";
import { desc, eq, sql } from "drizzle-orm";
import {
  ArrowLeft,
  Clock,
  FileText,
  Inbox,
  UserCheck,
} from "lucide-react";


import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { db } from "@/db";
import { quotes } from "@/db/schema";
import { requireAdminAuth } from "@/lib/admin-auth";
import { generatePageMetadata } from "@/lib/seo";

export const metadata = generatePageMetadata({
  title: "Commercial Quote Requests | Admin Portal",
  description: "Manage, assign, and track B2B commercial RFQ quotation requests.",
  path: "/admin/quotes",
});

interface QuotesPageProps {
  searchParams: Promise<{
    status?: string;
    ref?: string;
  }>;
}

type QuoteRecord = typeof quotes.$inferSelect;

export default async function AdminQuotesPage({ searchParams }: QuotesPageProps) {
  await requireAdminAuth();
  const { status, ref } = await searchParams;

  let allQuotes: QuoteRecord[] = [];

  let pendingCount = 0;
  let totalCount = 0;

  try {
    const [[pendingRes], [totalRes], fetchedQuotes] = await Promise.all([
      db.select({ count: sql<number>`count(*)` }).from(quotes).where(eq(quotes.status, "pending")),
      db.select({ count: sql<number>`count(*)` }).from(quotes),
      db.select().from(quotes).orderBy(desc(quotes.createdAt)).limit(50),
    ]);

    pendingCount = Number(pendingRes?.count || 0);
    totalCount = Number(totalRes?.count || 0);

    if (status) {
      allQuotes = fetchedQuotes.filter((q) => q.status === status);
    } else if (ref) {
      allQuotes = fetchedQuotes.filter((q) => q.referenceId.toLowerCase().includes(ref.toLowerCase()));
    } else {
      allQuotes = fetchedQuotes;
    }
  } catch (err) {
    console.error("Failed to fetch quotes for admin management:", err);
  }

  const getStatusBadge = (s: string) => {
    switch (s) {
      case "pending":
        return <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/30">Pending</Badge>;
      case "manager_assigned":
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/30">Assigned</Badge>;
      case "quoted":
        return <Badge variant="outline" className="bg-purple-500/10 text-purple-600 border-purple-500/30">Quoted</Badge>;
      case "completed":
        return <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30">Completed</Badge>;
      default:
        return <Badge variant="outline">{s}</Badge>;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <div>
          <div className="flex items-center gap-2">
            <Link href="/admin" className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
            </Link>
          </div>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight sm:text-3xl mt-1 flex items-center gap-2.5">
            <FileText className="w-7 h-7 text-emerald-500" />
            Commercial RFQ Management
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Review B2B quotation requests, assign account managers, and issue official proposals.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs font-mono bg-amber-500/10 text-amber-600 border-amber-500/30">
            {pendingCount} Pending Review
          </Badge>
          <Badge variant="outline" className="text-xs font-mono bg-muted text-foreground">
            {totalCount} Total RFQs
          </Badge>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 pb-2">
        <Button asChild size="sm" variant={!status ? "default" : "outline"} className="text-xs">
          <Link href="/admin/quotes">All Quotes ({totalCount})</Link>
        </Button>
        <Button asChild size="sm" variant={status === "pending" ? "default" : "outline"} className="text-xs">
          <Link href="/admin/quotes?status=pending">Pending ({pendingCount})</Link>
        </Button>
        <Button asChild size="sm" variant={status === "manager_assigned" ? "default" : "outline"} className="text-xs">
          <Link href="/admin/quotes?status=manager_assigned">Assigned</Link>
        </Button>
        <Button asChild size="sm" variant={status === "quoted" ? "default" : "outline"} className="text-xs">
          <Link href="/admin/quotes?status=quoted">Quoted</Link>
        </Button>
        <Button asChild size="sm" variant={status === "completed" ? "default" : "outline"} className="text-xs">
          <Link href="/admin/quotes?status=completed">Completed</Link>
        </Button>
      </div>

      {/* Quotes Record List */}
      <div className="bg-card border border-border rounded-xl shadow-xs overflow-hidden">
        {allQuotes.length > 0 ? (
          <div className="divide-y divide-border/60">
            {allQuotes.map((q) => (
              <div key={q.id} className="p-4 sm:p-5 hover:bg-muted/30 transition-colors space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-foreground">{q.referenceId}</span>
                        {getStatusBadge(q.status)}
                      </div>
                      <p className="text-xs font-semibold text-foreground mt-0.5">
                        {q.fullName} {q.companyName ? `• ${q.companyName}` : ""}
                      </p>
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground font-mono self-start sm:self-auto">
                    {new Date(q.createdAt).toLocaleString()}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-muted-foreground pt-1 bg-muted/20 p-2.5 rounded-lg">
                  <div><span className="font-semibold text-foreground">Email:</span> {q.email}</div>
                  <div><span className="font-semibold text-foreground">Phone:</span> {q.phone}</div>
                  <div><span className="font-semibold text-foreground">Budget:</span> {q.budgetRange || "Not specified"}</div>
                </div>

                {q.projectScope && (
                  <p className="text-xs text-muted-foreground italic bg-muted/10 p-2 rounded">
                    &quot;{q.projectScope}&quot;
                  </p>
                )}


                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-muted-foreground inline-flex items-center gap-1">
                    {q.assignedManagerId ? (
                      <><UserCheck className="w-3.5 h-3.5 text-blue-500" /> Director Assigned</>
                    ) : (
                      <><Clock className="w-3.5 h-3.5 text-amber-500" /> Awaiting Director Assignment</>
                    )}
                  </span>

                  <Link
                    href={`/quote/track/${q.referenceId}`}
                    target="_blank"
                    className="text-xs font-semibold text-emerald-600 hover:underline"
                  >
                    Public Tracking Portal →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center space-y-3">
            <Inbox className="w-10 h-10 text-muted-foreground mx-auto opacity-40" />
            <p className="text-sm font-bold text-foreground">No quotation requests found</p>
            <p className="text-xs text-muted-foreground">Try clearing your search query or status filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}
