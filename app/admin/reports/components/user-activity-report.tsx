"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { Download, FileText, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { Label } from "@/components/ui/label"
import { addDays, format } from "date-fns"
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts"

// User activity data type
type UserActivityData = {
  date: string
  logins: number
  activeUsers: number
  newUsers: number
  averageSessionTime: number
}

// User role distribution data type
type UserRoleData = {
  role: string
  count: number
  percentage: number
  color: string
}

// User device data type
type UserDeviceData = {
  device: string
  count: number
  percentage: number
  color: string
}

export function UserActivityReport() {
  const [selectedUserRole, setSelectedUserRole] = useState("all")
  const [dateRange, setDateRange] = useState({
    from: addDays(new Date(), -30),
    to: new Date(),
  })
  const [isLoading, setIsLoading] = useState(true)
  const [activityData, setActivityData] = useState<UserActivityData[]>([])
  const [roleData, setRoleData] = useState<UserRoleData[]>([])
  const [deviceData, setDeviceData] = useState<UserDeviceData[]>([])
  const [activityMetrics, setActivityMetrics] = useState({
    totalLogins: 0,
    avgDailyLogins: 0,
    activeUsers: 0,
    newUsers: 0,
    avgSessionTime: 0,
    loginChangePercent: 0,
    userChangePercent: 0,
  })

  useEffect(() => {
    setIsLoading(true)

    // Simulate API call
    const timer = setTimeout(() => {
      // Generate user activity data
      const activity: UserActivityData[] = []
      const startDate = dateRange.from || addDays(new Date(), -30)
      const endDate = dateRange.to || new Date()

      let currentDate = new Date(startDate)
      let totalLogins = 0
      let totalActiveUsers = 0
      let totalSessionTime = 0
      let totalDays = 0

      while (currentDate <= endDate) {
        // Generate random activity data with a general upward trend
        const daysFactor = Math.min(1 + totalDays * 0.01, 1.3) // Slight growth factor
        const randomFactor = 0.7 + Math.random() * 0.6 // Random variation

        const logins = Math.floor(100 * daysFactor * randomFactor)
        const activeUsers = Math.floor(70 * daysFactor * randomFactor)
        const newUsers = Math.floor(5 * daysFactor * randomFactor)
        const sessionTime = Math.floor(15 * randomFactor)

        activity.push({
          date: format(currentDate, "yyyy-MM-dd"),
          logins,
          activeUsers,
          newUsers,
          averageSessionTime: sessionTime,
        })

        totalLogins += logins
        totalActiveUsers += activeUsers
        totalSessionTime += sessionTime
        totalDays++

        currentDate = addDays(currentDate, 1)
      }

      // Calculate metrics
      const avgDailyLogins = Math.round(totalLogins / totalDays)
      const avgSessionTime = Math.round(totalSessionTime / totalDays)

      // Calculate percent changes (compare to previous period)
      const previousPeriodDays = totalDays
      const loginChangePercent = Math.round(Math.random() * 20 - 5) // Between -5% and +15%
      const userChangePercent = Math.round(Math.random() * 20) // Between 0% and +20%

      // User role distribution
      const roles: UserRoleData[] = [
        { role: "Students", count: 1250, percentage: 72, color: "#3b82f6" },
        { role: "Teachers", count: 320, percentage: 18, color: "#22c55e" },
        { role: "Administrators", count: 85, percentage: 5, color: "#f59e0b" },
        { role: "Parents", count: 90, percentage: 5, color: "#8b5cf6" },
      ]

      // User device distribution
      const devices: UserDeviceData[] = [
        { device: "Desktop", count: 920, percentage: 53, color: "#3b82f6" },
        { device: "Mobile", count: 650, percentage: 37, color: "#f59e0b" },
        { device: "Tablet", count: 175, percentage: 10, color: "#8b5cf6" },
      ]

      setActivityData(activity)
      setRoleData(roles)
      setDeviceData(devices)
      setActivityMetrics({
        totalLogins,
        avgDailyLogins,
        activeUsers: Math.round(totalActiveUsers / totalDays),
        newUsers: Math.round(activity.reduce((acc, day) => acc + day.newUsers, 0)),
        avgSessionTime,
        loginChangePercent,
        userChangePercent,
      })

      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [selectedUserRole, dateRange])

  const downloadReport = () => {
    toast({
      title: "Report download started",
      description: "Your user activity report is being generated and will download shortly.",
    })

    // In a real application, this would generate a PDF or CSV
    setTimeout(() => {
      toast({
        title: "Report downloaded",
        description: "User activity report has been downloaded.",
      })
    }, 2000)
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-[100px] w-full" />
          ))}
        </div>
        <Skeleton className="h-[350px] w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">User Activity</h2>
          <p className="text-sm text-muted-foreground">Track user engagement and system usage</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Select value={selectedUserRole} onValueChange={setSelectedUserRole}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="User role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Users</SelectItem>
              <SelectItem value="students">Students</SelectItem>
              <SelectItem value="teachers">Teachers</SelectItem>
              <SelectItem value="admins">Administrators</SelectItem>
              <SelectItem value="parents">Parents</SelectItem>
            </SelectContent>
          </Select>

          <Button onClick={downloadReport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <Label>Date Range</Label>
          <DatePickerWithRange date={dateRange} setDate={setDateRange} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Logins</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activityMetrics.totalLogins.toLocaleString()}</div>
              <div
                className={cn(
                  "flex items-center text-xs mt-1",
                  activityMetrics.loginChangePercent >= 0 ? "text-green-600" : "text-red-600",
                )}
              >
                {activityMetrics.loginChangePercent >= 0 ? (
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 mr-1" />
                )}
                <span>{Math.abs(activityMetrics.loginChangePercent)}% from previous period</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Daily Active Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activityMetrics.activeUsers.toLocaleString()}</div>
              <div
                className={cn(
                  "flex items-center text-xs mt-1",
                  activityMetrics.userChangePercent >= 0 ? "text-green-600" : "text-red-600",
                )}
              >
                {activityMetrics.userChangePercent >= 0 ? (
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 mr-1" />
                )}
                <span>{Math.abs(activityMetrics.userChangePercent)}% from previous period</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">New Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activityMetrics.newUsers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">During selected period</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Avg. Session Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activityMetrics.avgSessionTime} min</div>
              <p className="text-xs text-muted-foreground">Per user session</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Activity Over Time</CardTitle>
          <CardDescription>Daily logins and active users</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={activityData} margin={{ top: 5, right: 30, left: 20, bottom: 30 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(date) => format(new Date(date), "MM/dd")}
                  angle={-45}
                  textAnchor="end"
                  height={70}
                />
                <YAxis />
                <Tooltip labelFormatter={(label) => format(new Date(label), "MMMM d, yyyy")} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="logins"
                  name="Logins"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  activeDot={{ r: 8 }}
                />
                <Line type="monotone" dataKey="activeUsers" name="Active Users" stroke="#22c55e" strokeWidth={2} />
                <Line type="monotone" dataKey="newUsers" name="New Users" stroke="#f59e0b" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>User Role Distribution</CardTitle>
            <CardDescription>Breakdown of users by role</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={roleData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="count"
                    nameKey="role"
                  >
                    {roleData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name, props) => [
                      `${value} users (${props.payload.percentage}%)`,
                      props.payload.role,
                    ]}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Device Usage</CardTitle>
            <CardDescription>User access by device type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={deviceData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="device" />
                  <Tooltip formatter={(value) => [`${value} users`, "Count"]} />
                  <Legend />
                  <Bar dataKey="count" name="Users" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Session Time Analysis</CardTitle>
          <CardDescription>Average time spent on the platform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityData} margin={{ top: 10, right: 30, left: 0, bottom: 30 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(date) => format(new Date(date), "MM/dd")}
                  angle={-45}
                  textAnchor="end"
                  height={50}
                />
                <YAxis />
                <Tooltip
                  labelFormatter={(label) => format(new Date(label), "MMMM d, yyyy")}
                  formatter={(value) => [`${value} minutes`, "Avg. Session"]}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="averageSessionTime"
                  name="Avg. Session Time"
                  fill="#8b5cf6"
                  stroke="#8b5cf6"
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button variant="outline" onClick={downloadReport}>
            <FileText className="mr-2 h-4 w-4" />
            Download Detailed Report
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

function cn(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}
