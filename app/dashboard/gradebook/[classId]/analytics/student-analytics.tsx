"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  ZAxis,
} from "recharts"
import {
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  Download,
  Users,
  UserX,
  BookOpen,
  Award,
  ArrowUpRight,
} from "lucide-react"

// Types for our analytics
type StudentGrade = {
  studentId: string
  studentName: string
  periodGrades: Record<string, number>
  categoryGrades: Record<string, number>
  finalAverage: number
  trend: "improving" | "declining" | "stable"
  riskLevel: "high" | "medium" | "low" | "none"
  riskFactors: string[]
  cluster: "high-performing" | "average" | "struggling" | "at-risk"
  strengths: string[]
  weaknesses: string[]
}

type Period = {
  id: string
  name: string
  weight: number
}

type Category = {
  id: string
  name: string
  weight: number
}

// Mock data generator for demo purposes
const generateMockStudentAnalytics = (): StudentGrade[] => {
  const studentNames = [
    { id: "s1", name: "Emma Johnson" },
    { id: "s2", name: "Noah Williams" },
    { id: "s3", name: "Olivia Brown" },
    { id: "s4", name: "Liam Jones" },
    { id: "s5", name: "Ava Garcia" },
    { id: "s6", name: "William Miller" },
    { id: "s7", name: "Sophia Davis" },
    { id: "s8", name: "James Rodriguez" },
    { id: "s9", name: "Isabella Martinez" },
    { id: "s10", name: "Benjamin Hernandez" },
    { id: "s11", name: "Mia Lopez" },
    { id: "s12", name: "Mason Gonzalez" },
    { id: "s13", name: "Charlotte Wilson" },
    { id: "s14", name: "Elijah Anderson" },
    { id: "s15", name: "Amelia Thomas" },
  ]

  const categories = [
    { id: "cat1", name: "Homework" },
    { id: "cat2", name: "Quizzes" },
    { id: "cat3", name: "Tests" },
    { id: "cat4", name: "Projects" },
    { id: "cat5", name: "Attendance" },
  ]

  const periods = [
    { id: "p1", name: "Quarter 1" },
    { id: "p2", name: "Quarter 2" },
    { id: "p3", name: "Quarter 3" },
    { id: "p4", name: "Quarter 4" },
  ]

  return studentNames.map((student) => {
    // Generate random grades with some patterns
    const isHighPerformer = Math.random() > 0.7
    const isLowPerformer = Math.random() < 0.2
    const isImproving = Math.random() > 0.5

    const periodGrades: Record<string, number> = {}
    periods.forEach((period, index) => {
      let baseGrade = isHighPerformer
        ? 85 + Math.random() * 15
        : isLowPerformer
          ? 50 + Math.random() * 20
          : 70 + Math.random() * 15

      // Add trend - improving students get better over time, declining get worse
      if (isImproving) {
        baseGrade += index * 2
      } else {
        baseGrade -= index * 1.5
      }

      // Clamp values
      baseGrade = Math.min(Math.max(baseGrade, 0), 100)
      periodGrades[period.id] = Math.round(baseGrade * 10) / 10
    })

    const categoryGrades: Record<string, number> = {}
    categories.forEach((category) => {
      let baseGrade = isHighPerformer
        ? 85 + Math.random() * 15
        : isLowPerformer
          ? 50 + Math.random() * 20
          : 70 + Math.random() * 15

      // Add some variation by category
      if (category.id === "cat3" && isLowPerformer) {
        // Low performers struggle more with tests
        baseGrade -= 10
      }

      if (category.id === "cat4" && isHighPerformer) {
        // High performers excel at projects
        baseGrade += 5
      }

      // Clamp values
      baseGrade = Math.min(Math.max(baseGrade, 0), 100)
      categoryGrades[category.id] = Math.round(baseGrade * 10) / 10
    })

    // Calculate final average
    const finalAverage = Object.values(periodGrades).reduce((sum, grade) => sum + grade, 0) / periods.length

    // Determine trend
    const firstHalf = (periodGrades["p1"] + periodGrades["p2"]) / 2
    const secondHalf = (periodGrades["p3"] + periodGrades["p4"]) / 2
    const trend = secondHalf - firstHalf > 3 ? "improving" : secondHalf - firstHalf < -3 ? "declining" : "stable"

    // Determine risk level
    let riskLevel: "high" | "medium" | "low" | "none" = "none"
    if (finalAverage < 60) {
      riskLevel = "high"
    } else if (finalAverage < 70) {
      riskLevel = "medium"
    } else if (finalAverage < 75) {
      riskLevel = "low"
    }

    // Generate risk factors
    const riskFactors: string[] = []
    if (categoryGrades["cat3"] < 65) riskFactors.push("Low test scores")
    if (categoryGrades["cat5"] < 70) riskFactors.push("Attendance issues")
    if (trend === "declining") riskFactors.push("Declining performance")
    if (Object.values(periodGrades).some((grade) => grade < 60)) riskFactors.push("Failed at least one period")

    // Determine cluster
    let cluster: "high-performing" | "average" | "struggling" | "at-risk" = "average"
    if (finalAverage >= 85) {
      cluster = "high-performing"
    } else if (finalAverage < 65) {
      cluster = "at-risk"
    } else if (finalAverage < 75) {
      cluster = "struggling"
    }

    // Determine strengths and weaknesses
    const strengths: string[] = []
    const weaknesses: string[] = []

    categories.forEach((category) => {
      if (categoryGrades[category.id] >= 85) {
        strengths.push(category.name)
      } else if (categoryGrades[category.id] < 70) {
        weaknesses.push(category.name)
      }
    })

    return {
      studentId: student.id,
      studentName: student.name,
      periodGrades,
      categoryGrades,
      finalAverage: Math.round(finalAverage * 10) / 10,
      trend,
      riskLevel,
      riskFactors,
      cluster,
      strengths,
      weaknesses,
    }
  })
}

