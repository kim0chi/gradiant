"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock, Percent, BarChart3, Users, BookOpen, CheckCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"

// This is a direct test route that bypasses authentication
export default function TestDashboardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [userName, setUserName] = useState("Test Teacher")
  const [userRole, setUserRole] = useState<"teacher" | "student" | "admin">("teacher")
  
  useEffect(() => {
    // Just a short delay to simulate loading
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }, [])
  
  // Mock stats for testing
  const stats = [
    {
      title: "Total Students",
      value: "24",
      icon: <Users className="w-4 h-4" />,
      description: "Active students in your classes",
    },
    {
      title: "Assignments",
      value: "12",
      icon: <BookOpen className="w-4 h-4" />,
      description: "Total active assignments",
    },
    {
      title: "Completion Rate",
      value: "87%",
      icon: <Percent className="w-4 h-4" />,
      description: "Average assignment completion",
    },
    {
      title: "Average Grade",
      value: "B+",
      icon: <BarChart3 className="w-4 h-4" />,
      description: "Class average grade",
    },
  ]
  
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin">
          <Clock className="w-8 h-8" />
        </div>
        <span className="ml-2">Loading...</span>
      </div>
    )
  }
  
  return (
    <div className="container py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Welcome, {userName}</h1>
        <p className="text-muted-foreground">
          Here's what's happening in your classes today.
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Recent Submissions</CardTitle>
            <CardDescription>
              Students who have recently submitted assignments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center">
                  <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-sm">{String.fromCharCode(65 + i)}</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium">Student {i + 1}</p>
                    <p className="text-xs text-muted-foreground">Submitted Assignment {Math.floor(Math.random() * 10) + 1}</p>
                  </div>
                  <div className="ml-auto flex items-center">
                    <Badge variant="secondary" className="mr-2">
                      {Math.floor(Math.random() * 30) + 70}/100
                    </Badge>
                    <span className="text-xs text-muted-foreground">{Math.floor(Math.random() * 12) + 1}h ago</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Upcoming Tasks</CardTitle>
            <CardDescription>
              Tasks that need your attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-muted-foreground" />
                  <div className="ml-4">
                    <p className="text-sm font-medium">Grade Assignment {i + 1}</p>
                    <p className="text-xs text-muted-foreground">Due in {i + 1} day{i > 0 ? 's' : ''}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
