import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"

// Import the Zod schema for class creation
import { classFormSchema } from "@/app/dashboard/gradebook/components/create-class-dialog"

// Mock database for classes
const classes = [
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
    students: 32,
    teacherId: "teacher-001",
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
    students: 28,
    teacherId: "teacher-001",
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
    students: 30,
    teacherId: "teacher-001",
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
    students: 25,
    teacherId: "teacher-001",
  },
]

/**
 * GET handler for retrieving classes
 *
 * This endpoint returns all classes for a specific teacher.
 * In a real app, we would authenticate the request and filter by the teacher's ID.
 */
export async function GET(request: NextRequest) {
  // In a real app, we would get the teacher ID from the authenticated user
  const teacherId = "teacher-001"

  // Get the term filter from the query string
  const { searchParams } = new URL(request.url)
  const term = searchParams.get("term")

  // Filter classes by teacher ID and term (if provided)
  let teacherClasses = classes.filter((c) => c.teacherId === teacherId)

  if (term && term !== "All Terms") {
    teacherClasses = teacherClasses.filter((c) => c.term === term)
  }

  return NextResponse.json({ classes: teacherClasses })
}

/**
 * POST handler for creating a new class
 *
 * This endpoint validates the request body against our Zod schema,
 * creates a new class, and returns the new class data.
 */
export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json()

    // Validate the request body against our Zod schema
    const validatedData = classFormSchema.parse(body)

    // In a real app, we would get the teacher ID from the authenticated user
    const teacherId = "teacher-001"

    // Generate a new class ID
    const newClassId = `class-${(classes.length + 1).toString().padStart(3, "0")}`

    // Format dates for storage
    const formattedSchedule = {
      ...validatedData.schedule,
      startDate: validatedData.schedule.startDate.toISOString().split("T")[0],
      endDate: validatedData.schedule.endDate.toISOString().split("T")[0],
    }

    // Create the new class
    const newClass = {
      id: newClassId,
      ...validatedData,
      schedule: formattedSchedule,
      students: 0, // New class starts with 0 students
      teacherId,
    }

    // Add the new class to our "database"
    classes.push(newClass)

    // Return the new class
    return NextResponse.json({ class: newClass }, { status: 201 })
  } catch (error) {
    // If the error is from Zod, it's a validation error
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }

    // Otherwise, it's a server error
    console.error("Failed to create class:", error)
    return NextResponse.json({ error: "Failed to create class" }, { status: 500 })
  }
}
