"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, CheckCircle, Clock, RefreshCw, Server, Cpu, Database, Globe, Activity } from "lucide-react"
import { useState } from "react"

// Mock data for demonstration
const systemComponents = [
  {
    id: "comp-1",
    name: "Authentication Service",
    status: "operational",
    uptime: "99.99%",
    lastIncident: "None",
    responseTime: "120ms",
  },
  {
    id: "comp-2",
    name: "Database",
    status: "operational",
    uptime: "99.95%",
    lastIncident: "2023-05-01",
    responseTime: "85ms",
  },
  {
    id: "comp-3",
    name: "API Gateway",
    status: "operational",
    uptime: "99.98%",
    lastIncident: "2023-04-15",
    responseTime: "95ms",
  },
  {
    id: "comp-4",
    name: "File Storage",
    status: "degraded",
    uptime: "98.75%",
    lastIncident: "2023-05-14",
    responseTime: "210ms",
  },
  {
    id: "comp-5",
    name: "Email Service",
    status: "operational",
    uptime: "99.90%",
    lastIncident: "2023-04-22",
    responseTime: "150ms",
  },
  {
    id: "comp-6",
    name: "Reporting Engine",
    status: "operational",
    uptime: "99.85%",
    lastIncident: "2023-04-30",
    responseTime: "180ms",
  },
]

const recentIncidents = [
  {
    id: "inc-1",
    component: "File Storage",
    status: "investigating",
    started: "2023-05-14T10:15:00",
    updated: "2023-05-14T11:30:00",
    description:
      "We're investigating issues with file uploads and downloads. Some users may experience slower than normal response times.",
  },
  {
    id: "inc-2",
    component: "Database",
    status: "resolved",
    started: "2023-05-01T08:45:00",
    updated: "2023-05-01T09:30:00",
    resolved: "2023-05-01T09:30:00",
    description:
      "Database connections were timing out for some users. The issue has been resolved by scaling up database resources.",
  },
  {
    id: "inc-3",
    component: "API Gateway",
    status: "resolved",
    started: "2023-04-15T14:20:00",
    updated: "2023-04-15T15:10:00",
    resolved: "2023-04-15T15:10:00",
    description:
      "API requests were failing with 503 errors. The issue was resolved by fixing a configuration error in the load balancer.",
  },
]

const maintenanceSchedule = [
  {
    id: "maint-1",
    component: "All Systems",
    status: "scheduled",
    scheduledStart: "2023-05-20T01:00:00",
    scheduledEnd: "2023-05-20T03:00:00",
    description: "Scheduled maintenance for system upgrades. All services will be unavailable during this time.",
  },
  {
    id: "maint-2",
    component: "Database",
    status: "completed",
    scheduledStart: "2023-05-05T02:00:00",
    scheduledEnd: "2023-05-05T04:00:00",
    actualEnd: "2023-05-05T03:45:00",
    description: "Database optimization and index rebuilding. No downtime expected, but some operations may be slower.",
  },
]

