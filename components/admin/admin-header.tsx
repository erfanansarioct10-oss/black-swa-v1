"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useOrganization, useUser, UserButton } from "@clerk/nextjs";
import {
  Bell,
  ChevronRight,
  FileText,
  Menu,
  MessageSquare,
  Plus,
  Shield,
  ShieldCheck,
  Zap,
} from "lucide-react";

import { useAdminShell } from "@/components/providers/admin-shell-provider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ROUTE_NAME_MAP: Record<string, string> = {
  "/admin": "Executive Dashboard",
  "/admin/quotes": "Quote Requests (RFQ)",
  "/admin/inquiries": "Contact Inquiries",
  "/admin/customers": "Customer Database",
  "/admin/products": "Product Catalog",
  "/admin/services": "Service Offerings",
  "/admin/analytics": "Analytics & Reports",
  "/admin/diagnostics": "System Diagnostics",
  "/admin/settings": "Settings & Access",
};

export function AdminHeader() {
  const pathname = usePathname();
  const { toggleMobileOpen } = useAdminShell();
  const { user } = useUser();
  const { membership } = useOrganization();

  const currentTitle = ROUTE_NAME_MAP[pathname] || "Admin Portal";

  // Derive role string for identity badge
  const userRole =
    membership?.role === "org:admin"
      ? "Org Admin"
      : (user?.publicMetadata?.role as string) || "Managing Director";

  return (
    <header className="h-16 border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-20 flex items-center justify-between px-4 sm:px-6 lg:px-8 shadow-xs">
      {/* Left side: Mobile menu toggle & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleMobileOpen}
          className="lg:hidden shrink-0 h-10 w-10 min-h-[44px] min-w-[44px]"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5 text-foreground" />
        </Button>

        {/* Dynamic Admin Breadcrumbs */}
        <nav aria-label="Admin Navigation Trail" className="hidden sm:flex items-center gap-2 text-xs font-semibold">
          <Link
            href="/admin"
            className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Admin</span>
          </Link>
          {pathname !== "/admin" && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-foreground font-bold tracking-tight">{currentTitle}</span>
            </>
          )}
        </nav>

        {/* Mobile Page Title */}
        <span className="sm:hidden font-extrabold text-sm text-foreground truncate">
          {currentTitle}
        </span>
      </div>

      {/* Right side: System health, Quick Actions, Notifications & Clerk UserButton */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick RFQ Action Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold h-9 px-3 border-border hover:bg-muted"
            >
              <Plus className="w-3.5 h-3.5 text-emerald-500" />
              <span>Quick Actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Administrative Shortcuts
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link href="/admin/quotes" className="flex items-center gap-2 text-xs">
                <FileText className="w-4 h-4 text-emerald-500" />
                <span>View Pending RFQs</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link href="/admin/inquiries" className="flex items-center gap-2 text-xs">
                <MessageSquare className="w-4 h-4 text-blue-500" />
                <span>Review Contact Inquiries</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link href="/admin/diagnostics" className="flex items-center gap-2 text-xs">
                <Zap className="w-4 h-4 text-amber-500" />
                <span>System Diagnostics</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Notification Bell Indicator */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative h-9 w-9 text-muted-foreground hover:text-foreground"
              aria-label="View notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-card animate-pulse" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72">
            <DropdownMenuLabel className="flex items-center justify-between text-xs">
              <span className="font-bold text-foreground">Notifications</span>
              <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                Active Feed
              </span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="p-2 space-y-2 text-xs">
              <Link
                href="/admin/quotes"
                className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-muted transition-colors group"
              >
                <FileText className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="font-semibold text-foreground group-hover:text-emerald-600 transition-colors">
                    Pending RFQ Submissions
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    New commercial quote requests awaiting director review.
                  </p>
                </div>
              </Link>
              <Link
                href="/admin/inquiries"
                className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-muted transition-colors group"
              >
                <MessageSquare className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="font-semibold text-foreground group-hover:text-blue-600 transition-colors">
                    Contact & Service Inquiries
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Client service inquiry messages submitted online.
                  </p>
                </div>
              </Link>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Role Identity Badge */}
        <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
          <Shield className="w-3.5 h-3.5 text-emerald-500" />
          <span>{userRole}</span>
        </div>

        {/* Clerk Auth User Button */}
        <div className="flex items-center gap-2 border-l border-border pl-2.5 sm:pl-3">
          <UserButton
            appearance={{
              elements: {
                userButtonAvatarBox: "w-8 h-8 rounded-full border border-border shadow-xs",
              },
            }}
          />
        </div>
      </div>
    </header>
  );
}
