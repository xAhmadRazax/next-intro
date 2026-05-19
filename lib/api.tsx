import { BASEURL } from "@/constants/constants"
import { CompanyType } from "@/db/schema"
import type {
  addCompanyDTO,
  addUserDTO,
  UserType,
} from "@/types/dashboard.types"
import type { PaginationMeta } from "@/types/pagination.types"
import { sleep } from "./utils"

export const getUsers = async ({
  page = 1,
  itemsPerPage = 10,
  order = "desc",
  sortBy = "id",
}: {
  page?: number
  itemsPerPage?: number
  order?: "asc" | "desc"
  sortBy?: string
} = {}): Promise<{ data: UserType[]; meta: PaginationMeta }> => {
  try {
    const sortString = order === "desc" ? `-${sortBy}` : sortBy

    const res = await fetch(
      `${BASEURL}/users?_page=${page}&_per_page=${itemsPerPage}&_sort=${sortString}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    )
    if (!res.ok) {
      throw new Error("Failed to fetch data")
    }
    const result = await res.json()

    const meta: PaginationMeta = {
      items: result.items,
      next: result.next,
      pages: result.pages,
      prev: result.prev,
      currentPage: result.next ? result.next - 1 : (result.last ?? 1),
      itemsPerPage: itemsPerPage,
    }

    const employeesWithCompany = await Promise.all(
      result.data.map(async (user: UserType) => {
        try {
          console.log(user)
          const companyRes = await fetch(
            `${BASEURL}/companies/${user.companyId}`,
            {
              method: "GET",
              headers: { "Content-Type": "application/json" },
            }
          )
          if (!companyRes.ok) {
            throw new Error("Failed to fetch company data")
          }
          const companyData = await companyRes.json()
          return { ...user, companyName: companyData.name }
        } catch (err) {
          console.error(`Error fetching company for user ${user.id}:`, err)
          return { ...user, company: "Unknown" }
        }
      })
    )

    console.log(employeesWithCompany)
    return { data: employeesWithCompany, meta: meta }
  } catch (err: unknown) {
    throw new Error(
      err instanceof Error
        ? `Fetch failed: ${err.message}`
        : "Fetch failed with unknown error"
    )
  }
}

export const getUser = async (id: string): Promise<UserType> => {
  try {
    const res = await fetch(`${BASEURL}/users/${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
    if (!res.ok) {
      throw new Error("Failed to fetch data")
    }
    const result = await res.json()
    return result
  } catch (err: unknown) {
    throw new Error(
      err instanceof Error
        ? `Fetch failed: ${err.message}`
        : "Fetch failed with unknown error"
    )
  }
}

export const addUser = async (body: addUserDTO) => {
  try {
    const res = await fetch(`${BASEURL}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    if (!res.ok) {
      throw new Error("Failed to fetch data")
    }

    return res
  } catch (err: unknown) {
    throw new Error(
      err instanceof Error
        ? `creating user failed: ${err.message}`
        : "creating user failed with unknown error"
    )
  }
}

export const updateUser = async (id: string, body: Partial<UserType>) => {
  try {
    // remove undefined fields inline
    const cleanBody = Object.fromEntries(
      Object.entries(body).filter(([, value]) => value !== undefined)
    )

    const res = await fetch(`${BASEURL}/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cleanBody),
    })

    if (!res.ok) {
      throw new Error("Failed to update user")
    }

    return await res.json()
  } catch (err: unknown) {
    throw new Error(
      err instanceof Error
        ? `updating user failed: ${err.message}`
        : "updating user failed with unknown error"
    )
  }
}

export const deleteUser = async (id: string) => {
  try {
    const res = await fetch(`${BASEURL}/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    })
    if (!res.ok) {
      throw new Error("Failed to fetch data")
    }

    return res
  } catch (err: unknown) {
    console.log(err)
    throw new Error(
      err instanceof Error
        ? `deleting user failed: ${err.message}`
        : "deleting user failed with unknown error"
    )
  }
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
  try {
    await sleep(5000)
    // const sortString = order === "desc" ? `-${sortBy}` : sortBy

    let baseUrl = `${BASEURL}/companies?`

    if (page) baseUrl = `${baseUrl}page=${page}&`

    if (itemsPerPage) baseUrl = `${baseUrl}limit=${itemsPerPage}&`

    if (emailFilter) baseUrl = `${baseUrl}email=${emailFilter}&`

    if (nameFilter) baseUrl = `${baseUrl}name=${nameFilter}`

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
  } catch (err: unknown) {
    throw new Error(
      err instanceof Error
        ? `Fetch failed: ${err.message}`
        : "Fetch failed with unknown error"
    )
  }
}

export const getCompany = async (id: string): Promise<UserType> => {
  try {
    const res = await fetch(`${BASEURL}/companies/${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
    if (!res.ok) {
      throw new Error("Failed to fetch data")
    }
    const result = await res.json()
    return result
  } catch (err: unknown) {
    throw new Error(
      err instanceof Error
        ? `Fetch failed: ${err.message}`
        : "Fetch failed with unknown error"
    )
  }
}

export const addCompany = async (body: addCompanyDTO) => {
  try {
    console.log(body, "body")

    const res = await fetch(`${BASEURL}/companies`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    if (!res.ok) {
      throw new Error("Failed to fetch data")
    }
    console.log(res)

    return res
  } catch (err: unknown) {
    throw new Error(
      err instanceof Error
        ? `creating company failed: ${err.message}`
        : "creating company failed with unknown error"
    )
  }
}

export const updateCompany = async (id: string, body: Partial<UserType>) => {
  try {
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
      throw new Error("Failed to update user")
    }

    return await res.json()
  } catch (err: unknown) {
    throw new Error(
      err instanceof Error
        ? `updating user failed: ${err.message}`
        : "updating user failed with unknown error"
    )
  }
}

export const deleteCompany = async (id: string) => {
  try {
    const res = await fetch(`${BASEURL}/companies/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    })
    if (!res.ok) {
      throw new Error("Failed to fetch data")
    }

    return res
  } catch (err: unknown) {
    console.log(err)
    throw new Error(
      err instanceof Error
        ? `deleting company failed: ${err.message}`
        : "deleting company failed with unknown error"
    )
  }
}
