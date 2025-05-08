"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarView, type CalendarEvent } from "../components/calendar-view"
import { useToast } from "@/components/ui/use-toast"

// Mock data for exams
const mockExams: CalendarEvent[] = [
  {
    id: "ex1",
    title: "Math Midterm",
    date: new Date(new Date().getFullYear(), new Date().getMonth(), 12).toISOString(),
    type: "exam",
    description: "Algebra and Geometry midterm exam",
    allDay: false,
    startTime: "09:00",
    endTime: "11:00",
  },
  {
    id: "ex2",
    title: "Science Final",
    date: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 20).toISOString(),
    type: "exam",
    description: "Comprehensive science final exam",
    allDay: false,
    startTime: "13:00",
    endTime: "15:00",
  },
  {
    id: "ex3",
    title: "History Quiz",
    date: new Date(new Date().getFullYear(), new Date().getMonth(), 8).toISOString(),
    type: "exam",
    description: "World History chapter quiz",
    allDay: false,
    startTime: "10:00",
    endTime: "10:45",
  },
  {
    id: "ex4",
    title: "English Literature Final",
    date: new Date(new Date().getFullYear(), new Date().getMonth() + 2, 15).toISOString(),
    type: "exam",
    description: "Final exam on all semester reading materials",
    allDay: false,
    startTime: "09:00",
    endTime: "11:00",
  },
]

export default function ExamsPage() {
  const [exams, setExams] = useState<CalendarEvent[]>([])
  const { toast } = useToast()

  useEffect(() => {
    // In a real app, you would fetch exams from your API
    setExams(mockExams)
  }, [])

  // Event handlers
  const handleAddExam = (eventData: Omit<CalendarEvent, "id">) => {
    const newExam: CalendarEvent = {
      ...eventData,
      id: `exam-${Date.now()}`,
    }

    setExams((prev) => [...prev, newExam])
    toast({
      title: "Exam Created",
      description: `"${newExam.title}" has been added to the calendar.`,
    })
  }

  const handleEditExam = (updatedExam: CalendarEvent) => {
    setExams((prev) => prev.map((exam) => (exam.id === updatedExam.id ? updatedExam : exam)))
    toast({
      title: "Exam Updated",
      description: `"${updatedExam.title}" has been updated.`,
    })
  }

  const handleDeleteExam = (examId: string) => {
    const examToDelete = exams.find((e) => e.id === examId)
    setExams((prev) => prev.filter((exam) => exam.id !== examId))
    toast({
      title: "Exam Deleted",
      description: examToDelete ? `"${examToDelete.title}" has been removed.` : "Exam has been removed.",
    })
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold tracking-tight">Exam Schedule</h1>
      <p className="text-muted-foreground">View and manage examination schedules.</p>

      <Card>
        <CardHeader>
          <CardTitle>Exams Calendar</CardTitle>
          <CardDescription>A comprehensive view of all scheduled exams for the academic year.</CardDescription>
        </CardHeader>
        <CardContent>
          <CalendarView
            events={exams}
            onAddEvent={handleAddExam}
            onEditEvent={handleEditExam}
            onDeleteEvent={handleDeleteExam}
          />
        </CardContent>
      </Card>
    </div>
  )
}
