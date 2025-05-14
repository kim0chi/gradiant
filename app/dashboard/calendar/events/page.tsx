"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarView, type CalendarEvent } from "../components/calendar-view"
import { useToast } from "@/components/ui/use-toast"

// Mock data for school events
const mockEvents: CalendarEvent[] = [
  {
    id: "e1",
    title: "Back to School Night",
    date: new Date(new Date().getFullYear(), new Date().getMonth(), 5).toISOString(),
    type: "event",
    description: "Annual back to school night for parents and students",
    allDay: false,
    startTime: "18:00",
    endTime: "20:00",
  },
  {
    id: "e2",
    title: "Science Fair",
    date: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 15).toISOString(),
    type: "event",
    description: "Annual science fair in the gymnasium",
    allDay: true,
  },
  {
    id: "e3",
    title: "Field Trip - Museum",
    date: new Date(new Date().getFullYear(), new Date().getMonth(), 22).toISOString(),
    type: "event",
    description: "Field trip to the Natural History Museum",
    allDay: true,
  },
  {
    id: "e4",
    title: "Parent-Teacher Conferences",
    date: new Date(new Date().getFullYear(), new Date().getMonth() + 2, 10).toISOString(),
    type: "event",
    description: "Schedule appointments with parents",
    allDay: false,
    startTime: "13:00",
    endTime: "19:00",
  },
]

export default function EventsPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const { toast } = useToast()

  useEffect(() => {
    // In a real app, you would fetch events from your API
    setEvents(mockEvents)
  }, [])

  // Event handlers
  const handleAddEvent = (eventData: Omit<CalendarEvent, "id">) => {
    const newEvent: CalendarEvent = {
      ...eventData,
      id: `event-${Date.now()}`,
    }

    setEvents((prev) => [...prev, newEvent])
    toast({
      title: "Event Created",
      description: `"${newEvent.title}" has been added to the calendar.`,
    })
  }

  const handleEditEvent = (updatedEvent: CalendarEvent) => {
    setEvents((prev) => prev.map((event) => (event.id === updatedEvent.id ? updatedEvent : event)))
    toast({
      title: "Event Updated",
      description: `"${updatedEvent.title}" has been updated.`,
    })
  }

  const handleDeleteEvent = (eventId: string) => {
    const eventToDelete = events.find((e) => e.id === eventId)
    setEvents((prev) => prev.filter((event) => event.id !== eventId))
    toast({
      title: "Event Deleted",
      description: eventToDelete ? `"${eventToDelete.title}" has been removed.` : "Event has been removed.",
    })
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold tracking-tight">School Events</h1>
      <p className="text-muted-foreground">View and manage school events and activities.</p>

      <Card>
        <CardHeader>
          <CardTitle>Events Calendar</CardTitle>
          <CardDescription>A comprehensive view of all scheduled events for the academic year.</CardDescription>
        </CardHeader>
        <CardContent>
          <CalendarView
            events={events}
            onAddEvent={handleAddEvent}
            onEditEvent={handleEditEvent}
            onDeleteEvent={handleDeleteEvent}
          />
        </CardContent>
      </Card>
    </div>
  )
}
