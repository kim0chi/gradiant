"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { PlusCircle, Search, Filter, Download, MoreHorizontal, Pencil, Trash2, BookOpen, GraduationCap } from 'lucide-react'
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
import { useToast } from "@/hooks/use-toast"

type SubjectItem = {
  id: string
  name: string
  code: string
  department: string
  gradeLevel: string
  credits: number
  status: "active" | "inactive" | "archived"
  createdAt: string
}

export default function SubjectsPage() {
  const { toast } = useToast()

  const [subjects, setSubjects] = useState<SubjectItem[]>([])
  const [filteredSubjects, setFilteredSubjects] = useState<SubjectItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [gradeLevelFilter, setGradeLevelFilter] = useState("all")

  useEffect(() => {
    async function fetchSubjects() {
      try {
        // In a real application, this would be an API call
        // For demo purposes, we'll simulate the data loading
        setTimeout(() => {
          const mockData = generateMockSubjects()
          setSubjects(mockData)
          setFilteredSubjects(mockData)
          setLoading(false)
        }, 1000)
      } catch (error) {
        console.error("Error fetching subjects:", error)
        const mockData = generateMockSubjects()
        setSubjects(mockData)
        setFilteredSubjects(mockData)
        setLoading(false)
      }
    }

    fetchSubjects()
  }, [])

  // Apply filters when search query or filters change
  useEffect(() => {
    let result = subjects

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter((subject) => subject.status === statusFilter)
    }

    // Apply grade level filter
    if (gradeLevelFilter !== "all") {
      result = result.filter((subject) => subject.gradeLevel === gradeLevelFilter)
    }

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (subject) =>
          subject.name.toLowerCase().includes(query) ||
          subject.code.toLowerCase().includes(query) ||
          subject.department.toLowerCase().includes(query),
      )
    }

    setFilteredSubjects(result)
  }, [subjects, searchQuery, statusFilter, gradeLevelFilter])

  // Generate mock data for demo purposes
  function generateMockSubjects(): SubjectItem[] {
    const subjectNames = [
      "Mathematics",
      "Algebra",
      "Geometry",
      "Calculus",
      "Biology",
      "Chemistry",
      "Physics",
      "Earth Science",
      "English Literature",
      "Grammar",
      "Creative Writing",
      "World Literature",
      "World History",
      "U.S. History",
      "Geography",
      "Civics",
      "Computer Science",
      "Programming",
      "Digital Media",
      "Web Development",
      "Art",
      "Music",
      "Physical Education",
      "Health",
    ]

    const departments = [
      "Mathematics",
      "Science",
      "Language Arts",
      "Social Studies",
      "Technology",
      "Arts",
      "Physical Education",
    ]

    const gradeLevels = ["Elementary", "Middle School", "Grade 9", "Grade 10", "Grade 11", "Grade 12", "All Grades"]

    const statuses = ["active", "inactive", "archived"] as const

    return Array.from({ length: 24 }, (_, i) => {
      const name = subjectNames[i]
      const department = departments[Math.floor(i / 4) % departments.length]

      return {
        id: `subject-${i + 1}`,
        name,
        code: `${department.substring(0, 3).toUpperCase()}${100 + i}`,
        department,
        gradeLevel: gradeLevels[i % gradeLevels.length],
        credits: Math.floor(Math.random() * 4) + 1,
        status: statuses[i % statuses.length],
        createdAt: new Date(Date.now() - i * 86400000 * 30).toISOString(), // Months ago
      }
    })
  }

  // Get unique grade levels for filter
  const getUniqueGradeLevels = () => {
    const gradeLevels = new Set(subjects.map((subject) => subject.gradeLevel))
    return Array.from(gradeLevels).sort()
  }

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "inactive":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "archived":
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

  // Handle delete subject
  const handleDeleteSubject = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}?`)) return

    try {
      // In a real application, this would be an API call
      // For demo purposes, we'll simulate the deletion

      // Update the subjects list
      setSubjects((prev) => prev.filter((subject) => subject.id !== id))

      toast({
        title: "Subject deleted",
        description: `${name} has been deleted successfully`,
      })
    } catch (error) {
      console.error("Error deleting subject:", error)
      toast({
        title: "Error",
        description: "Failed to delete subject. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Export subjects to CSV
  const exportSubjects = () => {
    // In a real application, this would generate a CSV file
    toast({
      title: "Export started",
      description: "Your subject data is being exported and will download shortly.",
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
          <h1 className="text-3xl font-bold tracking-tight">Subject Management</h1>
          <p className="text-muted-foreground">Create and manage academic subjects and curricula</p>
        </div>
        <Button asChild>
          <Link href="/admin/academic/subjects/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Subject
          </Link>
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search subjects..."
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
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
          <Select value={gradeLevelFilter} onValueChange={setGradeLevelFilter}>
            <SelectTrigger className="w-full sm:w-[150px]">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                <SelectValue placeholder="Grade Level" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Grades</SelectItem>
              {getUniqueGradeLevels().map((grade) => (
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
            <CardTitle>Subjects</CardTitle>
            <CardDescription>
              {filteredSubjects.length} {filteredSubjects.length === 1 ? "subject" : "subjects"} found
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={exportSubjects}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {filteredSubjects.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Subject Name</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Grade Level</TableHead>
                    <TableHead>Credits</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSubjects.map((subject) => (
                    <TableRow key={subject.id}>
                      <TableCell className="font-medium">{subject.name}</TableCell>
                      <TableCell>{subject.code}</TableCell>
                      <TableCell>{subject.department}</TableCell>
                      <TableCell>{subject.gradeLevel}</TableCell>
                      <TableCell>{subject.credits}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getStatusColor(subject.status)}>
                          {subject.status.charAt(0).toUpperCase() + subject.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(subject.createdAt)}</TableCell>
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
                              <Link href={`/admin/academic/subjects/${subject.id}`}>
                                <BookOpen className="mr-2 h-4 w-4" />
                                View Subject
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/academic/subjects/${subject.id}/edit`}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600 focus:text-red-600"
                              onClick={() => handleDeleteSubject(subject.id, subject.name)}
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
                <h3 className="mt-4 text-lg font-medium">No subjects found</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {searchQuery || statusFilter !== "all" || gradeLevelFilter !== "all"
                    ? "No subjects match your search criteria"
                    : "Get started by creating a new subject"}
                </p>
                <Button className="mt-4" asChild>
                  <Link href="/admin/academic/subjects/new">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    New Subject
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
