"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CheckCircle2, AlertCircle } from "lucide-react"

export function GradeSheetSample() {
  // Sample data
  const categories = [
    { id: "cat1", name: "Homework", weight: 20 },
    { id: "cat2", name: "Quizzes", weight: 15 },
    { id: "cat3", name: "Tests", weight: 30 },
    { id: "cat4", name: "Projects", weight: 20 },
    { id: "cat5", name: "Attendance", weight: 15 },
  ]

  const students = [
    { id: "s1", firstName: "Emma", lastName: "Johnson", studentId: "SID001" },
    { id: "s2", firstName: "Noah", lastName: "Williams", studentId: "SID002" },
    { id: "s3", firstName: "Olivia", lastName: "Brown", studentId: "SID003" },
    { id: "s4", firstName: "Liam", lastName: "Jones", studentId: "SID004" },
  ]

  const homeworkTasks = [
    { id: "task1", title: "Homework 1", maxPoints: 20 },
    { id: "task2", title: "Homework 2", maxPoints: 20 },
  ]

  const quizTasks = [{ id: "task3", title: "Quiz 1", maxPoints: 30 }]

  // Sample grades for Quarter 1
  const homeworkGrades = {
    s1: { task1: 18, task2: 17 },
    s2: { task1: 15, task2: 16 },
    s3: { task1: 19, task2: 20 },
    s4: { task1: 14, task2: 13 },
  }

  const quizGrades = {
    s1: { task3: 27 },
    s2: { task3: 22 },
    s3: { task3: 29 },
    s4: { task3: 20 },
  }

  // Helper function to get grade status indicator
  const getGradeStatus = (score: number, maxPoints: number) => {
    const percentage = (score / maxPoints) * 100

    if (percentage >= 80) {
      return <CheckCircle2 className="h-4 w-4 text-green-500" />
    } else if (percentage >= 60) {
      return <CheckCircle2 className="h-4 w-4 text-yellow-500" />
    } else {
      return <AlertCircle className="h-4 w-4 text-red-500" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-xl font-bold">Sample Grade Sheet - Quarter 1</div>

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
          <div className="mt-2 text-right">
            <span className="font-medium text-green-600">Total: 100%</span>
          </div>
        </CardContent>
      </Card>

      {/* Homework Category */}
      <Card className="overflow-hidden">
        <CardHeader className="py-3 px-4 bg-muted/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CardTitle className="text-base font-medium">
                Homework <span className="text-muted-foreground ml-1">(20%)</span>
              </CardTitle>
            </div>
            <Badge variant="outline">2 tasks</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="border-t">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[200px]">Student</TableHead>
                    {homeworkTasks.map((task) => (
                      <TableHead key={task.id} className="text-center min-w-[100px]">
                        {task.title}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">
                        {student.lastName}, {student.firstName}
                        <div className="text-xs text-muted-foreground">{student.studentId}</div>
                      </TableCell>
                      {homeworkTasks.map((task) => (
                        <TableCell key={`${student.id}-${task.id}`} className="p-2 text-center">
                          <div className="flex flex-col items-center gap-1">
                            <div className="w-16 text-center mx-auto border rounded-md py-1 px-2">
                              {homeworkGrades[student.id]?.[task.id] || "-"}
                            </div>
                            <div className="h-4">
                              {homeworkGrades[student.id]?.[task.id] &&
                                getGradeStatus(homeworkGrades[student.id][task.id], task.maxPoints)}
                            </div>
                          </div>
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quizzes Category */}
      <Card className="overflow-hidden">
        <CardHeader className="py-3 px-4 bg-muted/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CardTitle className="text-base font-medium">
                Quizzes <span className="text-muted-foreground ml-1">(15%)</span>
              </CardTitle>
            </div>
            <Badge variant="outline">1 task</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="border-t">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[200px]">Student</TableHead>
                    {quizTasks.map((task) => (
                      <TableHead key={task.id} className="text-center min-w-[100px]">
                        {task.title}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">
                        {student.lastName}, {student.firstName}
                        <div className="text-xs text-muted-foreground">{student.studentId}</div>
                      </TableCell>
                      {quizTasks.map((task) => (
                        <TableCell key={`${student.id}-${task.id}`} className="p-2 text-center">
                          <div className="flex flex-col items-center gap-1">
                            <div className="w-16 text-center mx-auto border rounded-md py-1 px-2">
                              {quizGrades[student.id]?.[task.id] || "-"}
                            </div>
                            <div className="h-4">
                              {quizGrades[student.id]?.[task.id] &&
                                getGradeStatus(quizGrades[student.id][task.id], task.maxPoints)}
                            </div>
                          </div>
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Period Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Period Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead className="text-center">Homework (20%)</TableHead>
                <TableHead className="text-center">Quizzes (15%)</TableHead>
                <TableHead className="text-center">Tests (30%)</TableHead>
                <TableHead className="text-center">Projects (20%)</TableHead>
                <TableHead className="text-center">Attendance (15%)</TableHead>
                <TableHead className="text-center">Final Grade</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Johnson, Emma</TableCell>
                <TableCell className="text-center">87.5%</TableCell>
                <TableCell className="text-center">90.0%</TableCell>
                <TableCell className="text-center">85.0%</TableCell>
                <TableCell className="text-center">92.0%</TableCell>
                <TableCell className="text-center">100.0%</TableCell>
                <TableCell className="text-center font-bold">89.6%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Williams, Noah</TableCell>
                <TableCell className="text-center">77.5%</TableCell>
                <TableCell className="text-center">73.3%</TableCell>
                <TableCell className="text-center">80.0%</TableCell>
                <TableCell className="text-center">85.0%</TableCell>
                <TableCell className="text-center">90.0%</TableCell>
                <TableCell className="text-center font-bold">81.0%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Brown, Olivia</TableCell>
                <TableCell className="text-center">97.5%</TableCell>
                <TableCell className="text-center">96.7%</TableCell>
                <TableCell className="text-center">92.0%</TableCell>
                <TableCell className="text-center">94.0%</TableCell>
                <TableCell className="text-center">95.0%</TableCell>
                <TableCell className="text-center font-bold">94.5%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Jones, Liam</TableCell>
                <TableCell className="text-center">67.5%</TableCell>
                <TableCell className="text-center">66.7%</TableCell>
                <TableCell className="text-center">72.0%</TableCell>
                <TableCell className="text-center">78.0%</TableCell>
                <TableCell className="text-center">85.0%</TableCell>
                <TableCell className="text-center font-bold">73.6%</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
