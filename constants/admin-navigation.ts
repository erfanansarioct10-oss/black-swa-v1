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
 * Checks whether a navigation item matches the current pathname.
 */
export function isNavItemActive(pathname: string, href: string): boolean {
  if (href === "/admin") {
    return pathname === "/admin";
  }
  return pathname.startsWith(href);
}
