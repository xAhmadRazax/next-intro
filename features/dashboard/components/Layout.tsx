import { SideBar } from "@/components/Sidebar"

export const DashboardLayout = ({
  isSuperAdmin = false,
  children,
}: {
  isSuperAdmin: boolean
  children: React.ReactNode
}) => {
  return (
    <div className="grid min-h-screen bg-background md:grid-cols-[250px_1fr]">
      <SideBar isSuperAdmin={isSuperAdmin} />

      <main className="flex w-full flex-col">{children}</main>
    </div>
  )
}
