"use client"

import { useState, useEffect } from "react"
import { CheckCircle2, XCircle, Clock, Download, ChevronLeft, ChevronRight, AlertTriangle, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { format, addDays, subDays, isToday, isWeekend } from "date-fns"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"

// Types
type Student = {
  id: string
  name: string
  email?: string
}

type AttendanceStatus = "present" | "absent" | "tardy" | "excused"

type AttendanceRecord = {
  id?: string
  studentId: string
  date: string
  status: AttendanceStatus
  note?: string
}

type AttendanceTrackerProps = {
  classId: string
}

// Mock data for demo purposes
const generateMockStudents = (): Student[] => {
  return [
    { id: "STU001", name: "Alice Johnson", email: "alice@example.com" },
    { id: "STU002", name: "Bob Smith", email: "bob@example.com" },
    { id: "STU003", name: "Charlie Brown", email: "charlie@example.com" },
    { id: "STU004", name: "Diana Prince", email: "diana@example.com" },
    { id: "STU005", name: "Edward Cullen", email: "edward@example.com" },
    { id: "STU006", name: "Fiona Gallagher", email: "fiona@example.com" },
    { id: "STU007", name: "George Washington", email: "george@example.com" },
    { id: "STU008", name: "Hannah Montana", email: "hannah@example.com" },
    { id: "STU009", name: "Ian Malcolm", email: "ian@example.com" },
    { id: "STU010", name: "Julia Roberts", email: "julia@example.com" },
  ]
}

// Attendance status options
const attendanceOptions = [
  { value: "present", label: "Present", icon: CheckCircle2, color: "text-green-500" },
  { value: "absent", label: "Absent", icon: XCircle, color: "text-red-500" },
  { value: "tardy", label: "Tardy", icon: Clock, color: "text-amber-500" },
  { value: "excused", label: "Excused", icon: AlertTriangle, color: "text-blue-500" },
]

export function AttendanceTracker({ classId }: AttendanceTrackerProps) {
  const [date, setDate] = useState<Date>(new Date())
  const [students, setStudents] = useState<Student[]>([])
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [attendance, setAttendance] = useState<Record<string, AttendanceRecord>>({})
  const [notes, setNotes] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [sessionInfo, setSessionInfo] = useState({
    subject: "Mathematics 101",
    section: "Section A",
    schedule: "MWF 9:00 AM - 10:30 AM",
  })

  // Load students and existing attendance data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        // In a real app, we'd fetch from an API
        // const studentsResponse = await fetch(`/api/classes/${classId}/students`)
        // const studentsData = await studentsResponse.json()
        // setStudents(studentsData)

        // For demo, use mock data
        const mockStudents = generateMockStudents()
        setStudents(mockStudents)
        setFilteredStudents(mockStudents)

        // Load existing attendance for this date if any
        const dateString = format(date, "yyyy-MM-dd")
        // const attendanceResponse = await fetch(`/api/classes/${classId}/attendance?date=${dateString}`)
        // const attendanceData = await attendanceResponse.json()

        // For demo, generate some random attendance data
        const mockAttendance: Record<string, AttendanceRecord> = {}
        const mockNotes: Record<string, string> = {}

        // Only generate mock data for past dates
        if (date < new Date() && !isWeekend(date)) {
          mockStudents.forEach((student) => {
            const rand = Math.random()
            let status: AttendanceStatus = "present"

            if (rand < 0.1) status = "absent"
            else if (rand < 0.15) status = "tardy"
            else if (rand < 0.2) status = "excused"

            mockAttendance[student.id] = {
              studentId: student.id,
              date: dateString,
              status,
            }

            // Add notes for some students
            if (rand < 0.3) {
              mockNotes[student.id] =
                rand < 0.1 ? "Doctor's appointment" : rand < 0.2 ? "Family emergency" : "Called parent"
            }
          })
        }

        setAttendance(mockAttendance)
        setNotes(mockNotes)
      } catch (error) {
        console.error("Error loading data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [classId, date])

  // Filter students based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredStudents(students)
    } else {
      const query = searchQuery.toLowerCase()
      setFilteredStudents(
        students.filter(
          (student) =>
            student.name.toLowerCase().includes(query) ||
            (student.email && student.email.toLowerCase().includes(query)),
        ),
      )
    }
  }, [searchQuery, students])

  // Handle attendance change
  const handleAttendanceChange = (studentId: string, status: AttendanceStatus) => {
    setAttendance({
      ...attendance,
      [studentId]: {
        studentId,
        date: format(date, "yyyy-MM-dd"),
        status,
      },
    })
  }

  // Handle note change
  const handleNoteChange = (studentId: string, note: string) => {
    setNotes({
      ...notes,
      [studentId]: note,
    })
  }

  // Mark all students with the same status
  const markAll = (status: AttendanceStatus) => {
    const newAttendance: Record<string, AttendanceRecord> = {}
    filteredStudents.forEach((student) => {
      newAttendance[student.id] = {
        studentId: student.id,
        date: format(date, "yyyy-MM-dd"),
        status,
      }
    })
    setAttendance({ ...attendance, ...newAttendance })
  }

  // Navigate to previous day
  const goToPreviousDay = () => {
    setDate(subDays(date, 1))
  }

  // Navigate to next day
  const goToNextDay = () => {
    setDate(addDays(date, 1))
  }

  // Navigate to today
  const goToToday = () => {
    setDate(new Date())
  }

  // Save attendance
  const saveAttendance = async () => {
    setSaving(true)
    try {
      // In a real app, we'd post to an API
      // const attendanceRecords = Object.values(attendance).map(record => ({
      //   ...record,
      //   note: notes[record.studentId] || ""
      // }))
      // await fetch(`/api/classes/${classId}/attendance`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ records: attendanceRecords })
      // })

      // For demo, just simulate a delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Attendance saved",
        description: `Attendance for ${format(date, "MMMM d, yyyy")} has been saved successfully.`,
      })
    } catch (error) {
      console.error("Error saving attendance:", error)
      toast({
        title: "Error saving attendance",
        description: "There was a problem saving the attendance records.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  // Export attendance
  const exportAttendance = () => {
    // In a real app, we'd generate a CSV or Excel file
    toast({
      title: "Export started",
      description: "Your attendance report is being generated and will download shortly.",
    })
  }

  // Get status icon
  const getStatusIcon = (status: AttendanceStatus) => {
    const option = attendanceOptions.find((opt) => opt.value === status)
    if (!option) return null

    const Icon = option.icon
    return <Icon className={cn("h-4 w-4", option.color)} />
  }

  // Get status badge
  const getStatusBadge = (status: AttendanceStatus) => {
    switch (status) {
      case "present":
        return <Badge className="bg-green-500">Present</Badge>
      case "absent":
        return <Badge className="bg-red-500">Absent</Badge>
      case "tardy":
        return <Badge className="bg-amber-500">Tardy</Badge>
      case "excused":
        return <Badge className="bg-blue-500">Excused</Badge>
      default:
        return null
    }
  }

  // Check if the date is a school day
  const isSchoolDay = (date: Date) => {
    return !isWeekend(date)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold">Attendance Management</h2>
          <p className="text-muted-foreground">Record and manage daily attendance</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => markAll("present")}>
            Mark All Present
          </Button>
          <Button variant="outline" size="sm" onClick={() => markAll("absent")}>
            Mark All Absent
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={exportAttendance}>
            <Download className="h-4 w-4" />
            <span>Export Report</span>
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium">Date Selection</Label>
              <Button variant="outline" size="sm" onClick={goToToday} disabled={isToday(date)} className="h-8">
                Today
              </Button>
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="outline" size="icon" onClick={goToPreviousDay} aria-label="Previous day">
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "flex-1 justify-center text-center font-medium",
                      isToday(date) && "bg-primary/10 border-primary/20",
                      !isSchoolDay(date) && "bg-muted/20 text-muted-foreground",
                    )}
                  >
                    <div className="flex flex-col items-center">
                      <span className="text-sm text-muted-foreground">{format(date, "EEEE")}</span>
                      <span className="text-lg">{format(date, "MMMM d, yyyy")}</span>
                      {!isSchoolDay(date) && <span className="text-xs text-muted-foreground mt-1">Non-school day</span>}
                    </div>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="center">
                  <Calendar mode="single" selected={date} onSelect={(date) => date && setDate(date)} initialFocus />
                </PopoverContent>
              </Popover>

              <Button variant="outline" size="icon" onClick={goToNextDay} aria-label="Next day">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium">Class Session</div>
                <div className="text-sm text-muted-foreground">
                  {sessionInfo.subject} • {sessionInfo.section} • {sessionInfo.schedule}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {!isSchoolDay(date) ? (
        <Card>
          <CardContent className="p-6 text-center">
            <h3 className="text-xl font-medium mb-2">No Class Today</h3>
            <p className="text-muted-foreground mb-4">
              {format(date, "MMMM d, yyyy")} is a {format(date, "EEEE")}, which is not a scheduled school day.
            </p>
            <Button variant="outline" onClick={goToToday} disabled={isToday(date)}>
              Go to Today
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="flex items-center mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search students..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            <div className="ml-4">
              {Object.keys(attendance).length > 0 && (
                <div className="text-sm text-muted-foreground">
                  {Object.keys(attendance).length} of {students.length} students marked
                </div>
              )}
            </div>
          </div>

          <div className="rounded-md border overflow-hidden mb-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>Student Name</TableHead>
                  <TableHead className="w-[300px]">Attendance Status</TableHead>
                  <TableHead className="w-[250px]">Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  // Loading state
                  Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={`loading-${index}`}>
                      <TableCell>
                        <div className="h-5 w-16 bg-muted animate-pulse rounded"></div>
                      </TableCell>
                      <TableCell>
                        <div className="h-5 w-32 bg-muted animate-pulse rounded"></div>
                      </TableCell>
                      <TableCell>
                        <div className="h-5 w-48 bg-muted animate-pulse rounded"></div>
                      </TableCell>
                      <TableCell>
                        <div className="h-5 w-32 bg-muted animate-pulse rounded"></div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : filteredStudents.length === 0 ? (
                  // No results state
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      No students found.
                    </TableCell>
                  </TableRow>
                ) : (
                  // Actual data
                  filteredStudents.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">{student.id}</TableCell>
                      <TableCell>{student.name}</TableCell>
                      <TableCell>
                        <RadioGroup
                          className="flex space-x-4"
                          value={attendance[student.id]?.status || ""}
                          onValueChange={(value) => handleAttendanceChange(student.id, value as AttendanceStatus)}
                        >
                          {attendanceOptions.map((option) => (
                            <div key={option.value} className="flex items-center space-x-1">
                              <RadioGroupItem value={option.value} id={`${student.id}-${option.value}`} />
                              <Label
                                htmlFor={`${student.id}-${option.value}`}
                                className="flex items-center cursor-pointer"
                              >
                                <option.icon className={cn("h-4 w-4 mr-1", option.color)} />
                                <span>{option.label}</span>
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </TableCell>
                      <TableCell>
                        <Textarea
                          placeholder="Add notes..."
                          value={notes[student.id] || ""}
                          onChange={(e) => handleNoteChange(student.id, e.target.value)}
                          className="h-10 min-h-0 resize-none"
                        />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex justify-between items-center">
            <div>
              {Object.values(attendance).length > 0 && (
                <div className="flex gap-4">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-sm">
                      Present: {Object.values(attendance).filter((a) => a.status === "present").length}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span className="text-sm">
                      Absent: {Object.values(attendance).filter((a) => a.status === "absent").length}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                    <span className="text-sm">
                      Tardy: {Object.values(attendance).filter((a) => a.status === "tardy").length}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="text-sm">
                      Excused: {Object.values(attendance).filter((a) => a.status === "excused").length}
                    </span>
                  </div>
                </div>
              )}
            </div>
            <Button onClick={saveAttendance} disabled={saving}>
              {saving ? "Saving..." : "Save Attendance"}
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
