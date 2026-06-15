"use client"

import { Button } from "@/components/ui/button"
import { Field } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Search, SlidersHorizontal } from "lucide-react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { useState } from "react"

export const CompanyTableFiltration = ({
  disabled = false,
}: {
  disabled?: boolean
}) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathName = usePathname()

  const [isOpen, setIsOpen] = useState(true)
  const [emailFilter, setEmailFilter] = useState(
    () => searchParams?.get("email") || ""
  )
  const [nameFilter, setNameFilter] = useState(
    () => searchParams?.get("name") || ""
  )

  const onInputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (name === "email") {
      setEmailFilter(value)
    } else if (name === "name") {
      setNameFilter(value)
    }
  }

  const onFilterApplyHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    console.log("calling handler")

    console.log(emailFilter, nameFilter)

    if (!emailFilter && !nameFilter) {
      return
    }

    const params = new URLSearchParams(searchParams?.toString())
    params.delete("page")
    params.delete("email")
    params.delete("name")

    if (emailFilter) params.set("email", emailFilter)
    if (nameFilter) params.set("name", nameFilter)

    router.push(`${pathName}?${params.toString()}`)
  }

  const onClearFilterHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setEmailFilter("")
    setNameFilter("")
    setIsOpen(false)

    const params = new URLSearchParams(searchParams?.toString())
    params.delete("page")
    params.delete("email")
    params.delete("name")

    router.push(`${pathName}?${params.toString()}`)
  }

  return (
    <div
      className={`my-4 grow rounded-sm px-2 py-4 ${isOpen ? "bg-card" : ""}`}
    >
      <Button
        variant={isOpen ? "default" : "outline"}
        size="sm"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2"
      >
        <SlidersHorizontal className="h-4 w-4" />
        Filters
        {/* {hasActiveFilters && (
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary-foreground text-[10px] text-primary">
            !
          </span>
        )} */}
      </Button>

      {isOpen && (
        <div className="my-4 flex flex-wrap gap-2 space-y-4">
          <div className="flex grow space-x-2">
            <Field className="max-w-80">
              {/* <Label>By Email</Label> */}
              <Input
                className="border-sm"
                placeholder="Filter Company by Email"
                name="email"
                value={emailFilter}
                onChange={onInputChangeHandler}
              />
            </Field>

            <Field className="max-w-80">
              {/* <Label>By Name</Label> */}
              <Input
                placeholder="Filter Company by Name"
                name="name"
                value={nameFilter}
                onChange={onInputChangeHandler}
              />
            </Field>
          </div>

          <div className="ms-auto flex w-fit space-x-2">
            <Button
              disabled={disabled}
              variant="default"
              onClick={onFilterApplyHandler}
              className="flex items-center gap-2"
            >
              <Search />
              <span>Apply Filter</span>
            </Button>

            <Button
              disabled={disabled}
              variant="outline"
              className="flex items-center px-4"
              onClick={onClearFilterHandler}
            >
              <span>Clear Filter</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
