"use client"

import { useState } from "react"
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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Check, X, Clock, AlertCircle } from "lucide-react"

// Define the form schema with Zod
const formSchema = z.object({
  score: z.string().refine(
    (val) => {
      if (val === "") return true // Allow empty string for null score
      const num = Number.parseFloat(val)
      return !isNaN(num) && num >= 0
    },
    { message: "Score must be a non-negative number" },
  ),
  feedback: z.string().optional(),
  attendance: z.enum(["present", "absent", "tardy", "excused"]),
})

type EditGradeDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  studentId: string
  taskId: string
  currentScore: number | null
  maxPoints: number
  onUpdate: (studentId: string, taskId: string, newScore: number | null) => void
}

export function EditGradeDialog({
  open,
  onOpenChange,
  studentId,
  taskId,
  currentScore,
  maxPoints,
  onUpdate,
}: EditGradeDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Initialize the form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      score: currentScore !== null ? String(currentScore) : "",
      feedback: "",
      attendance: "present",
    },
  })

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true)

    try {
      // Convert score to number or null
      const newScore = values.score === "" ? null : Number.parseFloat(values.score)

      // Validate that score doesn't exceed max points
      if (newScore !== null && newScore > maxPoints) {
        form.setError("score", {
          type: "manual",
          message: `Score cannot exceed maximum points (${maxPoints})`,
        })
        return
      }

      // Call the update function
      onUpdate(studentId, taskId, newScore)
    } catch (error) {
      console.error("Error updating grade:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Grade</DialogTitle>
          <DialogDescription>Update the student's score and attendance status.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="score"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Score (out of {maxPoints})</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      max={maxPoints}
                      step="0.1"
                      placeholder="Leave empty for ungraded"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="attendance"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Attendance Status</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="present" id="present" />
                        <Label htmlFor="present" className="flex items-center">
                          <Check className="mr-2 h-4 w-4 text-green-500" />
                          Present
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="absent" id="absent" />
                        <Label htmlFor="absent" className="flex items-center">
                          <X className="mr-2 h-4 w-4 text-red-500" />
                          Absent
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="tardy" id="tardy" />
                        <Label htmlFor="tardy" className="flex items-center">
                          <Clock className="mr-2 h-4 w-4 text-yellow-500" />
                          Tardy
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="excused" id="excused" />
                        <Label htmlFor="excused" className="flex items-center">
                          <AlertCircle className="mr-2 h-4 w-4 text-blue-500" />
                          Excused
                        </Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="feedback"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Feedback (optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Add feedback for the student..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)} type="button">
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
