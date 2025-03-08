"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const gradeData = [
  { month: "Jan", average: 78, highest: 95, lowest: 62 },
  { month: "Feb", average: 81, highest: 97, lowest: 65 },
  { month: "Mar", average: 80, highest: 96, lowest: 64 },
  { month: "Apr", average: 83, highest: 98, lowest: 68 },
  { month: "May", average: 85, highest: 99, lowest: 70 },
  { month: "Jun", average: 87, highest: 100, lowest: 72 },
]

const attendanceData = [
  { month: "Jan", present: 92, absent: 5, late: 3 },
  { month: "Feb", present: 90, absent: 7, late: 3 },
  { month: "Mar", present: 93, absent: 4, late: 3 },
  { month: "Apr", present: 95, absent: 3, late: 2 },
  { month: "May", present: 94, absent: 4, late: 2 },
  { month: "Jun", present: 96, absent: 2, late: 2 },
]

export function StatisticsSection() {
  return (
    <section className="py-20 md:py-32 bg-gray-50 dark:bg-gray-900">
      <div className="container">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">Data-driven insights</h2>
          <p className="text-lg text-muted-foreground">
            Visualize student performance and attendance with powerful analytics tools.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Grade Performance Trends</CardTitle>
              <CardDescription>Average, highest, and lowest grades over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  average: {
                    label: "Average",
                    color: "hsl(var(--chart-1))",
                  },
                  highest: {
                    label: "Highest",
                    color: "hsl(var(--chart-2))",
                  },
                  lowest: {
                    label: "Lowest",
                    color: "hsl(var(--chart-3))",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={gradeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[60, 100]} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line type="monotone" dataKey="average" stroke="var(--color-average)" strokeWidth={2} />
                    <Line type="monotone" dataKey="highest" stroke="var(--color-highest)" strokeWidth={2} />
                    <Line type="monotone" dataKey="lowest" stroke="var(--color-lowest)" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Attendance Statistics</CardTitle>
              <CardDescription>Present, absent, and late attendance records</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  present: {
                    label: "Present",
                    color: "hsl(var(--chart-1))",
                  },
                  absent: {
                    label: "Absent",
                    color: "hsl(var(--chart-2))",
                  },
                  late: {
                    label: "Late",
                    color: "hsl(var(--chart-3))",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={attendanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="present" fill="var(--color-present)" />
                    <Bar dataKey="absent" fill="var(--color-absent)" />
                    <Bar dataKey="late" fill="var(--color-late)" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

