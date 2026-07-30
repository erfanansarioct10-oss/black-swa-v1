"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
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
      {/* Subtle background ambient lighting & glow */}
      <div className="pointer-events-none absolute inset-0 bg-radial from-brand-charcoal/70 via-brand-onyx to-brand-onyx" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] sm:w-[1000px] h-[500px] bg-gradient-to-tr from-blue-600/20 via-slate-400/15 to-indigo-600/20 rounded-full blur-3xl opacity-70" />

      <div className="relative z-10 max-w-7xl mx-auto w-full space-y-12 sm:space-y-16">
        {/* Header Container */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-charcoal text-slate-300 border border-brand-marble text-xs font-semibold uppercase tracking-wider">
            <ShieldCheck className="h-4 w-4 text-blue-400" />
            <span>Global Compliance & Safety</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white uppercase">
            {title}
          </h2>

          <p className="text-sm sm:text-base lg:text-lg text-slate-300 leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Responsive Grid of Visual Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {certifications.map((cert) => {
            const IconComponent = getCertificationIcon(cert.iconName);

            return (
              <div
                key={cert.id}
                className="group relative bg-brand-charcoal text-white rounded-2xl border border-brand-marble/80 shadow-md flex flex-col justify-between overflow-hidden hover:border-slate-400/60 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                {/* Visual Certification Header Image */}
                <div className="relative w-full aspect-[16/10] bg-brand-onyx overflow-hidden border-b border-brand-marble/60">
                  <Image
                    src={cert.image}
                    alt={cert.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover opacity-95"
                  />

                  {/* Overlaid Badges */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2 z-10">
                    <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-brand-onyx/90 text-slate-300 border border-brand-marble/60 backdrop-blur-xs font-mono">
                      {cert.code}
                    </span>

                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-xs">
                      <Check className="h-3.5 w-3.5 text-emerald-400 stroke-[3]" />
                      <span>{cert.status}</span>
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 sm:p-7 flex flex-col justify-between flex-1 space-y-5">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-brand-onyx border border-brand-marble/60 flex items-center justify-center text-slate-300 shrink-0 shadow-2xs">
                        <IconComponent className="h-5 w-5 text-blue-400" />
                      </div>
                      <span className="inline-block px-2.5 py-1 rounded-md bg-brand-onyx border border-brand-marble/60 text-slate-300 text-xs font-semibold">
                        {cert.categoryLabel}
                      </span>
                    </div>

                    <h3 className="text-lg sm:text-xl font-extrabold text-white leading-snug">
                      {cert.title}
                    </h3>

                    <p className="text-sm text-slate-300 leading-relaxed line-clamp-3">
                      {cert.summary}
                    </p>
                  </div>

                  {/* Bottom Action CTA */}
                  <div className="pt-4 border-t border-brand-marble/50 flex items-center justify-between gap-2">
                    <span className="text-xs text-slate-400 font-mono truncate max-w-[150px]">
                      {cert.issuingBody.split("/")[0]}
                    </span>

                    <button
                      type="button"
                      onClick={() => setSelectedCert(cert)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-white hover:text-slate-300 transition-colors cursor-pointer py-1 px-2.5 rounded-lg bg-brand-onyx border border-brand-marble/60"
                      aria-label={`View detail specifications for ${cert.code}`}
                    >
                      <span>View Specifications</span>
                      <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Global Compliance Assurance Footer Note */}
        <div className="bg-brand-charcoal border border-brand-marble/70 rounded-xl p-5 sm:p-6 text-center max-w-4xl mx-auto shadow-md flex flex-col sm:flex-row items-center justify-between gap-4 text-white">
          <div className="flex items-center gap-3 text-left">
            <div className="w-10 h-10 rounded-full bg-brand-onyx border border-brand-marble/60 shrink-0 flex items-center justify-center text-blue-400">
              <ShieldCheck className="h-5 w-5 text-blue-400" />
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
            className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 bg-white text-brand-onyx text-xs font-bold rounded-lg hover:bg-slate-100 transition-all shadow-xs cursor-pointer"
          >
            <span>Request Audit Package</span>
            <ExternalLink className="h-3.5 w-3.5 text-brand-onyx" />
          </Link>
        </div>
      </div>

      {/* Accessible Detail Modal Dialog */}
      <Dialog open={!!selectedCert} onOpenChange={(open) => !open && setSelectedCert(null)}>
        {selectedCert && (
          <DialogContent className="sm:max-w-lg w-[calc(100%-2rem)] max-h-[90vh] overflow-y-auto rounded-2xl p-6 sm:p-8 bg-brand-charcoal text-white border border-brand-marble">
            <DialogHeader className="space-y-3">
              <div className="flex items-center justify-between gap-2 pr-6">
                <span className="text-xs font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-brand-onyx text-slate-300 border border-brand-marble/60 font-mono">
                  {selectedCert.code}
                </span>

                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
                  <Check className="h-3 w-3 stroke-[3]" />
                  <span>{selectedCert.status}</span>
                </span>
              </div>

              <DialogTitle className="text-xl sm:text-2xl font-extrabold text-white">
                {selectedCert.title}
              </DialogTitle>
              <DialogDescription className="text-xs sm:text-sm text-slate-400">
                Official Compliance Specification & Accreditation Summary
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-5 py-4 text-sm border-y border-brand-marble/50 my-2">
              {/* Scope */}
              <div className="space-y-1.5">
                <h5 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Info className="h-4 w-4 text-slate-400" />
                  <span>Certified Scope of Coverage</span>
                </h5>
                <p className="text-slate-300 leading-relaxed text-xs sm:text-sm bg-brand-onyx p-3.5 rounded-xl border border-brand-marble/60">
                  {selectedCert.scope}
                </p>
              </div>

              {/* Full Details */}
              <div className="space-y-1">
                <h5 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                  Standards Compliance Summary
                </h5>
                <p className="text-slate-300 leading-relaxed text-xs sm:text-sm">
                  {selectedCert.details}
                </p>
              </div>

              {/* Specification Metadata */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-brand-onyx rounded-xl border border-brand-marble/60 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold">
                    <Building className="h-3.5 w-3.5" />
                    <span>Issuing Accreditation Body</span>
                  </div>
                  <p className="text-xs font-bold text-white">
                    {selectedCert.issuingBody}
                  </p>
                </div>

                <div className="p-3 bg-brand-onyx rounded-xl border border-brand-marble/60 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>Validity & Audit Cycle</span>
                  </div>
                  <p className="text-xs font-bold text-white">
                    {selectedCert.validityRange || "Continuous"} ({selectedCert.auditFrequency})
                  </p>
                </div>
              </div>

              {/* Registration Reference ID */}
              <div className="p-3 bg-brand-onyx text-white rounded-xl flex items-center justify-between text-xs border border-brand-marble/60">
                <span className="text-slate-400 font-mono">Registration ID:</span>
                <span className="font-mono font-bold text-emerald-400">{selectedCert.certificateId}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <Link
                href="/contact"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-white text-brand-onyx font-bold text-xs rounded-xl hover:bg-slate-100 transition-all cursor-pointer"
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
