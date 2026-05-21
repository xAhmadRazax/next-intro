export const companyKeys = {
  all: ["companies"] as const,
  lists: () => [...companyKeys.all, "list"] as const,
  page: (page?: number, filters?: { email?: string; name?: string }) =>
    [
      ...companyKeys.lists(),
      page ?? 1,
      filters?.email ?? "",
      filters?.name ?? "",
    ] as const,
  details: () => [...companyKeys.all, "detail"] as const,
  detail: (id: string) => [...companyKeys.details(), id] as const,
}

export const employeeKeys = {
  all: ["employees"] as const,

  lists: () => [...employeeKeys.all, "list"] as const,

  list: (
    page = 1,
    filters?: {
      email?: string
      username?: string
      company?: string
      itemsPerPage?: number
    }
  ) =>
    [
      ...employeeKeys.lists(),
      // {
      page ?? 1,
      filters?.email ?? "",
      filters?.username ?? "",
      filters?.company ?? "",
      // },
    ] as const,

  details: () => [...employeeKeys.all, "detail"] as const,

  detail: (id: string) => [...employeeKeys.details(), id] as const,
}
