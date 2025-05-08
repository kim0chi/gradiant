"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import type { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"

// Import the Zod schema from the dialog component
import { classFormSchema } from "../components/create-class-dialog"

// Infer the type from the schema
type ClassFormValues = z.infer<typeof classFormSchema>

export default function CreateClassPage() {
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
      // For now, we'll simulate a delay and then redirect
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // In a real app, we would create the class and get its ID
      const newClassId = "new-class-id"

      // Redirect to the new class's gradebook
      router.push(`/dashboard/gradebook/${newClassId}`)
    } catch (error) {
      console.error("Failed to create class:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/classes">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back to Classes</span>
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Create New Class</h1>
        </div>
        <p className="text-muted-foreground">Enter the details for your new class. All fields are required.</p>
      </div>

      <Card className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
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

            <div className="flex justify-end gap-4 pt-4">
              <Button type="button" variant="outline" asChild disabled={isSubmitting}>
                <Link href="/dashboard/classes">Cancel</Link>
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Class"}
              </Button>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  )
}
