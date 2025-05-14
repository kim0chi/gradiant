import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"

// Define the Zod schema for class schedule
const scheduleSchema = z
  .object({
    days: z.array(z.string()).min(1, "Select at least one day"),
    startTime: z.string().min(1, "Start time is required"),
    endTime: z.string().min(1, "End time is required"),
    startDate: z.string().min(1, "Start date is required"), // Accept ISO date string
    endDate: z.string().min(1, "End date is required"), // Accept ISO date string
  })
  .refine(
    (data) => {
      // Ensure end time is after start time
      return data.startTime < data.endTime
    },
    {
      message: "End time must be after start time",
      path: ["endTime"],
    },
  )
  .refine(
    (data) => {
      // Ensure end date is after or equal to start date
      return data.endDate >= data.startDate
    },
    {
      message: "End date must be after or equal to start date",
      path: ["endDate"],
    },
  )

// Define the Zod schema for class updates
const classUpdateSchema = z.object({
  name: z.string().min(3, {
    message: "Class name must be at least 3 characters.",
  }),
  section: z.string().min(1, {
    message: "Section is required.",
  }),
  term: z.string().min(3, {
    message: "Term is required.",
  }),
  schedule: scheduleSchema,
  capacity: z.number().int().positive().min(1).max(100),
})

// Mock database of classes
const mockClasses = [
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
  // ... other classes
]

/**
 * GET handler for retrieving a specific class by ID
 */
export async function GET(request: NextRequest, { params }: { params: { classId: string } }) {
  const classId = params.classId

  // Find the class in our mock database
  const classItem = mockClasses.find((c) => c.id === classId)

  if (!classItem) {
    return NextResponse.json({ error: "Class not found" }, { status: 404 })
  }

  return NextResponse.json(classItem)
}

/**
 * PATCH handler for updating a specific class by ID
 */
export async function PATCH(request: NextRequest, { params }: { params: { classId: string } }) {
  const classId = params.classId

  // Find the class in our mock database
  const classIndex = mockClasses.findIndex((c) => c.id === classId)

  if (classIndex === -1) {
    return NextResponse.json({ error: "Class not found" }, { status: 404 })
  }

  try {
    // Parse the request body
    const body = await request.json()

    // Validate the request body against our schema
    const validatedData = classUpdateSchema.parse(body)

    // In a real app, update the class in the database
    // For now, we'll just simulate the update in our mock data
    const updatedClass = {
      ...mockClasses[classIndex],
      ...validatedData,
    }

    // In a real app, this would be a database update operation
    // mockClasses[classIndex] = updatedClass

    // Return the updated class
    return NextResponse.json(updatedClass)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid request data", details: error.errors }, { status: 400 })
    }

    console.error("Error updating class:", error)
    return NextResponse.json({ error: "Failed to update class" }, { status: 500 })
  }
}
