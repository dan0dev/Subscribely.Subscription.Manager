import { jwtVerify } from "jose";
import { NextResponse } from "next/server";
import { JWT_SECRET } from "./config/env.ts";

// Oldalak, amelyek nem igényelnek hitelesítést
const publicPaths = ["/sign-in", "/sign-up"];

export async function middleware(request) {
  const path = request.nextUrl.pathname;

  // Ha a kért útvonal nyilvános, folytassa
  const isPublicPath = publicPaths.includes(path);

  // Token kinyerése a cookie-ból
  const token = request.cookies.get("token")?.value || "";

  // Ha nyilvános útvonal és a felhasználó be van jelentkezve, átirányítjuk a főoldalra
  if (isPublicPath && token) {
    try {
      // Token ellenőrzése
      await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));

      // Átirányítás a főoldalra
      return NextResponse.redirect(new URL("/", request.url));
    } catch (error) {
      // Token érvénytelen, engedje tovább a kérést
      console.log(error);
      return NextResponse.next();
    }
  }

  // Ha nem nyilvános útvonal és a felhasználó nincs bejelentkezve, átirányítjuk a bejelentkezési oldalra
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return NextResponse.next();
}

// Minden útvonalra alkalmazzuk a middleware-t, kivéve a statikus fájlokat és az API útvonalakat
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
