"use client"

import { useEffect, useState } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { supabase } from "@/lib/supabase/client"
import Link from "next/link"

type ClassItem = {
  id: string
  name: string
  section: string
  teacher: string
  students: number
  status: "active" | "upcoming" | "completed"
  updatedAt: string
}

export function RecentClasses() {
  const [classes, setClasses] = useState<ClassItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchClasses() {
      try {
        // In a real application, this would be an API call
        // For demo purposes, we'll simulate the data loading
        const { data, error } = await supabase
          .from("classes")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(5)

        if (error) throw error

        // Transform the data
        const transformedData: ClassItem[] =
          data?.map((item: Record<string, unknown>) => ({
            id: item.id as string,
            name: item.name as string,
            section: (item.section as string) || "Section A",
            teacher: (item.teacher_name as string) || "Unassigned",
            students: (item.student_count as number) || Math.floor(Math.random() * 30) + 10,
            status: (item.status as ClassItem["status"]) || "active",
            updatedAt: (item.updated_at as string) || new Date().toISOString(),
          })) || generateMockClasses()

        setClasses(transformedData)
      } catch (error) {
        console.error("Error fetching classes:", error)
        setClasses(generateMockClasses())
      } finally {
        setLoading(false)
      }
    }

    fetchClasses()
  }, [])

  // Generate mock data for demo purposes
  function generateMockClasses(): ClassItem[] {
    const subjects = ["Mathematics", "Science", "English", "History", "Computer Science"]
    const teachers = ["John Smith", "Maria Garcia", "David Kim", "Sarah Johnson", "Robert Chen"]
    const sections = ["Section A", "Section B", "Morning", "Afternoon", "Advanced"]
    const statuses = ["active", "upcoming", "completed"] as const

    return Array.from({ length: 5 }, (_, i) => ({
      id: `class-${i + 1}`,
      name: subjects[i % subjects.length],
      section: sections[i % sections.length],
      teacher: teachers[i % teachers.length],
      students: Math.floor(Math.random() * 30) + 10,
      status: statuses[i % statuses.length],
      updatedAt: new Date(Date.now() - i * 86400000).toISOString(), // Days ago
    }))
  }

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "upcoming":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "completed":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  // Get teacher initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date)
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-4 w-[160px]" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {classes.length > 0 ? (
        classes.map((classItem) => (
          <div key={classItem.id} className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarFallback>{getInitials(classItem.teacher)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-medium">{classItem.name}</h4>
                  <Badge variant="outline" className={getStatusColor(classItem.status)}>
                    {classItem.status.charAt(0).toUpperCase() + classItem.status.slice(1)}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  {classItem.section} • {classItem.teacher} • {classItem.students} students
                </div>
                <div className="text-xs text-muted-foreground mt-1">Updated {formatDate(classItem.updatedAt)}</div>
              </div>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/admin/academic/classes/${classItem.id}`}>View</Link>
            </Button>
          </div>
        ))
      ) : (
        <div className="text-center py-6 text-muted-foreground">
          <p>No classes found</p>
          <Button variant="outline" size="sm" className="mt-2" asChild>
            <Link href="/admin/academic/classes/new">Create a class</Link>
          </Button>
        </div>
      )}
    </div>
  )
}
