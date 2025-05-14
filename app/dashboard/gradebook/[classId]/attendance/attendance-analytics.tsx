"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
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
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts"
import {
  CheckCircle2,
  XCircle,
  Clock,
  CalendarIcon,
  Download,
  Search,
  AlertTriangle,
  FileBarChart,
  Users,
  TrendingDown,
  HelpCircle,
} from "lucide-react"
import { format, startOfWeek, endOfWeek, isWeekend, getMonth, getYear, subDays } from "date-fns"
import { cn } from "@/lib/utils"

// Define types
type Student = {
  id: string
  name: string
  email: string
}

type AttendanceRecord = {
  id: string
  studentId: string
  date: Date
  status: "present" | "absent" | "tardy" | "excused"
}

type AttendanceAnalyticsProps = {
  classId: string
}

// Mock data generator
const generateMockData = () => {
  // Create students
  const students: Student[] = Array.from({ length: 20 }, (_, i) => ({
    id: `student-${i + 1}`,
    name: `Student ${i + 1}`,
    email: `student${i + 1}@example.com`,
  }))

  // Generate 3 months of attendance records
  const attendanceRecords: AttendanceRecord[] = []
  const today = new Date()
  const startDate = subDays(today, 90) // 3 months of data

  // For each student
  students.forEach((student) => {
    const currentDate = new Date(startDate)

    // Student-specific attendance patterns
    const attendancePattern = {
      absentRate: Math.random() * 0.2, // 0-20% absence rate
      tardyRate: Math.random() * 0.15, // 0-15% tardy rate
      excusedRate: Math.random() * 0.1, // 0-10% excused rate
      // Some students will have worse attendance on Mondays or Fridays
      mondayProblem: Math.random() > 0.7,
      fridayProblem: Math.random() > 0.7,
      // Some students will have a period of poor attendance
      attendanceSlump: {
        active: Math.random() > 0.7,
        startDay: Math.floor(Math.random() * 30) + 15,
        duration: Math.floor(Math.random() * 14) + 7, // 1-3 week slump
      },
    }

    // For each day
    let dayCount = 0
    while (currentDate <= today) {
      // Skip weekends
      if (!isWeekend(currentDate)) {
        dayCount++
        let status: "present" | "absent" | "tardy" | "excused" = "present"

        // Apply attendance slump if active and within the slump period
        const inSlump =
          attendancePattern.attendanceSlump.active &&
          dayCount >= attendancePattern.attendanceSlump.startDay &&
          dayCount < attendancePattern.attendanceSlump.startDay + attendancePattern.attendanceSlump.duration

        // Higher absence rates during slump
        const effectiveAbsentRate = inSlump ? attendancePattern.absentRate * 3 : attendancePattern.absentRate
        const effectiveTardyRate = inSlump ? attendancePattern.tardyRate * 2 : attendancePattern.tardyRate

        // Apply day-specific patterns
        const dayOfWeek = currentDate.getDay()
        const isMondayProblem = attendancePattern.mondayProblem && dayOfWeek === 1
        const isFridayProblem = attendancePattern.fridayProblem && dayOfWeek === 5

        // Determine status based on probabilities and patterns
        const rand = Math.random()
        if (isMondayProblem || isFridayProblem) {
          // Higher absence/tardy rate on problem days
          if (rand < 0.25) status = "absent"
          else if (rand < 0.4) status = "tardy"
          else if (rand < 0.5) status = "excused"
        } else if (rand < effectiveAbsentRate) {
          status = "absent"
        } else if (rand < effectiveAbsentRate + effectiveTardyRate) {
          status = "tardy"
        } else if (rand < effectiveAbsentRate + effectiveTardyRate + attendancePattern.excusedRate) {
          status = "excused"
        }

        attendanceRecords.push({
          id: `${student.id}-${format(currentDate, "yyyy-MM-dd")}`,
          studentId: student.id,
          date: new Date(currentDate),
          status,
        })
      }

      // Move to next day
      currentDate.setDate(currentDate.getDate() + 1)
    }
  })

  return { students, attendanceRecords }
}

