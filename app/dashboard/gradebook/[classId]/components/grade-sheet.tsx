"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/components/ui/use-toast"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { Info, Save, CheckCircle2, AlertCircle, Clock, ChevronDown, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Period, Task, Student, Grade } from "@/types/gradebook-schemas"
import { GradeSummary } from "./grade-summary"

// Form schema for period selection
const periodFormSchema = z.object({
  periodId: z.string().min(1, "Please select a grading period"),
})

type PeriodFormValues = z.infer<typeof periodFormSchema>

// Fetcher function for SWR
const fetcher = (url: string) => fetch(url).then((res) => res.json())

// Demo data for the grade sheet
const DEMO_PERIODS = [
  { id: "1", name: "Quarter 1", startDate: "2023-08-15", endDate: "2023-10-15", weight: 25 },
  { id: "2", name: "Quarter 2", startDate: "2023-10-16", endDate: "2023-12-20", weight: 25 },
  { id: "3", name: "Quarter 3", startDate: "2024-01-05", endDate: "2024-03-15", weight: 25 },
  { id: "4", name: "Quarter 4", startDate: "2024-03-16", endDate: "2024-05-30", weight: 25 },
]

// Updated categories to include attendance and ensure weights total 100%
const DEMO_CATEGORIES = [
  { id: "cat1", name: "Homework", weight: 20 },
  { id: "cat2", name: "Quizzes", weight: 15 },
  { id: "cat3", name: "Tests", weight: 30 },
  { id: "cat4", name: "Projects", weight: 20 },
  { id: "cat5", name: "Attendance", weight: 15 },
]

// Updated tasks to include attendance tasks
const DEMO_TASKS = [
  // Quarter 1 Tasks
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
    title: "Project 1",
    categoryId: "cat4",
    periodId: "1",
    maxPoints: 50,
    dueDate: "2023-10-10",
    description: "Research project",
  },
  {
    id: "task6",
    title: "Attendance Q1",
    categoryId: "cat5",
    periodId: "1",
    maxPoints: 50,
    dueDate: "2023-10-15",
    description: "Quarter 1 attendance",
  },

  // Quarter 2 Tasks
  {
    id: "task7",
    title: "Homework 3",
    categoryId: "cat1",
    periodId: "2",
    maxPoints: 20,
    dueDate: "2023-10-30",
    description: "Chapter 3 exercises",
  },
  {
    id: "task8",
    title: "Homework 4",
    categoryId: "cat1",
    periodId: "2",
    maxPoints: 20,
    dueDate: "2023-11-15",
    description: "Chapter 4 exercises",
  },
  {
    id: "task9",
    title: "Quiz 2",
    categoryId: "cat2",
    periodId: "2",
    maxPoints: 30,
    dueDate: "2023-11-22",
    description: "Chapters 3-4 quiz",
  },
  {
    id: "task10",
    title: "Test 2",
    categoryId: "cat3",
    periodId: "2",
    maxPoints: 100,
    dueDate: "2023-12-10",
    description: "Final exam",
  },
  {
    id: "task11",
    title: "Project 2",
    categoryId: "cat4",
    periodId: "2",
    maxPoints: 50,
    dueDate: "2023-12-15",
    description: "Group project",
  },
  {
    id: "task12",
    title: "Attendance Q2",
    categoryId: "cat5",
    periodId: "2",
    maxPoints: 50,
    dueDate: "2023-12-20",
    description: "Quarter 2 attendance",
  },

  // Quarter 3 Tasks
  {
    id: "task13",
    title: "Homework 5",
    categoryId: "cat1",
    periodId: "3",
    maxPoints: 20,
    dueDate: "2024-01-20",
    description: "Chapter 5 exercises",
  },
  {
    id: "task14",
    title: "Homework 6",
    categoryId: "cat1",
    periodId: "3",
    maxPoints: 20,
    dueDate: "2024-02-05",
    description: "Chapter 6 exercises",
  },
  {
    id: "task15",
    title: "Quiz 3",
    categoryId: "cat2",
    periodId: "3",
    maxPoints: 30,
    dueDate: "2024-02-15",
    description: "Chapters 5-6 quiz",
  },
  {
    id: "task16",
    title: "Test 3",
    categoryId: "cat3",
    periodId: "3",
    maxPoints: 100,
    dueDate: "2024-03-01",
    description: "Midterm exam",
  },
  {
    id: "task17",
    title: "Project 3",
    categoryId: "cat4",
    periodId: "3",
    maxPoints: 50,
    dueDate: "2024-03-10",
    description: "Individual project",
  },
  {
    id: "task18",
    title: "Attendance Q3",
    categoryId: "cat5",
    periodId: "3",
    maxPoints: 50,
    dueDate: "2024-03-15",
    description: "Quarter 3 attendance",
  },

  // Quarter 4 Tasks
  {
    id: "task19",
    title: "Homework 7",
    categoryId: "cat1",
    periodId: "4",
    maxPoints: 20,
    dueDate: "2024-04-05",
    description: "Chapter 7 exercises",
  },
  {
    id: "task20",
    title: "Homework 8",
    categoryId: "cat1",
    periodId: "4",
    maxPoints: 20,
    dueDate: "2024-04-20",
    description: "Chapter 8 exercises",
  },
  {
    id: "task21",
    title: "Quiz 4",
    categoryId: "cat2",
    periodId: "4",
    maxPoints: 30,
    dueDate: "2024-05-01",
    description: "Chapters 7-8 quiz",
  },
  {
    id: "task22",
    title: "Test 4",
    categoryId: "cat3",
    periodId: "4",
    maxPoints: 100,
    dueDate: "2024-05-15",
    description: "Final exam",
  },
  {
    id: "task23",
    title: "Project 4",
    categoryId: "cat4",
    periodId: "4",
    maxPoints: 50,
    dueDate: "2024-05-20",
    description: "Final project",
  },
  {
    id: "task24",
    title: "Attendance Q4",
    categoryId: "cat5",
    periodId: "4",
    maxPoints: 50,
    dueDate: "2024-05-30",
    description: "Quarter 4 attendance",
  },
]

