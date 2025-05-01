import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";
import { JWT_SECRET } from "./config/env";

// Arcjet
import { isSpoofedBot } from "@arcjet/inspect";
import arcjet, { detectBot, shield, tokenBucket } from "@arcjet/next";

const publicPaths = ["/sign-in", "/sign-up"];

// Arcjet
const aj = arcjet({
  key: process.env.ARCJET_KEY!,
  characteristics: ["ip.src"],
  rules: [
    shield({ mode: "LIVE" }),
    detectBot({
      mode: "LIVE",
      allow: ["CATEGORY:SEARCH_ENGINE"],
    }),
    tokenBucket({
      mode: "LIVE",
      refillRate: 5,
      interval: 10,
      capacity: 10,
    }),
  ],
});

export async function middleware(request: NextRequest) {
  // 1. Arcjet
  const decision = await aj.protect(request, { requested: 1 });

  if (decision.isDenied()) {
    const reason = decision.reason;

    if (reason.isRateLimit()) {
      return new NextResponse(JSON.stringify({ error: "Too Many Requests", reason }), { status: 429 });
    } else if (reason.isBot()) {
      return new NextResponse(JSON.stringify({ error: "No bots allowed", reason }), { status: 403 });
    } else {
      return new NextResponse(JSON.stringify({ error: "Forbidden", reason }), { status: 403 });
    }
  }

  if (decision.results.some(isSpoofedBot)) {
    return new NextResponse(JSON.stringify({ error: "Forbidden - Spoofed bot" }), { status: 403 });
  }

  // 2. Auth
  const path = request.nextUrl.pathname;
  const isPublicPath = publicPaths.includes(path);
  const token = request.cookies.get("token")?.value || "";

  if (isPublicPath && token) {
    try {
      await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
      return NextResponse.redirect(new URL("/", request.url));
    } catch (error) {
      console.log("Invalid token:", error);
      return NextResponse.next();
    }
  }

  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return NextResponse.next();
}

// kivéve az API-t és a statikus fájlokat
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