export function AttendanceAnalytics({ classId }: AttendanceAnalyticsProps) {
  const [loading, setLoading] = useState(true)
  const [students, setStudents] = useState<Student[]>([])
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([])
  const [selectedDateRange, setSelectedDateRange] = useState<"term" | "month" | "week">("month")
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null)

  // Load data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        // In a real app, we'd fetch from an API
        // const response = await fetch(`/api/classes/${classId}/attendance-analytics`)
        // const data = await response.json()
        // setStudents(data.students)
        // setAttendanceRecords(data.attendanceRecords)

        // For demo, use mock data
        await new Promise((resolve) => setTimeout(resolve, 1000))
        const { students, attendanceRecords } = generateMockData()
        setStudents(students)
        setAttendanceRecords(attendanceRecords)
      } catch (error) {
        console.error("Error loading attendance data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [classId])

  // Filter records based on date range
  const filteredRecords = useMemo(() => {
    if (attendanceRecords.length === 0) return []

    let startDate, endDate

    if (selectedDateRange === "week") {
      startDate = startOfWeek(selectedDate)
      endDate = endOfWeek(selectedDate)
    } else if (selectedDateRange === "month") {
      startDate = new Date(getYear(selectedDate), getMonth(selectedDate), 1)
      endDate = new Date(getYear(selectedDate), getMonth(selectedDate) + 1, 0)
    } else {
      // Term - use all available data
      const dates = attendanceRecords.map((record) => record.date)
      startDate = new Date(Math.min(...dates.map((d) => d.getTime())))
      endDate = new Date(Math.max(...dates.map((d) => d.getTime())))
    }

    return attendanceRecords.filter((record) => {
      const recordDate = new Date(record.date)
      return recordDate >= startDate && recordDate <= endDate
    })
  }, [attendanceRecords, selectedDate, selectedDateRange])

  // Filter students based on search query
  const filteredStudents = useMemo(() => {
    if (searchQuery.trim() === "") return students
    const query = searchQuery.toLowerCase()
    return students.filter(
      (student) => student.name.toLowerCase().includes(query) || student.email.toLowerCase().includes(query),
    )
  }, [students, searchQuery])

  // Calculate attendance statistics
  const attendanceStats = useMemo(() => {
    if (filteredRecords.length === 0)
      return {
        totalDays: 0,
        byStatus: { present: 0, absent: 0, tardy: 0, excused: 0 },
        byStudent: {},
        presentRate: 0,
        dailyAverage: [],
      }

    const byStatus = {
      present: filteredRecords.filter((r) => r.status === "present").length,
      absent: filteredRecords.filter((r) => r.status === "absent").length,
      tardy: filteredRecords.filter((r) => r.status === "tardy").length,
      excused: filteredRecords.filter((r) => r.status === "excused").length,
    }

    const byStudent: Record<string, { present: number; absent: number; tardy: number; excused: number; rate: number }> =
      {}

    // Initialize counts for each student
    students.forEach((student) => {
      byStudent[student.id] = { present: 0, absent: 0, tardy: 0, excused: 0, rate: 0 }
    })

    // Count records for each student
    filteredRecords.forEach((record) => {
      if (byStudent[record.studentId]) {
        byStudent[record.studentId][record.status]++
      }
    })

    // Calculate attendance rate for each student
    Object.keys(byStudent).forEach((studentId) => {
      const stats = byStudent[studentId]
      const total = stats.present + stats.absent + stats.tardy + stats.excused
      if (total > 0) {
        // Count present and excused as attended, tardy as partial
        stats.rate = ((stats.present + stats.excused + stats.tardy * 0.5) / total) * 100
      }
    })

    // Calculate daily average
    const dates = [...new Set(filteredRecords.map((r) => format(new Date(r.date), "yyyy-MM-dd")))]
    const dailyAverage = dates.map((date) => {
      const dayRecords = filteredRecords.filter((r) => format(new Date(r.date), "yyyy-MM-dd") === date)
      const present = dayRecords.filter((r) => r.status === "present").length
      const tardy = dayRecords.filter((r) => r.status === "tardy").length
      const total = dayRecords.length

      return {
        date,
        displayDate: format(new Date(date), "MMM d"),
        rate: Math.round(((present + tardy * 0.5) / total) * 100),
      }
    })

    // Sort by date
    dailyAverage.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    return {
      totalDays: dates.length,
      byStatus,
      byStudent,
      presentRate: Math.round(
        ((byStatus.present + byStatus.excused + byStatus.tardy * 0.5) / filteredRecords.length) * 100,
      ),
      dailyAverage,
    }
  }, [filteredRecords, students])

  // Calculate at-risk students
  const atRiskStudents = useMemo(() => {
    if (Object.keys(attendanceStats.byStudent).length === 0) return []

    return students
      .filter((student) => {
        const stats = attendanceStats.byStudent[student.id]
        // Consider students with < 85% attendance rate as at risk
        return stats && stats.rate < 85
      })
      .sort((a, b) => (attendanceStats.byStudent[a.id]?.rate || 0) - (attendanceStats.byStudent[b.id]?.rate || 0))
      .slice(0, 5) // Top 5 most at-risk
  }, [attendanceStats, students])

  // Get days with attendance for heatmap
  const attendanceDays = useMemo(() => {
    const dayMap = new Map<string, { total: number; present: number; absent: number; tardy: number; excused: number }>()

    filteredRecords.forEach((record) => {
      const dateStr = format(new Date(record.date), "yyyy-MM-dd")
      if (!dayMap.has(dateStr)) {
        dayMap.set(dateStr, { total: 0, present: 0, absent: 0, tardy: 0, excused: 0 })
      }

      const day = dayMap.get(dateStr)!
      day.total++
      day[record.status]++
    })

    return Array.from(dayMap.entries()).map(([date, stats]) => ({
      date: new Date(date),
      total: stats.total,
      present: stats.present,
      absent: stats.absent,
      tardy: stats.tardy,
      excused: stats.excused,
      presentRate: Math.round(((stats.present + stats.excused + stats.tardy * 0.5) / stats.total) * 100),
    }))
  }, [filteredRecords])

  // Calculate attendance by day of week
  const attendanceByDayOfWeek = useMemo(() => {
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
    const dayCounts = days.map((day) => ({ name: day, present: 0, absent: 0, tardy: 0, excused: 0, total: 0 }))

    filteredRecords.forEach((record) => {
      const date = new Date(record.date)
      const dayIndex = date.getDay() - 1 // 0 = Monday

      if (dayIndex >= 0 && dayIndex < 5) {
        // Only weekdays
        dayCounts[dayIndex].total++
        dayCounts[dayIndex][record.status]++
      }
    })

    return dayCounts.map((day) => ({
      ...day,
      presentRate: day.total > 0 ? Math.round(((day.present + day.excused + day.tardy * 0.5) / day.total) * 100) : 0,
    }))
  }, [filteredRecords])

  // Get student details
  const getStudentDetails = (studentId: string) => {
    return students.find((s) => s.id === studentId)
  }

  // Get attendance trend for a student
  const getStudentTrend = (studentId: string) => {
    if (filteredRecords.length === 0) return []

    const studentRecords = filteredRecords
      .filter((r) => r.studentId === studentId)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    // Group by week for trends
    const weekMap = new Map<
      string,
      { present: number; absent: number; tardy: number; excused: number; total: number }
    >()

    studentRecords.forEach((record) => {
      const weekStart = format(startOfWeek(new Date(record.date)), "yyyy-MM-dd")

      if (!weekMap.has(weekStart)) {
        weekMap.set(weekStart, { present: 0, absent: 0, tardy: 0, excused: 0, total: 0 })
      }

      const week = weekMap.get(weekStart)!
      week.total++
      week[record.status]++
    })

    return Array.from(weekMap.entries()).map(([week, stats]) => ({
      week,
      weekLabel: format(new Date(week), "MMM d"),
      presentRate:
        stats.total > 0 ? Math.round(((stats.present + stats.excused + stats.tardy * 0.5) / stats.total) * 100) : 0,
      absentRate: stats.total > 0 ? Math.round((stats.absent / stats.total) * 100) : 0,
      tardyRate: stats.total > 0 ? Math.round((stats.tardy / stats.total) * 100) : 0,
    }))
  }

  // Helper functions for rendering
  const getStatusColor = (status: string) => {
    switch (status) {
      case "present":
        return "bg-green-500"
      case "absent":
        return "bg-red-500"
      case "tardy":
        return "bg-yellow-500"
      case "excused":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "present":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case "absent":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "tardy":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "excused":
        return <AlertTriangle className="h-4 w-4 text-blue-500" />
      default:
        return null
    }
  }

  const getAttendanceRateColor = (rate: number) => {
    if (rate >= 95) return "text-green-600"
    if (rate >= 90) return "text-green-500"
    if (rate >= 85) return "text-yellow-500"
    if (rate >= 80) return "text-orange-500"
    return "text-red-500"
  }

  const getAttendanceBadge = (rate: number) => {
    if (rate >= 95) return <Badge className="bg-green-500">Excellent</Badge>
    if (rate >= 90) return <Badge className="bg-green-400">Good</Badge>
    if (rate >= 85) return <Badge className="bg-yellow-400">Fair</Badge>
    if (rate >= 80) return <Badge className="bg-orange-400">Concerning</Badge>
    return <Badge className="bg-red-500">At Risk</Badge>
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
        <h2 className="text-2xl font-bold">Attendance Analytics</h2>
        <div className="flex flex-wrap gap-2">
          <TabsList>
            <TabsTrigger
              value="term"
              onClick={() => setSelectedDateRange("term")}
              className={selectedDateRange === "term" ? "bg-primary text-primary-foreground" : ""}
            >
              Term
            </TabsTrigger>
            <TabsTrigger
              value="month"
              onClick={() => setSelectedDateRange("month")}
              className={selectedDateRange === "month" ? "bg-primary text-primary-foreground" : ""}
            >
              Month
            </TabsTrigger>
            <TabsTrigger
              value="week"
              onClick={() => setSelectedDateRange("week")}
              className={selectedDateRange === "week" ? "bg-primary text-primary-foreground" : ""}
            >
              Week
            </TabsTrigger>
          </TabsList>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex gap-2">
                <CalendarIcon className="h-4 w-4" />
                {selectedDateRange === "week"
                  ? `Week of ${format(startOfWeek(selectedDate), "MMM d")}`
                  : selectedDateRange === "month"
                    ? format(selectedDate, "MMMM yyyy")
                    : "Full Term"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <Button variant="outline" className="flex gap-2">
            <Download className="h-4 w-4" />
            <span>Export Data</span>
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Attendance Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{attendanceStats.presentRate}%</div>
            <div className="text-muted-foreground">Over {attendanceStats.totalDays} school days</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Absent Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {attendanceStats.totalDays > 0
                ? Math.round((attendanceStats.byStatus.absent / filteredRecords.length) * 100)
                : 0}
              %
            </div>
            <div className="text-muted-foreground">{attendanceStats.byStatus.absent} total absences</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Tardy Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {attendanceStats.totalDays > 0
                ? Math.round((attendanceStats.byStatus.tardy / filteredRecords.length) * 100)
                : 0}
              %
            </div>
            <div className="text-muted-foreground">{attendanceStats.byStatus.tardy} total tardies</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">At-Risk Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{atRiskStudents.length}</div>
            <div className="text-muted-foreground">Under 85% attendance rate</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Daily Attendance Rate</CardTitle>
                <CardDescription>Attendance percentage over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={attendanceStats.dailyAverage}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="displayDate" padding={{ left: 10, right: 10 }} />
                      <YAxis domain={[0, 100]} />
                      <Tooltip
                        formatter={(value) => [`${value}%`, "Attendance Rate"]}
                        labelFormatter={(label) => `Date: ${label}`}
                      />
                      <Area
                        type="monotone"
                        dataKey="rate"
                        stroke="#10b981"
                        fill="#10b98180"
                        activeDot={{ r: 8 }}
                        name="Attendance Rate"
                      />
                      <Legend />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Attendance Breakdown</CardTitle>
                <CardDescription>Distribution by attendance status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: "Present", value: attendanceStats.byStatus.present, color: "#10b981" },
                          { name: "Absent", value: attendanceStats.byStatus.absent, color: "#ef4444" },
                          { name: "Tardy", value: attendanceStats.byStatus.tardy, color: "#f59e0b" },
                          { name: "Excused", value: attendanceStats.byStatus.excused, color: "#3b82f6" },
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {[0, 1, 2, 3].map((_, index) => (
                          <Cell key={`cell-${index}`} fill={["#10b981", "#ef4444", "#f59e0b", "#3b82f6"][index]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [value, "Count"]} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span>Present</span>
                    </div>
                    <span>{attendanceStats.byStatus.present} records</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <span>Absent</span>
                    </div>
                    <span>{attendanceStats.byStatus.absent} records</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <span>Tardy</span>
                    </div>
                    <span>{attendanceStats.byStatus.tardy} records</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      <span>Excused</span>
                    </div>
                    <span>{attendanceStats.byStatus.excused} records</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Attendance by Day of Week</CardTitle>
                <CardDescription>Identifying patterns in weekly attendance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={attendanceByDayOfWeek} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip formatter={(value) => [`${value}%`, "Attendance Rate"]} />
                      <Bar dataKey="presentRate" name="Attendance Rate" fill="#10b981" barSize={40} />
                      <Legend />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-4">
                  <h3 className="text-lg font-medium">Key Observations:</h3>
                  <ul className="list-disc pl-5 space-y-1 mt-2">
                    {attendanceByDayOfWeek.length > 0 && (
                      <>
                        <li>
                          {attendanceByDayOfWeek.sort((a, b) => b.presentRate - a.presentRate)[0].name} has the highest
                          attendance rate (
                          {attendanceByDayOfWeek.sort((a, b) => b.presentRate - a.presentRate)[0].presentRate}%)
                        </li>
                        <li>
                          {attendanceByDayOfWeek.sort((a, b) => a.presentRate - b.presentRate)[0].name} has the lowest
                          attendance rate (
                          {attendanceByDayOfWeek.sort((a, b) => a.presentRate - b.presentRate)[0].presentRate}%)
                        </li>
                      </>
                    )}
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>At-Risk Students</CardTitle>
                <CardDescription>Students with attendance concerns</CardDescription>
              </CardHeader>
              <CardContent>
                {atRiskStudents.length > 0 ? (
                  <div className="space-y-4">
                    {atRiskStudents.map((student) => {
                      const stats = attendanceStats.byStudent[student.id] || { rate: 0, absent: 0, tardy: 0 }
                      return (
                        <div key={student.id} className="flex items-center gap-4 p-3 rounded-lg border">
                          <div className="hidden sm:flex h-10 w-10 rounded-full bg-red-100 items-center justify-center text-red-600">
                            <AlertTriangle className="h-5 w-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium">{student.name}</h4>
                            <div className="text-sm text-muted-foreground flex flex-wrap gap-x-3">
                              <span>
                                Attendance:{" "}
                                <span className={getAttendanceRateColor(stats.rate)}>{Math.round(stats.rate)}%</span>
                              </span>
                              <span>Absences: {stats.absent}</span>
                              <span>Tardies: {stats.tardy}</span>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => setSelectedStudent(student.id)}>
                            Details
                          </Button>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    <HelpCircle className="h-10 w-10 mx-auto mb-2 opacity-50" />
                    <p>No at-risk students found in the selected time period</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Students Tab */}
        <TabsContent value="students">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <h3 className="text-lg font-medium">Student Attendance Summary</h3>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search students..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Attendance Rate</TableHead>
                      <TableHead>Present</TableHead>
                      <TableHead>Absent</TableHead>
                      <TableHead>Tardy</TableHead>
                      <TableHead>Excused</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.map((student) => {
                      const stats = attendanceStats.byStudent[student.id] || {
                        present: 0,
                        absent: 0,
                        tardy: 0,
                        excused: 0,
                        rate: 0,
                      }

                      return (
                        <TableRow key={student.id}>
                          <TableCell className="font-medium">{student.name}</TableCell>
                          <TableCell className={getAttendanceRateColor(stats.rate)}>
                            {Math.round(stats.rate)}%
                          </TableCell>
                          <TableCell>{stats.present}</TableCell>
                          <TableCell>{stats.absent}</TableCell>
                          <TableCell>{stats.tardy}</TableCell>
                          <TableCell>{stats.excused}</TableCell>
                          <TableCell>{getAttendanceBadge(stats.rate)}</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm" onClick={() => setSelectedStudent(student.id)}>
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {selectedStudent && (
              <Card className="mt-6">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div>
                    <CardTitle>{getStudentDetails(selectedStudent)?.name}</CardTitle>
                    <CardDescription>{getStudentDetails(selectedStudent)?.email}</CardDescription>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setSelectedStudent(null)}>
                    <XCircle className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-medium mb-4">Attendance Trend</h4>
                      <div className="h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart
                            data={getStudentTrend(selectedStudent)}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="weekLabel" />
                            <YAxis domain={[0, 100]} />
                            <Tooltip formatter={(value) => [`${value}%`, ""]} />
                            <Legend />
                            <Line
                              type="monotone"
                              dataKey="presentRate"
                              name="Attendance Rate"
                              stroke="#10b981"
                              activeDot={{ r: 8 }}
                            />
                            <Line type="monotone" dataKey="absentRate" name="Absent Rate" stroke="#ef4444" />
                            <Line type="monotone" dataKey="tardyRate" name="Tardy Rate" stroke="#f59e0b" />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium mb-4">Recent Attendance</h4>
                      <div className="space-y-3 max-h-[250px] overflow-y-auto pr-2">
                        {filteredRecords
                          .filter((record) => record.studentId === selectedStudent)
                          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                          .slice(0, 10)
                          .map((record) => (
                            <div key={record.id} className="flex items-center gap-3 p-2 rounded-md border">
                              <div className={cn("w-2 h-2 rounded-full", getStatusColor(record.status))}></div>
                              <div className="font-medium">{format(new Date(record.date), "EEEE, MMMM d")}</div>
                              <div className="flex-1 text-right text-sm">
                                <span className="capitalize">{record.status}</span>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                    <div className="p-3 border rounded-md">
                      <div className="text-sm text-muted-foreground">Present</div>
                      <div className="text-2xl font-bold text-green-600">
                        {attendanceStats.byStudent[selectedStudent]?.present || 0}
                      </div>
                    </div>
                    <div className="p-3 border rounded-md">
                      <div className="text-sm text-muted-foreground">Absent</div>
                      <div className="text-2xl font-bold text-red-600">
                        {attendanceStats.byStudent[selectedStudent]?.absent || 0}
                      </div>
                    </div>
                    <div className="p-3 border rounded-md">
                      <div className="text-sm text-muted-foreground">Tardy</div>
                      <div className="text-2xl font-bold text-yellow-600">
                        {attendanceStats.byStudent[selectedStudent]?.tardy || 0}
                      </div>
                    </div>
                    <div className="p-3 border rounded-md">
                      <div className="text-sm text-muted-foreground">Excused</div>
                      <div className="text-2xl font-bold text-blue-600">
                        {attendanceStats.byStudent[selectedStudent]?.excused || 0}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Trends Tab */}
        <TabsContent value="trends">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Attendance Trends</CardTitle>
                <CardDescription>Tracking attendance patterns over months</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      data={(() => {
                        // Calculate monthly data
                        const monthMap = new Map<
                          string,
                          { present: number; absent: number; tardy: number; excused: number; total: number }
                        >()

                        attendanceRecords.forEach((record) => {
                          const month = format(new Date(record.date), "yyyy-MM")

                          if (!monthMap.has(month)) {
                            monthMap.set(month, { present: 0, absent: 0, tardy: 0, excused: 0, total: 0 })
                          }

                          const stats = monthMap.get(month)!
                          stats.total++
                          stats[record.status]++
                        })

                        return Array.from(monthMap.entries())
                          .map(([month, stats]) => ({
                            month,
                            monthLabel: format(new Date(month + "-01"), "MMM yyyy"),
                            presentRate:
                              stats.total > 0
                                ? Math.round(((stats.present + stats.excused + stats.tardy * 0.5) / stats.total) * 100)
                                : 0,
                            absentRate: stats.total > 0 ? Math.round((stats.absent / stats.total) * 100) : 0,
                            tardyRate: stats.total > 0 ? Math.round((stats.tardy / stats.total) * 100) : 0,
                          }))
                          .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime())
                      })()}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="monthLabel" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip formatter={(value) => [`${value}%`, ""]} />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="presentRate"
                        name="Attendance Rate"
                        stroke="#10b981"
                        activeDot={{ r: 8 }}
                      />
                      <Line type="monotone" dataKey="absentRate" name="Absent Rate" stroke="#ef4444" />
                      <Line type="monotone" dataKey="tardyRate" name="Tardy Rate" stroke="#f59e0b" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Attendance Distribution</CardTitle>
                <CardDescription>Student performance clusters</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        {
                          range: "95-100%",
                          count: Object.values(attendanceStats.byStudent).filter((s) => s.rate >= 95).length,
                          color: "#10b981",
                        },
                        {
                          range: "90-94%",
                          count: Object.values(attendanceStats.byStudent).filter((s) => s.rate >= 90 && s.rate < 95)
                            .length,
                          color: "#34d399",
                        },
                        {
                          range: "85-89%",
                          count: Object.values(attendanceStats.byStudent).filter((s) => s.rate >= 85 && s.rate < 90)
                            .length,
                          color: "#f59e0b",
                        },
                        {
                          range: "80-84%",
                          count: Object.values(attendanceStats.byStudent).filter((s) => s.rate >= 80 && s.rate < 85)
                            .length,
                          color: "#fb923c",
                        },
                        {
                          range: "Below 80%",
                          count: Object.values(attendanceStats.byStudent).filter((s) => s.rate < 80).length,
                          color: "#ef4444",
                        },
                      ]}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="range" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" name="Number of Students">
                        {[0, 1, 2, 3, 4].map((index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={["#10b981", "#34d399", "#f59e0b", "#fb923c", "#ef4444"][index]}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-6">
                  <h4 className="text-lg font-medium mb-2">Key Insights:</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>
                      <span className="font-medium">
                        {Object.values(attendanceStats.byStudent).filter((s) => s.rate >= 95).length}
                      </span>{" "}
                      students have excellent attendance (95%+)
                    </li>
                    <li>
                      <span className="font-medium">
                        {Object.values(attendanceStats.byStudent).filter((s) => s.rate < 80).length}
                      </span>{" "}
                      students are at high risk (below 80%)
                    </li>
                    <li>
                      Most common attendance range:{" "}
                      <span className="font-medium">
                        {
                          ["95-100%", "90-94%", "85-89%", "80-84%", "Below 80%"][
                            [
                              Object.values(attendanceStats.byStudent).filter((s) => s.rate >= 95).length,
                              Object.values(attendanceStats.byStudent).filter((s) => s.rate >= 90 && s.rate < 95)
                                .length,
                              Object.values(attendanceStats.byStudent).filter((s) => s.rate >= 85 && s.rate < 90)
                                .length,
                              Object.values(attendanceStats.byStudent).filter((s) => s.rate >= 80 && s.rate < 85)
                                .length,
                              Object.values(attendanceStats.byStudent).filter((s) => s.rate < 80).length,
                            ].indexOf(
                              Math.max(
                                Object.values(attendanceStats.byStudent).filter((s) => s.rate >= 95).length,
                                Object.values(attendanceStats.byStudent).filter((s) => s.rate >= 90 && s.rate < 95)
                                  .length,
                                Object.values(attendanceStats.byStudent).filter((s) => s.rate >= 85 && s.rate < 90)
                                  .length,
                                Object.values(attendanceStats.byStudent).filter((s) => s.rate >= 80 && s.rate < 85)
                                  .length,
                                Object.values(attendanceStats.byStudent).filter((s) => s.rate < 80).length,
                              ),
                            )
                          ]
                        }
                      </span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Correlation Analysis</CardTitle>
              <CardDescription>Identifying attendance patterns and potential risk factors</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-medium mb-4">Day of Week Impact</h4>
                  <div className="flex items-center gap-2 mb-4">
                    <FileBarChart className="h-5 w-5 text-muted-foreground" />
                    <span className="text-muted-foreground">Showing absence rates by day of week</span>
                  </div>
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={attendanceByDayOfWeek.map((day) => ({
                          ...day,
                          absentRate: 100 - day.presentRate,
                        }))}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis domain={[0, 30]} />
                        <Tooltip formatter={(value) => [`${value}%`, "Absence Rate"]} />
                        <Bar dataKey="absentRate" name="Absence Rate" fill="#ef4444" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-medium mb-4">Attendance Correlations</h4>
                  <div className="space-y-4">
                    <div className="p-4 border rounded-md">
                      <div className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-blue-500" />
                        <span className="font-medium">Class Attendance Pattern</span>
                      </div>
                      <p className="mt-2 text-muted-foreground">
                        {attendanceByDayOfWeek.length > 0 && (
                          <>
                            {attendanceByDayOfWeek.sort((a, b) => a.presentRate - b.presentRate)[0].name} has the
                            highest absence rate, which suggests potential scheduling conflicts or student burnout on
                            this day.
                          </>
                        )}
                      </p>
                    </div>

                    <div className="p-4 border rounded-md">
                      <div className="flex items-center gap-2">
                        <TrendingDown className="h-5 w-5 text-red-500" />
                        <span className="font-medium">Chronic Absenteeism</span>
                      </div>
                      <p className="mt-2 text-muted-foreground">
                        {attendanceStats.byStudent && (
                          <>
                            {
                              Object.values(attendanceStats.byStudent).filter(
                                (s) => s.absent > attendanceStats.totalDays * 0.15,
                              ).length
                            }{" "}
                            students have missed more than 15% of school days, indicating chronic absenteeism.
                          </>
                        )}
                      </p>
                    </div>

                    <div className="p-4 border rounded-md">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-amber-500" />
                        <span className="font-medium">Recent Trends</span>
                      </div>
                      <p className="mt-2 text-muted-foreground">
                        {attendanceStats.dailyAverage.length > 0 && (
                          <>
                            The last 7 days show an average attendance rate of{" "}
                            {Math.round(
                              attendanceStats.dailyAverage.slice(-7).reduce((sum, day) => sum + day.rate, 0) /
                                Math.min(7, attendanceStats.dailyAverage.slice(-7).length),
                            )}
                            %, which is{" "}
                            {Math.round(
                              attendanceStats.dailyAverage.slice(-7).reduce((sum, day) => sum + day.rate, 0) /
                                Math.min(7, attendanceStats.dailyAverage.slice(-7).length),
                            ) > attendanceStats.presentRate
                              ? "higher"
                              : "lower"}{" "}
                            than the overall average.
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Calendar Tab */}
        <TabsContent value="calendar">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Calendar</CardTitle>
              <CardDescription>Daily attendance rates visualized</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2 text-center font-medium mb-2">
                <div>Mon</div>
                <div>Tue</div>
                <div>Wed</div>
                <div>Thu</div>
                <div>Fri</div>
                <div className="text-muted-foreground">Sat</div>
                <div className="text-muted-foreground">Sun</div>
              </div>

              <div className="grid grid-cols-7 gap-2">
                {(() => {
                  // Find earliest and latest dates
                  if (attendanceDays.length === 0) {
                    return (
                      <div className="col-span-7 py-20 text-center text-muted-foreground">
                        No attendance data available for selected period
                      </div>
                    )
                  }

                  // Sort days and find extents
                  const sortedDays = [...attendanceDays].sort((a, b) => a.date.getTime() - b.date.getTime())
                  const firstDate = sortedDays[0].date
                  const lastDate = sortedDays[sortedDays.length - 1].date

                  // Get start of first month and end of last month
                  const startMonth = new Date(firstDate.getFullYear(), firstDate.getMonth(), 1)
                  const endMonth = new Date(lastDate.getFullYear(), lastDate.getMonth() + 1, 0)

                  // Get day of week for start month (0 = Sunday, 1 = Monday)
                  const startDayOfWeek = startMonth.getDay()

                  // Adjust for Monday start (0 = Monday)
                  const adjustedStartDay = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1

                  // Create calendar grid
                  const days = []

                  // Add empty cells for days before start month
                  for (let i = 0; i < adjustedStartDay; i++) {
                    days.push(<div key={`empty-start-${i}`} className="h-16 bg-muted/20 rounded-md"></div>)
                  }

                  // Add all days in the range
                  const currentDate = new Date(startMonth)
                  while (currentDate <= endMonth) {
                    const dateStr = format(currentDate, "yyyy-MM-dd")
                    const dayData = attendanceDays.find((d) => format(d.date, "yyyy-MM-dd") === dateStr)

                    const isWeekendDay = isWeekend(currentDate)

                    if (isWeekendDay) {
                      days.push(
                        <div key={dateStr} className="h-16 bg-muted/20 rounded-md flex flex-col p-1">
                          <div className="text-muted-foreground text-xs">{format(currentDate, "d")}</div>
                        </div>,
                      )
                    } else if (dayData) {
                      let bgColor
                      if (dayData.presentRate >= 95) bgColor = "bg-green-100"
                      else if (dayData.presentRate >= 90) bgColor = "bg-green-50"
                      else if (dayData.presentRate >= 85) bgColor = "bg-yellow-50"
                      else if (dayData.presentRate >= 80) bgColor = "bg-orange-50"
                      else bgColor = "bg-red-50"

                      days.push(
                        <div key={dateStr} className={`h-16 rounded-md flex flex-col p-1 border ${bgColor}`}>
                          <div className="flex items-center justify-between">
                            <div className="text-xs font-medium">{format(currentDate, "d")}</div>
                            <div
                              className={`text-xs px-1 rounded-sm font-medium ${
                                dayData.presentRate >= 90
                                  ? "bg-green-200 text-green-800"
                                  : dayData.presentRate >= 85
                                    ? "bg-yellow-200 text-yellow-800"
                                    : "bg-red-200 text-red-800"
                              }`}
                            >
                              {dayData.presentRate}%
                            </div>
                          </div>
                          <div className="mt-1 flex-1 flex flex-col justify-end">
                            <div className="flex justify-around mt-auto text-[9px] font-medium">
                              <div className="flex flex-col items-center">
                                <div className="text-green-600">{dayData.present}</div>
                                <div className="text-[8px] text-muted-foreground">P</div>
                              </div>
                              <div className="flex flex-col items-center">
                                <div className="text-red-600">{dayData.absent}</div>
                                <div className="text-[8px] text-muted-foreground">A</div>
                              </div>
                              <div className="flex flex-col items-center">
                                <div className="text-yellow-600">{dayData.tardy}</div>
                                <div className="text-[8px] text-muted-foreground">T</div>
                              </div>
                            </div>
                          </div>
                        </div>,
                      )
                    } else {
                      days.push(
                        <div key={dateStr} className="h-16 bg-muted/20 rounded-md flex flex-col p-1">
                          <div className="text-muted-foreground text-xs">{format(currentDate, "d")}</div>
                        </div>,
                      )
                    }

                    currentDate.setDate(currentDate.getDate() + 1)
                  }

                  return days
                })()}
              </div>

              <div className="mt-6 flex items-center justify-between">
                <div className="text-sm">Legend:</div>
                <div className="flex gap-3 text-xs">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-sm bg-green-100"></div>
                    <span>95-100%</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-sm bg-green-50"></div>
                    <span>90-94%</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-sm bg-yellow-50"></div>
                    <span>85-89%</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-sm bg-orange-50"></div>
                    <span>80-84%</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-sm bg-red-50"></div>
                    <span>Below 80%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Attendance Patterns</CardTitle>
              <CardDescription>Identifying potential trends and issues</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="p-4 border rounded-lg">
                  <h4 className="text-lg font-medium mb-2">Class-Wide Observations</h4>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      Attendance tends to be lowest on{" "}
                      {attendanceByDayOfWeek.length > 0
                        ? attendanceByDayOfWeek.sort((a, b) => a.presentRate - b.presentRate)[0].name
                        : "Mondays"}
                    </li>
                    <li>
                      The class had {attendanceStats.dailyAverage.filter((day) => day.rate < 80).length} days with
                      concerning attendance rates (below 80%)
                    </li>
                    <li>
                      {attendanceStats.dailyAverage.length > 0 &&
                      attendanceStats.dailyAverage.slice(-7).reduce((sum, day) => sum + day.rate, 0) /
                        Math.min(7, attendanceStats.dailyAverage.slice(-7).length) >
                        attendanceStats.dailyAverage.slice(0, 7).reduce((sum, day) => sum + day.rate, 0) /
                          Math.min(7, attendanceStats.dailyAverage.slice(0, 7).length)
                        ? "Attendance has improved over the selected period"
                        : "Attendance has declined over the selected period"}
                    </li>
                  </ul>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="text-lg font-medium mb-2">Potential Interventions</h4>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      Schedule important assessments on{" "}
                      {attendanceByDayOfWeek.length > 0
                        ? attendanceByDayOfWeek.sort((a, b) => b.presentRate - a.presentRate)[0].name
                        : "Wednesdays"}{" "}
                      when attendance is highest
                    </li>
                    <li>
                      Implement attendance incentives for{" "}
                      {attendanceByDayOfWeek.length > 0
                        ? attendanceByDayOfWeek.sort((a, b) => a.presentRate - b.presentRate)[0].name
                        : "Mondays"}{" "}
                      to improve lowest attendance day
                    </li>
                    <li>
                      Consider attendance contracts for the{" "}
                      {Object.values(attendanceStats.byStudent).filter((s) => s.rate < 80).length} students with
                      attendance rates below 80%
                    </li>
                    <li>Contact parents of students with 3+ consecutive absences immediately</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
