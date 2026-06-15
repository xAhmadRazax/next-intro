export const DaysArr = [
  "Monday",
  "Tuesday",
  "Wednesday ",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
]

export function isToday(dateString: string): boolean {
  const date = new Date(dateString)
  const today = new Date()

  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  )
}

// export function getWeekRangeForDate(date: Date = new Date()) {
//   // this function get the current week Monday from the date
//   const dayOfWeek = date.getDay()
//   const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1

//   const startOfWeek = new Date(date)
//   startOfWeek.setDate(date.getDate() - daysToMonday)
//   startOfWeek.setHours(0, 0, 0, 0)

//   const endOfWeek = new Date(startOfWeek)
//   endOfWeek.setDate(startOfWeek.getDate() + 6)
//   endOfWeek.setHours(23, 59, 59, 999)

//   return { startOfWeek, endOfWeek }
// }

export function getWeekRangeForDate(date: Date = new Date()) {
  const year = date.getFullYear()
  const month = date.getMonth()
  const day = date.getDate()

  const localDate = new Date(year, month, day)
  const dayOfWeek = localDate.getDay() // 0=Sun, 1=Mon, 2=Tue ... 6=Sat

  // ✅ if Sunday (0) go back 6 days, otherwise go back dayOfWeek - 1
  const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1

  const startOfWeek = new Date(year, month, day - daysToMonday)
  startOfWeek.setHours(0, 0, 0, 0)

  const endOfWeek = new Date(startOfWeek)
  endOfWeek.setDate(startOfWeek.getDate() + 6)
  endOfWeek.setHours(23, 59, 59, 999)

  return {
    startOfWeek: startOfWeek.toDateString(),
    endOfWeek: endOfWeek.toDateString(),
  }
}
export const calculateHours = (checkIn: Date, checkOut: Date | null) => {
  if (!checkOut) return null
  const diff = (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60)
  return Math.round(diff * 10) / 10
}

export const formatDuration = (hours: number | null) => {
  if (hours === null) return "—"
  if (hours < 1) {
    const minutes = Math.round(hours * 60)
    return `${minutes}m`
  }
  return `${hours}h`
}

export const getRawMinutes = (hours: number | null) => {
  if (hours === null) return 0
  return Math.round(hours * 60)
}

export const formatTotalDuration = (totalMinutes: number) => {
  if (totalMinutes < 60) return `${totalMinutes}m`
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  if (minutes === 0) return `${hours}h`
  return `${hours}h ${minutes}m`
}

export function toLocalDateString(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}
