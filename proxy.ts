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

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for Clerk's auto-proxy path
    "/__clerk/:path*",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