export function StudentAnalytics({ classId }: { classId: string }) {
  const [loading, setLoading] = useState(true)
  const [students, setStudents] = useState<StudentGrade[]>([])
  const [selectedCluster, setSelectedCluster] = useState<string>("all")
  const [selectedRisk, setSelectedRisk] = useState<string>("all")

  // Load data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        // In a real app, fetch from API
        // const response = await fetch(`/api/classes/${classId}/analytics/students`)
        // const data = await response.json()
        // setStudents(data.students)

        // For demo, use mock data
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setStudents(generateMockStudentAnalytics())
      } catch (error) {
        console.error("Error loading student analytics:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [classId])

  // Filter students based on selected cluster and risk
  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const clusterMatch = selectedCluster === "all" || student.cluster === selectedCluster
      const riskMatch = selectedRisk === "all" || student.riskLevel === selectedRisk
      return clusterMatch && riskMatch
    })
  }, [students, selectedCluster, selectedRisk])

  // Calculate analytics
  const analytics = useMemo(() => {
    if (students.length === 0) return null

    const classAverage = students.reduce((sum, student) => sum + student.finalAverage, 0) / students.length

    const clusterCounts = {
      "high-performing": students.filter((s) => s.cluster === "high-performing").length,
      average: students.filter((s) => s.cluster === "average").length,
      struggling: students.filter((s) => s.cluster === "struggling").length,
      "at-risk": students.filter((s) => s.cluster === "at-risk").length,
    }

    const riskCounts = {
      high: students.filter((s) => s.riskLevel === "high").length,
      medium: students.filter((s) => s.riskLevel === "medium").length,
      low: students.filter((s) => s.riskLevel === "low").length,
      none: students.filter((s) => s.riskLevel === "none").length,
    }

    const trendCounts = {
      improving: students.filter((s) => s.trend === "improving").length,
      stable: students.filter((s) => s.trend === "stable").length,
      declining: students.filter((s) => s.trend === "declining").length,
    }

    return {
      classAverage: Math.round(classAverage * 10) / 10,
      clusterCounts,
      riskCounts,
      trendCounts,
    }
  }, [students])

  // Prepare chart data
  const scatterData = useMemo(() => {
    return students.map((student) => ({
      name: student.studentName,
      average: student.finalAverage,
      trend: student.trend === "improving" ? 1 : student.trend === "stable" ? 0 : -1,
      cluster: student.cluster,
      riskLevel: student.riskLevel,
    }))
  }, [students])

  const clusterData = useMemo(() => {
    if (!analytics) return []
    return [
      { name: "High Performing", value: analytics.clusterCounts["high-performing"], color: "#10b981" },
      { name: "Average", value: analytics.clusterCounts["average"], color: "#3b82f6" },
      { name: "Struggling", value: analytics.clusterCounts["struggling"], color: "#f59e0b" },
      { name: "At Risk", value: analytics.clusterCounts["at-risk"], color: "#ef4444" },
    ]
  }, [analytics])

  const riskData = useMemo(() => {
    if (!analytics) return []
    return [
      { name: "High Risk", value: analytics.riskCounts["high"], color: "#ef4444" },
      { name: "Medium Risk", value: analytics.riskCounts["medium"], color: "#f59e0b" },
      { name: "Low Risk", value: analytics.riskCounts["low"], color: "#3b82f6" },
      { name: "No Risk", value: analytics.riskCounts["none"], color: "#10b981" },
    ]
  }, [analytics])

  const trendData = useMemo(() => {
    if (!analytics) return []
    return [
      { name: "Improving", value: analytics.trendCounts["improving"], color: "#10b981" },
      { name: "Stable", value: analytics.trendCounts["stable"], color: "#3b82f6" },
      { name: "Declining", value: analytics.trendCounts["declining"], color: "#ef4444" },
    ]
  }, [analytics])

  // Get color for cluster
  const getClusterColor = (cluster: string) => {
    switch (cluster) {
      case "high-performing":
        return "bg-green-500"
      case "average":
        return "bg-blue-500"
      case "struggling":
        return "bg-amber-500"
      case "at-risk":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  // Get color for risk level
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "high":
        return "bg-red-500"
      case "medium":
        return "bg-amber-500"
      case "low":
        return "bg-blue-500"
      case "none":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  // Get icon for trend
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "improving":
        return <TrendingUp className="h-4 w-4 text-green-500" />
      case "declining":
        return <TrendingDown className="h-4 w-4 text-red-500" />
      default:
        return <ArrowUpRight className="h-4 w-4 text-blue-500" />
    }
  }

  // Get letter grade
  const getLetterGrade = (score: number) => {
    if (score >= 90) return "A"
    if (score >= 80) return "B"
    if (score >= 70) return "C"
    if (score >= 60) return "D"
    return "F"
  }

  // Loading state
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-64 bg-muted animate-pulse rounded"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="h-40 bg-muted animate-pulse rounded"></div>
          <div className="h-40 bg-muted animate-pulse rounded"></div>
          <div className="h-40 bg-muted animate-pulse rounded"></div>
        </div>
        <div className="h-80 bg-muted animate-pulse rounded"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold">Student Analytics & Clustering</h2>
        <div className="flex flex-wrap gap-2">
          <Select value={selectedCluster} onValueChange={setSelectedCluster}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by cluster" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Clusters</SelectItem>
              <SelectItem value="high-performing">High Performing</SelectItem>
              <SelectItem value="average">Average</SelectItem>
              <SelectItem value="struggling">Struggling</SelectItem>
              <SelectItem value="at-risk">At Risk</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedRisk} onValueChange={setSelectedRisk}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by risk" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Risk Levels</SelectItem>
              <SelectItem value="high">High Risk</SelectItem>
              <SelectItem value="medium">Medium Risk</SelectItem>
              <SelectItem value="low">Low Risk</SelectItem>
              <SelectItem value="none">No Risk</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export Analytics
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Class Average</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{analytics.classAverage}%</div>
              <div className="text-muted-foreground">Letter Grade: {getLetterGrade(analytics.classAverage)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">At-Risk Students</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{analytics.riskCounts.high + analytics.riskCounts.medium}</div>
              <div className="text-muted-foreground">
                {Math.round(((analytics.riskCounts.high + analytics.riskCounts.medium) / students.length) * 100)}% of
                class
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Performance Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                <span className="text-lg">{analytics.trendCounts.improving} Improving</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingDown className="h-5 w-5 text-red-500" />
                <span className="text-lg">{analytics.trendCounts.declining} Declining</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Student Clusters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span>{analytics.clusterCounts["high-performing"]} High Performing</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span>{analytics.clusterCounts["average"]} Average</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <span>{analytics.clusterCounts["struggling"]} Struggling</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span>{analytics.clusterCounts["at-risk"]} At Risk</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content */}
      <Tabs defaultValue="clusters">
        <TabsList className="mb-4">
          <TabsTrigger value="clusters">Student Clusters</TabsTrigger>
          <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
          <TabsTrigger value="trends">Performance Trends</TabsTrigger>
          <TabsTrigger value="insights">Actionable Insights</TabsTrigger>
        </TabsList>

        {/* Clusters Tab */}
        <TabsContent value="clusters">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Student Performance Clusters</CardTitle>
                <CardDescription>
                  Students are clustered based on their performance, trends, and risk factors
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 20, right: 30, bottom: 60, left: 30 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        type="number"
                        dataKey="average"
                        name="Average"
                        domain={[40, 100]}
                        label={{ value: "Final Average (%)", position: "bottom", offset: 20 }}
                      />
                      <YAxis
                        type="number"
                        dataKey="trend"
                        name="Trend"
                        domain={[-1.5, 1.5]}
                        label={{ value: "Performance Trend", angle: -90, position: "left", offset: 10 }}
                        ticks={[-1, 0, 1]}
                        tickFormatter={(value) => (value === 1 ? "Improving" : value === 0 ? "Stable" : "Declining")}
                      />
                      <ZAxis range={[60, 60]} />
                      <RechartsTooltip
                        cursor={{ strokeDasharray: "3 3" }}
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload
                            return (
                              <div className="bg-background border rounded-md shadow-md p-2">
                                <p className="font-medium">{data.name}</p>
                                <p>Average: {data.average}%</p>
                                <p>
                                  Trend: {data.trend === 1 ? "Improving" : data.trend === 0 ? "Stable" : "Declining"}
                                </p>
                                <p>Cluster: {data.cluster.replace("-", " ")}</p>
                                <p>Risk Level: {data.riskLevel}</p>
                              </div>
                            )
                          }
                          return null
                        }}
                      />
                      <Legend />
                      <Scatter name="Students" data={scatterData}>
                        {scatterData.map((entry, index) => (
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
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cluster Distribution</CardTitle>
                <CardDescription>Breakdown of students by performance cluster</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={clusterData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {clusterData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-4 space-y-2">
                  {clusterData.map((entry) => (
                    <div key={entry.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
                        <span>{entry.name}</span>
                      </div>
                      <span>{entry.value} students</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Student Cluster Details</CardTitle>
              <CardDescription>Detailed breakdown of students by performance cluster</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-medium">Student</TableHead>
                    <TableHead className="font-medium">Final Average</TableHead>
                    <TableHead className="font-medium">Cluster</TableHead>
                    <TableHead className="font-medium">Trend</TableHead>
                    <TableHead className="font-medium">Risk Level</TableHead>
                    <TableHead className="font-medium">Strengths</TableHead>
                    <TableHead className="font-medium">Areas for Improvement</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student) => (
                    <TableRow key={student.studentId}>
                      <TableCell className="font-medium">{student.studentName}</TableCell>
                      <TableCell>
                        {student.finalAverage}% ({getLetterGrade(student.finalAverage)})
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getClusterColor(student.cluster)} text-white`}>
                          {student.cluster.replace("-", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {getTrendIcon(student.trend)}
                          <span className="capitalize">{student.trend}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {student.riskLevel !== "none" ? (
                          <Badge className={`${getRiskColor(student.riskLevel)} text-white`}>
                            {student.riskLevel} risk
                          </Badge>
                        ) : (
                          <Badge variant="outline">No risk</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {student.strengths.length > 0 ? (
                            student.strengths.map((strength, i) => (
                              <Badge key={i} variant="outline" className="bg-green-50">
                                {strength}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-muted-foreground text-sm">None identified</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {student.weaknesses.length > 0 ? (
                            student.weaknesses.map((weakness, i) => (
                              <Badge key={i} variant="outline" className="bg-red-50">
                                {weakness}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-muted-foreground text-sm">None identified</span>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Risk Analysis Tab */}
        <TabsContent value="risk">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>At-Risk Student Analysis</CardTitle>
                <CardDescription>Identifying students who need additional support</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {students
                    .filter((student) => student.riskLevel === "high" || student.riskLevel === "medium")
                    .map((student) => (
                      <Alert key={student.studentId} variant={student.riskLevel === "high" ? "destructive" : "default"}>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle className="flex items-center gap-2">
                          {student.studentName}
                          <Badge className={`${getRiskColor(student.riskLevel)} text-white`}>
                            {student.riskLevel} risk
                          </Badge>
                        </AlertTitle>
                        <AlertDescription>
                          <div className="mt-2">
                            <p className="font-medium">Risk Factors:</p>
                            <ul className="list-disc pl-5 mt-1">
                              {student.riskFactors.map((factor, i) => (
                                <li key={i}>{factor}</li>
                              ))}
                            </ul>
                            <div className="mt-2">
                              <p className="font-medium">Recommended Interventions:</p>
                              <ul className="list-disc pl-5 mt-1">
                                {student.riskLevel === "high" ? (
                                  <>
                                    <li>Schedule immediate parent-teacher conference</li>
                                    <li>Assign academic advisor for weekly check-ins</li>
                                    <li>Provide targeted remedial materials</li>
                                  </>
                                ) : (
                                  <>
                                    <li>Offer additional office hours support</li>
                                    <li>Provide study resources for weak areas</li>
                                    <li>Monitor progress closely</li>
                                  </>
                                )}
                              </ul>
                            </div>
                          </div>
                        </AlertDescription>
                      </Alert>
                    ))}

                  {students.filter((student) => student.riskLevel === "high" || student.riskLevel === "medium")
                    .length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No at-risk students identified in the current selection
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Risk Distribution</CardTitle>
                <CardDescription>Breakdown of students by risk level</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={riskData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {riskData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-4 space-y-2">
                  {riskData.map((entry) => (
                    <div key={entry.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
                        <span>{entry.name}</span>
                      </div>
                      <span>{entry.value} students</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Common Risk Factors</CardTitle>
              <CardDescription>Analysis of the most common issues affecting student performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      {
                        name: "Low test scores",
                        count: students.filter((s) => s.riskFactors.includes("Low test scores")).length,
                      },
                      {
                        name: "Attendance issues",
                        count: students.filter((s) => s.riskFactors.includes("Attendance issues")).length,
                      },
                      {
                        name: "Declining performance",
                        count: students.filter((s) => s.riskFactors.includes("Declining performance")).length,
                      },
                      {
                        name: "Failed period",
                        count: students.filter((s) => s.riskFactors.includes("Failed at least one period")).length,
                      },
                    ]}
                    margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
                    <YAxis />
                    <RechartsTooltip />
                    <Bar dataKey="count" name="Number of Students" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Trends Tab */}
        <TabsContent value="trends">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Student Performance Trends</CardTitle>
                <CardDescription>Tracking student progress across grading periods</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="period"
                        type="category"
                        allowDuplicatedCategory={false}
                        categories={["p1", "p2", "p3", "p4"]}
                        tickFormatter={(value) =>
                          value === "p1" ? "Q1" : value === "p2" ? "Q2" : value === "p3" ? "Q3" : "Q4"
                        }
                      />
                      <YAxis domain={[40, 100]} />
                      <RechartsTooltip />
                      <Legend />

                      {filteredStudents.map((student) => {
                        const data = [
                          { period: "p1", grade: student.periodGrades["p1"] },
                          { period: "p2", grade: student.periodGrades["p2"] },
                          { period: "p3", grade: student.periodGrades["p3"] },
                          { period: "p4", grade: student.periodGrades["p4"] },
                        ]

                        const color =
                          student.cluster === "high-performing"
                            ? "#10b981"
                            : student.cluster === "average"
                              ? "#3b82f6"
                              : student.cluster === "struggling"
                                ? "#f59e0b"
                                : "#ef4444"

                        return (
                          <Line
                            key={student.studentId}
                            data={data}
                            type="monotone"
                            dataKey="grade"
                            name={student.studentName}
                            stroke={color}
                            activeDot={{ r: 8 }}
                          />
                        )
                      })}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Trend Distribution</CardTitle>
                <CardDescription>Breakdown of students by performance trend</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={trendData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {trendData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-4 space-y-2">
                  {trendData.map((entry) => (
                    <div key={entry.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
                        <span>{entry.name}</span>
                      </div>
                      <span>{entry.value} students</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Most Improved & Declining Students</CardTitle>
              <CardDescription>Students with the most significant changes in performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                    Most Improved Students
                  </h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student</TableHead>
                        <TableHead>Q1</TableHead>
                        <TableHead>Q4</TableHead>
                        <TableHead>Change</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {students
                        .filter((s) => s.trend === "improving")
                        .sort(
                          (a, b) =>
                            b.periodGrades["p4"] - b.periodGrades["p1"] - (a.periodGrades["p4"] - a.periodGrades["p1"]),
                        )
                        .slice(0, 5)
                        .map((student) => (
                          <TableRow key={student.studentId}>
                            <TableCell className="font-medium">{student.studentName}</TableCell>
                            <TableCell>{student.periodGrades["p1"]}%</TableCell>
                            <TableCell>{student.periodGrades["p4"]}%</TableCell>
                            <TableCell className="text-green-600">
                              +{(student.periodGrades["p4"] - student.periodGrades["p1"]).toFixed(1)}%
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                    <TrendingDown className="h-5 w-5 text-red-500" />
                    Most Declining Students
                  </h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student</TableHead>
                        <TableHead>Q1</TableHead>
                        <TableHead>Q4</TableHead>
                        <TableHead>Change</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {students
                        .filter((s) => s.trend === "declining")
                        .sort(
                          (a, b) =>
                            a.periodGrades["p4"] - a.periodGrades["p1"] - (b.periodGrades["p4"] - b.periodGrades["p1"]),
                        )
                        .slice(0, 5)
                        .map((student) => (
                          <TableRow key={student.studentId}>
                            <TableCell className="font-medium">{student.studentName}</TableCell>
                            <TableCell>{student.periodGrades["p1"]}%</TableCell>
                            <TableCell>{student.periodGrades["p4"]}%</TableCell>
                            <TableCell className="text-red-600">
                              {(student.periodGrades["p4"] - student.periodGrades["p1"]).toFixed(1)}%
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Insights Tab */}
        <TabsContent value="insights">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Actionable Insights</CardTitle>
                <CardDescription>Recommended actions based on student analytics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <UserX className="h-4 w-4" />
                  <AlertTitle>At-Risk Student Intervention</AlertTitle>
                  <AlertDescription>
                    <p className="mt-1">
                      {analytics?.riskCounts.high} students are at high risk of failing. Schedule immediate
                      interventions.
                    </p>
                    <Button variant="outline" size="sm" className="mt-2">
                      View Intervention Plan
                    </Button>
                  </AlertDescription>
                </Alert>

                <Alert>
                  <BookOpen className="h-4 w-4" />
                  <AlertTitle>Test Performance Gap</AlertTitle>
                  <AlertDescription>
                    <p className="mt-1">
                      Test scores are consistently lower than other categories. Consider reviewing test formats and
                      providing additional preparation materials.
                    </p>
                    <Button variant="outline" size="sm" className="mt-2">
                      View Test Analysis
                    </Button>
                  </AlertDescription>
                </Alert>

                <Alert>
                  <Users className="h-4 w-4" />
                  <AlertTitle>Performance Clusters</AlertTitle>
                  <AlertDescription>
                    <p className="mt-1">
                      Consider differentiated instruction for the{" "}
                      {analytics?.clusterCounts["struggling"] + analytics?.clusterCounts["at-risk"]} students in the
                      struggling and at-risk clusters.
                    </p>
                    <Button variant="outline" size="sm" className="mt-2">
                      View Differentiation Strategies
                    </Button>
                  </AlertDescription>
                </Alert>

                <Alert>
                  <Award className="h-4 w-4" />
                  <AlertTitle>High Performers</AlertTitle>
                  <AlertDescription>
                    <p className="mt-1">
                      {analytics?.clusterCounts["high-performing"]} students are consistently high-performing. Consider
                      enrichment opportunities.
                    </p>
                    <Button variant="outline" size="sm" className="mt-2">
                      View Enrichment Options
                    </Button>
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Category Performance Analysis</CardTitle>
                <CardDescription>Identifying strengths and weaknesses across categories</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        {
                          name: "Homework",
                          average: students.reduce((sum, s) => sum + s.categoryGrades["cat1"], 0) / students.length,
                        },
                        {
                          name: "Quizzes",
                          average: students.reduce((sum, s) => sum + s.categoryGrades["cat2"], 0) / students.length,
                        },
                        {
                          name: "Tests",
                          average: students.reduce((sum, s) => sum + s.categoryGrades["cat3"], 0) / students.length,
                        },
                        {
                          name: "Projects",
                          average: students.reduce((sum, s) => sum + s.categoryGrades["cat4"], 0) / students.length,
                        },
                        {
                          name: "Attendance",
                          average: students.reduce((sum, s) => sum + s.categoryGrades["cat5"], 0) / students.length,
                        },
                      ]}
                      margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 100]} />
                      <RechartsTooltip />
                      <Bar dataKey="average" name="Class Average (%)" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-4 space-y-2">
                  <h3 className="text-lg font-medium">Key Observations:</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>
                      Test scores are the lowest category average at{" "}
                      {Math.round(students.reduce((sum, s) => sum + s.categoryGrades["cat3"], 0) / students.length)}%
                    </li>
                    <li>
                      Project scores are the highest category average at{" "}
                      {Math.round(students.reduce((sum, s) => sum + s.categoryGrades["cat4"], 0) / students.length)}%
                    </li>
                    <li>
                      {students.filter((s) => s.weaknesses.includes("Tests")).length} students struggle specifically
                      with tests
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Recommended Interventions</CardTitle>
              <CardDescription>Targeted strategies based on student analytics</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-medium">Student Group</TableHead>
                    <TableHead className="font-medium">Issue</TableHead>
                    <TableHead className="font-medium">Recommended Intervention</TableHead>
                    <TableHead className="font-medium">Expected Outcome</TableHead>
                    <TableHead className="font-medium">Priority</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">High Risk Students</TableCell>
                    <TableCell>Multiple failing grades</TableCell>
                    <TableCell>
                      <ul className="list-disc pl-5">
                        <li>Individual academic plans</li>
                        <li>Weekly progress monitoring</li>
                        <li>Parent-teacher conferences</li>
                      </ul>
                    </TableCell>
                    <TableCell>Improvement to passing grades within one period</TableCell>
                    <TableCell>
                      <Badge className="bg-red-500 text-white">High</Badge>
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell className="font-medium">Declining Performers</TableCell>
                    <TableCell>Negative grade trend</TableCell>
                    <TableCell>
                      <ul className="list-disc pl-5">
                        <li>Study skills workshop</li>
                        <li>Bi-weekly check-ins</li>
                        <li>Targeted support in declining areas</li>
                      </ul>
                    </TableCell>
                    <TableCell>Stabilize performance and reverse negative trend</TableCell>
                    <TableCell>
                      <Badge className="bg-amber-500 text-white">Medium</Badge>
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell className="font-medium">Test Strugglers</TableCell>
                    <TableCell>Low test scores despite good homework</TableCell>
                    <TableCell>
                      <ul className="list-disc pl-5">
                        <li>Test-taking strategies workshop</li>
                        <li>Practice tests with feedback</li>
                        <li>Anxiety reduction techniques</li>
                      </ul>
                    </TableCell>
                    <TableCell>Improved test performance aligned with homework scores</TableCell>
                    <TableCell>
                      <Badge className="bg-amber-500 text-white">Medium</Badge>
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell className="font-medium">High Performers</TableCell>
                    <TableCell>Need for additional challenge</TableCell>
                    <TableCell>
                      <ul className="list-disc pl-5">
                        <li>Advanced enrichment materials</li>
                        <li>Peer tutoring opportunities</li>
                        <li>Independent projects</li>
                      </ul>
                    </TableCell>
                    <TableCell>Maintained engagement and continued excellence</TableCell>
                    <TableCell>
                      <Badge className="bg-blue-500 text-white">Low</Badge>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter>
              <Button className="ml-auto">Generate Intervention Plan</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
