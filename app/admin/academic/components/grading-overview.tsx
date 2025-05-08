"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

type GradeDistribution = {
  grade: string
  count: number
  percentage: number
}

type GradingData = {
  overall: GradeDistribution[]
  bySubject: Record<string, GradeDistribution[]>
}

export function GradingOverview() {
  const [gradingData, setGradingData] = useState<GradingData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overall")

  useEffect(() => {
    async function fetchGradingData() {
      try {
        // In a real application, this would be an API call
        // For demo purposes, we'll simulate the data loading
        setTimeout(() => {
          setGradingData(generateMockGradingData())
          setLoading(false)
        }, 1000)
      } catch (error) {
        console.error("Error fetching grading data:", error)
        setGradingData(generateMockGradingData())
        setLoading(false)
      }
    }

    fetchGradingData()
  }, [])

  // Generate mock data for demo purposes
  function generateMockGradingData(): GradingData {
    const grades = ["A", "B", "C", "D", "F"]
    const subjects = ["Mathematics", "Science", "English", "History", "Computer Science"]

    // Generate overall grade distribution
    const overall = grades.map((grade) => {
      const count = Math.floor(Math.random() * 100) + 10
      return {
        grade,
        count,
        percentage: Math.round((count / 300) * 100),
      }
    })

    // Generate grade distribution by subject
    const bySubject: Record<string, GradeDistribution[]> = {}
    subjects.forEach((subject) => {
      bySubject[subject] = grades.map((grade) => {
        const count = Math.floor(Math.random() * 50) + 5
        return {
          grade,
          count,
          percentage: Math.round((count / 150) * 100),
        }
      })
    })

    return { overall, bySubject }
  }

  // Get color for grade bars
  const getGradeColor = (grade: string) => {
    switch (grade) {
      case "A":
        return "#22c55e" // green-500
      case "B":
        return "#3b82f6" // blue-500
      case "C":
        return "#f59e0b" // amber-500
      case "D":
        return "#f97316" // orange-500
      case "F":
        return "#ef4444" // red-500
      default:
        return "#6b7280" // gray-500
    }
  }

  if (loading) {
    return (
      <div className="w-full">
        <Skeleton className="h-[300px] w-full" />
      </div>
    )
  }

  if (!gradingData) {
    return <div className="text-center py-6 text-muted-foreground">Failed to load grading data</div>
  }

  return (
    <div className="space-y-4">
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overall">Overall</TabsTrigger>
          {Object.keys(gradingData.bySubject).map((subject) => (
            <TabsTrigger key={subject} value={subject}>
              {subject}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="overall" className="pt-4">
          <Card>
            <CardContent className="pt-6">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={gradingData.overall} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="grade" />
                  <YAxis yAxisId="left" orientation="left" stroke="#666" />
                  <YAxis yAxisId="right" orientation="right" stroke="#666" />
                  <Tooltip
                    formatter={(value, name) => {
                      if (name === "count") return [`${value} students`, "Count"]
                      return [`${value}%`, "Percentage"]
                    }}
                  />
                  <Legend />
                  <Bar yAxisId="left" dataKey="count" name="Count" fill="#8884d8" radius={[4, 4, 0, 0]} />
                  <Bar yAxisId="right" dataKey="percentage" name="Percentage" fill="#82ca9d" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {Object.entries(gradingData.bySubject).map(([subject, data]) => (
          <TabsContent key={subject} value={subject} className="pt-4">
            <Card>
              <CardContent className="pt-6">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="grade" />
                    <YAxis yAxisId="left" orientation="left" stroke="#666" />
                    <YAxis yAxisId="right" orientation="right" stroke="#666" />
                    <Tooltip
                      formatter={(value, name) => {
                        if (name === "count") return [`${value} students`, "Count"]
                        return [`${value}%`, "Percentage"]
                      }}
                    />
                    <Legend />
                    <Bar yAxisId="left" dataKey="count" name="Count" fill="#8884d8" radius={[4, 4, 0, 0]} />
                    <Bar yAxisId="right" dataKey="percentage" name="Percentage" fill="#82ca9d" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
