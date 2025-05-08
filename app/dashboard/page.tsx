"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock, Percent, BarChart3, Users, BookOpen, CheckCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { getUser } from "@/lib/auth-new"

export default function DashboardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [userName, setUserName] = useState<string | null>(null)

  useEffect(() => {
    async function loadUserData() {
      try {
        console.log("Dashboard: Loading user data...");
        setLoading(true);
        
        // Add a small delay to ensure the session is fully established
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const user = await getUser()
        console.log("Dashboard: Current user:", user)
        
        if (!user) {
          console.log("Dashboard: No user found, redirecting to login");
          // If no user is found, redirect to login
          router.push("/login")
          return
        }
        
        // The user object from auth-simple already has role and name
        // No need to extract from metadata
        const userRole = user.role || 'teacher';
        const userName = user.name || 'User';
        
        console.log(`Dashboard: User role: ${userRole}, name: ${userName}`);
        
        setUserRole(userRole);
        setUserName(userName);
        
        // Redirect to role-specific dashboard if needed
        if (userRole === "student") {
          console.log("Dashboard: Redirecting to student dashboard");
          router.push("/student")
          return;
        } else if (userRole === "admin") {
          console.log("Dashboard: Redirecting to admin dashboard");
          router.push("/admin/dashboard")
          return;
        }
        
        // If we get here, it's a teacher, so we stay on this page
        console.log("Dashboard: User is a teacher, staying on dashboard");
      } catch (error) {
        console.error("Dashboard: Error loading user data:", error)
        // If there's an error, we'll just show the dashboard without user data
      } finally {
        setLoading(false)
      }
    }
    
    loadUserData()
  }, [router])
  
  // Current date for the calendar
  const today = new Date()
  const formattedDate = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  })

  // Mock data for teacher's grading progress
  const gradingProgress = {
    totalTasks: 42,
    gradedTasks: 27,
    percentComplete: 64,
    pendingGrading: 15,
  }

  // Mock data for teacher's classes today
  const todaysClasses = [
    { id: 1, name: "Algebra II", period: "1st Period", time: "8:00 AM - 8:50 AM", room: "Room 101", students: 28 },
    { id: 2, name: "Geometry", period: "3rd Period", time: "10:00 AM - 10:50 AM", room: "Room 101", students: 24 },
    { id: 3, name: "Pre-Calculus", period: "5th Period", time: "12:30 PM - 1:20 PM", room: "Room 103", students: 22 },
    { id: 4, name: "Math Lab", period: "7th Period", time: "2:30 PM - 3:20 PM", room: "Room 105", students: 15 },
  ]

  // Mock data for today's events
  const todaysEvents = [
    { id: 1, title: "Department Meeting", time: "7:30 AM - 7:55 AM", location: "Staff Room" },
    { id: 2, title: "Math Club", time: "3:30 PM - 4:30 PM", location: "Room 101" },
    { id: 3, title: "Parent-Teacher Conference", time: "5:00 PM - 6:00 PM", location: "Conference Room" },
  ]

  // Mock analytics data
  const analyticsData = {
    averageClassSize: 22,
    totalStudents: 89,
    averageGrade: 82,
    attendanceRate: 94,
    submissionRate: 88,
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading dashboard...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Teacher Dashboard</h1>
      <p className="text-muted-foreground">Welcome back{userName ? `, ${userName}` : ''}! Here's an overview of your day.</p>

      {/* Top row: Grading Progress and Today's Date */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Grading Progress Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Grading Progress</CardTitle>
            <CardDescription>Your current grading workload</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center text-muted-foreground">
                <Percent className="h-4 w-4 mr-1" />
                <span>{gradingProgress.percentComplete}% Complete</span>
              </div>
              <span className="text-sm font-medium">
                {gradingProgress.gradedTasks}/{gradingProgress.totalTasks} Tasks
              </span>
            </div>

            <Progress value={gradingProgress.percentComplete} className="h-2 mb-2" />

            <div className="flex justify-between text-sm text-muted-foreground mt-2">
              <span>{gradingProgress.gradedTasks} graded</span>
              <span>{gradingProgress.pendingGrading} pending</span>
            </div>
          </CardContent>
        </Card>

        {/* Today's Date and Events */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Today's Calendar</CardTitle>
            <CardDescription>{formattedDate}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {todaysEvents.map((event) => (
                <div key={event.id} className="flex items-start">
                  <div className="mr-2 mt-0.5">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">{event.title}</p>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{event.time}</span>
                      <span className="mx-1">•</span>
                      <span>{event.location}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Middle row: Today's Classes */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Today's Classes</CardTitle>
          <CardDescription>Your teaching schedule for today</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {todaysClasses.map((cls) => (
              <Card key={cls.id} className="border shadow-sm">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-base">{cls.name}</CardTitle>
                    <Badge variant="outline">{cls.period}</Badge>
                  </div>
                  <CardDescription>{cls.room}</CardDescription>
                </CardHeader>
                <CardContent className="pb-3">
                  <div className="flex items-center text-sm text-muted-foreground mb-1">
                    <Clock className="h-3.5 w-3.5 mr-1" />
                    <span>{cls.time}</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="h-3.5 w-3.5 mr-1" />
                    <span>{cls.students} students</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Bottom row: Analytics */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Analytics Overview</CardTitle>
          <CardDescription>Key metrics across your classes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
            <div className="flex flex-col items-center justify-center p-3 border rounded-lg">
              <Users className="h-5 w-5 mb-1 text-muted-foreground" />
              <div className="text-2xl font-bold">{analyticsData.totalStudents}</div>
              <p className="text-xs text-muted-foreground text-center">Total Students</p>
            </div>

            <div className="flex flex-col items-center justify-center p-3 border rounded-lg">
              <BarChart3 className="h-5 w-5 mb-1 text-muted-foreground" />
              <div className="text-2xl font-bold">{analyticsData.averageGrade}%</div>
              <p className="text-xs text-muted-foreground text-center">Average Grade</p>
            </div>

            <div className="flex flex-col items-center justify-center p-3 border rounded-lg">
              <CheckCircle className="h-5 w-5 mb-1 text-muted-foreground" />
              <div className="text-2xl font-bold">{analyticsData.attendanceRate}%</div>
              <p className="text-xs text-muted-foreground text-center">Attendance Rate</p>
            </div>

            <div className="flex flex-col items-center justify-center p-3 border rounded-lg">
              <BookOpen className="h-5 w-5 mb-1 text-muted-foreground" />
              <div className="text-2xl font-bold">{analyticsData.submissionRate}%</div>
              <p className="text-xs text-muted-foreground text-center">Submission Rate</p>
            </div>

            <div className="flex flex-col items-center justify-center p-3 border rounded-lg">
              <Users className="h-5 w-5 mb-1 text-muted-foreground" />
              <div className="text-2xl font-bold">{analyticsData.averageClassSize}</div>
              <p className="text-xs text-muted-foreground text-center">Avg. Class Size</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
