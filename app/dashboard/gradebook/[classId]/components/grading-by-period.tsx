"use client"

import { useState, useEffect } from "react"
import { Save, Download, Upload, Filter, CheckCircle, AlertCircle, Clock, BarChart } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/components/ui/use-toast"
import type { Period, Task } from "@/types/gradebook-schemas"

// Demo data for the grading management component
const DEMO_PERIODS = [
  { id: "1", name: "Quarter 1", startDate: "2023-08-15", endDate: "2023-10-15", weight: 25 },
  { id: "2", name: "Quarter 2", startDate: "2023-10-16", endDate: "2023-12-20", weight: 25 },
  { id: "3", name: "Quarter 3", startDate: "2024-01-05", endDate: "2024-03-15", weight: 25 },
  { id: "4", name: "Quarter 4", startDate: "2024-03-16", endDate: "2024-05-30", weight: 25 },
]

const DEMO_TASKS = [
  {
    id: "task1",
    title: "Homework 1",
    categoryId: "cat1",
    periodId: "1",
    maxPoints: 20,
    dueDate: "2023-08-25",
    description: "Chapter 1 exercises",
  },
  {
    id: "task2",
    title: "Homework 2",
    categoryId: "cat1",
    periodId: "1",
    maxPoints: 20,
    dueDate: "2023-09-08",
    description: "Chapter 2 exercises",
  },
  {
    id: "task3",
    title: "Quiz 1",
    categoryId: "cat2",
    periodId: "1",
    maxPoints: 30,
    dueDate: "2023-09-15",
    description: "Chapters 1-2 quiz",
  },
  {
    id: "task4",
    title: "Test 1",
    categoryId: "cat3",
    periodId: "1",
    maxPoints: 100,
    dueDate: "2023-10-01",
    description: "Midterm exam",
  },
  {
    id: "task5",
    title: "Participation Q1",
    categoryId: "cat4",
    periodId: "1",
    maxPoints: 50,
    dueDate: "2023-10-15",
    description: "Quarter 1 participation",
  },

  {
    id: "task6",
    title: "Homework 3",
    categoryId: "cat1",
    periodId: "2",
    maxPoints: 20,
    dueDate: "2023-10-30",
    description: "Chapter 3 exercises",
  },
  {
    id: "task7",
    title: "Homework 4",
    categoryId: "cat1",
    periodId: "2",
    maxPoints: 20,
    dueDate: "2023-11-15",
    description: "Chapter 4 exercises",
  },
  {
    id: "task8",
    title: "Quiz 2",
    categoryId: "cat2",
    periodId: "2",
    maxPoints: 30,
    dueDate: "2023-11-22",
    description: "Chapters 3-4 quiz",
  },
  {
    id: "task9",
    title: "Test 2",
    categoryId: "cat3",
    periodId: "2",
    maxPoints: 100,
    dueDate: "2023-12-10",
    description: "Final exam",
  },
  {
    id: "task10",
    title: "Participation Q2",
    categoryId: "cat4",
    periodId: "2",
    maxPoints: 50,
    dueDate: "2023-12-20",
    description: "Quarter 2 participation",
  },
]

