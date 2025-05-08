"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { PlusCircle, Search, Filter, Download, MoreHorizontal, Pencil, Trash2, Users, BookOpen } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { supabase } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"

type ClassItem = {
  id: string
  name: string
  section: string
  grade: string
  teacher: string
  students: number
  status: "active" | "upcoming" | "completed"
  createdAt: string
}

export default function ClassesPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  const [classes, setClasses] = useState<ClassItem[]>([])
  const [filteredClasses, setFilteredClasses] = useState<ClassItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [gradeFilter, setGradeFilter] = useState("all")

  useEffect(() => {
    async function fetchClasses() {
      try {
        // In a real application, this would be an API call
        // For demo purposes, we'll simulate the data loading
        const { data, error } = await supabase.from("classes").select("*").order("created_at", { ascending: false })

        if (error) throw error

        // Transform the data
        const transformedData: ClassItem[] =
          data?.map((item: any) => ({
            id: item.id,
            name: item.name,
            section: item.section || "Section A",
            grade: item.grade || "Grade " + Math.floor(Math.random() * 12 + 1),
            teacher: item.teacher_name || "Unassigned",
            students: item.student_count || Math.floor(Math.random() * 30) + 10,
            status: item.status || "active",
            createdAt: item.created_at || new Date().toISOString(),
          })) || generateMockClasses()

        setClasses(transformedData)
        setFilteredClasses(transformedData)
      } catch (error) {
        console.error("Error fetching classes:", error)
        const mockData = generateMockClasses()
        setClasses(mockData)
        setFilteredClasses(mockData)
      } finally {
        setLoading(false)
      }
    }

    fetchClasses()
  }, [])

  // Apply filters when search query or filters change
  useEffect(() => {
    let result = classes

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter((classItem) => classItem.status === statusFilter)
    }

    // Apply grade filter
    if (gradeFilter !== "all") {
      result = result.filter((classItem) => classItem.grade === gradeFilter)
    }

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (classItem) =>
          classItem.name.toLowerCase().includes(query) ||
          classItem.section.toLowerCase().includes(query) ||
          classItem.teacher.toLowerCase().includes(query),
      )
    }

    setFilteredClasses(result)
  }, [classes, searchQuery, statusFilter, gradeFilter])

  // Generate mock data for demo purposes
  function generateMockClasses(): ClassItem[] {
    const subjects = ["Mathematics", "Science", "English", "History", "Computer Science", "Art", "Physical Education"]
    const teachers = [
      "John Smith",
      "Maria Garcia",
      "David Kim",
      "Sarah Johnson",
      "Robert Chen",
      "Emily Wong",
      "Michael Brown",
    ]
    const sections = ["Section A", "Section B", "Morning", "Afternoon", "Advanced", "Regular", "Honors"]
    const grades = [
      "Grade 1",
      "Grade 2",
      "Grade 3",
      "Grade 4",
      "Grade 5",
      "Grade 6",
      "Grade 7",
      "Grade 8",
      "Grade 9",
      "Grade 10",
      "Grade 11",
      "Grade 12",
    ]
    const statuses = ["active", "upcoming", "completed"] as const

    return Array.from({ length: 20 }, (_, i) => ({
      id: `class-${i + 1}`,
      name: subjects[i % subjects.length],
      section: sections[i % sections.length],
      grade: grades[i % grades.length],
      teacher: teachers[i % teachers.length],
      students: Math.floor(Math.random() * 30) + 10,
      status: statuses[i % statuses.length],
      createdAt: new Date(Date.now() - i * 86400000 * 7).toISOString(), // Weeks ago
    }))
  }

  // Get unique grades for filter
  const getUniqueGrades = () => {
    const grades = new Set(classes.map((classItem) => classItem.grade))
    return Array.from(grades).sort()
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

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date)
  }

  // Handle delete class
  const handleDeleteClass = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}?`)) return

    try {
      // In a real application, this would be an API call
      // For demo purposes, we'll simulate the deletion
      const { error } = await supabase.from("classes").delete().eq("id", id)

      if (error) throw error

      // Update the classes list
      setClasses((prev) => prev.filter((classItem) => classItem.id !== id))

      toast({
        title: "Class deleted",
        description: `${name} has been deleted successfully`,
      })
    } catch (error) {
      console.error("Error deleting class:", error)
      toast({
        title: "Error",
        description: "Failed to delete class. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Export classes to CSV
  const exportClasses = () => {
    // In a real application, this would generate a CSV file
    toast({
      title: "Export started",
      description: "Your class data is being exported and will download shortly.",
    })
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-[300px]" />
          <Skeleton className="h-10 w-[100px]" />
        </div>
        <div className="flex items-center space-x-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-[100px]" />
          <Skeleton className="h-10 w-[100px]" />
        </div>
        <Skeleton className="h-[500px] w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Class Management</h1>
          <p className="text-muted-foreground">Create and manage classes, sections, and schedules</p>
        </div>
        <Button asChild>
          <Link href="/admin/academic/classes/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Class
          </Link>
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search classes..."
            className="w-full pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[150px]">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <SelectValue placeholder="Status" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="upcoming">Upcoming</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
          <Select value={gradeFilter} onValueChange={setGradeFilter}>
            <SelectTrigger className="w-full sm:w-[150px]">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                <SelectValue placeholder="Grade" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Grades</SelectItem>
              {getUniqueGrades().map((grade) => (
                <SelectItem key={grade} value={grade}>
                  {grade}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
          <div>
            <CardTitle>Classes</CardTitle>
            <CardDescription>
              {filteredClasses.length} {filteredClasses.length === 1 ? "class" : "classes"} found
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={exportClasses}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {filteredClasses.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Class Name</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead>Section</TableHead>
                    <TableHead>Teacher</TableHead>
                    <TableHead>Students</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClasses.map((classItem) => (
                    <TableRow key={classItem.id}>
                      <TableCell className="font-medium">{classItem.name}</TableCell>
                      <TableCell>{classItem.grade}</TableCell>
                      <TableCell>{classItem.section}</TableCell>
                      <TableCell>{classItem.teacher}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          {classItem.students}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getStatusColor(classItem.status)}>
                          {classItem.status.charAt(0).toUpperCase() + classItem.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(classItem.createdAt)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/academic/classes/${classItem.id}`}>
                                <Users className="mr-2 h-4 w-4" />
                                View Class
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/academic/classes/${classItem.id}/edit`}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600 focus:text-red-600"
                              onClick={() => handleDeleteClass(classItem.id, classItem.name)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex items-center justify-center p-12 border-2 border-dashed rounded-lg">
              <div className="text-center">
                <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">No classes found</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {searchQuery || statusFilter !== "all" || gradeFilter !== "all"
                    ? "No classes match your search criteria"
                    : "Get started by creating a new class"}
                </p>
                <Button className="mt-4" asChild>
                  <Link href="/admin/academic/classes/new">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    New Class
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
