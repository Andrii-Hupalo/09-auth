import { NextRequest, NextResponse } from "next/server";
import { checkSessionServer } from "./lib/api/serverApi";

const privateRoutes = ["/profile", "/notes"];
const publicRoutes = ["/sign-in", "/sign-up"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  const isPrivateRoute = privateRoutes.some((r) => pathname.startsWith(r));
  const isPublicRoute = publicRoutes.some((r) => pathname.startsWith(r));

  if (isPublicRoute) {
    if (!accessToken) {
      return NextResponse.next();
    }

    return NextResponse.redirect(new URL("/", request.url));
  }

  if (isPrivateRoute) {
    if (accessToken) {
      return NextResponse.next();
    }

    if (!refreshToken) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    try {
      const data = await checkSessionServer();

      if (!data) {
        return NextResponse.redirect(new URL("/sign-in", request.url));
      }

      const setCookie = data.headers["set-cookie"];

      if (!setCookie) {
        return NextResponse.redirect(new URL("/sign-in", request.url));
      }

      const cookiesArr = Array.isArray(setCookie) ? setCookie : [setCookie];
      const response = NextResponse.next();

      for (const cookieStr of cookiesArr) {
        response.headers.append("set-cookie", cookieStr);
      }

      return response;
    } catch (e) {
      console.error("Refresh session error:", e);
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};
