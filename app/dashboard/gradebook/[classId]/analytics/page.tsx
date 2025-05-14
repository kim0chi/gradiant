import { StudentAnalytics } from "./student-analytics"

export default function AnalyticsPage({ params }: { params: { classId: string } }) {
  return (
    <div className="container mx-auto py-6">
      <StudentAnalytics classId={params.classId} />
    </div>
  )
}
