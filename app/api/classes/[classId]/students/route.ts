import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { StudentSchema } from "@/types/gradebook-schemas"

// Mock students data
const mockStudents = [
  {
    id: "STU001",
    studentId: "2023-001",
    firstName: "Alice",
    lastName: "Johnson",
    email: "alice.johnson@school.edu",
    status: "active" as const,
  },
  {
    id: "STU002",
    studentId: "2023-002",
    firstName: "Bob",
    lastName: "Smith",
    email: "bob.smith@school.edu",
    status: "active" as const,
  },
  // ... other students
]

/**
 * GET handler for retrieving students for a specific class
 */
export async function GET(_request: NextRequest, { params }: { params: Promise<{ classId: string }> }) {
  const { classId: _classId } = await params

  try {
    // In a real app, fetch students from database
    // const students = await db.students.findMany({
    //   where: {
    //     enrollments: {
    //       some: { classId }
    //     }
    //   }
    // })

    // For now, return mock data
    return NextResponse.json({ students: mockStudents })
  } catch (error) {
    console.error("Error fetching students:", error)
    return NextResponse.json({ error: "Failed to fetch students" }, { status: 500 })
  }
}

/**
 * POST handler for adding a student to a class
 */
export async function POST(request: NextRequest, { params }: { params: Promise<{ classId: string }> }) {
  const { classId: _classId } = await params

  try {
    // Parse the request body
    const body = await request.json()

    // Validate the request body
    const validatedData = StudentSchema.parse(body)

    // In a real app, create or find the student and add to class
    // const student = await db.students.upsert({
    //   where: {
    //     email: validatedData.email
    //   },
    //   update: validatedData,
    //   create: validatedData,
    // })
    //
    // await db.enrollments.create({
    //   data: {
    //     studentId: student.id,
    //     classId,
    //   }
    // })

    // For now, simulate student creation
    const newStudent = {
      id: `STU${Date.now()}`,
      ...validatedData,
    }

    return NextResponse.json(newStudent, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid request data", details: error.errors }, { status: 400 })
    }

    console.error("Error adding student:", error)
    return NextResponse.json({ error: "Failed to add student" }, { status: 500 })
  }
}
