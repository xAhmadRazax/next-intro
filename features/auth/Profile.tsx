"use client"
import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuthContext } from "@/context/auth.context"
import Form from "@/components/form/Form"

export const Profile = () => {
  const { user, isLoading, changePassword } = useAuthContext()

  const changePasswordFormHandler = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const currentPassword = formData.get("current-password")?.toString()
    const newPassword = formData.get("new-password")?.toString()
    const confirmPassword = formData.get("confirm-password")?.toString()
    if (!currentPassword || !newPassword || !confirmPassword) {
      return alert("Please fill in all fields")
    }

    if (newPassword !== confirmPassword) {
      return alert("New password and confirm password do not match")
    }

    changePassword(currentPassword, newPassword)
  }

  const isCompanyAdmin = user?.role === "company"
  const username = user?.name ?? "N/A"
  const email = user?.email ?? "N/A"
  return (
    <section className="mx-auto flex w-full max-w-[95%] min-w-0 flex-1 flex-col gap-4 px-2 xl:max-w-350">
      <header className="py-4 text-center">
        <h1 className="text-lg font-bold text-primary md:text-2xl">Profile</h1>
      </header>
      <div className="mx-auto -mt-2 h-0.5 w-1/12 rounded-full bg-accent-foreground/30" />

      {/* Profile section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
            Profile
          </CardTitle>
        </CardHeader>
        <CardContent
          className={`flex flex-col gap-4 ${isLoading ? "animate-pulse" : ""}`}
        >
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user?.employee?.avatar ?? undefined} />
              <AvatarFallback className="text-lg">
                {user?.name?.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-1">
              <p className="font-medium">{user?.name}</p>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
              <Button variant="outline" size="sm" className="mt-1 w-fit">
                Change photo
              </Button>
            </div>
          </div>

          {/* Fields */}
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label>{isCompanyAdmin ? "Company" : "Username"}</Label>
              <Input value={username} disabled />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Email</Label>
              <Input type="email" disabled value={email} />
            </div>
            {/* {user?.role != "admin" && ( */}
            {/* <div className="flex flex-col gap-1.5"> */}
            {/* <Label>Company</Label> */}
            {/* <Input value={user?.company?.email ?? "N/A"} disabled /> */}
            {/* </div> */}
            {/* )} */}
            <div className="flex flex-col gap-1.5">
              <Label>Role</Label>
              <div className="flex h-9 items-center">
                <Badge
                  variant={user?.role === "admin" ? "default" : "secondary"}
                >
                  {user?.role}
                </Badge>
              </div>
            </div>
          </div>

          {/* <div className="flex justify-end"> */}
          {/* <Button>Save changes</Button> */}
          {/* </div> */}
        </CardContent>
      </Card>

      {/* Change password */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
            Change password
          </CardTitle>
        </CardHeader>
        <CardContent
          className={`flex flex-col gap-4 ${isLoading ? "animate-pulse" : ""}`}
        >
          <Form
            className="flex flex-col gap-3"
            onSubmit={changePasswordFormHandler}
          >
            <Form.Field className="flex flex-col gap-1.5">
              <Form.Label htmlFor="current-password">
                Current password
              </Form.Label>
              <Form.Input
                id="current-password"
                name="current-password"
                type="password"
                placeholder="••••••••"
              />
            </Form.Field>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <Form.Field className="flex flex-col gap-1.5">
                <Form.Label htmlFor="new-password">New password</Form.Label>
                <Form.Input
                  id="new-password"
                  name="new-password"
                  type="password"
                  placeholder="••••••••"
                />
              </Form.Field>
              <Form.Field className="flex flex-col gap-1.5">
                <Form.Label htmlFor="confirm-password">
                  Confirm new password
                </Form.Label>
                <Form.Input
                  id="confirm-password"
                  name="confirm-password"
                  type="password"
                  placeholder="••••••••"
                />
              </Form.Field>
            </div>

            <div className="mt-4 flex justify-end">
              <Form.Submit type="submit">Update password</Form.Submit>
            </div>
          </Form>
        </CardContent>
      </Card>
    </section>
  )
}
