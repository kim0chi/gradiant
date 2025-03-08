import Link from "next/link"
import { CalendarDays, FileText, GraduationCap, BookOpen, Presentation } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const activities = [
  {
    id: "ACT001",
    title: "Math Quiz 1",
    class: "Algebra II",
    dueDate: "Tomorrow, 9:00 AM",
    type: "Quiz",
    icon: GraduationCap,
  },
  {
    id: "ACT002",
    title: "Biology Lab Report",
    class: "Biology 101",
    dueDate: "Wednesday, 11:59 PM",
    type: "Assignment",
    icon: FileText,
  },
  {
    id: "ACT003",
    title: "World History Midterm",
    class: "World History",
    dueDate: "Friday, 10:00 AM",
    type: "Exam",
    icon: BookOpen,
  },
  {
    id: "ACT004",
    title: "Spanish Oral Presentation",
    class: "Spanish II",
    dueDate: "Next Monday, 1:00 PM",
    type: "Presentation",
    icon: Presentation,
  },
]

export function UpcomingActivities() {
  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-start gap-4 rounded-lg border p-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
            <activity.icon className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <Link href={`/activities/${activity.id}`} className="font-medium hover:underline">
                {activity.title}
              </Link>
              <Badge variant="outline">{activity.type}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">{activity.class}</p>
            <div className="flex items-center pt-1 text-xs text-muted-foreground">
              <CalendarDays className="mr-1 h-3 w-3" />
              {activity.dueDate}
            </div>
          </div>
        </div>
      ))}
      <div className="pt-2 text-center">
        <Button variant="link" asChild>
          <Link href="/activities">View all activities</Link>
        </Button>
      </div>
    </div>
  )
}

