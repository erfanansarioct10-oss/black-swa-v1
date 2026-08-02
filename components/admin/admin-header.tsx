"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useOrganization, useUser, UserButton } from "@clerk/nextjs";
import {
  ChevronRight,
  FileText,
  Menu,
  MessageSquare,
  Plus,
  Search,
  Shield,
  ShieldCheck,
} from "lucide-react";


import { CommandPalette } from "@/components/admin/command-palette";
import { NotificationDrawer } from "@/components/admin/notification-drawer";
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
import { ADMIN_NAV_SECTIONS, getAdminRouteTitle } from "@/constants/admin-navigation";

export function AdminHeader() {
  const pathname = usePathname();
  const { toggleMobileOpen } = useAdminShell();
  const { user } = useUser();
  const { membership } = useOrganization();
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  const currentTitle = getAdminRouteTitle(pathname);

  // Derive nav destinations from navigation constants source of truth
  const quotesHref =
    ADMIN_NAV_SECTIONS.flatMap((s) => s.items).find((i) => i.href === "/admin/quotes")?.href ||
    "/admin/quotes";
  const inquiriesHref =
    ADMIN_NAV_SECTIONS.flatMap((s) => s.items).find((i) => i.href === "/admin/inquiries")?.href ||
    "/admin/inquiries";


  // Derive role string for identity badge
  const userRole =
    membership?.role === "org:admin"
      ? "Org Admin"
      : (user?.publicMetadata?.role as string) || "Managing Director";

  return (
    <>
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

        {/* Right side: Global Command Palette Trigger, Quick Actions, Notifications & UserButton */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Search Launcher Button (Cmd+K) */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCommandPaletteOpen(true)}
            className="flex items-center justify-between gap-2.5 text-xs text-muted-foreground hover:text-foreground h-9 px-3 border-border hover:bg-muted font-medium"
            aria-label="Search administrative records (Cmd+K)"
          >
            <div className="flex items-center gap-1.5 shrink-0">
              <Search className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              <span className="hidden sm:inline">Quick Search...</span>
            </div>
            <kbd className="hidden sm:inline-flex text-[10px] font-mono border border-border bg-muted/60 px-1.5 py-0.5 rounded-md shrink-0">
              ⌘K
            </kbd>
          </Button>


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
                <Link href={quotesHref} className="flex items-center gap-2 text-xs">
                  <FileText className="w-4 h-4 text-emerald-500" />
                  <span>View Pending RFQs</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href={inquiriesHref} className="flex items-center gap-2 text-xs">
                  <MessageSquare className="w-4 h-4 text-blue-500" />
                  <span>Review Contact Inquiries</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>

          </DropdownMenu>

          {/* Interactive Notification Drawer Sheet */}
          <NotificationDrawer />

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

      {/* Global Command Palette Dialog Modal */}
      <CommandPalette open={commandPaletteOpen} onOpenChange={setCommandPaletteOpen} />
    </>
  );
}
