"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { BarChart2, TrendingUp, Users, Download, Search, Filter, BookOpen, Calendar } from "lucide-react"
import { getCurrentUser } from "@/lib/supabase/client"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export default function AdminPerformanceAnalyticsPage() {
  const [loading, setLoading] = useState(true)
  const [selectedGradeLevel, setSelectedGradeLevel] = useState<string>("all")
  const [selectedSubject, setSelectedSubject] = useState<string>("all")
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>("term")
  const router = useRouter()

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await getCurrentUser()

        if (!user) {
          router.push("/login")
          return
        }

        // Only admins should access this page
        if (user.role !== "admin") {
          router.push("/dashboard")
          return
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [router])

  // Mock data for demonstration
  const mockData = {
    overview: {
      averageGrade: 82.5,
      attendanceRate: 91.2,
      taskCompletionRate: 87.3,
      atRiskStudents: 42,
    },
    gradeDistribution: [
      { name: "A", count: 120, percentage: 24, color: "#4ade80" },
      { name: "B", count: 180, percentage: 36, color: "#22d3ee" },
      { name: "C", count: 150, percentage: 30, color: "#f59e0b" },
      { name: "D", count: 40, percentage: 8, color: "#f87171" },
      { name: "F", count: 10, percentage: 2, color: "#ef4444" },
    ],
    subjectPerformance: [
      { subject: "Mathematics", average: 79.5 },
      { subject: "Science", average: 81.2 },
      { subject: "English", average: 84.7 },
      { subject: "History", average: 80.3 },
      { subject: "Art", average: 88.1 },
    ],
    gradeLevelPerformance: [
      { gradeLevel: "9th Grade", average: 78.2 },
      { gradeLevel: "10th Grade", average: 81.5 },
      { gradeLevel: "11th Grade", average: 83.7 },
      { gradeLevel: "12th Grade", average: 86.4 },
    ],
    performanceTrends: [
      { period: "Q1", average: 79.2, attendance: 89.5, completion: 82.1 },
      { period: "Q2", average: 81.5, attendance: 90.2, completion: 84.3 },
      { period: "Q3", average: 83.7, attendance: 91.8, completion: 87.5 },
      { period: "Q4", average: 85.6, attendance: 93.3, completion: 90.2 },
    ],
    attendanceVsGrades: [
      { gradeLevel: "9th Grade", attendance: 88.5, grades: 78.2 },
      { gradeLevel: "10th Grade", attendance: 90.2, grades: 81.5 },
      { gradeLevel: "11th Grade", attendance: 92.1, grades: 83.7 },
      { gradeLevel: "12th Grade", attendance: 94.0, grades: 86.4 },
    ],
    studentClusters: [
      { x: 95, y: 92, z: 100, name: "Student 1", cluster: "high-performing" },
      { x: 92, y: 88, z: 100, name: "Student 2", cluster: "high-performing" },
      { x: 90, y: 85, z: 100, name: "Student 3", cluster: "high-performing" },
      { x: 85, y: 82, z: 100, name: "Student 4", cluster: "average" },
      { x: 82, y: 80, z: 100, name: "Student 5", cluster: "average" },
      { x: 78, y: 75, z: 100, name: "Student 6", cluster: "average" },
      { x: 72, y: 68, z: 100, name: "Student 7", cluster: "struggling" },
      { x: 68, y: 65, z: 100, name: "Student 8", cluster: "struggling" },
      { x: 60, y: 55, z: 100, name: "Student 9", cluster: "at-risk" },
      { x: 55, y: 50, z: 100, name: "Student 10", cluster: "at-risk" },
    ],
    atRiskStudents: [
      {
        id: "student-1",
        name: "John Doe",
        grade: "9th",
        average: 58.2,
        attendance: 72.5,
        riskFactors: ["Low attendance", "Poor test scores"],
      },
      {
        id: "student-2",
        name: "Jane Smith",
        grade: "10th",
        average: 62.1,
        attendance: 68.3,
        riskFactors: ["Missing assignments", "Poor test scores"],
      },
      {
        id: "student-3",
        name: "Bob Johnson",
        grade: "11th",
        average: 59.7,
        attendance: 75.2,
        riskFactors: ["Low attendance", "Missing assignments"],
      },
      {
        id: "student-4",
        name: "Alice Brown",
        grade: "9th",
        average: 61.5,
        attendance: 70.8,
        riskFactors: ["Poor test scores", "Low participation"],
      },
      {
        id: "student-5",
        name: "Charlie Wilson",
        grade: "12th",
        average: 63.2,
        attendance: 71.4,
        riskFactors: ["Missing assignments", "Low participation"],
      },
    ],
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading analytics...</p>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold">School Performance Analytics</h1>
        <div className="flex flex-wrap gap-2">
          <Select value={selectedGradeLevel} onValueChange={setSelectedGradeLevel}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Grade Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Grades</SelectItem>
              <SelectItem value="9">9th Grade</SelectItem>
              <SelectItem value="10">10th Grade</SelectItem>
              <SelectItem value="11">11th Grade</SelectItem>
              <SelectItem value="12">12th Grade</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedSubject} onValueChange={setSelectedSubject}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Subject" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subjects</SelectItem>
              <SelectItem value="math">Mathematics</SelectItem>
              <SelectItem value="science">Science</SelectItem>
              <SelectItem value="english">English</SelectItem>
              <SelectItem value="history">History</SelectItem>
              <SelectItem value="art">Art</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="term">Current Term</SelectItem>
              <SelectItem value="year">Academic Year</SelectItem>
              <SelectItem value="quarter">Current Quarter</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Average Grade</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{mockData.overview.averageGrade}%</div>
            <div className="text-sm text-muted-foreground">School-wide average</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Attendance Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{mockData.overview.attendanceRate}%</div>
            <div className="text-sm text-muted-foreground">School-wide attendance</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Task Completion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{mockData.overview.taskCompletionRate}%</div>
            <div className="text-sm text-muted-foreground">Assignment completion rate</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">At-Risk Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{mockData.overview.atRiskStudents}</div>
            <div className="text-sm text-muted-foreground">Students needing intervention</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="grades">Grades</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="at-risk">At-Risk Students</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart2 className="h-5 w-5 mr-2 text-indigo-500" />
                  Grade Distribution
                </CardTitle>
                <CardDescription>Distribution of grades across all students</CardDescription>
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
                          data={mockData.gradeDistribution}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percentage }) => `${name}: ${percentage}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="count"
                        >
                          {mockData.gradeDistribution.map((entry, index) => (
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
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-indigo-500" />
                  Performance Trends
                </CardTitle>
                <CardDescription>Academic performance trends over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ChartContainer
                    config={{
                      average: {
                        label: "Grade Average",
                        color: "hsl(var(--chart-1))",
                      },
                      attendance: {
                        label: "Attendance Rate",
                        color: "hsl(var(--chart-2))",
                      },
                      completion: {
                        label: "Task Completion",
                        color: "hsl(var(--chart-3))",
                      },
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={mockData.performanceTrends}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="period" />
                        <YAxis domain={[70, 100]} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="average"
                          stroke="var(--color-average)"
                          strokeWidth={2}
                          dot={{ r: 4 }}
                          activeDot={{ r: 8 }}
                        />
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
                          dataKey="completion"
                          stroke="var(--color-completion)"
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-2 text-indigo-500" />
                  Subject Performance
                </CardTitle>
                <CardDescription>Average grades by subject</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ChartContainer
                    config={{
                      average: {
                        label: "Average Grade",
                        color: "hsl(var(--chart-1))",
                      },
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={mockData.subjectPerformance} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="subject" />
                        <YAxis domain={[70, 100]} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Bar dataKey="average" fill="var(--color-average)" name="Average Grade" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2 text-indigo-500" />
                  Grade Level Performance
                </CardTitle>
                <CardDescription>Average grades by grade level</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ChartContainer
                    config={{
                      average: {
                        label: "Average Grade",
                        color: "hsl(var(--chart-1))",
                      },
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={mockData.gradeLevelPerformance}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="gradeLevel" />
                        <YAxis domain={[70, 100]} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Bar dataKey="average" fill="var(--color-average)" name="Average Grade" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Grades Tab */}
        <TabsContent value="grades" className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search students..." className="pl-8 w-[250px]" />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Student Performance Clusters</CardTitle>
                <CardDescription>Clustering of students based on performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ChartContainer
                    config={{
                      highPerforming: {
                        label: "High Performing",
                        color: "#10b981",
                      },
                      average: {
                        label: "Average",
                        color: "#3b82f6",
                      },
                      struggling: {
                        label: "Struggling",
                        color: "#f59e0b",
                      },
                      atRisk: {
                        label: "At Risk",
                        color: "#ef4444",
                      },
                    }}
                    className="h-[400px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                        <CartesianGrid />
                        <XAxis
                          type="number"
                          dataKey="x"
                          name="Grade Average"
                          domain={[40, 100]}
                          label={{ value: "Grade Average (%)", position: "bottom", offset: 0 }}
                        />
                        <YAxis
                          type="number"
                          dataKey="y"
                          name="Task Completion"
                          domain={[40, 100]}
                          label={{ value: "Task Completion (%)", angle: -90, position: "left" }}
                        />
                        <ZAxis range={[60, 60]} />
                        <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                        <Legend />
                        <Scatter name="Students" data={mockData.studentClusters} fill="#8884d8">
                          {mockData.studentClusters.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={
                                entry.cluster === "high-performing"
                                  ? "#10b981"
                                  : entry.cluster === "average"
                                    ? "#3b82f6"
                                    : entry.cluster === "struggling"
                                      ? "#f59e0b"
                                      : "#ef4444"
                              }
                            />
                          ))}
                        </Scatter>
                      </ScatterChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Attendance vs. Grades</CardTitle>
                <CardDescription>Correlation between attendance and academic performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
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
                    className="h-[400px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={mockData.attendanceVsGrades}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="gradeLevel" />
                        <YAxis domain={[70, 100]} />
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
          </div>
        </TabsContent>

        {/* Attendance Tab */}
        <TabsContent value="attendance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-indigo-500" />
                  Attendance by Grade Level
                </CardTitle>
                <CardDescription>Attendance rates across different grade levels</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ChartContainer
                    config={{
                      attendance: {
                        label: "Attendance Rate",
                        color: "hsl(var(--chart-1))",
                      },
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={mockData.gradeLevelPerformance}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="gradeLevel" />
                        <YAxis domain={[70, 100]} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Bar dataKey="attendance" fill="var(--color-attendance)" name="Attendance Rate" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-indigo-500" />
                  Attendance Trends
                </CardTitle>
                <CardDescription>Attendance trends over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ChartContainer
                    config={{
                      attendance: {
                        label: "Attendance Rate",
                        color: "hsl(var(--chart-1))",
                      },
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={mockData.performanceTrends}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="period" />
                        <YAxis domain={[70, 100]} />
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
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Attendance Correlation Analysis</CardTitle>
              <CardDescription>Insights on how attendance impacts academic performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="text-lg font-medium mb-2">Key Findings</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Students with attendance rates above 90% have an average grade of 85.2%</li>
                    <li>Students with attendance rates below 80% have an average grade of 68.7%</li>
                    <li>
                      Each 5% decrease in attendance correlates with approximately 4.2% decrease in average grades
                    </li>
                    <li>12th grade students show the strongest correlation between attendance and grades</li>
                  </ul>
                </div>

                <div className="p-4 border rounded-lg">
                  <h3 className="text-lg font-medium mb-2">Recommendations</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Implement attendance incentive programs for 9th and 10th grade students</li>
                    <li>Establish early intervention for students whose attendance drops below 85%</li>
                    <li>Create parent notification system for consecutive absences</li>
                    <li>Develop personalized attendance improvement plans for at-risk students</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* At-Risk Students Tab */}
        <TabsContent value="at-risk" className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search students..." className="pl-8 w-[250px]" />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export List
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>At-Risk Students</CardTitle>
              <CardDescription>Students requiring intervention based on performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Grade Level</TableHead>
                    <TableHead>Average</TableHead>
                    <TableHead>Attendance</TableHead>
                    <TableHead>Risk Factors</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockData.atRiskStudents.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">{student.name}</TableCell>
                      <TableCell>{student.grade}</TableCell>
                      <TableCell>
                        <Badge variant="destructive">{student.average}%</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="destructive">{student.attendance}%</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {student.riskFactors.map((factor, i) => (
                            <Badge key={i} variant="outline" className="bg-red-50">
                              {factor}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Intervention Strategies</CardTitle>
                <CardDescription>Recommended approaches for at-risk students</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="text-lg font-medium mb-2">Academic Interventions</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Personalized tutoring programs</li>
                      <li>Study skills workshops</li>
                      <li>Extended time accommodations</li>
                      <li>Alternative assessment methods</li>
                    </ul>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h3 className="text-lg font-medium mb-2">Attendance Interventions</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Daily check-in system</li>
                      <li>Attendance contracts</li>
                      <li>Parent-teacher conferences</li>
                      <li>Transportation assistance</li>
                    </ul>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h3 className="text-lg font-medium mb-2">Behavioral Interventions</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Counseling services</li>
                      <li>Mentorship programs</li>
                      <li>Positive reinforcement systems</li>
                      <li>Social skills development</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Success Metrics</CardTitle>
                <CardDescription>Tracking intervention effectiveness</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="text-lg font-medium mb-2">Short-Term Indicators</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Weekly assignment completion rates</li>
                      <li>Daily attendance tracking</li>
                      <li>Quiz and test score improvements</li>
                      <li>Behavioral incident reduction</li>
                    </ul>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h3 className="text-lg font-medium mb-2">Long-Term Outcomes</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Grade point average improvement</li>
                      <li>Course completion rates</li>
                      <li>Graduation rate increases</li>
                      <li>Post-secondary enrollment</li>
                    </ul>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h3 className="text-lg font-medium mb-2">Program Evaluation</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Quarterly intervention effectiveness reviews</li>
                      <li>Student feedback surveys</li>
                      <li>Parent satisfaction assessments</li>
                      <li>Cost-benefit analysis of interventions</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
