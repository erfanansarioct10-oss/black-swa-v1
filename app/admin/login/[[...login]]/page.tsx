import { SignIn } from "@clerk/nextjs";
import { generatePageMetadata } from "@/lib/seo";

export const metadata = generatePageMetadata({
  title: "Admin Portal Sign In | Commercial B2B RFQ",
  description: "Secure administrative portal sign in for Black Swan International staff.",
  path: "/admin/login",
});

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md space-y-6 text-center">
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Internal Staff Portal
          </span>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            Black Swan Admin Sign In
          </h1>
          <p className="text-xs text-muted-foreground">
            Restricted to authorized Managing Directors and Sales Engineering personnel.
          </p>
        </div>

        <div className="flex justify-center">
          <SignIn
            fallbackRedirectUrl="/admin"
            appearance={{
              elements: {
                rootBox: "w-full",
                cardBox: "w-full shadow-lg border border-border bg-card",
              },
            }}
          />

        </div>
      </div>
    </div>
  );
}
