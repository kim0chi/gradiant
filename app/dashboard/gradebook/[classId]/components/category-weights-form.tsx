"use client"

import { useState, useEffect } from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Save, Plus, AlertCircle, Trash } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CategorySchema } from "@/types/gradebook-schemas"

// Define form schema with array of categories
const formSchema = z.object({
  categories: z
    .array(CategorySchema)
    .min(1, "At least one category is required")
    .refine(
      (categories) => {
        const total = categories.reduce((sum, category) => sum + category.weight, 0)
        return Math.abs(total - 100) < 0.01 // Allow for floating point precision issues
      },
      {
        message: "Category weights must sum to 100%",
      },
    ),
})

type CategoryWeightsFormProps = {
  classId: string
  onSuccess?: () => void
}

export function CategoryWeightsForm({ classId, onSuccess }: CategoryWeightsFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Initialize form with React Hook Form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      categories: [
        { id: "1", name: "Assignments", weight: 30 },
        { id: "2", name: "Quizzes", weight: 20 },
        { id: "3", name: "Exams", weight: 40 },
        { id: "4", name: "Participation", weight: 10 },
      ],
    },
  })

  // Calculate total weight of all categories
  const categories = form.watch("categories")
  const totalWeight = categories.reduce((sum, category) => sum + category.weight, 0)
  const isValidTotal = Math.abs(totalWeight - 100) < 0.01

  // Fetch existing categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true)
        // In a real app, this would be a fetch request to your API
        const response = await fetch(`/api/classes/${classId}/categories`)

        if (!response.ok) {
          throw new Error("Failed to fetch categories")
        }

        const data = await response.json()

        // Set form values with fetched data
        if (data.categories && data.categories.length > 0) {
          form.reset({ categories: data.categories })
        }
      } catch (err) {
        console.error("Error fetching categories:", err)
        setError("Failed to load categories. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchCategories()
  }, [classId, form])

  // Handle form submission
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true)
      setError(null)

      // In a real app, this would be a fetch request to your API
      const response = await fetch(`/api/classes/${classId}/categories`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Failed to update categories")
      }

      // Call success callback if provided
      if (onSuccess) {
        onSuccess()
      }
    } catch (err) {
      console.error("Error saving categories:", err)
      setError("Failed to save categories. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Add a new category
  const addCategory = () => {
    const currentCategories = form.getValues("categories")
    form.setValue("categories", [...currentCategories, { id: `new-${Date.now()}`, name: "", weight: 0 }])
  }

  // Remove a category
  const removeCategory = (index: number) => {
    const currentCategories = form.getValues("categories")
    form.setValue(
      "categories",
      currentCategories.filter((_, i) => i !== index),
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Grade Category Weights</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {categories.map((category, index) => (
              <div key={category.id || index} className="grid grid-cols-12 gap-4 items-center">
                <div className="col-span-4">
                  <FormField
                    control={form.control}
                    name={`categories.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="sr-only">Category Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Category name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="col-span-6">
                  <FormField
                    control={form.control}
                    name={`categories.${index}.weight`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="sr-only">Weight</FormLabel>
                        <FormControl>
                          <Slider
                            value={[field.value]}
                            min={0}
                            max={100}
                            step={1}
                            onValueChange={(value) => field.onChange(value[0])}
                            aria-label={`${category.name} weight percentage`}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="col-span-1 text-right">
                  <span className="font-medium">{category.weight.toFixed(0)}%</span>
                </div>
                <div className="col-span-1 text-right">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => removeCategory(index)}
                    disabled={categories.length <= 1}
                    aria-label={`Remove ${category.name} category`}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}

            <div className="flex justify-between items-center pt-4 border-t">
              <span className="font-medium">Total Weight:</span>
              <span className={`font-bold ${isValidTotal ? "text-green-500" : "text-red-500"}`}>
                {totalWeight.toFixed(0)}%{!isValidTotal && " (Must equal 100%)"}
              </span>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={addCategory} className="flex items-center gap-1">
              <Plus className="h-4 w-4" />
              <span>Add Category</span>
            </Button>
            <div className="flex gap-2">
              <Button type="submit" disabled={isLoading || !isValidTotal} className="flex items-center gap-1">
                <Save className="h-4 w-4" />
                <span>{isLoading ? "Saving..." : "Save Categories"}</span>
              </Button>
            </div>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}
