import { generatePageMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { SITE_CONFIG } from "@/constants/site";
import { ALL_SERVICES } from "@/constants/services";
import { ServicesClientGrid } from "@/components/services/services-client-grid";
import { Wrench } from "lucide-react";

export const metadata = generatePageMetadata({
  title: "Broadcast Systems & Technical Engineering Services",
  description:
    "Turnkey playout scheduler automation, newsroom computer systems (NRCS), media asset management (MAM), real-time 3D graphics, IPTV headends, and OB van engineering.",
  path: "/services",
});

export default function ServicesPage() {
  const serviceCatalogSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Broadcast & Media Technology System Integration",
    provider: {
      "@type": "Organization",
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
    },
    areaServed: "Global",
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Turnkey Broadcast Engineering & Technical Services",
      itemListElement: ALL_SERVICES.map((serv) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: serv.title,
          description: serv.desc,
          url: `${SITE_CONFIG.url}/services/${serv.slug}`,
        },
      })),
    },
  };

  return (
    <div className="w-full min-h-screen bg-slate-50/60 text-slate-900 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <JsonLd data={serviceCatalogSchema} />

      <div className="max-w-7xl mx-auto w-full space-y-8 sm:space-y-12">
        {/* Breadcrumb Navigation */}
        <Breadcrumbs items={[{ label: "Services", href: "/services" }]} />

        {/* Hero Header Section */}
        <div className="relative bg-white text-slate-900 rounded-2xl border border-slate-200/90 p-6 sm:p-10 space-y-4 overflow-hidden shadow-sm">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold uppercase tracking-wider">
            <Wrench className="h-4 w-4 text-blue-600" />
            <span>Turnkey Broadcast Systems & SLA Support</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 uppercase leading-tight">
            System Integration & Technical Services
          </h1>

          <p className="text-slate-600 text-sm sm:text-base lg:text-lg max-w-4xl leading-relaxed">
            From 24/7 linear playout automation and newsroom computer systems (NRCS) to high-density IP TV headends, satellite teleport operations, and custom OB van coachbuilding—explore our 15 specialized engineering solutions backed by guaranteed SLA support.
          </p>

          {/* Quick Statistics Bar */}
          <div className="pt-6 border-t border-slate-200/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center sm:text-left">
            <div>
              <span className="text-xl sm:text-2xl font-black text-slate-900">15+</span>
              <p className="text-xs text-slate-500 uppercase font-semibold">Specialized Services</p>
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-black text-emerald-600">99.999%</span>
              <p className="text-xs text-slate-500 uppercase font-semibold">Playout Uptime SLA</p>
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-black text-blue-600">MOS 4.0</span>
              <p className="text-xs text-slate-500 uppercase font-semibold">Newsroom Certified</p>
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-black text-slate-900">24/7/365</span>
              <p className="text-xs text-slate-500 uppercase font-semibold">Engineering NOC</p>
            </div>
          </div>
        </div>

        {/* Main Filterable Services Grid */}
        <ServicesClientGrid services={ALL_SERVICES} />
      </div>
    </div>
  );
}
