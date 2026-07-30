import { Phone, Mail, Clock } from "lucide-react";
import { CONTACT_INFO } from "@/constants/contact";

export function TopUtilityBar() {
  return (
    <div className="bg-brand-onyx text-brand-slate text-xs border-b border-brand-marble/40 py-2 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4 items-center text-slate-300">
        {/* Left Item: Phone */}
        <div className="flex items-center justify-center md:justify-start gap-1.5">
          <a
            href={CONTACT_INFO.phone.href}
            className="flex items-center gap-1.5 hover:text-white transition-colors"
            aria-label="Call Black Swan International Sales & Support"
          >
            <Phone className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <span>{CONTACT_INFO.phone.display}</span>
          </a>
        </div>

        {/* Middle Item: Email */}
        <div className="flex items-center justify-center gap-1.5">
          <a
            href={CONTACT_INFO.email.href}
            className="flex items-center gap-1.5 hover:text-white transition-colors"
            aria-label="Email Black Swan International Sales"
          >
            <Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <span>{CONTACT_INFO.email.display}</span>
          </a>
        </div>

        {/* Right Item: Hours */}
        <div className="flex items-center justify-center md:justify-end gap-1.5 text-slate-300">
          <Clock className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          <span>{CONTACT_INFO.hours.display}</span>
        </div>
      </div>
    </div>
  );
}
