"use client"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// Sample data for the chart
const data = [
  { date: "Jan", logins: 120, actions: 240 },
  { date: "Feb", logins: 160, actions: 320 },
  { date: "Mar", logins: 180, actions: 380 },
  { date: "Apr", logins: 220, actions: 460 },
  { date: "May", logins: 260, actions: 520 },
  { date: "Jun", logins: 300, actions: 600 },
  { date: "Jul", logins: 340, actions: 680 },
]

export function AdminMetricsChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>System Activity</CardTitle>
        <CardDescription>User logins and actions over time</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                tickLine={{ stroke: "hsl(var(--muted-foreground))" }}
                axisLine={{ stroke: "hsl(var(--muted-foreground))" }}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                tickLine={{ stroke: "hsl(var(--muted-foreground))" }}
                axisLine={{ stroke: "hsl(var(--muted-foreground))" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  borderColor: "hsl(var(--border))",
                  color: "hsl(var(--foreground))",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="logins"
                name="User Logins"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="actions"
                name="User Actions"
                stroke="hsl(var(--secondary))"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
