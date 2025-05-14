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
import { Checkbox } from "@/components/ui/checkbox"
import { DatePicker } from "@/components/ui/date-picker"
import { Card } from "@/components/ui/card"

// Import the Zod schema from the dialog component
import { classFormSchema } from "../components/create-class-dialog"

// Define the days of the week
const daysOfWeek = [
  { id: "Mon", label: "Monday" },
  { id: "Tue", label: "Tuesday" },
  { id: "Wed", label: "Wednesday" },
  { id: "Thu", label: "Thursday" },
  { id: "Fri", label: "Friday" },
  { id: "Sat", label: "Saturday" },
  { id: "Sun", label: "Sunday" },
]

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
      term: "",
      schedule: {
        days: [],
        startTime: "09:00",
        endTime: "10:30",
        startDate: new Date(),
        endDate: new Date(new Date().setMonth(new Date().getMonth() + 4)),
      },
      capacity: 30, // Default capacity
    },
  })

  // Handle form submission
  const handleSubmit = async (values: ClassFormValues) => {
    setIsSubmitting(true)

    try {
      // In a real app, this would be an API call to create the class
      console.log("Creating class with values:", values)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Simulate getting a new class ID from the API
      const newClassId = "new-class-" + Date.now()

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
            <Link href="/dashboard/gradebook">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back to Gradebook</span>
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

            <div className="space-y-4">
              <h3 className="text-sm font-medium">Schedule</h3>

              <FormField
                control={form.control}
                name="schedule.days"
                render={() => (
                  <FormItem>
                    <div className="mb-2">
                      <FormLabel>Days</FormLabel>
                      <FormDescription>Select the days when this class meets.</FormDescription>
                    </div>
                    <div className="flex flex-wrap gap-4">
                      {daysOfWeek.map((day) => (
                        <FormField
                          key={day.id}
                          control={form.control}
                          name="schedule.days"
                          render={({ field }) => {
                            return (
                              <FormItem key={day.id} className="flex flex-row items-start space-x-2 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(day.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, day.id])
                                        : field.onChange(field.value?.filter((value) => value !== day.id))
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="text-sm font-normal">{day.label}</FormLabel>
                              </FormItem>
                            )
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="schedule.startTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Time</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="schedule.endTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Time</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="schedule.startDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Start Date</FormLabel>
                      <DatePicker date={field.value} setDate={field.onChange} />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="schedule.endDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>End Date</FormLabel>
                      <DatePicker date={field.value} setDate={field.onChange} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

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
                <Link href="/dashboard/gradebook">Cancel</Link>
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
