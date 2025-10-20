"use client"

import { useState } from "react"
import Link from "next/link"
import { Book, Clock, Users, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CreateClassDialog } from "./components/create-class-dialog"

// Mock data for teacher's classes - in production, this would come from an API call
const teacherClasses = [
  {
    id: "class-001",
    name: "Mathematics 101",
    section: "Section A",
    term: "First Semester 2023-2024",
    students: 32,
    schedule: "MWF 9:00 AM - 10:30 AM",
  },
  {
    id: "class-002",
    name: "Algebra",
    section: "Section B",
    term: "First Semester 2023-2024",
    students: 28,
    schedule: "TTh 1:00 PM - 2:30 PM",
  },
  {
    id: "class-003",
    name: "Geometry",
    section: "Section C",
    term: "First Semester 2023-2024",
    students: 30,
    schedule: "MWF 2:00 PM - 3:30 PM",
  },
  {
    id: "class-004",
    name: "Calculus",
    section: "Section A",
    term: "First Semester 2023-2024",
    students: 25,
    schedule: "TTh 9:00 AM - 10:30 AM",
  },
]

export default function ClassesPage() {
  // State for the create class dialog
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [classes, setClasses] = useState(teacherClasses)

  // Function to handle adding a new class
  const handleAddClass = (newClass: unknown) => {
    // In a real app, this would be an API call
    // For now, we'll just add it to our local state
    const classWithId = {
      ...newClass,
      id: `class-${(classes.length + 1).toString().padStart(3, "0")}`,
      students: 0, // New class starts with 0 students
    }
    setClasses([...classes, classWithId])
    setIsDialogOpen(false)
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Class Management</h1>
          <p className="text-muted-foreground mt-2">
            Select a class to view and manage its gradebook, attendance, and analytics.
          </p>
        </div>

        {/* Create Class button - opens the dialog on desktop, links to new page on mobile */}
        <div className="flex">
          {/* Desktop: Show dialog button */}
          <Button onClick={() => setIsDialogOpen(true)} className="hidden sm:flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create Class
          </Button>

          {/* Mobile: Navigate to dedicated page */}
          <Button asChild className="sm:hidden w-full">
            <Link href="/dashboard/classes/new" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create Class
            </Link>
          </Button>
        </div>
      </div>

      {/* Class selection grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {classes.map((classItem) => (
          <Card key={classItem.id} className="overflow-hidden">
            <CardHeader className="bg-muted/50 pb-4">
              <CardTitle>{classItem.name}</CardTitle>
              <CardDescription>{classItem.section}</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>{classItem.schedule}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Book className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>{classItem.term}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>{classItem.students} Students</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t bg-muted/20 px-6 py-4">
              <Button variant="outline" size="sm">
                View Details
              </Button>
              <Button asChild size="sm">
                <Link href={`/dashboard/gradebook/${classItem.id}`}>Select Class</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Create Class Dialog - for desktop */}
      <CreateClassDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} onSubmit={handleAddClass} />
    </div>
  )
}
