import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query"

import { getCompanies } from "@/lib/api"
import { Company } from "@/views/Company.view"
import { companyKeys } from "@/lib/queryKeys"

export default async function Page() {
  //  we are prefetching data on server
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: companyKeys.page(),
    queryFn: () => getCompanies(),
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Company />
    </HydrationBoundary>
  )
}
