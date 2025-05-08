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
import { Checkbox } from "@/components/ui/checkbox"
import { DatePicker } from "@/components/ui/date-picker"

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

// Define the Zod schema for class schedule
const scheduleSchema = z
  .object({
    days: z.array(z.string()).min(1, "Select at least one day"),
    startTime: z.string().min(1, "Start time is required"),
    endTime: z.string().min(1, "End time is required"),
    startDate: z.date({ required_error: "Start date is required" }),
    endDate: z.date({ required_error: "End date is required" }),
  })
  .refine(
    (data) => {
      // Ensure end time is after start time
      return data.startTime < data.endTime
    },
    {
      message: "End time must be after start time",
      path: ["endTime"],
    },
  )
  .refine(
    (data) => {
      // Ensure end date is after or equal to start date
      return data.endDate >= data.startDate
    },
    {
      message: "End date must be after or equal to start date",
      path: ["endDate"],
    },
  )

// Define the Zod schema for class creation
export const classFormSchema = z.object({
  name: z.string().min(3, {
    message: "Class name must be at least 3 characters.",
  }),
  section: z.string().min(1, {
    message: "Section is required.",
  }),
  term: z.string().min(3, {
    message: "Term is required.",
  }),
  schedule: scheduleSchema,
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
}

export function CreateClassDialog({ open, onOpenChange }: CreateClassDialogProps) {
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

      // Reset the form
      form.reset()

      // Close the dialog
      onOpenChange(false)

      // Redirect to the new class's gradebook
      router.push(`/dashboard/gradebook/${newClassId}`)
    } catch (error) {
      console.error("Failed to create class:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Class</DialogTitle>
          <DialogDescription>Enter the details for your new class. Click create when you're done.</DialogDescription>
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
