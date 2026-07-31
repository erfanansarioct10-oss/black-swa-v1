import Image from "next/image";
import { Building2, Award } from "lucide-react";
import { COMPANY_VALUES } from "@/constants/about";

export function AboutCompanyProfile() {
  return (
    <section className="w-full bg-gradient-to-b from-slate-50/80 via-white to-slate-50/80 py-14 sm:py-20 lg:py-24 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Image Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-lg lg:max-w-none">
              <div className="relative rounded-2xl bg-white p-3 border border-slate-200/90 shadow-xl overflow-hidden hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-slate-100">
                  <Image
                    src="/about/broadcast-headend.png"
                    alt="Simulcast Technologies Digital Broadcasting Head-end Infrastructure"
                    fill
                    sizes="(min-width: 1024px) 35vw, (min-width: 640px) 60vw, 90vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Floating Badge Overlay */}
                <div className="absolute bottom-6 left-6 right-6 bg-brand-onyx/90 backdrop-blur-md text-white p-4 rounded-xl border border-brand-marble/50 shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="flex shrink-0 items-center justify-center h-10 w-10 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30">
                      <Award className="h-5 w-5 text-blue-400" />
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Company Profile</p>
                      <p className="text-sm font-bold text-white">Simulcast Technologies Pvt. Ltd</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Detailed Story */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200/90 text-brand-granite text-xs font-bold uppercase tracking-wider shadow-2xs">
              <Building2 className="h-4 w-4 text-blue-500" />
              <span>Company Profile &amp; Legacy</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-brand-onyx leading-tight uppercase">
              Full-Service Provider of Broadcast, IT &amp; Software Solutions
            </h2>

            <p className="text-base sm:text-lg text-brand-granite leading-relaxed">
              Established in 2019 under the Company Act of 2063 BS in Nepal, <strong className="text-brand-onyx">Simulcast Technologies Pvt. Ltd</strong> (operating alongside <strong className="text-brand-onyx">Black Swan International</strong>) operates as a primary broadcaster integrator. We specialize in digital video broadcasting (DVB-C, DVB-S2, IPTV), over-the-top (OTT) content delivery platforms, custom IT software development, and Annual Maintenance Contracts (AMC).
            </p>

            <p className="text-sm sm:text-base text-brand-granite leading-relaxed">
              As a full-service broadcasting integrator, we assist media companies and telecommunications providers with the complete lifecycle of their transmission hardware and software—from system design and equipment commissioning to round-the-clock maintenance.
            </p>

            {/* Core Values / Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              {COMPANY_VALUES.map((val, idx) => {
                const IconComponent = val.icon;
                return (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2 text-left hover:bg-white hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                  >
                    <IconComponent className="h-5 w-5 text-blue-600" />
                    <h3 className="text-sm font-bold text-brand-onyx">{val.title}</h3>
                    <p className="text-xs text-brand-granite leading-normal">{val.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
