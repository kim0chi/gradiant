import { use } from "react"
import { StudentAnalytics } from "./student-analytics"

export default function AnalyticsPage({ params }: { params: Promise<{ classId: string }> }) {
  const { classId } = use(params)
  return (
    <div className="container mx-auto py-6">
      <StudentAnalytics classId={classId} />
    </div>
  )
}
