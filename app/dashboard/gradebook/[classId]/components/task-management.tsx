"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Plus, Pencil, Trash2, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"

// Mock data types (same as in grade-sheet.tsx)
type Category = {
  id: string
  name: string
  weight: number
}

type Period = {
  id: string
  name: string
  startDate: string
  endDate: string
  weight: number
}

type Task = {
  id: string
  title: string
  categoryId: string
  maxPoints: number
  dueDate: string | null
  description?: string
  periodId: string
}

// Mock data (same as in grade-sheet.tsx)
const mockCategories: Category[] = [
  {
    id: "c1",
    name: "Written Works",
    weight: 30,
  },
  {
    id: "c2",
    name: "Performance Tasks",
    weight: 40,
  },
  {
    id: "c3",
    name: "Exams",
    weight: 30,
  },
]

const mockPeriods: Period[] = [
  {
    id: "p1",
    name: "Prelims",
    startDate: "2023-08-15",
    endDate: "2023-09-15",
    weight: 25,
  },
  {
    id: "p2",
    name: "Midterms",
    startDate: "2023-09-16",
    endDate: "2023-10-15",
    weight: 25,
  },
  {
    id: "p3",
    name: "Semis",
    startDate: "2023-10-16",
    endDate: "2023-11-15",
    weight: 25,
  },
  {
    id: "p4",
    name: "Finals",
    startDate: "2023-11-16",
    endDate: "2023-12-15",
    weight: 25,
  },
]

const mockTasks: Task[] = [
  // Prelims
  {
    id: "t1",
    title: "Essay 1",
    categoryId: "c1",
    maxPoints: 100,
    dueDate: "2023-08-20",
    periodId: "p1",
  },
  {
    id: "t2",
    title: "Quiz 1",
    categoryId: "c1",
    maxPoints: 50,
    dueDate: "2023-08-27",
    periodId: "p1",
  },
  {
    id: "t3",
    title: "Lab Report 1",
    categoryId: "c2",
    maxPoints: 100,
    dueDate: "2023-09-05",
    periodId: "p1",
  },
  {
    id: "t4",
    title: "Prelim Exam",
    categoryId: "c3",
    maxPoints: 100,
    dueDate: "2023-09-15",
    periodId: "p1",
  },
  // More tasks...
]

