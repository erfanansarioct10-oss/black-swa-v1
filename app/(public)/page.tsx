import { preload } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShieldCheck, FileText } from "lucide-react";
import { AnimatedCount } from "@/components/ui/animated-count";
import { BrandMarquee } from "@/components/sections/brand-marquee";
import { WhoWeAreSection } from "@/components/sections/who-we-are-section";
import { CertificationsSection } from "@/components/sections/certifications-section";
import { FeaturedProductsSection } from "@/components/sections/featured-products-section";
import { PopularServicesSection } from "@/components/sections/popular-services-section";
import { EnterpriseAdvantageSection } from "@/components/sections/enterprise-advantage-section";
import { ProcurementWorkflowSection } from "@/components/sections/procurement-workflow-section";
import { CustomerReviewsSection } from "@/components/sections/customer-reviews-section";
import { GetInTouchSection } from "@/components/sections/get-in-touch-section";
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
  preload("/hero/hero.webp", { as: "image", type: "image/webp", fetchPriority: "high" });
  preload("/logo/logo.webp", { as: "image", type: "image/webp", fetchPriority: "high" });
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    logo: `${SITE_CONFIG.url}/logo/logo.webp`,
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
              <ShieldCheck className="h-4 w-4 text-blue-400" />
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
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white text-brand-onyx font-bold text-sm sm:text-base rounded-lg shadow-md hover:bg-slate-100 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 transition-all duration-200 group cursor-pointer"
              >
                <span>Browse Hardware Catalog</span>
                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/quote"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-brand-charcoal text-white border border-brand-marble font-semibold text-sm sm:text-base rounded-lg hover:bg-brand-marble/50 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 transition-all duration-200 group cursor-pointer"
              >
                <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400" />
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
                src="/hero/hero.webp"
                alt="Medical Technology & Broadcast Computer Hardware Showcase"
                width={900}
                height={750}
                priority
                sizes="(min-width: 1024px) 45vw, 90vw"
                className="relative z-10 w-full h-auto object-contain filter drop-shadow-[0_10px_20px_rgba(37,99,235,0.12)] drop-shadow-xl scale-105 lg:scale-110 origin-center"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Who We Are (About Us) Legacy Section */}
      <WhoWeAreSection />

      {/* Brand Logos Trust Marquee Section */}
      <BrandMarquee />

      {/* Enterprise Advantage & Corporate Trust Grid Section ("Why Choose Black Swan") */}
      <EnterpriseAdvantageSection />

      {/* Certifications & Compliance Section */}
      <CertificationsSection />

      {/* Featured Products Spotlight & Grid Section */}
      <FeaturedProductsSection />

      {/* Popular Engineering & Integration Services Section */}
      <PopularServicesSection />

      {/* Enterprise Procurement Process & Workflow Section */}
      <ProcurementWorkflowSection />

      {/* Customer Reviews & Executive Testimonials Section */}
      <CustomerReviewsSection />

      {/* Get in Touch Section with Contact Form & Embedded Square Google Map */}
      <GetInTouchSection />
    </div>
  );
}
