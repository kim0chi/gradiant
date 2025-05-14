"use client"

import { UserPlus, LogIn, Settings, FileEdit, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"

// Sample activity data
const activities = [
  {
    id: 1,
    type: "user_login",
    user: "John Smith",
    time: "2 minutes ago",
    icon: <LogIn className="h-4 w-4" />,
    iconColor: "text-blue-500",
  },
  {
    id: 2,
    type: "user_created",
    user: "Emma Thompson",
    time: "1 hour ago",
    icon: <UserPlus className="h-4 w-4" />,
    iconColor: "text-green-500",
  },
  {
    id: 3,
    type: "settings_changed",
    user: "Admin User",
    time: "3 hours ago",
    icon: <Settings className="h-4 w-4" />,
    iconColor: "text-amber-500",
  },
  {
    id: 4,
    type: "record_updated",
    user: "Sarah Johnson",
    time: "5 hours ago",
    icon: <FileEdit className="h-4 w-4" />,
    iconColor: "text-purple-500",
  },
  {
    id: 5,
    type: "record_deleted",
    user: "Michael Chen",
    time: "1 day ago",
    icon: <Trash2 className="h-4 w-4" />,
    iconColor: "text-red-500",
  },
]

export function AdminActivityFeed() {
  // Function to render activity message
  const getActivityMessage = (activity: (typeof activities)[0]) => {
    switch (activity.type) {
      case "user_login":
        return `${activity.user} logged into the system`
      case "user_created":
        return `${activity.user} was added to the system`
      case "settings_changed":
        return `${activity.user} updated system settings`
      case "record_updated":
        return `${activity.user} modified a record`
      case "record_deleted":
        return `${activity.user} deleted a record`
      default:
        return `${activity.user} performed an action`
    }
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-start">
          <div className={cn("mt-0.5 mr-3", activity.iconColor)}>{activity.icon}</div>
          <div>
            <p className="text-sm">{getActivityMessage(activity)}</p>
            <p className="text-xs text-muted-foreground">{activity.time}</p>
          </div>
        </div>
      ))}
      <div className="pt-2 text-center">
        <a href="/admin/logs" className="text-xs text-primary hover:underline">
          View all activity logs
        </a>
      </div>
    </div>
  )
}