// Demo student data with more realistic information
const DEMO_STUDENTS = [
  {
    id: "s1",
    name: "Emma Johnson",
    studentId: "SID001",
    currentGrade: "A",
    percentage: 92,
    categories: {
      homework: { score: 45, total: 50 },
      quizzes: { score: 38, total: 40 },
      tests: { score: 85, total: 100 },
      participation: { score: 45, total: 50 },
    },
  },
  {
    id: "s2",
    name: "Noah Williams",
    studentId: "SID002",
    currentGrade: "B+",
    percentage: 88,
    categories: {
      homework: { score: 42, total: 50 },
      quizzes: { score: 35, total: 40 },
      tests: { score: 82, total: 100 },
      participation: { score: 42, total: 50 },
    },
  },
  {
    id: "s3",
    name: "Olivia Brown",
    studentId: "SID003",
    currentGrade: "B",
    percentage: 85,
    categories: {
      homework: { score: 40, total: 50 },
      quizzes: { score: 32, total: 40 },
      tests: { score: 80, total: 100 },
      participation: { score: 40, total: 50 },
    },
  },
  {
    id: "s4",
    name: "Liam Jones",
    studentId: "SID004",
    currentGrade: "A+",
    percentage: 95,
    categories: {
      homework: { score: 48, total: 50 },
      quizzes: { score: 39, total: 40 },
      tests: { score: 90, total: 100 },
      participation: { score: 48, total: 50 },
    },
  },
  {
    id: "s5",
    name: "Ava Garcia",
    studentId: "SID005",
    currentGrade: "C+",
    percentage: 78,
    categories: {
      homework: { score: 35, total: 50 },
      quizzes: { score: 30, total: 40 },
      tests: { score: 75, total: 100 },
      participation: { score: 35, total: 50 },
    },
  },
  {
    id: "s6",
    name: "William Miller",
    studentId: "SID006",
    currentGrade: "A-",
    percentage: 90,
    categories: {
      homework: { score: 45, total: 50 },
      quizzes: { score: 36, total: 40 },
      tests: { score: 88, total: 100 },
      participation: { score: 43, total: 50 },
    },
  },
  {
    id: "s7",
    name: "Sophia Davis",
    studentId: "SID007",
    currentGrade: "B-",
    percentage: 82,
    categories: {
      homework: { score: 38, total: 50 },
      quizzes: { score: 32, total: 40 },
      tests: { score: 78, total: 100 },
      participation: { score: 40, total: 50 },
    },
  },
  {
    id: "s8",
    name: "James Rodriguez",
    studentId: "SID008",
    currentGrade: "C",
    percentage: 75,
    categories: {
      homework: { score: 32, total: 50 },
      quizzes: { score: 28, total: 40 },
      tests: { score: 72, total: 100 },
      participation: { score: 35, total: 50 },
    },
  },
  {
    id: "s9",
    name: "Isabella Martinez",
    studentId: "SID009",
    currentGrade: "B+",
    percentage: 87,
    categories: {
      homework: { score: 42, total: 50 },
      quizzes: { score: 34, total: 40 },
      tests: { score: 84, total: 100 },
      participation: { score: 42, total: 50 },
    },
  },
  {
    id: "s10",
    name: "Benjamin Hernandez",
    studentId: "SID010",
    currentGrade: "A",
    percentage: 93,
    categories: {
      homework: { score: 46, total: 50 },
      quizzes: { score: 38, total: 40 },
      tests: { score: 88, total: 100 },
      participation: { score: 46, total: 50 },
    },
  },
]

// Generate demo scores for a specific task
const generateDemoScores = (taskId: string) => {
  const scores: Record<string, number> = {}
  const task = DEMO_TASKS.find((t) => t.id === taskId)
  if (!task) return scores

  DEMO_STUDENTS.forEach((student) => {
    // Skip some scores randomly to simulate incomplete data
    if (Math.random() > 0.1) {
      // 90% chance of having a score
      const maxScore = task.maxPoints
      // Generate a realistic score distribution
      let score
      const rand = Math.random()
      if (rand > 0.7) {
        // Top performers (30%)
        score = Math.round((0.85 + (rand - 0.7) * 0.5) * maxScore)
      } else if (rand > 0.3) {
        // Average performers (40%)
        score = Math.round((0.7 + (rand - 0.3) * 0.3) * maxScore)
      } else {
        // Struggling performers (30%)
        score = Math.round((0.5 + rand * 0.4) * maxScore)
      }

      scores[student.id] = score
    }
  })

  return scores
}

type GradingByPeriodProps = {
  classId: string
}

