"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { CONTACT_INFO } from "@/constants/contact";
import { ALL_SERVICES } from "@/constants/services";
import { InquiryForm } from "./inquiry-form";

function ContactFormInner() {
  const searchParams = useSearchParams();
  const serviceSlug = searchParams.get("service");
  const matchingService = ALL_SERVICES.find((s) => s.slug === serviceSlug);
  const defaultServiceName = matchingService ? matchingService.title : undefined;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-4">
      {/* Direct Contact Information Cards */}
      <div className="lg:col-span-5 space-y-8">
        <div className="bg-card text-card-foreground p-6 sm:p-8 rounded-xl border border-border space-y-6 shadow-sm">
          <h2 className="text-xl font-bold text-foreground pb-2 border-b border-border">
            Headquarters & Support
          </h2>

          <div className="space-y-5 text-sm">
            <div className="flex items-start gap-4">
              <MapPin className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-foreground">Global Headquarters</p>
                <p className="text-muted-foreground leading-snug">
                  {CONTACT_INFO.address.line1}, {CONTACT_INFO.address.suite} <br />
                  {CONTACT_INFO.address.district}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Phone className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-foreground">Telephone</p>
                <a
                  href={CONTACT_INFO.phone.href}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {CONTACT_INFO.phone.display}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Mail className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-foreground">Inquiries & Quotes</p>
                <a
                  href={CONTACT_INFO.email.href}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {CONTACT_INFO.email.display}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Clock className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-foreground">Business Hours</p>
                <p className="text-muted-foreground">
                  {CONTACT_INFO.hours.display}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-brand-charcoal text-white p-6 sm:p-8 rounded-xl border border-brand-marble/40 space-y-4">
          <h3 className="font-bold text-lg text-white">Emergency Hardware Support</h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Existing enterprise healthcare systems and broadcast network operators with active 24/7 SLA contracts should contact their dedicated system engineer directly.
          </p>
        </div>
      </div>

      {/* Inquiry Form */}
      <div className="lg:col-span-7 bg-card p-6 sm:p-8 rounded-xl border border-border shadow-sm">
        <InquiryForm defaultService={defaultServiceName} />
      </div>
    </div>
  );
}

export function ContactForm() {
  return (
    <Suspense fallback={<div className="py-12 text-center text-muted-foreground">Loading inquiry form...</div>}>
      <ContactFormInner />
    </Suspense>
  );
}


