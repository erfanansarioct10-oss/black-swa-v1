import Link from "next/link";
import { Phone, Mail, Clock, ShieldCheck } from "lucide-react";

export function TopUtilityBar() {
  return (
    <div className="bg-brand-onyx text-brand-slate text-xs border-b border-brand-marble/40 py-2 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        {/* Left Side: Contact & Hours */}
        <div className="flex flex-wrap items-center gap-4 text-slate-300">
          <a
            href="tel:+18005550199"
            className="flex items-center gap-1.5 hover:text-white transition-colors"
            aria-label="Call Black Swan International Sales & Support"
          >
            <Phone className="h-3.5 w-3.5 text-slate-400" />
            <span>+1 (800) 555-0199</span>
          </a>

          <span className="hidden sm:inline text-brand-marble">•</span>

          <a
            href="mailto:sales@blackswan-intl.com"
            className="flex items-center gap-1.5 hover:text-white transition-colors"
            aria-label="Email Black Swan International Sales"
          >
            <Mail className="h-3.5 w-3.5 text-slate-400" />
            <span>sales@blackswan-intl.com</span>
          </a>

          <span className="hidden md:inline text-brand-marble">•</span>

          <div className="hidden md:flex items-center gap-1.5 text-slate-400">
            <Clock className="h-3.5 w-3.5 text-slate-400" />
            <span>Mon - Fri: 8:00 AM - 5:00 PM EST</span>
          </div>
        </div>

        {/* Right Side: Admin / Portal Access */}
        <div className="flex items-center justify-end gap-3 pt-1 sm:pt-0 border-t sm:border-t-0 border-brand-marble/30">
          <Link
            href="/sign-in"
            className="inline-flex items-center gap-1 text-slate-300 hover:text-white font-medium transition-colors"
          >
            <ShieldCheck className="h-3.5 w-3.5 text-slate-400" />
            <span>Staff & Client Portal</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
