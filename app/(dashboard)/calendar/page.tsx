"use client"

import { useState } from "react"
import { CalendarIcon, ChevronLeft, ChevronRight, Plus } from "lucide-react"
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
} from "date-fns"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const events = [
  {
    id: 1,
    title: "Math Quiz",
    date: new Date(2023, 6, 5),
    class: "Algebra II",
    type: "quiz",
  },
  {
    id: 2,
    title: "Biology Lab",
    date: new Date(2023, 6, 7),
    class: "Biology 101",
    type: "lab",
  },
  {
    id: 3,
    title: "Parent-Teacher Conference",
    date: new Date(2023, 6, 12),
    class: "All Classes",
    type: "meeting",
  },
  {
    id: 4,
    title: "History Exam",
    date: new Date(2023, 6, 15),
    class: "World History",
    type: "exam",
  },
  {
    id: 5,
    title: "Science Fair",
    date: new Date(2023, 6, 20),
    class: "Science Department",
    type: "event",
  },
  {
    id: 6,
    title: "English Essay Due",
    date: new Date(2023, 6, 22),
    class: "English Literature",
    type: "assignment",
  },
]

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1))
  }

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1))
  }

  const getEventsForDate = (date) => {
    return events.filter((event) => isSameDay(event.date, date))
  }

  const selectedDateEvents = getEventsForDate(selectedDate)

  const getEventTypeColor = (type) => {
    switch (type) {
      case "quiz":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "exam":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "assignment":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "lab":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      case "meeting":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "event":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
        <p className="text-muted-foreground">Manage your schedule, classes, and important dates.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-7 lg:grid-cols-12">
        <Card className="md:col-span-5 lg:col-span-8">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xl">{format(currentMonth, "MMMM yyyy")}</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={prevMonth}>
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Previous month</span>
              </Button>
              <Button variant="outline" size="icon" onClick={nextMonth}>
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Next month</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="text-center text-sm font-medium text-muted-foreground">
                  {day}
                </div>
              ))}
              {Array.from({ length: monthStart.getDay() }).map((_, index) => (
                <div key={`empty-start-${index}`} className="h-24 rounded-md border border-transparent p-1" />
              ))}
              {monthDays.map((day) => {
                const dayEvents = getEventsForDate(day)
                const isSelected = isSameDay(day, selectedDate)

                return (
                  <div
                    key={day.toString()}
                    className={cn(
                      "h-24 rounded-md border p-1 transition-colors",
                      isSelected ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50",
                    )}
                    onClick={() => setSelectedDate(day)}
                  >
                    <div className="flex justify-between">
                      <span
                        className={cn(
                          "text-sm font-medium",
                          !isSameMonth(day, currentMonth) && "text-muted-foreground",
                        )}
                      >
                        {format(day, "d")}
                      </span>
                      {dayEvents.length > 0 && (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                          {dayEvents.length}
                        </span>
                      )}
                    </div>
                    <div className="mt-1 space-y-1 overflow-hidden">
                      {dayEvents.slice(0, 2).map((event) => (
                        <div
                          key={event.id}
                          className={cn(
                            "truncate rounded px-1 py-0.5 text-xs font-medium",
                            getEventTypeColor(event.type),
                          )}
                        >
                          {event.title}
                        </div>
                      ))}
                      {dayEvents.length > 2 && (
                        <div className="truncate rounded bg-muted px-1 py-0.5 text-xs font-medium">
                          +{dayEvents.length - 2} more
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
              {Array.from({ length: 6 - monthEnd.getDay() }).map((_, index) => (
                <div key={`empty-end-${index}`} className="h-24 rounded-md border border-transparent p-1" />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 lg:col-span-4">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle>{format(selectedDate, "MMMM d, yyyy")}</CardTitle>
            <Button
              size="sm"
              className="h-8 gap-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Event</span>
            </Button>
          </CardHeader>
          <CardContent>
            {selectedDateEvents.length > 0 ? (
              <div className="space-y-4">
                {selectedDateEvents.map((event) => (
                  <div key={event.id} className="rounded-lg border p-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{event.title}</h3>
                      <span
                        className={cn("rounded-full px-2 py-0.5 text-xs font-medium", getEventTypeColor(event.type))}
                      >
                        {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{event.class}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex h-[300px] flex-col items-center justify-center text-center">
                <CalendarIcon className="mb-2 h-10 w-10 text-muted-foreground" />
                <h3 className="font-medium">No events</h3>
                <p className="mt-1 text-sm text-muted-foreground">There are no events scheduled for this day.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

