import Link from "next/link";
import { Cpu, Server, Activity, Wrench, ArrowRight } from "lucide-react";
import { generatePageMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { SITE_CONFIG } from "@/constants/site";

export const metadata = generatePageMetadata({
  title: "System Integration & Technical Services",
  description:
    "Custom medical device system integration, broadcast server rack buildouts, DICOM compliance calibration, and global SLA maintenance.",
  path: "/services",
});

export default function ServicesPage() {
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Medical Technology & Broadcast System Integration",
    provider: {
      "@type": "Organization",
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
    },
    areaServed: "Global",
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Engineering & Hardware Integration Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Medical Hardware System Integration",
            description: "Custom assembly, DICOM compliance calibration, and HIPAA security hardening.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Broadcast Hardware Configuration",
            description: "Rack assembly, SDI/IP routing configuration, and 8K encoding cluster optimization.",
          },
        },
      ],
    },
  };

  return (
    <div className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-10">
      <JsonLd data={serviceSchema} />
      <Breadcrumbs items={[{ label: "Services", href: "/services" }]} />

      <div className="space-y-4 text-center sm:text-left border-b border-border pb-8">
        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
          Expert Services
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-foreground tracking-tight">
          System Integration & Technical Services
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl">
          From custom broadcast hardware assembly to medical device system integration, our specialized engineering teams ensure operational continuity and compliance.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[
          {
            icon: Activity,
            title: "Medical Hardware System Integration",
            desc: "Custom assembly, DICOM compliance calibration, and HIPAA security hardening for hospital diagnostic processing hardware.",
          },
          {
            icon: Server,
            title: "Broadcast Media Server Assembly",
            desc: "High-density rack-mount server configuration, GPU array optimization, and low-latency 12G-SDI video card integration.",
          },
          {
            icon: Cpu,
            title: "Custom Embedded Computing Solutions",
            desc: "Tailored micro-architecture configuration and firmware customization for specialized broadcast and medical hardware.",
          },
          {
            icon: Wrench,
            title: "24/7 Enterprise Hardware Maintenance",
            desc: "Mission-critical hardware diagnostics, rapid component replacement, and 24/7 technical infrastructure support.",
          },
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="p-6 bg-card border border-border rounded-xl space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center text-foreground">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-foreground">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="pt-4 border-t border-border">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
                >
                  <span>Inquire About Service</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
