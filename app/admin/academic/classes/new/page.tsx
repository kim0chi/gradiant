"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { ChevronLeft, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { supabase } from "@/lib/supabase/client"
import { useToast } from "@/components/ui/use-toast"

// Define the form schema
const classFormSchema = z.object({
  name: z.string().min(2, "Class name must be at least 2 characters"),
  section: z.string().min(1, "Section is required"),
  grade: z.string().min(1, "Grade level is required"),
  teacher: z.string().optional(),
  room: z.string().optional(),
  capacity: z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? undefined : Number(val)),
    z.number().int().positive().optional()
  ),
  description: z.string().optional(),
  status: z.enum(["active", "upcoming", "completed"]),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
})

type ClassFormValues = z.infer<typeof classFormSchema>

export default function NewClassPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState("basic")

  // Initialize the form
  const form = useForm<ClassFormValues>({
    resolver: zodResolver(classFormSchema),
    defaultValues: {
      name: "",
      section: "",
      grade: "",
      teacher: "",
      room: "",
      capacity: undefined,
      description: "",
      status: "active",
      startDate: "",
      endDate: "",
    },
  })

  // Handle form submission
  const onSubmit = async (values: ClassFormValues) => {
    setIsSubmitting(true)

    try {
      // In a real application, this would be an API call
      const { error } = await supabase
        .from("classes")
        .insert({
          name: values.name,
          section: values.section,
          grade: values.grade,
          teacher_name: values.teacher,
          room: values.room,
          capacity: values.capacity,
          description: values.description,
          status: values.status,
          start_date: values.startDate,
          end_date: values.endDate,
        })
        .select()

      if (error) throw error

      toast({
        title: "Class created",
        description: `${values.name} has been created successfully`,
      })

      // Redirect to the classes list
      router.push("/admin/academic/classes")
    } catch (error) {
      console.error("Error creating class:", error)
      toast({
        title: "Error",
        description: "Failed to create class. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" size="sm" className="gap-1" asChild>
          <Link href="/admin/academic/classes">
            <ChevronLeft className="h-4 w-4" />
            Back to Classes
          </Link>
        </Button>
      </div>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create New Class</h1>
        <p className="text-muted-foreground">Add a new class to the system with basic information and settings.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList>
              <TabsTrigger value="basic">Basic Information</TabsTrigger>
              <TabsTrigger value="details">Additional Details</TabsTrigger>
              <TabsTrigger value="schedule">Schedule</TabsTrigger>
            </TabsList>

            <Card>
              <TabsContent value="basic" className="space-y-4 p-0">
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>Enter the basic information about the class.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Class Name</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Mathematics" {...field} />
                          </FormControl>
                          <FormDescription>The name of the subject or class.</FormDescription>
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
                            <Input placeholder="e.g., Section A" {...field} />
                          </FormControl>
                          <FormDescription>The section identifier for this class.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="grade"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Grade Level</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select grade level" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Grade 1">Grade 1</SelectItem>
                              <SelectItem value="Grade 2">Grade 2</SelectItem>
                              <SelectItem value="Grade 3">Grade 3</SelectItem>
                              <SelectItem value="Grade 4">Grade 4</SelectItem>
                              <SelectItem value="Grade 5">Grade 5</SelectItem>
                              <SelectItem value="Grade 6">Grade 6</SelectItem>
                              <SelectItem value="Grade 7">Grade 7</SelectItem>
                              <SelectItem value="Grade 8">Grade 8</SelectItem>
                              <SelectItem value="Grade 9">Grade 9</SelectItem>
                              <SelectItem value="Grade 10">Grade 10</SelectItem>
                              <SelectItem value="Grade 11">Grade 11</SelectItem>
                              <SelectItem value="Grade 12">Grade 12</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>The grade level for this class.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="upcoming">Upcoming</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>The current status of this class.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter a description of the class..."
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>A brief description of the class content and objectives.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </TabsContent>

              <TabsContent value="details" className="space-y-4 p-0">
                <CardHeader>
                  <CardTitle>Additional Details</CardTitle>
                  <CardDescription>Provide additional details about the class.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="teacher"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Teacher</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., John Smith" {...field} />
                          </FormControl>
                          <FormDescription>The primary teacher for this class.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="room"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Room</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Room 101" {...field} />
                          </FormControl>
                          <FormDescription>The room where this class is held.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="capacity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Capacity</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="e.g., 30"
                            {...field}
                            onChange={(e) => {
                              const value = e.target.value === "" ? undefined : Number.parseInt(e.target.value, 10)
                              field.onChange(value)
                            }}
                          />
                        </FormControl>
                        <FormDescription>The maximum number of students for this class.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </TabsContent>

              <TabsContent value="schedule" className="space-y-4 p-0">
                <CardHeader>
                  <CardTitle>Schedule</CardTitle>
                  <CardDescription>Set the schedule for this class.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="startDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Start Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormDescription>The date when this class starts.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="endDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>End Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormDescription>The date when this class ends.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </TabsContent>

              <CardFooter className="flex justify-between">
                <Button variant="outline" asChild>
                  <Link href="/admin/academic/classes">Cancel</Link>
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Class
                </Button>
              </CardFooter>
            </Card>
          </Tabs>
        </form>
      </Form>
    </div>
  )
}
