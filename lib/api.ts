import { CreateEmployeeDto } from "@/app/api/employees/dtos/createEmployee.dto"
import { BASEURL } from "@/constants/constants"
import { CompanyType } from "@/db/schema"
import type {
  AddCompanyDTO,
  AddEmployeeDTO,
  EmployeeType,
  updateEmployeeDto,
} from "@/types/dashboard.types"
import type { PaginationMeta } from "@/types/pagination.types"

export const getEmployees = async ({
  page = 1,
  itemsPerPage = 20,
  usernameFilter,
  emailFilter,
  companyFilter,
  order = "desc",
  sortBy = "id",
}: {
  page?: number
  itemsPerPage?: number
  usernameFilter?: string
  emailFilter?: string
  companyFilter?: string
  order?: "asc" | "desc"
  sortBy?: string
} = {}): Promise<{ data: EmployeeType[]; meta: PaginationMeta }> => {
  // const sortString = order === "desc" ? `-${sortBy}` : sortBy

  let baseUrl = `${BASEURL}/employees?`

  if (page) baseUrl = `${baseUrl}page=${page}&`

  if (itemsPerPage) baseUrl = `${baseUrl}limit=${itemsPerPage}&`

  if (emailFilter) baseUrl = `${baseUrl}email=${emailFilter}&`

  if (usernameFilter) baseUrl = `${baseUrl}username=${usernameFilter}&`
  if (companyFilter) baseUrl = `${baseUrl}company=${companyFilter}&`

  console.log("url", baseUrl)

  const res = await fetch(baseUrl, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })
  if (!res.ok) {
    const data = await res.json()
    throw data // throw the actual error object from the server
  }
  const result = await res.json()

  console.log(page)
  return result
}

export const getEmployee = async (id: string): Promise<EmployeeType> => {
  const res = await fetch(`${BASEURL}/users/${id}`, {
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
  const res = await fetch(`${BASEURL}/employees`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const data = await res.json()
    throw data // throw the actual error object from the server
  }

  return res
}

export const updateEmployee = async (id: string, body: updateEmployeeDto) => {
  // remove undefined fields inline
  const cleanBody = Object.fromEntries(
    Object.entries(body).filter(([, value]) => value !== undefined)
  )

  const res = await fetch(`${BASEURL}/employees/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(cleanBody),
  })
  if (!res.ok) {
    const data = await res.json()
    throw data // throw the actual error object from the server
  }

  return await res.json()
}

export const deleteEmployee = async (id: string) => {
  const res = await fetch(`${BASEURL}/employees/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  })
  if (!res.ok) {
    const data = await res.json()
    throw data // throw the actual error object from the server
  }

  return res
}

// companies URL

export const getCompanies = async ({
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
} = {}): Promise<{ data: CompanyType[]; meta: PaginationMeta }> => {
  // const sortString = order === "desc" ? `-${sortBy}` : sortBy

  let baseUrl = `${BASEURL}/companies?`

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
    headers: { "Content-Type": "application/json" },
  })
  if (!res.ok) {
    throw new Error("Failed to fetch data")
  }
  const result = await res.json()

  console.log(page)

  return result
}

export const getCompany = async (id: string): Promise<CompanyType> => {
  const res = await fetch(`${BASEURL}/companies/${id}`, {
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

export const addCompany = async (body: AddCompanyDTO) => {
  const res = await fetch(`${BASEURL}/companies`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const data = await res.json()
    throw data // throw the actual error object from the server
  }

  return res
}

export const updateCompany = async (id: string, body: Partial<CompanyType>) => {
  // remove undefined fields inline
  const cleanBody = Object.fromEntries(
    Object.entries(body).filter(([, value]) => value !== undefined)
  )

  const res = await fetch(`${BASEURL}/companies/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(cleanBody),
  })

  if (!res.ok) {
    const data = await res.json()
    throw data // throw the actual error object from the server
  }

  return await res.json()
}

export const deleteCompany = async (id: string) => {
  const res = await fetch(`${BASEURL}/companies/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  })
  if (!res.ok) {
    const data = await res.json()
    throw data // throw the actual error object from the server
  }

  return res
}
