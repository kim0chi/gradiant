"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import {
  Line,
  LineChart,
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// Mock data for demonstration
const deliveryData = [
  { date: "2023-05-01", email: 120, push: 85, inApp: 150 },
  { date: "2023-05-02", email: 132, push: 91, inApp: 163 },
  { date: "2023-05-03", email: 101, push: 78, inApp: 142 },
  { date: "2023-05-04", email: 134, push: 95, inApp: 176 },
  { date: "2023-05-05", email: 90, push: 67, inApp: 129 },
  { date: "2023-05-06", email: 85, push: 62, inApp: 119 },
  { date: "2023-05-07", email: 90, push: 71, inApp: 123 },
  { date: "2023-05-08", email: 145, push: 104, inApp: 186 },
  { date: "2023-05-09", email: 132, push: 91, inApp: 172 },
  { date: "2023-05-10", email: 155, push: 107, inApp: 192 },
  { date: "2023-05-11", email: 149, push: 97, inApp: 187 },
  { date: "2023-05-12", email: 136, push: 89, inApp: 167 },
  { date: "2023-05-13", email: 127, push: 83, inApp: 153 },
  { date: "2023-05-14", email: 130, push: 86, inApp: 159 },
]

const engagementData = [
  { date: "2023-05-01", delivered: 355, opened: 278, clicked: 142 },
  { date: "2023-05-02", delivered: 386, opened: 301, clicked: 156 },
  { date: "2023-05-03", delivered: 321, opened: 245, clicked: 119 },
  { date: "2023-05-04", delivered: 405, opened: 324, clicked: 172 },
  { date: "2023-05-05", delivered: 286, opened: 217, clicked: 98 },
  { date: "2023-05-06", delivered: 266, opened: 199, clicked: 87 },
  { date: "2023-05-07", delivered: 284, opened: 213, clicked: 95 },
  { date: "2023-05-08", delivered: 435, opened: 348, clicked: 191 },
  { date: "2023-05-09", delivered: 395, opened: 316, clicked: 158 },
  { date: "2023-05-10", delivered: 454, opened: 372, clicked: 201 },
  { date: "2023-05-11", delivered: 433, opened: 346, clicked: 173 },
  { date: "2023-05-12", delivered: 392, opened: 313, clicked: 157 },
  { date: "2023-05-13", delivered: 363, opened: 290, clicked: 145 },
  { date: "2023-05-14", delivered: 375, opened: 300, clicked: 150 },
]

const categoryData = [
  { name: "System", value: 25 },
  { name: "Academic", value: 40 },
  { name: "Event", value: 20 },
  { name: "Feature", value: 15 },
]

const recipientData = [
  { name: "Teachers", count: 45 },
  { name: "Students", count: 65 },
  { name: "Parents", count: 35 },
  { name: "Admins", count: 20 },
  { name: "All Users", count: 15 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"]

export function NotificationAnalytics() {
  const [timeRange, setTimeRange] = useState("14d")

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="14d">Last 14 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5,231</div>
            <p className="text-xs text-muted-foreground">+12% from last period</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78.3%</div>
            <p className="text-xs text-muted-foreground">+2.5% from last period</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Click Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42.1%</div>
            <p className="text-xs text-muted-foreground">+1.2% from last period</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Response Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.2h</div>
            <p className="text-xs text-muted-foreground">-0.5h from last period</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="delivery" className="space-y-4">
        <TabsList>
          <TabsTrigger value="delivery">Delivery Channels</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="recipients">Recipients</TabsTrigger>
        </TabsList>

        <TabsContent value="delivery">
          <Card>
            <CardHeader>
              <CardTitle>Notification Delivery by Channel</CardTitle>
              <CardDescription>Number of notifications sent through each channel over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ChartContainer
                  config={{
                    email: {
                      label: "Email",
                      color: "hsl(var(--chart-1))",
                    },
                    push: {
                      label: "Push",
                      color: "hsl(var(--chart-2))",
                    },
                    inApp: {
                      label: "In-App",
                      color: "hsl(var(--chart-3))",
                    },
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={deliveryData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="date"
                        tickFormatter={(value) =>
                          new Date(value).toLocaleDateString(undefined, { month: "short", day: "numeric" })
                        }
                      />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Line type="monotone" dataKey="email" stroke="var(--color-email)" strokeWidth={2} />
                      <Line type="monotone" dataKey="push" stroke="var(--color-push)" strokeWidth={2} />
                      <Line type="monotone" dataKey="inApp" stroke="var(--color-inApp)" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="engagement">
          <Card>
            <CardHeader>
              <CardTitle>Notification Engagement</CardTitle>
              <CardDescription>Delivery, open, and click rates over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ChartContainer
                  config={{
                    delivered: {
                      label: "Delivered",
                      color: "hsl(var(--chart-1))",
                    },
                    opened: {
                      label: "Opened",
                      color: "hsl(var(--chart-2))",
                    },
                    clicked: {
                      label: "Clicked",
                      color: "hsl(var(--chart-3))",
                    },
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={engagementData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="date"
                        tickFormatter={(value) =>
                          new Date(value).toLocaleDateString(undefined, { month: "short", day: "numeric" })
                        }
                      />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Bar dataKey="delivered" fill="var(--color-delivered)" />
                      <Bar dataKey="opened" fill="var(--color-opened)" />
                      <Bar dataKey="clicked" fill="var(--color-clicked)" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories">
          <Card>
            <CardHeader>
              <CardTitle>Notifications by Category</CardTitle>
              <CardDescription>Distribution of notifications across different categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={150}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} notifications`, "Count"]} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recipients">
          <Card>
            <CardHeader>
              <CardTitle>Notifications by Recipient Group</CardTitle>
              <CardDescription>Distribution of notifications across different recipient groups</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart layout="vertical" data={recipientData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" name="Notifications Sent" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
