import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

interface JWTPayload {
  id: string;
  role: "ADMIN" | "GUARD";
  hostelId?: string | null;
  exp: number;
}

const decodeToken = (token: string): JWTPayload | null => {
  try {
    const base64Payload = token.split(".")[1];
    if (!base64Payload) return null;

    const normalized = base64Payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
    const payload = atob(padded);
    return JSON.parse(payload) as JWTPayload;
  } catch {
    return null;
  }
};

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("token")?.value;

  const isAdminRoute = pathname.startsWith("/admin");
  const isGuardRoute = pathname.startsWith("/guard");
  const isLoginRoute = pathname === "/login";

  if ((isAdminRoute || isGuardRoute) && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (token) {
    const decoded = decodeToken(token);
    if (!decoded || decoded.exp * 1000 < Date.now()) {
      const response = NextResponse.redirect(new URL("/login", req.url));
      response.cookies.delete("token");
      return response;
    }

    if (isAdminRoute && decoded.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/guard", req.url));
    }

    if (isGuardRoute && decoded.role !== "GUARD") {
      return NextResponse.redirect(new URL("/admin", req.url));
    }

    if (isLoginRoute) {
      return NextResponse.redirect(
        new URL(decoded.role === "ADMIN" ? "/admin" : "/guard", req.url)
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/guard/:path*", "/login"],
};
