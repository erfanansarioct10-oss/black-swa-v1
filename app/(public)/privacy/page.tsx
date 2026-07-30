export default function PrivacyPage() {
  return (
    <div className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full space-y-8">
      <div className="space-y-4 border-b border-border pb-6">
        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
          Legal Notice
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-sm text-muted-foreground">
          Last updated: July 30, 2026
        </p>
      </div>

      <div className="space-y-6 text-sm text-muted-foreground leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-foreground">1. Data Collection</h2>
          <p>
            Black Swan International collects business contact information provided voluntarily when submitting quotation requests, inquiry forms, or creating account credentials. This includes names, corporate emails, telephone numbers, company names, and technical specifications.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-foreground">2. Purpose of Processing</h2>
          <p>
            Collected information is strictly utilized to process RFQs, generate quotation documentation, fulfill engineering inquiries, manage client accounts, and comply with legal regulatory obligations.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-foreground">3. Security & Storage</h2>
          <p>
            We deploy industry-standard enterprise security controls, encrypted communication protocols, and strict access governance to safeguard client data against unauthorized access or disclosure.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-foreground">4. Contact Us</h2>
          <p>
            If you have questions regarding this Privacy Policy, please email our compliance team at sales@blackswan-intl.com.
          </p>
        </section>
      </div>
    </div>
  );
}
