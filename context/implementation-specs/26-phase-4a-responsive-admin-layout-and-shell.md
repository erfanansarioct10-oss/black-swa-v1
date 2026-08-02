# Implementation Spec 26: Phase 4A Responsive Admin Layout & Collapsible Sidebar Shell

> **Spec ID:** 26-phase-4a-responsive-admin-layout-and-shell  
> **Target Branch / PR:** `phase4A`  
> **Status:** Complete  
> **Created Date:** 2026-08-02

---

## Executive Summary

Phase 4 of the Black Swan International platform establishes the **Secure Administrative Portal & CRM Dashboard** (`/admin`). Sub-task 4A requires creating a modern, accessible, and responsive admin layout shell featuring a collapsible desktop sidebar, top header navigation bar with user profile/quick actions, and a touch-friendly mobile drawer navigation sheet for viewports down to 320px width.

This specification details the structural architecture, state persistence (`localStorage` & `cookie`), navigation items, Clerk authentication role boundaries, and mobile-first responsive breakdown required for `app/admin/layout.tsx`.

---

## 1. What We Are Going to Do

List of files to be created or modified:

| # | Target File | Action Required |
|---|-------------|-----------------|
| 1 | `constants/admin-navigation.ts` | **[NEW]** Centralized navigation items (Dashboard, Quotes, Inquiries, Catalog, Services, Analytics, Settings) with Lucide icons, role gates, and badge counters. |
| 2 | `components/admin/admin-sidebar.tsx` | **[NEW]** Collapsible Desktop Navigation Sidebar component with collapse/expand toggle, brand logo mark, navigation items, tooltips, and footer controls. |
| 3 | `components/admin/admin-mobile-nav.tsx` | **[NEW]** Mobile Navigation Sheet drawer using `shadcn/ui Sheet` (Radix Dialog) with touch-friendly navigation links and automatic drawer close on route change. |
| 4 | `components/admin/admin-header.tsx` | **[NEW]** Top Administrative Navigation Header with breadcrumb trail, mobile nav trigger toggle, quick quote status indicator, and Clerk `<UserButton showName />`. |
| 5 | `components/providers/admin-shell-provider.tsx` | **[NEW]** React Context Provider for sidebar collapse state (`isCollapsed`), drawer open state (`isMobileOpen`), and `localStorage`/`cookie` state persistence. |
| 6 | `app/admin/layout.tsx` | **[NEW]** Main Administrative Layout wrapping all `/admin/*` sub-routes with `AdminShellProvider`, flex layout structure, security boundaries, and responsive main content area. |

---

## 2. Why We Are Doing This

1. **Mobile-First CRM Standard (`context/code-standards.md`, `context/ui-context.md`):** Internal account managers and directors frequently review quote requests from mobile and tablet devices. The admin portal shell must function flawlessly at 320px+ with touch-friendly target sizing (minimum 44x44px touch targets).
2. **Layout Isolation & Screen Real Estate:** A collapsible sidebar gives power users on desktop maximum canvas space when inspecting large data tables (e.g., equipment lists, audit logs, analytics charts), while keeping navigation accessible via 1-click expand or tooltip hover.
3. **Architectural Consistency (`context/architecture.md`):** Keeps business logic separated from layout components, utilizes Server Components for layout structure with isolated client boundaries for interactive state (sidebar toggle, mobile drawer).

---

## 3. How We Are Going to Implement It

### Step 1: Centralized Navigation Constants (`constants/admin-navigation.ts`)

Define typed navigation items with icons (`lucide-react`), section grouping (Core, Operations, System), and active route matcher utility:

```typescript
export interface AdminNavItem {
  title: string;
  href: string;
  icon: string; // Lucide icon name
  badge?: string;
  roles?: string[];
}

export const ADMIN_NAV_SECTIONS = [
  {
    title: "Overview",
    items: [
      { title: "Executive Dashboard", href: "/admin", icon: "LayoutDashboard" },
      { title: "Analytics & Reports", href: "/admin/analytics", icon: "BarChart3" },
    ],
  },
  {
    title: "CRM & Operations",
    items: [
      { title: "Quote Requests", href: "/admin/quotes", icon: "FileText", badge: "RFQ" },
      { title: "Contact Inquiries", href: "/admin/inquiries", icon: "Mail" },
      { title: "Customer Database", href: "/admin/customers", icon: "Users" },
    ],
  },
  {
    title: "Catalog & Content",
    items: [
      { title: "Product Catalog", href: "/admin/products", icon: "Package" },
      { title: "Service Offerings", href: "/admin/services", icon: "Wrench" },
    ],
  },
  {
    title: "Management",
    items: [
      { title: "System Diagnostics", href: "/admin/diagnostics", icon: "Activity" },
      { title: "Settings & Access", href: "/admin/settings", icon: "Settings" },
    ],
  },
];
```

