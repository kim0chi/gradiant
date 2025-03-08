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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { DatePicker } from "@/components/activities/date-picker"
import { DeleteActivityDialog } from "@/components/activities/delete-activity-dialog"

const initialActivities = [
  {
    id: "ACT001",
    title: "Math Quiz 1",
    type: "Quiz",
    class: "Algebra II",
    dueDate: "2023-07-15",
    maxPoints: 20,
    weight: 10,
    status: "Active",
    description: "First quiz covering linear equations and inequalities.",
    isGraded: true,
    isPublished: true,
    createdAt: "2023-07-01",
  },
  {
    id: "ACT002",
    title: "Biology Lab Report",
    type: "Assignment",
    class: "Biology 101",
    dueDate: "2023-07-18",
    maxPoints: 50,
    weight: 15,
    status: "Active",
    description: "Lab report on cell structure and function observation.",
    isGraded: true,
    isPublished: true,
    createdAt: "2023-07-02",
  },
  {
    id: "ACT003",
    title: "World History Midterm",
    type: "Exam",
    class: "World History",
    dueDate: "2023-07-20",
    maxPoints: 100,
    weight: 25,
    status: "Upcoming",
    description: "Comprehensive exam covering ancient civilizations to the Renaissance.",
    isGraded: true,
    isPublished: true,
    createdAt: "2023-07-03",
  },
  {
    id: "ACT004",
    title: "English Literature Essay",
    type: "Assignment",
    class: "English Literature",
    dueDate: "2023-07-25",
    maxPoints: 100,
    weight: 20,
    status: "Draft",
    description: "Analytical essay on themes in Shakespeare's Hamlet.",
    isGraded: true,
    isPublished: false,
    createdAt: "2023-07-04",
  },
  {
    id: "ACT005",
    title: "Physics Problem Set",
    type: "Homework",
    class: "Physics 201",
    dueDate: "2023-07-12",
    maxPoints: 30,
    weight: 5,
    status: "Completed",
    description: "Problem set covering mechanics and motion laws.",
    isGraded: true,
    isPublished: true,
    createdAt: "2023-07-05",
  },
  {
    id: "ACT006",
    title: "Spanish Oral Presentation",
    type: "Project",
    class: "Spanish II",
    dueDate: "2023-07-28",
    maxPoints: 50,
    weight: 15,
    status: "Active",
    description: "Group presentation about Spanish-speaking countries and cultures.",
    isGraded: true,
    isPublished: true,
    createdAt: "2023-07-06",
  },
  {
    id: "ACT007",
    title: "Computer Science Coding Challenge",
    type: "Quiz",
    class: "Computer Science",
    dueDate: "2023-07-14",
    maxPoints: 40,
    weight: 10,
    status: "Active",
    description: "In-class coding challenge on algorithms and data structures.",
    isGraded: true,
    isPublished: true,
    createdAt: "2023-07-07",
  },
  {
    id: "ACT008",
    title: "Art History Gallery Walk",
    type: "Activity",
    class: "Art History",
    dueDate: "2023-07-21",
    maxPoints: 25,
    weight: 5,
    status: "Draft",
    description: "Interactive gallery walk analyzing Renaissance paintings.",
    isGraded: false,
    isPublished: false,
    createdAt: "2023-07-08",
  },
]

const classes = [
  { id: "CLS001", name: "Algebra II" },
  { id: "CLS002", name: "Biology 101" },
  { id: "CLS003", name: "World History" },
  { id: "CLS004", name: "English Literature" },
  { id: "CLS005", name: "Physics 201" },
  { id: "CLS006", name: "Spanish II" },
  { id: "CLS007", name: "Computer Science" },
  { id: "CLS008", name: "Art History" },
]

const activityTypes = ["Quiz", "Exam", "Assignment", "Homework", "Project", "Activity", "Discussion", "Presentation"]

const statusOptions = ["Draft", "Upcoming", "Active", "Completed", "Archived"]

