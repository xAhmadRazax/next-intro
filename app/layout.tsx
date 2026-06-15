import { Geist, Geist_Mono, Inter } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import { ReactQueryProvider } from "@/components/ReactQueryProvider"
import { AuthProvider } from "@/context/auth.context"
import { Toaster } from "@/components/ui/sonner"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { BASEURL } from "@/constants/constants"
import { PublicUserType } from "@/db/schema"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value

  if (!token) {
    redirect("/auth/login")
  }

  const res = await fetch(`${BASEURL}/users/me`, {
    headers: {
      "content-type": "application/json",
      Cookie: cookieStore.toString(),
    },
    method: "POST",
  })

  if (!res.ok) {
    if (res.status === 401) redirect("/auth/login")
  }

  const data = (await res.json()) as { user: PublicUserType }

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        inter.variable
      )}
    >
      <body>
        <AuthProvider initialUser={data.user}>
          <ReactQueryProvider>
            <ThemeProvider>{children}</ThemeProvider>
            <Toaster />
          </ReactQueryProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
