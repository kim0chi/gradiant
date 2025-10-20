import { supabase } from "./supabase/client"

// Function to get students in a class
export async function getClassStudents(classId: string) {
  try {
    // In a real implementation, we would fetch data from Supabase
    const { data, error } = await supabase
      .from("class_enrollments")
      .select("student_id, profiles!inner(*)")
      .eq("class_id", classId)

    if (error) throw error

    if (!data || data.length === 0) {
      console.warn("No students found for class:", classId)
      return generateMockStudents()
    }

    return data.map((enrollment) => ({
      id: enrollment.student_id,
      name: enrollment.profiles.full_name || enrollment.profiles.email.split("@")[0],
      email: enrollment.profiles.email,
    }))
  } catch (error) {
    console.error("Error fetching class students:", error)
    // Fall back to mock data if there's an error
    return generateMockStudents()
  }
}

// Function to get tasks for a class
export async function getClassTasks(classId: string) {
  try {
    // In a real implementation, we would fetch data from Supabase
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("class_id", classId)
      .order("due_date", { ascending: true })

    if (error) throw error

    if (!data || data.length === 0) {
      console.warn("No tasks found for class:", classId)
      return generateMockTasks()
    }

    return data
  } catch (error) {
    console.error("Error fetching class tasks:", error)
    // Fall back to mock data if there's an error
    return generateMockTasks()
  }
}

// Generate mock students for testing
function generateMockStudents() {
  return [
    { id: "student-1", name: "Alice Johnson", email: "alice@example.com" },
    { id: "student-2", name: "Bob Smith", email: "bob@example.com" },
    { id: "student-3", name: "Charlie Brown", email: "charlie@example.com" },
    { id: "student-4", name: "Diana Prince", email: "diana@example.com" },
    { id: "student-5", name: "Edward Cullen", email: "edward@example.com" },
  ]
}

// Generate mock tasks for testing
function generateMockTasks() {
  return [
    { id: "task-1", title: "Math Quiz 1", dueDate: "2023-05-10", category: "Quiz", maxPoints: 100 },
    { id: "task-2", title: "Science Lab Report", dueDate: "2023-05-15", category: "Assignment", maxPoints: 50 },
    { id: "task-3", title: "English Essay", dueDate: "2023-05-20", category: "Essay", maxPoints: 100 },
    { id: "task-4", title: "History Research Paper", dueDate: "2023-05-25", category: "Project", maxPoints: 200 },
    { id: "task-5", title: "Final Exam", dueDate: "2023-06-01", category: "Exam", maxPoints: 100 },
  ]
}
