import { NextRequest, NextResponse } from "next/server"
import { JWT } from "./lib/JWT.server"

// const BASE_URL =
//   process?.env?.NODE_ENV === "production"
//     ? "https://yourapp.com"
//     : "http://localhost:3000"
const BASE_URL = "http://localhost:3000"

const excludedPaths = [
  "/api",
  "/auth/set-password",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/auth/login",
  "/unauthorized",
  "/favicon.ico",
]

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  // 1. excluded paths first
  if (excludedPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next()
  }

  // 2. check token
  const token = req.cookies.get("token")?.value
  if (!token) {
    console.log("no token found")
    return NextResponse.redirect(new URL("/auth/login", BASE_URL))
  }

  const payload = await JWT.safeVerifyJWT(token)
  if (!payload?.id) {
    console.log("no payload found")
    return NextResponse.redirect(new URL("/auth/login", BASE_URL))
  }

  // 3. figure out domain
  const hostname = req.headers.get("host") ?? ""
  const isRootDomain =
    hostname === "localhost:3000" || hostname === "yourapp.com"
  const slug = hostname
    .replace(".localhost:3000", "")
    .replace(".yourapp.com", "")

  // 4. superadmin on subdomain → kick to root dashboard

  console.log(
    payload.role === "superAdmin" && !isRootDomain,
    isRootDomain,
    payload.role
  )
  if (payload.role === "superAdmin" && !isRootDomain) {
    console.log("redirect")
    return NextResponse.redirect(new URL("/dashboard", BASE_URL))
  }

  // 5. tenant user on root domain → kick to their subdomain
  if (payload.role !== "superAdmin" && isRootDomain) {
    const companySlug = payload.companySlug
    const tenantBase =
      process.env.NODE_ENV === "production"
        ? `https://${companySlug}.yourapp.com`
        : `http://${companySlug}.localhost:3000`
    return NextResponse.redirect(new URL("/dashboard", tenantBase))
  }

  // 6. tenant user on correct subdomain → rewrite to /tenant/[slug]
  if (!isRootDomain) {
    return NextResponse.rewrite(new URL(`/tenant/${slug}${pathname}`, req.url))
  }

  // 7. superadmin on root domain → pass through
  return NextResponse.next()
}

export const config = {
  matcher: "/((?!_next/static|_next/image|favicon.ico).*)",
}
