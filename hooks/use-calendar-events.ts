"use client"

import { useState, useEffect, useMemo } from "react"
import { supabase } from "@/lib/supabase/client"
import type { CalendarEvent, CalendarEventType } from "@/app/dashboard/calendar/components/calendar-view"
import { v4 as uuidv4 } from "uuid"

export function useCalendarEvents() {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedEventTypes, setSelectedEventTypes] = useState<CalendarEventType[]>([])
  const [error, setError] = useState<string | null>(null)

  // Define all possible event types
  const allEventTypes = useMemo<CalendarEventType[]>(() => ["holiday", "exam", "event", "deadline", "assignment"], [])

  // Filter events based on selected types
  const filteredEvents = useMemo(() => {
    if (selectedEventTypes.length === 0) return events
    return events.filter((event) => selectedEventTypes.includes(event.type))
  }, [events, selectedEventTypes])

  useEffect(() => {
    async function fetchEvents() {
      try {
        setIsLoading(true)

        // In a real application, fetch from Supabase
        const { data, error } = await supabase.from("calendar_events").select("*")

        if (error) throw error

        if (data && data.length > 0) {
          setEvents(data as CalendarEvent[])
        } else {
          // Use mock data for demo
          setEvents(generateMockEvents())
        }

        // Initialize with all event types selected
        setSelectedEventTypes([...allEventTypes])
      } catch (err) {
        console.error("Error fetching calendar events:")
        console.error("Error object:", JSON.stringify(err, null, 2))
        console.error("Error keys:", err && typeof err === 'object' ? Object.keys(err) : 'N/A')
        console.error("Error toString:", String(err))
        setError("Failed to load calendar events")

        // Fallback to mock data
        setEvents(generateMockEvents())
        setSelectedEventTypes([...allEventTypes])
      } finally {
        setIsLoading(false)
      }
    }

    fetchEvents()
  }, [allEventTypes])

  // Add new event
  const addEvent = async (event: Omit<CalendarEvent, "id">) => {
    try {
      const newEvent = {
        id: uuidv4(),
        ...event,
      }

      // In a real app, save to Supabase
      const { error } = await supabase.from("calendar_events").insert(newEvent)

      if (error) throw error

      setEvents((prev) => [...prev, newEvent])
      return newEvent
    } catch (err) {
      console.error("Error adding event:")
      console.error("Error object:", JSON.stringify(err, null, 2))
      console.error("Error keys:", err && typeof err === 'object' ? Object.keys(err) : 'N/A')
      console.error("Error toString:", String(err))
      throw err
    }
  }

  // Update existing event
  const updateEvent = async (event: CalendarEvent) => {
    try {
      // In a real app, update in Supabase
      const { error } = await supabase.from("calendar_events").update(event).eq("id", event.id)

      if (error) throw error

      setEvents((prev) => prev.map((e) => (e.id === event.id ? event : e)))
      return event
    } catch (err) {
      console.error("Error updating event:")
      console.error("Error object:", JSON.stringify(err, null, 2))
      console.error("Error keys:", err && typeof err === 'object' ? Object.keys(err) : 'N/A')
      console.error("Error toString:", String(err))
      throw err
    }
  }

  // Delete event
  const deleteEvent = async (eventId: string) => {
    try {
      // In a real app, delete from Supabase
      const { error } = await supabase.from("calendar_events").delete().eq("id", eventId)

      if (error) throw error

      setEvents((prev) => prev.filter((e) => e.id !== eventId))
    } catch (err) {
      console.error("Error deleting event:")
      console.error("Error object:", JSON.stringify(err, null, 2))
      console.error("Error keys:", err && typeof err === 'object' ? Object.keys(err) : 'N/A')
      console.error("Error toString:", String(err))
      throw err
    }
  }

  return {
    events,
    filteredEvents,
    isLoading,
    error,
    addEvent,
    updateEvent,
    deleteEvent,
    selectedEventTypes,
    setSelectedEventTypes,
    allEventTypes,
  }
}

// Helper function to generate mock events for demo
function generateMockEvents(): CalendarEvent[] {
  const today = new Date()
  const types: CalendarEventType[] = ["holiday", "exam", "event", "deadline", "assignment"]

  const events: CalendarEvent[] = []

  // Past events
  for (let i = 0; i < 5; i++) {
    const date = new Date(today)
    date.setDate(date.getDate() - Math.floor(Math.random() * 30))

    events.push({
      id: uuidv4(),
      title: `Past ${types[i % types.length]} ${i + 1}`,
      date: date.toISOString(),
      type: types[i % types.length],
      description: `Description for past ${types[i % types.length]} ${i + 1}`,
    })
  }

  // Future events
  for (let i = 0; i < 10; i++) {
    const date = new Date(today)
    date.setDate(date.getDate() + Math.floor(Math.random() * 60))

    const type = types[Math.floor(Math.random() * types.length)]
    const isAllDay = Math.random() > 0.5

    let startTime, endTime
    if (!isAllDay) {
      const hour = Math.floor(Math.random() * 10) + 8 // 8 AM to 6 PM
      startTime = `${hour.toString().padStart(2, "0")}:00`
      endTime = `${(hour + 1).toString().padStart(2, "0")}:30`
    }

    events.push({
      id: uuidv4(),
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} ${i + 1}`,
      date: date.toISOString(),
      type,
      description: `Description for ${type} ${i + 1}`,
      allDay: isAllDay,
      startTime,
      endTime,
      location: Math.random() > 0.7 ? `Location ${i + 1}` : undefined,
    })
  }

  return events
}
