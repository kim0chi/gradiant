"use client"

import { useState, useEffect } from "react"
import { StudentTabs } from "@/components/student-tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { 
  BarChart3, 
  BookOpen, 
  Calendar, 
  CalendarDays, 
  CheckCircle, 
  Clock, 
  GraduationCap, 
  Percent,
  Users,
  Loader2
} from "lucide-react"
import { getStudentDashboardData } from "../data"

/**
 * Student Dashboard Overview Page
 * 
 * This page implements the main student dashboard view
 * It follows the same layout and styling as the teacher dashboard for consistency
 * Data is fetched from Supabase instead of using mock data
 */
export default function StudentDashboardOverviewPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  
  // Current date for the calendar
  const today = new Date()
  const formattedDate = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  })

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setIsLoading(true)
        const data = await getStudentDashboardData()
        setDashboardData(data)
      } catch (err: any) {
        console.error("Error fetching dashboard data:", err)
        setError(err.message || "Failed to load dashboard data")
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  // Use fallback data if real data is not available
  const assignmentProgress = dashboardData?.assignmentProgress || {
    totalAssignments: 0,
    completedAssignments: 0,
    percentComplete: 0,
    pendingAssignments: 0,
  }

  const upcomingEvents = dashboardData?.upcomingEvents || []
  const studentClasses = dashboardData?.studentClasses || []
  const analyticsData = dashboardData?.analyticsData || {
    gpa: 0,
    averageGrade: 0,
    attendanceRate: 0,
    completionRate: 0,
    totalClasses: 0,
  }
  const recentGrades = dashboardData?.recentGrades || []
  const upcomingAssignments = dashboardData?.upcomingAssignments || []

  // Define types for the data
  type Event = { id: string; title: string; time: string; location: string; }
  type Class = { id: string; name: string; period: string; room: string; time: string; teacher: string; }
  type Grade = { name: string; grade: string; score: string; }
  type Assignment = { name: string; due: string; class: string; }

  // Loading state UI
  if (isLoading) {
    return (
      <div className="space-y-6">
        <StudentTabs />
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Loading dashboard data...</p>
        </div>
      </div>
    )
  }

  // Error state UI
  if (error) {
    return (
      <div className="space-y-6">
        <StudentTabs />
        <Card>
          <CardHeader>
            <CardTitle className="text-red-500">Error Loading Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
            <p className="mt-2">Please try refreshing the page or contact support if the problem persists.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Student Tabs for navigation */}
      <StudentTabs />

      {/* Top row: Assignment Progress and Today's Calendar */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Assignment Progress Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Assignment Progress</CardTitle>
            <CardDescription>Your current assignment completion</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center text-muted-foreground">
                <Percent className="h-4 w-4 mr-1" />
                <span>{assignmentProgress.percentComplete}% Complete</span>
              </div>
              <span className="text-sm font-medium">
                {assignmentProgress.completedAssignments}/{assignmentProgress.totalAssignments} Assignments
              </span>
            </div>

            <Progress value={assignmentProgress.percentComplete} className="h-2 mb-2" />

            <div className="flex justify-between text-sm text-muted-foreground mt-2">
              <span>{assignmentProgress.completedAssignments} completed</span>
              <span>{assignmentProgress.pendingAssignments} pending</span>
            </div>
          </CardContent>
        </Card>

        {/* Today's Calendar Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Today's Schedule</CardTitle>
            <CardDescription>{formattedDate}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingEvents.length > 0 ? (
                upcomingEvents.map((event: Event) => (
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
                ))
              ) : (
                <div className="text-center py-2 text-muted-foreground">
                  <p>No upcoming events</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Middle row: Today's Classes */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Today's Classes</CardTitle>
          <CardDescription>Your class schedule for today</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {studentClasses.length > 0 ? (
              studentClasses.map((cls: Class) => (
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
                      <span>{cls.teacher}</span>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-4 text-muted-foreground">
                <p>No classes scheduled for today</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Bottom row: Analytics */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Performance Analytics</CardTitle>
          <CardDescription>Key metrics across your classes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
            <div className="flex flex-col items-center justify-center p-3 border rounded-lg">
              <GraduationCap className="h-5 w-5 mb-1 text-muted-foreground" />
              <div className="text-2xl font-bold">{analyticsData.gpa}</div>
              <p className="text-xs text-muted-foreground text-center">Current GPA</p>
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
              <div className="text-2xl font-bold">{analyticsData.completionRate}%</div>
              <p className="text-xs text-muted-foreground text-center">Completion Rate</p>
            </div>
            
            <div className="flex flex-col items-center justify-center p-3 border rounded-lg">
              <CalendarDays className="h-5 w-5 mb-1 text-muted-foreground" />
              <div className="text-2xl font-bold">{analyticsData.totalClasses}</div>
              <p className="text-xs text-muted-foreground text-center">Total Classes</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional sections: Recent Grades and Upcoming Assignments */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Grades Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Recent Grades</CardTitle>
            <CardDescription>Your most recent assignment scores</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentGrades.length > 0 ? (
                recentGrades.map((item: Grade, i: number) => (
                  <div key={i} className="flex items-center justify-between border-b pb-2">
                    <span>{item.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{item.grade}</span>
                      <span className="text-xs text-muted-foreground">{item.score}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-2 text-muted-foreground">
                  <p>No recent grades</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Assignments Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Upcoming Assignments</CardTitle>
            <CardDescription>Tasks due in the next 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {upcomingAssignments.length > 0 ? (
                upcomingAssignments.map((item: Assignment, i: number) => (
                  <div key={i} className="flex items-center justify-between border-b pb-2">
                    <div>
                      <div>{item.name}</div>
                      <div className="text-xs text-muted-foreground">{item.class}</div>
                    </div>
                    <Badge variant="outline">{item.due}</Badge>
                  </div>
                ))
              ) : (
                <div className="text-center py-2 text-muted-foreground">
                  <p>No upcoming assignments</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
