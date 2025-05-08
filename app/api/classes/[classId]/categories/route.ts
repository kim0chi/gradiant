import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { CategorySchema } from "@/types/gradebook-schemas"

// Define the schema for the request body
const categoriesRequestSchema = z.object({
  categories: z.array(CategorySchema),
})

// Mock categories data
const mockCategories = [
  { id: "1", name: "Assignments", weight: 30 },
  { id: "2", name: "Quizzes", weight: 20 },
  { id: "3", name: "Exams", weight: 40 },
  { id: "4", name: "Participation", weight: 10 },
]

/**
 * GET handler for retrieving categories for a specific class
 */
export async function GET(request: NextRequest, { params }: { params: { classId: string } }) {
  const classId = params.classId

  try {
    // In a real app, fetch categories from database
    // const categories = await db.categories.findMany({ where: { classId } })

    // For now, return mock data
    return NextResponse.json({ categories: mockCategories })
  } catch (error) {
    console.error("Error fetching categories:", error)
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
  }
}

/**
 * PATCH handler for updating categories for a specific class
 */
export async function PATCH(request: NextRequest, { params }: { params: { classId: string } }) {
  const classId = params.classId

  try {
    // Parse the request body
    const body = await request.json()

    // Validate the request body
    const validatedData = categoriesRequestSchema.parse(body)

    // In a real app, update categories in the database
    // const updatedCategories = await db.transaction(async (tx) => {
    //   // Delete existing categories
    //   await tx.categories.deleteMany({ where: { classId } })
    //
    //   // Create new categories
    //   return await Promise.all(
    //     validatedData.categories.map(category =>
    //       tx.categories.create({
    //         data: {
    //           ...category,
    //           classId,
    //         }
    //       })
    //     )
    //   )
    // })

    // For now, just return the validated data
    return NextResponse.json({
      categories: validatedData.categories,
      message: "Categories updated successfully",
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid request data", details: error.errors }, { status: 400 })
    }

    console.error("Error updating categories:", error)
    return NextResponse.json({ error: "Failed to update categories" }, { status: 500 })
  }
}
