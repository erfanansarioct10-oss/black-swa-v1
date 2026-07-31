import Image from "next/image";
import { Users, Shield, Wrench, Award } from "lucide-react";

export function AboutWhoWeAre() {
  return (
    <section className="w-full bg-slate-50/80 py-14 sm:py-20 lg:py-24 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Text & Features */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200/90 text-brand-granite text-xs font-bold uppercase tracking-wider shadow-2xs">
              <Users className="h-4 w-4 text-blue-500" />
              <span>Who We Are</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-brand-onyx leading-tight uppercase">
              Engineers, System Integrators &amp; Technology Partners
            </h2>

            <p className="text-base sm:text-lg text-brand-granite leading-relaxed">
              We are a team of passionate broadcast engineers, network architects, and software developers dedicated to keeping digital media networks running with 99.9% uptime. Our multidisciplinary expertise bridges hardware head-ends, video encoding algorithms, cloud streaming platforms, and enterprise IT networks.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3.5 p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                <div className="p-2 rounded-lg bg-blue-50 text-blue-600 shrink-0 mt-0.5">
                  <Shield className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-brand-onyx">Broadcaster Integrator Expertise</h3>
                  <p className="text-xs sm:text-sm text-brand-granite">
                    We manage the entire system architecture for cable TV operators, satellite broadcasters, and OTT content providers, ensuring compliance with global broadcasting standards.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                <div className="p-2 rounded-lg bg-blue-50 text-blue-600 shrink-0 mt-0.5">
                  <Wrench className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-brand-onyx">Proactive Maintenance &amp; 24/7 SLA</h3>
                  <p className="text-xs sm:text-sm text-brand-granite">
                    Our technical support engineering team monitors network telemetry round-the-clock, providing fast on-site emergency dispatch and spare parts replacement.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Engineering Team Image */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-lg lg:max-w-none">
              <div className="relative rounded-2xl bg-white p-3 border border-slate-200/90 shadow-xl overflow-hidden hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-slate-100">
                  <Image
                    src="/about/engineering-team.png"
                    alt="Simulcast Technologies Professional Engineering Team"
                    fill
                    sizes="(min-width: 1024px) 35vw, (min-width: 640px) 60vw, 90vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                </div>

                <div className="absolute bottom-6 left-6 right-6 bg-brand-onyx/90 backdrop-blur-md text-white p-4 rounded-xl border border-brand-marble/50 shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="flex shrink-0 items-center justify-center h-10 w-10 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30">
                      <Award className="h-5 w-5 text-blue-400" />
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Professional Teamwork</p>
                      <p className="text-sm font-bold text-white">Certified Broadcast &amp; Software Engineers</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
