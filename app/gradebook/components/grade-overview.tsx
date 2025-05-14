"use client"

import { useEffect, useState } from "react"
import { createBrowserClient } from "@/lib/supabase/client"
import { Progress } from "@/components/ui/progress"

type GradeOverviewProps = {
  classId: string
  period: string
}

type Stats = {
  averageGrade: number
  completionRate: number
  attendanceRate: number
  targetGrade: number
}

export function GradeOverview({ classId, period }: GradeOverviewProps) {
  const supabase = createBrowserClient()
  const [stats, setStats] = useState<Stats>({
    averageGrade: 0,
    completionRate: 0,
    attendanceRate: 0,
    targetGrade: 85, // Default target grade
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      setLoading(true)

      try {
        // In a real app, we would fetch this data from the server
        // For now, we'll simulate it with a timeout
        await new Promise((resolve) => setTimeout(resolve, 500))

        // Simulate fetching stats based on classId and period
        // In a real app, this would be a Supabase query
        setStats({
          averageGrade: Math.floor(Math.random() * 30) + 70, // 70-100
          completionRate: Math.floor(Math.random() * 40) + 60, // 60-100
          attendanceRate: Math.floor(Math.random() * 20) + 80, // 80-100
          targetGrade: 85,
        })
      } catch (error) {
        console.error("Error fetching stats:", error)
      } finally {
        setLoading(false)
      }
    }

    if (classId) {
      fetchStats()
    }
  }, [classId, period])

  // Format the grade as a letter
  const getLetterGrade = (grade: number) => {
    if (grade >= 90) return "A"
    if (grade >= 80) return "B"
    if (grade >= 70) return "C"
    if (grade >= 60) return "D"
    return "F"
  }

  // Calculate progress towards target grade
  const progressPercentage = Math.min(100, (stats.averageGrade / stats.targetGrade) * 100)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm font-medium">Average Grade</span>
            <span className="text-sm font-medium">
              {stats.averageGrade}% ({getLetterGrade(stats.averageGrade)})
            </span>
          </div>
          <Progress value={stats.averageGrade} className="h-2" />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm font-medium">Completion Rate</span>
            <span className="text-sm font-medium">{stats.completionRate}%</span>
          </div>
          <Progress value={stats.completionRate} className="h-2" />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm font-medium">Attendance Rate</span>
            <span className="text-sm font-medium">{stats.attendanceRate}%</span>
          </div>
          <Progress value={stats.attendanceRate} className="h-2" />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-sm font-medium">Progress Towards Target Grade ({stats.targetGrade}%)</span>
          <span className="text-sm font-medium">{progressPercentage.toFixed(1)}%</span>
        </div>
        <Progress
          value={progressPercentage}
          className="h-2"
          indicatorClassName={progressPercentage >= 100 ? "bg-green-500" : ""}
        />
      </div>
    </div>
  )
}
