import { PublicUserType } from "@/db/schema"

export interface AddEmployeeDTO {
  password: string
  companyId?: string
  avatar?: File | undefined
  name: string
  email: string
  address: string
  designation: string
  phone: string
  company?: CompanyType
}

export type updateEmployeeDto = Omit<AddEmployeeDTO, "companyId"> & {
  id: string
  updatedAt: Date
  createdAt: Date
}

// export interface CompanyType {
//   id: string
//   email: string
//   name: string
//   address: string
//   logo?: string
// }

export interface AddCompanyDTO {
  name: string
  email: string
  address: string
  password: string

  logo?: string | File
}

export interface EmployeeQueryType extends PublicUserType {
  stats?: {
    totalHours: string
    totalMins: number
    lastActivity: string
    lastActivityRaw: Date
  }
}

export interface EmployeeAttendance {
  id: string
  companyId: string | null
  userId: string | null
  createdAt: Date | null
  checkIn: string | null
  checkOut: string | null
  day: string
  date: string
  duration: string | null
  isFuture: boolean
  isToday: boolean
  isWeekend: boolean
  status: "pending" | "absent" | "completed" | "weekend" | "active"
}
export interface EmployeeAttendanceSummaryType {
  month: {
    averageDuration: string
    monthName: string
    totalDuration: string
    totalWeekdays: string
    weekdaysClocked: number
  }
}

export interface EmployeeAttendanceQueryType {
  attendance: EmployeeAttendance[]
  summary: EmployeeAttendanceSummaryType
}

export interface EmployeeAttendanceStatsType {
  averageDuration: string
  monthName: string
  totalDuration: string
  weekdaysClocked: number
}

// export interface DepartmentsWithRolesType extends DepartmentType {
//   roles: JobTitleType[]
// }

// export interface CreateProjectDto {
//   projectName: string
//   description: string
//   startDate: Date
//   endDate: Date
//   ProjectManagerId?: string
// }

export type CompanyType = {
  id: string
  name: string
  email: string
  address: string
  role: string
  logo: string
  createdAt: Date
  updatedAt: Date
}

export type EmployeeType = {
  id: string
  name: string
  email: string
  address: string
  role: string
  avatar: string
  designation: string
  phone: string
  company?: CompanyType
  createdAt: Date
  updatedAt: Date
}
