import { AttendanceType, PublicUserType } from "@/db/schema"

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
    weekdaysClocked: string
  }
  week: {
    averageDuration: string
    totalDuration: string
    totalWeekdays: number
    weekOffset: string
    weekRange: { start: Date; end: Date }
    weekdaysClocked: number
    workedDays: number
  }
}

export interface EmployeeAttendanceQueryType {
  attendance: EmployeeAttendance[]
  summary: EmployeeAttendanceSummaryType
}
