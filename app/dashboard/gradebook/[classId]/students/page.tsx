import { use } from "react"
import { StudentManagement } from "../components/student-management"

export default function StudentsPage({ params }: { params: Promise<{ classId: string }> }) {
  const { classId } = use(params)
  return <StudentManagement classId={classId} />
}
