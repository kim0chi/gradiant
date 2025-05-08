"use client"

import { useState, useEffect } from "react"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isWeekend } from "date-fns"
import { CalendarIcon, Check, X, Clock, AlertCircle } from "lucide-react"
import { createBrowserClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type Student = {
  id: string
  name: string
  email: string
}

type AttendanceRecord = {
  studentId: string
  date: string
  status: "present" | "absent" | "tardy" | "excused"
}

type AttendanceCalendarProps = {
  classId: string
  searchQuery: string
}

export function AttendanceCalendar({ classId, searchQuery }: AttendanceCalendarProps) {
  const supabase = createBrowserClient()
  const [students, setStudents] = useState<Student[]>([])
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date())
  const [view, setView] = useState<"calendar" | "list">("calendar")

  // Fetch data when classId changes
  useEffect(() => {
    async function fetchData() {
      setLoading(true)

      try {
        // In a real app, we would fetch this data from the server
        // For now, we'll simulate it with mock data
        await new Promise((resolve) => setTimeout(resolve, 500))

        // Mock students
        const mockStudents: Student[] = Array.from({ length: 10 }, (_, i) => ({
          id: `student-${i + 1}`,
          name: `Student ${i + 1}`,
          email: `student${i + 1}@example.com`,
        }))

        // Generate mock attendance records for the current month
        const start = startOfMonth(currentMonth)
        const end = endOfMonth(currentMonth)
        const days = eachDayOfInterval({ start, end })

        const mockAttendance: AttendanceRecord[] = []

        mockStudents.forEach((student) => {
          days.forEach((day) => {
            // Skip weekends
            if (isWeekend(day)) return

            // Randomly assign status
            const status =
              Math.random() > 0.9
                ? "absent"
                : Math.random() > 0.8
                  ? "tardy"
                  : Math.random() > 0.95
                    ? "excused"
                    : "present"

            mockAttendance.push({
              studentId: student.id,
              date: format(day, "yyyy-MM-dd"),
              status,
            })
          })
        })

        setStudents(mockStudents)
        setAttendanceRecords(mockAttendance)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    if (classId) {
      fetchData()
    }
  }, [classId, currentMonth])

  // Filter students based on search query
  const filteredStudents = students.filter(
    (student) =>
      !searchQuery ||
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Handle attendance status change
  const handleStatusChange = (studentId: string, status: "present" | "absent" | "tardy" | "excused") => {
    setAttendanceRecords((prev) =>
      prev.map((record) =>
        record.studentId === studentId && record.date === format(selectedDate, "yyyy-MM-dd")
          ? { ...record, status }
          : record,
      ),
    )

    // In a real app, we would also update the database
    // supabase.from('attendance').upsert({ student_id: studentId, date: format(selectedDate, "yyyy-MM-dd"), status })
  }

  // Handle bulk mark
  const handleBulkMark = (status: "present" | "absent" | "tardy" | "excused") => {
    setAttendanceRecords((prev) =>
      prev.map((record) => (record.date === format(selectedDate, "yyyy-MM-dd") ? { ...record, status } : record)),
    )

    // In a real app, we would also update the database
  }

  // Get attendance summary for a specific date
  const getAttendanceSummary = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd")
    const records = attendanceRecords.filter((r) => r.date === dateStr)

    if (records.length === 0) return null

    const present = records.filter((r) => r.status === "present").length
    const absent = records.filter((r) => r.status === "absent").length
    const tardy = records.filter((r) => r.status === "tardy").length
    const excused = records.filter((r) => r.status === "excused").length

    return { present, absent, tardy, excused, total: records.length }
  }

  // Get attendance status color
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

  // Get attendance icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "present":
        return <Check className="h-4 w-4 text-green-500" />
      case "absent":
        return <X className="h-4 w-4 text-red-500" />
      case "tardy":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "excused":
        return <AlertCircle className="h-4 w-4 text-blue-500" />
      default:
        return null
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-10 w-40" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <CardTitle>Attendance for {format(selectedDate, "MMMM d, yyyy")}</CardTitle>
        <div className="flex flex-wrap gap-2">
          <Tabs value={view} onValueChange={(v) => setView(v as "calendar" | "list")}>
            <TabsList>
              <TabsTrigger value="calendar">Calendar</TabsTrigger>
              <TabsTrigger value="list">List</TabsTrigger>
            </TabsList>
          </Tabs>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(selectedDate, "PPP")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                onMonthChange={setCurrentMonth}
                initialFocus
                modifiers={{
                  weekend: (date) => isWeekend(date),
                }}
                modifiersStyles={{
                  weekend: { color: "var(--muted-foreground)" },
                }}
                components={{
                  DayContent: (props) => {
                    const summary = getAttendanceSummary(props.date)
                    return (
                      <div className="relative">
                        <div>{props.date.getDate()}</div>
                        {summary && (
                          <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-0.5">
                            {summary.absent > 0 && <div className="h-1 w-1 rounded-full bg-red-500" />}
                            {summary.tardy > 0 && <div className="h-1 w-1 rounded-full bg-yellow-500" />}
                          </div>
                        )}
                      </div>
                    )
                  },
                }}
              />
            </PopoverContent>
          </Popover>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 mb-4">
          <Button variant="outline" onClick={() => handleBulkMark("present")}>
            <Check className="mr-2 h-4 w-4 text-green-500" />
            Mark All Present
          </Button>
          <Button variant="outline" onClick={() => handleBulkMark("absent")}>
            <X className="mr-2 h-4 w-4 text-red-500" />
            Mark All Absent
          </Button>
          <Button variant="outline" onClick={() => handleBulkMark("tardy")}>
            <Clock className="mr-2 h-4 w-4 text-yellow-500" />
            Mark All Tardy
          </Button>
          <Button variant="outline" onClick={() => handleBulkMark("excused")}>
            <AlertCircle className="mr-2 h-4 w-4 text-blue-500" />
            Mark All Excused
          </Button>
        </div>

        <TabsContent value="calendar" className="mt-0">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => {
                  const record = attendanceRecords.find(
                    (r) => r.studentId === student.id && r.date === format(selectedDate, "yyyy-MM-dd"),
                  )
                  const status = record?.status || "absent"

                  return (
                    <TableRow key={student.id}>
                      <TableCell>
                        <div className="font-medium">{student.name}</div>
                        <div className="text-sm text-muted-foreground">{student.email}</div>
                      </TableCell>
                      <TableCell>
                        <Badge className={cn(getStatusColor(status))}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className={cn("h-8 w-8", status === "present" && "bg-green-100 text-green-700")}
                            onClick={() => handleStatusChange(student.id, "present")}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className={cn("h-8 w-8", status === "absent" && "bg-red-100 text-red-700")}
                            onClick={() => handleStatusChange(student.id, "absent")}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className={cn("h-8 w-8", status === "tardy" && "bg-yellow-100 text-yellow-700")}
                            onClick={() => handleStatusChange(student.id, "tardy")}
                          >
                            <Clock className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className={cn("h-8 w-8", status === "excused" && "bg-blue-100 text-blue-700")}
                            onClick={() => handleStatusChange(student.id, "excused")}
                          >
                            <AlertCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="list" className="mt-0">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Present</TableHead>
                  <TableHead>Absent</TableHead>
                  <TableHead>Tardy</TableHead>
                  <TableHead>Excused</TableHead>
                  <TableHead>Rate</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => {
                  const studentRecords = attendanceRecords.filter((r) => r.studentId === student.id)
                  const present = studentRecords.filter((r) => r.status === "present").length
                  const absent = studentRecords.filter((r) => r.status === "absent").length
                  const tardy = studentRecords.filter((r) => r.status === "tardy").length
                  const excused = studentRecords.filter((r) => r.status === "excused").length
                  const total = studentRecords.length
                  const rate = total > 0 ? ((present + tardy + excused) / total) * 100 : 0

                  return (
                    <TableRow key={student.id}>
                      <TableCell>
                        <div className="font-medium">{student.name}</div>
                      </TableCell>
                      <TableCell>{present}</TableCell>
                      <TableCell>{absent}</TableCell>
                      <TableCell>{tardy}</TableCell>
                      <TableCell>{excused}</TableCell>
                      <TableCell>
                        <Badge variant={rate >= 90 ? "default" : rate >= 80 ? "outline" : "destructive"}>
                          {rate.toFixed(1)}%
                        </Badge>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </CardContent>
    </Card>
  )
}
