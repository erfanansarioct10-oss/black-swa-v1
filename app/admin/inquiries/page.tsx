import Link from "next/link";
import { desc, eq, sql } from "drizzle-orm";
import {
  ArrowLeft,
  Inbox,
  Mail,
  MessageSquare,
  Wrench,
} from "lucide-react";


import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { db } from "@/db";
import { contactInquiries } from "@/db/schema";
import { requireAdminAuth } from "@/lib/admin-auth";
import { generatePageMetadata } from "@/lib/seo";

export const metadata = generatePageMetadata({
  title: "Contact & Service Inquiries | Admin Portal",
  description: "Review and respond to client service inquiries and contact messages.",
  path: "/admin/inquiries",
});

interface InquiriesPageProps {
  searchParams: Promise<{
    status?: string;
    id?: string;
  }>;
}

type InquiryRecord = typeof contactInquiries.$inferSelect;

export default async function AdminInquiriesPage({ searchParams }: InquiriesPageProps) {
  await requireAdminAuth();
  const { status, id } = await searchParams;

  let allInquiries: InquiryRecord[] = [];

  let newCount = 0;
  let totalCount = 0;

  try {
    const whereCondition = status
      ? eq(contactInquiries.status, status as typeof contactInquiries.status._.data)
      : id
      ? eq(contactInquiries.id, id)
      : undefined;

    const [[newRes], [totalRes], fetchedInquiries] = await Promise.all([
      db.select({ count: sql<number>`count(*)` }).from(contactInquiries).where(eq(contactInquiries.status, "new")),
      db.select({ count: sql<number>`count(*)` }).from(contactInquiries),
      db.select().from(contactInquiries).where(whereCondition).orderBy(desc(contactInquiries.createdAt)).limit(50),
    ]);

    newCount = Number(newRes?.count || 0);
    totalCount = Number(totalRes?.count || 0);
    allInquiries = fetchedInquiries;
  } catch (err) {
    console.error("Failed to fetch contact inquiries for admin management:", err);
  }

  const getStatusBadge = (s: string) => {
    switch (s) {
      case "new":
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/30">New</Badge>;
      case "in_progress":
        return <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/30">In Progress</Badge>;
      case "resolved":
        return <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30">Resolved</Badge>;
      case "archived":
        return <Badge variant="outline" className="bg-muted text-muted-foreground">Archived</Badge>;
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
            <Inbox className="w-7 h-7 text-blue-500" />
            Contact & Service Inquiries
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Review incoming B2B service inquiries, client contact leads, and project specifications.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs font-mono bg-blue-500/10 text-blue-600 border-blue-500/30">
            {newCount} New Unreviewed
          </Badge>
          <Badge variant="outline" className="text-xs font-mono bg-muted text-foreground">
            {totalCount} Total Messages
          </Badge>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 pb-2">
        <Button asChild size="sm" variant={!status ? "default" : "outline"} className="text-xs">
          <Link href="/admin/inquiries">All Inquiries ({totalCount})</Link>
        </Button>
        <Button asChild size="sm" variant={status === "new" ? "default" : "outline"} className="text-xs">
          <Link href="/admin/inquiries?status=new">New ({newCount})</Link>
        </Button>
        <Button asChild size="sm" variant={status === "in_progress" ? "default" : "outline"} className="text-xs">
          <Link href="/admin/inquiries?status=in_progress">In Progress</Link>
        </Button>
        <Button asChild size="sm" variant={status === "resolved" ? "default" : "outline"} className="text-xs">
          <Link href="/admin/inquiries?status=resolved">Resolved</Link>
        </Button>
      </div>

      {/* Inquiry Record List */}
      <div className="bg-card border border-border rounded-xl shadow-xs overflow-hidden">
        {allInquiries.length > 0 ? (
          <div className="divide-y divide-border/60">
            {allInquiries.map((i) => (
              <div key={i.id} className="p-4 sm:p-5 hover:bg-muted/30 transition-colors space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-foreground">{i.fullName}</span>
                        {getStatusBadge(i.status)}
                      </div>
                      <p className="text-xs font-semibold text-muted-foreground mt-0.5">
                        {i.companyName} • {i.email}
                      </p>
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground font-mono self-start sm:self-auto">
                    {new Date(i.createdAt).toLocaleString()}
                  </div>
                </div>

                {i.serviceSlug && (
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs font-semibold">
                    <Wrench className="w-3 h-3" /> Service Focus: {i.serviceSlug}
                  </div>
                )}

                <div className="p-3 bg-muted/20 border border-border/40 rounded-lg text-xs text-foreground space-y-1">
                  <p className="font-semibold text-muted-foreground text-[11px] uppercase tracking-wider">Inquiry Message:</p>
                  <p className="whitespace-pre-wrap">{i.message}</p>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-muted-foreground inline-flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-blue-500" /> Direct Email Reply: <code className="text-foreground font-mono">{i.email}</code>
                  </span>

                  {i.phone && (
                    <span className="text-xs text-muted-foreground">
                      Phone: <span className="font-semibold text-foreground">{i.phone}</span>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center space-y-3">
            <Inbox className="w-10 h-10 text-muted-foreground mx-auto opacity-40" />
            <p className="text-sm font-bold text-foreground">No contact inquiries found</p>
            <p className="text-xs text-muted-foreground">Try clearing your search query or status filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}
