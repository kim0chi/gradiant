"use client"

import { useState } from "react"
import Link from "next/link"
import { PlusCircle, Pencil, Calendar, LayoutGrid } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CreateClassDialog } from "./components/create-class-dialog"
import { EditClassDialog } from "./components/edit-class-dialog"
import React from "react"

// Define the class type
interface Class {
  id: string
  name: string
  section: string
  term: string
  schedule: {
    days: string[]
    startTime: string
    endTime: string
    startDate: string
    endDate: string
  }
  capacity: number
  students: number
}

// Mock data for classes
const mockClasses: Class[] = [
  {
    id: "class-001",
    name: "Mathematics 101",
    section: "Section A",
    term: "First Semester 2023-2024",
    schedule: {
      days: ["Mon", "Wed", "Fri"],
      startTime: "09:00",
      endTime: "10:30",
      startDate: "2023-08-15",
      endDate: "2023-12-15",
    },
    capacity: 35,
    students: 32,
  },
  {
    id: "class-002",
    name: "Algebra",
    section: "Section B",
    term: "First Semester 2023-2024",
    schedule: {
      days: ["Tue", "Thu"],
      startTime: "13:00",
      endTime: "14:30",
      startDate: "2023-08-15",
      endDate: "2023-12-15",
    },
    capacity: 30,
    students: 28,
  },
  {
    id: "class-003",
    name: "Geometry",
    section: "Section C",
    term: "First Semester 2023-2024",
    schedule: {
      days: ["Mon", "Wed", "Fri"],
      startTime: "14:00",
      endTime: "15:30",
      startDate: "2023-08-15",
      endDate: "2023-12-15",
    },
    capacity: 35,
    students: 30,
  },
  {
    id: "class-004",
    name: "Calculus",
    section: "Section A",
    term: "Second Semester 2023-2024",
    schedule: {
      days: ["Tue", "Thu"],
      startTime: "09:00",
      endTime: "10:30",
      startDate: "2024-01-15",
      endDate: "2024-05-15",
    },
    capacity: 30,
    students: 25,
  },
  {
    id: "class-005",
    name: "Statistics",
    section: "Section B",
    term: "Second Semester 2023-2024",
    schedule: {
      days: ["Mon", "Wed"],
      startTime: "11:00",
      endTime: "12:30",
      startDate: "2024-01-15",
      endDate: "2024-05-15",
    },
    capacity: 25,
    students: 22,
  },
]

// Available terms for filtering
const terms = ["All Terms", "First Semester 2023-2024", "Second Semester 2023-2024", "Summer 2024"]

// Format the schedule for display
function formatSchedule(schedule: Class["schedule"]) {
  const dayAbbreviations = schedule.days.join("-")
  return `${dayAbbreviations} ${schedule.startTime} - ${schedule.endTime}`
}

// Format the date range for display
function formatDateRange(schedule: Class["schedule"]) {
  const startDate = new Date(schedule.startDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })
  const endDate = new Date(schedule.endDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
  return `${startDate} - ${endDate}`
}

