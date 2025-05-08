import React from "react"
import { StudentManagement } from "../components/student-management"

export default function StudentsPage({ params }: { params: Promise<{ classId: string }> }) {
  // Unwrap params using React.use()
  const unwrappedParams = React.use(params)
  const classId = unwrappedParams.classId
  
  return <StudentManagement classId={classId} />
}
