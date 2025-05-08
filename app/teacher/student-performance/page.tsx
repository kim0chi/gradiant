"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import DashboardLayout from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, Download, Filter, Plus, Search, Trash2, Edit, CheckCircle, XCircle, Clock } from "lucide-react"
import { getCurrentUser } from "@/lib/supabase/client"
import { getStudentPerformanceData } from "@/lib/student-performance-service"
import { getClassStudents, getClassTasks } from "@/lib/class-service"

export default function TeacherStudentPerformancePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const classId = searchParams.get("classId") || ""

  const [loading, setLoading] = useState(true)
  const [userData, setUserData] = useState<any>(null)
  const [students, setStudents] = useState<any[]>([])
  const [tasks, setTasks] = useState<any[]>([])
  const [selectedStudent, setSelectedStudent] = useState<string>("")
  const [studentData, setStudentData] = useState<any>(null)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [attendanceRecords, setAttendanceRecords] = useState<any[]>([])
  const [showAddTaskDialog, setShowAddTaskDialog] = useState(false)
  const [showEditGradeDialog, setShowEditGradeDialog] = useState(false)
  const [currentTask, setCurrentTask] = useState<any>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await getCurrentUser()
        if (!user) {
          router.push("/login")
          return
        }

        if (user.role !== "teacher" && user.role !== "admin") {
          router.push("/dashboard")
          return
        }

        setUserData(user)

        if (!classId) {
          router.push("/teacher/classes")
          return
        }

        // Fetch students in the class
        const classStudents = await getClassStudents(classId)
        setStudents(classStudents)

        // Fetch tasks for the class
        const classTasks = await getClassTasks(classId)
        setTasks(classTasks)

        // Set default selected student if available
        if (classStudents.length > 0) {
          setSelectedStudent(classStudents[0].id)
          const studentPerformanceData = await getStudentPerformanceData(classStudents[0].id)
          setStudentData(studentPerformanceData)
        }

        // Generate mock attendance records
        const mockAttendance = generateMockAttendanceRecords(classStudents)
        setAttendanceRecords(mockAttendance)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router, classId])

  const handleStudentChange = async (studentId: string) => {
    setSelectedStudent(studentId)
    try {
      const data = await getStudentPerformanceData(studentId)
      setStudentData(data)
    } catch (error) {
      console.error("Error fetching student data:", error)
    }
  }

  const handleAddTask = () => {
    // Implementation for adding a new task
    setShowAddTaskDialog(false)
  }

  const handleEditGrade = () => {
    // Implementation for editing a grade
    setShowEditGradeDialog(false)
  }

  const handleAttendanceChange = (studentId: string, status: string) => {
    // Implementation for changing attendance status
    setAttendanceRecords((prev) =>
      prev.map((record) =>
        record.studentId === studentId && format(record.date, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd")
          ? { ...record, status }
          : record,
      ),
    )
  }

  // Helper function to generate mock attendance records
  const generateMockAttendanceRecords = (students: any[]) => {
    const records: any[] = []
    const today = new Date()
    const startDate = new Date(today)
    startDate.setDate(today.getDate() - 30) // Last 30 days

    for (let d = new Date(startDate); d <= today; d.setDate(d.getDate() + 1)) {
      // Skip weekends
      if (d.getDay() === 0 || d.getDay() === 6) continue

      students.forEach((student) => {
        // Generate random status with bias towards "present"
        const rand = Math.random()
        let status = "present"
        if (rand > 0.9) status = "absent"
        else if (rand > 0.85) status = "tardy"
        else if (rand > 0.8) status = "excused"

        records.push({
          id: `${student.id}-${format(d, "yyyy-MM-dd")}`,
          studentId: student.id,
          date: new Date(d),
          status,
        })
      })
    }

    return records
  }

  // Mock data for tasks
  const mockTasks = [
    { id: "task-1", title: "Math Quiz 1", dueDate: "2023-05-10", category: "Quiz", maxPoints: 100 },
    { id: "task-2", title: "Science Lab Report", dueDate: "2023-05-15", category: "Assignment", maxPoints: 50 },
    { id: "task-3", title: "English Essay", dueDate: "2023-05-20", category: "Essay", maxPoints: 100 },
    { id: "task-4", title: "History Research Paper", dueDate: "2023-05-25", category: "Project", maxPoints: 200 },
    { id: "task-5", title: "Final Exam", dueDate: "2023-06-01", category: "Exam", maxPoints: 100 },
  ]

  // Mock data for grades
  const mockGrades = [
    { taskId: "task-1", studentId: "student-1", score: 85, feedback: "Good work" },
    { taskId: "task-2", studentId: "student-1", score: 42, feedback: "Needs improvement" },
    { taskId: "task-3", studentId: "student-1", score: null, feedback: "" },
    { taskId: "task-4", studentId: "student-1", score: null, feedback: "" },
    { taskId: "task-5", studentId: "student-1", score: null, feedback: "" },
  ]

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <p>Loading student performance data...</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-2xl font-bold">Student Performance Management</h1>
          <div className="flex items-center gap-2">
            <Select value={selectedStudent} onValueChange={handleStudentChange}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select a student" />
              </SelectTrigger>
              <SelectContent>
                {students.map((student) => (
                  <SelectItem key={student.id} value={student.id}>
                    {student.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {selectedStudent && studentData && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Overall Grade</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{studentData.grades.overall}%</div>
                <div className="text-sm text-muted-foreground">
                  Letter Grade:{" "}
                  {studentData.grades.overall >= 90
                    ? "A"
                    : studentData.grades.overall >= 80
                      ? "B"
                      : studentData.grades.overall >= 70
                        ? "C"
                        : studentData.grades.overall >= 60
                          ? "D"
                          : "F"}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Task Completion</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {studentData.tasks.completed}/{studentData.tasks.total}
                </div>
                <div className="text-sm text-muted-foreground">
                  {Math.round((studentData.tasks.completed / studentData.tasks.total) * 100)}% completion rate
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Attendance Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{studentData.attendance.rate}%</div>
                <div className="text-sm text-muted-foreground">
                  {studentData.attendance.present} present, {studentData.attendance.absent} absent,{" "}
                  {studentData.attendance.tardy} tardy
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <Tabs defaultValue="grades" className="space-y-4">
          <TabsList>
            <TabsTrigger value="grades">Grades</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
          </TabsList>

          {/* Grades Tab */}
          <TabsContent value="grades" className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Search tasks..." className="pl-8 w-[250px]" />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Task</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Max Points</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Percentage</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockTasks.map((task) => {
                      const grade = mockGrades.find((g) => g.taskId === task.id && g.studentId === selectedStudent)
                      return (
                        <TableRow key={task.id}>
                          <TableCell className="font-medium">{task.title}</TableCell>
                          <TableCell>{task.category}</TableCell>
                          <TableCell>{format(new Date(task.dueDate), "MMM d, yyyy")}</TableCell>
                          <TableCell>{task.maxPoints}</TableCell>
                          <TableCell>{grade?.score !== null ? grade?.score : "-"}</TableCell>
                          <TableCell>
                            {grade?.score !== null ? `${Math.round((grade.score / task.maxPoints) * 100)}%` : "-"}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setCurrentTask(task)
                                setShowEditGradeDialog(true)
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Edit Grade Dialog */}
            <Dialog open={showEditGradeDialog} onOpenChange={setShowEditGradeDialog}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Grade</DialogTitle>
                  <DialogDescription>Update the grade for {currentTask?.title}</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="score" className="text-right">
                      Score
                    </Label>
                    <Input
                      id="score"
                      type="number"
                      min="0"
                      max={currentTask?.maxPoints}
                      className="col-span-3"
                      placeholder={`Out of ${currentTask?.maxPoints}`}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="feedback" className="text-right">
                      Feedback
                    </Label>
                    <Input id="feedback" className="col-span-3" placeholder="Optional feedback" />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowEditGradeDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleEditGrade}>Save Changes</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </TabsContent>

          {/* Tasks Tab */}
          <TabsContent value="tasks" className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Search tasks..." className="pl-8 w-[250px]" />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Button onClick={() => setShowAddTaskDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Task
                </Button>
              </div>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Task</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Max Points</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockTasks.map((task) => (
                      <TableRow key={task.id}>
                        <TableCell className="font-medium">{task.title}</TableCell>
                        <TableCell>{task.category}</TableCell>
                        <TableCell>{format(new Date(task.dueDate), "MMM d, yyyy")}</TableCell>
                        <TableCell>{task.maxPoints}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {new Date(task.dueDate) < new Date() ? "Past Due" : "Upcoming"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Add Task Dialog */}
            <Dialog open={showAddTaskDialog} onOpenChange={setShowAddTaskDialog}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Task</DialogTitle>
                  <DialogDescription>Create a new task for your class</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="title" className="text-right">
                      Title
                    </Label>
                    <Input id="title" className="col-span-3" placeholder="Task title" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="category" className="text-right">
                      Category
                    </Label>
                    <Select>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="assignment">Assignment</SelectItem>
                        <SelectItem value="quiz">Quiz</SelectItem>
                        <SelectItem value="test">Test</SelectItem>
                        <SelectItem value="project">Project</SelectItem>
                        <SelectItem value="exam">Exam</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="dueDate" className="text-right">
                      Due Date
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="col-span-3 justify-start text-left font-normal">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {selectedDate ? format(selectedDate, "PPP") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={(date) => date && setSelectedDate(date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="maxPoints" className="text-right">
                      Max Points
                    </Label>
                    <Input id="maxPoints" type="number" min="1" className="col-span-3" placeholder="Maximum points" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right">
                      Description
                    </Label>
                    <Input id="description" className="col-span-3" placeholder="Task description" />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowAddTaskDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddTask}>Add Task</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </TabsContent>

          {/* Attendance Tab */}
          <TabsContent value="attendance" className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(selectedDate, "PPP")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => date && setSelectedDate(date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.map((student) => {
                      const record = attendanceRecords.find(
                        (r) =>
                          r.studentId === student.id &&
                          format(r.date, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd"),
                      )

                      return (
                        <TableRow key={student.id}>
                          <TableCell className="font-medium">{student.name}</TableCell>
                          <TableCell>
                            <Select
                              value={record?.status || "present"}
                              onValueChange={(value) => handleAttendanceChange(student.id, value)}
                            >
                              <SelectTrigger className="w-[150px]">
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="present">
                                  <div className="flex items-center">
                                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                                    Present
                                  </div>
                                </SelectItem>
                                <SelectItem value="absent">
                                  <div className="flex items-center">
                                    <XCircle className="h-4 w-4 mr-2 text-red-500" />
                                    Absent
                                  </div>
                                </SelectItem>
                                <SelectItem value="tardy">
                                  <div className="flex items-center">
                                    <Clock className="h-4 w-4 mr-2 text-yellow-500" />
                                    Tardy
                                  </div>
                                </SelectItem>
                                <SelectItem value="excused">
                                  <div className="flex items-center">
                                    <CheckCircle className="h-4 w-4 mr-2 text-blue-500" />
                                    Excused
                                  </div>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
