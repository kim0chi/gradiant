"use client"

import { useState } from "react"
import { Download, Save, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

const classes = [
  { id: "CLS001", name: "Algebra II" },
  { id: "CLS002", name: "Biology 101" },
  { id: "CLS003", name: "World History" },
  { id: "CLS004", name: "English Literature" },
  { id: "CLS005", name: "Physics 201" },
]

const assignments = [
  { id: "ASG001", name: "Quiz 1", type: "Quiz", maxPoints: 20, weight: 10 },
  { id: "ASG002", name: "Homework 1", type: "Homework", maxPoints: 50, weight: 15 },
  { id: "ASG003", name: "Midterm Exam", type: "Exam", maxPoints: 100, weight: 25 },
  { id: "ASG004", name: "Project", type: "Project", maxPoints: 100, weight: 30 },
  { id: "ASG005", name: "Quiz 2", type: "Quiz", maxPoints: 20, weight: 10 },
  { id: "ASG006", name: "Final Exam", type: "Exam", maxPoints: 100, weight: 30 },
]

const students = [
  {
    id: "STU001",
    name: "Emma Thompson",
    email: "emma.thompson@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    grades: {
      ASG001: 18,
      ASG002: 45,
      ASG003: 88,
      ASG004: 92,
      ASG005: 17,
      ASG006: 85,
    },
  },
  {
    id: "STU002",
    name: "Michael Johnson",
    email: "michael.johnson@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    grades: {
      ASG001: 15,
      ASG002: 42,
      ASG003: 78,
      ASG004: 85,
      ASG005: 16,
      ASG006: 80,
    },
  },
  {
    id: "STU003",
    name: "Sophia Williams",
    email: "sophia.williams@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    grades: {
      ASG001: 20,
      ASG002: 48,
      ASG003: 95,
      ASG004: 98,
      ASG005: 19,
      ASG006: 96,
    },
  },
  {
    id: "STU004",
    name: "James Brown",
    email: "james.brown@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    grades: {
      ASG001: 14,
      ASG002: 38,
      ASG003: 72,
      ASG004: 78,
      ASG005: 15,
      ASG006: 75,
    },
  },
  {
    id: "STU005",
    name: "Olivia Davis",
    email: "olivia.davis@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    grades: {
      ASG001: 19,
      ASG002: 47,
      ASG003: 92,
      ASG004: 95,
      ASG005: 18,
      ASG006: 90,
    },
  },
]

export default function GradebookPage() {
  const [selectedClass, setSelectedClass] = useState(classes[0].id)
  const [searchQuery, setSearchQuery] = useState("")
  const [editMode, setEditMode] = useState(false)
  const [studentGrades, setStudentGrades] = useState(students)

  const handleGradeChange = (studentId, assignmentId, value) => {
    const numValue = Number.parseInt(value, 10)
    const maxPoints = assignments.find((a) => a.id === assignmentId).maxPoints

    // Ensure the grade is within valid range
    const validValue = isNaN(numValue) ? 0 : Math.min(Math.max(numValue, 0), maxPoints)

    setStudentGrades((prev) =>
      prev.map((student) =>
        student.id === studentId
          ? {
              ...student,
              grades: {
                ...student.grades,
                [assignmentId]: validValue,
              },
            }
          : student,
      ),
    )
  }

  const calculateFinalGrade = (studentGrades) => {
    let totalWeightedScore = 0
    let totalWeight = 0

    assignments.forEach((assignment) => {
      const score = studentGrades[assignment.id] || 0
      const percentage = score / assignment.maxPoints
      totalWeightedScore += percentage * assignment.weight
      totalWeight += assignment.weight
    })

    const finalPercentage = (totalWeightedScore / totalWeight) * 100
    return finalPercentage.toFixed(1)
  }

  const getLetterGrade = (percentage) => {
    if (percentage >= 90) return "A"
    if (percentage >= 80) return "B"
    if (percentage >= 70) return "C"
    if (percentage >= 60) return "D"
    return "F"
  }

  const filteredStudents = studentGrades.filter(
    (student) =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.id.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Gradebook</h1>
        <p className="text-muted-foreground">Manage and track student grades across all your classes.</p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle>Class Grades</CardTitle>
          <div className="flex items-center gap-2">
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select class" />
              </SelectTrigger>
              <SelectContent>
                {classes.map((cls) => (
                  <SelectItem key={cls.id} value={cls.id}>
                    {cls.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={() => setEditMode(!editMode)}>
              {editMode ? "View Mode" : "Edit Mode"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex w-full max-w-sm items-center space-x-2">
                <Input
                  placeholder="Search students..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-9"
                />
                <Button variant="outline" size="sm" className="h-9 gap-1">
                  <Search className="h-4 w-4" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Search</span>
                </Button>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="h-9 gap-1">
                  <Download className="h-4 w-4" />
                  <span>Export</span>
                </Button>
                {editMode && (
                  <Button
                    size="sm"
                    className="h-9 gap-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                  >
                    <Save className="h-4 w-4" />
                    <span>Save Changes</span>
                  </Button>
                )}
              </div>
            </div>

            <div className="overflow-x-auto rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="sticky left-0 bg-background">Student</TableHead>
                    {assignments.map((assignment) => (
                      <TableHead key={assignment.id} className="min-w-[120px] text-center">
                        <div className="font-medium">{assignment.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {assignment.type} • {assignment.maxPoints} pts • {assignment.weight}%
                        </div>
                      </TableHead>
                    ))}
                    <TableHead className="text-center">Final Grade</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student) => {
                    const finalPercentage = calculateFinalGrade(student.grades)
                    const letterGrade = getLetterGrade(finalPercentage)

                    return (
                      <TableRow key={student.id}>
                        <TableCell className="sticky left-0 bg-background">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={student.avatar} alt={student.name} />
                              <AvatarFallback>
                                {student.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                              <span className="font-medium">{student.name}</span>
                              <span className="text-xs text-muted-foreground">{student.id}</span>
                            </div>
                          </div>
                        </TableCell>
                        {assignments.map((assignment) => (
                          <TableCell key={assignment.id} className="text-center">
                            {editMode ? (
                              <Input
                                type="number"
                                min="0"
                                max={assignment.maxPoints}
                                value={student.grades[assignment.id] || 0}
                                onChange={(e) => handleGradeChange(student.id, assignment.id, e.target.value)}
                                className="h-8 w-16 text-center"
                              />
                            ) : (
                              <div className="flex flex-col items-center">
                                <span>{student.grades[assignment.id] || 0}</span>
                                <span className="text-xs text-muted-foreground">
                                  {Math.round(((student.grades[assignment.id] || 0) / assignment.maxPoints) * 100)}%
                                </span>
                              </div>
                            )}
                          </TableCell>
                        ))}
                        <TableCell className="text-center">
                          <div className="flex flex-col items-center">
                            <Badge className="text-md px-2 py-1">
                              {letterGrade} ({finalPercentage}%)
                            </Badge>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

