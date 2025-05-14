"use client"

import type React from "react"

import { useState, useMemo } from "react"
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  parseISO,
  isWeekend,
  isToday,
} from "date-fns"
import { ChevronLeft, ChevronRight, Plus, CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { EventDialog } from "./event-dialog"
import { Skeleton } from "@/components/ui/skeleton"

// Types for our calendar events
export type CalendarEventType = "holiday" | "event" | "exam" | "assignment"

export interface CalendarEvent {
  id: string
  title: string
  date: string // ISO date string
  type: CalendarEventType
  description?: string
  allDay?: boolean
  startTime?: string
  endTime?: string
  location?: string
}

interface CalendarViewProps {
  events: CalendarEvent[]
  onAddEvent?: (event: Omit<CalendarEvent, "id">) => void
  onEditEvent?: (event: CalendarEvent) => void
  onDeleteEvent?: (eventId: string) => void
  readOnly?: boolean
  isLoading?: boolean
}

export function CalendarView({
  events = [],
  onAddEvent,
  onEditEvent,
  onDeleteEvent,
  readOnly = false,
  isLoading = false,
}: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date())
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)

  // Calculate calendar days including days from previous/next months to fill the grid
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth)
    const monthEnd = endOfMonth(monthStart)
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 }) // 0 = Sunday
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 })

    return eachDayOfInterval({ start: calendarStart, end: calendarEnd })
  }, [currentMonth])

  // Get events for the selected date
  const selectedDateEvents = useMemo(() => {
    if (!selectedDate) return []
    return events
      .filter((event) => isSameDay(parseISO(event.date), selectedDate))
      .sort((a, b) => {
        // Sort by all-day events first, then by start time
        if (a.allDay && !b.allDay) return -1
        if (!a.allDay && b.allDay) return 1
        if (!a.startTime || !b.startTime) return 0
        return a.startTime.localeCompare(b.startTime)
      })
  }, [selectedDate, events])

  // Navigation functions
  const previousMonth = () => setCurrentMonth(subMonths(currentMonth, 1))
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1))
  const goToToday = () => {
    const today = new Date()
    setCurrentMonth(today)
    setSelectedDate(today)
  }

  // Event handling
  const handleDateClick = (day: Date) => {
    setSelectedDate(day)
  }

  const handleAddEvent = () => {
    if (!selectedDate) return

    setSelectedEvent(null)
    setIsDialogOpen(true)
  }

  const handleEventClick = (event: CalendarEvent, e: React.MouseEvent) => {
    e.stopPropagation()
    if (readOnly) return

    setSelectedEvent(event)
    setIsDialogOpen(true)
  }

  const handleDialogClose = () => {
    setIsDialogOpen(false)
    setSelectedEvent(null)
  }

  const handleDialogSave = (eventData: Omit<CalendarEvent, "id"> | CalendarEvent) => {
    if ("id" in eventData && selectedEvent) {
      onEditEvent?.(eventData as CalendarEvent)
    } else {
      onAddEvent?.(eventData)
    }
    setIsDialogOpen(false)
    setSelectedEvent(null)
  }

  const handleDialogDelete = (eventId: string) => {
    onDeleteEvent?.(eventId)
    setIsDialogOpen(false)
    setSelectedEvent(null)
  }

  // Get event type color
  const getEventTypeColor = (type: CalendarEventType) => {
    switch (type) {
      case "holiday":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800"
      case "event":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800"
      case "exam":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-800"
      case "assignment":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700"
    }
  }

  // Format time for display
  const formatEventTime = (event: CalendarEvent) => {
    if (event.allDay) return "All day"
    if (!event.startTime) return ""

    const formatTime = (timeStr: string) => {
      const [hours, minutes] = timeStr.split(":")
      const hour = Number.parseInt(hours, 10)
      const ampm = hour >= 12 ? "PM" : "AM"
      const hour12 = hour % 12 || 12
      return `${hour12}:${minutes} ${ampm}`
    }

    return `${formatTime(event.startTime)}${event.endTime ? ` - ${formatTime(event.endTime)}` : ""}`
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-40" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-10" />
            <Skeleton className="h-10 w-20" />
            <Skeleton className="h-10 w-10" />
          </div>
        </div>
        <div className="grid grid-cols-7 gap-1">
          {Array(7)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={`header-${i}`} className="h-8" />
            ))}
          {Array(35)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={`day-${i}`} className="h-24" />
            ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Calendar Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">{format(currentMonth, "MMMM yyyy")}</h2>
          <p className="text-muted-foreground">
            {selectedDate ? format(selectedDate, "EEEE, MMMM d, yyyy") : "Select a date to view events"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={previousMonth} aria-label="Previous month">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" onClick={goToToday}>
            Today
          </Button>
          <Button variant="outline" size="icon" onClick={nextMonth} aria-label="Next month">
            <ChevronRight className="h-4 w-4" />
          </Button>
          {!readOnly && selectedDate && (
            <Button onClick={handleAddEvent}>
              <Plus className="h-4 w-4 mr-2" />
              Add Event
            </Button>
          )}
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="rounded-lg border bg-card overflow-hidden">
        {/* Day headers */}
        <div className="grid grid-cols-7 bg-muted/50">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="text-center font-medium py-2 text-sm">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 auto-rows-fr border-t">
          {calendarDays.map((day, dayIdx) => {
            // Get events for this day
            const dayEvents = events.filter((event) => isSameDay(parseISO(event.date), day))
            const isCurrentMonth = isSameMonth(day, currentMonth)
            const isSelectedDay = selectedDate && isSameDay(day, selectedDate)
            const isWeekendDay = isWeekend(day)
            const isTodayDate = isToday(day)

            return (
              <div
                key={day.toString()}
                className={cn(
                  "min-h-[100px] border-b border-r p-1 relative",
                  dayIdx % 7 === 0 && "border-l", // Add left border for first day of week
                  !isCurrentMonth && "bg-muted/30 text-muted-foreground",
                  isWeekendDay && isCurrentMonth && "bg-muted/10",
                  isSelectedDay && "ring-2 ring-inset ring-primary",
                  isTodayDate && "bg-primary/5",
                  "cursor-pointer hover:bg-accent/50 transition-colors",
                )}
                onClick={() => handleDateClick(day)}
              >
                <div className={cn("flex justify-end items-center h-6", isTodayDate && "font-bold text-primary")}>
                  <span
                    className={cn(
                      "text-sm w-6 h-6 flex items-center justify-center rounded-full",
                      isTodayDate && "bg-primary text-primary-foreground",
                    )}
                  >
                    {format(day, "d")}
                  </span>
                </div>
                <div className="mt-1 space-y-1 max-h-[80px] overflow-y-auto">
                  {dayEvents.length > 0
                    ? dayEvents.slice(0, 3).map((event) => (
                        <TooltipProvider key={event.id}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div
                                className={cn(
                                  "text-xs px-2 py-1 rounded truncate border",
                                  getEventTypeColor(event.type),
                                )}
                                onClick={(e) => handleEventClick(event, e)}
                              >
                                {event.title}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent side="right">
                              <div className="space-y-1">
                                <p className="font-medium">{event.title}</p>
                                <p className="text-xs capitalize flex items-center gap-1">
                                  <Badge variant="outline" className={cn(getEventTypeColor(event.type), "capitalize")}>
                                    {event.type}
                                  </Badge>
                                </p>
                                {event.description && <p className="text-xs max-w-[200px]">{event.description}</p>}
                                <p className="text-xs">{formatEventTime(event)}</p>
                                {event.location && <p className="text-xs">📍 {event.location}</p>}
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ))
                    : null}
                  {dayEvents.length > 3 && (
                    <div className="text-xs text-center text-muted-foreground">+{dayEvents.length - 3} more</div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Selected Date Events */}
      {selectedDate && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-muted-foreground" />
                <h3 className="text-lg font-medium">Events for {format(selectedDate, "MMMM d, yyyy")}</h3>
              </div>
              {!readOnly && (
                <Button size="sm" onClick={handleAddEvent}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Event
                </Button>
              )}
            </div>
            {selectedDateEvents.length > 0 ? (
              <div className="space-y-3">
                {selectedDateEvents.map((event) => (
                  <div
                    key={event.id}
                    className={cn(
                      "p-3 rounded-md border",
                      getEventTypeColor(event.type),
                      !readOnly && "cursor-pointer hover:opacity-90",
                    )}
                    onClick={() => !readOnly && handleEventClick(event, {} as React.MouseEvent)}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium">{event.title}</h4>
                        {event.description && <p className="text-sm mt-1">{event.description}</p>}
                      </div>
                      <Badge variant="outline" className="capitalize">
                        {event.type}
                      </Badge>
                    </div>
                    <div className="text-sm mt-2 flex flex-wrap gap-2">
                      <span>{formatEventTime(event)}</span>
                      {event.location && <span className="flex items-center gap-1">• 📍 {event.location}</span>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">No events scheduled for this day</div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Event Dialog */}
      {!readOnly && (
        <EventDialog
          isOpen={isDialogOpen}
          onClose={handleDialogClose}
          onSave={handleDialogSave}
          onDelete={selectedEvent ? handleDialogDelete : undefined}
          event={selectedEvent}
          selectedDate={selectedDate}
        />
      )}
    </div>
  )
}
