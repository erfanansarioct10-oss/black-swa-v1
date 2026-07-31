import { generatePageMetadata } from "@/lib/seo";
import { SITE_CONFIG } from "@/constants/site";
import { JsonLd } from "@/components/seo/json-ld";
import { AboutHero } from "@/components/sections/about/about-hero";
import { AboutStats } from "@/components/sections/about/about-stats";
import { AboutCompanyProfile } from "@/components/sections/about/about-company-profile";
import { AboutWhoWeAre } from "@/components/sections/about/about-who-we-are";
import { AboutWhatWeDo } from "@/components/sections/about/about-what-we-do";
import { AboutHowWeAssist } from "@/components/sections/about/about-how-we-assist";
import { AboutCta } from "@/components/sections/about/about-cta";

export const metadata = generatePageMetadata({
  title: "About Us | Broadcast Integration, DVB & IT Solutions",
  description:
    "Learn about Simulcast Technologies & Black Swan International's 15+ years of engineering leadership in DVB-C/S2 head-ends, IPTV, OTT platforms, IT software solutions, and 24/7 AMC maintenance.",
  path: "/about",
});

export default function AboutPage() {
  const aboutSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "About Simulcast Technologies & Black Swan International",
    description:
      "Full-service provider of broadcasting integration, digital video broadcasting (DVB-C, DVB-S2, IPTV), OTT platforms, custom IT software solutions, and Annual Maintenance Contracts (AMC).",
    url: `${SITE_CONFIG.url}/about`,
    publisher: {
      "@type": "Organization",
      name: SITE_CONFIG.name,
      legalName: "Simulcast Technologies Pvt. Ltd",
      foundingDate: "2019",
      description:
        "Private limited company established under the Company Act of 2063 BS in Nepal, offering broadcast integration, DVB head-ends, OTT platforms, and IT software solutions.",
      url: SITE_CONFIG.url,
      logo: `${SITE_CONFIG.url}${SITE_CONFIG.ogImage}`,
      knowsAbout: [
        "Digital Video Broadcasting",
        "DVB-C",
        "DVB-S2",
        "IPTV Head-end Systems",
        "OTT Platforms",
        "Broadcasting Systems Integration",
        "Annual Maintenance Contracts",
        "Custom Software Solutions",
      ],
    },
  };

  return (
    <div className="w-full min-h-screen flex flex-col bg-white">
      <JsonLd data={aboutSchema} />
      <AboutHero />
      <AboutStats />
      <AboutCompanyProfile />
      <AboutWhoWeAre />
      <AboutWhatWeDo />
      <AboutHowWeAssist />
      <AboutCta />
    </div>
  );
}
