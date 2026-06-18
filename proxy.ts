import { NextRequest, NextResponse } from "next/server"
import { JWT } from "./lib/JWT.server"
import { db } from "./db"
import { eq } from "drizzle-orm"
import { users } from "./db/schema"

const excludedPaths = [
  "/api/auth/forgot-password",
  "/api/auth/res-set-password",
  "/api/auth/login",
  "/auth/set-password",
  "/auth/forgot-password",
  "/auth/rest-password",
  "/auth/login",
  "/unauthorized",
  "/_next/static",
  "/_next/image",
  "/favicon.ico",
]

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (excludedPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next()
  }

  const token = req.cookies.get("token")?.value
  const decodedJwt = await JWT.safeVerifyJWT(token ?? "")

  if (
    !token ||
    !decodedJwt?.id ||
    !(await db.query.users.findFirst({
      where: eq(users.id, decodedJwt.id),
    }))
  ) {
    // ✅ Create the redirect response first
    const response = NextResponse.redirect(new URL("/auth/login", req.url))

    // ✅ Then delete the cookie separately
    response.cookies.delete("token")

    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: "/((?!_next/static|_next/image|favicon.ico).*)",
  // matcher: [
  //   "/((?!api|auth/set-password|auth/reset-password|auth/login|unauthorized|_next/static|_next/image|favicon.ico).*)",
  // ],
}
