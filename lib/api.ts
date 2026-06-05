import { BASEURL } from "@/constants/constants"
import { CompanyType, PublicUserType } from "@/db/schema"
import type {
  AddCompanyDTO,
  AddEmployeeDTO,
  updateEmployeeDto,
} from "@/types/dashboard.types"
import type { PaginationMeta } from "@/types/pagination.types"
import { ApiError } from "./apiError"

export const getEmployees = async (
  {
    page = 1,
    itemsPerPage = 20,
    usernameFilter,
    emailFilter,
    companyFilter,
  }: {
    page?: number
    itemsPerPage?: number
    usernameFilter?: string
    emailFilter?: string
    companyFilter?: string
    order?: "asc" | "desc"
    sortBy?: string
  } = {},
  signal?: AbortSignal
): Promise<{ data: PublicUserType[]; meta: PaginationMeta }> => {
  // const sortString = order === "desc" ? `-${sortBy}` : sortBy

  let baseUrl = `${BASEURL}/dashboard/employees?`

  if (page) baseUrl = `${baseUrl}page=${page}&`

  if (itemsPerPage) baseUrl = `${baseUrl}limit=${itemsPerPage}&`

  if (emailFilter) baseUrl = `${baseUrl}email=${emailFilter}&`

  if (usernameFilter) baseUrl = `${baseUrl}username=${usernameFilter}&`
  if (companyFilter) baseUrl = `${baseUrl}company=${companyFilter}&`

  console.log("url", baseUrl)

  const res = await fetch(baseUrl, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    signal,
  })
  if (!res.ok) {
    const data = await res.json()
    throw new ApiError(data.error, data.status)
  }
  const result = await res.json()

  console.log(page)
  return result
}

export const getEmployee = async (id: string): Promise<PublicUserType> => {
  const res = await fetch(`${BASEURL}/dashboard/employee/${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })
  if (!res.ok) {
    const data = await res.json()
    throw data // throw the actual error object from the server
  }
  const result = await res.json()
  return result
}

export const addEmployee = async (body: AddEmployeeDTO) => {
  const formData = new FormData()

  formData.append("username", body.username)
  formData.append("email", body.email)
  formData.append("companyId", body.companyId)
  if (body.avatar) {
    formData.append("avatar", body.avatar)
  }

  const res = await fetch(`${BASEURL}/dashboard/employees`, {
    method: "POST",
    body: formData,
  })
  if (!res.ok) {
    const data = await res.json()
    throw new ApiError(data.error, data.status, data.fields)
  }
  const data = await res.json()
  return data.employee
}

export const updateEmployee = async (
  id: string,
  body: Partial<updateEmployeeDto>
) => {
  // remove undefined fields inline
  const cleanBody = Object.fromEntries(
    Object.entries(body).filter(([, value]) => value !== undefined)
  )

  const res = await fetch(`${BASEURL}/dashboard/employees/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(cleanBody),
  })
  if (!res.ok) {
    const data = await res.json()
    throw new ApiError(data.error, data.status, data.fields)
  }

  return await res.json()
}

export const resetEmployeePassword = async (id: string) => {
  const res = await fetch(
    `${BASEURL}/dashboard/employees/${id}/reset-password`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    }
  )
  if (!res.ok) {
    const data = await res.json()
    throw new ApiError(data.error, data.status)
  }
  return await res.json()
}

export const deleteEmployee = async (id: string) => {
  const res = await fetch(`${BASEURL}/dashboard/employees/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  })
  if (!res.ok) {
    const data = await res.json()
    throw new ApiError(data.error, data.status)
  }
  return res
}

// companies URL

export const getCompanies = async (
  {
    page = 1,
    itemsPerPage = 20,
    nameFilter,
    emailFilter,
    order = "desc",
    sortBy = "id",
    getAll = false,
  }: {
    page?: number
    nameFilter?: string
    emailFilter?: string
    itemsPerPage?: number
    order?: "asc" | "desc"
    sortBy?: string
    getAll?: boolean
  } = {},
  // cookies: string,
  signal?: AbortSignal
): Promise<{ data: CompanyType[]; meta: PaginationMeta }> => {
  // const sortString = order === "desc" ? `-${sortBy}` : sortBy

  let baseUrl = `${BASEURL}/dashboard/companies?`

  if (!getAll) {
    if (page) baseUrl = `${baseUrl}page=${page}&`

    if (itemsPerPage) baseUrl = `${baseUrl}limit=${itemsPerPage}&`

    if (emailFilter) baseUrl = `${baseUrl}email=${emailFilter}&`

    if (nameFilter) baseUrl = `${baseUrl}name=${nameFilter}`
  }

  if (getAll) baseUrl = `${baseUrl}getAll=true`
  // let url = `${BASEURL}/companies?page=${page}&limit=${itemsPerPage}&order=${sortString}`

  const res = await fetch(baseUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      //  Cookie: cookies
    },
    signal,
  })
  if (!res.ok) {
    const data = await res.json()
    throw new ApiError(data.error, data.status)
  }
  const result = await res.json()

  return result
}

export const createCompany = async (
  body: AddCompanyDTO
): Promise<CompanyType> => {
  const formData = new FormData()
  formData.append("name", body.name)
  formData.append("email", body.email)
  formData.append("address", body.address)
  if (body.logo) formData.append("logo", body.logo)

  const res = await fetch(`${BASEURL}/dashboard/companies`, {
    method: "POST",
    body: formData,
  })
  if (!res.ok) {
    const data = await res.json()
    throw new ApiError(data.error, data.status, data.fields)
  }

  return await res.json()
}

export const updateCompany = async (
  id: string,
  body: Partial<AddCompanyDTO>
): Promise<CompanyType> => {
  const formData = new FormData()

  if (body.name) formData.append("name", body.name)
  if (body.email) formData.append("email", body.email)
  if (body.address) formData.append("address", body.address)
  if (body.logo) formData.append("logo", body.logo) // File object

  const res = await fetch(`${BASEURL}/dashboard/companies/${id}`, {
    method: "PATCH",
    body: formData,
  })

  if (!res.ok) {
    const data = await res.json()
    throw new ApiError(data.error, data.status, data.fields)
  }

  return await res.json()
}

export const deleteCompany = async (id: string) => {
  const res = await fetch(`${BASEURL}/dashboard/companies/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  })
  if (!res.ok) {
    const data = await res.json()
    throw new ApiError(data.error, data.status)
  }

  return res
}
