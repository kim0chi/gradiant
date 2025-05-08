import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { GradeSchema } from "@/types/gradebook-schemas"

// Mock grades data
const mockGrades = [
  {
    id: "1",
    studentId: "1",
    taskId: "1",
    score: 85,
    feedback: "Good work",
    submissionDate: "2023-09-16T00:00:00.000Z",
  },
  {
    id: "2",
    studentId: "1",
    taskId: "2",
    score: 42,
    feedback: "Needs improvement",
    submissionDate: "2023-09-21T00:00:00.000Z",
  },
  {
    id: "3",
    studentId: "1",
    taskId: "3",
    score: 178,
    feedback: "Excellent",
    submissionDate: "2023-10-31T00:00:00.000Z",
  },
  {
    id: "4",
    studentId: "2",
    taskId: "1",
    score: 92,
    feedback: "Outstanding",
    submissionDate: "2023-09-15T00:00:00.000Z",
  },
  {
    id: "5",
    studentId: "2",
    taskId: "2",
    score: 45,
    feedback: "Good effort",
    submissionDate: "2023-09-20T00:00:00.000Z",
  },
  {
    id: "6",
    studentId: "2",
    taskId: "3",
    score: 185,
    feedback: "Very good",
    submissionDate: "2023-10-30T00:00:00.000Z",
  },
]

// Define the schema for the request body
const gradesRequestSchema = z.object({
  grades: z.array(GradeSchema),
})

/**
 * GET handler for retrieving grades for a specific class
 * Supports filtering by periodId query parameter
 */
export async function GET(request: NextRequest, { params }: { params: { classId: string } }) {
  const classId = params.classId
  const url = new URL(request.url)
  const periodId = url.searchParams.get("periodId")
  const studentId = url.searchParams.get("studentId")

  try {
    // In a real app, fetch grades from database with filtering
    // const grades = await db.grades.findMany({
    //   where: {
    //     task: {
    //       classId,
    //       ...(periodId ? { periodId } : {})
    //     },
    //     ...(studentId ? { studentId } : {})
    //   },
    //   include: {
    //     task: true
    //   }
    // })

    // For now, filter mock data if periodId is provided
    let filteredGrades = [...mockGrades]

    if (periodId || studentId) {
      // We need to join with tasks to filter by periodId
      // In a real app, this would be handled by the database query
      const mockTasks = [
        { id: "1", periodId: "1" },
        { id: "2", periodId: "1" },
        { id: "3", periodId: "2" },
        { id: "4", periodId: "3" },
        { id: "5", periodId: "4" },
      ]

      filteredGrades = mockGrades.filter((grade) => {
        const task = mockTasks.find((t) => t.id === grade.taskId)
        const periodMatches = !periodId || (task && task.periodId === periodId)
        const studentMatches = !studentId || grade.studentId === studentId
        return periodMatches && studentMatches
      })
    }

    return NextResponse.json({ grades: filteredGrades })
  } catch (error) {
    console.error("Error fetching grades:", error)
    return NextResponse.json({ error: "Failed to fetch grades" }, { status: 500 })
  }
}

/**
 * POST handler for saving multiple grades
 */
export async function POST(request: NextRequest, { params }: { params: { classId: string } }) {
  const classId = params.classId

  try {
    // Parse the request body
    const body = await request.json()

    // Validate the request body
    const validatedData = gradesRequestSchema.parse(body)

    // In a real app, save grades to the database
    // const savedGrades = await db.transaction(async (tx) => {
    //   return Promise.all(
    //     validatedData.grades.map(async (grade) => {
    //       // Check if grade already exists
    //       const existingGrade = await tx.grades.findFirst({
    //         where: {
    //           studentId: grade.studentId,
    //           taskId: grade.taskId,
    //         },
    //       })
    //
    //       if (existingGrade) {
    //         // Update existing grade
    //         return tx.grades.update({
    //           where: { id: existingGrade.id },
    //           data: {
    //             score: grade.score,
    //             feedback: grade.feedback,
    //             submissionDate: grade.submissionDate,
    //           },
    //         })
    //       } else {
    //         // Create new grade
    //         return tx.grades.create({
    //           data: {
    //             studentId: grade.studentId,
    //             taskId: grade.taskId,
    //             score: grade.score,
    //             feedback: grade.feedback || "",
    //             submissionDate: grade.submissionDate || new Date().toISOString(),
    //           },
    //         })
    //       }
    //     })
    //   )
    // })

    // For now, just return success
    return NextResponse.json({
      message: "Grades saved successfully",
      count: validatedData.grades.length,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid request data", details: error.errors }, { status: 400 })
    }

    console.error("Error saving grades:", error)
    return NextResponse.json({ error: "Failed to save grades" }, { status: 500 })
  }
}
