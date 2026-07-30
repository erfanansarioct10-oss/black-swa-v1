"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, Phone, Mail, ChevronRight, FileText } from "lucide-react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { CONTACT_INFO } from "@/constants/contact";

interface NavItem {
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Products", href: "/products" },
  { label: "Services", href: "/services" },
  { label: "Contact Us", href: "/contact" },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <button
            className="p-2 text-foreground hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded-md"
            aria-label="Open Navigation Menu"
          >
            <Menu className="h-6 w-6" />
          </button>
        </SheetTrigger>

        <SheetContent side="right" className="w-[85%] max-w-sm p-0 flex flex-col justify-between">
          <SheetHeader className="p-4 border-b border-border text-left">
            <SheetTitle>
              <Link
                href="/"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2"
              >
                <Image
                  src="/logo/logo.webp"
                  alt="Black Swan International Logo"
                  width={36}
                  height={36}
                  className="w-9 h-9 object-contain"
                />
                <span className="font-bold text-lg tracking-tight text-foreground">
                  BLACK SWAN
                </span>
              </Link>
            </SheetTitle>
          </SheetHeader>

          {/* Drawer Navigation Links */}
          <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between py-3 px-4 text-base font-medium text-foreground hover:bg-accent rounded-lg transition-colors"
              >
                <span>{item.label}</span>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            ))}
          </div>

          {/* Drawer Footer - Contact & Quote CTA */}
          <div className="p-4 border-t border-border bg-muted/30 space-y-4">
            <div className="space-y-2 text-sm text-muted-foreground">
              <a
                href={CONTACT_INFO.phone.href}
                className="flex items-center gap-2 hover:text-foreground transition-colors"
              >
                <Phone className="h-4 w-4 text-primary" />
                <span>{CONTACT_INFO.phone.display}</span>
              </a>
              <a
                href={CONTACT_INFO.email.href}
                className="flex items-center gap-2 hover:text-foreground transition-colors"
              >
                <Mail className="h-4 w-4 text-primary" />
                <span>{CONTACT_INFO.email.display}</span>
              </a>
            </div>

            <Link
              href="/quote"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-primary text-primary-foreground font-semibold rounded-lg shadow-xs hover:opacity-95 transition-opacity"
            >
              <FileText className="h-4 w-4" />
              <span>Request a Quote</span>
            </Link>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
