export interface UserType {
  id: string
  name: string
  email: string
  companyName: string
  companyId: string
  age: number
  isVerified: boolean
  lastLoginAt: string
}

export interface addUserDTO {
  name: string
  email: string
  age: number
  companyId: string
  companyName?: string
}

export interface CompanyType {
  id: string
  email: string
  name: string
  address: string
  logo?: string
}

export interface addCompanyDTO {
  name: string
  email: string
  address: string
  logo?: string
}