export function SystemStatus() {
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = () => {
    setIsRefreshing(true)
    // Simulate a refresh delay
    setTimeout(() => {
      setLastUpdated(new Date())
      setIsRefreshing(false)
    }, 1000)
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "operational":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "degraded":
        return <AlertTriangle className="h-5 w-5 text-amber-500" />
      case "outage":
        return <AlertTriangle className="h-5 w-5 text-red-500" />
      default:
        return <Clock className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "operational":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Operational</Badge>
      case "degraded":
        return (
          <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-100">
            Degraded
          </Badge>
        )
      case "outage":
        return <Badge variant="destructive">Outage</Badge>
      case "investigating":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            Investigating
          </Badge>
        )
      case "resolved":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
            Resolved
          </Badge>
        )
      case "scheduled":
        return (
          <Badge variant="outline" className="bg-purple-100 text-purple-800 hover:bg-purple-100">
            Scheduled
          </Badge>
        )
      case "completed":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
            Completed
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getComponentIcon = (name) => {
    if (name.toLowerCase().includes("database")) return <Database className="h-5 w-5" />
    if (name.toLowerCase().includes("api")) return <Globe className="h-5 w-5" />
    if (name.toLowerCase().includes("server") || name.toLowerCase().includes("service"))
      return <Server className="h-5 w-5" />
    if (name.toLowerCase().includes("engine")) return <Cpu className="h-5 w-5" />
    return <Activity className="h-5 w-5" />
  }

  // Calculate overall system status
  const overallStatus = systemComponents.some((comp) => comp.status === "outage")
    ? "outage"
    : systemComponents.some((comp) => comp.status === "degraded")
      ? "degraded"
      : "operational"

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">System Status</h2>
          <p className="text-sm text-muted-foreground">Last updated: {lastUpdated.toLocaleString()}</p>
        </div>
        <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing} className="flex items-center gap-2">
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>Overall System Status</CardTitle>
            {getStatusBadge(overallStatus)}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Uptime (30 days)</p>
              <div className="flex items-center gap-2">
                <Progress value={99.8} className="h-2" />
                <span className="text-sm">99.8%</span>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Active Incidents</p>
              <p className="text-2xl font-bold">{recentIncidents.filter((inc) => inc.status !== "resolved").length}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Upcoming Maintenance</p>
              <p className="text-2xl font-bold">{maintenanceSchedule.filter((m) => m.status === "scheduled").length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="components" className="space-y-4">
        <TabsList>
          <TabsTrigger value="components">Components</TabsTrigger>
          <TabsTrigger value="incidents">Incidents</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
        </TabsList>

        <TabsContent value="components">
          <Card>
            <CardHeader>
              <CardTitle>System Components</CardTitle>
              <CardDescription>Status of individual system components and services.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {systemComponents.map((component) => (
                  <div key={component.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getComponentIcon(component.name)}
                      <div>
                        <p className="font-medium">{component.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Response time: {component.responseTime} | Uptime: {component.uptime}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-sm">Last incident</p>
                        <p className="text-sm font-medium">
                          {component.lastIncident === "None"
                            ? "None"
                            : new Date(component.lastIncident).toLocaleDateString()}
                        </p>
                      </div>
                      {getStatusBadge(component.status)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="incidents">
          <Card>
            <CardHeader>
              <CardTitle>Recent Incidents</CardTitle>
              <CardDescription>Recent system incidents and their current status.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {recentIncidents.map((incident) => (
                  <div key={incident.id} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(incident.status)}
                        <h3 className="font-medium">{incident.component} Issue</h3>
                      </div>
                      <div>{getStatusBadge(incident.status)}</div>
                    </div>
                    <p className="text-sm">{incident.description}</p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                      <p>Started: {new Date(incident.started).toLocaleString()}</p>
                      <p>Last Update: {new Date(incident.updated).toLocaleString()}</p>
                      {incident.resolved && <p>Resolved: {new Date(incident.resolved).toLocaleString()}</p>}
                    </div>
                    <div className="border-t pt-2 mt-2">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="maintenance">
          <Card>
            <CardHeader>
              <CardTitle>Maintenance Schedule</CardTitle>
              <CardDescription>Upcoming and past maintenance activities.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {maintenanceSchedule.map((maintenance) => (
                  <div key={maintenance.id} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-blue-500" />
                        <h3 className="font-medium">{maintenance.component} Maintenance</h3>
                      </div>
                      <div>{getStatusBadge(maintenance.status)}</div>
                    </div>
                    <p className="text-sm">{maintenance.description}</p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                      <p>Scheduled Start: {new Date(maintenance.scheduledStart).toLocaleString()}</p>
                      <p>Scheduled End: {new Date(maintenance.scheduledEnd).toLocaleString()}</p>
                      {maintenance.actualEnd && <p>Actual End: {new Date(maintenance.actualEnd).toLocaleString()}</p>}
                    </div>
                    <div className="border-t pt-2 mt-2">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
