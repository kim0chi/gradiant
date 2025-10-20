"use client"

import { useState, useEffect, use } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { PeriodSelector } from "../components/period-selector"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Save, CheckCircle, AlertCircle } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

// Import any other components you need

export default function GradeSheetPage({ params }: { params: Promise<{ classId: string }> }) {
  const { classId } = use(params)
  const [selectedPeriod, setSelectedPeriod] = useState("1") // Default to first period
  const [grades, setGrades] = useState<Record<string, Record<string, Record<string, number>>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showAllPeriods, setShowAllPeriods] = useState(true)

  // Demo data for periods
  const periods = [
    { id: "1", name: "Prelims", startDate: "2023-08-15", endDate: "2023-09-30", weight: 25 },
    { id: "2", name: "Midterms", startDate: "2023-10-01", endDate: "2023-11-15", weight: 25 },
    { id: "3", name: "Semi-Finals", startDate: "2023-11-16", endDate: "2023-12-15", weight: 25 },
    { id: "4", name: "Finals", startDate: "2023-12-16", endDate: "2024-01-31", weight: 25 },
  ]

  // Demo data for categories with weights
  const categories = [
    { id: "cat1", name: "Homework", weight: 20 },
    { id: "cat2", name: "Quizzes", weight: 15 },
    { id: "cat3", name: "Tests", weight: 30 },
    { id: "cat4", name: "Projects", weight: 20 },
    { id: "cat5", name: "Attendance", weight: 15 },
  ]

  // Demo data for tasks
  const tasks = {
    "1": [
      // Prelims
      { id: "task1", title: "Homework 1", categoryId: "cat1", maxPoints: 20 },
      { id: "task2", title: "Homework 2", categoryId: "cat1", maxPoints: 20 },
      { id: "task3", title: "Quiz 1", categoryId: "cat2", maxPoints: 30 },
      { id: "task4", title: "Midterm Exam", categoryId: "cat3", maxPoints: 100 },
      { id: "task5", title: "Project 1", categoryId: "cat4", maxPoints: 50 },
      { id: "task6", title: "Attendance P1", categoryId: "cat5", maxPoints: 50 },
    ],
    "2": [
      // Midterms
      { id: "task7", title: "Homework 3", categoryId: "cat1", maxPoints: 20 },
      { id: "task8", title: "Homework 4", categoryId: "cat1", maxPoints: 20 },
      { id: "task9", title: "Quiz 2", categoryId: "cat2", maxPoints: 30 },
      { id: "task10", title: "Midterm Exam", categoryId: "cat3", maxPoints: 100 },
      { id: "task11", title: "Project 2", categoryId: "cat4", maxPoints: 50 },
      { id: "task12", title: "Attendance M1", categoryId: "cat5", maxPoints: 50 },
    ],
    "3": [
      // Semi-Finals
      { id: "task13", title: "Homework 5", categoryId: "cat1", maxPoints: 20 },
      { id: "task14", title: "Homework 6", categoryId: "cat1", maxPoints: 20 },
      { id: "task15", title: "Quiz 3", categoryId: "cat2", maxPoints: 30 },
      { id: "task16", title: "Semi-Final Exam", categoryId: "cat3", maxPoints: 100 },
      { id: "task17", title: "Project 3", categoryId: "cat4", maxPoints: 50 },
      { id: "task18", title: "Attendance SF", categoryId: "cat5", maxPoints: 50 },
    ],
    "4": [
      // Finals
      { id: "task19", title: "Homework 7", categoryId: "cat1", maxPoints: 20 },
      { id: "task20", title: "Homework 8", categoryId: "cat1", maxPoints: 20 },
      { id: "task21", title: "Quiz 4", categoryId: "cat2", maxPoints: 30 },
      { id: "task22", title: "Final Exam", categoryId: "cat3", maxPoints: 100 },
      { id: "task23", title: "Project 4", categoryId: "cat4", maxPoints: 50 },
      { id: "task24", title: "Attendance F", categoryId: "cat5", maxPoints: 50 },
    ],
  }

  // Demo data for students
  const students = [
    { id: "s1", firstName: "Emma", lastName: "Johnson", studentId: "SID001" },
    { id: "s2", firstName: "Noah", lastName: "Williams", studentId: "SID002" },
    { id: "s3", firstName: "Olivia", lastName: "Brown", studentId: "SID003" },
    { id: "s4", firstName: "Liam", lastName: "Jones", studentId: "SID004" },
  ]

  // Initialize grades with sample data
  useEffect(() => {
    const initialGrades: Record<string, Record<string, Record<string, number>>> = {}

    // Generate sample grades for each period
    periods.forEach((period) => {
      initialGrades[period.id] = {}

      students.forEach((student) => {
        initialGrades[period.id][student.id] = {}

        tasks[period.id].forEach((task) => {
          // Generate a random grade between 60% and 100% of max points
          const randomPercentage = 0.6 + Math.random() * 0.4
          initialGrades[period.id][student.id][task.id] = Math.round(task.maxPoints * randomPercentage)
        })
      })
    })

    setGrades(initialGrades)
  }, [])

  const handlePeriodChange = (periodId: string) => {
    setSelectedPeriod(periodId)
  }

  const handleGradeChange = (periodId: string, studentId: string, taskId: string, value: string) => {
    const numValue = Number.parseFloat(value)

    if (isNaN(numValue)) return

    setGrades((prev) => {
      const newGrades = { ...prev }

      if (!newGrades[periodId]) {
        newGrades[periodId] = {}
      }

      if (!newGrades[periodId][studentId]) {
        newGrades[periodId][studentId] = {}
      }

      newGrades[periodId][studentId][taskId] = numValue
      return newGrades
    })
  }

  const handleSaveGrades = async () => {
    setIsSubmitting(true)

    try {
      // In a real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

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

  // Calculate category average for a student in a period
  const calculateCategoryAverage = (periodId: string, studentId: string, categoryId: string) => {
    const periodTasks = tasks[periodId] || []
    const categoryTasks = periodTasks.filter((task) => task.categoryId === categoryId)

    if (categoryTasks.length === 0) return 0

    let totalPoints = 0
    let earnedPoints = 0

    categoryTasks.forEach((task) => {
      const grade = grades[periodId]?.[studentId]?.[task.id] || 0
      earnedPoints += grade
      totalPoints += task.maxPoints
    })

    return totalPoints > 0 ? (earnedPoints / totalPoints) * 100 : 0
  }

  // Calculate period average for a student
  const calculatePeriodAverage = (periodId: string, studentId: string) => {
    let weightedSum = 0
    let totalWeight = 0

    categories.forEach((category) => {
      const categoryAvg = calculateCategoryAverage(periodId, studentId, category.id)
      weightedSum += categoryAvg * category.weight
      totalWeight += category.weight
    })

    return totalWeight > 0 ? weightedSum / totalWeight : 0
  }

  // Calculate final average across all periods
  const calculateFinalAverage = (studentId: string) => {
    let weightedSum = 0
    let totalWeight = 0

    periods.forEach((period) => {
      const periodAvg = calculatePeriodAverage(period.id, studentId)
      weightedSum += periodAvg * period.weight
      totalWeight += period.weight
    })

    return totalWeight > 0 ? weightedSum / totalWeight : 0
  }

  // Get letter grade based on percentage
  const getLetterGrade = (percentage: number) => {
    if (percentage >= 93) return "A"
    if (percentage >= 90) return "A-"
    if (percentage >= 87) return "B+"
    if (percentage >= 83) return "B"
    if (percentage >= 80) return "B-"
    if (percentage >= 77) return "C+"
    if (percentage >= 73) return "C"
    if (percentage >= 70) return "C-"
    if (percentage >= 67) return "D+"
    if (percentage >= 63) return "D"
    if (percentage >= 60) return "D-"
    return "F"
  }

  // Group tasks by category for the selected period
  const getTasksByCategory = (periodId: string) => {
    const periodTasks = tasks[periodId] || []

    return periodTasks.reduce(
      (acc, task) => {
        if (!acc[task.categoryId]) {
          acc[task.categoryId] = []
        }
        acc[task.categoryId].push(task)
        return acc
      },
      {} as Record<string, typeof periodTasks>,
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Page title */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Grade Sheet</h1>
        <p className="text-muted-foreground">View and manage student grades for this class</p>
      </div>

      {/* Period Selector and Controls */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <PeriodSelector periods={periods} selectedPeriod={selectedPeriod} onPeriodChange={handlePeriodChange} />

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowAllPeriods(!showAllPeriods)}>
            {showAllPeriods ? "Show Selected Period Only" : "Show All Periods"}
          </Button>

          <Button onClick={handleSaveGrades} disabled={isSubmitting} size="sm">
            {isSubmitting ? "Saving..." : "Save All Grades"}
            {!isSubmitting && <Save className="ml-2 h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Category Weights Summary */}
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
        </CardContent>
      </Card>

      {/* Editable Grade Sheet for Selected Period */}
      <div className="space-y-6">
        {Object.entries(getTasksByCategory(selectedPeriod)).map(([categoryId, categoryTasks]) => {
          const category = categories.find((c) => c.id === categoryId)
          if (!category) return null

          const bgColorClass =
            categoryId === "cat1"
              ? "bg-blue-500/10"
              : categoryId === "cat2"
                ? "bg-green-500/10"
                : categoryId === "cat3"
                  ? "bg-amber-500/10"
                  : categoryId === "cat4"
                    ? "bg-purple-500/10"
                    : "bg-rose-500/10"

          return (
            <Card key={categoryId}>
              <CardHeader className={`${bgColorClass} border-b`}>
                <CardTitle className="flex items-center justify-between">
                  <span>
                    {category.name} ({category.weight}%)
                  </span>
                  <span className="text-sm font-normal">{categoryTasks.length} tasks</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3 font-medium">Student</th>
                        {categoryTasks.map((task) => (
                          <th key={task.id} className="text-center p-3 font-medium">
                            {task.title}
                            <span className="block text-xs font-normal">{task.maxPoints} pts</span>
                          </th>
                        ))}
                        <th className="text-center p-3 font-medium">Category Average</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((student) => {
                        const categoryAvg = calculateCategoryAverage(selectedPeriod, student.id, categoryId)

                        return (
                          <tr key={`${categoryId}-${student.id}`} className="border-b hover:bg-muted/50">
                            <td className="p-3">
                              {student.lastName}, {student.firstName}
                              <div className="text-xs text-muted-foreground">{student.studentId}</div>
                            </td>

                            {categoryTasks.map((task) => {
                              const gradeValue = grades[selectedPeriod]?.[student.id]?.[task.id] || 0
                              const percentage = (gradeValue / task.maxPoints) * 100

                              return (
                                <td key={`${student.id}-${task.id}`} className="text-center p-3">
                                  <div className="flex flex-col items-center gap-1">
                                    <Input
                                      type="number"
                                      min={0}
                                      max={task.maxPoints}
                                      value={gradeValue}
                                      onChange={(e) =>
                                        handleGradeChange(selectedPeriod, student.id, task.id, e.target.value)
                                      }
                                      className="w-16 text-center mx-auto"
                                      aria-label={`Grade for ${student.firstName} ${student.lastName} on ${task.title}`}
                                    />
                                    {percentage >= 70 ? (
                                      <CheckCircle className="h-4 w-4 text-green-500" />
                                    ) : (
                                      <AlertCircle className="h-4 w-4 text-amber-500" />
                                    )}
                                  </div>
                                </td>
                              )
                            })}

                            <td className="text-center p-3 font-medium">{categoryAvg.toFixed(1)}%</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Comprehensive Grade Summary */}
      <Card>
        <CardHeader className="bg-gray-500/10 border-b">
          <CardTitle>Comprehensive Grade Summary</CardTitle>
          <CardDescription>
            Showing {showAllPeriods ? "all periods" : "selected period"} with final averages
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium">Student</th>
                  {(showAllPeriods ? periods : periods.filter((p) => p.id === selectedPeriod)).map((period) => (
                    <th key={period.id} className="text-center p-3 font-medium">
                      {period.name} ({period.weight}%)
                    </th>
                  ))}
                  {showAllPeriods && <th className="text-center p-3 font-medium bg-green-50">Final Average</th>}
                </tr>
              </thead>
              <tbody>
                {students.map((student) => {
                  const finalAvg = calculateFinalAverage(student.id)

                  return (
                    <tr key={student.id} className="border-b hover:bg-muted/50">
                      <td className="p-3">
                        {student.lastName}, {student.firstName}
                        <div className="text-xs text-muted-foreground">{student.studentId}</div>
                      </td>

                      {(showAllPeriods ? periods : periods.filter((p) => p.id === selectedPeriod)).map((period) => {
                        const periodAvg = calculatePeriodAverage(period.id, student.id)
                        const letterGrade = getLetterGrade(periodAvg)

                        return (
                          <td key={`${student.id}-${period.id}`} className="text-center p-3">
                            <div className="font-medium">{periodAvg.toFixed(1)}%</div>
                            <div className="text-sm">{letterGrade}</div>
                          </td>
                        )
                      })}

                      {showAllPeriods && (
                        <td className="text-center p-3 font-medium bg-green-50">
                          <div className="text-lg">{finalAvg.toFixed(1)}%</div>
                          <div>{getLetterGrade(finalAvg)}</div>
                        </td>
                      )}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Skeleton loaders for better UX during suspense
function GradeSummarySkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-72" />
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function PeriodGradeSheetSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-10 w-48" />
      <div className="space-y-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    </div>
  )
}
