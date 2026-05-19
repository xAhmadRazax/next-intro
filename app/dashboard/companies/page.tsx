import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query"

import { getCompanies } from "@/lib/api"
import { Company } from "@/pages/Company"
import { companyKeys } from "@/lib/queryKeys"

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }> | { page?: string }
}) {
  //  we are prefetching data on server
  const queryClient = new QueryClient()
  const params = await searchParams
  const page = Number(params?.page) || 1

  await queryClient.prefetchQuery({
    queryKey: companyKeys.page(),
    queryFn: () => getCompanies(),
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Company initialPage={page} />
    </HydrationBoundary>
  )
}
