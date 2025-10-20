"use client"
import {
  CalendarView,
  type CalendarEvent,
  type CalendarEventType,
} from "@/app/dashboard/calendar/components/calendar-view"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { Download, CalendarIcon } from "lucide-react"
import { useCalendarEvents } from "@/hooks/use-calendar-events"

export function AdminCalendarView() {
  const {
    events,
    isLoading,
    addEvent,
    updateEvent,
    deleteEvent,
    filteredEvents,
    setSelectedEventTypes,
    selectedEventTypes,
    allEventTypes,
  } = useCalendarEvents()

  const handleAddEvent = async (event: Omit<CalendarEvent, "id">) => {
    try {
      await addEvent(event)
      toast({
        title: "Event added",
        description: "The event has been added to the calendar.",
      })
    } catch {
      toast({
        title: "Failed to add event",
        description: "There was an error adding the event. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleUpdateEvent = async (event: CalendarEvent) => {
    try {
      await updateEvent(event)
      toast({
        title: "Event updated",
        description: "The event has been updated successfully.",
      })
    } catch {
      toast({
        title: "Failed to update event",
        description: "There was an error updating the event. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteEvent = async (eventId: string) => {
    try {
      await deleteEvent(eventId)
      toast({
        title: "Event deleted",
        description: "The event has been removed from the calendar.",
      })
    } catch {
      toast({
        title: "Failed to delete event",
        description: "There was an error deleting the event. Please try again.",
        variant: "destructive",
      })
    }
  }

  const exportCalendar = () => {
    if (!events.length) {
      toast({
        title: "No events to export",
        description: "There are no calendar events to export.",
        variant: "destructive",
      })
      return
    }

    // Create iCalendar format data
    const icsData = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Gradiant//Calendar//EN",
      ...events.map((event) =>
        [
          "BEGIN:VEVENT",
          `UID:${event.id}`,
          `DTSTAMP:${new Date().toISOString().replace(/[-:.]/g, "").split("T")[0]}T000000Z`,
          `DTSTART:${new Date(event.date).toISOString().replace(/[-:.]/g, "").split("T")[0]}T000000Z`,
          `SUMMARY:${event.title}`,
          `DESCRIPTION:${event.description || ""}`,
          `CATEGORIES:${event.type}`,
          "END:VEVENT",
        ].join("\r\n"),
      ),
      "END:VCALENDAR",
    ].join("\r\n")

    // Create and trigger download
    const blob = new Blob([icsData], { type: "text/calendar;charset=utf-8" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = "gradiant-calendar.ics"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "Calendar exported",
      description: "Calendar has been exported in iCalendar format.",
    })
  }

  const handleFilterChange = (types: CalendarEventType[]) => {
    setSelectedEventTypes(types)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-3/4">
          <Card>
            <CardHeader className="pb-0">
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  School Calendar
                </CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={exportCalendar}>
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
              <CardDescription>Manage academic calendar and important school events</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <CalendarView
                events={filteredEvents}
                onAddEvent={handleAddEvent}
                onEditEvent={handleUpdateEvent}
                onDeleteEvent={handleDeleteEvent}
                isLoading={isLoading}
              />
            </CardContent>
          </Card>
        </div>

        <div className="w-full md:w-1/4">
          <Card>
            <CardHeader>
              <CardTitle>Event Filters</CardTitle>
              <CardDescription>Filter events by type</CardDescription>
            </CardHeader>
            <CardContent>
              <EventFilters allTypes={allEventTypes} selectedTypes={selectedEventTypes} onChange={handleFilterChange} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

type EventFiltersProps = {
  allTypes: CalendarEventType[]
  selectedTypes: CalendarEventType[]
  onChange: (selected: CalendarEventType[]) => void
}

function EventFilters({ allTypes, selectedTypes, onChange }: EventFiltersProps) {
  const toggleType = (type: CalendarEventType) => {
    if (selectedTypes.includes(type)) {
      onChange(selectedTypes.filter((t) => t !== type))
    } else {
      onChange([...selectedTypes, type])
    }
  }

  const selectAll = () => {
    onChange([...allTypes])
  }

  const selectNone = () => {
    onChange([])
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between text-sm mb-2">
        <Button variant="link" size="sm" className="p-0 h-auto" onClick={selectAll}>
          Select All
        </Button>
        <Button variant="link" size="sm" className="p-0 h-auto" onClick={selectNone}>
          Clear
        </Button>
      </div>
      <div className="space-y-2">
        {allTypes.map((type) => (
          <div key={type} className="flex items-center">
            <input
              type="checkbox"
              id={`filter-${type}`}
              checked={selectedTypes.includes(type)}
              onChange={() => toggleType(type)}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <label htmlFor={`filter-${type}`} className="ml-2 text-sm capitalize">
              {type}
            </label>
          </div>
        ))}
      </div>
    </div>
  )
}
