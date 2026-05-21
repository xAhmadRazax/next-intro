import { SideBar } from "@/components/Sidebar"
import { PropsWithChildren } from "react"

export const MainLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="grid min-h-screen bg-background md:grid-cols-[250px_1fr]">
      <SideBar />

      <main className="flex w-full flex-col">{children}</main>
    </div>
  )
}
