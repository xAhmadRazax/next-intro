"use client"
import { useState, useEffect } from "react"

export default function AttendanceClock() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date())
    }, 1000)

    // set initial time once (NOT in separate state update pattern)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      <h1 className="text-4xl font-bold">
        {time.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })}
      </h1>
      <p className="text-sm text-muted-foreground">
        {time.toLocaleDateString([], {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>
    </div>
  )
}
