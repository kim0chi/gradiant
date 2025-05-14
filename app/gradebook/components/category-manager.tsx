"use client"

import { useState, useEffect } from "react"
import { createBrowserClient } from "@/lib/supabase/client"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Trash2, GripVertical } from "lucide-react"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { Progress } from "@/components/ui/progress"

type Category = {
  id: string
  name: string
  weight: number
}

type CategoryManagerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  classId: string | null
}

export function CategoryManager({ open, onOpenChange, classId }: CategoryManagerProps) {
  const supabase = createBrowserClient()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  // Calculate total weight
  const totalWeight = categories.reduce((sum, cat) => sum + cat.weight, 0)

  // Fetch categories when the dialog opens
  useEffect(() => {
    async function fetchCategories() {
      if (!classId || !open) return

      setLoading(true)

      try {
        // In a real app, we would fetch this data from the server
        // For now, we'll simulate it with mock data
        await new Promise((resolve) => setTimeout(resolve, 500))

        // Mock categories
        const mockCategories: Category[] = [
          { id: "cat-1", name: "Homework", weight: 20 },
          { id: "cat-2", name: "Quizzes", weight: 15 },
          { id: "cat-3", name: "Exams", weight: 40 },
          { id: "cat-4", name: "Projects", weight: 15 },
          { id: "cat-5", name: "Attendance", weight: 10 },
        ]

        setCategories(mockCategories)
      } catch (error) {
        console.error("Error fetching categories:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [classId, open])

  // Handle adding a new category
  const handleAddCategory = () => {
    const newCategory: Category = {
      id: `cat-${Date.now()}`,
      name: "New Category",
      weight: 0,
    }

    setCategories([...categories, newCategory])
  }

  // Handle removing a category
  const handleRemoveCategory = (id: string) => {
    setCategories(categories.filter((cat) => cat.id !== id))
  }

  // Handle updating a category name
  const handleNameChange = (id: string, name: string) => {
    setCategories(categories.map((cat) => (cat.id === id ? { ...cat, name } : cat)))
  }

  // Handle updating a category weight
  const handleWeightChange = (id: string, weightStr: string) => {
    const weight = Number.parseInt(weightStr) || 0
    setCategories(categories.map((cat) => (cat.id === id ? { ...cat, weight } : cat)))
  }

  // Handle drag and drop reordering
  const handleDragEnd = (result: any) => {
    if (!result.destination) return

    const items = Array.from(categories)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setCategories(items)
  }

  // Handle saving changes
  const handleSave = async () => {
    if (!classId) return

    setIsSaving(true)

    try {
      // In a real app, we would save this to the database
      // For now, we'll just simulate it with a timeout
      await new Promise((resolve) => setTimeout(resolve, 1000))

      console.log("Categories saved:", categories)

      // Close the dialog
      onOpenChange(false)
    } catch (error) {
      console.error("Error saving categories:", error)
    } finally {
      setIsSaving(false)
    }
  }

  // Handle auto-adjusting weights to sum to 100%
  const handleAutoAdjust = () => {
    if (categories.length === 0) return

    const currentTotal = categories.reduce((sum, cat) => sum + cat.weight, 0)
    if (currentTotal === 0) {
      // If all weights are 0, distribute evenly
      const evenWeight = Math.floor(100 / categories.length)
      const remainder = 100 - evenWeight * categories.length

      setCategories(
        categories.map((cat, index) => ({
          ...cat,
          weight: evenWeight + (index === 0 ? remainder : 0),
        })),
      )
    } else {
      // Adjust proportionally
      const factor = 100 / currentTotal
      let newTotal = 0

      const adjusted = categories.map((cat, index) => {
        if (index === categories.length - 1) {
          // Make sure the last category makes the total exactly 100
          return { ...cat, weight: 100 - newTotal }
        } else {
          const newWeight = Math.round(cat.weight * factor)
          newTotal += newWeight
          return { ...cat, weight: newWeight }
        }
      })

      setCategories(adjusted)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Manage Grade Categories</DialogTitle>
          <DialogDescription>Define categories and their weight in the final grade calculation.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Total Weight: {totalWeight}%</Label>
              <Progress
                value={totalWeight}
                max={100}
                className={`h-2 mt-1 ${totalWeight === 100 ? "bg-green-500" : totalWeight > 100 ? "bg-red-500" : ""}`}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleAutoAdjust}>
                Auto-Adjust to 100%
              </Button>
              <Button variant="outline" onClick={handleAddCategory}>
                <Plus className="mr-2 h-4 w-4" />
                Add Category
              </Button>
            </div>
          </div>

          <div className="border rounded-md">
            <div className="grid grid-cols-12 gap-4 p-4 bg-muted font-medium">
              <div className="col-span-1"></div>
              <div className="col-span-6">Name</div>
              <div className="col-span-3">Weight (%)</div>
              <div className="col-span-2"></div>
            </div>

            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="categories">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2 p-4">
                    {categories.map((category, index) => (
                      <Draggable key={category.id} draggableId={category.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className="grid grid-cols-12 gap-4 items-center bg-background border rounded-md p-2"
                          >
                            <div className="col-span-1 flex justify-center" {...provided.dragHandleProps}>
                              <GripVertical className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div className="col-span-6">
                              <Input
                                value={category.name}
                                onChange={(e) => handleNameChange(category.id, e.target.value)}
                              />
                            </div>
                            <div className="col-span-3">
                              <Input
                                type="number"
                                min="0"
                                max="100"
                                value={category.weight}
                                onChange={(e) => handleWeightChange(category.id, e.target.value)}
                              />
                            </div>
                            <div className="col-span-2 flex justify-end">
                              <Button variant="ghost" size="icon" onClick={() => handleRemoveCategory(category.id)}>
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving || totalWeight !== 100}>
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
