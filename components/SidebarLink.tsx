"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"

type SidebarLinkProps = {
  href: string
  label: string
  onClick?: () => void
}

export const SidebarLink = ({ href, label, onClick }: SidebarLinkProps) => {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center rounded-sm border px-3 py-2 text-sm font-medium transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 ${
        isActive
          ? "border-border bg-card text-primary shadow-sm hover:bg-muted hover:text-foreground"
          : "border-transparent text-muted-foreground hover:bg-muted hover:text-foreground"
      } `}
    >
      {label}
    </Link>
  )
}
