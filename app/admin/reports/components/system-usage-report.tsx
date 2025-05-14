"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { Download, FileText } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { Label } from "@/components/ui/label"
import { addDays, format } from "date-fns"
import {
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// System usage data types
type SystemUsageData = {
  date: string
  requests: number
  errors: number
  responseTimes: number
  cpuUsage: number
  memoryUsage: number
}

type ModuleUsageData = {
  module: string
  usage: number
  performance: number
  color: string
}

type ErrorData = {
  id: string
  timestamp: string
  errorType: string
  module: string
  count: number
  message: string
}

export function SystemUsageReport() {
  const [dateRange, setDateRange] = useState({
    from: addDays(new Date(), -30),
    to: new Date(),
  })
  const [isLoading, setIsLoading] = useState(true)
  const [usageData, setUsageData] = useState<SystemUsageData[]>([])
  const [moduleData, setModuleData] = useState<ModuleUsageData[]>([])
  const [errorData, setErrorData] = useState<ErrorData[]>([])
  const [usageMetrics, setUsageMetrics] = useState({
    totalRequests: 0,
    avgResponseTime: 0,
    errorRate: 0,
    avgCpuUsage: 0,
    avgMemoryUsage: 0,
  })

  useEffect(() => {
    setIsLoading(true)

    // Simulate API call
    const timer = setTimeout(() => {
      // Generate system usage data
      const usage: SystemUsageData[] = []
      const startDate = dateRange.from || addDays(new Date(), -30)
      const endDate = dateRange.to || new Date()

      let currentDate = new Date(startDate)
      let totalRequests = 0
      let totalErrors = 0
      let totalResponseTime = 0
      let totalCpuUsage = 0
      let totalMemoryUsage = 0
      let totalDays = 0

      while (currentDate <= endDate) {
        // Generate random usage data with some patterns
        const dayOfWeek = currentDate.getDay()
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
        const isBusinessHours = Math.random() > 0.3 // Simulate business hour variations

        // Usage is lower on weekends
        const usageFactor = isWeekend ? 0.4 : isBusinessHours ? 1.0 : 0.7

        const requests = Math.floor(10000 * usageFactor * (0.8 + Math.random() * 0.4))
        const errors = Math.floor(requests * (0.005 + Math.random() * 0.03)) // 0.5% to 3.5% error rate
        const responseTimes = Math.floor(200 + Math.random() * 300) // 200-500ms
        const cpuUsage = Math.floor(20 + Math.random() * 40) // 20-60%
        const memoryUsage = Math.floor(30 + Math.random() * 40) // 30-70%

        usage.push({
          date: format(currentDate, "yyyy-MM-dd"),
          requests,
          errors,
          responseTimes,
          cpuUsage,
          memoryUsage,
        })

        totalRequests += requests
        totalErrors += errors
        totalResponseTime += responseTimes
        totalCpuUsage += cpuUsage
        totalMemoryUsage += memoryUsage
        totalDays++

        currentDate = addDays(currentDate, 1)
      }

      // Module usage data
      const modules: ModuleUsageData[] = [
        { module: "Gradebook", usage: 45, performance: 94, color: "#3b82f6" },
        { module: "Attendance", usage: 25, performance: 96, color: "#22c55e" },
        { module: "Analytics", usage: 15, performance: 92, color: "#f59e0b" },
        { module: "Admin", usage: 10, performance: 95, color: "#8b5cf6" },
        { module: "Calendar", usage: 5, performance: 97, color: "#ec4899" },
      ]

      // Error data
      const errors: ErrorData[] = [
        {
          id: "err-001",
          timestamp: format(subDays(new Date(), 2), "yyyy-MM-dd HH:mm:ss"),
          errorType: "Database Connection",
          module: "Gradebook",
          count: 24,
          message: "Connection timeout to database during peak hours",
        },
        {
          id: "err-002",
          timestamp: format(subDays(new Date(), 4), "yyyy-MM-dd HH:mm:ss"),
          errorType: "API Validation",
          module: "Admin",
          count: 18,
          message: "Invalid input parameters for user creation",
        },
        {
          id: "err-003",
          timestamp: format(subDays(new Date(), 1), "yyyy-MM-dd HH:mm:ss"),
          errorType: "Authentication",
          module: "Login",
          count: 42,
          message: "Rate limit exceeded for authentication attempts",
        },
        {
          id: "err-004",
          timestamp: format(subDays(new Date(), 3), "yyyy-MM-dd HH:mm:ss"),
          errorType: "File Storage",
          module: "Analytics",
          count: 7,
          message: "Failed to store exported report files",
        },
        {
          id: "err-005",
          timestamp: format(subDays(new Date(), 5), "yyyy-MM-dd HH:mm:ss"),
          errorType: "Memory Limit",
          module: "Attendance",
          count: 3,
          message: "Out of memory during bulk attendance import",
        },
      ]

      // Calculate metrics
      const avgResponseTime = Math.round(totalResponseTime / totalDays)
      const errorRate = Number.parseFloat(((totalErrors / totalRequests) * 100).toFixed(2))
      const avgCpuUsage = Math.round(totalCpuUsage / totalDays)
      const avgMemoryUsage = Math.round(totalMemoryUsage / totalDays)

      setUsageData(usage)
      setModuleData(modules)
      setErrorData(errors)
      setUsageMetrics({
        totalRequests,
        avgResponseTime,
        errorRate,
        avgCpuUsage,
        avgMemoryUsage,
      })

      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [dateRange])

  const downloadReport = () => {
    toast({
      title: "Report download started",
      description: "Your system usage report is being generated and will download shortly.",
    })

    // In a real application, this would generate a PDF or CSV
    setTimeout(() => {
      toast({
        title: "Report downloaded",
        description: "System usage report has been downloaded.",
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
          <h2 className="text-2xl font-bold tracking-tight">System Usage</h2>
          <p className="text-sm text-muted-foreground">Performance metrics and system health</p>
        </div>

        <div className="flex flex-wrap gap-2">
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

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{usageMetrics.totalRequests.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">API calls and page loads</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Response Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{usageMetrics.avgResponseTime} ms</div>
              <p className="text-xs text-muted-foreground">Average response time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{usageMetrics.errorRate}%</div>
              <p className="text-xs text-muted-foreground">Across all requests</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">CPU Usage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{usageMetrics.avgCpuUsage}%</div>
              <p className="text-xs text-muted-foreground">Average utilization</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{usageMetrics.avgMemoryUsage}%</div>
              <p className="text-xs text-muted-foreground">Average utilization</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>System Performance</CardTitle>
          <CardDescription>Request volume and response times</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={usageData} margin={{ top: 5, right: 30, left: 20, bottom: 30 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(date) => format(new Date(date), "MM/dd")}
                  angle={-45}
                  textAnchor="end"
                  height={70}
                />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip labelFormatter={(label) => format(new Date(label), "MMMM d, yyyy")} />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="requests"
                  name="Requests"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="responseTimes"
                  name="Response Time (ms)"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Module Usage</CardTitle>
            <CardDescription>Usage distribution by system module</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={moduleData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="usage"
                    nameKey="module"
                  >
                    {moduleData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name, props) => [`${value}% of total usage`, props.payload.module]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Module Performance</CardTitle>
            <CardDescription>Performance metrics by module</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={moduleData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[80, 100]} />
                  <YAxis type="category" dataKey="module" width={100} />
                  <Tooltip formatter={(value) => [`${value}%`, "Performance Score"]} />
                  <Legend />
                  <Bar dataKey="performance" name="Performance Score" fill="#22c55e" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>System Resource Usage</CardTitle>
          <CardDescription>CPU and memory utilization</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={usageData} margin={{ top: 10, right: 30, left: 0, bottom: 30 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(date) => format(new Date(date), "MM/dd")}
                  angle={-45}
                  textAnchor="end"
                  height={50}
                />
                <YAxis domain={[0, 100]} />
                <Tooltip
                  labelFormatter={(label) => format(new Date(label), "MMMM d, yyyy")}
                  formatter={(value) => [`${value}%`, ""]}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="cpuUsage"
                  name="CPU Usage"
                  stroke="#ef4444"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="memoryUsage"
                  name="Memory Usage"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent System Errors</CardTitle>
          <CardDescription>Top errors by frequency</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Error Type</TableHead>
                <TableHead>Module</TableHead>
                <TableHead>Count</TableHead>
                <TableHead>Last Occurred</TableHead>
                <TableHead>Message</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {errorData.map((error) => (
                <TableRow key={error.id}>
                  <TableCell className="font-medium">{error.errorType}</TableCell>
                  <TableCell>{error.module}</TableCell>
                  <TableCell>{error.count}</TableCell>
                  <TableCell>{error.timestamp}</TableCell>
                  <TableCell className="max-w-md truncate">{error.message}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button variant="outline" onClick={downloadReport}>
            <FileText className="mr-2 h-4 w-4" />
            Download Error Log
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

function subDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() - days)
  return result
}
