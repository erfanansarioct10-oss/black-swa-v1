"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Phone, Mail, ChevronRight, FileText } from "lucide-react";

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
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden">
      {/* Menu Toggle Trigger */}
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 text-foreground hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded-md"
        aria-label="Open Mobile Navigation Menu"
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Slide-out Backdrop Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Slide-out Drawer Panel */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-[85%] max-w-sm bg-background border-l border-border shadow-2xl transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2"
          >
            <Image
              src="/logo (2).webp"
              alt="Black Swan International Logo"
              width={36}
              height={36}
              className="w-9 h-9 object-contain"
            />
            <span className="font-bold text-lg tracking-tight text-foreground">
              BLACK SWAN
            </span>
          </Link>

          <button
            onClick={() => setIsOpen(false)}
            className="p-2 text-muted-foreground hover:text-foreground rounded-md focus:outline-none"
            aria-label="Close Navigation Menu"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Drawer Body - Navigation Links */}
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
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
              href="tel:+18005550199"
              className="flex items-center gap-2 hover:text-foreground transition-colors"
            >
              <Phone className="h-4 w-4 text-primary" />
              <span>+1 (800) 555-0199</span>
            </a>
            <a
              href="mailto:sales@blackswan-intl.com"
              className="flex items-center gap-2 hover:text-foreground transition-colors"
            >
              <Mail className="h-4 w-4 text-primary" />
              <span>sales@blackswan-intl.com</span>
            </a>
          </div>

          <Link
            href="/quote"
            onClick={() => setIsOpen(false)}
            className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-primary text-primary-foreground font-semibold rounded-lg shadow-sm hover:opacity-95 transition-opacity"
          >
            <FileText className="h-4 w-4" />
            <span>Request a Quote</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
