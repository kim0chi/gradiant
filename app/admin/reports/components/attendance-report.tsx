"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { Download, FileText } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { addDays, format } from "date-fns"
import {
  AreaChart,
  Area,
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
  PieChart,
  Pie,
  Cell,
} from "recharts"

// Attendance statistics data type
type AttendanceStats = {
  totalDays: number
  presentCount: number
  absentCount: number
  lateCount: number
  excusedCount: number
  presentPercentage: number
  absentPercentage: number
  latePercentage: number
  excusedPercentage: number
}

// Daily attendance data type
type DailyAttendance = {
  date: string
  present: number
  absent: number
  late: number
  excused: number
  total: number
  presentPercentage: number
}

// Class attendance data type
type ClassAttendance = {
  className: string
  presentPercentage: number
  absentPercentage: number
  latePercentage: number
  excusedPercentage: number
}

export function AttendanceReport() {
  const [selectedClass, setSelectedClass] = useState("all")
  const [selectedGradeLevel, setSelectedGradeLevel] = useState("all")
  const [dateRange, setDateRange] = useState({
    from: addDays(new Date(), -30),
    to: new Date(),
  })
  const [isLoading, setIsLoading] = useState(true)
  const [attendanceStats, setAttendanceStats] = useState<AttendanceStats | null>(null)
  const [dailyAttendance, setDailyAttendance] = useState<DailyAttendance[]>([])
  const [classAttendance, setClassAttendance] = useState<ClassAttendance[]>([])

  // Fetch attendance data when filters change
  useEffect(() => {
    setIsLoading(true)

    // Simulate API call
    const timer = setTimeout(() => {
      // Generate mock data
      const stats: AttendanceStats = {
        totalDays: 22,
        presentCount: 1850,
        absentCount: 120,
        lateCount: 84,
        excusedCount: 46,
        presentPercentage: 88,
        absentPercentage: 6,
        latePercentage: 4,
        excusedPercentage: 2,
      }

      // Generate daily attendance data
      const daily: DailyAttendance[] = []
      const startDate = dateRange.from || addDays(new Date(), -30)
      const endDate = dateRange.to || new Date()
      let currentDate = new Date(startDate)

      while (currentDate <= endDate) {
        // Skip weekends
        if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
          const presentPercent = 75 + Math.random() * 20
          const total = Math.floor(200 + Math.random() * 20)
          const present = Math.floor(total * (presentPercent / 100))
          const absent = Math.floor(total * ((100 - presentPercent) / 3))
          const late = Math.floor(total * ((100 - presentPercent) / 3))
          const excused = total - present - absent - late

          daily.push({
            date: format(currentDate, "yyyy-MM-dd"),
            present,
            absent,
            late,
            excused,
            total,
            presentPercentage: Math.round((present / total) * 100),
          })
        }
        currentDate = addDays(currentDate, 1)
      }

      // Generate class attendance data
      const classes: ClassAttendance[] = [
        {
          className: "Grade 9 Mathematics",
          presentPercentage: 92,
          absentPercentage: 3,
          latePercentage: 3,
          excusedPercentage: 2,
        },
        {
          className: "Grade 10 Science",
          presentPercentage: 88,
          absentPercentage: 5,
          latePercentage: 4,
          excusedPercentage: 3,
        },
        {
          className: "Grade 11 English",
          presentPercentage: 85,
          absentPercentage: 8,
          latePercentage: 4,
          excusedPercentage: 3,
        },
        {
          className: "Grade 9 History",
          presentPercentage: 84,
          absentPercentage: 7,
          latePercentage: 5,
          excusedPercentage: 4,
        },
        {
          className: "Grade 12 Computer Science",
          presentPercentage: 94,
          absentPercentage: 2,
          latePercentage: 2,
          excusedPercentage: 2,
        },
      ]

      setAttendanceStats(stats)
      setDailyAttendance(daily)
      setClassAttendance(classes)
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [selectedClass, selectedGradeLevel, dateRange])

  const downloadReport = () => {
    toast({
      title: "Report download started",
      description: "Your attendance report is being generated and will download shortly.",
    })

    // In a real application, this would generate a PDF or CSV
    setTimeout(() => {
      toast({
        title: "Report downloaded",
        description: "Attendance report has been downloaded.",
      })
    }, 2000)
  }

  const pieColors = ["#22c55e", "#ef4444", "#f97316", "#3b82f6"]

  // Prepare data for pie chart
  const pieData = attendanceStats
    ? [
        { name: "Present", value: attendanceStats.presentCount, percentage: attendanceStats.presentPercentage },
        { name: "Absent", value: attendanceStats.absentCount, percentage: attendanceStats.absentPercentage },
        { name: "Late", value: attendanceStats.lateCount, percentage: attendanceStats.latePercentage },
        { name: "Excused", value: attendanceStats.excusedCount, percentage: attendanceStats.excusedPercentage },
      ]
    : []

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-10 w-64" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-[350px] w-full" />
          <Skeleton className="h-[350px] w-full" />
        </div>
        <Skeleton className="h-[300px] w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">Attendance Reports</h2>
          <p className="text-sm text-muted-foreground">View attendance statistics and trends</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select class" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Classes</SelectItem>
              <SelectItem value="grade-9-math">Grade 9 Math</SelectItem>
              <SelectItem value="grade-10-science">Grade 10 Science</SelectItem>
              <SelectItem value="grade-11-english">Grade 11 English</SelectItem>
              <SelectItem value="grade-12-cs">Grade 12 CS</SelectItem>
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

      <div className="space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <Label>Date Range</Label>
          <DatePickerWithRange date={dateRange} setDate={setDateRange} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Present Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{attendanceStats?.presentPercentage}%</div>
              <p className="text-xs text-muted-foreground">{attendanceStats?.presentCount} students</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Absent Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{attendanceStats?.absentPercentage}%</div>
              <p className="text-xs text-muted-foreground">{attendanceStats?.absentCount} students</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Late Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{attendanceStats?.latePercentage}%</div>
              <p className="text-xs text-muted-foreground">{attendanceStats?.lateCount} students</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Excused Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{attendanceStats?.excusedPercentage}%</div>
              <p className="text-xs text-muted-foreground">{attendanceStats?.excusedCount} students</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Attendance Overview</CardTitle>
            <CardDescription>Distribution of attendance statuses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, _, props) => [`${value} students (${props.payload.percentage}%)`, props.payload.name]}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Daily Attendance Trend</CardTitle>
            <CardDescription>Attendance percentage over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dailyAttendance} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tickFormatter={(date) => format(new Date(date), "MM/dd")} />
                  <YAxis domain={[0, 100]} />
                  <Tooltip
                    labelFormatter={(label) => format(new Date(label), "MMMM d, yyyy")}
                    formatter={(value, name) => [`${value}%`, "Present Rate"]}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="presentPercentage"
                    name="Present Rate"
                    stroke="#22c55e"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <Tabs defaultValue="trend">
            <div className="flex justify-between items-center">
              <CardTitle>Attendance Details</CardTitle>
              <TabsList>
                <TabsTrigger value="trend">Daily Trend</TabsTrigger>
                <TabsTrigger value="classes">By Class</TabsTrigger>
              </TabsList>
            </div>
          </Tabs>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="trend" className="space-y-4">
            <TabsContent value="trend">
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dailyAttendance} margin={{ top: 10, right: 30, left: 0, bottom: 30 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(date) => format(new Date(date), "MM/dd")}
                      angle={-45}
                      textAnchor="end"
                      height={50}
                    />
                    <YAxis />
                    <Tooltip labelFormatter={(label) => format(new Date(label), "MMMM d, yyyy")} />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="present"
                      stackId="1"
                      name="Present"
                      fill="#22c55e"
                      stroke="#22c55e"
                    />
                    <Area type="monotone" dataKey="absent" stackId="1" name="Absent" fill="#ef4444" stroke="#ef4444" />
                    <Area type="monotone" dataKey="late" stackId="1" name="Late" fill="#f97316" stroke="#f97316" />
                    <Area
                      type="monotone"
                      dataKey="excused"
                      stackId="1"
                      name="Excused"
                      fill="#3b82f6"
                      stroke="#3b82f6"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>

            <TabsContent value="classes">
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={classAttendance}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 100]} />
                    <YAxis type="category" dataKey="className" width={100} />
                    <Tooltip formatter={(value) => [`${value}%`, ""]} />
                    <Legend />
                    <Bar dataKey="presentPercentage" name="Present" fill="#22c55e" stackId="a" />
                    <Bar dataKey="latePercentage" name="Late" fill="#f97316" stackId="a" />
                    <Bar dataKey="excusedPercentage" name="Excused" fill="#3b82f6" stackId="a" />
                    <Bar dataKey="absentPercentage" name="Absent" fill="#ef4444" stackId="a" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button variant="outline" onClick={downloadReport}>
            <FileText className="mr-2 h-4 w-4" />
            Download Detailed Report
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
