# Implementation Spec 27: Phase 4A Sub-Task 2 — Server-Side Clerk Role-Based Authorization Guard & Security Architecture

> **Spec ID:** 27-phase-4a-clerk-role-authorization-guard  
> **Target Branch / PR:** `phase4A`  
> **Status:** Complete  
> **Created Date:** 2026-08-02  


---

## Executive Summary

Phase 4A Sub-Task 2 implements the server-side role-based authorization guard, access control flow, fallback UI, and administrative header quick actions for the Black Swan International secure admin portal (`/admin`). It establishes type-safe server-side protection using `@clerk/nextjs/server` (`auth()` and `has()`), enforces environment-aware role boundaries (`admin` / `org:admin`), implements an Unauthorized fallback page, updates middleware routing in `proxy.ts`, and enhances `AdminHeader` with notification counters, quick RFQ action dropdowns, and user role identity badges.

---

## 1. What We Are Going to Do

| #   | Target File | Action Required |
| --- | ----------- | --------------- |
| 1   | `lib/admin-auth.ts` | **[NEW]** Create type-safe server helper `requireAdminAuth()` to enforce `admin` / `org:admin` role boundaries on the server with dev bypass logic. |
| 2   | `proxy.ts` | **[MODIFY]** Update Clerk middleware to handle route protection, pass `x-pathname` header to layouts, and handle redirects to `/admin/login` or `/admin/unauthorized`. |
| 3   | `app/admin/layout.tsx` | **[MODIFY]** Integrate `requireAdminAuth()` guard for protected routes while bypassing dashboard chrome (sidebar/header) for auth pages (`/admin/login`, `/admin/unauthorized`). |
| 4   | `app/admin/unauthorized/page.tsx` | **[NEW]** Build responsive Access Denied / Unauthorized page with role explanation, contact director CTA, and sign-out/switch account actions. |
| 5   | `components/admin/admin-header.tsx` | **[MODIFY]** Add notification bell indicator with unread counter badge, quick RFQ action dropdown menu, and user role identity badge. |

---

## 2. Why We Are Doing This

1. **Project Security Architecture Alignment:** As mandated in `AGENTS.md` and `context/architecture.md`, all administrative operations and server actions must verify authentication and role-based permissions on the server side using Clerk. Client-side checks are never trusted alone.
2. **Environment Safety:** Development testing requires seamless access without requiring live production Clerk organization role provisioning, while production requires strict enforcement of `admin` or `org:admin` roles.
3. **User Experience & Fallback Guidance:** When unauthorized users attempt to access `/admin`, they should receive clear feedback on why access is restricted, options to switch accounts or sign out, and direct contact details for managing directors.
4. **Administrative Efficiency:** Executives require real-time visibility into unread contact inquiries and pending RFQ requests directly from the top navigation bar with 1-click action shortcuts.

---

## 3. How We Are Going to Implement It

### Step 1: Server Authorization Helper (`lib/admin-auth.ts`)

Create `lib/admin-auth.ts` exporting `requireAdminAuth()` and `AdminAuthSession` interface:

```typescript
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export interface AdminAuthSession {
  userId: string;
  orgId: string | null;
  orgRole: string | null;
  isDevBypass: boolean;
}

export async function requireAdminAuth(): Promise<AdminAuthSession> {
  const { userId, orgId, orgRole, has } = await auth();
  const isDev = process.env.NODE_ENV !== "production";

  if (isDev) {
    return {
      userId: userId ?? "dev_admin_user",
      orgId: orgId ?? null,
      orgRole: orgRole ?? "admin",
      isDevBypass: true,
    };
  }

  if (!userId) {
    redirect("/admin/login");
  }

  const isAdmin = has({ role: "admin" }) || has({ role: "org:admin" });

  if (!isAdmin) {
    redirect("/admin/unauthorized");
  }

  return {
    userId,
    orgId: orgId ?? null,
    orgRole: orgRole ?? null,
    isDevBypass: false,
  };
}
```

### Step 2: Middleware & Routing in `proxy.ts`

Update `proxy.ts` to inspect requests, set the `x-pathname` header for layout inspection, and enforce server-level redirects for `/admin/*`:

```typescript
import { NextResponse } from "next/server";
import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware(async (auth, req) => {
  const { pathname } = req.nextUrl;
  const isAdminRoute = pathname.startsWith("/admin");
  const isAdminLoginRoute = pathname.startsWith("/admin/login");
  const isAdminUnauthorizedRoute = pathname.startsWith("/admin/unauthorized");

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-pathname", pathname);

  if (isAdminRoute && !isAdminLoginRoute && !isAdminUnauthorizedRoute) {
    const { userId, has } = await auth();

    if (!userId) {
      const loginUrl = new URL("/admin/login", req.url);
      loginUrl.searchParams.set("redirect_url", pathname);
      return NextResponse.redirect(loginUrl, { headers: requestHeaders });
    }

    if (process.env.NODE_ENV === "production") {
      const isAdmin = has({ role: "admin" }) || has({ role: "org:admin" });
      if (!isAdmin) {
        return NextResponse.redirect(new URL("/admin/unauthorized", req.url), {
          headers: requestHeaders,
        });
      }
    }
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
});
```