export function GradingByPeriod({ classId }: GradingByPeriodProps) {
  const [periods, setPeriods] = useState<Period[]>(DEMO_PERIODS)
  const [tasks, setTasks] = useState<Task[]>([])
  const [selectedPeriod, setSelectedPeriod] = useState<string>("")
  const [selectedTask, setSelectedTask] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [studentScores, setStudentScores] = useState<Record<string, number>>({})
  const [savingScores, setSavingScores] = useState(false)
  const [showStats, setShowStats] = useState(false)
  const [filterLowScores, setFilterLowScores] = useState(false)
  const [bulkEditMode, setBulkEditMode] = useState(false)
  const [selectedStudents, setSelectedStudents] = useState<string[]>([])

  const { toast } = useToast()

  // Initialize with demo data
  useEffect(() => {
    if (periods.length > 0 && !selectedPeriod) {
      setSelectedPeriod(periods[0].id)
    }
  }, [periods, selectedPeriod])

  // Update tasks when period changes
  useEffect(() => {
    if (selectedPeriod) {
      const filteredTasks = DEMO_TASKS.filter((task) => task.periodId === selectedPeriod)
      setTasks(filteredTasks)
      setSelectedTask("")
      setStudentScores({})
    }
  }, [selectedPeriod])

  // Filter tasks by selected period
  const filteredTasks = selectedPeriod ? tasks : []

  // Handle period change
  const handlePeriodChange = (periodId: string) => {
    setSelectedPeriod(periodId)
    setSelectedTask("") // Reset selected task when period changes
    setStudentScores({}) // Reset scores
    setSelectedStudents([]) // Reset selected students
  }

  // Handle task change
  const handleTaskChange = (taskId: string) => {
    setSelectedTask(taskId)
    // Generate demo scores for the selected task
    setStudentScores(generateDemoScores(taskId))
    setSelectedStudents([]) // Reset selected students
  }

  // Handle score change
  const handleScoreChange = (studentId: string, value: string) => {
    const score = Number.parseInt(value) || 0
    setStudentScores({
      ...studentScores,
      [studentId]: score,
    })
  }

  // Handle bulk score change
  const handleBulkScoreChange = (value: string) => {
    const score = Number.parseInt(value) || 0
    const newScores = { ...studentScores }

    selectedStudents.forEach((studentId) => {
      newScores[studentId] = score
    })

    setStudentScores(newScores)
  }

  // Handle save scores
  const handleSaveScores = async () => {
    try {
      setSavingScores(true)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Success",
        description: "Scores saved successfully",
      })
    } catch (error) {
      console.error("Error saving scores:", error)
      toast({
        title: "Error",
        description: "Failed to save scores. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSavingScores(false)
    }
  }

  // Get max points for the selected task
  const getMaxPoints = () => {
    const task = tasks.find((t) => t.id === selectedTask)
    return task ? task.maxPoints : 100
  }

  // Toggle student selection for bulk editing
  const toggleStudentSelection = (studentId: string) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId) ? prev.filter((id) => id !== studentId) : [...prev, studentId],
    )
  }

  // Select all students
  const selectAllStudents = () => {
    if (selectedStudents.length === DEMO_STUDENTS.length) {
      setSelectedStudents([])
    } else {
      setSelectedStudents(DEMO_STUDENTS.map((student) => student.id))
    }
  }

  // Calculate statistics for the current scores
  const calculateStats = () => {
    const scores = Object.values(studentScores)
    if (scores.length === 0) return { avg: 0, min: 0, max: 0, missing: DEMO_STUDENTS.length }

    const sum = scores.reduce((acc, score) => acc + score, 0)
    const avg = sum / scores.length
    const min = Math.min(...scores)
    const max = Math.max(...scores)
    const missing = DEMO_STUDENTS.length - scores.length

    return { avg, min, max, missing }
  }

  // Filter students based on current filters
  const filteredStudents = DEMO_STUDENTS.filter((student) => {
    if (filterLowScores) {
      const score = studentScores[student.id]
      if (score === undefined) return true // Include missing scores
      const maxPoints = getMaxPoints()
      return score / maxPoints < 0.7 // Show students with less than 70%
    }
    return true
  })

  // Get grade status indicator
  const getGradeStatus = (studentId: string) => {
    const score = studentScores[studentId]
    if (score === undefined) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Missing grade</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    }

    const maxPoints = getMaxPoints()
    const percentage = (score / maxPoints) * 100

    if (percentage >= 80) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Excellent: {percentage.toFixed(1)}%</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    } else if (percentage >= 60) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <CheckCircle className="h-4 w-4 text-yellow-500" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Satisfactory: {percentage.toFixed(1)}%</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    } else {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <AlertCircle className="h-4 w-4 text-red-500" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Needs improvement: {percentage.toFixed(1)}%</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    }
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold">Grading Management</h2>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Upload className="h-4 w-4" />
            <span>Import CSV</span>
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Download className="h-4 w-4" />
            <span>Export CSV</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
            onClick={() => setShowStats(!showStats)}
          >
            <BarChart className="h-4 w-4" />
            <span>{showStats ? "Hide Stats" : "Show Stats"}</span>
          </Button>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="period-select">Select Grading Period</Label>
          <Select value={selectedPeriod} onValueChange={handlePeriodChange}>
            <SelectTrigger id="period-select">
              <SelectValue placeholder="Select Period" />
            </SelectTrigger>
            <SelectContent>
              {periods.map((period) => (
                <SelectItem key={period.id} value={period.id || ""}>
                  {period.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="task-select">Select Task</Label>
          <Select value={selectedTask} onValueChange={handleTaskChange} disabled={!selectedPeriod}>
            <SelectTrigger id="task-select">
              <SelectValue placeholder={selectedPeriod ? "Select Task" : "Select a period first"} />
            </SelectTrigger>
            <SelectContent>
              {filteredTasks.map((task) => (
                <SelectItem key={task.id} value={task.id || ""}>
                  {task.title || task.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <Card>
          <CardContent className="p-6 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </CardContent>
        </Card>
      ) : selectedTask ? (
        <>
          {/* Task details card */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>{tasks.find((t) => t.id === selectedTask)?.title}</CardTitle>
              <CardDescription>
                Max Points: {getMaxPoints()} • Due Date:{" "}
                {new Date(tasks.find((t) => t.id === selectedTask)?.dueDate || "").toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            {showStats && (
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-muted rounded-lg p-3">
                    <div className="text-sm text-muted-foreground">Average Score</div>
                    <div className="text-2xl font-bold">{calculateStats().avg.toFixed(1)}</div>
                  </div>
                  <div className="bg-muted rounded-lg p-3">
                    <div className="text-sm text-muted-foreground">Highest Score</div>
                    <div className="text-2xl font-bold">{calculateStats().max}</div>
                  </div>
                  <div className="bg-muted rounded-lg p-3">
                    <div className="text-sm text-muted-foreground">Lowest Score</div>
                    <div className="text-2xl font-bold">{calculateStats().min}</div>
                  </div>
                  <div className="bg-muted rounded-lg p-3">
                    <div className="text-sm text-muted-foreground">Missing Grades</div>
                    <div className="text-2xl font-bold">{calculateStats().missing}</div>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Grading tools */}
          <div className="flex flex-wrap gap-2 mb-4">
            <Button
              variant={filterLowScores ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterLowScores(!filterLowScores)}
              className="flex items-center gap-1"
            >
              <Filter className="h-4 w-4" />
              {filterLowScores ? "Show All Students" : "Show Low Scores Only"}
            </Button>

            <Button
              variant={bulkEditMode ? "default" : "outline"}
              size="sm"
              onClick={() => setBulkEditMode(!bulkEditMode)}
              className="flex items-center gap-1"
            >
              {bulkEditMode ? "Exit Bulk Edit" : "Bulk Edit Mode"}
            </Button>

            {bulkEditMode && (
              <>
                <Button variant="outline" size="sm" onClick={selectAllStudents}>
                  {selectedStudents.length === DEMO_STUDENTS.length ? "Deselect All" : "Select All"}
                </Button>

                {selectedStudents.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min="0"
                      max={getMaxPoints()}
                      className="w-20 h-9"
                      placeholder="Score"
                      onChange={(e) => handleBulkScoreChange(e.target.value)}
                    />
                    <span className="text-sm text-muted-foreground">for {selectedStudents.length} selected</span>
                  </div>
                )}
              </>
            )}
          </div>

          <Tabs defaultValue="roster" className="mb-6">
            <TabsList>
              <TabsTrigger value="roster">Student Roster</TabsTrigger>
              <TabsTrigger value="summary">Grade Summary</TabsTrigger>
            </TabsList>
            <TabsContent value="roster" className="pt-4">
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    {bulkEditMode && (
                      <TableHead className="w-[50px]">
                        <Checkbox
                          checked={selectedStudents.length === DEMO_STUDENTS.length}
                          onCheckedChange={selectAllStudents}
                        />
                      </TableHead>
                    )}
                    <TableHead className="w-[100px]">ID</TableHead>
                    <TableHead>Student Name</TableHead>
                    <TableHead className="text-center">Current Grade</TableHead>
                    <TableHead className="text-center">Percentage</TableHead>
                    <TableHead className="text-center">Score (out of {getMaxPoints()})</TableHead>
                    <TableHead className="w-[80px] text-center">Status</TableHead>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.map((student) => (
                      <TableRow key={student.id}>
                        {bulkEditMode && (
                          <TableCell>
                            <Checkbox
                              checked={selectedStudents.includes(student.id)}
                              onCheckedChange={() => toggleStudentSelection(student.id)}
                            />
                          </TableCell>
                        )}
                        <TableCell className="font-medium">{student.studentId}</TableCell>
                        <TableCell>{student.name}</TableCell>
                        <TableCell className="text-center">
                          <Badge
                            variant={
                              student.currentGrade.startsWith("A")
                                ? "success"
                                : student.currentGrade.startsWith("B")
                                  ? "default"
                                  : student.currentGrade.startsWith("C")
                                    ? "warning"
                                    : "destructive"
                            }
                          >
                            {student.currentGrade}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">{student.percentage}%</TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="0"
                            max={getMaxPoints()}
                            className="w-20 mx-auto text-center"
                            value={studentScores[student.id] || ""}
                            onChange={(e) => handleScoreChange(student.id, e.target.value)}
                          />
                        </TableCell>
                        <TableCell className="text-center">{getGradeStatus(student.id)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            <TabsContent value="summary" className="pt-4">
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">ID</TableHead>
                      <TableHead>Student Name</TableHead>
                      <TableHead className="text-center">Homework</TableHead>
                      <TableHead className="text-center">Quizzes</TableHead>
                      <TableHead className="text-center">Tests</TableHead>
                      <TableHead className="text-center">Participation</TableHead>
                      <TableHead className="text-center">Total</TableHead>
                      <TableHead className="text-center">Grade</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {DEMO_STUDENTS.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">{student.studentId}</TableCell>
                        <TableCell>{student.name}</TableCell>
                        <TableCell className="text-center">
                          {student.categories.homework.score}/{student.categories.homework.total}
                        </TableCell>
                        <TableCell className="text-center">
                          {student.categories.quizzes.score}/{student.categories.quizzes.total}
                        </TableCell>
                        <TableCell className="text-center">
                          {student.categories.tests.score}/{student.categories.tests.total}
                        </TableCell>
                        <TableCell className="text-center">
                          {student.categories.participation.score}/{student.categories.participation.total}
                        </TableCell>
                        <TableCell className="text-center">{student.percentage}%</TableCell>
                        <TableCell className="text-center">
                          <Badge
                            variant={
                              student.currentGrade.startsWith("A")
                                ? "success"
                                : student.currentGrade.startsWith("B")
                                  ? "default"
                                  : student.currentGrade.startsWith("C")
                                    ? "warning"
                                    : "destructive"
                            }
                          >
                            {student.currentGrade}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end mt-6">
            <Button className="flex items-center gap-1" onClick={handleSaveScores} disabled={savingScores}>
              <Save className="h-4 w-4" />
              <span>{savingScores ? "Saving..." : "Save Scores"}</span>
            </Button>
          </div>
        </>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Grade Entry</CardTitle>
          </CardHeader>
          <CardContent className="p-6 text-center text-muted-foreground">
            {selectedPeriod ? "Please select a task to enter grades" : "Please select a grading period first"}
          </CardContent>
          {selectedPeriod && (
            <CardFooter className="flex justify-center border-t pt-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-3xl">
                {filteredTasks.slice(0, 4).map((task) => (
                  <Button
                    key={task.id}
                    variant="outline"
                    className="h-auto py-4 flex flex-col items-center text-center"
                    onClick={() => handleTaskChange(task.id)}
                  >
                    <div className="font-medium">{task.title}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {new Date(task.dueDate).toLocaleDateString()}
                    </div>
                    <div className="text-xs mt-2">{task.maxPoints} points</div>
                  </Button>
                ))}
              </div>
            </CardFooter>
          )}
        </Card>
      )}
    </div>
  )
}
