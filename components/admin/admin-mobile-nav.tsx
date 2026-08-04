"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ExternalLink, LayoutDashboard, ShieldCheck } from "lucide-react";

import { useAdminShell } from "@/components/providers/admin-shell-provider";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ADMIN_NAV_SECTIONS, ICON_MAP, isNavItemActive } from "@/constants/admin-navigation";
import { cn } from "@/lib/utils";

export function AdminMobileNav() {

  const pathname = usePathname();
  const { isMobileOpen, setMobileOpen } = useAdminShell();

  // Automatically close mobile sheet on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname, setMobileOpen]);

  return (
    <Sheet open={isMobileOpen} onOpenChange={setMobileOpen}>
      <SheetContent side="left" className="w-80 max-w-[85vw] p-0 flex flex-col bg-background">
        <SheetHeader className="p-4 border-b border-border text-left">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-black text-white dark:bg-white dark:text-black font-extrabold shrink-0 shadow-sm">
              <ShieldCheck className="w-5 h-5 text-emerald-400 dark:text-emerald-600" />
            </div>
            <div className="flex flex-col">
              <SheetTitle className="font-extrabold text-base tracking-tight text-foreground leading-none">
                BLACK SWAN
              </SheetTitle>
              <SheetDescription className="text-xs font-bold tracking-widest text-muted-foreground uppercase mt-1">
                Admin Console
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        {/* Navigation Sections */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {ADMIN_NAV_SECTIONS.map((section) => (
            <div key={section.title} className="space-y-1.5">
              <h4 className="px-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70 mb-2">
                {section.title}
              </h4>
              <nav className="space-y-1">
                {section.items.map((item) => {
                  const IconComponent = ICON_MAP[item.iconName] || LayoutDashboard;
                  const active = isNavItemActive(pathname, item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm font-medium transition-all active:scale-[0.98] min-h-[44px]",
                        active
                          ? "bg-black text-white dark:bg-white dark:text-black font-semibold shadow-sm"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent/60"
                      )}
                    >
                      <IconComponent
                        className={cn(
                          "w-5 h-5 shrink-0",
                          active ? "text-white dark:text-black" : "text-muted-foreground"
                        )}
                      />
                      <span className="truncate flex-1">{item.title}</span>
                      {item.badge && (
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

        {/* Mobile Footer */}
        <div className="p-4 border-t border-border bg-muted/20">
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMobileOpen(false)}
            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl text-xs font-semibold border border-border text-muted-foreground hover:text-foreground hover:bg-background transition-colors min-h-[44px]"
          >
            <ExternalLink className="w-4 h-4" />
            <span>View Public Website</span>
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
}
