"use client"

import { useState } from "react"
import { format, parseISO } from "date-fns"
import { CheckCircle, XCircle, Clock } from "lucide-react"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export function StudentSubmissionsTable({ submissions, maxPoints, onGradeChange, onFeedbackChange }) {
  const [editingGrades, setEditingGrades] = useState(false)
  const [grades, setGrades] = useState(
    submissions.map((sub) => ({ id: sub.id, grade: sub.grade, feedback: sub.feedback })),
  )

  const handleGradeChange = (submissionId, value) => {
    const numValue = Number.parseInt(value, 10)
    const validValue = isNaN(numValue) ? null : Math.min(Math.max(numValue, 0), maxPoints)

    setGrades((prev) => prev.map((item) => (item.id === submissionId ? { ...item, grade: validValue } : item)))
  }

  const handleFeedbackChange = (submissionId, value) => {
    setGrades((prev) => prev.map((item) => (item.id === submissionId ? { ...item, feedback: value } : item)))
  }

  const saveChanges = () => {
    grades.forEach((item) => {
      if (item.grade !== null) {
        onGradeChange(item.id, item.grade)
      }
      if (item.feedback) {
        onFeedbackChange(item.id, item.feedback)
      }
    })
    setEditingGrades(false)
  }

  const formatDate = (dateString) => {
    if (!dateString) return "—"
    try {
      return format(parseISO(dateString), "MMM d, yyyy h:mm a")
    } catch (e) {
      return dateString
    }
  }

  const getStatusIcon = (status, lateSubmission) => {
    if (status === "Submitted") {
      return lateSubmission ? (
        <Clock className="h-4 w-4 text-amber-500" />
      ) : (
        <CheckCircle className="h-4 w-4 text-green-500" />
      )
    } else {
      return <XCircle className="h-4 w-4 text-red-500" />
    }
  }

  const getSubmissionGrade = (submissionId) => {
    const grade = grades.find((item) => item.id === submissionId)?.grade
    return grade !== null && grade !== undefined ? grade : null
  }

  const getSubmissionFeedback = (submissionId) => {
    return grades.find((item) => item.id === submissionId)?.feedback || ""
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <h3 className="text-lg font-medium">Submissions ({submissions.length})</h3>
        <Button
          variant={editingGrades ? "default" : "outline"}
          onClick={() => (editingGrades ? saveChanges() : setEditingGrades(true))}
          className={
            editingGrades ? "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600" : ""
          }
        >
          {editingGrades ? "Save Grades" : "Grade Submissions"}
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Submitted At</TableHead>
              <TableHead className="text-center">Grade</TableHead>
              <TableHead>Feedback</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {submissions.map((sub) => (
              <TableRow key={sub.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={sub.student.avatar} alt={sub.student.name} />
                      <AvatarFallback>
                        {sub.student.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="font-medium">{sub.student.name}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(sub.status, sub.lateSubmission)}
                    <Badge
                      variant={
                        sub.status === "Submitted" ? (sub.lateSubmission ? "outline" : "default") : "destructive"
                      }
                    >
                      {sub.status}
                      {sub.lateSubmission && " (Late)"}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell>{formatDate(sub.submittedAt)}</TableCell>
                <TableCell className="text-center">
                  {editingGrades && sub.status === "Submitted" ? (
                    <Input
                      type="number"
                      min="0"
                      max={maxPoints}
                      value={getSubmissionGrade(sub.id) || ""}
                      onChange={(e) => handleGradeChange(sub.id, e.target.value)}
                      className="h-8 w-16 text-center mx-auto"
                    />
                  ) : getSubmissionGrade(sub.id) !== null ? (
                    <div>
                      <span className="font-medium">{getSubmissionGrade(sub.id)}</span>
                      <span className="text-muted-foreground">/{maxPoints}</span>
                    </div>
                  ) : (
                    "—"
                  )}
                </TableCell>
                <TableCell>
                  {editingGrades && sub.status === "Submitted" ? (
                    <Textarea
                      placeholder="Add feedback..."
                      value={getSubmissionFeedback(sub.id)}
                      onChange={(e) => handleFeedbackChange(sub.id, e.target.value)}
                      className="h-20 min-h-[80px]"
                    />
                  ) : (
                    <div className="max-w-xs truncate">{getSubmissionFeedback(sub.id) || "—"}</div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

