"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  ExternalLink,
  FileDown,
  Check,
  Calendar,
  Building,
  Info,
  ArrowRight,
} from "lucide-react";
import {
  CERTIFICATIONS_DATA,
  getCertificationIcon,
  type CertificationItem,
} from "@/constants/certifications";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface CertificationsSectionProps {
  /**
   * Optional custom certification dataset.
   * Defaults to CERTIFICATIONS_DATA from constants/certifications.ts.
   * Allows replacing certifications dynamically via CMS or API in the future.
   */
  certifications?: CertificationItem[];
  title?: string;
  subtitle?: string;
}

export function CertificationsSection({
  certifications = CERTIFICATIONS_DATA,
  title = "Certified Quality & Safety Standards",
  subtitle = "Our hardware infrastructure, medical devices, and broadcast encoding systems strictly adhere to global quality, safety, and regulatory frameworks.",
}: CertificationsSectionProps) {
  const [selectedCert, setSelectedCert] = useState<CertificationItem | null>(null);

  return (
    <section className="relative w-full bg-brand-onyx text-white border-y border-brand-marble/40 py-16 sm:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Subtle background ambient lighting */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-radial from-brand-charcoal/80 via-brand-onyx to-brand-onyx rounded-full blur-3xl opacity-60" />

      <div className="relative z-10 max-w-7xl mx-auto w-full space-y-12 sm:space-y-16">
        {/* Header Container */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-charcoal text-slate-300 border border-brand-marble text-xs font-semibold uppercase tracking-wider">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>Global Compliance & Safety</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white uppercase">
            {title}
          </h2>

          <p className="text-sm sm:text-base lg:text-lg text-slate-300 leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Responsive Grid of Cards (Gray bg-accent cards inside Dark Section) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {certifications.map((cert) => {
            const IconComponent = getCertificationIcon(cert.iconName);

            return (
              <div
                key={cert.id}
                className="group relative bg-accent hover:bg-slate-200/90 border border-slate-300/80 rounded-2xl p-6 sm:p-7 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between text-brand-onyx"
              >
                <div className="space-y-5">
                  {/* Top Bar: Icon Seal & Status Badge */}
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-white border border-slate-300/80 flex items-center justify-center text-brand-onyx group-hover:bg-brand-onyx group-hover:text-white transition-colors duration-300 shadow-2xs">
                      <IconComponent className="h-6 w-6" />
                    </div>

                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border shadow-2xs ${cert.badgeColor}`}
                    >
                      <Check className="h-3 w-3 stroke-[3]" />
                      <span>{cert.status}</span>
                    </span>
                  </div>

                  {/* Code & Title */}
                  <div className="space-y-1.5">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-slate-600">
                      {cert.code}
                    </span>
                    <h3 className="text-lg font-extrabold text-brand-onyx leading-snug group-hover:text-blue-700 transition-colors">
                      {cert.title}
                    </h3>
                  </div>

                  {/* Summary */}
                  <p className="text-sm text-slate-700 leading-relaxed line-clamp-3">
                    {cert.summary}
                  </p>

                  {/* Category Tag */}
                  <div className="pt-1">
                    <span className="inline-block px-2.5 py-1 rounded-md bg-white border border-slate-300/70 text-slate-700 text-xs font-semibold shadow-2xs">
                      {cert.categoryLabel}
                    </span>
                  </div>
                </div>

                {/* Bottom Action CTA */}
                <div className="pt-6 mt-6 border-t border-slate-300/60 flex items-center justify-between">
                  <span className="text-xs text-slate-600 font-medium truncate max-w-[150px]">
                    {cert.issuingBody.split("/")[0]}
                  </span>

                  <button
                    type="button"
                    onClick={() => setSelectedCert(cert)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-onyx hover:text-blue-700 transition-colors focus-visible:outline-2 focus-visible:outline-blue-700 rounded-md py-1 px-2 cursor-pointer"
                    aria-label={`View detail specifications for ${cert.code}`}
                  >
                    <span>View Specifications</span>
                    <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Global Compliance Assurance Footer Note */}
        <div className="bg-brand-charcoal border border-brand-marble/70 rounded-xl p-5 sm:p-6 text-center max-w-4xl mx-auto shadow-md flex flex-col sm:flex-row items-center justify-between gap-4 text-white">
          <div className="flex items-center gap-3 text-left">
            <div className="w-10 h-10 rounded-full bg-emerald-950/70 border border-emerald-500/40 shrink-0 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">
                Require Custom Compliance & Audit Documentation?
              </h4>
              <p className="text-xs text-slate-300">
                We provide full technical regulatory binders, test reports, and declaration of conformity upon request.
              </p>
            </div>
          </div>

          <Link
            href="/contact"
            className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 bg-white text-brand-onyx text-xs font-bold rounded-lg hover:bg-slate-100 transition-all shadow-xs"
          >
            <span>Request Audit Package</span>
            <ExternalLink className="h-3.5 w-3.5 text-brand-onyx" />
          </Link>
        </div>
      </div>

      {/* Accessible Detail Modal Dialog */}
      <Dialog open={!!selectedCert} onOpenChange={(open) => !open && setSelectedCert(null)}>
        {selectedCert && (
          <DialogContent className="sm:max-w-lg w-[calc(100%-2rem)] max-h-[90vh] overflow-y-auto rounded-2xl p-6 sm:p-8 bg-white text-brand-onyx border border-slate-200">
            <DialogHeader className="space-y-3">
              <div className="flex items-center justify-between gap-2 pr-6">
                <span className="text-xs font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                  {selectedCert.code}
                </span>

                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase border ${selectedCert.badgeColor}`}
                >
                  <Check className="h-3 w-3 stroke-[3]" />
                  <span>{selectedCert.status}</span>
                </span>
              </div>

              <DialogTitle className="text-xl sm:text-2xl font-extrabold text-brand-onyx">
                {selectedCert.title}
              </DialogTitle>
              <DialogDescription className="text-xs sm:text-sm text-slate-500">
                Official Compliance Specification & Accreditation Summary
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-5 py-4 text-sm border-y border-slate-100 my-2">
              {/* Scope */}
              <div className="space-y-1.5">
                <h5 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Info className="h-4 w-4 text-blue-600" />
                  <span>Certified Scope of Coverage</span>
                </h5>
                <p className="text-slate-700 leading-relaxed text-xs sm:text-sm bg-slate-50 p-3.5 rounded-xl border border-slate-200/60">
                  {selectedCert.scope}
                </p>
              </div>

              {/* Full Details */}
              <div className="space-y-1">
                <h5 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                  Standards Compliance Summary
                </h5>
                <p className="text-slate-600 leading-relaxed text-xs sm:text-sm">
                  {selectedCert.details}
                </p>
              </div>

              {/* Specification Meta Metadata */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
                    <Building className="h-3.5 w-3.5" />
                    <span>Issuing Accreditation Body</span>
                  </div>
                  <p className="text-xs font-bold text-brand-onyx">
                    {selectedCert.issuingBody}
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>Validity & Audit Cycle</span>
                  </div>
                  <p className="text-xs font-bold text-brand-onyx">
                    {selectedCert.validityRange || "Continuous"} ({selectedCert.auditFrequency})
                  </p>
                </div>
              </div>

              {/* Registration Reference ID */}
              <div className="p-3 bg-slate-900 text-white rounded-xl flex items-center justify-between text-xs">
                <span className="text-slate-400 font-mono">Registration ID:</span>
                <span className="font-mono font-bold text-emerald-400">{selectedCert.certificateId}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <Link
                href="/contact"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-brand-onyx text-white font-bold text-xs rounded-xl hover:bg-brand-charcoal transition-all"
                onClick={() => setSelectedCert(null)}
              >
                <FileDown className="h-4 w-4" />
                <span>Request Verification Binder</span>
              </Link>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </section>
  );
}
