export interface AddEmployeeDTO {
  username: string
  email: string
  companyId: string
  avatar?: File | undefined
}

export type updateEmployeeDto = Omit<AddEmployeeDTO, "companyId">

export interface CompanyType {
  id: string
  email: string
  name: string
  address: string
  logo?: string
}

export interface AddCompanyDTO {
  name: string
  email: string
  address: string
  logo?: string | File
}
