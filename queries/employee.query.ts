import {
  addEmployee,
  deleteEmployee,
  getEmployee,
  getEmployees,
  updateEmployee,
} from "@/lib/api"
import { employeeKeys } from "@/lib/queryKeys"
import type { AddEmployeeDTO, updateEmployeeDto } from "@/types/dashboard.types"
import { mutationOptions, queryOptions } from "@tanstack/react-query"

export const getEmployeesQueryOptions = ({
  page,
  itemsPerPage,
  usernameFilter,
  emailFilter,
  companyFilter,
}: {
  page?: number
  itemsPerPage?: number
  usernameFilter?: string
  emailFilter?: string
  companyFilter?: string
}) =>
  queryOptions({
    queryKey: employeeKeys.list(page, {
      company: companyFilter,
      email: emailFilter,
      username: usernameFilter,
    }),
    queryFn: () =>
      getEmployees({
        page,
        itemsPerPage,
        usernameFilter,
        emailFilter,
        companyFilter,
      }),
  })

export const getEmployeeQueryOptions = (id: string) =>
  queryOptions({
    queryKey: employeeKeys.detail(id),
    queryFn: () => getEmployee(id),
  })

export const createEmployeeMutationOptions = mutationOptions({
  mutationKey: ["employee", "create"],
  mutationFn: (employee: AddEmployeeDTO) => addEmployee(employee),
})

export const updateEmployeeMutationOptions = (id: string) =>
  mutationOptions({
    mutationKey: ["employee", "update", id],
    mutationFn: (employee: updateEmployeeDto) => updateEmployee(id, employee),
  })
export const deleteEmployeeMutationOptions = (id: string) =>
  mutationOptions({
    mutationFn: () => deleteEmployee(id),
  })
