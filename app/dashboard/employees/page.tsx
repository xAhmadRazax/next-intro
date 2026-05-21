import { getEmployees } from "@/lib/api"
import { employeeKeys } from "@/lib/queryKeys"
import { Employee } from "@/views/Employee.view"
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query"

const page = () => {
  const queryClient = new QueryClient()
  queryClient.prefetchQuery({
    queryKey: employeeKeys.list(),
    queryFn: () => getEmployees(),
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Employee />
    </HydrationBoundary>
  )
}

export default page