### Step 3: Admin Layout Route Isolation (`app/admin/layout.tsx`)

Update `app/admin/layout.tsx` to inspect `x-pathname` header from `headers()`:
- If pathname is `/admin/login` or `/admin/unauthorized`, render `children` cleanly without sidebar and header shell.
- Otherwise, execute `await requireAdminAuth()` and wrap children in `AdminShellProvider`, `AdminSidebar`, `AdminMobileNav`, and `AdminHeader`.

### Step 4: Access Denied / Unauthorized Page (`app/admin/unauthorized/page.tsx`)

Build responsive page featuring:
- Security shield icon (`ShieldAlert` from `lucide-react`).
- Title: "Access Restricted / Unauthorized Role".
- Description: Clear explanation stating that `/admin` requires `admin` or `org:admin` Clerk organization permissions.
- Action buttons:
  - "Contact Managing Director" (mailto or inquiry link).
  - "Sign Out & Switch Account" using Clerk `SignOutButton` or `useClerk()`.
  - "Return to Public Site" (`Link` to `/`).

### Step 5: Enhanced Admin Header (`components/admin/admin-header.tsx`)

Update `AdminHeader` to incorporate:
1. **Unread Inquiry Notification Bell**:
   - Displays unread counter badge.
   - Clickable dropdown menu showing unread notification items with direct links to `/admin/quotes` and `/admin/inquiries`.
2. **Quick RFQ Actions Dropdown Menu**:
   - `DropdownMenu` with options:
     - "View Pending RFQs" (`/admin/quotes`)
     - "Review Contact Inquiries" (`/admin/inquiries`)
     - "System Diagnostics" (`/admin/diagnostics`)
3. **User Role Identity Badge**:
   - Displays role pill badge (e.g. `Admin` or `Managing Director` or `Dev Bypass`) alongside Clerk `UserButton`.

---

## 4. When We Are Going to Do It

```text
Phase 1: Server Auth Helper (`lib/admin-auth.ts`) & Middleware (`proxy.ts`)
    │
    ▼
Phase 2: Admin Layout Route Isolation (`app/admin/layout.tsx`)
    │
    ▼
Phase 3: Fallback Unauthorized Page (`app/admin/unauthorized/page.tsx`)
    │
    ▼
Phase 4: Header Quick Actions, Notifications & Identity Badge (`components/admin/admin-header.tsx`)
    │
    ▼
Phase 5: Verification & Typecheck (`pnpm exec tsc --noEmit` & `pnpm run lint`)
```

---

## 5. Required Data & Data Sources

| Data Requirement | Origin / Source | Usage |
| ---------------- | --------------- | ----- |
| Clerk User Session & Roles | `await auth()` / `@clerk/nextjs/server` | Role-based authorization check (`admin` / `org:admin`) |
| Request Pathname | Middleware `x-pathname` header | Dynamic route layout exclusion in `app/admin/layout.tsx` |
| Unread Counters | DB Queries (`quotes`, `contactInquiries`) or mock props | Notification bell badge in `AdminHeader` |
| Active User Identity | Clerk `useUser()` hook in `AdminHeader` | Rendering user role identity badge |

---

## 6. Potential Risks & Mitigation Plan

| Potential Risk | Root Cause | Prevention / Mitigation Strategy |
| -------------- | ---------- | -------------------------------- |
| **Infinite Redirect Loop** | Layout enforcing `requireAdminAuth()` on `/admin/unauthorized` or `/admin/login` | Check `x-pathname` header in `app/admin/layout.tsx` and skip auth guard and dashboard chrome for auth pages. |
| **Dev Testing Interruption** | Strict Clerk org requirement locally when local dev user is not in an organization | Enforce `NODE_ENV !== "production"` bypass in `requireAdminAuth()` and `proxy.ts`. |
| **Clerk Middleware Breaking Static Assets** | Matcher rule catching static files | Use standard Clerk matcher skipping `_next` and static file extensions. |

---

## 7. Verification & Definition of Done

1. `pnpm exec tsc --noEmit` executes cleanly with 0 TypeScript errors.
2. `pnpm run lint` executes cleanly with 0 ESLint errors.
3. `/admin/unauthorized` page renders correctly with accessible CTA and Sign Out actions.
4. Server guard in `lib/admin-auth.ts` protects admin routes and supports dev bypass.
