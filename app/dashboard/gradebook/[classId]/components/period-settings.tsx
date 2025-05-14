"use client"

import { useState, useEffect } from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useFieldArray } from "react-hook-form"
import { format } from "date-fns"
import { CalendarIcon, Plus, Trash2, AlertCircle, Save } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Slider } from "@/components/ui/slider"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import { PeriodSchema } from "@/types/gradebook-schemas"

// Define Zod schema for form
const formSchema = z.object({
  periods: z
    .array(PeriodSchema)
    .min(1, "At least one grading period is required")
    .refine(
      (periods) => {
        const total = periods.reduce((sum, period) => sum + period.weight, 0)
        return Math.abs(total - 100) < 0.01 // Allow for floating point precision issues
      },
      {
        message: "Period weights must sum to 100%",
      },
    ),
})

type PeriodSettingsProps = {
  classId: string
}

export function PeriodSettings({ classId }: PeriodSettingsProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  // Default periods
  const defaultPeriods = [
    { id: "1", name: "Prelims", startDate: new Date().toISOString(), endDate: new Date().toISOString(), weight: 25 },
    { id: "2", name: "Midterms", startDate: new Date().toISOString(), endDate: new Date().toISOString(), weight: 25 },
    {
      id: "3",
      name: "Semi-Finals",
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
      weight: 25,
    },
    { id: "4", name: "Finals", startDate: new Date().toISOString(), endDate: new Date().toISOString(), weight: 25 },
  ]

  // Initialize form with React Hook Form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      periods: defaultPeriods,
    },
  })

  // Setup field array for dynamic periods management
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "periods",
  })

  // Calculate total weight of all periods
  const periods = form.watch("periods")
  const totalWeight = periods.reduce((sum, period) => sum + period.weight, 0)
  const isValidTotal = Math.abs(totalWeight - 100) < 0.01

  // Fetch existing periods on component mount
  useEffect(() => {
    const fetchPeriods = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`/api/classes/${classId}/periods`)

        if (!response.ok) {
          throw new Error("Failed to fetch periods")
        }

        const data = await response.json()

        if (data.periods && data.periods.length > 0) {
          form.reset({ periods: data.periods })
        }
      } catch (err) {
        console.error("Error fetching periods:", err)
        setError("Failed to load grading periods. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchPeriods()
  }, [classId, form])

  // Handle form submission
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/classes/${classId}/periods`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Failed to update periods")
      }

      toast({
        title: "Success",
        description: "Grading periods updated successfully.",
      })
    } catch (err) {
      console.error("Error saving periods:", err)
      setError("Failed to save grading periods. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Add a new period
  const addPeriod = () => {
    append({
      id: `new-${Date.now()}`,
      name: "",
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
      weight: 0,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Grading Periods</CardTitle>
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

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Period Name</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Weight (%)</TableHead>
                  <TableHead className="w-[80px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fields.map((field, index) => (
                  <TableRow key={field.id}>
                    <TableCell>
                      <FormField
                        control={form.control}
                        name={`periods.${index}.name`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <FormField
                        control={form.control}
                        name={`periods.${index}.startDate`}
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={"outline"}
                                    className={cn(
                                      "w-full pl-3 text-left font-normal",
                                      !field.value && "text-muted-foreground",
                                    )}
                                  >
                                    {field.value ? (
                                      format(new Date(field.value), "MMM d, yyyy")
                                    ) : (
                                      <span>Pick a date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={field.value ? new Date(field.value) : undefined}
                                  onSelect={(date) => field.onChange(date ? date.toISOString() : undefined)}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <FormField
                        control={form.control}
                        name={`periods.${index}.endDate`}
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={"outline"}
                                    className={cn(
                                      "w-full pl-3 text-left font-normal",
                                      !field.value && "text-muted-foreground",
                                    )}
                                  >
                                    {field.value ? (
                                      format(new Date(field.value), "MMM d, yyyy")
                                    ) : (
                                      <span>Pick a date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={field.value ? new Date(field.value) : undefined}
                                  onSelect={(date) => field.onChange(date ? date.toISOString() : undefined)}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <FormField
                        control={form.control}
                        name={`periods.${index}.weight`}
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex items-center gap-4">
                              <FormControl className="flex-1">
                                <Slider
                                  value={[field.value]}
                                  min={0}
                                  max={100}
                                  step={1}
                                  onValueChange={(value) => field.onChange(value[0])}
                                  aria-label={`${periods[index].name || "Period"} weight percentage`}
                                />
                              </FormControl>
                              <span className="w-8 text-right font-medium">{field.value}%</span>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => remove(index)}
                        disabled={fields.length <= 1}
                        aria-label={`Remove ${periods[index].name || "period"}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="flex justify-between items-center pt-4 border-t">
              <span className="font-medium">Total Weight:</span>
              <span className={`font-bold ${isValidTotal ? "text-green-500" : "text-red-500"}`}>
                {totalWeight.toFixed(0)}%{!isValidTotal && " (Must equal 100%)"}
              </span>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={addPeriod} className="flex items-center gap-1">
              <Plus className="h-4 w-4" />
              <span>Add Period</span>
            </Button>
            <Button type="submit" disabled={loading || !isValidTotal} className="flex items-center gap-1">
              <Save className="h-4 w-4" />
              <span>{loading ? "Saving..." : "Save Periods"}</span>
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}
