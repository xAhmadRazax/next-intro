export type CreateEmployeeDto = {
  username: string
  email: string
  avatar?: File | undefined
  companyId: string
}
