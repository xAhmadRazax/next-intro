export const companyKeys = {
  all: ["companies"] as const,
  pages: ["companies", "page"] as const,
  page: (page?: number, filters?: { email?: string; name?: string }) =>
    [
      "companies",
      "page",
      page ?? 1,
      filters?.email ?? "",
      filters?.name ?? "",
    ] as const,
  detail: (id: string) => ["companies", "detail", id] as const,
}
