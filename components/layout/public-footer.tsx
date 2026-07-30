import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin, Clock, ArrowUpRight } from "lucide-react";

export function PublicFooter() {
  return (
    <footer className="bg-brand-onyx text-slate-300 border-t border-brand-marble/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Column 1: Brand & Overview */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/logo (2).webp"
                alt="Black Swan International Logo"
                width={40}
                height={40}
                className="w-10 h-10 object-contain"
              />
              <div className="flex flex-col">
                <span className="font-extrabold text-lg tracking-wider text-white">
                  BLACK SWAN
                </span>
                <span className="text-[10px] font-semibold tracking-widest text-slate-400 uppercase">
                  International
                </span>
              </div>
            </Link>

            <p className="text-sm text-slate-400 leading-relaxed">
              Premium industrial equipment, heavy machinery, mechanical seals, and custom engineering solutions built for mission-critical operations worldwide.
            </p>
          </div>

          {/* Column 2: Quick Navigation Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white tracking-wider uppercase border-b border-brand-marble/50 pb-2">
              Quick Links
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-white transition-colors">
                  Product Catalog
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-white transition-colors">
                  Engineering Services
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/quote" className="hover:text-white font-medium text-slate-200 transition-colors flex items-center gap-1">
                  <span>Request a Quotation</span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-slate-400" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Featured Product Categories */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white tracking-wider uppercase border-b border-brand-marble/50 pb-2">
              Product Solutions
            </h3>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link href="/products?category=pumps" className="hover:text-white transition-colors">
                  Industrial Heavy Pumps
                </Link>
              </li>
              <li>
                <Link href="/products?category=seals" className="hover:text-white transition-colors">
                  Mechanical Seals & Gaskets
                </Link>
              </li>
              <li>
                <Link href="/products?category=valves" className="hover:text-white transition-colors">
                  Control Valves & Actuators
                </Link>
              </li>
              <li>
                <Link href="/products?category=bearings" className="hover:text-white transition-colors">
                  Precision Bearings & Assemblies
                </Link>
              </li>
              <li>
                <Link href="/products?category=custom" className="hover:text-white transition-colors">
                  Custom Metal Fabrication
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Operations */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white tracking-wider uppercase border-b border-brand-marble/50 pb-2">
              Contact & Hours
            </h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                <span>100 Industrial Parkway, Suite 400, Industrial District</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-slate-400 shrink-0" />
                <a href="tel:+18005550199" className="hover:text-white transition-colors">
                  +1 (800) 555-0199
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-slate-400 shrink-0" />
                <a href="mailto:sales@blackswan-intl.com" className="hover:text-white transition-colors">
                  sales@blackswan-intl.com
                </a>
              </li>
              <li className="flex items-start gap-2.5 pt-1">
                <Clock className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                <span>Mon - Fri: 8:00 AM - 5:00 PM EST</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright & Legal Bar */}
        <div className="mt-12 pt-6 border-t border-brand-marble/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Black Swan International. All rights reserved.</p>

          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-slate-300 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-slate-300 transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
