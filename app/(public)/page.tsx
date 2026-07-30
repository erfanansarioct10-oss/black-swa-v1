import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShieldCheck, Cpu, Tv, Activity, FileText } from "lucide-react";
import { AnimatedCount } from "@/components/ui/animated-count";
import { BrandMarquee } from "@/components/sections/brand-marquee";
import { CertificationsSection } from "@/components/sections/certifications-section";
import { generatePageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { SITE_CONFIG } from "@/constants/site";
import { CONTACT_INFO } from "@/constants/contact";

export const metadata = generatePageMetadata({
  title: "Enterprise Medical & Broadcast Computer Hardware Solutions",
  description:
    "Black Swan International delivers medical imaging processors, telehealth hardware gateways, broadcast media servers, and studio computing infrastructure.",
  path: "/",
});

export default function HomePage() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    logo: `${SITE_CONFIG.url}/logo.webp`,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: CONTACT_INFO.phone.display,
      contactType: "customer service",
      email: CONTACT_INFO.email.display,
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: CONTACT_INFO.address.full,
    },
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
  };

  return (
    <div className="flex flex-col w-full">
      <JsonLd data={[organizationSchema, websiteSchema]} />

      {/* Hero Section */}
      <section className="relative bg-brand-onyx text-white min-h-[calc(100vh-4rem)] sm:min-h-[calc(100vh-5rem)] py-6 sm:py-10 lg:py-12 px-4 sm:px-6 lg:px-8 border-b border-brand-marble/40 overflow-hidden flex items-center">
        {/* Subtle background ambient lighting */}
        <div className="absolute inset-0 bg-radial from-brand-charcoal/60 via-brand-onyx to-brand-onyx pointer-events-none" />

        <div className="relative max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center py-4">
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-7 sm:space-y-8 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-charcoal text-slate-300 border border-brand-marble text-xs font-semibold uppercase tracking-wider">
              <ShieldCheck className="h-4 w-4 text-slate-200" />
              <span>Medical Tech & Broadcast Hardware Solutions</span>
            </div>

            {/* Exactly two lines short and minimum heading */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-white">
              Medical Technology. <br />
              <span className="text-slate-300">Broadcast Computer Hardware.</span>
            </h1>

            <p className="text-sm sm:text-base lg:text-lg text-slate-300 max-w-2xl leading-relaxed">
              Black Swan International delivers enterprise medical imaging processors, telehealth hardware gateways, broadcast media servers, and studio IT computing infrastructure engineered for mission-critical operations.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-3 sm:pt-4 justify-center sm:justify-start">
              <Link
                href="/products"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white text-brand-onyx font-bold text-sm sm:text-base rounded-lg shadow-md hover:bg-slate-100 transition-all"
              >
                <span>Browse Hardware Catalog</span>
                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
              </Link>

              <Link
                href="/quote"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-brand-charcoal text-white border border-brand-marble font-semibold text-sm sm:text-base rounded-lg hover:bg-brand-marble/50 transition-all"
              >
                <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-slate-300" />
                <span>Request Custom Quote</span>
              </Link>
            </div>

            {/* Quick Metrics */}
            <div className="pt-4 sm:pt-5 grid grid-cols-3 gap-6 border-t border-brand-marble/40 text-center sm:text-left">
              <div>
                <AnimatedCount
                  target={15}
                  suffix="+"
                  className="block text-xl sm:text-2xl lg:text-3xl font-extrabold text-white"
                />
                <span className="text-xs text-slate-400">Years Industry Experience</span>
              </div>
              <div>
                <AnimatedCount
                  target={10}
                  suffix="K+"
                  className="block text-xl sm:text-2xl lg:text-3xl font-extrabold text-white"
                />
                <span className="text-xs text-slate-400">Systems Deployed</span>
              </div>
              <div>
                <AnimatedCount
                  target={99.9}
                  decimals={1}
                  suffix="%"
                  className="block text-xl sm:text-2xl lg:text-3xl font-extrabold text-white"
                />
                <span className="text-xs text-slate-400">Uptime Reliability</span>
              </div>
            </div>
          </div>

          {/* Right Visual / Graphic Column */}
          <div className="lg:col-span-5 flex justify-center items-center">
            <div className="relative w-full max-w-xl lg:max-w-2xl animate-float-slow">
              {/* Subtle Blue Glow Background Effect */}
              <div className="absolute -inset-6 sm:-inset-10 bg-gradient-to-tr from-blue-600/25 via-cyan-500/20 to-indigo-600/20 rounded-full blur-3xl opacity-45 pointer-events-none" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 h-4/5 bg-blue-600/15 rounded-full blur-2xl pointer-events-none" />

              <Image
                src="/hero.webp"
                alt="Medical Technology & Broadcast Computer Hardware Showcase"
                width={900}
                height={750}
                priority
                className="relative z-10 w-full h-auto object-contain filter drop-shadow-[0_10px_20px_rgba(37,99,235,0.12)] drop-shadow-xl scale-105 lg:scale-110 origin-center"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Brand Logos Trust Marquee Section */}
      <BrandMarquee />

      {/* Certifications & Compliance Section */}
      <CertificationsSection />



      {/* Product Categories Overview */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center space-y-3 mb-12">
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Our Hardware Specializations
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto">
            High-performance computing infrastructure, medical technology devices, and broadcast hardware solutions.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: Activity,
              title: "Medical Technology Hardware",
              desc: "Diagnostic imaging workstations, clinical processing hardware, and secure medical IoT hardware gateways.",
              href: "/products?category=medical",
            },
            {
              icon: Tv,
              title: "Broadcast Computer Systems",
              desc: "4K/8K real-time media encoding servers, video wall controllers, and studio production computing rigs.",
              href: "/products?category=broadcast",
            },
            {
              icon: Cpu,
              title: "Custom Infrastructure Integration",
              desc: "Bespoke hardware assembly, rack-mount server optimization, and enterprise system support services.",
              href: "/services",
            },
          ].map((cat, idx) => {
            const IconComponent = cat.icon;
            return (
              <div
                key={idx}
                className="group p-6 bg-card border border-border rounded-xl shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center text-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <IconComponent className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">
                    {cat.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {cat.desc}
                  </p>
                </div>

                <div className="pt-6">
                  <Link
                    href={cat.href}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-foreground hover:text-primary transition-colors"
                  >
                    <span>Explore Hardware</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
