import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { parse } from "cookie";
import { checkSessionServer } from "./lib/api/serverApi";

const privateRoutes = ["/profile", "/notes"];
const publicRoutes = ["/sign-in", "/sign-up"];

export async function proxy(request: NextRequest) {
  const cookieStore = await cookies();

  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  const { pathname } = request.nextUrl;

  const isPrivateRoute = privateRoutes.some((r) => pathname.startsWith(r));
  const isPublicRoute = publicRoutes.some((r) => pathname.startsWith(r));

  if (isPublicRoute) {
    if (accessToken) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  }

  if (isPrivateRoute) {
    if (accessToken) {
      return NextResponse.next();
    }

    if (refreshToken) {
      try {
        const data = await checkSessionServer();

        if (!data) {
          return NextResponse.redirect(new URL("/sign-in", request.url));
        }

        const setCookie = data.headers["set-cookie"];

        if (setCookie) {
          const cookieArray = Array.isArray(setCookie)
            ? setCookie
            : [setCookie];

          for (const cookieStr of cookieArray) {
            const parsed = parse(cookieStr);

            const options = {
              path: parsed.Path,
              expires: parsed.Expires ? new Date(parsed.Expires) : undefined,
              maxAge: parsed["Max-Age"] ? Number(parsed["Max-Age"]) : undefined,
            };

            if (parsed.accessToken) {
              cookieStore.set("accessToken", parsed.accessToken, options);
            }

            if (parsed.refreshToken) {
              cookieStore.set("refreshToken", parsed.refreshToken, options);
            }
          }

          return NextResponse.next({
            headers: {
              Cookie: cookieStore.toString(),
            },
          });
        }
      } catch (error) {
        console.error("Session refresh failed:", error);
      }
    }

    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};
