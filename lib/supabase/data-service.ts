import { supabase } from "./client"
import {
  getMockClassesData,
  getMockStudentsData,
  getMockTasksData,
  getMockGradesData,
  getMockAttendanceData,
} from "@/lib/mockAuth"

// Classes
export async function getClasses() {

  const { data, error } = await supabase.from("classes").select("*").order("name")
  if (error) throw error
  return data
}

export async function getClassById(id: string) {

  const { data, error } = await supabase.from("classes").select("*").eq("id", id).single()
  if (error) throw error
  return data
}

// Students
export async function getStudentsInClass(classId: string) {

  try {
    const { data, error } = await supabase.from("class_enrollments").select("students(*)").eq("class_id", classId)

    if (error) {
      console.error("Supabase error fetching students:", error)
      throw error
    }

    if (!data || data.length === 0) {
      console.warn("No students found for class:", classId)
      return []
    }

    return data.map((item) => item.students)
  } catch (error) {
    console.error("Error in getStudentsInClass:", error)
    // Return mock data as fallback
    return getMockStudentsData()
  }
}

// Tasks
export async function getTasksForClass(classId: string) {

  try {
    const { data, error } = await supabase.from("tasks").select("*").eq("class_id", classId).order("due_date")

    if (error) {
      console.error("Supabase error fetching tasks:", error)
      throw error
    }

    if (!data || data.length === 0) {
      console.warn("No tasks found for class:", classId)
      return []
    }

    return data
  } catch (error) {
    console.error("Error in getTasksForClass:", error)
    // Return mock data as fallback
    return getMockTasksData()
  }
}

// Grades
export async function getGradesForClass(classId: string) {

  const { data, error } = await supabase.from("grades").select("*").eq("class_id", classId)

  if (error) throw error
  return data
}

export async function updateGrade(id: string, updates: Record<string, unknown>) {
  const { data, error} = await supabase.from("grades").update(updates).eq("id", id).select().single()

  if (error) throw error
  return data
}

export async function createGrade(grade: Record<string, unknown>) {
  const { data, error } = await supabase.from("grades").insert(grade).select().single()

  if (error) throw error
  return data
}

// Attendance
export async function getAttendanceForClass(classId: string, date: string) {

  const { data, error } = await supabase.from("attendance").select("*").eq("class_id", classId).eq("date", date)

  if (error) throw error
  return data
}

export async function recordAttendance(attendance: Record<string, unknown>) {
  // Check if record already exists
  const { data: existing } = await supabase
    .from("attendance")
    .select("id")
    .eq("student_id", attendance.student_id as string)
    .eq("class_id", attendance.class_id as string)
    .eq("date", attendance.date as string)
    .single()

  if (existing) {
    // Update existing record
    const { data, error } = await supabase
      .from("attendance")
      .update({ status: attendance.status })
      .eq("id", existing.id)
      .select()
      .single()

    if (error) throw error
    return data
  } else {
    // Create new record
    const { data, error } = await supabase.from("attendance").insert(attendance).select().single()

    if (error) throw error
    return data
  }
}

// Users
export async function getUserProfile(userId: string) {
  const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single()

  if (error) throw error
  return data
}
