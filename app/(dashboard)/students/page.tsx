"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowUpDown, ChevronDown, Download, Filter, MoreHorizontal, Plus, Search, Upload } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const students = [
  {
    id: "STU001",
    name: "Emma Thompson",
    email: "emma.thompson@example.com",
    grade: "10th Grade",
    gpa: 3.8,
    attendance: 98,
    status: "Active",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "STU002",
    name: "Michael Johnson",
    email: "michael.johnson@example.com",
    grade: "9th Grade",
    gpa: 3.5,
    attendance: 95,
    status: "Active",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "STU003",
    name: "Sophia Williams",
    email: "sophia.williams@example.com",
    grade: "11th Grade",
    gpa: 4.0,
    attendance: 99,
    status: "Active",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "STU004",
    name: "James Brown",
    email: "james.brown@example.com",
    grade: "12th Grade",
    gpa: 3.2,
    attendance: 90,
    status: "Active",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "STU005",
    name: "Olivia Davis",
    email: "olivia.davis@example.com",
    grade: "10th Grade",
    gpa: 3.9,
    attendance: 97,
    status: "Active",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "STU006",
    name: "William Miller",
    email: "william.miller@example.com",
    grade: "9th Grade",
    gpa: 3.0,
    attendance: 85,
    status: "At Risk",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "STU007",
    name: "Ava Wilson",
    email: "ava.wilson@example.com",
    grade: "11th Grade",
    gpa: 3.7,
    attendance: 96,
    status: "Active",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "STU008",
    name: "Ethan Moore",
    email: "ethan.moore@example.com",
    grade: "12th Grade",
    gpa: 2.8,
    attendance: 82,
    status: "At Risk",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "STU009",
    name: "Isabella Taylor",
    email: "isabella.taylor@example.com",
    grade: "10th Grade",
    gpa: 3.6,
    attendance: 94,
    status: "Active",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "STU010",
    name: "Alexander Anderson",
    email: "alexander.anderson@example.com",
    grade: "9th Grade",
    gpa: 3.3,
    attendance: 91,
    status: "Active",
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

export default function StudentsPage() {
  const [sortField, setSortField] = useState("name")
  const [sortDirection, setSortDirection] = useState("asc")
  const [searchQuery, setSearchQuery] = useState("")
  const [gradeFilter, setGradeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.id.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesGrade = gradeFilter === "all" || student.grade === gradeFilter
    const matchesStatus = statusFilter === "all" || student.status === statusFilter

    return matchesSearch && matchesGrade && matchesStatus
  })

  const sortedStudents = [...filteredStudents].sort((a, b) => {
    if (sortDirection === "asc") {
      return a[sortField] > b[sortField] ? 1 : -1
    } else {
      return a[sortField] < b[sortField] ? 1 : -1
    }
  })

  const grades = ["9th Grade", "10th Grade", "11th Grade", "12th Grade"]
  const statuses = ["Active", "At Risk", "Inactive"]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Students</h1>
        <p className="text-muted-foreground">Manage student information, track performance, and monitor attendance.</p>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex w-full max-w-sm items-center space-x-2">
                <Input
                  placeholder="Search students..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-9"
                />
                <Button variant="outline" size="sm" className="h-9 gap-1">
                  <Search className="h-4 w-4" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Search</span>
                </Button>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-9 gap-1">
                      <Filter className="h-4 w-4" />
                      <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Filter</span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[200px]">
                    <DropdownMenuLabel>Filter by Grade</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setGradeFilter("all")}>All Grades</DropdownMenuItem>
                    {grades.map((grade) => (
                      <DropdownMenuItem key={grade} onClick={() => setGradeFilter(grade)}>
                        {grade}
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setStatusFilter("all")}>All Statuses</DropdownMenuItem>
                    {statuses.map((status) => (
                      <DropdownMenuItem key={status} onClick={() => setStatusFilter(status)}>
                        {status}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="h-9 gap-1">
                    <Upload className="h-4 w-4" />
                    <span>Import</span>
                  </Button>
                  <Button variant="outline" size="sm" className="h-9 gap-1">
                    <Download className="h-4 w-4" />
                    <span>Export</span>
                  </Button>
                  <Button
                    size="sm"
                    className="h-9 gap-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Student</span>
                  </Button>
                </div>
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">
                      <Button variant="ghost" size="sm" className="-ml-3 h-8" onClick={() => handleSort("id")}>
                        ID
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button variant="ghost" size="sm" className="-ml-3 h-8" onClick={() => handleSort("name")}>
                        Name
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                      <Button variant="ghost" size="sm" className="-ml-3 h-8" onClick={() => handleSort("grade")}>
                        Grade
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                      <Button variant="ghost" size="sm" className="-ml-3 h-8" onClick={() => handleSort("gpa")}>
                        GPA
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                      <Button variant="ghost" size="sm" className="-ml-3 h-8" onClick={() => handleSort("attendance")}>
                        Attendance
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedStudents.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">{student.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={student.avatar} alt={student.name} />
                            <AvatarFallback>
                              {student.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <Link href={`/students/${student.id}`} className="font-medium text-primary hover:underline">
                              {student.name}
                            </Link>
                            <span className="text-xs text-muted-foreground">{student.email}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{student.grade}</TableCell>
                      <TableCell className="hidden md:table-cell">{student.gpa}</TableCell>
                      <TableCell className="hidden md:table-cell">{student.attendance}%</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            student.status === "Active"
                              ? "default"
                              : student.status === "At Risk"
                                ? "destructive"
                                : "secondary"
                          }
                        >
                          {student.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Profile</DropdownMenuItem>
                            <DropdownMenuItem>Edit Student</DropdownMenuItem>
                            <DropdownMenuItem>View Grades</DropdownMenuItem>
                            <DropdownMenuItem>Attendance Record</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">Remove Student</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

