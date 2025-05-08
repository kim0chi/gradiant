"use client"

import { useState, useEffect } from "react"
import { AuthenticatedLayout } from "@/components/authenticated-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { BookOpen, CalendarIcon, CheckCircle, Clock, AlertCircle, TrendingUp } from "lucide-react"
import { getCurrentUser } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { getStudentPerformanceData } from "@/lib/student-performance-service"

export default function StudentPerformancePage() {
  const [loading, setLoading] = useState(true)
  const [userData, setUserData] = useState<any>(null)
  const [performanceData, setPerformanceData] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await getCurrentUser()
        if (!user) {
          router.push("/login")
          return
        }

        setUserData(user)

        // Fetch student performance data
        const data = await getStudentPerformanceData(user.id)
        setPerformanceData(data)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router])

  if (loading) {
    return (
      <AuthenticatedLayout>
        <div className="space-y-6">
          <Skeleton className="h-12 w-[250px]" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-[180px] w-full" />
            <Skeleton className="h-[180px] w-full" />
            <Skeleton className="h-[180px] w-full" />
          </div>
          <Skeleton className="h-[400px] w-full" />
        </div>
      </AuthenticatedLayout>
    )
  }

  // Mock data for demonstration
  const mockPerformanceData = {
    student: {
      name: userData?.name || "Student",
      id: userData?.id || "student-id",
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

  const data = performanceData || mockPerformanceData

  return (
    <AuthenticatedLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-3xl font-bold">My Academic Performance</h1>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-lg py-1 px-3">
              GPA: {data.student.gpa}
            </Badge>
            <Badge variant="outline" className="text-lg py-1 px-3">
              Overall: {data.grades.overall}%
            </Badge>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg">
                <BookOpen className="h-5 w-5 mr-2 text-indigo-500" />
                Grades
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{data.grades.overall}%</div>
              <div className="mt-4 space-y-2">
                {data.grades.bySubject.slice(0, 3).map((subject, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-sm">{subject.subject}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{subject.grade}%</span>
                      <Badge variant="outline">{subject.letterGrade}</Badge>
                    </div>
                  </div>
                ))}
                {data.grades.bySubject.length > 3 && (
                  <Button variant="link" className="p-0 h-auto" onClick={() => {}}>
                    View all subjects
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg">
                <Clock className="h-5 w-5 mr-2 text-indigo-500" />
                Tasks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-3xl font-bold">{data.tasks.completed}</div>
                  <div className="text-sm text-muted-foreground">Completed</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">{data.tasks.upcoming}</div>
                  <div className="text-sm text-muted-foreground">Upcoming</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">{data.tasks.overdue}</div>
                  <div className="text-sm text-muted-foreground">Overdue</div>
                </div>
              </div>
              <Progress value={(data.tasks.completed / data.tasks.total) * 100} className="h-2 mb-2" />
              <div className="text-sm text-muted-foreground text-right">
                {data.tasks.completed} of {data.tasks.total} tasks completed
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg">
                <CalendarIcon className="h-5 w-5 mr-2 text-indigo-500" />
                Attendance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{data.attendance.rate}%</div>
              <div className="grid grid-cols-2 gap-2 mt-4">
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">Present</span>
                  <span className="font-medium">{data.attendance.present} days</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">Absent</span>
                  <span className="font-medium">{data.attendance.absent} days</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">Tardy</span>
                  <span className="font-medium">{data.attendance.tardy} days</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">Excused</span>
                  <span className="font-medium">{data.attendance.excused} days</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="grades" className="space-y-4">
          <TabsList>
            <TabsTrigger value="grades">Grades</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Grades Tab */}
          <TabsContent value="grades" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Grade Progression</CardTitle>
                  <CardDescription>Your grade progression over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ChartContainer
                      config={{
                        grade: {
                          label: "Grade",
                          color: "hsl(var(--chart-1))",
                        },
                      }}
                      className="h-[300px]"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data.grades.byPeriod}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="period" />
                          <YAxis domain={[60, 100]} />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="grade"
                            stroke="var(--color-grade)"
                            strokeWidth={2}
                            dot={{ r: 4 }}
                            activeDot={{ r: 8 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Grade Distribution</CardTitle>
                  <CardDescription>Distribution of your grades by letter</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ChartContainer
                      config={{
                        grade: {
                          label: "Grade Distribution",
                          color: "hsl(var(--chart-1))",
                        },
                      }}
                      className="h-[300px]"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={data.grades.distribution}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {data.grades.distribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Subject Grades</CardTitle>
                <CardDescription>Your performance across all subjects</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ChartContainer
                    config={{
                      grade: {
                        label: "Grade",
                        color: "hsl(var(--chart-1))",
                      },
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={data.grades.bySubject} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="subject" />
                        <YAxis domain={[0, 100]} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Bar dataKey="grade" fill="var(--color-grade)" name="Grade" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tasks Tab */}
          <TabsContent value="tasks" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Task Status</CardTitle>
                  <CardDescription>Overview of your task completion status</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ChartContainer
                      config={{
                        tasks: {
                          label: "Tasks",
                          color: "hsl(var(--chart-1))",
                        },
                      }}
                      className="h-[300px]"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={data.tasks.byStatus}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {data.tasks.byStatus.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Tasks</CardTitle>
                  <CardDescription>Your most recent assignments</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {data.tasks.recent.map((task, i) => (
                      <div key={i} className="flex items-center justify-between border-b pb-3">
                        <div>
                          <div className="font-medium">{task.title}</div>
                          <div className="text-sm text-muted-foreground">
                            {task.subject} • Due: {format(new Date(task.dueDate), "MMM d, yyyy")}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {task.score !== null && <span className="font-medium">{task.score}%</span>}
                          <Badge
                            variant={
                              task.status === "completed"
                                ? "default"
                                : task.status === "upcoming"
                                  ? "outline"
                                  : "destructive"
                            }
                          >
                            {task.status === "completed" ? (
                              <CheckCircle className="h-3 w-3 mr-1" />
                            ) : task.status === "upcoming" ? (
                              <Clock className="h-3 w-3 mr-1" />
                            ) : (
                              <AlertCircle className="h-3 w-3 mr-1" />
                            )}
                            <span className="capitalize">{task.status}</span>
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Attendance Tab */}
          <TabsContent value="attendance" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Attendance Trends</CardTitle>
                  <CardDescription>Your attendance patterns over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ChartContainer
                      config={{
                        present: {
                          label: "Present",
                          color: "hsl(var(--chart-1))",
                        },
                        absent: {
                          label: "Absent",
                          color: "hsl(var(--chart-2))",
                        },
                        tardy: {
                          label: "Tardy",
                          color: "hsl(var(--chart-3))",
                        },
                        excused: {
                          label: "Excused",
                          color: "hsl(var(--chart-4))",
                        },
                      }}
                      className="h-[300px]"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data.attendance.byMonth}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Legend />
                          <Bar dataKey="present" fill="var(--color-present)" stackId="a" />
                          <Bar dataKey="absent" fill="var(--color-absent)" stackId="a" />
                          <Bar dataKey="tardy" fill="var(--color-tardy)" stackId="a" />
                          <Bar dataKey="excused" fill="var(--color-excused)" stackId="a" />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Attendance</CardTitle>
                  <CardDescription>Your attendance for the past 10 school days</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {data.attendance.recentDays.map((day, i) => (
                      <div key={i} className="flex items-center justify-between border-b pb-2">
                        <div className="font-medium">{format(new Date(day.date), "EEEE, MMMM d")}</div>
                        <Badge
                          variant={
                            day.status === "present" ? "default" : day.status === "excused" ? "outline" : "destructive"
                          }
                        >
                          <span className="capitalize">{day.status}</span>
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Attendance Calendar</CardTitle>
                <CardDescription>View your attendance record for the current term</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center">
                  <Calendar mode="single" selected={new Date()} className="rounded-md border" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Attendance vs. Grades</CardTitle>
                  <CardDescription>Correlation between attendance and academic performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ChartContainer
                      config={{
                        attendance: {
                          label: "Attendance Rate",
                          color: "hsl(var(--chart-1))",
                        },
                        grades: {
                          label: "Grade Average",
                          color: "hsl(var(--chart-2))",
                        },
                      }}
                      className="h-[300px]"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data.analytics.correlations.attendanceVsGrades}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis domain={[60, 100]} />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="attendance"
                            stroke="var(--color-attendance)"
                            strokeWidth={2}
                            dot={{ r: 4 }}
                            activeDot={{ r: 8 }}
                          />
                          <Line
                            type="monotone"
                            dataKey="grades"
                            stroke="var(--color-grades)"
                            strokeWidth={2}
                            dot={{ r: 4 }}
                            activeDot={{ r: 8 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Task Completion vs. Grades</CardTitle>
                  <CardDescription>Correlation between task completion and academic performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ChartContainer
                      config={{
                        completion: {
                          label: "Task Completion Rate",
                          color: "hsl(var(--chart-1))",
                        },
                        grades: {
                          label: "Grade Average",
                          color: "hsl(var(--chart-2))",
                        },
                      }}
                      className="h-[300px]"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data.analytics.correlations.taskCompletionVsGrades}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="period" />
                          <YAxis domain={[60, 100]} />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="completion"
                            stroke="var(--color-completion)"
                            strokeWidth={2}
                            dot={{ r: 4 }}
                            activeDot={{ r: 8 }}
                          />
                          <Line
                            type="monotone"
                            dataKey="grades"
                            stroke="var(--color-grades)"
                            strokeWidth={2}
                            dot={{ r: 4 }}
                            activeDot={{ r: 8 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-indigo-500" />
                  Performance Insights
                </CardTitle>
                <CardDescription>Personalized insights and recommendations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium">Projected Final Grade</h3>
                    <div className="flex items-center mt-2">
                      <div className="text-3xl font-bold">{data.analytics.predictions.projectedGrade}%</div>
                      <Badge className="ml-2 bg-green-500">
                        {data.analytics.predictions.projectedGrade >= 90
                          ? "A"
                          : data.analytics.predictions.projectedGrade >= 80
                            ? "B"
                            : data.analytics.predictions.projectedGrade >= 70
                              ? "C"
                              : data.analytics.predictions.projectedGrade >= 60
                                ? "D"
                                : "F"}
                      </Badge>
                    </div>
                  </div>

                  {data.analytics.predictions.riskFactors.length > 0 && (
                    <div>
                      <h3 className="text-lg font-medium">Risk Factors</h3>
                      <ul className="list-disc pl-5 mt-2">
                        {data.analytics.predictions.riskFactors.map((factor, i) => (
                          <li key={i}>{factor}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div>
                    <h3 className="text-lg font-medium">Recommendations</h3>
                    <ul className="list-disc pl-5 mt-2">
                      {data.analytics.predictions.recommendations.map((recommendation, i) => (
                        <li key={i}>{recommendation}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AuthenticatedLayout>
  )
}