export default function GradebookPage() {
  const [selectedTerm, setSelectedTerm] = useState<string>("All Terms")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "timetable">("grid")

  // New state for edit dialog and selected class
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedClass, setSelectedClass] = useState<Class | null>(null)

  // Filter classes based on selected term
  const filteredClasses =
    selectedTerm === "All Terms" ? mockClasses : mockClasses.filter((c) => c.term === selectedTerm)

  // Handle edit button click
  const handleEditClick = (classItem: Class) => {
    setSelectedClass(classItem)
    setIsEditDialogOpen(true)
  }

  // Handle class update
  const handleClassUpdate = (updatedClass: Class) => {
    // In a real app, this would update the state with the updated class data
    console.log("Class updated:", updatedClass)

    // For now, just close the dialog
    setIsEditDialogOpen(false)
    setSelectedClass(null)
  }

  // Empty state component to avoid duplication
  const EmptyState = () => (
    <div className="text-center py-12">
      <h2 className="text-xl font-medium mb-2">No classes found</h2>
      <p className="text-muted-foreground mb-6">
        {selectedTerm === "All Terms"
          ? "You haven't created any classes yet."
          : `You don't have any classes for ${selectedTerm}.`}
      </p>
      <Button onClick={() => setIsCreateDialogOpen(true)} className="hidden md:inline-flex">
        <PlusCircle className="mr-2 h-4 w-4" />
        Create Your First Class
      </Button>
      <Button asChild className="md:hidden">
        <Link href="/dashboard/gradebook/new">
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Your First Class
        </Link>
      </Button>
    </div>
  )

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Gradebook</h1>
            <p className="text-muted-foreground mt-1">Manage your classes and access gradebooks</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Select value={selectedTerm} onValueChange={setSelectedTerm}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by term" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Terms</SelectLabel>
                  {terms.map((term) => (
                    <SelectItem key={term} value={term}>
                      {term}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            <div className="flex gap-2">
              {/* Desktop: Show dialog */}
              <Button onClick={() => setIsCreateDialogOpen(true)} className="hidden md:flex">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Class
              </Button>

              {/* Mobile: Navigate to dedicated page */}
              <Button asChild className="md:hidden">
                <Link href="/dashboard/gradebook/new">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create Class
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "grid" | "timetable")} className="w-full">
          <TabsList className="grid w-full max-w-[400px] grid-cols-2">
            <TabsTrigger value="grid" className="flex items-center gap-2">
              <LayoutGrid className="h-4 w-4" />
              <span>Grid View</span>
            </TabsTrigger>
            <TabsTrigger value="timetable" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Timetable</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="grid" className="mt-4">
            {filteredClasses.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredClasses.map((classItem) => (
                  <Card key={classItem.id} className="overflow-hidden relative">
                    {/* Edit button - positioned in the top-right corner */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 h-8 w-8"
                      onClick={() => handleEditClick(classItem)}
                      aria-label={`Edit ${classItem.name}`}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>

                    <CardContent className="p-6 pt-10">
                      {/* Added top padding to accommodate the edit button */}
                      <div className="flex flex-col h-full">
                        <div>
                          <h2 className="text-xl font-semibold">{classItem.name}</h2>
                          <p className="text-muted-foreground">{classItem.section}</p>
                        </div>

                        <div className="mt-4 space-y-2 flex-grow">
                          <div>
                            <div className="text-sm font-medium">Schedule</div>
                            <div className="text-sm">{formatSchedule(classItem.schedule)}</div>
                          </div>

                          <div>
                            <div className="text-sm font-medium">Dates</div>
                            <div className="text-sm">{formatDateRange(classItem.schedule)}</div>
                          </div>

                          <div>
                            <div className="text-sm font-medium">Term</div>
                            <div className="text-sm">{classItem.term}</div>
                          </div>

                          <div>
                            <div className="text-sm font-medium">Students</div>
                            <div className="text-sm">
                              {classItem.students} / {classItem.capacity}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>

                    <CardFooter className="bg-muted/50 p-4">
                      <Button asChild className="w-full">
                        <Link href={`/dashboard/gradebook/${classItem.id}`}>Select Class</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="timetable" className="mt-4">
            {filteredClasses.length === 0 ? (
              <EmptyState />
            ) : (
              <Card>
                <CardContent className="p-6">
                  <div className="grid grid-cols-6 gap-4">
                    <div className="font-medium text-center p-2 border-b">Time</div>
                    <div className="font-medium text-center p-2 border-b">Monday</div>
                    <div className="font-medium text-center p-2 border-b">Tuesday</div>
                    <div className="font-medium text-center p-2 border-b">Wednesday</div>
                    <div className="font-medium text-center p-2 border-b">Thursday</div>
                    <div className="font-medium text-center p-2 border-b">Friday</div>

                    {/* Time slots from 8 AM to 4 PM */}
                    {Array.from({ length: 9 }).map((_, index) => {
                      const hour = index + 8
                      const timeLabel = `${hour > 12 ? hour - 12 : hour}:00 ${hour >= 12 ? "PM" : "AM"}`

                      return (
                        <React.Fragment key={`time-${hour}`}>
                          <div className="text-sm p-2 border-t">{timeLabel}</div>
                          {/* Monday to Friday cells */}
                          {["Mon", "Tue", "Wed", "Thu", "Fri"].map((day) => {
                            // Find classes that occur on this day and time
                            const classesAtThisTime = filteredClasses.filter((c) => {
                              const startHour = Number.parseInt(c.schedule.startTime.split(":")[0])
                              const endHour = Number.parseInt(c.schedule.endTime.split(":")[0])
                              return c.schedule.days.includes(day) && startHour <= hour && endHour > hour
                            })

                            return (
                              <div key={`${day}-${hour}`} className="p-1 border-t min-h-[60px]">
                                {classesAtThisTime.map((c) => (
                                  <Link
                                    href={`/dashboard/gradebook/${c.id}`}
                                    key={c.id}
                                    className="block text-xs p-1 mb-1 bg-primary/10 rounded hover:bg-primary/20 transition-colors"
                                  >
                                    <div className="font-medium truncate">{c.name}</div>
                                    <div className="truncate">{c.section}</div>
                                  </Link>
                                ))}
                              </div>
                            )
                          })}
                        </React.Fragment>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Create Class Dialog (Desktop) */}
      <CreateClassDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} />

      {/* Edit Class Dialog */}
      {selectedClass && (
        <EditClassDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          classData={selectedClass}
          onUpdate={handleClassUpdate}
        />
      )}
    </div>
  )
}
