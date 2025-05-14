import { TaskManagement } from "../components/task-management"

export default function TasksPage({ params }: { params: { classId: string } }) {
  return <TaskManagement classId={params.classId} />
}
