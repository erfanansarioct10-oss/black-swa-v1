import { UserButton } from "@clerk/nextjs";
import { generatePageMetadata } from "@/lib/seo";

export const metadata = generatePageMetadata({
  title: "Admin Portal | Enterprise CRM & Quote Management",
  description: "Administrative management portal for Black Swan International.",
  path: "/admin",
});

export default function AdminDashboardPage() {
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
            Active RFQ Requests
          </h3>
          <p className="text-3xl font-extrabold text-foreground">0</p>
          <p className="text-xs text-muted-foreground">Phase 3A Schema pending execution</p>
        </div>

        <div className="p-6 bg-card border border-border rounded-xl space-y-2 shadow-sm">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Assigned Quotes
          </h3>
          <p className="text-3xl font-extrabold text-foreground">0</p>
          <p className="text-xs text-muted-foreground">Managing Director assignments</p>
        </div>

        <div className="p-6 bg-card border border-border rounded-xl space-y-2 shadow-sm">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            System Status
          </h3>
          <p className="text-3xl font-extrabold text-amber-500">Active (Dev)</p>
          <p className="text-xs text-muted-foreground">Clerk Auth Active | DB Schema Pending Phase 3A</p>
        </div>
      </main>
    </div>
  );
}
