"use client"

import { CheckCircle, AlertTriangle, XCircle } from "lucide-react"
import { Progress } from "@/components/ui/progress"

export function AdminSystemHealth() {
  // Sample system health data
  const systemComponents = [
    { name: "Database", status: "healthy", uptime: "99.98%", load: 24 },
    { name: "API Server", status: "healthy", uptime: "100%", load: 32 },
    { name: "Authentication", status: "healthy", uptime: "99.99%", load: 18 },
    { name: "File Storage", status: "warning", uptime: "99.95%", load: 78 },
    { name: "Email Service", status: "healthy", uptime: "99.97%", load: 12 },
  ]

  // Function to render status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-amber-500" />
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <CheckCircle className="h-4 w-4 text-green-500" />
    }
  }

  // Function to get load color
  const getLoadColor = (load: number) => {
    if (load < 50) return "bg-green-500"
    if (load < 80) return "bg-amber-500"
    return "bg-red-500"
  }

  return (
    <div className="space-y-4">
      {systemComponents.map((component, index) => (
        <div key={index} className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {getStatusIcon(component.status)}
              <span className="text-sm font-medium ml-2">{component.name}</span>
            </div>
            <span className="text-xs text-muted-foreground">Uptime: {component.uptime}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Progress value={component.load} className={`h-2 [&>div]:${getLoadColor(component.load)}`} />
            <span className="text-xs text-muted-foreground w-8">{component.load}%</span>
          </div>
        </div>
      ))}
      <div className="pt-2 text-xs text-muted-foreground">Last updated: Today at 10:42 AM</div>
    </div>
  )
}
