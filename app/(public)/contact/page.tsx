import { generatePageMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { ContactForm } from "@/components/contact/contact-form";
import { SITE_CONFIG } from "@/constants/site";
import { CONTACT_INFO } from "@/constants/contact";

export const metadata = generatePageMetadata({
  title: "Contact Us & Global Hardware Support",
  description:
    "Get in touch with Black Swan International for custom medical tech hardware quotes, broadcast server procurement, and 24/7 technical support.",
  path: "/contact",
});

export default function ContactPage() {
  const contactPageSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact Black Swan International",
    description: "Global Headquarters, Technical Sales & Emergency Support Contact Details",
    url: `${SITE_CONFIG.url}/contact`,
    mainEntity: {
      "@type": "LocalBusiness",
      name: SITE_CONFIG.name,
      image: `${SITE_CONFIG.url}/logo/logo.webp`,
      telephone: CONTACT_INFO.phone.display,
      email: CONTACT_INFO.email.display,
      address: {
        "@type": "PostalAddress",
        streetAddress: CONTACT_INFO.address.full,
      },
    },
  };

  return (
    <div className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
      <JsonLd data={contactPageSchema} />
      <Breadcrumbs items={[{ label: "Contact Us", href: "/contact" }]} />

      <div className="space-y-4 text-center sm:text-left border-b border-border pb-6">
        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
          Get in Touch
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-foreground tracking-tight">
          Contact Black Swan International
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl">
          Have questions regarding medical technology hardware, broadcast server racks, or custom system integration? Our engineering and sales team is here to assist.
        </p>
      </div>

      <ContactForm />
    </div>
  );
}
