"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Users, GraduationCap, Calendar } from "lucide-react"
import { supabase } from "@/lib/supabase/client"

type StatItem = {
  title: string
  value: number
  icon: React.ReactNode
  description: string
}

export function AcademicStats() {
  const [stats, setStats] = useState<StatItem[]>([
    {
      title: "Total Classes",
      value: 0,
      icon: <Users className="h-5 w-5 text-blue-600" />,
      description: "Active classes",
    },
    {
      title: "Total Subjects",
      value: 0,
      icon: <BookOpen className="h-5 w-5 text-green-600" />,
      description: "Across all grades",
    },
    {
      title: "Teachers",
      value: 0,
      icon: <GraduationCap className="h-5 w-5 text-purple-600" />,
      description: "Assigned to classes",
    },
    {
      title: "Academic Terms",
      value: 0,
      icon: <Calendar className="h-5 w-5 text-orange-600" />,
      description: "Current school year",
    },
  ])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        // In a real application, these would be separate API calls
        // For demo purposes, we'll simulate the data loading

        // Fetch class count
        const { count: classCount, error: classError } = await supabase
          .from("classes")
          .select("*", { count: "exact", head: true })

        // Fetch subject count (simulated)
        const subjectCount = 24 // This would be a real API call in production

        // Fetch teacher count
        const { count: teacherCount, error: teacherError } = await supabase
          .from("profiles")
          .select("*", { count: "exact", head: true })
          .eq("role", "teacher")

        // Fetch academic terms (simulated)
        const termCount = 4 // This would be a real API call in production

        setStats([
          {
            title: "Total Classes",
            value: classCount || 12, // Fallback to demo data if API fails
            icon: <Users className="h-5 w-5 text-blue-600" />,
            description: "Active classes",
          },
          {
            title: "Total Subjects",
            value: subjectCount,
            icon: <BookOpen className="h-5 w-5 text-green-600" />,
            description: "Across all grades",
          },
          {
            title: "Teachers",
            value: teacherCount || 18, // Fallback to demo data if API fails
            icon: <GraduationCap className="h-5 w-5 text-purple-600" />,
            description: "Assigned to classes",
          },
          {
            title: "Academic Terms",
            value: termCount,
            icon: <Calendar className="h-5 w-5 text-orange-600" />,
            description: "Current school year",
          },
        ])
      } catch (error) {
        console.error("Error fetching academic stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            {stat.icon}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? <div className="h-8 w-16 bg-muted animate-pulse rounded" /> : stat.value}
            </div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
