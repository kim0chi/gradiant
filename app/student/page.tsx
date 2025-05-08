"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  BookOpen,
  UserCheck,
  ChevronRight,
  BarChart2,
  Calendar,
  BookmarkIcon,
  User,
  Sun,
  Moon,
  Monitor,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { getCurrentUser } from "@/lib/supabase/client"
import { supabase } from "@/lib/supabase"
import StudentLayout from "@/components/student-layout"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

type Grade = {
  id: string
  subject: string
  title: string
  score: number
  maxScore: number
  date: string
}

type AttendanceRecord = {
  id: string
  date: string
  subject: string
  status: "present" | "absent" | "tardy"
}

type Assignment = {
  id: string
  title: string
  subject: string
  dueDate: string
  status: "pending" | "completed" | "late"
  description: string
}

export default function StudentPage() {
  const [loading, setLoading] = useState(true)
  const [userData, setUserData] = useState<any>(null)
  const [grades, setGrades] = useState<Grade[]>([])
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([])
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [attendanceRate, setAttendanceRate] = useState(0)
  const router = useRouter()

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await getCurrentUser()

        if (!user) {
          router.push("/login")
          return
        }

        // Only students should access this page
        if (user.role !== "student") {
          router.push("/dashboard")
          return
        }

        setUserData(user)

        // Fetch real grade data from the database
        // If no grades are found, use an empty array
        let studentGrades: Grade[] = []
        try {
          const { data: gradesData, error: gradesError } = await supabase
            .from('grades')
            .select('*')
            .eq('student_id', user.id)
          
          if (!gradesError && gradesData) {
            studentGrades = gradesData.map((grade: any) => ({
              id: grade.id,
              subject: grade.subject || 'Unknown',
              title: grade.title || 'Assignment',
              score: grade.score,
              maxScore: grade.max_score || 100,
              date: grade.created_at,
            }))
          }
        } catch (error) {
          console.error('Error fetching grades:', error)
        }
        
        // If no grades were found, use sample data for display purposes
        const mockGrades: Grade[] = studentGrades.length > 0 ? studentGrades : [
          {
            id: "1",
            subject: "Mathematics",
            title: "Midterm Exam",
            score: 87,
            maxScore: 100,
            date: "2023-05-01",
          },
          {
            id: "2",
            subject: "Science",
            title: "Lab Report",
            score: 92,
            maxScore: 100,
            date: "2023-05-03",
          },
          {
            id: "3",
            subject: "English",
            title: "Essay",
            score: 78,
            maxScore: 100,
            date: "2023-05-05",
          },
          {
            id: "4",
            subject: "History",
            title: "Quiz",
            score: 85,
            maxScore: 100,
            date: "2023-05-07",
          },
        ]

        // Fetch real attendance data from the database
        // If no attendance records are found, use an empty array
        let studentAttendance: AttendanceRecord[] = []
        try {
          const { data: attendanceData, error: attendanceError } = await supabase
            .from('attendance')
            .select('*')
            .eq('student_id', user.id)
          
          if (!attendanceError && attendanceData) {
            studentAttendance = attendanceData.map((record: any) => ({
              id: record.id,
              date: record.date,
              subject: record.subject || 'Unknown',
              status: record.status as 'present' | 'absent' | 'tardy',
            }))
          }
        } catch (error) {
          console.error('Error fetching attendance:', error)
        }
        
        // If no attendance records were found, use sample data for display purposes
        const mockAttendance: AttendanceRecord[] = studentAttendance.length > 0 ? studentAttendance : [
          {
            id: "1",
            date: "2023-05-01",
            subject: "Mathematics",
            status: "present",
          },
          {
            id: "2",
            date: "2023-05-02",
            subject: "Science",
            status: "present",
          },
          {
            id: "3",
            date: "2023-05-03",
            subject: "English",
            status: "tardy",
          },
          {
            id: "4",
            date: "2023-05-04",
            subject: "History",
            status: "absent",
          },
          {
            id: "5",
            date: "2023-05-05",
            subject: "Mathematics",
            status: "present",
          },
        ]

        // Fetch real assignments data from the database
        // If no assignments are found, use an empty array
        let studentAssignments: Assignment[] = []
        try {
          const { data: assignmentsData, error: assignmentsError } = await supabase
            .from('assignments')
            .select('*')
            .eq('student_id', user.id)
          
          if (!assignmentsError && assignmentsData) {
            studentAssignments = assignmentsData.map((assignment: any) => ({
              id: assignment.id,
              title: assignment.title,
              subject: assignment.subject || 'Unknown',
              dueDate: assignment.due_date,
              status: assignment.status as 'pending' | 'completed' | 'late',
              description: assignment.description,
            }))
          }
        } catch (error) {
          console.error('Error fetching assignments:', error)
        }
        
        // If no assignments were found, use sample data for display purposes
        const mockAssignments: Assignment[] = studentAssignments.length > 0 ? studentAssignments : [
          {
            id: "1",
            title: "Math Problem Set",
            subject: "Mathematics",
            dueDate: "2023-05-15",
            status: "pending",
            description: "Complete problems 1-20 in Chapter 5",
          },
          {
            id: "2",
            title: "Science Lab Report",
            subject: "Science",
            dueDate: "2023-05-10",
            status: "completed",
            description: "Write up results from the photosynthesis experiment",
          },
          {
            id: "3",
            title: "English Essay",
            subject: "English",
            dueDate: "2023-05-08",
            status: "late",
            description: "1000-word essay on Shakespeare's Macbeth",
          },
          {
            id: "4",
            title: "History Research",
            subject: "History",
            dueDate: "2023-05-20",
            status: "pending",
            description: "Research paper on Ancient Civilizations",
          },
        ]

        setGrades(mockGrades)
        setAttendance(mockAttendance)
        setAssignments(mockAssignments)

        // Calculate attendance rate
        const presentCount = mockAttendance.filter((a) => a.status === "present").length
        const tardyCount = mockAttendance.filter((a) => a.status === "tardy").length
        const totalDays = mockAttendance.length

        // Count tardy as half present
        const attendanceScore = presentCount + tardyCount * 0.5
        setAttendanceRate(Math.round((attendanceScore / totalDays) * 100))
      } catch (error) {
        console.error("Error fetching user data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [router])

  if (loading) {
    return (
      <StudentLayout>
        <div className="flex items-center justify-center min-h-screen">
          <p>Loading student dashboard...</p>
        </div>
      </StudentLayout>
    )
  }

  // Calculate average grade
  const averageGrade = grades.length
    ? Math.round(grades.reduce((sum, grade) => sum + (grade.score / grade.maxScore) * 100, 0) / grades.length)
    : 0

  // Calculate pending assignments
  const pendingAssignments = assignments.filter((a) => a.status === "pending").length

  return (
    <StudentLayout>
      <div className="p-6">
        <div className="mb-6 md:hidden">
          <h1 className="text-2xl font-bold">Student Dashboard</h1>
          <p className="text-muted-foreground">
            Good {new Date().getHours() < 12 ? "Morning" : new Date().getHours() < 18 ? "Afternoon" : "Evening"},
            {userData?.user_metadata?.full_name?.split(" ")[0] || userData?.email}
          </p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Overall Grade</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{averageGrade}%</div>
              <Progress value={averageGrade} className="h-2 mt-1" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Attendance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{attendanceRate}%</div>
              <Progress value={attendanceRate} className="h-2 mt-1" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Pending Assignments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingAssignments}</div>
              <Progress
                value={(pendingAssignments / assignments.length) * 100}
                className="h-2 mt-1 bg-yellow-100 dark:bg-yellow-900"
              >
                <div className="h-full bg-yellow-500" />
              </Progress>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Class Rank</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5 / 28</div>
              <Progress value={(5 / 28) * 100} className="h-2 mt-1" />
            </CardContent>
          </Card>
        </div>

        {/* Quick Access */}
        <h2 className="text-xl font-semibold mb-4">Quick Access</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="mr-2 h-5 w-5 text-primary" />
                Grades
              </CardTitle>
              <CardDescription>View your grades for all classes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">Mathematics</span>
                <span className="font-bold">87%</span>
              </div>
              <Progress value={87} className="h-2" />
              <div className="flex justify-between items-center">
                <span className="font-medium">Science</span>
                <span className="font-bold">92%</span>
              </div>
              <Progress value={92} className="h-2" />
              <div className="flex justify-between items-center">
                <span className="font-medium">English</span>
                <span className="font-bold">78%</span>
              </div>
              <Progress value={78} className="h-2" />
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" onClick={() => router.push("/student/grades")}>
                View All Grades
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookmarkIcon className="mr-2 h-5 w-5 text-primary" />
                Assignments
              </CardTitle>
              <CardDescription>View and manage your assignments</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {assignments.slice(0, 3).map((assignment) => (
                <div key={assignment.id} className="p-2 rounded-md border flex justify-between items-center">
                  <div>
                    <p className="font-medium">{assignment.title}</p>
                    <p className="text-xs text-muted-foreground">Due: {assignment.dueDate}</p>
                  </div>
                  <div
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      assignment.status === "completed"
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                        : assignment.status === "late"
                          ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                    }`}
                  >
                    {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                  </div>
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" onClick={() => router.push("/student/tasks")}>
                View All Assignments
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <UserCheck className="mr-2 h-5 w-5 text-primary" />
                Attendance
              </CardTitle>
              <CardDescription>View your attendance record</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span>Present</span>
                  <span className="font-medium">{attendance.filter((a) => a.status === "present").length} days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Absent</span>
                  <span className="font-medium">{attendance.filter((a) => a.status === "absent").length} days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Tardy</span>
                  <span className="font-medium">{attendance.filter((a) => a.status === "tardy").length} days</span>
                </div>
                <div className="mt-4">
                  <div className="text-sm font-medium mb-1">Last 7 days</div>
                  <div className="flex gap-1">
                    {[...Array(7)].map((_, i) => {
                      // Random status for demo
                      const statuses = ["present", "present", "present", "present", "tardy", "absent"]
                      const status = statuses[Math.floor(Math.random() * 6)]
                      return (
                        <div
                          key={i}
                          className={`h-6 w-6 rounded-full flex items-center justify-center text-xs ${
                            status === "present"
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                              : status === "tardy"
                                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                                : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                          }`}
                          title={status.charAt(0).toUpperCase() + status.slice(1)}
                        >
                          {status.charAt(0).toUpperCase()}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" onClick={() => router.push("/student/attendance")}>
                View Full Attendance
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Recent Activity and Upcoming */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-primary" />
                Upcoming
              </CardTitle>
              <CardDescription>Upcoming assignments and events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {assignments
                  .filter((a) => a.status === "pending")
                  .slice(0, 3)
                  .map((assignment) => (
                    <div key={assignment.id} className="flex items-start gap-4 pb-4 border-b last:border-0 last:pb-0">
                      <div
                        className={`h-10 w-10 rounded-full flex items-center justify-center bg-primary/10 text-primary`}
                      >
                        <BookmarkIcon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{assignment.title}</h4>
                        <p className="text-sm text-muted-foreground">Due: {assignment.dueDate}</p>
                        <p className="text-sm">{assignment.description}</p>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart2 className="mr-2 h-5 w-5 text-primary" />
                Performance
              </CardTitle>
              <CardDescription>Your academic performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-1">Grade Trend</h4>
                  <div className="h-24 flex items-end gap-1">
                    {[75, 82, 78, 85, 90, 88, 92].map((grade, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center">
                        <div
                          className="w-full bg-primary rounded-t"
                          style={{ height: `${(grade / 100) * 100}%` }}
                        ></div>
                        <span className="text-xs mt-1">{String.fromCharCode(65 + i)}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Subject Performance</h4>
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Mathematics</span>
                        <span>87%</span>
                      </div>
                      <Progress value={87} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Science</span>
                        <span>92%</span>
                      </div>
                      <Progress value={92} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>English</span>
                        <span>78%</span>
                      </div>
                      <Progress value={78} className="h-2" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Section */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Your Profile</h2>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="mr-2 h-5 w-5 text-primary" />
                Student Profile
              </CardTitle>
              <CardDescription>Your personal information and preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex flex-col items-center">
                  <Avatar className="h-24 w-24 mb-2">
                    <AvatarFallback className="bg-primary/10 text-primary text-xl">
                      {userData?.user_metadata?.full_name?.charAt(0) || userData?.email?.charAt(0) || "S"}
                    </AvatarFallback>
                  </Avatar>
                  <Button variant="outline" size="sm" className="mt-2">
                    Change Avatar
                  </Button>
                </div>

                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium mb-1 text-muted-foreground">Full Name</h4>
                      <p>{userData?.user_metadata?.full_name || "Student Name"}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-1 text-muted-foreground">Email</h4>
                      <p>{userData?.email || "student@example.com"}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-1 text-muted-foreground">Student ID</h4>
                      <p>STU-{Math.floor(10000 + Math.random() * 90000)}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-1 text-muted-foreground">Grade Level</h4>
                      <p>10th Grade</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="text-sm font-medium mb-3">Theme Preferences</h4>
                    <div className="flex items-center gap-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => document.documentElement.classList.remove("dark")}
                        className="flex items-center gap-2"
                      >
                        <Sun className="h-4 w-4" />
                        Light Mode
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => document.documentElement.classList.add("dark")}
                        className="flex items-center gap-2"
                      >
                        <Moon className="h-4 w-4" />
                        Dark Mode
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => document.documentElement.classList.toggle("dark")}
                        className="flex items-center gap-2"
                      >
                        <Monitor className="h-4 w-4" />
                        System Default
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" onClick={() => router.push("/student/profile")}>
                Edit Profile
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </StudentLayout>
  )
}
