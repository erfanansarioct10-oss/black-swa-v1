import { MainHeader } from "@/components/layout/main-header";
import { PublicFooter } from "@/components/layout/public-footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Main Opaque Sticky Header with Logo, Navigation Links, Quote Cart & CTA */}
      <MainHeader />

      {/* Dynamic Content Page Body */}
      <main className="flex-1 w-full">{children}</main>

      {/* Multi-column Industrial Footer */}
      <PublicFooter />
    </div>
  );
}
