import { SideBar } from "@/components/Sidebar"

export const DashboardLayout = ({
  isAdmin = false,
  children,
}: {
  isAdmin: boolean
  children: React.ReactNode
}) => {
  return (
    <div className="grid min-h-screen bg-background md:grid-cols-[250px_1fr]">
      <SideBar isAdmin={isAdmin} />

      <main className="flex w-full flex-col">{children}</main>
    </div>
  )
}
