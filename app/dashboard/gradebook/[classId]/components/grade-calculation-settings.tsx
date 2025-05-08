"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

// Define the schema for the form
const CalculationSettingsSchema = z.object({
  calculationMode: z.enum(["weighted", "summary"], {
    required_error: "Please select a calculation mode",
  }),
})

type CalculationSettings = z.infer<typeof CalculationSettingsSchema>

// Mock API function to fetch class settings
const fetchClassSettings = async (classId: string) => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 800))
  return {
    calculationMode: "weighted" as const,
  }
}

// Mock API function to update class settings
const updateClassSettings = async (classId: string, settings: CalculationSettings) => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1200))
  return settings
}

export function GradeCalculationSettings({ classId }: { classId: string }) {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  const form = useForm<CalculationSettings>({
    resolver: zodResolver(CalculationSettingsSchema),
    defaultValues: {
      calculationMode: "weighted",
    },
  })

  // Fetch current settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settings = await fetchClassSettings(classId)
        form.reset(settings)
      } catch (error) {
        console.error("Error fetching class settings:", error)
        toast({
          title: "Error",
          description: "Failed to load calculation settings",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchSettings()
  }, [classId, form, toast])

  // Handle form submission
  const onSubmit = async (data: CalculationSettings) => {
    setSaving(true)
    try {
      await updateClassSettings(classId, data)
      toast({
        title: "Success",
        description: "Grade calculation settings updated",
      })
    } catch (error) {
      console.error("Error updating class settings:", error)
      toast({
        title: "Error",
        description: "Failed to update calculation settings",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-full" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Grade Summary Calculation Mode</CardTitle>
        <CardDescription>Choose how final grades are calculated across periods and categories</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="calculationMode"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Calculation Mode</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="weighted" />
                        </FormControl>
                        <FormLabel className="font-normal">Weighted (uses category weights + task scores)</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="summary" />
                        </FormControl>
                        <FormLabel className="font-normal">Summary (uses the final-period grades directly)</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormDescription>
                    {field.value === "weighted"
                      ? "Weighted mode calculates grades by applying category weights to individual task scores."
                      : "Summary mode uses the period grades you've entered directly without recalculating from tasks."}
                  </FormDescription>
                </FormItem>
              )}
            />
            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save Calculation Settings"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
