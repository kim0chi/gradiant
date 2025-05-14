"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { CalendarIcon } from "lucide-react"
import { format, addDays } from "date-fns"

type EventType = "exam" | "holiday" | "meeting" | "deadline"

type EventItem = {
  id: string
  title: string
  date: string
  type: EventType
  description?: string
}

export function UpcomingEvents() {
  const [events, setEvents] = useState<EventItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchEvents() {
      try {
        // In a real application, this would be an API call
        // For demo purposes, we'll simulate the data loading
        setTimeout(() => {
          setEvents(generateMockEvents())
          setLoading(false)
        }, 1000)
      } catch (error) {
        console.error("Error fetching events:", error)
        setEvents(generateMockEvents())
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  // Generate mock data for demo purposes
  function generateMockEvents(): EventItem[] {
    const today = new Date()

    return [
      {
        id: "event-1",
        title: "Midterm Exams Begin",
        date: addDays(today, 5).toISOString(),
        type: "exam",
        description: "Midterm examinations for all subjects",
      },
      {
        id: "event-2",
        title: "Teacher Development Day",
        date: addDays(today, 10).toISOString(),
        type: "holiday",
        description: "No classes - Teacher professional development",
      },
      {
        id: "event-3",
        title: "Parent-Teacher Conference",
        date: addDays(today, 15).toISOString(),
        type: "meeting",
        description: "Discuss student progress with parents",
      },
      {
        id: "event-4",
        title: "Project Submission Deadline",
        date: addDays(today, 7).toISOString(),
        type: "deadline",
        description: "Final deadline for science fair projects",
      },
      {
        id: "event-5",
        title: "End of Grading Period",
        date: addDays(today, 20).toISOString(),
        type: "deadline",
        description: "Last day to submit grades for the current period",
      },
    ]
  }

  // Get event type badge color
  const getEventTypeColor = (type: EventType) => {
    switch (type) {
      case "exam":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300"
      case "holiday":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "meeting":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "deadline":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  // Format date
  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString)
    return format(date, "MMMM d, yyyy")
  }

  // Calculate days until event
  const getDaysUntil = (dateString: string) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const eventDate = new Date(dateString)
    eventDate.setHours(0, 0, 0, 0)

    const diffTime = eventDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return "Today"
    if (diffDays === 1) return "Tomorrow"
    return `In ${diffDays} days`
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-4 w-[160px]" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {events.length > 0 ? (
        events.map((event) => (
          <div key={event.id} className="border-b pb-3 last:border-0 last:pb-0">
            <div className="flex items-center justify-between mb-1">
              <h4 className="font-medium">{event.title}</h4>
              <Badge variant="outline" className={getEventTypeColor(event.type)}>
                {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
              </Badge>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <CalendarIcon className="mr-1 h-3 w-3" />
              <span>{formatEventDate(event.date)}</span>
              <span className="mx-2">•</span>
              <span className="font-medium">{getDaysUntil(event.date)}</span>
            </div>
            {event.description && <p className="text-sm text-muted-foreground mt-1">{event.description}</p>}
          </div>
        ))
      ) : (
        <div className="text-center py-6 text-muted-foreground">
          <p>No upcoming events</p>
        </div>
      )}
    </div>
  )
}
