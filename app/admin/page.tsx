import { UserButton } from "@clerk/nextjs";
import { eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { contactInquiries, quotes } from "@/db/schema";
import { generatePageMetadata } from "@/lib/seo";

export const metadata = generatePageMetadata({
  title: "Admin Portal | Enterprise CRM & Quote Management",
  description: "Administrative management portal for Black Swan International.",
  path: "/admin",
});

export default async function AdminDashboardPage() {
  let pendingCount = 0;
  let inquiriesCount = 0;
  let dbStatus = "Connected";

  try {
    const [pendingRes] = await db
      .select({ count: sql<number>`count(*)` })
      .from(quotes)
      .where(eq(quotes.status, "pending"));
    pendingCount = Number(pendingRes?.count || 0);

    const [inquiriesRes] = await db
      .select({ count: sql<number>`count(*)` })
      .from(contactInquiries);
    inquiriesCount = Number(inquiriesRes?.count || 0);
  } catch (error) {
    console.error("Failed to query admin metrics:", error);
    dbStatus = "Degraded";
  }

  return (
    <div className="min-h-screen bg-background p-6 sm:p-8 space-y-6">
      <header className="flex items-center justify-between pb-6 border-b border-border">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Administrative Portal
          </span>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight sm:text-3xl">
            Black Swan Executive Dashboard
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <UserButton showName />
        </div>
      </header>

      <main className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        <div className="p-6 bg-card border border-border rounded-xl space-y-2 shadow-sm">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Pending RFQ Requests
          </h3>
          <p className="text-3xl font-extrabold text-foreground">{pendingCount}</p>
          <p className="text-xs text-muted-foreground">Quotes awaiting director assignment</p>
        </div>

        <div className="p-6 bg-card border border-border rounded-xl space-y-2 shadow-sm">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Contact Inquiries
          </h3>
          <p className="text-3xl font-extrabold text-foreground">{inquiriesCount}</p>
          <p className="text-xs text-muted-foreground">Submitted customer inquiries</p>
        </div>

        <div className="p-6 bg-card border border-border rounded-xl space-y-2 shadow-sm">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            System Status
          </h3>
          <p className="text-3xl font-extrabold text-emerald-600 font-mono">{dbStatus}</p>
          <p className="text-xs text-muted-foreground">Clerk Auth & Supabase PostgreSQL</p>
        </div>
      </main>
    </div>
  );
}
