import { MapPin, ExternalLink, Mail, Phone } from "lucide-react";
import { InquiryForm } from "@/components/contact/inquiry-form";
import { CONTACT_INFO } from "@/constants/contact";

export function GetInTouchSection() {
  return (
    <section className="relative w-full bg-gradient-to-b from-slate-50/80 via-white to-slate-50/80 border-b border-slate-200/80 py-14 sm:py-20 lg:py-24 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute top-1/2 right-1/4 translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200/90 text-brand-granite text-xs font-bold uppercase tracking-wider shadow-2xs">
            <MapPin className="h-4 w-4 text-blue-500" />
            <span>Get in Touch</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-brand-onyx leading-tight uppercase">
            CONTACT OUR TECHNICAL SALES &amp; ENGINEERING TEAM
          </h2>

          <p className="text-sm sm:text-base text-brand-granite leading-relaxed">
            Have questions regarding custom medical imaging processors, broadcast server configurations, or enterprise integration? Send us a message or visit our global operations center.
          </p>
        </div>

        {/* 2-Column Content Layout with Gray Metallic Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          {/* Left Column: Dark/Gray Card Reusable Contact Inquiry Form */}
          <div className="lg:col-span-6 bg-brand-charcoal text-white p-6 sm:p-8 rounded-2xl border border-brand-marble/80 shadow-lg flex flex-col justify-between">
            <InquiryForm
              variant="dark"
              title="SEND US A MESSAGE"
              subtitle="Provide your technical requirements below and our team will get back to you within 1 business day."
            />
          </div>

          {/* Right Column: Dark/Gray Card Embedded Square Google Map */}
          <div className="lg:col-span-6 bg-brand-charcoal text-white p-4 sm:p-6 rounded-2xl border border-brand-marble/80 shadow-lg flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between border-b border-brand-marble/60 pb-3">
              <div>
                <h3 className="text-lg font-bold text-white uppercase">OUR LOCATION</h3>
                <p className="text-xs text-slate-300">Global Headquarters &amp; Hardware Operations Center</p>
              </div>

              <a
                href="https://goo.gl/maps/t5CsYQntExX9mF3y9?g_st=aw"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors"
              >
                <span>Full Map</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>

            {/* Embedded Square Google Map Container */}
            <div className="relative aspect-square w-full rounded-xl overflow-hidden border border-brand-marble/60 bg-brand-onyx shadow-inner">
              <iframe
                src="https://maps.google.com/maps?q=27.688477,85.344228&z=15&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                sandbox="allow-scripts allow-same-origin allow-popups"
                title="Black Swan International Google Map Location"
                className="absolute inset-0 w-full h-full"
              />
            </div>

            {/* Quick Location Meta Info Footer */}
            <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <Phone className="h-4 w-4 text-blue-400 shrink-0" />
                <a href={CONTACT_INFO.phone.href} className="hover:text-white transition-colors">
                  {CONTACT_INFO.phone.display}
                </a>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Mail className="h-4 w-4 text-blue-400 shrink-0" />
                <a href={CONTACT_INFO.email.href} className="hover:text-white transition-colors truncate">
                  {CONTACT_INFO.email.display}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
