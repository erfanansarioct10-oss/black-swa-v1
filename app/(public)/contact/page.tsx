import { Phone, Mail, MapPin, Clock, Send } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-12">
      <div className="space-y-4 text-center sm:text-left border-b border-border pb-8">
        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
          Get in Touch
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-foreground tracking-tight">
          Contact Black Swan International
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl">
          Have inquiries regarding product technical specs, volume quotes, or emergency servicing? Reach out to our engineering support team.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Contact Info Sidebar */}
        <div className="lg:col-span-5 space-y-6 bg-card border border-border p-6 sm:p-8 rounded-2xl">
          <h2 className="text-xl font-bold text-foreground">Global Headquarters</h2>

          <div className="space-y-4 text-sm text-muted-foreground">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <span>100 Industrial Parkway, Suite 400, Industrial District</span>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-primary shrink-0" />
              <a href="tel:+18005550199" className="hover:text-foreground transition-colors">
                +1 (800) 555-0199
              </a>
            </div>

            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-primary shrink-0" />
              <a href="mailto:sales@blackswan-intl.com" className="hover:text-foreground transition-colors">
                sales@blackswan-intl.com
              </a>
            </div>

            <div className="flex items-start gap-3 pt-2 border-t border-border">
              <Clock className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-foreground block">Operating Hours</span>
                <span>Monday - Friday: 8:00 AM - 5:00 PM EST</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7 bg-card border border-border p-6 sm:p-8 rounded-2xl space-y-6">
          <h2 className="text-xl font-bold text-foreground">Send a Direct Message</h2>

          <form className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  className="w-full px-3.5 py-2 text-sm bg-background border border-border rounded-md focus:ring-2 focus:ring-primary outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Company Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Acme Industrial Corp"
                  className="w-full px-3.5 py-2 text-sm bg-background border border-border rounded-md focus:ring-2 focus:ring-primary outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="john@acme.com"
                  className="w-full px-3.5 py-2 text-sm bg-background border border-border rounded-md focus:ring-2 focus:ring-primary outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Phone Number</label>
                <input
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  className="w-full px-3.5 py-2 text-sm bg-background border border-border rounded-md focus:ring-2 focus:ring-primary outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Message / Specifications *</label>
              <textarea
                rows={4}
                required
                placeholder="Describe your equipment needs, serial numbers, or inquiry..."
                className="w-full px-3.5 py-2 text-sm bg-background border border-border rounded-md focus:ring-2 focus:ring-primary outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold text-sm rounded-md shadow-xs hover:opacity-90 transition-opacity"
            >
              <Send className="h-4 w-4" />
              <span>Submit Message</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
