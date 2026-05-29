import { NextRequest, NextResponse } from "next/server"

export async function proxy(req: NextRequest) {
  const token = req.cookies.get("token")
  if (!token) {
    return NextResponse.redirect(new URL("/auth/login", req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!api|auth/login|unauthorized|_next/static|_next/image|favicon.ico).*)",
  ],
}
