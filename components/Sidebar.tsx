"use client"
import { useState } from "react"
import { Menu, X } from "lucide-react"
import { SidebarLink } from "./SidebarLink"
import Link from "next/link"
import { useAuthContext } from "@/context/auth.context"

const navigationRoute = [
  {
    href: "/dashboard/profile",
    label: "Profile",
    access: "all",
  },
  {
    href: "/dashboard/employees",
    label: "Employees",
    access: "admin",
  },
  {
    href: "/dashboard/companies",
    label: "Companies",
    access: "admin",
  },
]
export const SideBar = ({ isAdmin }: { isAdmin: boolean }) => {
  const { logout } = useAuthContext()

  const handleLogout = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    await logout()
  }

  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Mobile menu button - only visible on mobile */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 left-4 z-50 rounded-md border bg-background p-2 shadow-sm md:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Mobile sidebar - slides in from left */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 transform border-r bg-card px-4 pt-4 transition-transform duration-300 ease-in-out md:hidden ${isOpen ? "translate-x-0" : "-translate-x-full"} `}
      >
        {/* Close button inside sidebar */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 z-50 rounded-md p-1 hover:bg-accent"
          aria-label="Close menu"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="sticky top-4">
          <Link
            href={"/dashboard"}
            className="mb-2 block w-fit text-xl font-bold outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            onClick={() => setIsOpen(false)}
          >
            React Dashboard
          </Link>

          <div className="h-0.5 w-full rounded-full bg-accent-foreground/30"></div>

          {/* mobile side bar */}
          <ul className="mt-4">
            {navigationRoute.map((link) => (
              <li key={`mobile-${link.label}`}>
                <SidebarLink
                  href={link.href}
                  label={link.label}
                  onClick={() => setIsOpen(false)}
                />
              </li>
            ))}

            <li key={"logout"}>
              <SidebarLink
                href={"/auth/logout"}
                label={"Logout"}
                onClick={handleLogout}
              />
            </li>
          </ul>
        </div>
      </div>

      {/* Overlay - darkens background when sidebar is open on mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Desktop sidebar - always visible on larger screens */}
      <nav className="hidden h-full border-r bg-card px-4 pt-4 md:block">
        <div className="sticky top-4">
          <Link
            href={"/dashboard"}
            className="mb-2 block w-fit text-xl font-bold text-primary outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            React Dashboard
          </Link>

          <div className="h-0.5 w-full rounded-full bg-accent-foreground/30"></div>

          <ul className="mt-4">
            {navigationRoute
              .filter((link) => link.access === "all" || isAdmin)
              .map((route) => (
                <li key={route.label}>
                  <SidebarLink href={route.href} label={route.label} />
                </li>
              ))}

            <li key={"logout"}>
              <SidebarLink
                href={"/auth/logout"}
                label={"Logout"}
                onClick={handleLogout}
              />
            </li>
          </ul>
        </div>
      </nav>
    </>
  )
}
