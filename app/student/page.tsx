// app/student/page.tsx
'use client'

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, BookOpen, CheckCircle, FileText, GraduationCap } from "lucide-react"
import { cn } from "@/lib/utils"
import { getMockUser } from "@/lib/mockAuth"
import { createBrowserClient } from "@/lib/supabase/client"
import AppLayout from "@/components/layout/app-layout"

export default function StudentDashboard() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)

  // Mock data for student dashboard
  const courses = [
    { id: 1, name: "Mathematics", teacher: "Ms. Johnson", grade: 92, lastUpdated: "2 days ago" },
    { id: 2, name: "Science", teacher: "Mr. Rodriguez", grade: 88, lastUpdated: "1 week ago" },
    { id: 3, name: "English Literature", teacher: "Mrs. Davis", grade: 95, lastUpdated: "3 days ago" },
    { id: 4, name: "History", teacher: "Dr. Thompson", grade: 84, lastUpdated: "4 days ago" },
    { id: 5, name: "Computer Science", teacher: "Mr. Williams", grade: 97, lastUpdated: "yesterday" },
  ]

  const upcomingAssignments = [
    { id: 1, title: "Math Problem Set", course: "Mathematics", dueDate: "May 20, 2023", status: "Not started" },
    { id: 2, title: "Science Lab Report", course: "Science", dueDate: "May 22, 2023", status: "In progress" },
    { id: 3, title: "Essay on Hamlet", course: "English Literature", dueDate: "May 25, 2023", status: "Not started" },
    { id: 4, title: "History Research Paper", course: "History", dueDate: "May 30, 2023", status: "In progress" },
  ]

  const attendanceData = {
    present: 42,
    absent: 2,
    tardy: 1,
    excused: 3,
    total: 48,
  }

  // Class schedule data
  const classSchedule = [
    { day: "Monday", time: "8:00 AM", subject: "Mathematics", room: "Room 101", teacher: "Ms. Johnson" },
    { day: "Monday", time: "10:00 AM", subject: "Science", room: "Lab 3", teacher: "Mr. Rodriguez" },
    { day: "Monday", time: "1:00 PM", subject: "History", room: "Room 205", teacher: "Dr. Thompson" },
    { day: "Tuesday", time: "8:00 AM", subject: "English Literature", room: "Room 202", teacher: "Mrs. Davis" },
    { day: "Tuesday", time: "10:00 AM", subject: "Computer Science", room: "Lab 1", teacher: "Mr. Williams" },
    { day: "Wednesday", time: "8:00 AM", subject: "Mathematics", room: "Room 101", teacher: "Ms. Johnson" },
    { day: "Thursday", time: "10:00 AM", subject: "Computer Science", room: "Lab 1", teacher: "Mr. Williams" },
    { day: "Friday", time: "8:00 AM", subject: "Mathematics", room: "Room 101", teacher: "Ms. Johnson" },
  ]

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Try to get user from Supabase
        const supabase = createBrowserClient()
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (session) {
          // Get user profile
          const { data: profile } = await supabase.from("profiles").select("*").eq("id", session.user.id).single()

          if (profile) {
            setUser({
              id: profile.id,
              name: profile.full_name || session.user.email,
              email: session.user.email,
              role: profile.role,
            })
            setLoading(false)
            return
          }
        }

        // Fallback to mock user
        const mockUser = getMockUser()
        if (mockUser) {
          setUser(mockUser)
        } else {
          // If no user, create a demo one
          setUser({
            id: "demo-student",
            name: "Demo Student",
            email: "student@example.com",
            role: "student",
          })
        }
      } catch (err: any) {
        console.error("Error fetching student data:", err)
        setError(err.message || "Failed to load student data")

        // Fallback to demo user on error
        setUser({
          id: "demo-student",
          name: "Demo Student",
          email: "student@example.com",
          role: "student",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Calculate GPA (simple average for demo)
  const gpa = ((courses.reduce((sum, course) => sum + course.grade, 0) / courses.length / 100) * 4).toFixed(2)

  return (
    <AppLayout userRole="student">
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-2">Welcome, {user?.name?.split(" ")[0] || "Student"}</h1>
        <p className="text-muted-foreground mb-8">Here's an overview of your academic progress</p>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Current GPA</p>
                  <h3 className="text-2xl font-bold">{gpa}</h3>
                </div>
                <div className="p-2 bg-blue-100 rounded-full">
                  <GraduationCap className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Courses</p>
                  <h3 className="text-2xl font-bold">{courses.length}</h3>
                </div>
                <div className="p-2 bg-green-100 rounded-full">
                  <BookOpen className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Assignments</p>
                  <h3 className="text-2xl font-bold">{upcomingAssignments.length}</h3>
                </div>
                <div className="p-2 bg-purple-100 rounded-full">
                  <FileText className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Attendance</p>
                  <h3 className="text-2xl font-bold">
                    {Math.round((attendanceData.present / attendanceData.total) * 100)}%
                  </h3>
                </div>
                <div className="p-2 bg-amber-100 rounded-full">
                  <CheckCircle className="h-6 w-6 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="courses">
          <TabsList className="mb-4">
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="assignments">Assignments</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
          </TabsList>

          <TabsContent value="courses">
            <Card>
              <CardHeader>
                <CardTitle>Your Courses</CardTitle>
                <CardDescription>Current academic courses and grades</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p>Loading courses...</p>
                ) : courses.length > 0 ? (
                  <div className="grid gap-4">
                    {courses.map((course) => (
                      <div key={course.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{course.name}</h4>
                          <p className="text-sm text-muted-foreground">Instructor: {course.teacher}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            className={
                              course.grade >= 90
                                ? "bg-green-100 text-green-800"
                                : course.grade >= 80
                                  ? "bg-blue-100 text-blue-800"
                                  : course.grade >= 70
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                            }
                          >
                            {course.grade}%
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No courses found.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="assignments">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Assignments</CardTitle>
                <CardDescription>Tasks and homework due soon</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p>Loading assignments...</p>
                ) : upcomingAssignments.length > 0 ? (
                  <div className="grid gap-4">
                    {upcomingAssignments.map((assignment) => (
                      <div key={assignment.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{assignment.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {assignment.course} • Due: {assignment.dueDate}
                          </p>
                        </div>
                        <Badge
                          variant="outline"
                          className={
                            assignment.status === "Not started"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }
                        >
                          {assignment.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No upcoming assignments.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schedule">
            <Card>
              <CardHeader>
                <CardTitle>Class Schedule</CardTitle>
                <CardDescription>Your weekly timetable</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p>Loading schedule...</p>
                ) : classSchedule.length > 0 ? (
                  <div className="grid gap-4">
                    {classSchedule.slice(0, 5).map((cls, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{cls.subject}</h4>
                          <p className="text-sm text-muted-foreground">
                            {cls.day} at {cls.time} • {cls.room}
                          </p>
                        </div>
                        <div className="text-sm text-muted-foreground">{cls.teacher}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No schedule found.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Academic Progress</CardTitle>
              <CardDescription>Your progress across all subjects</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {courses.map((course) => (
                  <div key={course.id}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">{course.name}</span>
                      <span className="text-sm text-muted-foreground">{course.grade}%</span>
                    </div>
                    <Progress
                      value={course.grade}
                      className={cn("h-2", 
                        course.grade >= 90
                          ? "[&>div]:bg-green-500"
                          : course.grade >= 80
                            ? "[&>div]:bg-blue-500"
                            : course.grade >= 70
                              ? "[&>div]:bg-yellow-500"
                              : "[&>div]:bg-red-500"
                      )}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  )
}