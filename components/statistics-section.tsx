"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
} from "recharts"

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
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Data-driven insights
          </h2>
          <p className="text-lg text-muted-foreground">
            Visualize student performance and attendance with powerful analytics
            tools.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* ————— Grade Performance Trends ————— */}
          <Card className="min-w-0">
            <CardHeader>
              <CardTitle>Grade Performance Trends</CardTitle>
              <CardDescription>
                Average, highest, and lowest grades over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* THIS wrapper guarantees Recharts can measure a real width & height */}
              <div className="w-full h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={gradeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[60, 100]} />
                    <Tooltip />

                    {/* hard-coded brand colors */}
                    <Line
                      type="monotone"
                      dataKey="average"
                      stroke="#22D3EE"      /* brand-cyan */
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="highest"
                      stroke="#EF4444"      /* brand-red */
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="lowest"
                      stroke="#FBBF24"      /* brand-yellow */
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* ————— Attendance Statistics ————— */}
          <Card className="min-w-0">
            <CardHeader>
              <CardTitle>Attendance Statistics</CardTitle>
              <CardDescription>
                Present, absent, and late attendance records
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="w-full h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={attendanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />

                    <Bar dataKey="present" fill="#22D3EE" />
                    <Bar dataKey="absent"  fill="#EF4444" />
                    <Bar dataKey="late"    fill="#FBBF24" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
