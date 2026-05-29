"use client"

import { Button } from "@/components/ui/button"
import { Field } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"
import { Search, SlidersHorizontal } from "lucide-react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { useState } from "react"
import { useAllCompanies } from "../company/reactQueryHooks/useAllCompanies"
import { CompanyType } from "@/db/schema"

export const EmployeeTableFiltration = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathName = usePathname()

  const { data: companiesData, isLoading: isLoadingCompanies } =
    useAllCompanies()

  const companies = companiesData?.data || []

  const [isOpen, setIsOpen] = useState(true)
  const [emailFilter, setEmailFilter] = useState(
    () => searchParams?.get("email") || ""
  )
  const [nameFilter, setNameFilter] = useState(
    () => searchParams?.get("username") || ""
  )

  const [selectedCompany, setSelectedCompany] = useState<CompanyType | null>(
    () => {
      const companyId = searchParams?.get("company")
      if (!companyId) return null
      return companies.find((company) => company.id === companyId) || null
    }
  )

  const onInputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (name === "email") {
      setEmailFilter(value)
    } else if (name === "username") {
      setNameFilter(value)
    }
  }

  const onFilterApplyHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    console.log(emailFilter, nameFilter)

    if (!emailFilter && !nameFilter && !selectedCompany) {
      return
    }

    const params = new URLSearchParams(searchParams?.toString())
    params.delete("page")
    params.delete("email")
    params.delete("username")
    params.delete("company")

    if (emailFilter) params.set("email", emailFilter)
    if (nameFilter) params.set("username", nameFilter)
    if (selectedCompany) params.set("company", selectedCompany.id)

    router.push(`${pathName}?${params.toString()}`)
  }

  const onClearFilterHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setEmailFilter("")
    setNameFilter("")
    setSelectedCompany(null)
    setIsOpen(false)

    const params = new URLSearchParams(searchParams?.toString())
    params.delete("page")
    params.delete("email")
    params.delete("username")
    params.delete("company")

    router.push(`${pathName}?${params.toString()}`)
  }

  return (
    <div
      className={`my-4 grow rounded-sm px-2 py-4 ${isOpen ? "bg-muted/50" : ""}`}
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
          <div className="flex grow justify-around space-x-2">
            <Field className="max-w-80">
              {/* <Label>By Email</Label> */}
              <Input
                className="border-sm"
                placeholder="Filter Employee by Email"
                name="email"
                value={emailFilter}
                onChange={onInputChangeHandler}
              />
            </Field>

            <Field className="max-w-80">
              {/* <Label>By Name</Label> */}
              <Input
                placeholder="Filter Employee by Name"
                name="username"
                value={nameFilter}
                onChange={onInputChangeHandler}
              />
            </Field>

            <Field className="block max-w-85">
              {/* <Label>By Name</Label> */}
              <Combobox
                id="company"
                disabled={isLoadingCompanies}
                items={companies || []}
                itemToStringLabel={(company: CompanyType) => company.name}
                onValueChange={(company) => setSelectedCompany(company)}
                value={selectedCompany}
              >
                <ComboboxInput placeholder="Search companies..." />
                <ComboboxContent>
                  <ComboboxEmpty>No companies found.</ComboboxEmpty>
                  <ComboboxList>
                    {(company: CompanyType) => (
                      <ComboboxItem key={company.id} value={company}>
                        {company.name}
                      </ComboboxItem>
                    )}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
            </Field>
          </div>

          <div className="ms-auto flex w-fit space-x-2">
            <Button
              variant="default"
              onClick={onFilterApplyHandler}
              className="flex items-center gap-2"
            >
              <Search />
              <span>Apply Filter</span>
            </Button>

            <Button
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
