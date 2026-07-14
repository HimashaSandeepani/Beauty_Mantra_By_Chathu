import { NextResponse } from "next/server";

export function proxy(request) {
  const token = request.cookies.get("bm_admin_session")?.value;

  if (!token) {
    const loginUrl = new URL("/admin", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Note: full HMAC validation happens on API routes (edge middleware keeps this lightweight).
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/dashboard/:path*"],
};
