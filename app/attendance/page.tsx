"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { format, addDays, subDays } from "date-fns"
import { Calendar, CheckCircle, XCircle, Clock, ChevronLeft, ChevronRight, Download, Search } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getCurrentUser } from "@/lib/supabase/client"
import DashboardLayout from "@/components/dashboard-layout"

// Student type
type Student = {
  id: string
  name: string
  email: string
  imageUrl?: string
}

// Class type
type Class = {
  id: string
  name: string
  grade: string
  students: Student[]
}

// Attendance record type
type AttendanceRecord = {
  studentId: string
  status: "present" | "absent" | "tardy"
}

// Mock classes data
const mockClasses: Class[] = [
  {
    id: "class-1",
    name: "Mathematics 101",
    grade: "9th Grade",
    students: Array.from({ length: 12 }, (_, i) => ({
      id: `student-${i + 1}`,
      name: `Student ${i + 1}`,
      email: `student${i + 1}@example.com`,
    })),
  },
  {
    id: "class-2",
    name: "Science Lab",
    grade: "9th Grade",
    students: Array.from({ length: 15 }, (_, i) => ({
      id: `student-${i + 16}`,
      name: `Student ${i + 16}`,
      email: `student${i + 16}@example.com`,
    })),
  },
  {
    id: "class-3",
    name: "English Literature",
    grade: "10th Grade",
    students: Array.from({ length: 18 }, (_, i) => ({
      id: `student-${i + 31}`,
      name: `Student ${i + 31}`,
      email: `student${i + 31}@example.com`,
    })),
  },
]

export default function AttendancePage() {
  const [loading, setLoading] = useState(true)
  const [userData, setUserData] = useState<any>(null)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [selectedClass, setSelectedClass] = useState<string>("")
  const [attendance, setAttendance] = useState<Record<string, AttendanceRecord>>({})
  const [searchTerm, setSearchTerm] = useState("")
  const router = useRouter()

  // Function to handle changes in attendance status
  const handleAttendanceChange = (studentId: string, status: "present" | "absent" | "tardy") => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: {
        studentId,
        status,
      },
    }))
  }

  // Function to save attendance
  const saveAttendance = async () => {
    // In a real application, this would save to the database
    console.log("Saving attendance for", format(selectedDate, "yyyy-MM-dd"), "Class:", selectedClass)
    console.log("Attendance records:", attendance)

    // For demonstration purposes, we'll just show a success message
    alert("Attendance saved successfully!")
  }

  // Function to export attendance as CSV
  const exportAttendance = () => {
    const currentClass = mockClasses.find((c) => c.id === selectedClass)
    if (!currentClass) return

    const attendanceDate = format(selectedDate, "yyyy-MM-dd")

    // Create CSV header
    let csv = "Student ID,Student Name,Status,Date\n"

    // Add attendance records
    currentClass.students.forEach((student) => {
      const status = attendance[student.id]?.status || "absent"
      csv += `${student.id},${student.name},${status},${attendanceDate}\n`
    })

    // Create and trigger download
    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.setAttribute("hidden", "")
    a.setAttribute("href", url)
    a.setAttribute("download", `attendance-${selectedClass}-${attendanceDate}.csv`)
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  // Filter students based on search term
  const filteredStudents = selectedClass
    ? mockClasses
        .find((c) => c.id === selectedClass)
        ?.students.filter((student) => student.name.toLowerCase().includes(searchTerm.toLowerCase())) || []
    : []

  // Date navigation
  const goToPreviousDay = () => {
    setSelectedDate((prev) => subDays(prev, 1))
  }

  const goToNextDay = () => {
    setSelectedDate((prev) => addDays(prev, 1))
  }

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

        setUserData(user)

        // Select first class by default if available
        if (mockClasses.length > 0) {
          setSelectedClass(mockClasses[0].id)
        }

        // Initialize with random attendance data
        const initialAttendance: Record<string, AttendanceRecord> = {}
        const statuses: ("present" | "absent" | "tardy")[] = ["present", "present", "present", "absent", "tardy"]

        mockClasses.forEach((klass) => {
          klass.students.forEach((student) => {
            // Randomly select a status, with higher probability for 'present'
            const randomStatus = statuses[Math.floor(Math.random() * statuses.length)]
            initialAttendance[student.id] = {
              studentId: student.id,
              status: randomStatus,
            }
          })
        })

        setAttendance(initialAttendance)
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
          <p>Loading attendance management...</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Attendance Management</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Date Selection</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <Button variant="outline" size="icon" onClick={goToPreviousDay}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-indigo-600" />
                  <span className="font-medium">{format(selectedDate, "MMMM d, yyyy")}</span>
                </div>
                <Button variant="outline" size="icon" onClick={goToNextDay}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Class Selection</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a class" />
                </SelectTrigger>
                <SelectContent>
                  {mockClasses.map((klass) => (
                    <SelectItem key={klass.id} value={klass.id}>
                      {klass.name} ({klass.grade})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button className="flex-1" onClick={saveAttendance} disabled={!selectedClass}>
                  Save Attendance
                </Button>
                <Button
                  variant="outline"
                  className="flex items-center"
                  onClick={exportAttendance}
                  disabled={!selectedClass}
                >
                  <Download className="h-4 w-4 mr-1" />
                  Export
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {selectedClass ? (
          <Card>
            <CardHeader className="pb-4 border-b">
              <div className="flex items-center justify-between">
                <CardTitle>{mockClasses.find((c) => c.id === selectedClass)?.name} Attendance</CardTitle>
                <div className="flex items-center gap-4">
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-200 hover:text-green-900">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Present: {Object.values(attendance).filter((a) => a.status === "present").length}
                  </Badge>
                  <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 hover:text-yellow-900">
                    <Clock className="h-3 w-3 mr-1" />
                    Tardy: {Object.values(attendance).filter((a) => a.status === "tardy").length}
                  </Badge>
                  <Badge className="bg-red-100 text-red-800 hover:bg-red-200 hover:text-red-900">
                    <XCircle className="h-3 w-3 mr-1" />
                    Absent: {Object.values(attendance).filter((a) => a.status === "absent").length}
                  </Badge>
                </div>
              </div>

              <div className="mt-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search students..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {filteredStudents.map((student) => (
                  <div key={student.id} className="flex items-center justify-between p-4 hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                        {student.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium">{student.name}</div>
                        <div className="text-sm text-muted-foreground">{student.email}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`rounded-full ${attendance[student.id]?.status === "present" ? "bg-green-100 text-green-800 hover:bg-green-200" : ""}`}
                        onClick={() => handleAttendanceChange(student.id, "present")}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Present
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`rounded-full ${attendance[student.id]?.status === "tardy" ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200" : ""}`}
                        onClick={() => handleAttendanceChange(student.id, "tardy")}
                      >
                        <Clock className="h-4 w-4 mr-1" />
                        Tardy
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`rounded-full ${attendance[student.id]?.status === "absent" ? "bg-red-100 text-red-800 hover:bg-red-200" : ""}`}
                        onClick={() => handleAttendanceChange(student.id, "absent")}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Absent
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">Please select a class to take attendance.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
