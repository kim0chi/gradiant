"use client"

import React, { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { PeriodSelector } from "./period-selector"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/components/ui/use-toast"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { InfoIcon } from "lucide-react"

// Types for our component
interface Student {
  id: string
  name: string
  email: string
}

interface Task {
  id: string
  name: string
  category: string
  maxScore: number
  weight: number
  periodId: string
}

interface Grade {
  studentId: string
  taskId: string
  score: number
}

interface Period {
  id: string
  name: string
  startDate: string
  endDate: string
}

interface Category {
  id: string
  name: string
  weight: number
}

// Mock periods data for fallback
const mockPeriods = [
  { id: "1", name: "Prelims", startDate: "2023-08-15T00:00:00.000Z", endDate: "2023-09-30T00:00:00.000Z", weight: 25 },
  { id: "2", name: "Midterms", startDate: "2023-10-01T00:00:00.000Z", endDate: "2023-11-15T00:00:00.000Z", weight: 25 },
  {
    id: "3",
    name: "Semi-Finals",
    startDate: "2023-11-16T00:00:00.000Z",
    endDate: "2023-12-15T00:00:00.000Z",
    weight: 25,
  },
  { id: "4", name: "Finals", startDate: "2023-12-16T00:00:00.000Z", endDate: "2024-01-31T00:00:00.000Z", weight: 25 },
]

// Mock students data for fallback
const mockStudents = [
  { id: "s1", name: "John Doe", email: "john@example.com" },
  { id: "s2", name: "Jane Smith", email: "jane@example.com" },
  { id: "s3", name: "Bob Johnson", email: "bob@example.com" },
  { id: "s4", name: "Alice Williams", email: "alice@example.com" },
  { id: "s5", name: "Charlie Brown", email: "charlie@example.com" },
]

// Mock tasks data for fallback
const mockTasks = [
  { id: "t1", name: "Quiz 1", category: "Quizzes", maxScore: 100, weight: 10, periodId: "1" },
  { id: "t2", name: "Assignment 1", category: "Assignments", maxScore: 50, weight: 15, periodId: "1" },
  { id: "t3", name: "Midterm Exam", category: "Exams", maxScore: 100, weight: 25, periodId: "2" },
  { id: "t4", name: "Project", category: "Projects", maxScore: 100, weight: 30, periodId: "3" },
  { id: "t5", name: "Final Exam", category: "Exams", maxScore: 100, weight: 30, periodId: "4" },
]

// Form schema for grades
const GradesFormSchema = z.object({
  grades: z.array(
    z.object({
      studentId: z.string(),
      taskId: z.string(),
      score: z.number().min(0).optional(),
    }),
  ),
})

type GradesFormValues = z.infer<typeof GradesFormSchema>

export function PeriodGradeSheet() {
  const params = useParams()
  const router = useRouter()
  // With useParams hook, we can access params directly
  const classId = params.classId as string

  // State for our data
  const [students, setStudents] = useState<Student[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [grades, setGrades] = useState<Grade[]>([])
  const [periods, setPeriods] = useState<Period[]>(mockPeriods)
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedPeriod, setSelectedPeriod] = useState<string>(mockPeriods[0].id)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  // Start in demo mode by default since API endpoints are not working
  const [usingMockData, setUsingMockData] = useState(true)

  // Initialize form
  const form = useForm<GradesFormValues>({
    resolver: zodResolver(GradesFormSchema),
    defaultValues: {
      grades: [],
    },
  })

  // Show demo mode notification on component mount
  useEffect(() => {
    toast({
      title: "Demo Mode Active",
      description: "This application is running with sample data. API endpoints are not available.",
      duration: 5000,
    })
  }, [])

  // Load mock students
  useEffect(() => {
    setStudents(mockStudents)
  }, [])

  // Load mock tasks for the selected period
  useEffect(() => {
    if (!selectedPeriod) return

    setLoading(true)

    // Filter mock tasks by period
    const filteredTasks = mockTasks.filter((task) => task.periodId === selectedPeriod)
    setTasks(filteredTasks)
    setLoading(false)
  }, [selectedPeriod])

  // Generate mock grades
  useEffect(() => {
    if (!selectedPeriod || tasks.length === 0 || students.length === 0) return

    // Generate mock grades
    const mockGrades = students.flatMap((student) =>
      tasks.map((task) => ({
        studentId: student.id,
        taskId: task.id,
        score: Math.floor(Math.random() * task.maxScore),
      })),
    )
    setGrades(mockGrades)

    // Initialize form values with mock grades
    const formGrades = students.flatMap((student, studentIndex) =>
      tasks.map((task, taskIndex) => {
        const gradeIndex = studentIndex * tasks.length + taskIndex
        return {
          studentId: student.id,
          taskId: task.id,
          score: mockGrades[gradeIndex]?.score,
        }
      }),
    )

    form.reset({ grades: formGrades })
  }, [selectedPeriod, tasks, students, form])

  // Load mock categories
  useEffect(() => {
    const mockCategories = [
      { id: "c1", name: "Quizzes", weight: 20 },
      { id: "c2", name: "Assignments", weight: 30 },
      { id: "c3", name: "Exams", weight: 50 },
    ]
    setCategories(mockCategories)
  }, [])

  // Handle period change
  const handlePeriodChange = (periodId: string) => {
    setSelectedPeriod(periodId)
  }

  // Handle form submission
  const onSubmit = async (data: GradesFormValues) => {
    setSaving(true)
    try {
      // Simulate saving in mock mode
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast({
        title: "Demo Mode",
        description: "Grades would be saved in production mode",
      })
    } catch (error) {
      console.error("Error saving grades:", error)
      toast({
        title: "Error",
        description: "Failed to save grades",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  // Group tasks by category
  const tasksByCategory = tasks.reduce(
    (acc, task) => {
      const categoryName = task.category || "Uncategorized"
      if (!acc[categoryName]) {
        acc[categoryName] = []
      }
      acc[categoryName].push(task)
      return acc
    },
    {} as Record<string, Task[]>,
  )

  // Get the current period name
  const currentPeriodName = periods.find((p) => p.id === selectedPeriod)?.name || "Loading..."

  // Render loading state
  if (loading && (!tasks.length || !students.length)) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-[200px]" />
          <Skeleton className="h-10 w-[100px]" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-[300px]" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Demo Mode Alert */}
      <Alert>
        <InfoIcon className="h-4 w-4" />
        <AlertTitle>Demo Mode</AlertTitle>
        <AlertDescription>This application is running with sample data. All actions are simulated.</AlertDescription>
      </Alert>

      {/* Period Selector */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="w-full sm:w-72">
          <PeriodSelector periods={periods} selectedPeriod={selectedPeriod} onPeriodChange={handlePeriodChange} />
        </div>
        <Button onClick={form.handleSubmit(onSubmit)} disabled={saving || loading}>
          {saving ? "Saving..." : "Save Grades"}
        </Button>
      </div>

      {/* Desktop View - Full Grade Sheet */}
      <div className="hidden md:block">
        <Card>
          <CardHeader>
            <CardTitle>Grade Sheet - {currentPeriodName}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[200px] sticky left-0 bg-background z-10">Student</TableHead>
                        {tasks.map((task) => (
                          <TableHead key={task.id} className="min-w-[120px]">
                            <div className="font-medium">{task.name}</div>
                            <div className="text-xs text-muted-foreground">
                              Max: {task.maxScore} | Weight: {task.weight}
                            </div>
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {students.map((student, studentIndex) => (
                        <TableRow key={student.id}>
                          <TableCell className="font-medium sticky left-0 bg-background z-10">{student.name}</TableCell>
                          {tasks.map((task, taskIndex) => {
                            const gradeIndex = studentIndex * tasks.length + taskIndex
                            return (
                              <TableCell key={`${student.id}-${task.id}`}>
                                <FormField
                                  control={form.control}
                                  name={`grades.${gradeIndex}.score`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormControl>
                                        <Input
                                          type="number"
                                          min={0}
                                          max={task.maxScore}
                                          {...field}
                                          value={field.value === undefined ? "" : field.value}
                                          onChange={(e) => {
                                            const value =
                                              e.target.value === "" ? undefined : Number.parseFloat(e.target.value)
                                            field.onChange(value)
                                          }}
                                          className="w-20"
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </TableCell>
                            )
                          })}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </form>
              </Form>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mobile View - Accordion by Category */}
      <div className="block md:hidden">
        <Card>
          <CardHeader>
            <CardTitle>Grade Sheet - {currentPeriodName}</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <Accordion type="single" collapsible className="w-full">
                  {Object.entries(tasksByCategory).map(([category, categoryTasks]) => (
                    <AccordionItem key={category} value={category}>
                      <AccordionTrigger className="font-medium">{category}</AccordionTrigger>
                      <AccordionContent>
                        {categoryTasks.map((task) => (
                          <div key={task.id} className="mb-6 border-b pb-4">
                            <h4 className="font-medium mb-2">{task.name}</h4>
                            <p className="text-sm text-muted-foreground mb-3">
                              Max: {task.maxScore} | Weight: {task.weight}
                            </p>
                            <div className="space-y-3">
                              {students.map((student, studentIndex) => {
                                const taskIndex = tasks.findIndex((t) => t.id === task.id)
                                const gradeIndex = studentIndex * tasks.length + taskIndex

                                return (
                                  <div key={`${task.id}-${student.id}`} className="flex items-center justify-between">
                                    <span className="text-sm">{student.name}</span>
                                    <FormField
                                      control={form.control}
                                      name={`grades.${gradeIndex}.score`}
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormControl>
                                            <Input
                                              type="number"
                                              min={0}
                                              max={task.maxScore}
                                              {...field}
                                              value={field.value === undefined ? "" : field.value}
                                              onChange={(e) => {
                                                const value =
                                                  e.target.value === "" ? undefined : Number.parseFloat(e.target.value)
                                                field.onChange(value)
                                              }}
                                              className="w-20"
                                            />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        ))}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      {/* Grade Summary for the selected period */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Grade Summary - {currentPeriodName}</CardTitle>
          <Button
            variant="outline"
            onClick={() => router.push(`/dashboard/gradebook/${classId}/analytics?periodId=${selectedPeriod}`)}
          >
            View Full Summary
          </Button>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <p>Grade summary is available in production mode.</p>
            <p className="text-muted-foreground mt-2">Currently using demo data.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
