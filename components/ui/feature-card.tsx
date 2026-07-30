import Link from "next/link";
import { ArrowRight, type LucideIcon } from "lucide-react";

export interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  desc: string;
  href?: string;
  linkText?: string;
  className?: string;
}

export function FeatureCard({
  icon: Icon,
  title,
  desc,
  href,
  linkText = "Learn More",
  className = "",
}: FeatureCardProps) {
  return (
    <div
      className={`p-6 bg-card border border-border rounded-xl space-y-4 flex flex-col justify-between ${className}`}
    >
      <div className="space-y-3">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-accent flex items-center justify-center text-foreground">
          <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-foreground">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {desc}
        </p>
      </div>

      {href && (
        <div className="pt-4 border-t border-border">
          <Link
            href={href}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
          >
            <span>{linkText}</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}
    </div>
  );
}