const DEMO_STUDENTS = [
  { id: "s1", firstName: "Emma", lastName: "Johnson", studentId: "SID001" },
  { id: "s2", firstName: "Noah", lastName: "Williams", studentId: "SID002" },
  { id: "s3", firstName: "Olivia", lastName: "Brown", studentId: "SID003" },
  { id: "s4", firstName: "Liam", lastName: "Jones", studentId: "SID004" },
  { id: "s5", firstName: "Ava", lastName: "Garcia", studentId: "SID005" },
  { id: "s6", firstName: "William", lastName: "Miller", studentId: "SID006" },
  { id: "s7", firstName: "Sophia", lastName: "Davis", studentId: "SID007" },
  { id: "s8", firstName: "James", lastName: "Rodriguez", studentId: "SID008" },
  { id: "s9", firstName: "Isabella", lastName: "Martinez", studentId: "SID009" },
  { id: "s10", firstName: "Benjamin", lastName: "Hernandez", studentId: "SID010" },
]

// Generate demo grades with different distributions for different periods
const generateDemoGrades = () => {
  const grades = []

  DEMO_STUDENTS.forEach((student) => {
    DEMO_TASKS.forEach((task) => {
      // Skip some grades randomly to simulate incomplete data
      if (Math.random() > 0.1) {
        // 90% chance of having a grade
        const maxScore = task.maxPoints
        let score

        // Different grade distributions for different periods
        const periodId = task.periodId
        const rand = Math.random()

        if (periodId === "1") {
          // Quarter 1: Lower scores as students are just starting
          if (rand > 0.7) {
            // Top performers (30%)
            score = Math.round((0.75 + (rand - 0.7) * 0.5) * maxScore)
          } else if (rand > 0.3) {
            // Average performers (40%)
            score = Math.round((0.65 + (rand - 0.3) * 0.2) * maxScore)
          } else {
            // Struggling performers (30%)
            score = Math.round((0.5 + rand * 0.3) * maxScore)
          }
        } else if (periodId === "2") {
          // Quarter 2: Slight improvement
          if (rand > 0.7) {
            score = Math.round((0.8 + (rand - 0.7) * 0.5) * maxScore)
          } else if (rand > 0.3) {
            score = Math.round((0.7 + (rand - 0.3) * 0.2) * maxScore)
          } else {
            score = Math.round((0.55 + rand * 0.3) * maxScore)
          }
        } else if (periodId === "3") {
          // Quarter 3: More improvement
          if (rand > 0.7) {
            score = Math.round((0.85 + (rand - 0.7) * 0.5) * maxScore)
          } else if (rand > 0.3) {
            score = Math.round((0.75 + (rand - 0.3) * 0.2) * maxScore)
          } else {
            score = Math.round((0.6 + rand * 0.3) * maxScore)
          }
        } else {
          // Quarter 4: Best performance
          if (rand > 0.7) {
            score = Math.round((0.9 + (rand - 0.7) * 0.5) * maxScore)
          } else if (rand > 0.3) {
            score = Math.round((0.8 + (rand - 0.3) * 0.2) * maxScore)
          } else {
            score = Math.round((0.65 + rand * 0.3) * maxScore)
          }
        }

        grades.push({
          id: `grade-${student.id}-${task.id}`,
          studentId: student.id,
          taskId: task.id,
          score: score,
          maxPoints: task.maxPoints,
          submitted: true,
          gradedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(), // Random date within the last week
        })
      }
    })
  })

  return grades
}

