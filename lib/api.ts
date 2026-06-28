import { BASEURL } from "@/constants/constants"
import {
  // AttendanceType,
  // DepartmentType,
  // ProjectType,
  PublicUserType,
} from "@/db/schema"
import type {
  AddCompanyDTO,
  AddEmployeeDTO,
  CompanyType,
  // CreateProjectDto,
  // DepartmentsWithRolesType,
  EmployeeAttendance,
  EmployeeAttendanceQueryType,
  EmployeeAttendanceStatsType,
  EmployeeQueryType,
  EmployeeType,
  updateEmployeeDto,
  // updateEmployeeDto,
} from "@/types/dashboard.types"
import type { PaginationMeta } from "@/types/pagination.types"
import { ApiError } from "./apiError"
import { UpdateEmployeeDto } from "@/app/api/backup/dashboard/employees/dtos/updateEmployee.dto"

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
): Promise<{ data: EmployeeType[]; meta: PaginationMeta }> => {
  // const sortString = order === "desc" ? `-${sortBy}` : sortBy

  let baseUrl = `${BASEURL}/dashboard/employees?`

  if (page) baseUrl = `${baseUrl}page=${page}&`

  if (itemsPerPage) baseUrl = `${baseUrl}limit=${itemsPerPage}&`

  if (emailFilter) baseUrl = `${baseUrl}email=${emailFilter}&`

  if (usernameFilter) baseUrl = `${baseUrl}username=${usernameFilter}&`
  if (companyFilter) baseUrl = `${baseUrl}company=${companyFilter}&`

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

  console.log(result)
  return result
}

// export const getEmployee = async (id: string): Promise<PublicUserType> => {
//   const res = await fetch(`${BASEURL}/dashboard/employee/${id}`, {
//     method: "GET",
//     headers: { "Content-Type": "application/json" },
//   })
//   if (!res.ok) {
//     const data = await res.json()
//     throw data // throw the actual error object from the server
//   }
//   const result = await res.json()
//   return result
// }

export const addEmployee = async (
  body: AddEmployeeDTO
): Promise<EmployeeType> => {
  const formData = new FormData()

  formData.append("name", body.name)
  formData.append("email", body.email)
  formData.append("password", body.password)
  formData.append("phone", body.phone)
  formData.append("designation", body.designation)
  formData.append("address", body.address)
  formData.append("companyId", body?.companyId ?? "")

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

  return data
}

export const updateEmployee = async (
  id: string,
  body: Partial<updateEmployeeDto>
): Promise<EmployeeType> => {
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
): Promise<{ companies: CompanyType[]; meta: PaginationMeta }> => {
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
  formData.append("password", body.password)
  if (body.logo) formData.append("logo", body.logo)

  const res = await fetch(`${BASEURL}/dashboard/companies`, {
    method: "POST",
    body: formData,
  })
  if (!res.ok) {
    const data = await res.json()
    console.log(data)
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
    console.log(data)
    throw new ApiError(data.error, data.status)
  }
}

//  attendance api

export const clockInApi = async (): Promise<{
  attendance: EmployeeAttendance
}> => {
  const res = await fetch(`${BASEURL}/attendance/clockIn`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  })
  if (!res.ok) {
    const data = await res.json()
    throw new ApiError(data.error, data.status)
  }

  return res.json()
}

export const clockOutApi = async (): Promise<{
  attendance: EmployeeAttendance
}> => {
  const res = await fetch(`${BASEURL}/attendance/clockOut`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  })
  if (!res.ok) {
    const data = await res.json()
    throw new ApiError(data.error, data.status)
  }

  return res.json()
}

export const getUserAttendance = async (
  filters: { month: number; year: number },
  signal?: AbortSignal
): Promise<EmployeeAttendanceQueryType> => {
  const res = await fetch(
    `${BASEURL}/dashboard/attendance?month=${filters.month + 1}&year=${filters.year}`,
    {
      headers: { "Content-Type": "application/json" },
      signal,
    }
  )
  if (!res.ok) {
    const data = await res.json()
    console.log(error)
    throw new ApiError(data.error, data.status)
  }

  return res.json()
}

export const getEmployeeAttendance = async (
  id: string,
  filters: { month: number; year: number },
  signal?: AbortSignal
): Promise<EmployeeAttendanceQueryType> => {
  const res = await fetch(
    `${BASEURL}/dashboard/employees/${id}/attendance?month=${filters.month + 1}&year=${filters.year}`,
    {
      headers: { "Content-Type": "application/json" },
      signal,
    }
  )
  if (!res.ok) {
    const data = await res.json()
    throw new ApiError(data.error, data.status)
  }
  const result = res.json()
  console.log(result)
  return result
}

export const getUserAttendanceStats = async (
  filters?: { month: number; year: number },
  signal?: AbortSignal
): Promise<EmployeeAttendanceStatsType> => {
  const res = await fetch(`${BASEURL}/attendance/stats`, {
    headers: { "Content-Type": "application/json" },
    signal,
  })
  if (!res.ok) {
    const data = await res.json()
    throw new ApiError(data.error, data.status)
  }
  const result = res.json()
  console.log(result)
  return result
}

//–––––––––––departments

// export const getDepartmentsWithRoles = async (
//   signal?: AbortSignal
// ): Promise<DepartmentsWithRolesType[]> => {
//   const res = await fetch(`${BASEURL}/dashboard/departments`, {
//     headers: { "Content-Type": "application/json" },
//     signal,
//   })
//   if (!res.ok) {
//     const data = await res.json()
//     throw new ApiError(data.error, data.status)
//   }
//   const result = res.json()
//   console.log(result)
//   return result
// }

// _____________________ projects

// export const getProjectsApi = async ({
//   page = 1,
//   itemsPerPage = 20,
//   signal,
// }: {
//   page?: number
//   itemsPerPage?: number
//   signal?: AbortSignal
// }): Promise<ProjectType[]> => {
//   const res = await fetch(`${BASEURL}/dashboard/projects`, {
//     headers: { "Content-Type": "application/json" },
//     signal,
//   })
//   if (!res.ok) {
//     const data = await res.json()
//     throw new ApiError(data.error, data.status)
//   }
//   const result = res.json()
//   console.log(result)
//   return result
// }

// export const createProjectApi = async (
//   createProjectDto: CreateProjectDto
// ): Promise<ProjectType> => {
//   const res = await fetch(`${BASEURL}/dashboard/projects`, {
//     method: "POST",
//     body: JSON.stringify({ createProjectDto }),
//     headers: { "Content-Type": "application/json" },
//   })
//   if (!res.ok) {
//     const data = await res.json()
//     throw new ApiError(data.error, data.status)
//   }
//   const result = res.json()
//   return result
// }
