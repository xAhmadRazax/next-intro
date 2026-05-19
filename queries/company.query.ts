import {
  getCompanies,
  getCompany,
  addCompany,
  updateCompany,
  deleteCompany,
} from "@/lib/api"
import { companyKeys } from "@/lib/queryKeys"
import type { addCompanyDTO } from "@/types/dashboard.types"
import { mutationOptions, queryOptions } from "@tanstack/react-query"

export const getCompaniesQueryOptions = ({
  page,
  emailFilter,
  nameFilter,
  itemsPerPage,
  getAll = false,
}: {
  page: number
  emailFilter?: string
  nameFilter?: string
  itemsPerPage?: number
  getAll: boolean
}) =>
  queryOptions({
    queryKey: companyKeys.page(page, { email: emailFilter, name: nameFilter }),
    queryFn: () =>
      getCompanies({ page, emailFilter, nameFilter, itemsPerPage, getAll }),
  })

export const getCompanyQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ["companies", id],
    queryFn: () => getCompany(id),
  })

export const createCompanyMutationOptions = mutationOptions({
  mutationKey: ["companies", "create"],
  mutationFn: (company: addCompanyDTO) => addCompany(company),
})

export const updateCompanyMutationOptions = (id: string) =>
  mutationOptions({
    mutationKey: ["companies", "update", id],
    mutationFn: (company: addCompanyDTO) => updateCompany(id, company),
  })
export const deleteCompanyMutationOptions = (id: string) =>
  mutationOptions({
    mutationFn: () => deleteCompany(id),
  })
