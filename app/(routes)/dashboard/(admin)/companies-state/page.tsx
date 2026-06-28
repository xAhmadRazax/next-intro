import { CompanyWithStatePagination } from "@/views/CompanyWithStatePagination"

export default async function Page() {
  return (
    // <HydrationBoundary state={dehydrate(queryClient)}>
    <CompanyWithStatePagination />
    // </HydrationBoundary>
  )
}
