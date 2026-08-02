"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  Bell,
  CheckCircle2,
  FileText,
  Inbox,
  Loader2,
  UserCheck,
} from "lucide-react";

import {
  assignQuoteToSelfAction,
  getAdminNotificationsAction,
  updateInquiryStatusAction,
  type AdminNotificationItem,
  type AdminNotificationsData,
} from "@/actions/admin";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function NotificationDrawer() {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<AdminNotificationsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [actioningId, setActioningId] = useState<string | null>(null);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await getAdminNotificationsAction();
      if (res.success && res.data) {
        setData(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch admin notifications:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        const res = await getAdminNotificationsAction();
        if (isMounted && res.success && res.data) {
          setData(res.data);
        }
      } catch (err) {
        console.error("Failed to fetch admin notifications:", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, []);



  const handleAssignQuote = async (quoteId: string) => {
    setActioningId(quoteId);
    try {
      const res = await assignQuoteToSelfAction(quoteId);
      if (res.success) {
        await fetchNotifications();
      }
    } catch (err) {
      console.error("Failed to assign quote:", err);
    } finally {
      setActioningId(null);
    }
  };

  const handleMarkInquiryInProgress = async (inquiryId: string) => {
    setActioningId(inquiryId);
    try {
      const res = await updateInquiryStatusAction(inquiryId, "in_progress");
      if (res.success) {
        await fetchNotifications();
      }
    } catch (err) {
      console.error("Failed to update inquiry status:", err);
    } finally {
      setActioningId(null);
    }
  };

  const totalUnread = data?.totalUnread || 0;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9 text-muted-foreground hover:text-foreground"
          aria-label="Open executive notifications drawer"
        >
          <Bell className="w-4 h-4" />
          {totalUnread > 0 && (
            <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-card motion-safe:animate-pulse">
              {totalUnread}
            </span>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col bg-card border-l border-border">
        {/* Drawer Header */}
        <SheetHeader className="p-4 sm:p-6 border-b border-border bg-card">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <SheetTitle className="text-base font-extrabold text-foreground flex items-center gap-2">
                <Bell className="w-4 h-4 text-emerald-500" />
                Executive Notifications
              </SheetTitle>
              <SheetDescription className="text-xs text-muted-foreground">
                Active directives requiring director attention or assignment.
              </SheetDescription>
            </div>
            {totalUnread > 0 && (
              <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30 text-xs font-bold">
                {totalUnread} Pending
              </Badge>
            )}
          </div>
        </SheetHeader>

        {/* Notifications Feed Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 text-xs">
          {loading ? (
            <div className="space-y-3">
              <div className="h-20 bg-muted/60 rounded-xl animate-pulse" />
              <div className="h-20 bg-muted/60 rounded-xl animate-pulse" />
              <div className="h-20 bg-muted/60 rounded-xl animate-pulse" />
            </div>
          ) : data && data.items.length > 0 ? (
            <div className="space-y-3">
              {data.items.map((item: AdminNotificationItem) => {
                const isActioning = actioningId === item.id;
                return (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl border border-border/80 bg-card hover:border-border transition-all space-y-3 shadow-xs"
                  >
                    <div className="flex items-start gap-3">
                      {item.type === "rfq" ? (
                        <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5">
                          <FileText className="w-4 h-4" />
                        </div>
                      ) : (
                        <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5">
                          <Inbox className="w-4 h-4" />
                        </div>
                      )}
                      <div className="space-y-1 flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-bold text-foreground truncate">{item.title}</p>
                          <span className="text-[10px] text-muted-foreground font-mono shrink-0">
                            {new Date(item.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground truncate">{item.subtitle}</p>
                      </div>
                    </div>

                    {/* Quick Resolution Controls */}
                    <div className="pt-2 border-t border-border/60 flex items-center justify-between gap-2">
                      <Link
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className="text-[11px] font-semibold text-emerald-600 hover:underline inline-flex items-center gap-1"
                      >
                        View Details →
                      </Link>

                      {item.type === "rfq" ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAssignQuote(item.id)}
                          disabled={isActioning}
                          className="h-7 px-2.5 text-[11px] font-semibold border-emerald-500/30 hover:bg-emerald-500/10 text-emerald-600"
                        >
                          {isActioning ? (
                            <Loader2 className="w-3 h-3 animate-spin mr-1" />
                          ) : (
                            <UserCheck className="w-3 h-3 mr-1" />
                          )}
                          Assign to Me
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleMarkInquiryInProgress(item.id)}
                          disabled={isActioning}
                          className="h-7 px-2.5 text-[11px] font-semibold border-blue-500/30 hover:bg-blue-500/10 text-blue-600"
                        >
                          {isActioning ? (
                            <Loader2 className="w-3 h-3 animate-spin mr-1" />
                          ) : (
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                          )}
                          In Progress
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-16 text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto opacity-40" />
              <div>
                <p className="text-sm font-bold text-foreground">No Pending Directives</p>
                <p className="text-xs text-muted-foreground mt-1 max-w-xs mx-auto">
                  All commercial quotation requests are assigned and contact inquiries have been reviewed.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer Links */}
        <div className="p-4 border-t border-border bg-muted/30 flex items-center justify-between text-xs">
          <Link
            href="/admin/quotes"
            onClick={() => setOpen(false)}
            className="font-semibold text-foreground hover:underline"
          >
            All Quote Requests →
          </Link>
          <Link
            href="/admin/inquiries"
            onClick={() => setOpen(false)}
            className="font-semibold text-foreground hover:underline"
          >
            All Contact Inquiries →
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
}
