import { NextRequest, NextResponse } from "next/server"

const excludedPaths = [
  "/api",
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
    // console.log(pathname)
    // console.log(excludedPaths.some((path) => pathname.startsWith(path)))
    return NextResponse.next()
  }

  const token = req.cookies.get("token")
  if (!token) {
    return NextResponse.redirect(new URL("/auth/login", req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: "/((?!_next/static|_next/image|favicon.ico).*)",
  // matcher: [
  //   "/((?!api|auth/set-password|auth/reset-password|auth/login|unauthorized|_next/static|_next/image|favicon.ico).*)",
  // ],
}
