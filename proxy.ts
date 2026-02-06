import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { parse } from "cookie";
import { checkSessionServer } from "./lib/api/serverApi";

const privateRoutes = ["/profile", "/notes"];
const publicRoutes = ["/sign-in", "/sign-up"];

export async function proxy(request: NextRequest) {
  const cookiesStoreData = await cookies();
  const accessToken = cookiesStoreData.get("accessToken")?.value;
  const refreshToken = cookiesStoreData.get("refreshToken")?.value;

  const { pathname } = request.nextUrl;

  const isPrivateRoute = privateRoutes.some((route) =>
    pathname.startsWith(route),
  );
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route),
  );

  if (isPrivateRoute) {
    if (!accessToken) {
      if (refreshToken) {
        try {
          const data = await checkSessionServer();
          const setCookie = data.headers["set-cookie"];

          if (setCookie) {
            const cookieArray = Array.isArray(setCookie)
              ? setCookie
              : [setCookie];

            for (const cookieStr of cookieArray) {
              const parsed = parse(cookieStr);
              const options = {
                expires: parsed.Expires ? new Date(parsed.Expires) : undefined,
                path: parsed.Path,
                maxAge: Number(parsed["Max-Age"]),
              };

              if (parsed.accessToken)
                cookiesStoreData.set(
                  "accessToken",
                  parsed.accessToken,
                  options,
                );
              if (parsed.refreshToken)
                cookiesStoreData.set(
                  "refreshToken",
                  parsed.refreshToken,
                  options,
                );
            }

            if (isPublicRoute) {
              return NextResponse.redirect(new URL("/", request.url), {
                headers: {
                  Cookie: cookiesStoreData.toString(),
                },
              });
            }

            if (isPrivateRoute) {
              return NextResponse.next({
                headers: {
                  Cookie: cookiesStoreData.toString(),
                },
              });
            }
          }
        } catch (error) {
          console.error("Session check failed:", error);
          if (isPrivateRoute) {
            return NextResponse.redirect(new URL("/sign-in", request.url));
          }
        }
      }

      if (isPublicRoute) {
        return NextResponse.next();
      }

      if (isPrivateRoute) {
        return NextResponse.redirect(new URL("/sign-in", request.url));
      }
    }

    if (isPublicRoute) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    if (isPrivateRoute) {
      return NextResponse.next();
    }
  }
}

export const config = {
  matcher: ["/profile/:path*", "/sign-in", "/sign-up", "/notes/:path*"],
};
