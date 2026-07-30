import Link from "next/link";
import { ShieldCheck, Award, Target, ArrowRight } from "lucide-react";
import { generatePageMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { SITE_CONFIG } from "@/constants/site";
import { FeatureCard } from "@/components/ui/feature-card";

export const metadata = generatePageMetadata({
  title: "About Black Swan International",
  description:
    "Learn about Black Swan International's mission, engineering excellence, and 15+ years of supplying certified medical & broadcast computing hardware globally.",
  path: "/about",
});

export default function AboutPage() {
  const aboutSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "About Black Swan International",
    description: "Pioneering Medical & Broadcast Hardware Solutions Provider",
    publisher: {
      "@type": "Organization",
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
    },
  };

  return (
    <div className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-12">
      <JsonLd data={aboutSchema} />
      <Breadcrumbs items={[{ label: "About Us", href: "/about" }]} />

      {/* Hero Intro Section */}
      <div className="space-y-4 max-w-3xl">
        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
          About Black Swan International
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-foreground tracking-tight">
          Enterprise Infrastructure & Hardware Innovation
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
          For over 15 years, Black Swan International has supplied medical imaging technology, telehealth hardware gateways, broadcast computing servers, and high-performance media infrastructure worldwide.
        </p>
      </div>

      {/* Values Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {[
          {
            icon: ShieldCheck,
            title: "Certified Reliability",
            desc: "Every medical device terminal and broadcast processing server undergoes rigorous stress testing and compliance verification.",
          },
          {
            icon: Target,
            title: "Precision System Architecture",
            desc: "Low-latency video encoding hardware and HIPAA-compliant telemedicine gateways engineered to exact technical standards.",
          },
          {
            icon: Award,
            title: "Global Supply Chain",
            desc: "Mission-critical hardware deployment network ensuring zero operational downtime for healthcare networks and live broadcasters.",
          },
        ].map((item, idx) => (
          <FeatureCard
            key={idx}
            icon={item.icon}
            title={item.title}
            desc={item.desc}
          />
        ))}
      </div>

      {/* CTA Banner */}
      <div className="p-8 sm:p-12 bg-brand-onyx text-white rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center sm:text-left">
          <h2 className="text-2xl font-bold">Need Custom Hardware Infrastructure Guidance?</h2>
          <p className="text-sm text-slate-300">
            Consult directly with our system integration team for technical specifications and volume quotes.
          </p>
        </div>
        <Link
          href="/contact"
          className="px-6 py-3 bg-white text-brand-onyx font-bold rounded-lg hover:bg-slate-100 transition-colors shrink-0 flex items-center gap-2"
        >
          <span>Contact System Engineers</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
