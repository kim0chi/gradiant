"use client"

import { useState, useEffect } from "react"
import { Download, Upload, Plus, Search, Trash2, Edit2, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import type { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { StudentSchema, type Student } from "@/types/gradebook-schemas"

type StudentManagementProps = {
  classId: string
}

// Mock student data
const mockStudents = [
  {
    id: "STU001",
    studentId: "2023-001",
    firstName: "Alice",
    lastName: "Johnson",
    email: "alice.johnson@school.edu",
    status: "active" as const,
  },
  {
    id: "STU002",
    studentId: "2023-002",
    firstName: "Bob",
    lastName: "Smith",
    email: "bob.smith@school.edu",
    status: "active" as const,
  },
  {
    id: "STU003",
    studentId: "2023-003",
    firstName: "Charlie",
    lastName: "Brown",
    email: "charlie.brown@school.edu",
    status: "active" as const,
  },
  {
    id: "STU004",
    studentId: "2023-004",
    firstName: "Diana",
    lastName: "Prince",
    email: "diana.prince@school.edu",
    status: "active" as const,
  },
  {
    id: "STU005",
    studentId: "2023-005",
    firstName: "Edward",
    lastName: "Cullen",
    email: "edward.cullen@school.edu",
    status: "inactive" as const,
  },
]

export function StudentManagement({ classId }: StudentManagementProps) {
  const [students, setStudents] = useState<Student[]>(mockStudents)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [editingStudent, setEditingStudent] = useState<Student | null>(null)
  const [studentToDelete, setStudentToDelete] = useState<string | null>(null)
  const [selectedStudents, setSelectedStudents] = useState<string[]>([])
  const [selectAll, setSelectAll] = useState(false)

  const { toast } = useToast()

  // Initialize form with React Hook Form for adding/editing student
  const form = useForm<z.infer<typeof StudentSchema>>({
    resolver: zodResolver(StudentSchema),
    defaultValues: {
      studentId: "",
      firstName: "",
      lastName: "",
      email: "",
      status: "active",
    },
  })

  // Fetch students
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true)

        // In a real app, fetch from API
        // const response = await fetch(`/api/classes/${classId}/students`)
        // if (!response.ok) throw new Error("Failed to fetch students")
        // const data = await response.json()
        // setStudents(data.students || [])

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))
        // Using mock data for now
      } catch (error) {
        console.error("Error fetching students:", error)
        toast({
          title: "Error",
          description: "Failed to load students. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchStudents()
  }, [classId, toast])

  // Filter students based on search term and status filter
  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      searchTerm === "" ||
      student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || student.status === statusFilter

    return matchesSearch && matchesStatus
  })

  // Handle form submission for adding/editing student
  const onSubmit = async (data: z.infer<typeof StudentSchema>) => {
    try {
      const isEditing = !!editingStudent

      // In a real app, this would be an API call
      // const url = isEditing
      //   ? `/api/classes/${classId}/students/${editingStudent.id}`
      //   : `/api/classes/${classId}/students`

      // const method = isEditing ? "PATCH" : "POST"

      // const response = await fetch(url, {
      //   method,
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(data),
      // })

      // if (!response.ok) throw new Error(`Failed to ${isEditing ? "update" : "add"} student`)

      // const savedStudent = await response.json()

      // Simulate API call and response
      await new Promise((resolve) => setTimeout(resolve, 500))

      const savedStudent: Student = {
        id: isEditing ? editingStudent?.id || "" : `STU${Date.now()}`,
        ...data,
      }

      // Update state
      if (isEditing) {
        setStudents(students.map((s) => (s.id === savedStudent.id ? savedStudent : s)))
      } else {
        setStudents([...students, savedStudent])
      }

      // Close dialog and reset form
      isEditing ? setIsEditDialogOpen(false) : setIsAddDialogOpen(false)
      form.reset()
      setEditingStudent(null)

      toast({
        title: "Success",
        description: `Student ${isEditing ? "updated" : "added"} successfully.`,
      })
    } catch (error) {
      console.error(`Error ${editingStudent ? "updating" : "adding"} student:`, error)
      toast({
        title: "Error",
        description: `Failed to ${editingStudent ? "update" : "add"} student. Please try again.`,
        variant: "destructive",
      })
    }
  }

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    if (!studentToDelete) return

    try {
      // In a real app, this would be an API call
      // const response = await fetch(`/api/classes/${classId}/students/${studentToDelete}`, {
      //   method: "DELETE",
      // })

      // if (!response.ok) throw new Error("Failed to delete student")

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Remove student from state
      setStudents(students.filter((s) => s.id !== studentToDelete))

      // Reset selection state if needed
      setSelectedStudents(selectedStudents.filter((id) => id !== studentToDelete))

      toast({
        title: "Success",
        description: "Student removed successfully.",
      })
    } catch (error) {
      console.error("Error deleting student:", error)
      toast({
        title: "Error",
        description: "Failed to remove student. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleteDialogOpen(false)
      setStudentToDelete(null)
    }
  }

  // Handle edit button click
  const handleEditClick = (student: Student) => {
    setEditingStudent(student)
    form.reset({
      studentId: student.studentId,
      firstName: student.firstName,
      lastName: student.lastName,
      email: student.email,
      status: student.status,
    })
    setIsEditDialogOpen(true)
  }

  // Handle bulk selection
  const toggleSelectAll = () => {
    setSelectAll(!selectAll)
    setSelectedStudents(selectAll ? [] : filteredStudents.map((s) => s.id || ""))
  }

  // Toggle individual student selection
  const toggleStudentSelection = (id: string) => {
    setSelectedStudents((prev) => (prev.includes(id) ? prev.filter((studentId) => studentId !== id) : [...prev, id]))
  }

  // Handle bulk delete
  const handleBulkDelete = async () => {
    if (selectedStudents.length === 0) return

    try {
      // In a real app, this would be an API call
      // const response = await fetch(`/api/classes/${classId}/students/bulk-delete`, {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({ ids: selectedStudents }),
      // })

      // if (!response.ok) throw new Error("Failed to delete students")

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800))

      // Remove students from state
      setStudents(students.filter((s) => !selectedStudents.includes(s.id || "")))

      // Reset selection state
      setSelectedStudents([])
      setSelectAll(false)

      toast({
        title: "Success",
        description: `${selectedStudents.length} student(s) removed successfully.`,
      })
    } catch (error) {
      console.error("Error deleting students:", error)
      toast({
        title: "Error",
        description: "Failed to remove students. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold">Student Management</h2>
        <div className="flex flex-wrap gap-2">
          <div className="w-[180px]">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Students</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="transferred">Transferred</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline" className="flex items-center gap-1">
            <Upload className="h-4 w-4" />
            <span>Import CSV</span>
          </Button>
          <Button variant="outline" className="flex items-center gap-1">
            <Download className="h-4 w-4" />
            <span>Export CSV</span>
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-1">
                <Plus className="h-4 w-4" />
                <span>Add Student</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Student</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="studentId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Student ID</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter student ID" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter first name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter last name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="Enter email address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                            <SelectItem value="transferred">Transferred</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Add Student</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search students..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <Card>
          <CardContent className="p-6 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          {selectedStudents.length > 0 && (
            <CardHeader className="pb-0">
              <div className="flex justify-between items-center">
                <CardTitle>{selectedStudents.length} student(s) selected</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setSelectedStudents([])}>
                    <X className="h-4 w-4 mr-1" />
                    Clear
                  </Button>
                  <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete Selected
                  </Button>
                </div>
              </div>
            </CardHeader>
          )}
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={toggleSelectAll}
                      className="h-4 w-4 rounded border-gray-300"
                      aria-label="Select all students"
                    />
                  </TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden md:table-cell">Email</TableHead>
                  <TableHead className="hidden md:table-cell">Status</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No students found matching the search criteria
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredStudents.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>
                        <input
                          type="checkbox"
                          checked={selectedStudents.includes(student.id || "")}
                          onChange={() => toggleStudentSelection(student.id || "")}
                          className="h-4 w-4 rounded border-gray-300"
                          aria-label={`Select ${student.firstName} ${student.lastName}`}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{student.studentId}</TableCell>
                      <TableCell>
                        {student.firstName} {student.lastName}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{student.email}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge
                          variant={
                            student.status === "active"
                              ? "success"
                              : student.status === "inactive"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {student.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditClick(student)}
                            aria-label={`Edit ${student.firstName} ${student.lastName}`}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setStudentToDelete(student.id || "")
                              setIsDeleteDialogOpen(true)
                            }}
                            aria-label={`Delete ${student.firstName} ${student.lastName}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Edit Student Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Student</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="studentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Student ID</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter student ID" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter first name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter last name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Enter email address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="transferred">Transferred</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Update Student</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Student</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to remove this student? This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
