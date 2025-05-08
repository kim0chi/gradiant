import { supabase } from "./client"
import {
  isDebugMode,
  getMockClassesData,
  getMockStudentsData,
  getMockTasksData,
  getMockGradesData,
  getMockAttendanceData,
} from "@/lib/mockAuth"

// Classes
export async function getClasses() {
  if (isDebugMode()) {
    return getMockClassesData()
  }

  const { data, error } = await supabase.from("classes").select("*").order("name")
  if (error) throw error
  return data
}

export async function getClassById(id: string) {
  if (isDebugMode()) {
    return getMockClassesData().find((c) => c.id === id) || null
  }

  const { data, error } = await supabase.from("classes").select("*").eq("id", id).single()
  if (error) throw error
  return data
}

// Students
export async function getStudentsInClass(classId: string) {
  if (isDebugMode()) {
    return getMockStudentsData()
  }

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
  if (isDebugMode()) {
    return getMockTasksData()
  }

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
  if (isDebugMode()) {
    return getMockGradesData()
  }

  const { data, error } = await supabase.from("grades").select("*").eq("class_id", classId)

  if (error) throw error
  return data
}

export async function updateGrade(id: string, updates: any) {
  if (isDebugMode()) {
    console.log("Mock update grade:", id, updates)
    return { id, ...updates }
  }

  const { data, error } = await supabase.from("grades").update(updates).eq("id", id).select().single()

  if (error) throw error
  return data
}

export async function createGrade(grade: any) {
  if (isDebugMode()) {
    console.log("Mock create grade:", grade)
    return { id: "new-grade-id", ...grade }
  }

  const { data, error } = await supabase.from("grades").insert(grade).select().single()

  if (error) throw error
  return data
}

// Attendance
export async function getAttendanceForClass(classId: string, date: string) {
  if (isDebugMode()) {
    return getMockAttendanceData()
  }

  const { data, error } = await supabase.from("attendance").select("*").eq("class_id", classId).eq("date", date)

  if (error) throw error
  return data
}

export async function recordAttendance(attendance: any) {
  if (isDebugMode()) {
    console.log("Mock record attendance:", attendance)
    return { id: "new-attendance-id", ...attendance }
  }

  // Check if record already exists
  const { data: existing } = await supabase
    .from("attendance")
    .select("id")
    .eq("student_id", attendance.student_id)
    .eq("class_id", attendance.class_id)
    .eq("date", attendance.date)
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
  if (isDebugMode()) {
    return {
      id: userId,
      full_name: "Mock User",
      email: "mock@example.com",
      role: "teacher",
    }
  }

  const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single()

  if (error) throw error
  return data
}
