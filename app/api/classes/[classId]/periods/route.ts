import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { PeriodSchema } from "@/types/gradebook-schemas"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import type { Database } from "@/types/supabase"

// Define the schema for the request body
const periodsRequestSchema = z.object({
  periods: z.array(PeriodSchema),
})

// Mock periods data
const mockPeriods = [
  { id: "1", name: "Prelims", startDate: "2023-08-15T00:00:00.000Z", endDate: "2023-09-30T00:00:00.000Z", weight: 25 },
  { id: "2", name: "Midterms", startDate: "2023-10-01T00:00:00.000Z", endDate: "2023-11-15T00:00:00.000Z", weight: 25 },
  {
    id: "3",
    name: "Semi-Finals",
    startDate: "2023-11-16T00:00:00.000Z",
    endDate: "2023-12-15T00:00:00.000Z",
    weight: 25,
  },
  { id: "4", name: "Finals", startDate: "2023-12-16T00:00:00.000Z", endDate: "2024-01-31T00:00:00.000Z", weight: 25 },
]

/**
 * GET handler for retrieving periods for a specific class
 */
export async function GET(request: NextRequest, { params }: { params: { classId: string } }) {
  const classId = params.classId

  try {
    // In a real app, fetch periods from database
    // const periods = await db.periods.findMany({ where: { classId } })

    // For now, return mock data
    return NextResponse.json(mockPeriods)
  } catch (error) {
    console.error("Error fetching periods:", error)
    return NextResponse.json({ error: "Failed to fetch periods" }, { status: 500 })
  }
}

/**
 * PATCH handler for updating periods for a specific class
 */
export async function PATCH(request: NextRequest, { params }: { params: { classId: string } }) {
  const classId = params.classId

  try {
    // Parse the request body
    const body = await request.json()

    // Validate the request body
    const validatedData = periodsRequestSchema.parse(body)

    // In a real app, update periods in the database
    // const updatedPeriods = await db.transaction(async (tx) => {
    //   // Delete existing periods
    //   await tx.periods.deleteMany({ where: { classId } })
    //
    //   // Create new periods
    //   return await Promise.all(
    //     validatedData.periods.map(period =>
    //       tx.periods.create({
    //         data: {
    //           ...period,
    //           classId,
    //         }
    //       })
    //     )
    //   )
    // })

    // For now, just return the validated data
    return NextResponse.json({
      periods: validatedData.periods,
      message: "Periods updated successfully",
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid request data", details: error.errors }, { status: 400 })
    }

    console.error("Error updating periods:", error)
    return NextResponse.json({ error: "Failed to update periods" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { classId: string } }) {
  const classId = params.classId
  const supabase = createRouteHandlerClient<Database>({ cookies })

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Check if user has access to this class
  const { data: classData, error: classError } = await supabase.from("classes").select("*").eq("id", classId).single()

  if (classError || !classData) {
    return NextResponse.json({ error: "Class not found" }, { status: 404 })
  }

  if (classData.teacher_id !== session.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }

  // Get the period data from the request
  const periodData = await request.json()

  // Validate the period data
  if (!periodData.name || !periodData.startDate || !periodData.endDate) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  // Insert the new period
  const { data: newPeriod, error: insertError } = await supabase
    .from("periods")
    .insert({
      class_id: classId,
      name: periodData.name,
      start_date: periodData.startDate,
      end_date: periodData.endDate,
    })
    .select()
    .single()

  if (insertError) {
    return NextResponse.json({ error: "Failed to create period" }, { status: 500 })
  }

  // Transform the data to match our frontend expectations
  const transformedPeriod = {
    id: newPeriod.id,
    name: newPeriod.name,
    startDate: newPeriod.start_date,
    endDate: newPeriod.end_date,
  }

  return NextResponse.json(transformedPeriod)
}