export default function ActivitiesPage() {
  const [activities, setActivities] = useState(initialActivities)
  const [sortField, setSortField] = useState("title")
  const [sortDirection, setSortDirection] = useState("asc")
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [classFilter, setClassFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [editingActivity, setEditingActivity] = useState(null)
  const [isCreating, setIsCreating] = useState(false)
  const [newActivity, setNewActivity] = useState({
    id: "",
    title: "",
    type: "Assignment",
    class: "",
    dueDate: "",
    maxPoints: 100,
    weight: 10,
    status: "Draft",
    description: "",
    isGraded: true,
    isPublished: false,
  })
  const [activityToDelete, setActivityToDelete] = useState(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const filteredActivities = activities.filter((activity) => {
    const matchesSearch =
      activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.id.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesType = typeFilter === "all" || activity.type === typeFilter
    const matchesClass = classFilter === "all" || activity.class === classFilter
    const matchesStatus = statusFilter === "all" || activity.status === statusFilter

    return matchesSearch && matchesType && matchesClass && matchesStatus
  })

  const sortedActivities = [...filteredActivities].sort((a, b) => {
    if (sortDirection === "asc") {
      return a[sortField] > b[sortField] ? 1 : -1
    } else {
      return a[sortField] < b[sortField] ? 1 : -1
    }
  })

  const handleCreateActivity = () => {
    const id = `ACT${String(activities.length + 1).padStart(3, "0")}`
    const createdAt = new Date().toISOString().split("T")[0]
    const newActivityWithId = { ...newActivity, id, createdAt }

    setActivities([...activities, newActivityWithId])
    setNewActivity({
      id: "",
      title: "",
      type: "Assignment",
      class: "",
      dueDate: "",
      maxPoints: 100,
      weight: 10,
      status: "Draft",
      description: "",
      isGraded: true,
      isPublished: false,
    })
    setIsCreating(false)
  }

  const handleUpdateActivity = () => {
    const updatedActivities = activities.map((activity) =>
      activity.id === editingActivity.id ? editingActivity : activity,
    )
    setActivities(updatedActivities)
    setEditingActivity(null)
  }

  const handleDeleteActivity = (id) => {
    const updatedActivities = activities.filter((activity) => activity.id !== id)
    setActivities(updatedActivities)
    setDeleteDialogOpen(false)
    setActivityToDelete(null)
  }

  const openDeleteDialog = (activity) => {
    setActivityToDelete(activity)
    setDeleteDialogOpen(true)
  }

  const getStatusClass = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "Draft":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
      case "Upcoming":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "Completed":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      case "Archived":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Activities</h1>
        <p className="text-muted-foreground">Manage assignments, quizzes, exams, and other educational activities.</p>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex w-full max-w-sm items-center space-x-2">
                <Input
                  placeholder="Search activities..."
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
                    <DropdownMenuLabel>Filter by Type</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setTypeFilter("all")}>All Types</DropdownMenuItem>
                    {activityTypes.map((type) => (
                      <DropdownMenuItem key={type} onClick={() => setTypeFilter(type)}>
                        {type}
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>Filter by Class</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setClassFilter("all")}>All Classes</DropdownMenuItem>
                    {classes.map((cls) => (
                      <DropdownMenuItem key={cls.id} onClick={() => setClassFilter(cls.name)}>
                        {cls.name}
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setStatusFilter("all")}>All Statuses</DropdownMenuItem>
                    {statusOptions.map((status) => (
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
                  <Dialog open={isCreating} onOpenChange={setIsCreating}>
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        className="h-9 gap-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                      >
                        <Plus className="h-4 w-4" />
                        <span>Add Activity</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[625px]">
                      <DialogHeader>
                        <DialogTitle>Create New Activity</DialogTitle>
                        <DialogDescription>
                          Add a new activity, assignment, or assessment for your students.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="title">Activity Title</Label>
                            <Input
                              id="title"
                              placeholder="Math Quiz 1"
                              value={newActivity.title}
                              onChange={(e) => setNewActivity({ ...newActivity, title: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="type">Activity Type</Label>
                            <Select
                              value={newActivity.type}
                              onValueChange={(value) => setNewActivity({ ...newActivity, type: value })}
                            >
                              <SelectTrigger id="type">
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                              <SelectContent>
                                {activityTypes.map((type) => (
                                  <SelectItem key={type} value={type}>
                                    {type}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="class">Class</Label>
                            <Select
                              value={newActivity.class}
                              onValueChange={(value) => setNewActivity({ ...newActivity, class: value })}
                            >
                              <SelectTrigger id="class">
                                <SelectValue placeholder="Select class" />
                              </SelectTrigger>
                              <SelectContent>
                                {classes.map((cls) => (
                                  <SelectItem key={cls.id} value={cls.name}>
                                    {cls.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="dueDate">Due Date</Label>
                            <DatePicker
                              value={newActivity.dueDate}
                              onChange={(date) => setNewActivity({ ...newActivity, dueDate: date })}
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="maxPoints">Maximum Points</Label>
                            <Input
                              id="maxPoints"
                              type="number"
                              min="0"
                              value={newActivity.maxPoints}
                              onChange={(e) =>
                                setNewActivity({ ...newActivity, maxPoints: Number.parseInt(e.target.value) })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="weight">Weight (%)</Label>
                            <Input
                              id="weight"
                              type="number"
                              min="0"
                              max="100"
                              value={newActivity.weight}
                              onChange={(e) =>
                                setNewActivity({ ...newActivity, weight: Number.parseInt(e.target.value) })
                              }
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <Select
                              value={newActivity.status}
                              onValueChange={(value) => setNewActivity({ ...newActivity, status: value })}
                            >
                              <SelectTrigger id="status">
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                              <SelectContent>
                                {statusOptions.map((status) => (
                                  <SelectItem key={status} value={status}>
                                    {status}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="flex items-end space-x-4">
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="isGraded"
                                checked={newActivity.isGraded}
                                onCheckedChange={(checked) =>
                                  setNewActivity({ ...newActivity, isGraded: checked === true })
                                }
                              />
                              <Label htmlFor="isGraded">Graded</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="isPublished"
                                checked={newActivity.isPublished}
                                onCheckedChange={(checked) =>
                                  setNewActivity({ ...newActivity, isPublished: checked === true })
                                }
                              />
                              <Label htmlFor="isPublished">Published</Label>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="description">Description</Label>
                          <Textarea
                            id="description"
                            placeholder="Enter activity description and instructions..."
                            value={newActivity.description}
                            onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
                            rows={4}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button
                          type="submit"
                          onClick={handleCreateActivity}
                          disabled={!newActivity.title || !newActivity.class || !newActivity.dueDate}
                          className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                        >
                          Create Activity
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
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
                      <Button variant="ghost" size="sm" className="-ml-3 h-8" onClick={() => handleSort("title")}>
                        Title
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead className="w-[100px]">
                      <Button variant="ghost" size="sm" className="-ml-3 h-8" onClick={() => handleSort("type")}>
                        Type
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                      <Button variant="ghost" size="sm" className="-ml-3 h-8" onClick={() => handleSort("class")}>
                        Class
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                      <Button variant="ghost" size="sm" className="-ml-3 h-8" onClick={() => handleSort("dueDate")}>
                        Due Date
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead className="hidden md:table-cell w-[80px] text-right">Points</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedActivities.map((activity) => (
                    <TableRow key={activity.id}>
                      <TableCell className="font-medium">{activity.id}</TableCell>
                      <TableCell>
                        <Link href={`/activities/${activity.id}`} className="font-medium text-primary hover:underline">
                          {activity.title}
                        </Link>
                      </TableCell>
                      <TableCell>{activity.type}</TableCell>
                      <TableCell className="hidden md:table-cell">{activity.class}</TableCell>
                      <TableCell className="hidden md:table-cell">{activity.dueDate}</TableCell>
                      <TableCell className="hidden md:table-cell text-right">{activity.maxPoints}</TableCell>
                      <TableCell>
                        <Badge className={getStatusClass(activity.status)}>{activity.status}</Badge>
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
                            <DropdownMenuItem asChild>
                              <Link href={`/activities/${activity.id}`}>View Details</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setEditingActivity({ ...activity })}>
                              Edit Activity
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/gradebook?activity=${activity.id}`}>Grade Submissions</Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive" onClick={() => openDeleteDialog(activity)}>
                              Delete Activity
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                  {sortedActivities.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                        No activities found. Try adjusting your filters or create a new activity.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Activity Dialog */}
      {editingActivity && (
        <Dialog open={Boolean(editingActivity)} onOpenChange={(open) => !open && setEditingActivity(null)}>
          <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
              <DialogTitle>Edit Activity</DialogTitle>
              <DialogDescription>Make changes to this activity.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-title">Activity Title</Label>
                  <Input
                    id="edit-title"
                    value={editingActivity.title}
                    onChange={(e) => setEditingActivity({ ...editingActivity, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-type">Activity Type</Label>
                  <Select
                    value={editingActivity.type}
                    onValueChange={(value) => setEditingActivity({ ...editingActivity, type: value })}
                  >
                    <SelectTrigger id="edit-type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {activityTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-class">Class</Label>
                  <Select
                    value={editingActivity.class}
                    onValueChange={(value) => setEditingActivity({ ...editingActivity, class: value })}
                  >
                    <SelectTrigger id="edit-class">
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent>
                      {classes.map((cls) => (
                        <SelectItem key={cls.id} value={cls.name}>
                          {cls.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-dueDate">Due Date</Label>
                  <DatePicker
                    value={editingActivity.dueDate}
                    onChange={(date) => setEditingActivity({ ...editingActivity, dueDate: date })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-maxPoints">Maximum Points</Label>
                  <Input
                    id="edit-maxPoints"
                    type="number"
                    min="0"
                    value={editingActivity.maxPoints}
                    onChange={(e) =>
                      setEditingActivity({ ...editingActivity, maxPoints: Number.parseInt(e.target.value) })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-weight">Weight (%)</Label>
                  <Input
                    id="edit-weight"
                    type="number"
                    min="0"
                    max="100"
                    value={editingActivity.weight}
                    onChange={(e) =>
                      setEditingActivity({ ...editingActivity, weight: Number.parseInt(e.target.value) })
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-status">Status</Label>
                  <Select
                    value={editingActivity.status}
                    onValueChange={(value) => setEditingActivity({ ...editingActivity, status: value })}
                  >
                    <SelectTrigger id="edit-status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end space-x-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="edit-isGraded"
                      checked={editingActivity.isGraded}
                      onCheckedChange={(checked) =>
                        setEditingActivity({ ...editingActivity, isGraded: checked === true })
                      }
                    />
                    <Label htmlFor="edit-isGraded">Graded</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="edit-isPublished"
                      checked={editingActivity.isPublished}
                      onCheckedChange={(checked) =>
                        setEditingActivity({ ...editingActivity, isPublished: checked === true })
                      }
                    />
                    <Label htmlFor="edit-isPublished">Published</Label>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={editingActivity.description}
                  onChange={(e) => setEditingActivity({ ...editingActivity, description: e.target.value })}
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button
                type="submit"
                onClick={handleUpdateActivity}
                disabled={!editingActivity.title || !editingActivity.class || !editingActivity.dueDate}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              >
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Activity Dialog */}
      <DeleteActivityDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        activity={activityToDelete}
        onConfirm={() => handleDeleteActivity(activityToDelete?.id)}
      />
    </div>
  )
}

