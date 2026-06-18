"use server"
import { cookies } from "next/headers"

export async function deleteAuthCookie() {
  const cookieStore = await cookies()
  cookieStore.delete("token")
}
