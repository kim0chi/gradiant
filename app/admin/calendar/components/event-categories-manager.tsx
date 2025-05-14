"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { Plus, X, Pencil, Save, AlertCircle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

type EventCategory = {
  id: string
  name: string
  color: string
  description?: string
}

// In a real app, this would come from a database
const DEFAULT_CATEGORIES = [
  { id: "1", name: "holiday", color: "#ef4444", description: "School holidays and breaks" },
  { id: "2", name: "exam", color: "#f59e0b", description: "Tests and examinations" },
  { id: "3", name: "event", color: "#3b82f6", description: "School events and activities" },
  { id: "4", name: "deadline", color: "#8b5cf6", description: "Assignment and project deadlines" },
]

export function EventCategoriesManager() {
  const [categories, setCategories] = useState<EventCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<EventCategory | null>(null)

  // Form state
  const [categoryName, setCategoryName] = useState("")
  const [categoryColor, setCategoryColor] = useState("#3b82f6")
  const [categoryDescription, setCategoryDescription] = useState("")
  const [formError, setFormError] = useState("")

  useEffect(() => {
    // In a real app, fetch from API
    setTimeout(() => {
      setCategories(DEFAULT_CATEGORIES)
      setLoading(false)
    }, 500)
  }, [])

  const resetForm = () => {
    setCategoryName("")
    setCategoryColor("#3b82f6")
    setCategoryDescription("")
    setFormError("")
    setEditingCategory(null)
  }

  const handleOpenAddDialog = () => {
    resetForm()
    setIsAddDialogOpen(true)
  }

  const handleEditCategory = (category: EventCategory) => {
    setEditingCategory(category)
    setCategoryName(category.name)
    setCategoryColor(category.color)
    setCategoryDescription(category.description || "")
    setIsAddDialogOpen(true)
  }

  const validateForm = () => {
    if (!categoryName.trim()) {
      setFormError("Category name is required")
      return false
    }

    if (
      categories.some(
        (c) => c.name.toLowerCase() === categoryName.toLowerCase() && (!editingCategory || c.id !== editingCategory.id),
      )
    ) {
      setFormError("A category with this name already exists")
      return false
    }

    return true
  }

  const handleSaveCategory = () => {
    if (!validateForm()) return

    if (editingCategory) {
      // Update existing category
      setCategories(
        categories.map((c) =>
          c.id === editingCategory.id
            ? { ...c, name: categoryName, color: categoryColor, description: categoryDescription || undefined }
            : c,
        ),
      )
      toast({ title: "Category updated", description: `The category "${categoryName}" has been updated.` })
    } else {
      // Add new category
      const newCategory: EventCategory = {
        id: Date.now().toString(),
        name: categoryName,
        color: categoryColor,
        description: categoryDescription || undefined,
      }
      setCategories([...categories, newCategory])
      toast({ title: "Category added", description: `The category "${categoryName}" has been added.` })
    }

    setIsAddDialogOpen(false)
    resetForm()
  }

  const handleDeleteCategory = (id: string) => {
    const categoryToDelete = categories.find((c) => c.id === id)
    if (!categoryToDelete) return

    // In a real app, you would check if there are events using this category
    setCategories(categories.filter((c) => c.id !== id))
    toast({
      title: "Category deleted",
      description: `The category "${categoryToDelete.name}" has been deleted.`,
    })
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center justify-between py-2 animate-pulse">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-gray-200 rounded-full mr-2"></div>
              <div className="w-24 h-4 bg-gray-200 rounded"></div>
            </div>
            <div className="w-16 h-8 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium">Event Categories</h3>
        <Button size="sm" onClick={handleOpenAddDialog}>
          <Plus className="h-4 w-4 mr-1" /> Add
        </Button>
      </div>

      <div className="space-y-3">
        {categories.map((category) => (
          <div key={category.id} className="flex items-center justify-between group">
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: category.color }} />
              <div>
                <span className="text-sm font-medium capitalize">{category.name}</span>
                {category.description && <p className="text-xs text-muted-foreground">{category.description}</p>}
              </div>
            </div>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button size="icon" variant="ghost" onClick={() => handleEditCategory(category)}>
                <Pencil className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost" onClick={() => handleDeleteCategory(category.id)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}

        {categories.length === 0 && (
          <div className="text-center p-4 border rounded border-dashed">
            <p className="text-sm text-muted-foreground">No event categories defined</p>
          </div>
        )}
      </div>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingCategory ? "Edit Category" : "Add New Category"}</DialogTitle>
            <DialogDescription>
              {editingCategory
                ? "Edit the details of this event category."
                : "Create a new event category for the calendar."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="categoryName">Category Name</Label>
              <Input
                id="categoryName"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="e.g., Meeting, Field Trip"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="categoryColor">Color</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="categoryColor"
                  type="color"
                  value={categoryColor}
                  onChange={(e) => setCategoryColor(e.target.value)}
                  className="w-12 h-8 p-1"
                />
                <Badge style={{ backgroundColor: categoryColor }} className="capitalize">
                  {categoryName || "Preview"}
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="categoryDescription">Description (Optional)</Label>
              <Input
                id="categoryDescription"
                value={categoryDescription}
                onChange={(e) => setCategoryDescription(e.target.value)}
                placeholder="Brief description of this category"
              />
            </div>

            {formError && (
              <div className="flex items-center text-sm text-destructive">
                <AlertCircle className="h-4 w-4 mr-2" />
                {formError}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveCategory}>
              <Save className="h-4 w-4 mr-2" />
              {editingCategory ? "Update" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
