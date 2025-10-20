import { use } from "react"
import { TaskManagement } from "../components/task-management"

export default function TasksPage({ params }: { params: Promise<{ classId: string }> }) {
  const { classId } = use(params)
  return <TaskManagement classId={classId} />
}
