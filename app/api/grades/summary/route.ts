import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getMockStudentsData } from "@/lib/mockAuth"

// Helper function to convert numeric grade to letter grade (currently unused but kept for future use)
function _getLetterGrade(score: number): string {
  if (score >= 97) return "A+"
  if (score >= 93) return "A"
  if (score >= 90) return "A-"
  if (score >= 87) return "B+"
  if (score >= 83) return "B"
  if (score >= 80) return "B-"
  if (score >= 77) return "C+"
  if (score >= 73) return "C"
  if (score >= 70) return "C-"
  if (score >= 67) return "D+"
  if (score >= 63) return "D"
  if (score >= 60) return "D-"
  return "F"
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const classId = searchParams.get("classId")

  if (!classId) {
    return NextResponse.json({ error: "Class ID is required" }, { status: 400 })
  }

  try {
    const supabase = createClient()

    // Fetch students (from profiles table with role="student")
    const { data: enrollments, error: enrollmentsError } = await supabase
      .from("class_enrollments")
      .select("student_id, profiles!inner(*)")
      .eq("class_id", classId)
      .eq("profiles.role", "student")

    if (enrollmentsError) {
      console.error("Error fetching enrollments:", enrollmentsError)
      return NextResponse.json(generateMockGradeSummary())
    }

    if (!enrollments || enrollments.length === 0) {
      console.warn("No students found for class:", classId)
      return NextResponse.json(generateMockGradeSummary())
    }

    // Define standard grading periods
    const standardPeriods = ["prelims", "midterms", "semis", "finals"]

    // Fetch tasks for this class (to determine periods)
    const { data: tasks, error: tasksError } = await supabase
      .from("tasks")
      .select("id, category, due_date")
      .eq("class_id", classId)
      .order("due_date", { ascending: true })

    if (tasksError) {
      console.error("Error fetching tasks:", tasksError)
      return NextResponse.json(generateMockGradeSummary())
    }

    // Group tasks by period based on due dates
    const tasksByPeriod: Record<string, string[]> = {}

    if (tasks && tasks.length > 0) {
      // Divide tasks into 4 equal periods based on due dates
      const sortedTasks = [...tasks].sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())

      const periodSize = Math.ceil(sortedTasks.length / 4)

      standardPeriods.forEach((period, index) => {
        const start = index * periodSize
        const end = Math.min(start + periodSize, sortedTasks.length)
        tasksByPeriod[period] = sortedTasks.slice(start, end).map((task) => task.id)
      })
    }

    // Fetch grades for all students
    const { data: grades, error: gradesError } = await supabase
      .from("grades")
      .select("student_id, task_id, score")
      .eq("class_id", classId)

    if (gradesError) {
      console.error("Error fetching grades:", gradesError)
      return NextResponse.json(generateMockGradeSummary())
    }

    // Process the data into the required format
    const summaryData = enrollments.map((enrollment) => {
      const student = enrollment.profiles

      // Calculate grades for each period
      const periodGrades: Record<string, number> = {}
      let overallTotal = 0
      let overallCount = 0

      standardPeriods.forEach((period) => {
        const periodTasks = tasksByPeriod[period] || []
        let periodTotal = 0
        let periodCount = 0

        // Find grades for tasks in this period
        periodTasks.forEach((taskId) => {
          const grade = grades?.find((g) => g.student_id === student.id && g.task_id === taskId)

          if (grade && grade.score !== null) {
            periodTotal += grade.score
            periodCount++
          }
        })

        // Calculate average for this period
        const periodAverage = periodCount > 0 ? periodTotal / periodCount : 0
        periodGrades[period] = Math.round(periodAverage * 10) / 10 // Round to 1 decimal

        // Add to overall totals
        if (periodCount > 0) {
          overallTotal += periodAverage
          overallCount++
        }
      })

      // Calculate final average
      const finalAverage = overallCount > 0 ? Math.round((overallTotal / overallCount) * 10) / 10 : 0

      return {
        studentId: student.id,
        studentName: student.full_name || student.email.split("@")[0],
        periodGrades: periodGrades as Record<"prelims" | "midterms" | "semis" | "finals", number>,
        finalAverage,
      }
    })

    return NextResponse.json(summaryData)
  } catch (error) {
    console.error("Error fetching grade summary:", error)
    return NextResponse.json(generateMockGradeSummary())
  }
}

// Generate mock data for testing or when the API fails
function generateMockGradeSummary() {
  const mockStudents = getMockStudentsData()

  return mockStudents.map((student) => {
    // Generate random grades for each period
    const prelims = Math.floor(Math.random() * 30) + 70 // 70-99
    const midterms = Math.floor(Math.random() * 30) + 70
    const semis = Math.floor(Math.random() * 30) + 70
    const finals = Math.floor(Math.random() * 30) + 70

    // Calculate final average
    const finalAverage = Math.round((prelims + midterms + semis + finals) / 4)

    return {
      studentId: student.id,
      studentName: student.name,
      periodGrades: {
        prelims,
        midterms,
        semis,
        finals,
      },
      finalAverage,
    }
  })
}
