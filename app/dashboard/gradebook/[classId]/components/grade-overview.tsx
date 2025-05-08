"use client"

import { useState, useEffect } from "react"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"
import type { Period, AnalyticsResponse } from "@/types/gradebook-schemas"

type GradeOverviewProps = {
  classId: string
}

// Mock data for period averages
const mockPeriodAverages = [
  { periodId: "1", periodName: "Prelims", average: 85.4, letterGrade: "B" },
  { periodId: "2", periodName: "Midterms", average: 82.7, letterGrade: "B-" },
  { periodId: "3", periodName: "Semi-Finals", average: 88.2, letterGrade: "B+" },
  { periodId: "4", periodName: "Finals", average: 90.5, letterGrade: "A-" },
]

// Mock data for final average
const mockFinalAverage = {
  score: 86.7,
  letterGrade: "B",
}

// Mock data for student performance
const mockStudentPerformance = [
  {
    studentId: "STU001",
    studentName: "Alice Johnson",
    periodAverages: [
      { periodId: "1", average: 92.5 },
      { periodId: "2", average: 90.1 },
      { periodId: "3", average: 94.3 },
      { periodId: "4", average: 95.0 },
    ],
    finalAverage: 93.0,
  },
  {
    studentId: "STU002",
    studentName: "Bob Smith",
    periodAverages: [
      { periodId: "1", average: 85.4 },
      { periodId: "2", average: 82.7 },
      { periodId: "3", average: 86.2 },
      { periodId: "4", average: 88.5 },
    ],
    finalAverage: 85.7,
  },
  {
    studentId: "STU003",
    studentName: "Charlie Brown",
    periodAverages: [
      { periodId: "1", average: 80.9 },
      { periodId: "2", average: 78.2 },
      { periodId: "3", average: 83.5 },
      { periodId: "4", average: 85.0 },
    ],
    finalAverage: 81.9,
  },
  {
    studentId: "STU004",
    studentName: "Diana Prince",
    periodAverages: [
      { periodId: "1", average: 94.8 },
      { periodId: "2", average: 92.6 },
      { periodId: "3", average: 95.7 },
      { periodId: "4", average: 97.2 },
    ],
    finalAverage: 95.1,
  },
  {
    studentId: "STU005",
    studentName: "Edward Cullen",
    periodAverages: [
      { periodId: "1", average: 73.5 },
      { periodId: "2", average: 69.8 },
      { periodId: "3", average: 81.4 },
      { periodId: "4", average: 86.7 },
    ],
    finalAverage: 77.8,
  },
]

