import { supabase } from "./supabase/client"
import { isDebugMode } from "./mockAuth"

// Function to get student performance data
export async function getStudentPerformanceData(studentId: string) {
  if (isDebugMode()) {
    return generateMockPerformanceData(studentId)
  }

  try {
    // In a real implementation, we would fetch data from Supabase
    // Fetch grades
    const { data: grades, error: gradesError } = await supabase.from("grades").select("*").eq("student_id", studentId)

    if (gradesError) throw gradesError

    // Fetch tasks
    const { data: tasks, error: tasksError } = await supabase.from("tasks").select("*").eq("student_id", studentId)

    if (tasksError) throw tasksError

    // Fetch attendance
    const { data: attendance, error: attendanceError } = await supabase
      .from("attendance")
      .select("*")
      .eq("student_id", studentId)

    if (attendanceError) throw attendanceError

    // Process the data and return
    return processStudentData(studentId, grades, tasks, attendance)
  } catch (error) {
    console.error("Error fetching student performance data:", error)
    // Fall back to mock data if there's an error
    return generateMockPerformanceData(studentId)
  }
}

// Helper function to process student data
function processStudentData(studentId: string, grades: any[], tasks: any[], attendance: any[]) {
  // This would be a real implementation that processes the data
  // For now, we'll return mock data
  return generateMockPerformanceData(studentId)
}

// Generate mock data for testing
function generateMockPerformanceData(studentId: string) {
  return {
    student: {
      id: studentId,
      name: "Student Name",
      grade: "10th Grade",
      gpa: 3.7,
    },
    grades: {
      overall: 87.5,
      bySubject: [
        { subject: "Mathematics", grade: 92, letterGrade: "A-" },
        { subject: "Science", grade: 88, letterGrade: "B+" },
        { subject: "English", grade: 85, letterGrade: "B" },
        { subject: "History", grade: 82, letterGrade: "B-" },
        { subject: "Art", grade: 95, letterGrade: "A" },
      ],
      byPeriod: [
        { period: "Q1", grade: 84 },
        { period: "Q2", grade: 86 },
        { period: "Q3", grade: 89 },
        { period: "Q4", grade: 91 },
      ],
      distribution: [
        { name: "A", value: 2, color: "#4ade80" },
        { name: "B", value: 3, color: "#22d3ee" },
        { name: "C", value: 1, color: "#f59e0b" },
        { name: "D", value: 0, color: "#f87171" },
        { name: "F", value: 0, color: "#ef4444" },
      ],
    },
    tasks: {
      total: 45,
      completed: 42,
      upcoming: 3,
      overdue: 0,
      byStatus: [
        { name: "Completed", value: 42, color: "#4ade80" },
        { name: "Upcoming", value: 3, color: "#22d3ee" },
        { name: "Overdue", value: 0, color: "#ef4444" },
      ],
      recent: [
        {
          id: "task-1",
          title: "Math Problem Set",
          dueDate: "2023-05-15",
          subject: "Mathematics",
          status: "completed",
          score: 95,
        },
        {
          id: "task-2",
          title: "Science Lab Report",
          dueDate: "2023-05-18",
          subject: "Science",
          status: "completed",
          score: 88,
        },
        {
          id: "task-3",
          title: "English Essay",
          dueDate: "2023-05-20",
          subject: "English",
          status: "upcoming",
          score: null,
        },
        {
          id: "task-4",
          title: "History Research",
          dueDate: "2023-05-22",
          subject: "History",
          status: "upcoming",
          score: null,
        },
        { id: "task-5", title: "Art Project", dueDate: "2023-05-25", subject: "Art", status: "upcoming", score: null },
      ],
    },
    attendance: {
      present: 42,
      absent: 2,
      tardy: 1,
      excused: 3,
      rate: 93.75,
      byMonth: [
        { month: "Jan", present: 20, absent: 1, tardy: 0, excused: 1 },
        { month: "Feb", present: 18, absent: 1, tardy: 1, excused: 0 },
        { month: "Mar", present: 21, absent: 0, tardy: 0, excused: 1 },
        { month: "Apr", present: 19, absent: 0, tardy: 0, excused: 1 },
        { month: "May", present: 22, absent: 0, tardy: 0, excused: 0 },
      ],
      recentDays: [
        { date: "2023-05-01", status: "present" },
        { date: "2023-05-02", status: "present" },
        { date: "2023-05-03", status: "present" },
        { date: "2023-05-04", status: "present" },
        { date: "2023-05-05", status: "present" },
        { date: "2023-05-08", status: "present" },
        { date: "2023-05-09", status: "present" },
        { date: "2023-05-10", status: "present" },
        { date: "2023-05-11", status: "excused" },
        { date: "2023-05-12", status: "present" },
      ],
    },
    analytics: {
      correlations: {
        attendanceVsGrades: [
          { month: "Jan", attendance: 91, grades: 84 },
          { month: "Feb", attendance: 90, grades: 86 },
          { month: "Mar", attendance: 95, grades: 89 },
          { month: "Apr", attendance: 95, grades: 91 },
          { month: "May", attendance: 100, grades: 93 },
        ],
        taskCompletionVsGrades: [
          { period: "Q1", completion: 88, grades: 84 },
          { period: "Q2", completion: 92, grades: 86 },
          { period: "Q3", completion: 95, grades: 89 },
          { period: "Q4", completion: 98, grades: 91 },
        ],
      },
      predictions: {
        projectedGrade: 92,
        riskFactors: [],
        recommendations: [
          "Continue maintaining excellent attendance",
          "Keep up the high task completion rate",
          "Consider additional practice in History to improve grades",
        ],
      },
    },
  }
}
