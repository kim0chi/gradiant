"use client"

import { useState } from "react"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isWeekend, isSameMonth, isSameDay } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"

// Mock attendance data
const mockAttendanceData = () => {
  const today = new Date()
  const startDate = startOfMonth(today)
  const endDate = endOfMonth(today)
  const days = eachDayOfInterval({ start: startDate, end: endDate })

  // Generate mock attendance for each day
  return days.reduce(
    (acc, day) => {
      // Skip weekends
      if (isWeekend(day)) return acc

      // Generate random status
      const rand = Math.random()
      let status = "present"

      if (rand < 0.05) status = "absent"
      else if (rand < 0.1) status = "tardy"

      acc[format(day, "yyyy-MM-dd")] = status
      return acc
    },
    {} as Record<string, "present" | "absent" | "tardy">,
  )
}

export function StudentAttendanceCalendar() {
  const [date, setDate] = useState<Date>(new Date())
  const [month, setMonth] = useState<Date>(new Date())
  const [attendanceData] = useState<Record<string, "present" | "absent" | "tardy">>(mockAttendanceData())

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "present":
        return "bg-green-500"
      case "absent":
        return "bg-red-500"
      case "tardy":
        return "bg-yellow-500"
      default:
        return "bg-gray-200"
    }
  }

  // Get status text
  const getStatusText = (status: string) => {
    switch (status) {
      case "present":
        return "Present"
      case "absent":
        return "Absent"
      case "tardy":
        return "Tardy"
      default:
        return "No record"
    }
  }

  // Previous month
  const previousMonth = () => {
    const prevMonth = new Date(month)
    prevMonth.setMonth(prevMonth.getMonth() - 1)
    setMonth(prevMonth)
  }

  // Next month
  const nextMonth = () => {
    const nextMonth = new Date(month)
    nextMonth.setMonth(nextMonth.getMonth() + 1)
    setMonth(nextMonth)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={previousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="font-medium">{format(month, "MMMM yyyy")}</div>
          <Button variant="outline" size="icon" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-sm">Present</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-sm">Absent</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span className="text-sm">Tardy</span>
          </div>
        </div>
      </div>

      <Calendar
        mode="single"
        selected={date}
        onSelect={(newDate) => newDate && setDate(newDate)}
        month={month}
        onMonthChange={setMonth}
        className="rounded-md border"
        components={{
          Day: ({ day, ...props }) => {
            // Format date to match our data keys
            const dateKey = format(day, "yyyy-MM-dd")
            const status = attendanceData[dateKey]

            // Don't show status for weekends or days outside current month
            const showStatus = !isWeekend(day) && isSameMonth(day, month)

            return (
              <div
                {...props}
                className={cn(
                  props.className,
                  "relative p-0",
                  isSameDay(day, date) && "bg-primary text-primary-foreground",
                  isWeekend(day) && "text-muted-foreground opacity-50",
                  !isSameMonth(day, month) && "text-muted-foreground opacity-30",
                )}
              >
                <div className="flex flex-col items-center justify-center h-9">
                  <span>{format(day, "d")}</span>
                  {showStatus && status && (
                    <div className={cn("w-2 h-2 rounded-full absolute bottom-1", getStatusColor(status))} />
                  )}
                </div>
              </div>
            )
          },
        }}
      />

      {date && (
        <div className="mt-4">
          <div className="flex items-center justify-between">
            <div className="font-medium">{format(date, "EEEE, MMMM d, yyyy")}</div>
            {!isWeekend(date) && (
              <div>
                {attendanceData[format(date, "yyyy-MM-dd")] ? (
                  <Badge className={cn(getStatusColor(attendanceData[format(date, "yyyy-MM-dd")]))}>
                    {getStatusText(attendanceData[format(date, "yyyy-MM-dd")])}
                  </Badge>
                ) : (
                  <Badge variant="outline">No record</Badge>
                )}
              </div>
            )}
          </div>
          {isWeekend(date) && <p className="text-sm text-muted-foreground mt-1">Weekend - No classes scheduled</p>}
        </div>
      )}
    </div>
  )
}
