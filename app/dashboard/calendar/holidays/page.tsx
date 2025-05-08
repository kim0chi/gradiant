"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarView, type CalendarEvent } from "../components/calendar-view"

// Mock data for holidays
const mockHolidays: CalendarEvent[] = [
  {
    id: "h1",
    title: "Winter Break",
    date: new Date(new Date().getFullYear(), 11, 20).toISOString(),
    type: "holiday",
    description: "Winter Break - No School",
    allDay: true,
  },
  {
    id: "h2",
    title: "Spring Break",
    date: new Date(new Date().getFullYear(), 2, 15).toISOString(),
    type: "holiday",
    description: "Spring Break - No School",
    allDay: true,
  },
  {
    id: "h3",
    title: "Memorial Day",
    date: new Date(new Date().getFullYear(), 4, 30).toISOString(),
    type: "holiday",
    description: "Memorial Day - No School",
    allDay: true,
  },
  {
    id: "h4",
    title: "Labor Day",
    date: new Date(new Date().getFullYear(), 8, 5).toISOString(),
    type: "holiday",
    description: "Labor Day - No School",
    allDay: true,
  },
  {
    id: "h5",
    title: "Thanksgiving Break",
    date: new Date(new Date().getFullYear(), 10, 25).toISOString(),
    type: "holiday",
    description: "Thanksgiving Break - No School",
    allDay: true,
  },
]

export default function HolidaysPage() {
  const [holidays, setHolidays] = useState<CalendarEvent[]>([])

  useEffect(() => {
    // In a real app, you would fetch holidays from your API
    setHolidays(mockHolidays)
  }, [])

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold tracking-tight">School Holidays</h1>
      <p className="text-muted-foreground">View and manage school holidays and breaks.</p>

      <Card>
        <CardHeader>
          <CardTitle>Holidays Calendar</CardTitle>
          <CardDescription>A comprehensive view of all scheduled holidays for the academic year.</CardDescription>
        </CardHeader>
        <CardContent>
          <CalendarView events={holidays} readOnly />
        </CardContent>
      </Card>
    </div>
  )
}