export function GradeOverview({ classId }: GradeOverviewProps) {
  const [periods, setPeriods] = useState<Period[]>([])
  const [analyticsData, setAnalyticsData] = useState<AnalyticsResponse>({
    periodAverages: mockPeriodAverages,
    finalAverage: mockFinalAverage,
    studentPerformance: mockStudentPerformance,
  })
  const [loading, setLoading] = useState(true)
  const [selectedStudent, setSelectedStudent] = useState<string>("all")

  const { toast } = useToast()

  // Format chart data for period averages
  const chartData = analyticsData.periodAverages.map((period) => ({
    name: period.periodName,
    average: period.average,
  }))

  // Format chart data for student performance
  const studentChartData = analyticsData.periodAverages.map((period) => {
    const data: Record<string, any> = { name: period.periodName }

    analyticsData.studentPerformance.forEach((student) => {
      const periodAvg = student.periodAverages.find((p) => p.periodId === period.periodId)
      if (periodAvg) {
        data[student.studentName] = periodAvg.average
      }
    })

    return data
  })

  // Fetch periods and analytics data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Fetch periods
        const periodsResponse = await fetch(`/api/classes/${classId}/periods`)
        if (!periodsResponse.ok) throw new Error("Failed to fetch periods")
        const periodsData = await periodsResponse.json()
        setPeriods(periodsData.periods || [])

        // Fetch analytics
        // In a real app, we would fetch this data from the API
        // const analyticsResponse = await fetch(`/api/classes/${classId}/analytics`)
        // if (!analyticsResponse.ok) throw new Error("Failed to fetch analytics")
        // const analyticsData = await analyticsResponse.json()
        // setAnalyticsData(analyticsData)

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))
        // Using mock data for now
      } catch (error) {
        console.error("Error fetching data:", error)
        toast({
          title: "Error",
          description: "Failed to load analytics data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [classId, toast])

  // Get letter grade color
  const getGradeColor = (grade: string) => {
    if (grade.startsWith("A")) return "text-green-600 dark:text-green-400"
    if (grade.startsWith("B")) return "text-blue-600 dark:text-blue-400"
    if (grade.startsWith("C")) return "text-yellow-600 dark:text-yellow-400"
    if (grade.startsWith("D")) return "text-orange-600 dark:text-orange-400"
    return "text-red-600 dark:text-red-400" // F
  }

  // Get color for recharts
  const getChartColor = (index: number) => {
    const colors = ["#3b82f6", "#8b5cf6", "#ec4899", "#f97316", "#14b8a6"]
    return colors[index % colors.length]
  }

  // Filter student data if a specific student is selected
  const filteredStudentPerformance =
    selectedStudent === "all"
      ? analyticsData.studentPerformance
      : analyticsData.studentPerformance.filter((student) => student.studentId === selectedStudent)

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold">Grade Overview</h2>
        <div className="flex flex-wrap gap-2">
          <div className="w-[220px]">
            <Select value={selectedStudent} onValueChange={setSelectedStudent}>
              <SelectTrigger>
                <SelectValue placeholder="Select Student" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Students</SelectItem>
                {analyticsData.studentPerformance.map((student) => (
                  <SelectItem key={student.studentId} value={student.studentId}>
                    {student.studentName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline">Export Analytics</Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <Tabs defaultValue="overview" className="mb-6">
          <TabsList>
            <TabsTrigger value="overview">Class Overview</TabsTrigger>
            <TabsTrigger value="students">Student Performance</TabsTrigger>
            <TabsTrigger value="periods">Period Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {analyticsData.periodAverages.map((period) => (
                <Card key={period.periodId}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{period.periodName}</CardTitle>
                    <CardDescription>Class Average</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{period.average.toFixed(1)}%</div>
                    <div className={`font-semibold ${getGradeColor(period.letterGrade)}`}>{period.letterGrade}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Final Class Average</CardTitle>
                <CardDescription>Weighted average across all periods</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center">
                  <div className="text-5xl font-bold mb-2">{analyticsData.finalAverage.score.toFixed(1)}%</div>
                  <Badge
                    variant={
                      analyticsData.finalAverage.letterGrade.startsWith("A")
                        ? "success"
                        : analyticsData.finalAverage.letterGrade.startsWith("B")
                          ? "default"
                          : analyticsData.finalAverage.letterGrade.startsWith("C")
                            ? "warning"
                            : analyticsData.finalAverage.letterGrade.startsWith("D")
                              ? "secondary"
                              : "destructive"
                    }
                    className="text-xl py-1 px-4"
                  >
                    {analyticsData.finalAverage.letterGrade}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Period-by-Period Performance</CardTitle>
                <CardDescription>Class average trends across grading periods</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="average"
                        stroke="#3b82f6"
                        activeDot={{ r: 8 }}
                        strokeWidth={2}
                        name="Class Average"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="students" className="space-y-6 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Student Performance</CardTitle>
                <CardDescription>
                  {selectedStudent === "all"
                    ? "Comparing all students across periods"
                    : `Performance for ${analyticsData.studentPerformance.find((s) => s.studentId === selectedStudent)?.studentName}`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={studentChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Legend />
                      {selectedStudent === "all" ? (
                        analyticsData.studentPerformance.map((student, index) => (
                          <Line
                            key={student.studentId}
                            type="monotone"
                            dataKey={student.studentName}
                            stroke={getChartColor(index)}
                            strokeWidth={2}
                          />
                        ))
                      ) : (
                        <Line
                          type="monotone"
                          dataKey={
                            analyticsData.studentPerformance.find((s) => s.studentId === selectedStudent)?.studentName
                          }
                          stroke="#3b82f6"
                          strokeWidth={2}
                        />
                      )}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Student Grades</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student Name</TableHead>
                      {analyticsData.periodAverages.map((period) => (
                        <TableHead key={period.periodId} className="text-center">
                          {period.periodName}
                        </TableHead>
                      ))}
                      <TableHead className="text-center">Final Average</TableHead>
                      <TableHead className="text-center">Grade</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudentPerformance.map((student) => (
                      <TableRow key={student.studentId}>
                        <TableCell className="font-medium">{student.studentName}</TableCell>
                        {student.periodAverages.map((periodAvg) => (
                          <TableCell key={periodAvg.periodId} className="text-center">
                            {periodAvg.average.toFixed(1)}%
                          </TableCell>
                        ))}
                        <TableCell className="text-center font-semibold">{student.finalAverage.toFixed(1)}%</TableCell>
                        <TableCell className="text-center">
                          <Badge
                            variant={
                              student.finalAverage >= 90
                                ? "success"
                                : student.finalAverage >= 80
                                  ? "default"
                                  : student.finalAverage >= 70
                                    ? "warning"
                                    : student.finalAverage >= 60
                                      ? "secondary"
                                      : "destructive"
                            }
                          >
                            {student.finalAverage >= 90
                              ? "A"
                              : student.finalAverage >= 80
                                ? "B"
                                : student.finalAverage >= 70
                                  ? "C"
                                  : student.finalAverage >= 60
                                    ? "D"
                                    : "F"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="periods" className="space-y-6 pt-4">
            {analyticsData.periodAverages.map((period) => (
              <Card key={period.periodId}>
                <CardHeader>
                  <CardTitle>{period.periodName} Analysis</CardTitle>
                  <CardDescription>Distribution of grades in {period.periodName}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { grade: "A", count: Math.floor(Math.random() * 10) + 5 },
                          { grade: "B", count: Math.floor(Math.random() * 15) + 10 },
                          { grade: "C", count: Math.floor(Math.random() * 10) + 5 },
                          { grade: "D", count: Math.floor(Math.random() * 5) + 2 },
                          { grade: "F", count: Math.floor(Math.random() * 3) },
                        ]}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="grade" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="count" fill="#8884d8" name="Number of Students" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
