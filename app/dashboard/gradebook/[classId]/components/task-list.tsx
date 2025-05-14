"use client"

import { useState, useEffect } from "react"
import { Edit2, Trash2, Plus, Calendar, Info } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { TaskForm } from "./task-form"
import type { Category, Task, Period } from "@/types/gradebook-schemas"

type TaskListProps = {
  classId: string
}

export function TaskList({ classId }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [periods, setPeriods] = useState<Period[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedPeriod, setSelectedPeriod] = useState<string>("all")
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null)

  const { toast } = useToast()

  // Fetch tasks, categories, and periods
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Fetch categories
        const categoriesResponse = await fetch(`/api/classes/${classId}/categories`)
        if (!categoriesResponse.ok) throw new Error("Failed to fetch categories")
        const categoriesData = await categoriesResponse.json()
        setCategories(categoriesData.categories || [])

        // Fetch periods
        const periodsResponse = await fetch(`/api/classes/${classId}/periods`)
        if (!periodsResponse.ok) throw new Error("Failed to fetch periods")
        const periodsData = await periodsResponse.json()
        setPeriods(periodsData.periods || [])

        // Fetch tasks
        const tasksResponse = await fetch(`/api/classes/${classId}/tasks`)
        if (!tasksResponse.ok) throw new Error("Failed to fetch tasks")
        const tasksData = await tasksResponse.json()
        setTasks(tasksData.tasks || [])
      } catch (error) {
        console.error("Error fetching data:", error)
        toast({
          title: "Error",
          description: "Failed to load tasks. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [classId, toast])

  // Filter tasks based on selected category and period
  const filteredTasks = tasks.filter((task) => {
    const matchesCategory = selectedCategory === "all" || task.categoryId === selectedCategory
    const matchesPeriod = selectedPeriod === "all" || task.periodId === selectedPeriod
    return matchesCategory && matchesPeriod
  })

  // Group tasks by category
  const tasksByCategory = categories.reduce<Record<string, Task[]>>((acc, category) => {
    acc[category.id as string] = filteredTasks.filter((task) => task.categoryId === category.id)
    return acc
  }, {})

  // Handler for task creation/update success
  const handleTaskSaved = (savedTask: Task) => {
    setTasks((prevTasks) => {
      const isUpdate = prevTasks.some((t) => t.id === savedTask.id)
      if (isUpdate) {
        return prevTasks.map((t) => (t.id === savedTask.id ? savedTask : t))
      } else {
        return [...prevTasks, savedTask]
      }
    })
    setIsTaskFormOpen(false)
    setEditingTask(null)
    toast({
      title: "Success",
      description: `Task ${savedTask.id ? "updated" : "created"} successfully.`,
    })
  }

  // Handle edit task click
  const handleEditTask = (task: Task) => {
    setEditingTask(task)
    setIsTaskFormOpen(true)
  }

  // Handler for delete confirmation
  const handleDeleteConfirm = async () => {
    if (!taskToDelete) return

    try {
      const response = await fetch(`/api/classes/${classId}/tasks/${taskToDelete}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete task")

      // Remove task from state
      setTasks((prevTasks) => prevTasks.filter((t) => t.id !== taskToDelete))

      toast({
        title: "Success",
        description: "Task deleted successfully.",
      })
    } catch (error) {
      console.error("Error deleting task:", error)
      toast({
        title: "Error",
        description: "Failed to delete task. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleteDialogOpen(false)
      setTaskToDelete(null)
    }
  }

  // Get category name by ID
  const getCategoryName = (categoryId: string) => {
    return categories.find((c) => c.id === categoryId)?.name || "Unknown Category"
  }

  // Get period name by ID
  const getPeriodName = (periodId: string) => {
    return periods.find((p) => p.id === periodId)?.name || "Unknown Period"
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold">Tasks</h2>
        <div className="flex flex-wrap gap-2">
          <div className="w-[180px]">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id || ""}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-[180px]">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Periods</SelectItem>
                {periods.map((period) => (
                  <SelectItem key={period.id} value={period.id || ""}>
                    {period.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Dialog open={isTaskFormOpen} onOpenChange={setIsTaskFormOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingTask(null)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingTask ? "Edit Task" : "Create New Task"}</DialogTitle>
              </DialogHeader>
              <TaskForm
                classId={classId}
                categories={categories}
                periods={periods}
                task={editingTask}
                onSuccess={handleTaskSaved}
                onCancel={() => setIsTaskFormOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          {/* View tasks by category */}
          <Tabs defaultValue="byCategory">
            <TabsList>
              <TabsTrigger value="byCategory">By Category</TabsTrigger>
              <TabsTrigger value="allTasks">All Tasks</TabsTrigger>
            </TabsList>

            <TabsContent value="byCategory" className="space-y-6 pt-4">
              {categories.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center text-muted-foreground">
                    <Info className="mx-auto h-10 w-10 mb-2" />
                    <p>No categories have been created yet. Create categories first to add tasks.</p>
                  </CardContent>
                </Card>
              ) : (
                categories.map((category) => (
                  <Card key={category.id}>
                    <CardHeader className="pb-2">
                      <CardTitle className="flex justify-between items-center">
                        <span className="flex items-center">
                          {category.name}
                          <Badge variant="outline" className="ml-2">
                            {category.weight}%
                          </Badge>
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {!tasksByCategory[category.id as string] ||
                      tasksByCategory[category.id as string].length === 0 ? (
                        <p className="text-center py-4 text-muted-foreground">No tasks in this category</p>
                      ) : (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Task Name</TableHead>
                              <TableHead>Max Points</TableHead>
                              <TableHead>Due Date</TableHead>
                              <TableHead>Period</TableHead>
                              <TableHead className="w-[100px]">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {tasksByCategory[category.id as string]?.map((task) => (
                              <TableRow key={task.id}>
                                <TableCell className="font-medium">{task.title}</TableCell>
                                <TableCell>{task.maxPoints}</TableCell>
                                <TableCell>
                                  {task.dueDate ? (
                                    <span className="flex items-center gap-1">
                                      <Calendar className="h-3.5 w-3.5" />
                                      {format(new Date(task.dueDate), "MMM d, yyyy")}
                                    </span>
                                  ) : (
                                    "—"
                                  )}
                                </TableCell>
                                <TableCell>
                                  <Badge variant="secondary">{getPeriodName(task.periodId)}</Badge>
                                </TableCell>
                                <TableCell>
                                  <div className="flex space-x-1">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => handleEditTask(task)}
                                      aria-label={`Edit ${task.title}`}
                                    >
                                      <Edit2 className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => {
                                        setTaskToDelete(task.id || "")
                                        setIsDeleteDialogOpen(true)
                                      }}
                                      aria-label={`Delete ${task.title}`}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="allTasks" className="pt-4">
              <Card>
                <CardContent className="p-6">
                  {filteredTasks.length === 0 ? (
                    <p className="text-center py-4 text-muted-foreground">
                      No tasks found matching the selected filters
                    </p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Task Name</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Max Points</TableHead>
                          <TableHead>Due Date</TableHead>
                          <TableHead>Period</TableHead>
                          <TableHead className="w-[100px]">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredTasks.map((task) => (
                          <TableRow key={task.id}>
                            <TableCell className="font-medium">{task.title}</TableCell>
                            <TableCell>{getCategoryName(task.categoryId)}</TableCell>
                            <TableCell>{task.maxPoints}</TableCell>
                            <TableCell>
                              {task.dueDate ? (
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3.5 w-3.5" />
                                  {format(new Date(task.dueDate), "MMM d, yyyy")}
                                </span>
                              ) : (
                                "—"
                              )}
                            </TableCell>
                            <TableCell>
                              <Badge variant="secondary">{getPeriodName(task.periodId)}</Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleEditTask(task)}
                                  aria-label={`Edit ${task.title}`}
                                >
                                  <Edit2 className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => {
                                    setTaskToDelete(task.id || "")
                                    setIsDeleteDialogOpen(true)
                                  }}
                                  aria-label={`Delete ${task.title}`}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}

      {/* Delete confirmation dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this task? This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
