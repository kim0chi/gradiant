"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, FileText, BarChart2, PieChartIcon } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Skeleton } from "@/components/ui/skeleton"

// Grade distribution data
type GradeData = {
  grade: string
  count: number
  percentage: number
  color: string
}

// Class performance data
type ClassPerformance = {
  name: string
  average: number
  median: number
  highest: number
  lowest: number
}

export function GradesReport() {
  const [activeView, setActiveView] = useState<"chart" | "pie">("chart")
  const [selectedPeriod, setSelectedPeriod] = useState("current-term")
  const [selectedGradeLevel, setSelectedGradeLevel] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [gradeDistribution, setGradeDistribution] = useState<GradeData[]>([])
  const [classPerformance, setClassPerformance] = useState<ClassPerformance[]>([])

  useEffect(() => {
    // Simulate data loading
    setIsLoading(true)

    setTimeout(() => {
      setGradeDistribution([
        { grade: "A", count: 120, percentage: 25, color: "#22c55e" },
        { grade: "B", count: 180, percentage: 38, color: "#3b82f6" },
        { grade: "C", count: 95, percentage: 20, color: "#f59e0b" },
        { grade: "D", count: 45, percentage: 10, color: "#f97316" },
        { grade: "F", count: 35, percentage: 7, color: "#ef4444" },
      ])

      setClassPerformance([
        { name: "Mathematics", average: 82, median: 84, highest: 98, lowest: 65 },
        { name: "Science", average: 79, median: 81, highest: 96, lowest: 62 },
        { name: "English", average: 85, median: 87, highest: 99, lowest: 70 },
        { name: "History", average: 81, median: 83, highest: 95, lowest: 68 },
        { name: "Computer Science", average: 88, median: 90, highest: 100, lowest: 72 },
      ])

      setIsLoading(false)
    }, 1500)
  }, [selectedPeriod, selectedGradeLevel])

  const downloadReport = () => {
    toast({
      title: "Report download started",
      description: "Your report is being generated and will download shortly.",
    })

    // In a real application, this would generate a PDF or CSV
    setTimeout(() => {
      toast({
        title: "Report downloaded",
        description: "Academic performance report has been downloaded.",
      })
    }, 2000)
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-10 w-28" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-[350px] w-full" />
          <Skeleton className="h-[350px] w-full" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">Academic Performance</h2>
          <p className="text-sm text-muted-foreground">Overall grade distribution and subject performance</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current-term">Current Term</SelectItem>
              <SelectItem value="previous-term">Previous Term</SelectItem>
              <SelectItem value="year-to-date">Year to Date</SelectItem>
              <SelectItem value="previous-year">Previous Year</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedGradeLevel} onValueChange={setSelectedGradeLevel}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Grade level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Grades</SelectItem>
              <SelectItem value="grade-9">Grade 9</SelectItem>
              <SelectItem value="grade-10">Grade 10</SelectItem>
              <SelectItem value="grade-11">Grade 11</SelectItem>
              <SelectItem value="grade-12">Grade 12</SelectItem>
            </SelectContent>
          </Select>

          <Button onClick={downloadReport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle>Grade Distribution</CardTitle>
              <div className="flex gap-1">
                <Button
                  variant={activeView === "chart" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setActiveView("chart")}
                >
                  <BarChart2 className="h-4 w-4" />
                </Button>
                <Button
                  variant={activeView === "pie" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setActiveView("pie")}
                >
                  <PieChartIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <CardDescription>Distribution of grades across all subjects</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {activeView === "chart" ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={gradeDistribution} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="grade" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value} students`, "Count"]} />
                    <Legend />
                    <Bar dataKey="count" name="Student Count" radius={[4, 4, 0, 0]} fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={gradeDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="count"
                      nameKey="grade"
                    >
                      {gradeDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value, name, props) => [
                        `${value} students (${props.payload.percentage}%)`,
                        `Grade ${props.payload.grade}`,
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
          <CardFooter className="text-sm text-muted-foreground">
            Total students: {gradeDistribution.reduce((acc, curr) => acc + curr.count, 0)}
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Subject Performance</CardTitle>
            <CardDescription>Average grades by subject</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={classPerformance}
                  layout="vertical"
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis type="category" dataKey="name" width={100} />
                  <Tooltip formatter={(value) => [`${value}%`, "Score"]} />
                  <Legend />
                  <Bar dataKey="average" name="Average %" fill="#3b82f6" />
                  <Bar dataKey="median" name="Median %" fill="#22c55e" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Subject Performance Details</CardTitle>
          <CardDescription>Detailed breakdown of grade metrics by subject</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Subject</th>
                  <th className="text-center p-2">Average Score</th>
                  <th className="text-center p-2">Median Score</th>
                  <th className="text-center p-2">Highest Score</th>
                  <th className="text-center p-2">Lowest Score</th>
                </tr>
              </thead>
              <tbody>
                {classPerformance.map((subject, i) => (
                  <tr key={i} className="border-b hover:bg-muted/50">
                    <td className="p-2 font-medium">{subject.name}</td>
                    <td className="p-2 text-center">{subject.average}%</td>
                    <td className="p-2 text-center">{subject.median}%</td>
                    <td className="p-2 text-center">{subject.highest}%</td>
                    <td className="p-2 text-center">{subject.lowest}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button variant="outline" size="sm" onClick={downloadReport}>
            <FileText className="mr-2 h-4 w-4" />
            Download Detailed Report
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
