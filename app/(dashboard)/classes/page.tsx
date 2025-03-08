"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowUpDown, ChevronDown, Filter, MoreHorizontal, Plus, Search } from "lucide-react"

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

const classes = [
  {
    id: "CLS001",
    name: "Algebra II",
    subject: "Mathematics",
    grade: "10th Grade",
    students: 28,
    schedule: "MWF 9:00 AM - 10:30 AM",
    room: "Room 203",
    status: "Active",
  },
  {
    id: "CLS002",
    name: "Biology 101",
    subject: "Science",
    grade: "9th Grade",
    students: 32,
    schedule: "TTh 11:00 AM - 12:30 PM",
    room: "Lab 105",
    status: "Active",
  },
  {
    id: "CLS003",
    name: "World History",
    subject: "Social Studies",
    grade: "11th Grade",
    students: 25,
    schedule: "MWF 1:00 PM - 2:30 PM",
    room: "Room 108",
    status: "Active",
  },
  {
    id: "CLS004",
    name: "English Literature",
    subject: "English",
    grade: "12th Grade",
    students: 22,
    schedule: "TTh 9:00 AM - 10:30 AM",
    room: "Room 301",
    status: "Active",
  },
  {
    id: "CLS005",
    name: "Physics 201",
    subject: "Science",
    grade: "11th Grade",
    students: 24,
    schedule: "MWF 11:00 AM - 12:30 PM",
    room: "Lab 202",
    status: "Active",
  },
  {
    id: "CLS006",
    name: "Spanish II",
    subject: "Foreign Language",
    grade: "10th Grade",
    students: 20,
    schedule: "TTh 1:00 PM - 2:30 PM",
    room: "Room 107",
    status: "Active",
  },
  {
    id: "CLS007",
    name: "Art History",
    subject: "Arts",
    grade: "12th Grade",
    students: 18,
    schedule: "F 9:00 AM - 12:00 PM",
    room: "Art Studio",
    status: "Inactive",
  },
  {
    id: "CLS008",
    name: "Computer Science",
    subject: "Technology",
    grade: "11th Grade",
    students: 26,
    schedule: "MWF 2:00 PM - 3:30 PM",
    room: "Computer Lab",
    status: "Active",
  },
]

export default function ClassesPage() {
  const [sortField, setSortField] = useState("name")
  const [sortDirection, setSortDirection] = useState("asc")
  const [searchQuery, setSearchQuery] = useState("")
  const [subjectFilter, setSubjectFilter] = useState("all")
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

  const filteredClasses = classes.filter((cls) => {
    const matchesSearch =
      cls.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cls.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cls.id.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesSubject = subjectFilter === "all" || cls.subject === subjectFilter
    const matchesGrade = gradeFilter === "all" || cls.grade === gradeFilter
    const matchesStatus = statusFilter === "all" || cls.status === statusFilter

    return matchesSearch && matchesSubject && matchesGrade && matchesStatus
  })

  const sortedClasses = [...filteredClasses].sort((a, b) => {
    if (sortDirection === "asc") {
      return a[sortField] > b[sortField] ? 1 : -1
    } else {
      return a[sortField] < b[sortField] ? 1 : -1
    }
  })

  const subjects = ["Mathematics", "Science", "Social Studies", "English", "Foreign Language", "Arts", "Technology"]
  const grades = ["9th Grade", "10th Grade", "11th Grade", "12th Grade"]
  const statuses = ["Active", "Inactive"]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Classes</h1>
        <p className="text-muted-foreground">Manage and organize your classes and sections.</p>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex w-full max-w-sm items-center space-x-2">
                <Input
                  placeholder="Search classes..."
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
                    <DropdownMenuLabel>Filter by Subject</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setSubjectFilter("all")}>All Subjects</DropdownMenuItem>
                    {subjects.map((subject) => (
                      <DropdownMenuItem key={subject} onClick={() => setSubjectFilter(subject)}>
                        {subject}
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
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
                <Button
                  size="sm"
                  className="h-9 gap-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Class</span>
                </Button>
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">
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
                    <TableHead>
                      <Button variant="ghost" size="sm" className="-ml-3 h-8" onClick={() => handleSort("subject")}>
                        Subject
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button variant="ghost" size="sm" className="-ml-3 h-8" onClick={() => handleSort("grade")}>
                        Grade
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead className="text-right">
                      <Button variant="ghost" size="sm" className="-ml-3 h-8" onClick={() => handleSort("students")}>
                        Students
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedClasses.map((cls) => (
                    <TableRow key={cls.id}>
                      <TableCell className="font-medium">{cls.id}</TableCell>
                      <TableCell>
                        <Link href={`/classes/${cls.id}`} className="font-medium text-primary hover:underline">
                          {cls.name}
                        </Link>
                      </TableCell>
                      <TableCell>{cls.subject}</TableCell>
                      <TableCell>{cls.grade}</TableCell>
                      <TableCell className="text-right">{cls.students}</TableCell>
                      <TableCell>
                        <Badge variant={cls.status === "Active" ? "default" : "secondary"}>{cls.status}</Badge>
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
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Edit Class</DropdownMenuItem>
                            <DropdownMenuItem>Manage Students</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">Delete Class</DropdownMenuItem>
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

