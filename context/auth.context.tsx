"use client"
import { changePasswordApi, loginApi, logoutApi, meApi } from "@/lib/auth-api"
import { UserType } from "@/types/dashboard.types"
import { useRouter } from "next/navigation"
import {
  createContext,
  PropsWithChildren,
  useState,
  useContext,
  useEffect,
} from "react"

interface AuthContextType {
  user: UserType | null
  setUser: (user: UserType | null) => void
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>

  changePassword: (
    currentPassword: string,
    newPassword: string
  ) => Promise<void>
}
const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: PropsWithChildren) {
  const router = useRouter()
  const [user, setUser] = useState<UserType | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true)
      try {
        const res = await meApi()
        setUser(res.user)
      } catch (error) {
        // console.error("Failed to fetch user", error)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()
  }, []) // This won't trigger the warning now

  async function changePassword(currentPassword: string, newPassword: string) {
    setIsLoading(true)
    try {
      await changePasswordApi({ currentPassword, password: newPassword })
    } catch (error) {
      console.error("Failed to change password", error)
    } finally {
      setIsLoading(false)
    }
  }

  async function getUser() {
    setIsLoading(true)
    try {
      const res = await meApi()
      setUser(res)
    } catch (error) {
      console.error("Failed to fetch user", error)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  async function logout() {
    setIsLoading(true)
    try {
      await logoutApi()
      setUser(null)
      router.replace("/auth/login")
    } catch (error) {
      console.error("Logout failed", error)
    } finally {
      setIsLoading(false)
    }
  }
  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const res = await loginApi({ email, password })
      console.log(res)
      setUser(res.user)

      router.replace("/dashboard/profile")
    } catch (error) {
      console.error("Login failed", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{ user, setUser, isLoading, login, changePassword, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within AuthProvider")
  return context
}
