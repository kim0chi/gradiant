"use client"

import { useState, useEffect } from "react"
import { StudentTabs } from "@/components/student-tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Calendar, CheckCircle, Clock, GraduationCap, LineChart, Notebook } from "lucide-react"
import { getUser } from "@/lib/mockAuth"

// Mock data for student dashboard
const studentMetrics = {
  gpa: {
    current: 3.8,
    change: 0.2,
    lastTerm: 3.6,
  },
  attendance: {
    rate: 98,
    period: "last 30 days",
  },
  assignments: {
    completed: 24,
    total: 25,
    percentage: 96,
  },
  upcomingTasks: {
    count: 3,
    period: "next 7 days",
  },
}

const recentGrades = [
  {
    id: 1,
    subject: "Mathematics",
    task: "Quadratic Equations Quiz",
    grade: 92,
    maxPoints: 100,
    date: "2023-11-15",
  },
  {
    id: 2,
    subject: "English Literature",
    task: "Hamlet Essay",
    grade: 88,
    maxPoints: 100,
    date: "2023-11-12",
  },
  {
    id: 3,
    subject: "Biology",
    task: "Cell Structure Lab Report",
    grade: 95,
    maxPoints: 100,
    date: "2023-11-10",
  },
  {
    id: 4,
    subject: "History",
    task: "World War II Presentation",
    grade: 90,
    maxPoints: 100,
    date: "2023-11-05",
  },
]

const upcomingAssignments = [
  {
    id: 1,
    subject: "Physics",
    task: "Motion and Forces Lab",
    dueDate: "2023-11-20",
    priority: "high",
  },
  {
    id: 2,
    subject: "Computer Science",
    task: "Algorithms Assignment",
    dueDate: "2023-11-22",
    priority: "medium",
  },
  {
    id: 3,
    subject: "Art History",
    task: "Renaissance Analysis",
    dueDate: "2023-11-25",
    priority: "medium",
  },
]

/**
 * StudentDashboard Component
 *
 * Displays the main student dashboard with metrics, recent grades, and upcoming assignments
 * Matches the teacher dashboard layout structure but with student-specific content
 */
export default function StudentDashboard() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    // Get user data
    const userData = getUser()
    setUser(userData)
  }, [])

  // Format date to display in readable format
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
    }).format(date)
  }

  // Calculate days remaining until due date
  const getDaysRemaining = (dueDate: string) => {
    const today = new Date()
    const due = new Date(dueDate)
    const diffTime = due.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  // Get priority color for badge
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
    }
  }

  return (
    <div className="space-y-6">
      {/* Student Dashboard Tabs */}
      <StudentTabs />

      {/* Metrics Cards - Top Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Current GPA Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current GPA</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{studentMetrics.gpa.current}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">+{studentMetrics.gpa.change}</span> from last term
            </p>
          </CardContent>
        </Card>

        {/* Attendance Rate Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{studentMetrics.attendance.rate}%</div>
            <p className="text-xs text-muted-foreground">{studentMetrics.attendance.period}</p>
          </CardContent>
        </Card>

        {/* Completed Assignments Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Assignments</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {studentMetrics.assignments.completed}/{studentMetrics.assignments.total}
            </div>
            <div className="mt-2">
              <Progress value={studentMetrics.assignments.percentage} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">
                {studentMetrics.assignments.percentage}% completion rate
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Due Dates Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Due Dates</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{studentMetrics.upcomingTasks.count} tasks</div>
            <p className="text-xs text-muted-foreground">due in {studentMetrics.upcomingTasks.period}</p>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Sections - Bottom Rows */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Recent Grades Card */}
        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>Recent Grades</CardTitle>
              <CardDescription>Your recent assignment scores</CardDescription>
            </div>
            <LineChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentGrades.map((grade) => (
                <div key={grade.id} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{grade.task}</p>
                    <p className="text-xs text-muted-foreground">{grade.subject}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-sm font-medium">
                      {grade.grade}/{grade.maxPoints}
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        grade.grade >= 90
                          ? "bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-300"
                          : grade.grade >= 80
                            ? "bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                            : grade.grade >= 70
                              ? "bg-yellow-50 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                              : "bg-red-50 text-red-700 dark:bg-red-900 dark:text-red-300"
                      }
                    >
                      {grade.grade >= 90
                        ? "A"
                        : grade.grade >= 80
                          ? "B"
                          : grade.grade >= 70
                            ? "C"
                            : grade.grade >= 60
                              ? "D"
                              : "F"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Assignments Card */}
        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>Upcoming Assignments</CardTitle>
              <CardDescription>Tasks due in the next 7 days</CardDescription>
            </div>
            <Notebook className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingAssignments.map((assignment) => (
                <div key={assignment.id} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{assignment.task}</p>
                    <p className="text-xs text-muted-foreground">{assignment.subject}</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="text-sm font-medium">{formatDate(assignment.dueDate)}</div>
                    <div className="flex items-center gap-1">
                      <Badge variant="outline" className={getPriorityColor(assignment.priority)}>
                        {getDaysRemaining(assignment.dueDate) <= 0
                          ? "Today"
                          : getDaysRemaining(assignment.dueDate) === 1
                            ? "Tomorrow"
                            : `${getDaysRemaining(assignment.dueDate)} days`}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Assignment Progress Card */}
      <Card>
        <CardHeader>
          <CardTitle>Assignment Progress</CardTitle>
          <CardDescription>Your progress on current assignments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium">Mathematics</span>
                <span className="text-sm text-muted-foreground">75%</span>
              </div>
              <Progress value={75} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium">English Literature</span>
                <span className="text-sm text-muted-foreground">60%</span>
              </div>
              <Progress value={60} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium">Science</span>
                <span className="text-sm text-muted-foreground">90%</span>
              </div>
              <Progress value={90} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium">History</span>
                <span className="text-sm text-muted-foreground">45%</span>
              </div>
              <Progress value={45} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
