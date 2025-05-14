import { StudentManagement } from "../components/student-management"

export default function StudentsPage({ params }: { params: { classId: string } }) {
  return <StudentManagement classId={params.classId} />
}
