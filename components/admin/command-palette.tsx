"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FileText,
  Inbox,
  Loader2,
  Search,
  Shield,
  X,
  Zap,
} from "lucide-react";

import { adminSearchAction, type AdminSearchResultItem } from "@/actions/admin";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ADMIN_NAV_SECTIONS } from "@/constants/admin-navigation";

interface CommandPaletteProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function CommandPalette({ open: externalOpen, onOpenChange }: CommandPaletteProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [rfqResults, setRfqResults] = useState<AdminSearchResultItem[]>([]);
  const [inquiryResults, setInquiryResults] = useState<AdminSearchResultItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const router = useRouter();


  const isOpen = externalOpen !== undefined ? externalOpen : internalOpen;

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (onOpenChange) {
        onOpenChange(nextOpen);
      } else {
        setInternalOpen(nextOpen);
      }
      if (!nextOpen) {
        setQuery("");
        setRfqResults([]);
        setInquiryResults([]);
        setSelectedIndex(0);
      }
    },
    [onOpenChange]
  );

  // Global Cmd+K / Ctrl+K keyboard shortcut listener (Post-mount hydration safety)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        handleOpenChange(!isOpen);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleOpenChange]);

  // Execute debounced search when query changes
  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      return;
    }

    let isMounted = true;
    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        const res = await adminSearchAction(trimmed);
        if (isMounted && res.success && res.data) {
          setRfqResults(res.data.quotes);
          setInquiryResults(res.data.inquiries);
        }
      } catch (err) {
        console.error("Search execution failed:", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }, 250);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [query]);


  // Flattened navigation links from shared constants source of truth
  const navShortcuts = ADMIN_NAV_SECTIONS.flatMap((sec) => sec.items).filter((item) =>
    item.title.toLowerCase().includes(query.toLowerCase())
  );

  // Total combined items for keyboard selection index calculations
  const allItems = [
    ...navShortcuts.map((item) => ({ type: "nav", href: item.href, title: item.title })),
    ...rfqResults.map((item) => ({ type: "rfq", href: item.href, title: item.title })),
    ...inquiryResults.map((item) => ({ type: "inquiry", href: item.href, title: item.title })),
  ];

  const handleNavigate = (href: string) => {
    handleOpenChange(false);
    router.push(href);
  };

  const handleKeyDownInInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (allItems.length > 0 ? (prev + 1) % allItems.length : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        allItems.length > 0 ? (prev - 1 + allItems.length) % allItems.length : 0
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      const target = allItems[selectedIndex];
      if (target) {
        handleNavigate(target.href);
      }
    }
  };

  let globalIndexCounter = 0;

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent showCloseButton={false} className="max-w-2xl p-0 overflow-hidden border-border bg-card shadow-2xl rounded-2xl">
        <DialogHeader className="sr-only">
          <DialogTitle>Global Admin Command Palette</DialogTitle>
        </DialogHeader>

        {/* Top Search Input Field */}
        <div className="flex items-center px-4 border-b border-border bg-card">
          <Search className="w-5 h-5 text-muted-foreground shrink-0 mr-3" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              const val = e.target.value;
              setQuery(val);
              if (val.trim().length < 2) {
                setRfqResults([]);
                setInquiryResults([]);
              }
              setSelectedIndex(0);
            }}

            onKeyDown={handleKeyDownInInput}
            placeholder="Search RFQ reference IDs, clients, companies, or navigate..."
            className="w-full h-14 bg-transparent text-sm font-medium text-foreground placeholder:text-muted-foreground outline-hidden pr-2"
            autoFocus
          />
          {loading && <Loader2 className="w-4 h-4 text-emerald-500 animate-spin shrink-0 ml-2" />}
          {query && !loading && (
            <button
              onClick={() => {
                setQuery("");
                setRfqResults([]);
                setInquiryResults([]);
              }}
              className="text-muted-foreground hover:text-foreground p-1 rounded-md hover:bg-muted shrink-0 transition-colors mr-1"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <Badge variant="outline" className="hidden sm:inline-flex text-[10px] font-mono border-border shrink-0 ml-1">
            ESC
          </Badge>
        </div>


        {/* Results List Container */}
        <div className="max-h-[60vh] overflow-y-auto p-3 space-y-4 text-xs">
          {/* Section 1: Navigation Shortcuts */}
          {navShortcuts.length > 0 && (
            <div className="space-y-1">
              <div className="px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
                <span>Administrative Shortcuts</span>
                <Zap className="w-3.5 h-3.5 text-amber-500" />
              </div>
              <div className="space-y-1">
                {navShortcuts.map((item) => {
                  const currentIndex = globalIndexCounter++;
                  const isSelected = selectedIndex === currentIndex;
                  return (
                    <button
                      key={item.href}
                      onClick={() => handleNavigate(item.href)}
                      onMouseEnter={() => setSelectedIndex(currentIndex)}
                      className={`w-full flex items-center justify-between p-2.5 rounded-lg text-left transition-colors font-medium ${
                        isSelected ? "bg-accent text-accent-foreground" : "hover:bg-muted text-foreground"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Shield className="w-4 h-4 text-emerald-500" />
                        <span>{item.title}</span>
                      </div>
                      <span className="text-[11px] text-muted-foreground font-mono">{item.href}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Section 2: Commercial RFQ Quotations */}
          {rfqResults.length > 0 && (
            <div className="space-y-1">
              <div className="px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
                <span>Matching Commercial RFQs ({rfqResults.length})</span>
                <FileText className="w-3.5 h-3.5 text-emerald-500" />
              </div>
              <div className="space-y-1">
                {rfqResults.map((item) => {
                  const currentIndex = globalIndexCounter++;
                  const isSelected = selectedIndex === currentIndex;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavigate(item.href)}
                      onMouseEnter={() => setSelectedIndex(currentIndex)}
                      className={`w-full flex items-center justify-between p-2.5 rounded-lg text-left transition-colors ${
                        isSelected ? "bg-accent text-accent-foreground" : "hover:bg-muted text-foreground"
                      }`}
                    >
                      <div className="space-y-0.5">
                        <p className="font-semibold text-foreground">{item.title}</p>
                        <p className="text-[11px] text-muted-foreground">{item.subtitle}</p>
                      </div>
                      <Badge variant="outline" className="text-[10px] font-mono bg-emerald-500/10 text-emerald-600 border-emerald-500/30">
                        {item.badge}
                      </Badge>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Section 3: Contact & Service Inquiries */}
          {inquiryResults.length > 0 && (
            <div className="space-y-1">
              <div className="px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
                <span>Matching Inquiries ({inquiryResults.length})</span>
                <Inbox className="w-3.5 h-3.5 text-blue-500" />
              </div>
              <div className="space-y-1">
                {inquiryResults.map((item) => {
                  const currentIndex = globalIndexCounter++;
                  const isSelected = selectedIndex === currentIndex;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavigate(item.href)}
                      onMouseEnter={() => setSelectedIndex(currentIndex)}
                      className={`w-full flex items-center justify-between p-2.5 rounded-lg text-left transition-colors ${
                        isSelected ? "bg-accent text-accent-foreground" : "hover:bg-muted text-foreground"
                      }`}
                    >
                      <div className="space-y-0.5">
                        <p className="font-semibold text-foreground">{item.title}</p>
                        <p className="text-[11px] text-muted-foreground">{item.subtitle}</p>
                      </div>
                      <Badge variant="outline" className="text-[10px] font-mono bg-blue-500/10 text-blue-600 border-blue-500/30">
                        {item.badge}
                      </Badge>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Empty State */}
          {query.trim().length >= 2 && !loading && allItems.length === 0 && (
            <div className="py-12 text-center space-y-2">
              <Search className="w-8 h-8 text-muted-foreground mx-auto opacity-40" />
              <p className="text-sm font-semibold text-foreground">No matching records found</p>
              <p className="text-xs text-muted-foreground">
                Try searching for reference IDs (e.g. RFQ-...), customer name, company, or email.
              </p>
            </div>
          )}

          {/* Default Starter Help State */}
          {!query.trim() && (
            <div className="p-4 text-center text-muted-foreground space-y-1">
              <p className="font-semibold text-foreground">Quick Command & Directory Search</p>
              <p className="text-[11px]">
                Type to instantly search RFQ quotations, contact leads, and navigate admin sections.
              </p>
            </div>
          )}
        </div>

        {/* Footer Shortcut Legend */}
        <div className="p-3 bg-muted/40 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground px-4">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-card border border-border text-[10px] font-mono">↑↓</kbd> Navigate
            </span>
            <span className="inline-flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-card border border-border text-[10px] font-mono">↵</kbd> Select
            </span>
          </div>
          <span className="font-mono text-[10px]">Black Swan Admin v1.0</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
