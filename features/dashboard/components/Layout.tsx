import { SideBar } from "@/components/Sidebar"

export const DashboardLayout = ({
  role = "employee",
  children,
}: {
  role: string
  children: React.ReactNode
}) => {
  return (
    <div className="grid min-h-screen bg-background md:grid-cols-[250px_1fr]">
      <SideBar role={role} />

      <main className="flex w-full flex-col">{children}</main>
    </div>
  )
}
