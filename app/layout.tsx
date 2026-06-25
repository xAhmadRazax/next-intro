"use server"
import { Geist, Geist_Mono, Inter } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import { ReactQueryProvider } from "@/components/ReactQueryProvider"
import { AuthProvider } from "@/context/auth.context"
import { Toaster } from "@/components/ui/sonner"
import { cookies } from "next/headers"
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

  let user: PublicUserType | undefined
  if (token) {
    const res = await fetch(`${BASEURL}/users/me`, {
      headers: {
        "content-type": "application/json",
        Cookie: cookieStore.toString(),
      },
      method: "POST",
    })

    if (!res.ok) {
      console.log("how to show error")
    }

    user = ((await res.json()) as { user: PublicUserType })?.user
  }

  console.log("user", user)

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
        <AuthProvider initialUser={user}>
          <ReactQueryProvider>
            <ThemeProvider>{children}</ThemeProvider>
            <Toaster />
          </ReactQueryProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
