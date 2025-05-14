"use client"

import { useState, useEffect } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
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
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createBrowserClient } from "@/lib/supabase/client"

// Define the form schema with Zod
const settingsSchema = z.object({
  gradeScale: z.object({
    a: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0 && Number(val) <= 100, {
      message: "Must be a number between 0 and 100",
    }),
    b: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0 && Number(val) <= 100, {
      message: "Must be a number between 0 and 100",
    }),
    c: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0 && Number(val) <= 100, {
      message: "Must be a number between 0 and 100",
    }),
    d: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0 && Number(val) <= 100, {
      message: "Must be a number between 0 and 100",
    }),
  }),
  attendanceWeight: z.boolean(),
  defaultWeights: z.object({
    homework: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0 && Number(val) <= 100, {
      message: "Must be a number between 0 and 100",
    }),
    quizzes: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0 && Number(val) <= 100, {
      message: "Must be a number between 0 and 100",
    }),
    exams: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0 && Number(val) <= 100, {
      message: "Must be a number between 0 and 100",
    }),
    projects: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0 && Number(val) <= 100, {
      message: "Must be a number between 0 and 100",
    }),
    attendance: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0 && Number(val) <= 100, {
      message: "Must be a number between 0 and 100",
    }),
  }),
  applyToAllClasses: z.boolean(),
})

type GradebookSettingsProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  classId: string | null
}

export function GradebookSettings({ open, onOpenChange, classId }: GradebookSettingsProps) {
  const supabase = createBrowserClient()
  const [activeTab, setActiveTab] = useState("grade-scale")
  const [isSaving, setIsSaving] = useState(false)

  // Initialize the form
  const form = useForm<z.infer<typeof settingsSchema>>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      gradeScale: {
        a: "90",
        b: "80",
        c: "70",
        d: "60",
      },
      attendanceWeight: true,
      defaultWeights: {
        homework: "20",
        quizzes: "15",
        exams: "40",
        projects: "15",
        attendance: "10",
      },
      applyToAllClasses: false,
    },
  })

  // Load settings when dialog opens
  useEffect(() => {
    if (open && classId) {
      // In a real app, we would fetch settings from the database
      // For now, we'll just use the default values
    }
  }, [open, classId])

  // Calculate total weight
  const totalWeight = Object.values(form.watch("defaultWeights")).reduce((sum, val) => sum + Number(val), 0)

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof settingsSchema>) => {
    if (!classId) return

    setIsSaving(true)

    try {
      // In a real app, we would save this to the database
      // For now, we'll just simulate it with a timeout
      await new Promise((resolve) => setTimeout(resolve, 1000))

      console.log("Settings saved:", values)

      // Close the dialog
      onOpenChange(false)
    } catch (error) {
      console.error("Error saving settings:", error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Gradebook Settings</DialogTitle>
          <DialogDescription>Customize your gradebook settings for this class.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="grade-scale">Grade Scale</TabsTrigger>
                <TabsTrigger value="weights">Category Weights</TabsTrigger>
                <TabsTrigger value="attendance">Attendance</TabsTrigger>
              </TabsList>

              <TabsContent value="grade-scale" className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="gradeScale.a"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>A Grade (≥)</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" max="100" {...field} />
                        </FormControl>
                        <FormDescription>Minimum percentage for an A</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="gradeScale.b"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>B Grade (≥)</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" max="100" {...field} />
                        </FormControl>
                        <FormDescription>Minimum percentage for a B</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="gradeScale.c"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>C Grade (≥)</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" max="100" {...field} />
                        </FormControl>
                        <FormDescription>Minimum percentage for a C</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="gradeScale.d"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>D Grade (≥)</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" max="100" {...field} />
                        </FormControl>
                        <FormDescription>Minimum percentage for a D</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>

              <TabsContent value="weights" className="space-y-4 pt-4">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Total Weight:</span>
                    <span className={`text-sm font-medium ${totalWeight !== 100 ? "text-red-500" : "text-green-500"}`}>
                      {totalWeight}% {totalWeight !== 100 && "(Should be 100%)"}
                    </span>
                  </div>

                  <FormField
                    control={form.control}
                    name="defaultWeights.homework"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Homework Weight (%)</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" max="100" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="defaultWeights.quizzes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quizzes Weight (%)</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" max="100" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="defaultWeights.exams"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Exams Weight (%)</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" max="100" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="defaultWeights.projects"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Projects Weight (%)</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" max="100" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="defaultWeights.attendance"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Attendance Weight (%)</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" max="100" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>

              <TabsContent value="attendance" className="space-y-4 pt-4">
                <FormField
                  control={form.control}
                  name="attendanceWeight"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Include Attendance in Grade</FormLabel>
                        <FormDescription>
                          When enabled, attendance will be factored into the final grade calculation.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </TabsContent>
            </Tabs>

            <FormField
              control={form.control}
              name="applyToAllClasses"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Apply to All Classes</FormLabel>
                    <FormDescription>
                      Apply these settings to all your classes instead of just this one.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)} type="button">
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving || totalWeight !== 100}>
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
