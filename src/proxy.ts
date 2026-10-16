import { NextResponse, type NextRequest } from "next/server";

const locales = ["es", "en"] as const;

function pickLocale(req: NextRequest) {
  const header = req.headers.get("accept-language") ?? "";
  const first = header.split(",")[0]?.trim().toLowerCase() ?? "";
  return first.startsWith("en") ? "en" : "es";
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasLocale = locales.some(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`),
  );
  if (hasLocale) return;
  request.nextUrl.pathname = `/${pickLocale(request)}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: ["/((?!_next|api|fotos|video|favicon.ico|.*\\..*).*)"],
};
