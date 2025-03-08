"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const data = [
  { grade: "A", count: 32, percentage: 21 },
  { grade: "B+", count: 45, percentage: 30 },
  { grade: "B", count: 37, percentage: 25 },
  { grade: "C+", count: 18, percentage: 12 },
  { grade: "C", count: 10, percentage: 7 },
  { grade: "D", count: 5, percentage: 3 },
  { grade: "F", count: 3, percentage: 2 },
]

export function GradeDistribution() {
  return (
    <ChartContainer
      config={{
        count: {
          label: "Students",
          color: "hsl(var(--chart-1))",
        },
      }}
      className="h-[300px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <XAxis dataKey="grade" />
          <YAxis />
          <ChartTooltip
            content={
              <ChartTooltipContent
                formatter={(value, name) => (
                  <div className="flex min-w-[100px] items-center text-xs text-muted-foreground">
                    <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground">
                      {value} students ({data.find((item) => item.count === value)?.percentage}%)
                    </div>
                  </div>
                )}
              />
            }
          />
          <Bar dataKey="count" fill="var(--color-count)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}

