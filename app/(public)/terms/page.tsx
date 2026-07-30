export default function TermsPage() {
  return (
    <div className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full space-y-8">
      <div className="space-y-4 border-b border-border pb-6">
        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
          Legal Agreement
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
          Terms of Service
        </h1>
        <p className="text-sm text-muted-foreground">
          Last updated: July 30, 2026
        </p>
      </div>

      <div className="space-y-6 text-sm text-muted-foreground leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-foreground">1. Commercial Terms & Quotations</h2>
          <p>
            All product specifications, lead times, and preliminary pricing rendered via the Black Swan International online portal constitute non-binding estimates. Formal binding quotations are issued solely by designated Managing Directors upon engineering review.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-foreground">2. Intellectual Property</h2>
          <p>
            All trade marks, CAD schematics, technical documentation, product images, and site content remain the exclusive intellectual property of Black Swan International and its licensing partners.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-foreground">3. Limitation of Liability</h2>
          <p>
            Black Swan International shall not be liable for indirect, incidental, or consequential damages resulting from website unavailability or delay in quotation processing.
          </p>
        </section>
      </div>
    </div>
  );
}
