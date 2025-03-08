import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const activities = [
  {
    user: {
      name: "John Smith",
      email: "john.smith@example.com",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    action: "submitted",
    subject: "Algebra Quiz #3",
    time: "2 hours ago",
    class: "Algebra II",
  },
  {
    user: {
      name: "Emily Johnson",
      email: "emily.johnson@example.com",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    action: "was marked absent for",
    subject: "Biology Lab",
    time: "3 hours ago",
    class: "Biology 101",
  },
  {
    user: {
      name: "Michael Brown",
      email: "michael.brown@example.com",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    action: "received grade for",
    subject: "History Essay",
    time: "5 hours ago",
    class: "World History",
  },
  {
    user: {
      name: "Sarah Davis",
      email: "sarah.davis@example.com",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    action: "commented on",
    subject: "Physics Project",
    time: "1 day ago",
    class: "Physics 201",
  },
  {
    user: {
      name: "David Wilson",
      email: "david.wilson@example.com",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    action: "was excused from",
    subject: "English Class",
    time: "1 day ago",
    class: "English Literature",
  },
]

export function RecentActivity() {
  return (
    <div className="space-y-4">
      {activities.map((activity, index) => (
        <div key={index} className="flex items-start gap-4 rounded-lg border p-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
            <AvatarFallback>
              {activity.user.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">
              <span className="font-semibold">{activity.user.name}</span> {activity.action}{" "}
              <span className="font-semibold">{activity.subject}</span>
            </p>
            <p className="text-xs text-muted-foreground">
              {activity.class} • {activity.time}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

