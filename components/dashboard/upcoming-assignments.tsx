import { CalendarDays, FileText, GraduationCap } from "lucide-react"

const assignments = [
  {
    title: "Math Quiz",
    class: "Algebra II",
    dueDate: "Tomorrow, 9:00 AM",
    type: "Quiz",
    icon: GraduationCap,
  },
  {
    title: "Lab Report",
    class: "Biology 101",
    dueDate: "Wednesday, 11:59 PM",
    type: "Assignment",
    icon: FileText,
  },
  {
    title: "Research Paper Outline",
    class: "World History",
    dueDate: "Friday, 3:00 PM",
    type: "Assignment",
    icon: FileText,
  },
  {
    title: "Midterm Exam",
    class: "Physics 201",
    dueDate: "Next Monday, 10:00 AM",
    type: "Exam",
    icon: GraduationCap,
  },
]

export function UpcomingAssignments() {
  return (
    <div className="space-y-4">
      {assignments.map((assignment, index) => (
        <div key={index} className="flex items-start gap-4 rounded-lg border p-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
            <assignment.icon className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 space-y-1">
            <p className="font-medium leading-none">{assignment.title}</p>
            <p className="text-sm text-muted-foreground">{assignment.class}</p>
            <div className="flex items-center pt-1 text-xs text-muted-foreground">
              <CalendarDays className="mr-1 h-3 w-3" />
              {assignment.dueDate}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

