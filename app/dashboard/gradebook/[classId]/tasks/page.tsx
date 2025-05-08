import React from "react"
import { TaskManagement } from "../components/task-management"

export default function TasksPage({ params }: { params: Promise<{ classId: string }> }) {
  // Unwrap params using React.use()
  const unwrappedParams = React.use(params)
  const classId = unwrappedParams.classId
  
  return <TaskManagement classId={classId} />
}
