export const getCompanies = async ({
  page = 1,
  itemsPerPage = 10,
  order = "desc",
  sortBy = "id",
  getAll = false,
}: {
  page?: number
  itemsPerPage?: number
  order?: "asc" | "desc"
  sortBy?: string
  getAll?: boolean
} = {}): Promise<{ data: CompanyType[]; meta: PaginationMeta }> => {
  try {
    const offset = (page - 1) * itemsPerPage

    const data = await db.query.companies.findMany({
      limit: itemsPerPage,
      offset: offset,
      orderBy: (companies, { asc, desc }) => [
        sortBy === "asc" ? asc(companies.createdAt) : desc(companies.createdAt),
      ],
    })

    console.log("data", data)
  } catch (err: unknown) {
    throw new Error(
      err instanceof Error
        ? `Fetch failed: ${err.message}`
        : "Fetch failed with unknown error"
    )
  }
}
