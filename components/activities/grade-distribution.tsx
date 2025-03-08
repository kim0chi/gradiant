"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

export function GradeDistribution({ submissions, maxPoints }) {
  // Group submissions by grade ranges
  const calculateGradeData = () => {
    if (!submissions || submissions.length === 0) {
      return []
    }

    const gradeRanges = [
      { name: "A (90-100%)", min: 0.9 * maxPoints, max: maxPoints, color: "#4ade80" },
      { name: "B (80-89%)", min: 0.8 * maxPoints, max: 0.9 * maxPoints - 0.01, color: "#60a5fa" },
      { name: "C (70-79%)", min: 0.7 * maxPoints, max: 0.8 * maxPoints - 0.01, color: "#facc15" },
      { name: "D (60-69%)", min: 0.6 * maxPoints, max: 0.7 * maxPoints - 0.01, color: "#f87171" },
      { name: "F (0-59%)", min: 0, max: 0.6 * maxPoints - 0.01, color: "#f43f5e" },
    ]

    const gradesCount = gradeRanges.map((range) => {
      const count = submissions.filter(
        (sub) => sub.grade !== null && sub.grade >= range.min && sub.grade <= range.max,
      ).length

      return {
        name: range.name,
        value: count,
        color: range.color,
      }
    })

    // Add missing submissions
    const missingCount = submissions.filter((sub) => sub.grade === null).length
    if (missingCount > 0) {
      gradesCount.push({
        name: "Not Graded",
        value: missingCount,
        color: "#94a3b8",
      })
    }

    return gradesCount.filter((item) => item.value > 0)
  }

  const gradeData = calculateGradeData()

  if (gradeData.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center text-center">
        <p className="text-muted-foreground">No grade data available yet</p>
      </div>
    )
  }

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={gradeData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={90}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => (percent > 0.05 ? `${name} ${(percent * 100).toFixed(0)}%` : "")}
          >
            {gradeData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `${value} students`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

