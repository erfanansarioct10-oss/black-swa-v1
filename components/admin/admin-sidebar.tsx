"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight, ExternalLink, LayoutDashboard, ShieldCheck } from "lucide-react";

import { useAdminShell } from "@/components/providers/admin-shell-provider";
import { Button } from "@/components/ui/button";
import { ADMIN_NAV_SECTIONS, ICON_MAP, isNavItemActive } from "@/constants/admin-navigation";
import { cn } from "@/lib/utils";

export function AdminSidebar() {
  const pathname = usePathname();
  const { isCollapsed, toggleCollapsed, mounted } = useAdminShell();

  return (
    <aside
      className={cn(
        "hidden lg:flex flex-col border-r border-border bg-card/60 backdrop-blur-md select-none z-30 sticky top-0 h-screen shrink-0 overflow-y-auto",
        mounted && "transition-all duration-300",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      {/* Sidebar Header / Brand Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-border">
        <Link href="/admin" className="flex items-center gap-3 overflow-hidden">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-black text-white dark:bg-white dark:text-black font-extrabold shrink-0 shadow-sm">
            <ShieldCheck className="w-5 h-5 text-emerald-400 dark:text-emerald-600" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col truncate">
              <span className="font-extrabold text-sm tracking-tight text-foreground leading-none">
                BLACK SWAN
              </span>
              <span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase mt-1">
                Admin Console
              </span>
            </div>
          )}
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6 scrollbar-thin">
        {ADMIN_NAV_SECTIONS.map((section) => (
          <div key={section.title} className="space-y-1">
            {!isCollapsed && (
              <h4 className="px-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70 mb-2">
                {section.title}
              </h4>
            )}
            <nav className="space-y-1">
              {section.items.map((item) => {
                const IconComponent = ICON_MAP[item.iconName] || LayoutDashboard;
                const active = isNavItemActive(pathname, item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    title={isCollapsed ? item.title : undefined}
                    aria-label={isCollapsed ? item.title : undefined}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors relative group",
                      active
                        ? "bg-black text-white dark:bg-white dark:text-black font-semibold shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent/60"
                    )}
                  >

                    <IconComponent
                      className={cn(
                        "w-5 h-5 shrink-0 transition-transform group-hover:scale-105",
                        active ? "text-white dark:text-black" : "text-muted-foreground group-hover:text-foreground"
                      )}
                    />
                    {!isCollapsed && <span className="truncate flex-1">{item.title}</span>}
                    {!isCollapsed && item.badge && (
                      <span
                        className={cn(
                          "px-2 py-0.5 text-[10px] font-extrabold rounded-full tracking-wide uppercase",
                          active
                            ? "bg-emerald-500/30 text-emerald-200 dark:bg-emerald-600/30 dark:text-emerald-800"
                            : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        ))}
      </div>

      {/* Sidebar Footer Controls */}
      <div className="p-3 border-t border-border space-y-2">
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          title={isCollapsed ? "View Public Site" : undefined}
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors",
            isCollapsed && "justify-center"
          )}
        >
          <ExternalLink className="w-4 h-4 shrink-0" />
          {!isCollapsed && <span>View Public Website</span>}
        </Link>

        <Button
          variant="outline"
          size="sm"
          onClick={toggleCollapsed}
          className="w-full flex items-center justify-center gap-2 text-xs font-semibold py-2"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4" />
              <span>Collapse Sidebar</span>
            </>
          )}
        </Button>
      </div>
    </aside>
  );
}
