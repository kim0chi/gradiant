"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { BarChart2, PieChart, TrendingUp, Users } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getCurrentUser } from "@/lib/supabase/client"
import DashboardLayout from "@/components/dashboard-layout"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  ZAxis,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// Mock data for charts
const gradeDistributionData = [
  { name: "A", count: 15, color: "#4ade80" },
  { name: "B", count: 20, color: "#22d3ee" },
  { name: "C", count: 12, color: "#f59e0b" },
  { name: "D", count: 8, color: "#f87171" },
  { name: "F", count: 5, color: "#ef4444" },
]

const attendanceData = [
  { name: "Jan", present: 92, absent: 8 },
  { name: "Feb", present: 89, absent: 11 },
  { name: "Mar", present: 90, absent: 10 },
  { name: "Apr", present: 87, absent: 13 },
  { name: "May", present: 91, absent: 9 },
]

const gradeProgressData = [
  { name: "Q1", average: 78 },
  { name: "Q2", average: 82 },
  { name: "Q3", average: 85 },
  { name: "Q4", average: 88 },
]

// Mock clustering data
const studentClusterData = [
  { x: 35, y: 78, z: 100, name: "Student 1", cluster: 0 },
  { x: 42, y: 85, z: 100, name: "Student 2", cluster: 0 },
  { x: 38, y: 82, z: 100, name: "Student 3", cluster: 0 },
  { x: 40, y: 81, z: 100, name: "Student 4", cluster: 0 },
  { x: 75, y: 82, z: 100, name: "Student 5", cluster: 1 },
  { x: 80, y: 85, z: 100, name: "Student 6", cluster: 1 },
  { x: 78, y: 88, z: 100, name: "Student 7", cluster: 1 },
  { x: 81, y: 84, z: 100, name: "Student 8", cluster: 1 },
  { x: 75, y: 45, z: 100, name: "Student 9", cluster: 2 },
  { x: 80, y: 48, z: 100, name: "Student 10", cluster: 2 },
  { x: 77, y: 50, z: 100, name: "Student 11", cluster: 2 },
  { x: 36, y: 48, z: 100, name: "Student 12", cluster: 3 },
  { x: 40, y: 42, z: 100, name: "Student 13", cluster: 3 },
  { x: 38, y: 45, z: 100, name: "Student 14", cluster: 3 },
]

const clusterColors = ["#4ade80", "#22d3ee", "#f59e0b", "#ef4444"]

// Define mock classes
const mockClasses = [
  { id: "class-1", name: "Mathematics 101" },
  { id: "class-2", name: "Science Lab" },
  { id: "class-3", name: "English Literature" },
]

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true)
  const [selectedClass, setSelectedClass] = useState<string>("")
  const router = useRouter()

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await getCurrentUser()

        if (!user) {
          router.push("/login")
          return
        }

        // Only teachers and admins should access this page
        if (user.role === "student") {
          router.push("/student")
          return
        }

        // Select first class by default if available
        if (mockClasses.length > 0) {
          setSelectedClass(mockClasses[0].id)
        }
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
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <p>Loading analytics...</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Analytics Dashboard</h1>

          <div className="flex items-center">
            <span className="mr-2 text-sm font-medium">Class:</span>
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a class" />
              </SelectTrigger>
              <SelectContent>
                {mockClasses.map((klass) => (
                  <SelectItem key={klass.id} value={klass.id}>
                    {klass.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="clustering">Student Clustering</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Grade Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <PieChart className="h-5 w-5 mr-2 text-indigo-500" />
                    Grade Distribution
                  </CardTitle>
                  <CardDescription>Distribution of grades across all students</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
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
                      <RechartsPieChart>
                        <Pie
                          data={gradeDistributionData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="count"
                        >
                          {gradeDistributionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Grade Progress */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <TrendingUp className="h-5 w-5 mr-2 text-indigo-500" />
                    Grade Progress
                  </CardTitle>
                  <CardDescription>Average class grade progression over quarters</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <ChartContainer
                    config={{
                      average: {
                        label: "Class Average",
                        color: "hsl(var(--chart-1))",
                      },
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={gradeProgressData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis domain={[0, 100]} />
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
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="attendance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <BarChart2 className="h-5 w-5 mr-2 text-indigo-500" />
                  Attendance Trends
                </CardTitle>
                <CardDescription>Monthly attendance rates for the current academic year</CardDescription>
              </CardHeader>
              <CardContent>
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
                  }}
                  className="h-[400px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={attendanceData} barGap={0} barCategoryGap={15}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Bar dataKey="present" fill="var(--color-present)" />
                      <Bar dataKey="absent" fill="var(--color-absent)" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="clustering" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Users className="h-5 w-5 mr-2 text-indigo-500" />
                  Student Clustering
                </CardTitle>
                <CardDescription>
                  K-means clustering of students based on attendance (x-axis) and grades (y-axis)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    cluster0: {
                      label: "High Attendance & High Grades",
                      color: clusterColors[0],
                    },
                    cluster1: {
                      label: "Low Attendance & High Grades",
                      color: clusterColors[1],
                    },
                    cluster2: {
                      label: "Low Attendance & Low Grades",
                      color: clusterColors[2],
                    },
                    cluster3: {
                      label: "High Attendance & Low Grades",
                      color: clusterColors[3],
                    },
                  }}
                  className="h-[400px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart>
                      <CartesianGrid />
                      <XAxis
                        type="number"
                        dataKey="x"
                        name="Attendance %"
                        domain={[30, 90]}
                        label={{ value: "Attendance %", position: "bottom" }}
                      />
                      <YAxis
                        type="number"
                        dataKey="y"
                        name="Grade Average"
                        domain={[30, 100]}
                        label={{ value: "Grade Average", angle: -90, position: "left" }}
                      />
                      <ZAxis type="number" range={[60, 60]} />
                      <ChartTooltip
                        cursor={{ strokeDasharray: "3 3" }}
                        formatter={(value, name) => [value, name === "x" ? "Attendance %" : "Grade Average"]}
                        labelFormatter={(index) => studentClusterData[index].name}
                      />
                      <Legend />
                      {[0, 1, 2, 3].map((cluster) => (
                        <Scatter
                          key={`cluster-${cluster}`}
                          name={`Cluster ${cluster + 1}`}
                          data={studentClusterData.filter((d) => d.cluster === cluster)}
                          fill={clusterColors[cluster]}
                        />
                      ))}
                    </ScatterChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Cluster Insights</CardTitle>
                <CardDescription>Analysis and recommendations based on student clusters</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-semibold flex items-center">
                    <div className="w-3 h-3 rounded-full bg-[#4ade80] mr-2"></div>
                    Cluster 1: High Attendance & High Grades
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    These students are performing well academically and attending consistently. Consider providing them
                    with enrichment opportunities to maintain engagement.
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold flex items-center">
                    <div className="w-3 h-3 rounded-full bg-[#22d3ee] mr-2"></div>
                    Cluster 2: Low Attendance & High Grades
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    These students are academically strong but have attendance issues. Investigation into reasons for
                    absences may help improve attendance.
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold flex items-center">
                    <div className="w-3 h-3 rounded-full bg-[#f59e0b] mr-2"></div>
                    Cluster 3: Low Attendance & Low Grades
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    These students need the most attention. Consider parent-teacher conferences and individualized
                    support plans to address both attendance and academic performance.
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold flex items-center">
                    <div className="w-3 h-3 rounded-full bg-[#ef4444] mr-2"></div>
                    Cluster 4: High Attendance & Low Grades
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    These students are showing commitment by attending but struggling academically. They may benefit
                    from tutoring or adjustments to teaching methods.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