const DEMO_GRADES = generateDemoGrades()

export function GradeSheet({ classId }: { classId: string }) {
  // State for tracking form values and UI state
  const [selectedPeriod, setSelectedPeriod] = useState<string>("")
  const [grades, setGrades] = useState<Record<string, Record<string, number>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [expandedCategories, setExpandedCategories] = useState<string[]>([])
  const [showStats, setShowStats] = useState(false)
  const [collapsedCategories, setCollapsedCategories] = useState<string[]>([])

  // Form setup
  const form = useForm<PeriodFormValues>({
    resolver: zodResolver(periodFormSchema),
    defaultValues: {
      periodId: "",
    },
  })

  // In a real app, these would be fetched from an API
  // For demo purposes, we're using the demo data directly
  const periodsData = { periods: DEMO_PERIODS }
  const periodsLoading = false
  const periodsError = null

  const tasksData = {
    tasks: selectedPeriod ? DEMO_TASKS.filter((task) => task.periodId === selectedPeriod) : [],
    categories: DEMO_CATEGORIES,
  }
  const tasksLoading = false
  const tasksError = null

  const studentsData = { students: DEMO_STUDENTS }
  const studentsLoading = false
  const studentsError = null

  const gradesData = {
    grades: selectedPeriod
      ? DEMO_GRADES.filter((grade) => {
          const task = DEMO_TASKS.find((t) => t.id === grade.taskId)
          return task && task.periodId === selectedPeriod
        })
      : [],
  }
  const gradesLoading = false
  const gradesError = null
  const mutateGrades = async () => {
    // In a real app, this would refetch the grades
    // For demo purposes, we're just returning a resolved promise
    return Promise.resolve()
  }

  // Set default period when data is loaded
  useEffect(() => {
    if (periodsData?.periods?.length && !selectedPeriod) {
      const firstPeriod = periodsData.periods[0]
      setSelectedPeriod(firstPeriod.id)
      form.setValue("periodId", firstPeriod.id)
    }
  }, [selectedPeriod, form, periodsData?.periods])

  // Process grades data when loaded
  useEffect(() => {
    if (gradesData?.grades) {
      const gradeMap: Record<string, Record<string, number>> = {}

      gradesData.grades.forEach((grade: Grade) => {
        if (!gradeMap[grade.studentId]) {
          gradeMap[grade.studentId] = {}
        }
        gradeMap[grade.studentId][grade.taskId] = grade.score
      })

      setGrades(gradeMap)
    }
  }, [gradesData?.grades])

  // Handle period selection change
  const handlePeriodChange = (value: string) => {
    setSelectedPeriod(value)
    form.setValue("periodId", value)
  }

  // Handle grade input change
  const handleGradeChange = (studentId: string, taskId: string, value: string) => {
    const numValue = Number.parseFloat(value)

    setGrades((prev) => {
      const newGrades = { ...prev }
      if (!newGrades[studentId]) {
        newGrades[studentId] = {}
      }
      newGrades[studentId][taskId] = isNaN(numValue) ? 0 : numValue
      return newGrades
    })
  }

  // Handle form submission
  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      // Convert grades to array format for API
      const gradesArray = Object.entries(grades).flatMap(([studentId, tasks]) =>
        Object.entries(tasks).map(([taskId, score]) => ({
          studentId,
          taskId,
          score,
        })),
      )

      // In a real app, this would be an API call
      // For demo purposes, we're just simulating a delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      await mutateGrades()

      toast({
        title: "Success",
        description: "Grades saved successfully",
      })
    } catch (error) {
      console.error("Error saving grades:", error)
      toast({
        title: "Error",
        description: "Failed to save grades. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Toggle category expansion for mobile view
  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId],
    )
  }

  // Toggle category collapse for desktop view
  const toggleCategoryCollapse = (categoryId: string) => {
    setCollapsedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId],
    )
  }

  // Group tasks by category
  const getTasksByCategory = () => {
    if (!tasksData?.tasks) return {}

    return tasksData.tasks.reduce((acc: Record<string, Task[]>, task: Task) => {
      if (!acc[task.categoryId]) {
        acc[task.categoryId] = []
      }
      acc[task.categoryId].push(task)
      return acc
    }, {})
  }

  // Get category name by ID
  const getCategoryName = (categoryId: string) => {
    if (!tasksData?.categories) return "Unknown Category"
    const category = tasksData.categories.find((cat: any) => cat.id === categoryId)
    return category ? category.name : "Unknown Category"
  }

  // Get category weight by ID
  const getCategoryWeight = (categoryId: string) => {
    if (!tasksData?.categories) return 0
    const category = tasksData.categories.find((cat: any) => cat.id === categoryId)
    return category ? category.weight : 0
  }

  // Calculate statistics for a task
  const calculateTaskStats = (taskId: string) => {
    const scores = Object.values(grades)
      .map((studentGrades) => studentGrades[taskId])
      .filter((score) => score !== undefined)

    if (scores.length === 0) return { avg: 0, min: 0, max: 0, missing: DEMO_STUDENTS.length }

    const sum = scores.reduce((acc, score) => acc + score, 0)
    const avg = sum / scores.length
    const min = Math.min(...scores)
    const max = Math.max(...scores)
    const missing = DEMO_STUDENTS.length - scores.length

    return { avg, min, max, missing }
  }

  // Get grade status indicator
  const getGradeStatus = (studentId: string, taskId: string) => {
    const task = DEMO_TASKS.find((t) => t.id === taskId)
    if (!task) return null

    const grade = grades[studentId]?.[taskId]
    if (grade === undefined) {
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

    const percentage = (grade / task.maxPoints) * 100

    if (percentage >= 80) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <CheckCircle2 className="h-4 w-4 text-green-500" />
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
              <CheckCircle2 className="h-4 w-4 text-yellow-500" />
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

  // Loading state
  if (periodsLoading || (selectedPeriod && (tasksLoading || studentsLoading || gradesLoading))) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-[200px]" />
        <Skeleton className="h-[500px] w-full" />
      </div>
    )
  }

  // Error state
  if (periodsError || tasksError || studentsError || gradesError) {
    return (
      <div className="p-4 bg-red-50 text-red-800 rounded-md">
        <p>Error loading grade sheet data. Please try refreshing the page.</p>
      </div>
    )
  }

  // No periods found
  if (!periodsData?.periods?.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Grading Periods Found</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Please set up grading periods in the Settings tab before using the Grade Sheet.</p>
          <Button className="mt-4" asChild>
            <a href={`/dashboard/gradebook/${classId}/settings`}>Go to Settings</a>
          </Button>
        </CardContent>
      </Card>
    )
  }

  const periods = periodsData.periods || []
  const students = studentsData?.students || []
  const tasksByCategory = getTasksByCategory()
  const categories = tasksData?.categories || []

  // Verify that category weights sum to 100%
  const totalWeight = categories.reduce((sum, category) => sum + category.weight, 0)
  const weightsValid = Math.abs(totalWeight - 100) < 0.01

  return (
    <div className="space-y-6">
      {/* Period Selector */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <Form {...form}>
          <form className="space-y-4">
            <FormField
              control={form.control}
              name="periodId"
              render={({ field }) => (
                <FormItem className="max-w-xs">
                  <FormLabel htmlFor="period-select">Select Grading Period</FormLabel>
                  <Select value={selectedPeriod} onValueChange={handlePeriodChange}>
                    <FormControl>
                      <SelectTrigger id="period-select" aria-label="Select grading period">
                        <SelectValue placeholder="Select Period" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {periods.map((period: Period) => (
                        <SelectItem key={period.id} value={period.id || ""}>
                          {period.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowStats(!showStats)}>
            {showStats ? "Hide Statistics" : "Show Statistics"}
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting} size="sm">
            {isSubmitting ? "Saving..." : "Save All Grades"}
            {!isSubmitting && <Save className="ml-2 h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Category Weights Summary */}
      {selectedPeriod && (
        <Card className="mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Grade Category Weights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {categories.map((category) => (
                <div key={category.id} className="flex flex-col items-center p-2 border rounded-md">
                  <span className="font-medium">{category.name}</span>
                  <Badge variant="secondary" className="mt-1">
                    {category.weight}%
                  </Badge>
                </div>
              ))}
            </div>
            <div className="mt-2 text-right">
              <span className={`font-medium ${weightsValid ? "text-green-600" : "text-red-600"}`}>
                Total: {totalWeight}%
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {selectedPeriod && (
        <>
          {/* Desktop View - Category-based Table */}
          <div className="hidden md:block">
            <div className="space-y-6">
              {categories.map((category) => {
                const categoryTasks = tasksByCategory[category.id] || []
                const isCategoryCollapsed = collapsedCategories.includes(category.id)

                if (categoryTasks.length === 0) return null

                return (
                  <Card key={category.id} className="overflow-hidden">
                    <CardHeader className="py-3 px-4 bg-muted/50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => toggleCategoryCollapse(category.id)}
                          >
                            {isCategoryCollapsed ? (
                              <ChevronRight className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </Button>
                          <CardTitle className="text-base font-medium">
                            {category.name} <span className="text-muted-foreground ml-1">({category.weight}%)</span>
                          </CardTitle>
                        </div>
                        <Badge variant="outline">
                          {categoryTasks.length} {categoryTasks.length === 1 ? "task" : "tasks"}
                        </Badge>
                      </div>
                    </CardHeader>

                    {!isCategoryCollapsed && (
                      <CardContent className="p-0">
                        <div className="border-t">
                          <div className="overflow-x-auto">
                            <Table role="grid" aria-label={`${category.name} Grade Sheet`}>
                              <TableHeader>
                                <TableRow>
                                  <TableHead
                                    className="sticky left-0 bg-background z-10 min-w-[200px]"
                                    role="columnheader"
                                  >
                                    Student
                                  </TableHead>

                                  {/* Render column headers for tasks in this category */}
                                  {categoryTasks.map((task: Task) => (
                                    <TableHead key={task.id} className="text-center min-w-[100px]" role="columnheader">
                                      <TooltipProvider>
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <div className="flex flex-col items-center">
                                              <span className="flex items-center gap-1">
                                                {task.title}
                                                <Info className="h-3 w-3" />
                                              </span>
                                              {showStats && (
                                                <div className="mt-1">
                                                  <Badge variant="outline" className="text-xs">
                                                    {calculateTaskStats(task.id).avg.toFixed(1)} avg
                                                  </Badge>
                                                </div>
                                              )}
                                            </div>
                                          </TooltipTrigger>
                                          <TooltipContent>
                                            <p>
                                              <strong>Max Points:</strong> {task.maxPoints}
                                            </p>
                                            {task.dueDate && (
                                              <p>
                                                <strong>Due:</strong> {new Date(task.dueDate).toLocaleDateString()}
                                              </p>
                                            )}
                                            {task.description && <p>{task.description}</p>}
                                            {showStats && (
                                              <>
                                                <div className="mt-2 pt-2 border-t">
                                                  <p>
                                                    <strong>Statistics:</strong>
                                                  </p>
                                                  <p>Average: {calculateTaskStats(task.id).avg.toFixed(1)}</p>
                                                  <p>Min: {calculateTaskStats(task.id).min}</p>
                                                  <p>Max: {calculateTaskStats(task.id).max}</p>
                                                  <p>Missing: {calculateTaskStats(task.id).missing}</p>
                                                </div>
                                              </>
                                            )}
                                          </TooltipContent>
                                        </Tooltip>
                                      </TooltipProvider>
                                    </TableHead>
                                  ))}
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {students.map((student: Student) => (
                                  <TableRow key={`${category.id}-${student.id}`} role="row">
                                    <TableCell
                                      className="sticky left-0 bg-background z-10 font-medium"
                                      role="rowheader"
                                    >
                                      {student.lastName}, {student.firstName}
                                      <div className="text-xs text-muted-foreground">{student.studentId}</div>
                                    </TableCell>

                                    {/* Render grade input cells for each task in this category */}
                                    {categoryTasks.map((task: Task) => {
                                      const gradeValue = grades[student.id]?.[task.id] ?? ""

                                      return (
                                        <TableCell
                                          key={`${student.id}-${task.id}`}
                                          className="p-2 text-center"
                                          role="gridcell"
                                        >
                                          <div className="flex flex-col items-center gap-1">
                                            <Input
                                              type="number"
                                              min={0}
                                              max={task.maxPoints}
                                              value={gradeValue}
                                              onChange={(e) =>
                                                handleGradeChange(student.id || "", task.id || "", e.target.value)
                                              }
                                              className="w-16 text-center mx-auto"
                                              aria-label={`Grade for ${student.firstName} ${student.lastName} on ${task.title}`}
                                            />
                                            <div className="h-4">{getGradeStatus(student.id, task.id)}</div>
                                          </div>
                                        </TableCell>
                                      )
                                    })}
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        </div>
                      </CardContent>
                    )}
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Mobile View - Accordion */}
          <div className="block md:hidden">
            {categories.map((category: any) => {
              const categoryTasks = tasksByCategory[category.id] || []
              const isExpanded = expandedCategories.includes(category.id)

              if (categoryTasks.length === 0) return null

              return (
                <Accordion
                  key={category.id}
                  type="single"
                  value={isExpanded ? category.id : ""}
                  onValueChange={(value) => toggleCategory(category.id)}
                  className="mb-4 border rounded-md"
                >
                  <AccordionItem value={category.id}>
                    <AccordionTrigger className="px-4">
                      <div className="flex items-center gap-2">
                        {category.name} <Badge variant="outline">{category.weight}%</Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      {categoryTasks.map((task: Task) => (
                        <div key={task.id} className="mb-6 px-4">
                          <h4 className="font-medium mb-2 flex items-center gap-1">
                            {task.title}
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  <Info className="h-4 w-4" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>
                                    <strong>Max Points:</strong> {task.maxPoints}
                                  </p>
                                  {task.dueDate && (
                                    <p>
                                      <strong>Due:</strong> {new Date(task.dueDate).toLocaleDateString()}
                                    </p>
                                  )}
                                  {task.description && <p>{task.description}</p>}
                                  {showStats && (
                                    <>
                                      <div className="mt-2 pt-2 border-t">
                                        <p>
                                          <strong>Statistics:</strong>
                                        </p>
                                        <p>Average: {calculateTaskStats(task.id).avg.toFixed(1)}</p>
                                        <p>Min: {calculateTaskStats(task.id).min}</p>
                                        <p>Max: {calculateTaskStats(task.id).max}</p>
                                        <p>Missing: {calculateTaskStats(task.id).missing}</p>
                                      </div>
                                    </>
                                  )}
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </h4>

                          <div className="space-y-2">
                            {students.map((student: Student) => {
                              const gradeValue = grades[student.id]?.[task.id] ?? ""

                              return (
                                <div key={`${task.id}-${student.id}`} className="flex justify-between items-center">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm">
                                      {student.lastName}, {student.firstName}
                                    </span>
                                    {getGradeStatus(student.id, task.id)}
                                  </div>
                                  <Input
                                    type="number"
                                    min={0}
                                    max={task.maxPoints}
                                    value={gradeValue}
                                    onChange={(e) => handleGradeChange(student.id || "", task.id || "", e.target.value)}
                                    className="w-16 text-center"
                                    aria-label={`Grade for ${student.firstName} ${student.lastName} on ${task.title}`}
                                  />
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              )
            })}
          </div>

          {/* Save Button - Fixed at bottom on mobile */}
          <div
            className={cn("flex justify-end", "md:static md:mt-4", "fixed bottom-4 right-4 left-4 md:left-auto z-10")}
          >
            <Button onClick={handleSubmit} disabled={isSubmitting} className="md:w-auto w-full">
              {isSubmitting ? "Saving..." : "Save Grades"}
              {!isSubmitting && <Save className="ml-2 h-4 w-4" />}
            </Button>
          </div>

          {/* Grade Summary for Selected Period */}
          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Grade Summary for {periods.find((p: Period) => p.id === selectedPeriod)?.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <GradeSummary classId={classId} periodId={selectedPeriod} showOnlySelectedPeriod={true} />
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}
