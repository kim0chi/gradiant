import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { TaskSchema } from "@/types/gradebook-schemas"

// Mock tasks data (same as in the main tasks route)
const mockTasks = [
  {
    id: "1",
    title: "Assignment 1",
    categoryId: "1",
    maxPoints: 100,
    dueDate: "2023-09-15T00:00:00.000Z",
    description: "First writing assignment",
    periodId: "1",
  },
  // ... other tasks
]

/**
 * GET handler for retrieving a specific task
 */
export async function GET(request: NextRequest, { params }: { params: { classId: string; taskId: string } }) {
  const { classId, taskId } = params

  try {
    // In a real app, fetch task from database
    // const task = await db.tasks.findUnique({
    //   where: {
    //     id: taskId,
    //     classId,
    //   }
    // })

    // For now, find in mock data
    const task = mockTasks.find((t) => t.id === taskId)

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    return NextResponse.json(task)
  } catch (error) {
    console.error("Error fetching task:", error)
    return NextResponse.json({ error: "Failed to fetch task" }, { status: 500 })
  }
}

/**
 * PATCH handler for updating a specific task
 */
export async function PATCH(request: NextRequest, { params }: { params: { classId: string; taskId: string } }) {
  const { classId, taskId } = params

  try {
    // Parse the request body
    const body = await request.json()

    // Validate the request body
    const validatedData = TaskSchema.parse(body)

    // In a real app, update the task in the database
    // const task = await db.tasks.update({
    //   where: {
    //     id: taskId,
    //     classId,
    //   },
    //   data: validatedData,
    // })

    // For now, simulate task update
    const updatedTask = {
      ...validatedData,
      id: taskId,
      classId,
    }

    return NextResponse.json(updatedTask)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid request data", details: error.errors }, { status: 400 })
    }

    console.error("Error updating task:", error)
    return NextResponse.json({ error: "Failed to update task" }, { status: 500 })
  }
}

/**
 * DELETE handler for removing a specific task
 */
export async function DELETE(request: NextRequest, { params }: { params: { classId: string; taskId: string } }) {
  const { classId, taskId } = params

  try {
    // In a real app, delete the task from the database
    // await db.tasks.delete({
    //   where: {
    //     id: taskId,
    //     classId,
    //   },
    // })

    // For now, just return success
    return NextResponse.json({ message: "Task deleted successfully" })
  } catch (error) {
    console.error("Error deleting task:", error)
    return NextResponse.json({ error: "Failed to delete task" }, { status: 500 })
  }
}
