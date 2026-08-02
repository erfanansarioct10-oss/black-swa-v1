import Link from "next/link";
import { SignOutButton } from "@clerk/nextjs";
import { ArrowLeft, LogOut, Mail, ShieldAlert, UserCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { generatePageMetadata } from "@/lib/seo";

export const metadata = generatePageMetadata({
  title: "Access Restricted | Administrative Portal",
  description: "Insufficient administrative authorization permissions for Black Swan International portal.",
  path: "/admin/unauthorized",
});

export default function AdminUnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-lg space-y-6 text-center">
        {/* Security Shield Icon Header */}
        <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 border border-destructive/20 flex items-center justify-center text-destructive">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-destructive">
            403 Forbidden Access
          </span>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            Administrative Access Required
          </h1>
          <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
            Your authenticated user account does not possess the required Executive Role permissions (
            <code className="text-xs font-mono font-bold bg-muted px-1.5 py-0.5 rounded border border-border">
              admin
            </code>{" "}
            or{" "}
            <code className="text-xs font-mono font-bold bg-muted px-1.5 py-0.5 rounded border border-border">
              org:admin
            </code>
            ) to view administrative records or executive dashboards.
          </p>
        </div>

        {/* Informational Guidance Box */}
        <div className="p-4 rounded-xl border border-border bg-card text-left space-y-3 text-xs text-muted-foreground shadow-xs">
          <div className="flex items-center gap-2 text-foreground font-semibold">
            <UserCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Need Executive Access?</span>
          </div>
          <p>
            If you are an authorized Black Swan Managing Director or Sales Engineering staff member, please request role elevation from your organization administrator or contact executive support.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <SignOutButton redirectUrl="/admin/login">
            <Button variant="default" className="w-full sm:w-auto min-h-[44px] gap-2 font-semibold">
              <LogOut className="w-4 h-4" />
              <span>Sign Out & Switch Account</span>
            </Button>
          </SignOutButton>

          <Button variant="outline" asChild className="w-full sm:w-auto min-h-[44px] gap-2">
            <a href="mailto:admin@blackswan.com.np?subject=Admin%20Portal%20Role%20Access%20Request">
              <Mail className="w-4 h-4" />
              <span>Contact Director</span>
            </a>
          </Button>
        </div>

        {/* Return to Public Site */}
        <div className="pt-4 border-t border-border">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Public Homepage</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
