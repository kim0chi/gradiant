"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Edit2, Save, X, AlertCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import {
  getGradesForClass,
  getStudentsInClass,
  getTasksForClass,
  updateGrade,
  createGrade,
} from "@/lib/supabase/data-service"
import { useSupabaseSubscription } from "@/hooks/use-supabase-subscription"

type GradeTableProps = {
  classId: string
}

export function GradeTable({ classId }: GradeTableProps) {
  const [students, setStudents] = useState<any[]>([])
  const [tasks, setTasks] = useState<any[]>([])
  const [grades, setGrades] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editingCell, setEditingCell] = useState<{ studentId: string; taskId: string } | null>(null)
  const [editValue, setEditValue] = useState<string>("")
  const { toast } = useToast()

  // Subscribe to real-time updates
  useSupabaseSubscription("grades", {
    callback: () => {
      // Refetch grades when they change
      fetchGrades()
    },
  })

  // Fetch data on component mount
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const [studentsData, tasksData, gradesData] = await Promise.all([
          getStudentsInClass(classId),
          getTasksForClass(classId),
          getGradesForClass(classId),
        ])

        setStudents(studentsData)
        setTasks(tasksData)
        setGrades(gradesData)
      } catch (error) {
        console.error("Error fetching data:", error)
        toast({
          title: "Error loading data",
          description: "There was a problem loading the grade data.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [classId, toast])

  // Function to fetch grades only
  async function fetchGrades() {
    try {
      const gradesData = await getGradesForClass(classId)
      setGrades(gradesData)
    } catch (error) {
      console.error("Error fetching grades:", error)
    }
  }

  // Get grade for a specific student and task
  const getGrade = (studentId: string, taskId: string) => {
    return grades.find((grade) => grade.student_id === studentId && grade.task_id === taskId)
  }

  // Start editing a cell
  const startEditing = (studentId: string, taskId: string, currentValue: string) => {
    setEditingCell({ studentId, taskId })
    setEditValue(currentValue || "")
  }

  // Cancel editing
  const cancelEditing = () => {
    setEditingCell(null)
    setEditValue("")
  }

  // Save the edited grade
  const saveGrade = async () => {
    if (!editingCell) return

    const { studentId, taskId } = editingCell
    const numericValue = Number.parseFloat(editValue)

    // Validate input
    if (isNaN(numericValue) && editValue !== "") {
      toast({
        title: "Invalid input",
        description: "Please enter a valid number or leave blank for no grade.",
        variant: "destructive",
      })
      return
    }

    try {
      const existingGrade = getGrade(studentId, taskId)

      if (existingGrade) {
        // Update existing grade
        await updateGrade(existingGrade.id, {
          score: editValue === "" ? null : numericValue,
          submitted: editValue !== "",
        })
      } else {
        // Create new grade
        await createGrade({
          student_id: studentId,
          task_id: taskId,
          score: editValue === "" ? null : numericValue,
          submitted: editValue !== "",
          feedback: null,
        })
      }

      // Refresh grades
      await fetchGrades()

      toast({
        title: "Grade saved",
        description: "The grade has been updated successfully.",
      })
    } catch (error) {
      console.error("Error saving grade:", error)
      toast({
        title: "Error saving grade",
        description: "There was a problem saving the grade.",
        variant: "destructive",
      })
    } finally {
      cancelEditing()
    }
  }

  // Calculate student average
  const calculateStudentAverage = (studentId: string) => {
    const studentGrades = grades.filter((grade) => grade.student_id === studentId && grade.score !== null)

    if (studentGrades.length === 0) return "-"

    const totalPoints = studentGrades.reduce((sum, grade) => {
      const task = tasks.find((t) => t.id === grade.task_id)
      return sum + (grade.score / (task?.max_points || 100)) * 100
    }, 0)

    return (totalPoints / studentGrades.length).toFixed(1) + "%"
  }

  // Calculate task average
  const calculateTaskAverage = (taskId: string) => {
    const taskGrades = grades.filter((grade) => grade.task_id === taskId && grade.score !== null)

    if (taskGrades.length === 0) return "-"

    const task = tasks.find((t) => t.id === taskId)
    const maxPoints = task?.max_points || 100

    const totalPercentage = taskGrades.reduce((sum, grade) => sum + (grade.score / maxPoints) * 100, 0)

    return (totalPercentage / taskGrades.length).toFixed(1) + "%"
  }

  // Render loading state
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-8 w-24" />
        </div>
        <div className="border rounded-md">
          <div className="h-12 border-b bg-muted/50" />
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-12 border-b" />
          ))}
        </div>
      </div>
    )
  }

  // Render empty state
  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center border rounded-md bg-muted/10">
        <AlertCircle className="h-12 w-12 text-muted-foreground mb-2" />
        <h3 className="text-lg font-medium">No assignments yet</h3>
        <p className="text-muted-foreground mt-1">Create assignments to start tracking grades for this class.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="border rounded-md overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="sticky left-0 bg-background">Student</TableHead>
              {tasks.map((task) => (
                <TableHead key={task.id} className="min-w-[120px]">
                  <div className="font-medium">{task.title}</div>
                  <div className="text-xs text-muted-foreground mt-1">{task.max_points} pts</div>
                </TableHead>
              ))}
              <TableHead className="text-right">Average</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student.id}>
                <TableCell className="sticky left-0 bg-background font-medium">{student.full_name}</TableCell>

                {tasks.map((task) => {
                  const grade = getGrade(student.id, task.id)
                  const isEditing = editingCell?.studentId === student.id && editingCell?.taskId === task.id

                  return (
                    <TableCell key={task.id}>
                      {isEditing ? (
                        <div className="flex items-center space-x-1">
                          <Input
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="h-8 w-16"
                            autoFocus
                          />
                          <Button size="icon" variant="ghost" className="h-8 w-8" onClick={saveGrade}>
                            <Save className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-8 w-8" onClick={cancelEditing}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div
                          className="flex items-center space-x-1 cursor-pointer hover:bg-muted/50 p-1 rounded"
                          onClick={() => startEditing(student.id, task.id, grade?.score?.toString() || "")}
                        >
                          {grade?.score !== undefined && grade?.score !== null ? (
                            <>
                              <span>{grade.score}</span>
                              <span className="text-xs text-muted-foreground">/{task.max_points}</span>
                              <Edit2 className="h-3 w-3 ml-1 text-muted-foreground" />
                            </>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </div>
                      )}
                    </TableCell>
                  )
                })}

                <TableCell className="text-right">
                  <Badge variant="outline">{calculateStudentAverage(student.id)}</Badge>
                </TableCell>
              </TableRow>
            ))}

            {/* Task averages row */}
            <TableRow className="bg-muted/30">
              <TableCell className="sticky left-0 bg-muted/30 font-medium">Class Average</TableCell>
              {tasks.map((task) => (
                <TableCell key={task.id}>
                  <Badge variant="secondary">{calculateTaskAverage(task.id)}</Badge>
                </TableCell>
              ))}
              <TableCell />
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