export function TaskManagement({ classId }: { classId: string }) {
  const { toast } = useToast()
  const [tasks, setTasks] = useState<Task[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [periods, setPeriods] = useState<Period[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState<string>("all")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    categoryId: "",
    maxPoints: 100,
    dueDate: "",
    description: "",
    periodId: "",
  })

  // Fetch data
  useEffect(() => {
    // Simulate API fetch
    const fetchData = async () => {
      setIsLoading(true)
      try {
        // In a real app, these would be API calls
        setCategories(mockCategories)
        setPeriods(mockPeriods)
        setTasks(mockTasks)
      } catch (error) {
        console.error("Error fetching data:", error)
        toast({
          title: "Error",
          description: "Failed to load task data",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [toast])

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    if (selectedPeriod !== "all" && task.periodId !== selectedPeriod) return false
    if (selectedCategory !== "all" && task.categoryId !== selectedCategory) return false
    return true
  })

  // Group tasks by period
  const tasksByPeriod: Record<string, Task[]> = {}

  // Add "all" option
  tasksByPeriod["all"] = filteredTasks

  // Group by period
  periods.forEach((period) => {
    tasksByPeriod[period.id] = filteredTasks.filter((task) => task.periodId === period.id)
  })

  // Handle form input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle select change
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Reset form
  const resetForm = () => {
    setFormData({
      title: "",
      categoryId: "",
      maxPoints: 100,
      dueDate: "",
      description: "",
      periodId: "",
    })
    setEditingTask(null)
  }

  // Open dialog for editing
  const openEditDialog = (task: Task) => {
    setEditingTask(task)
    setFormData({
      title: task.title,
      categoryId: task.categoryId,
      maxPoints: task.maxPoints,
      dueDate: task.dueDate || "",
      description: task.description || "",
      periodId: task.periodId,
    })
    setIsDialogOpen(true)
  }

  // Open dialog for creating
  const openCreateDialog = () => {
    resetForm()
    setIsDialogOpen(true)
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!formData.title || !formData.categoryId || !formData.periodId) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    try {
      // In a real app, this would be an API call
      if (editingTask) {
        // Update existing task
        const updatedTask: Task = {
          ...editingTask,
          title: formData.title,
          categoryId: formData.categoryId,
          maxPoints: Number(formData.maxPoints),
          dueDate: formData.dueDate || null,
          description: formData.description,
          periodId: formData.periodId,
        }

        setTasks((prev) => prev.map((t) => (t.id === editingTask.id ? updatedTask : t)))

        toast({
          title: "Success",
          description: "Task updated successfully",
        })
      } else {
        // Create new task
        const newTask: Task = {
          id: `t${Date.now()}`, // Generate a unique ID
          title: formData.title,
          categoryId: formData.categoryId,
          maxPoints: Number(formData.maxPoints),
          dueDate: formData.dueDate || null,
          description: formData.description,
          periodId: formData.periodId,
        }

        setTasks((prev) => [...prev, newTask])

        toast({
          title: "Success",
          description: "Task created successfully",
        })
      }

      // Close dialog and reset form
      setIsDialogOpen(false)
      resetForm()
    } catch (error) {
      console.error("Error saving task:", error)
      toast({
        title: "Error",
        description: "Failed to save task",
        variant: "destructive",
      })
    }
  }

  // Handle task deletion
  const handleDeleteTask = (taskId: string) => {
    try {
      // In a real app, this would be an API call
      setTasks((prev) => prev.filter((t) => t.id !== taskId))

      toast({
        title: "Success",
        description: "Task deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting task:", error)
      toast({
        title: "Error",
        description: "Failed to delete task",
        variant: "destructive",
      })
    }
  }

  // Get category name by ID
  const getCategoryName = (categoryId: string) => {
    return categories.find((c) => c.id === categoryId)?.name || "Unknown"
  }

  // Get period name by ID
  const getPeriodName = (periodId: string) => {
    return periods.find((p) => p.id === periodId)?.name || "Unknown"
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">Task Management</h2>
        <Button onClick={openCreateDialog}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Task
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
          <Label htmlFor="period-filter">Filter by Period</Label>
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger id="period-filter">
              <SelectValue placeholder="Select Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Periods</SelectItem>
              {periods.map((period) => (
                <SelectItem key={period.id} value={period.id}>
                  {period.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
          <Label htmlFor="category-filter">Filter by Category</Label>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger id="category-filter">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tasks List */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4 w-full sm:w-auto overflow-x-auto">
          <TabsTrigger value="all">All Tasks</TabsTrigger>
          {periods.map((period) => (
            <TabsTrigger key={period.id} value={period.id}>
              {period.name}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {filteredTasks.length === 0 ? (
            <Card>
              <CardContent className="py-10 text-center text-muted-foreground">
                No tasks found. Create a new task to get started.
              </CardContent>
            </Card>
          ) : (
            filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                categoryName={getCategoryName(task.categoryId)}
                periodName={getPeriodName(task.periodId)}
                onEdit={() => openEditDialog(task)}
                onDelete={() => handleDeleteTask(task.id)}
              />
            ))
          )}
        </TabsContent>

        {periods.map((period) => (
          <TabsContent key={period.id} value={period.id} className="space-y-4">
            {tasksByPeriod[period.id].length === 0 ? (
              <Card>
                <CardContent className="py-10 text-center text-muted-foreground">
                  No tasks found for this period. Create a new task to get started.
                </CardContent>
              </Card>
            ) : (
              tasksByPeriod[period.id].map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  categoryName={getCategoryName(task.categoryId)}
                  periodName={getPeriodName(task.periodId)}
                  onEdit={() => openEditDialog(task)}
                  onDelete={() => handleDeleteTask(task.id)}
                />
              ))
            )}
          </TabsContent>
        ))}
      </Tabs>

      {/* Task Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingTask ? "Edit Task" : "Create New Task"}</DialogTitle>
            <DialogDescription>
              {editingTask ? "Update the details for this task." : "Add a new task to your gradebook."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Task Title *</Label>
              <Input id="title" name="title" value={formData.title} onChange={handleInputChange} required />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="categoryId">Category *</Label>
                <Select
                  value={formData.categoryId}
                  onValueChange={(value) => handleSelectChange("categoryId", value)}
                  required
                >
                  <SelectTrigger id="categoryId">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="periodId">Period *</Label>
                <Select
                  value={formData.periodId}
                  onValueChange={(value) => handleSelectChange("periodId", value)}
                  required
                >
                  <SelectTrigger id="periodId">
                    <SelectValue placeholder="Select Period" />
                  </SelectTrigger>
                  <SelectContent>
                    {periods.map((period) => (
                      <SelectItem key={period.id} value={period.id}>
                        {period.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="maxPoints">Maximum Points *</Label>
                <Input
                  id="maxPoints"
                  name="maxPoints"
                  type="number"
                  value={formData.maxPoints}
                  onChange={handleInputChange}
                  min={1}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input id="dueDate" name="dueDate" type="date" value={formData.dueDate} onChange={handleInputChange} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input id="description" name="description" value={formData.description} onChange={handleInputChange} />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">{editingTask ? "Update Task" : "Create Task"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Task Card Component
function TaskCard({
  task,
  categoryName,
  periodName,
  onEdit,
  onDelete,
}: {
  task: Task
  categoryName: string
  periodName: string
  onEdit: () => void
  onDelete: () => void
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{task.title}</CardTitle>
            <CardDescription>
              {categoryName} • {periodName}
            </CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Filter className="h-4 w-4" />
                <span className="sr-only">Actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onEdit}>
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onDelete} className="text-destructive focus:text-destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row justify-between text-sm">
          <div className="flex items-center gap-2">
            <span className="font-medium">Max Points:</span>
            <span>{task.maxPoints}</span>
          </div>
          {task.dueDate && (
            <div className="flex items-center gap-2">
              <span className="font-medium">Due Date:</span>
              <span>{new Date(task.dueDate).toLocaleDateString()}</span>
            </div>
          )}
        </div>
        {task.description && <p className="mt-2 text-sm text-muted-foreground">{task.description}</p>}
      </CardContent>
    </Card>
  )
}
