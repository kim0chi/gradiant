"use client"

import { format, parseISO } from "date-fns"
import { CheckCircle, Circle, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

export function ActivityTimeline({ created, dueDate, submissions }) {
  const today = new Date().toISOString().split("T")[0]
  const dueDatePassed = dueDate < today

  const getSubmissionCount = () => {
    return submissions.filter((sub) => sub.status === "Submitted").length
  }

  const getLateSubmissionCount = () => {
    return submissions.filter((sub) => sub.status === "Submitted" && sub.lateSubmission).length
  }

  const formatDate = (dateString) => {
    try {
      return format(parseISO(dateString), "MMM d, yyyy")
    } catch (e) {
      return dateString
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <div className="flex flex-col items-center">
          <div className="h-6 w-6 rounded-full bg-blue-500 text-white flex items-center justify-center">
            <Circle className="h-3 w-3 fill-current" />
          </div>
          <div className="h-full w-px bg-border"></div>
        </div>
        <div>
          <p className="text-sm font-medium">Created</p>
          <p className="text-xs text-muted-foreground">{formatDate(created)}</p>
        </div>
      </div>

      <div className="flex gap-3">
        <div className="flex flex-col items-center">
          <div
            className={cn(
              "h-6 w-6 rounded-full flex items-center justify-center",
              dueDatePassed ? "bg-red-500 text-white" : "bg-amber-500 text-white",
            )}
          >
            <Clock className="h-3 w-3" />
          </div>
          <div className="h-full w-px bg-border"></div>
        </div>
        <div>
          <p className="text-sm font-medium">Due Date</p>
          <p className="text-xs text-muted-foreground">{formatDate(dueDate)}</p>
        </div>
      </div>

      <div className="flex gap-3">
        <div className="flex flex-col items-center">
          <div className="h-6 w-6 rounded-full bg-green-500 text-white flex items-center justify-center">
            <CheckCircle className="h-3 w-3" />
          </div>
        </div>
        <div>
          <p className="text-sm font-medium">Submissions</p>
          <p className="text-xs text-muted-foreground">
            {getSubmissionCount()} of {submissions.length} submitted
            {getLateSubmissionCount() > 0 && ` (${getLateSubmissionCount()} late)`}
          </p>
        </div>
      </div>
    </div>
  )
}

