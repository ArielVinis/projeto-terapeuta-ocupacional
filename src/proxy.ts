import { PATHS } from "@/src/constants/paths";
import { safeCallbackUrl } from "@/src/lib/safe-callback-url";
import { getSessionCookie } from "better-auth/cookies";
import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = getSessionCookie(request);

  const needsAuth =
    pathname.startsWith(PATHS.profile.root) || pathname.startsWith(PATHS.admin.root);

  if (needsAuth && !sessionCookie) {
    const url = request.nextUrl.clone();
    url.pathname = PATHS.auth.login;
    url.searchParams.set("callbackUrl", safeCallbackUrl(pathname));
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/admin/:path*"],
};
