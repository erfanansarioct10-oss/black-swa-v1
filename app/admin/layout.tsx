import { headers } from "next/headers";
import { AdminHeader } from "@/components/admin/admin-header";
import { AdminMobileNav } from "@/components/admin/admin-mobile-nav";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminShellProvider } from "@/components/providers/admin-shell-provider";
import { requireAdminAuth } from "@/lib/admin-auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";

  const isAuthPage = pathname.startsWith("/admin/login") || pathname.startsWith("/admin/unauthorized");

  if (isAuthPage) {
    return <div className="min-h-screen bg-background font-sans text-foreground antialiased">{children}</div>;
  }

  // Enforce server-side role guard for all protected admin dashboard routes
  await requireAdminAuth();

  return (
    <AdminShellProvider>
      <div className="min-h-screen bg-muted/15 flex flex-col lg:flex-row font-sans antialiased text-foreground">
        {/* Desktop Collapsible Navigation Sidebar */}
        <AdminSidebar />

        {/* Mobile & Tablet Drawer Navigation Sheet */}
        <AdminMobileNav />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Administrative Header */}
          <AdminHeader />

          {/* Main Dashboard Canvas */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </AdminShellProvider>
  );
}


