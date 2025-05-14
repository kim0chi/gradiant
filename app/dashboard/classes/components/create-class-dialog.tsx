"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Define the Zod schema for class creation
export const classFormSchema = z.object({
  name: z.string().min(3, {
    message: "Class name must be at least 3 characters.",
  }),
  section: z.string().min(1, {
    message: "Section is required.",
  }),
  schedule: z.string().min(3, {
    message: "Schedule is required.",
  }),
  term: z.string().min(3, {
    message: "Term is required.",
  }),
  capacity: z.coerce
    .number()
    .int()
    .positive()
    .min(1, {
      message: "Capacity must be at least 1.",
    })
    .max(100, {
      message: "Capacity cannot exceed 100.",
    }),
})

// Infer the type from the schema
type ClassFormValues = z.infer<typeof classFormSchema>

// Define the props for the CreateClassDialog component
interface CreateClassDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (values: ClassFormValues) => void
}

export function CreateClassDialog({ open, onOpenChange, onSubmit }: CreateClassDialogProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Initialize the form with React Hook Form and Zod validation
  const form = useForm<ClassFormValues>({
    resolver: zodResolver(classFormSchema),
    defaultValues: {
      name: "",
      section: "",
      schedule: "",
      term: "",
      capacity: 30, // Default capacity
    },
  })

  // Handle form submission
  const handleSubmit = async (values: ClassFormValues) => {
    setIsSubmitting(true)

    try {
      // In a real app, this would be an API call to create the class
      // For now, we'll simulate a delay and then call the onSubmit prop
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Call the onSubmit prop with the form values
      onSubmit(values)

      // Reset the form
      form.reset()

      // Close the dialog
      onOpenChange(false)

      // In a real app, we would redirect to the new class's gradebook
      // router.push(`/dashboard/gradebook/${newClassId}`)
    } catch (error) {
      console.error("Failed to create class:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Class</DialogTitle>
          <DialogDescription>Enter the details for your new class. Click save when you're done.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Class Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Mathematics 101" {...field} />
                  </FormControl>
                  <FormDescription>Enter the full name of the class.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="section"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Section</FormLabel>
                  <FormControl>
                    <Input placeholder="Section A" {...field} />
                  </FormControl>
                  <FormDescription>Enter the section identifier.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="schedule"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Schedule</FormLabel>
                  <FormControl>
                    <Input placeholder="MWF 9:00 AM - 10:30 AM" {...field} />
                  </FormControl>
                  <FormDescription>Enter the days and times for this class.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="term"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Term/Semester</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a term" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="First Semester 2023-2024">First Semester 2023-2024</SelectItem>
                      <SelectItem value="Second Semester 2023-2024">Second Semester 2023-2024</SelectItem>
                      <SelectItem value="Summer 2024">Summer 2024</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>Select the term or semester for this class.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="capacity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Capacity</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormDescription>Maximum number of students (1-100).</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Class"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
