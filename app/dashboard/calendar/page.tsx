"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarView, type CalendarEvent } from "./components/calendar-view"
import { useToast } from "@/components/ui/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

// Mock data for calendar events
const mockEvents: CalendarEvent[] = [
  {
    id: "1",
    title: "Spring Break",
    date: new Date(new Date().getFullYear(), new Date().getMonth(), 15).toISOString(),
    type: "holiday",
    description: "No school - Spring Break",
    allDay: true,
  },
  {
    id: "2",
    title: "Math Final Exam",
    date: new Date(new Date().getFullYear(), new Date().getMonth(), 20).toISOString(),
    type: "exam",
    description: "Comprehensive exam covering all semester material",
    allDay: false,
    startTime: "09:00",
    endTime: "11:00",
    location: "Room 101",
  },
  {
    id: "3",
    title: "Science Fair",
    date: new Date(new Date().getFullYear(), new Date().getMonth(), 25).toISOString(),
    type: "event",
    description: "Annual science fair in the gymnasium",
    allDay: true,
    location: "Gymnasium",
  },
  {
    id: "4",
    title: "Parent-Teacher Conferences",
    date: new Date(new Date().getFullYear(), new Date().getMonth(), 10).toISOString(),
    type: "event",
    description: "Schedule appointments with parents",
    allDay: false,
    startTime: "13:00",
    endTime: "19:00",
    location: "Main Building",
  },
]

export default function CalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [activeTab, setActiveTab] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    // Simulate API call with loading state
    setIsLoading(true)
    setError(null)

    // In a real app, you would fetch events from your API
    setTimeout(() => {
      try {
        setEvents(mockEvents)
        setIsLoading(false)
      } catch (_err) {
        setError("Failed to load calendar events. Please try again later.")
        setIsLoading(false)
      }
    }, 1000)
  }, [])

  // Filter events based on active tab
  const filteredEvents = events.filter((event) => {
    if (activeTab === "all") return true
    return event.type === activeTab
  })

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
      variant: "destructive",
    })
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Calendar Management</h1>
        <p className="text-muted-foreground">View and manage school events, holidays, and exam schedules.</p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Events</TabsTrigger>
          <TabsTrigger value="event">School Events</TabsTrigger>
          <TabsTrigger value="holiday">Holidays</TabsTrigger>
          <TabsTrigger value="exam">Exams</TabsTrigger>
        </TabsList>
        <TabsContent value={activeTab} className="mt-6">
          <CalendarView
            events={filteredEvents}
            onAddEvent={handleAddEvent}
            onEditEvent={handleEditEvent}
            onDeleteEvent={handleDeleteEvent}
            isLoading={isLoading}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
