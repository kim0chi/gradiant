"use client"

import { useState, useEffect } from "react"
import { createBrowserClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Skeleton } from "@/components/ui/skeleton"

type AnalyticsWidgetProps = {
  classId: string
  period: string
}

type GradeDistribution = {
  grade: string
  count: number
  color: string
}

export function AnalyticsWidget({ classId, period }: AnalyticsWidgetProps) {
  const supabase = createBrowserClient()
  const router = useRouter()
  const [distribution, setDistribution] = useState<GradeDistribution[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)

      try {
        // In a real app, we would fetch this data from the server
        // For now, we'll simulate it with mock data
        await new Promise((resolve) => setTimeout(resolve, 500))

        // Mock grade distribution
        const mockDistribution: GradeDistribution[] = [
          { grade: "A", count: Math.floor(Math.random() * 10) + 5, color: "#22c55e" },
          { grade: "B", count: Math.floor(Math.random() * 10) + 5, color: "#3b82f6" },
          { grade: "C", count: Math.floor(Math.random() * 10) + 3, color: "#eab308" },
          { grade: "D", count: Math.floor(Math.random() * 5) + 1, color: "#f97316" },
          { grade: "F", count: Math.floor(Math.random() * 3), color: "#ef4444" },
        ]

        setDistribution(mockDistribution)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    if (classId) {
      fetchData()
    }
  }, [classId, period])

  const handleViewFullAnalytics = () => {
    router.push(`/analytics?classId=${classId}&period=${period}`)
  }

  if (loading) {
    return <Skeleton className="h-64 w-full" />
  }

  return (
    <div className="space-y-4">
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={distribution} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="grade" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" name="Students" fill={(entry) => entry.color} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <Button onClick={handleViewFullAnalytics} className="w-full">
        View Full Analytics
      </Button>
    </div>
  )
}
