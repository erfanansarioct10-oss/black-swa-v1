"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { FileText, ShoppingCart } from "lucide-react";
import { MobileNav } from "@/components/layout/mobile-nav";
import { useQuoteCart } from "@/context/quote-cart-context";

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

export function MainHeader() {
  const pathname = usePathname();
  const { itemCount, mounted } = useQuoteCart();

  return (
    <header className="sticky top-0 z-40 w-full bg-background opacity-100 border-b border-border shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
        {/* Brand Logo & Name */}
        <Link href="/" className="flex items-center gap-3 group">
          <Image
            src="/logo.webp"
            alt="Black Swan International Logo"
            width={44}
            height={44}
            priority
            className="w-9 h-9 sm:w-11 sm:h-11 object-contain transition-transform group-hover:scale-105"
          />
          <div className="flex flex-col">
            <span className="font-extrabold text-base sm:text-xl tracking-wider text-foreground leading-tight">
              BLACK SWAN
            </span>
            <span className="text-[10px] sm:text-xs font-semibold tracking-widest text-muted-foreground uppercase">
              International
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2" aria-label="Main Navigation">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive
                    ? "text-primary font-semibold bg-accent"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/60"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Action Group: Quote Cart Badge & CTA */}
        <div className="flex items-center gap-3">
          {/* Quote Cart Badge */}
          <Link
            href="/quote"
            className="relative p-2 text-foreground hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded-md"
            aria-label={`View Quote Cart, ${mounted ? itemCount : 0} items selected`}
          >
            <ShoppingCart className="h-5 w-5" />
            {mounted && itemCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground shadow-xs animate-in zoom-in-50">
                {itemCount}
              </span>
            )}
          </Link>

          {/* Request a Quote Primary CTA (Desktop) */}
          <Link
            href="/quote"
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-primary text-primary-foreground hover:opacity-90 rounded-md shadow-xs transition-all"
          >
            <FileText className="h-4 w-4" />
            <span>Request Quote</span>
          </Link>

          {/* Mobile Navigation Drawer Trigger */}
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