### Step 2: Admin Shell Provider (`components/providers/admin-shell-provider.tsx`)

Client state management for:
- `isCollapsed` (boolean): Desktop sidebar collapse state with hydration safeguard.
- `isMobileOpen` (boolean): Mobile sheet open/closed state.
- `toggleSidebar()` / `setMobileOpen()`.

### Step 3: Desktop Collapsible Sidebar (`components/admin/admin-sidebar.tsx`)

- Uses Tailwind transitions (`transition-all duration-300`).
- Expands to `w-64` (256px) and collapses to `w-20` (80px).
- Renders full item titles when expanded; renders compact icons with native hover tooltips when collapsed.
- Includes a dedicated collapse toggle button at the bottom of the sidebar.

### Step 4: Mobile Navigation Sheet (`components/admin/admin-mobile-nav.tsx`)

- Integrates `shadcn/ui Sheet` (`Sheet`, `SheetContent`, `SheetHeader`, `SheetTitle`).
- Only visible on viewports below `lg` breakpoint (`lg:hidden`).
- Closes automatically upon route navigation via Next.js `usePathname()`.

### Step 5: Admin Header (`components/admin/admin-header.tsx`)

- Fixed height (`h-16`) top bar with backdrop blur (`bg-background/95 backdrop-blur`).
- Left side: Mobile navigation trigger button + Breadcrumb component (`components/ui/breadcrumbs.tsx`).
- Right side: System health status pill + Clerk `<UserButton showName />`.

### Step 6: Layout Root (`app/admin/layout.tsx`)

```tsx
import { AdminShellProvider } from "@/components/providers/admin-shell-provider";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminHeader } from "@/components/admin/admin-header";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminShellProvider>
      <div className="min-h-screen bg-muted/20 flex flex-col lg:flex-row">
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <AdminHeader />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </AdminShellProvider>
  );
}
```

---

## 4. When We Are Going to Do It

```text
Phase 1: Navigation Data & Shell Context Provider
    │
    ▼
Phase 2: Collapsible Desktop Sidebar Component
    │
    ▼
Phase 3: Touch-Friendly Mobile Drawer Sheet Component
    │
    ▼
Phase 4: Header Navigation Bar with Breadcrumbs & User Profile
    │
    ▼
Phase 5: Layout Integration & Responsive Breakpoint Validation
```

---

## 5. Required Data & Data Sources

| Data Requirement | Origin / Source | Usage |
|---|---|---|
| Admin Navigation Structure | `constants/admin-navigation.ts` | Sidebar & Mobile Sheet link generation |
| User Profile & Auth State | `@clerk/nextjs` (`useUser`, `UserButton`) | Header identity badge & role checks |
| Current Active Pathname | Next.js `usePathname()` | Highlighting active navigation link & auto-closing mobile drawer |
| Sidebar Collapse Preference | `localStorage` / React State | Persisting desktop collapse state across reloads |

---

## 6. What Could Possibly Go Wrong & Mitigation Plan

| Potential Risk | Root Cause | Prevention / Mitigation Strategy |
|---|---|---|
| **SSR Hydration Mismatch** | Reading `localStorage` for `isCollapsed` state during server rendering. | Defer reading `localStorage` until component mounts using a `mounted` state check. |
| **Horizontal Overflow on Mobile** | Large tables or code blocks exceeding screen width. | Wrap main content in `min-w-0 overflow-x-auto` container to maintain strict `320px` mobile support without viewport scrolling. |
| **Focus Trapping in Mobile Sheet** | Drawer elements remaining focused after closing. | Use `shadcn/ui Sheet` (Radix Dialog) which natively handles focus trap and screen reader accessibility (`aria-describedby`). |
| **Clerk UserButton Hydration Mismatch** | Renders different markup server vs client. | Render inside standard client header wrapper without custom SSR overrides. |

---

## 7. Verification & Definition of Done

1. `pnpm run typecheck` or `pnpm run build` compiles with 0 errors.
2. Layout renders cleanly on:
   - Mobile Viewport: 320px, 375px (Mobile sheet trigger visible, sidebar hidden).
   - Tablet Viewport: 768px (Mobile sheet trigger visible).
   - Desktop Viewport: 1024px, 1440px (Sidebar visible, collapse toggle collapses width from 256px to 80px).
3. Mobile drawer closes automatically when clicking any navigation link.
4. Active link styling reflects current sub-route (`bg-accent text-accent-foreground font-semibold`).

---

## 8. Agent Workflow Integration

> [!IMPORTANT]
> **Mandatory User Permission Rule:** After drafting this implementation spec in `context/implementation-specs/26-phase-4a-responsive-admin-layout-and-shell.md`, updating `context/progress-tracker.md`, and `context/implementation-specs/README.md`, AI agents MUST NOT immediately start coding. Agents MUST present this specification to the user and obtain explicit permission before making any code changes.
