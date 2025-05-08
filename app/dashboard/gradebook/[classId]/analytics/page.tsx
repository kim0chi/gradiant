import React from "react"
import { StudentAnalytics } from "./student-analytics"

export default function AnalyticsPage({ params }: { params: Promise<{ classId: string }> }) {
  // Unwrap params using React.use()
  const unwrappedParams = React.use(params)
  const classId = unwrappedParams.classId
  
  return (
    <div className="container mx-auto py-6">
      <StudentAnalytics classId={classId} />
    </div>
  )
}
