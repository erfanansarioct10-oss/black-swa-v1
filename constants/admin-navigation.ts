import {
  Activity,
  BarChart3,
  FileText,
  LayoutDashboard,
  Mail,
  Package,
  Settings,
  Users,
  Wrench,
  type LucideIcon,
} from "lucide-react";

export interface AdminNavItem {
  title: string;
  href: string;
  iconName: string;
  badge?: string;
}

export interface AdminNavSection {
  title: string;
  items: AdminNavItem[];
}

export const ICON_MAP: Record<string, LucideIcon> = {
  LayoutDashboard,
  BarChart3,
  FileText,
  Mail,
  Users,
  Package,
  Wrench,
  Activity,
  Settings,
};

export const ADMIN_NAV_SECTIONS: AdminNavSection[] = [
  {
    title: "Overview",
    items: [
      { title: "Executive Dashboard", href: "/admin", iconName: "LayoutDashboard" },
      { title: "Analytics & Reports", href: "/admin/analytics", iconName: "BarChart3" },
    ],
  },
  {
    title: "CRM & Operations",
    items: [
      { title: "Quote Requests", href: "/admin/quotes", iconName: "FileText", badge: "RFQ" },
      { title: "Contact Inquiries", href: "/admin/inquiries", iconName: "Mail" },
      { title: "Customer Database", href: "/admin/customers", iconName: "Users" },
    ],
  },
  {
    title: "Catalog & Content",
    items: [
      { title: "Product Catalog", href: "/admin/products", iconName: "Package" },
      { title: "Service Offerings", href: "/admin/services", iconName: "Wrench" },
    ],
  },
  {
    title: "Management",
    items: [
      { title: "System Diagnostics", href: "/admin/diagnostics", iconName: "Activity" },
      { title: "Settings & Access", href: "/admin/settings", iconName: "Settings" },
    ],
  },
];

/**
 * Derives the active page title for the admin header breadcrumb.
 */
export function getAdminRouteTitle(pathname: string): string {
  for (const section of ADMIN_NAV_SECTIONS) {
    for (const item of section.items) {
      if (item.href === pathname) {
        return item.title;
      }
    }
  }
  return "Admin Portal";
}

/**
 * Checks whether a navigation item matches the current pathname.
 * Prevents partial prefix matching (e.g. /admin/settings-legacy matching /admin/settings).
 */
export function isNavItemActive(pathname: string, href: string): boolean {
  if (href === "/admin") {
    return pathname === "/admin";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}
