"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

// Define the schema for the form
const formSchema = z.object({
  periodId: z.string({
    required_error: "Please select a grading period",
  }),
})

interface Period {
  id: string
  name: string
  startDate?: string
  endDate?: string
  weight?: number
}

interface PeriodSelectorProps {
  periods: Period[]
  selectedPeriod: string
  onPeriodChange: (periodId: string) => void
}

export function PeriodSelector({ periods, selectedPeriod, onPeriodChange }: PeriodSelectorProps) {
  const [open, setOpen] = React.useState(false)

  // Initialize the form with the selected period
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      periodId: selectedPeriod,
    },
  })

  // Update form value when selectedPeriod changes
  React.useEffect(() => {
    if (selectedPeriod) {
      form.setValue("periodId", selectedPeriod)
    }
  }, [selectedPeriod, form])

  // Handle form submission
  function onSubmit(values: z.infer<typeof formSchema>) {
    onPeriodChange(values.periodId)
    setOpen(false)
  }

  // Get the current period name
  const currentPeriodName = React.useMemo(() => {
    const period = periods.find((period) => period.id === selectedPeriod)
    return period?.name || "Select Period"
  }, [periods, selectedPeriod])

  // Add keyboard navigation support
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        setOpen(false)
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [open, setOpen])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <FormField
          control={form.control}
          name="periodId"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Select Grading Period</FormLabel>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className={cn(
                        "w-full justify-between px-3 py-2 font-normal",
                        !field.value && "text-muted-foreground",
                      )}
                      onClick={() => setOpen(!open)}
                      type="button"
                    >
                      {currentPeriodName}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Search period..." className="h-9" />
                    <CommandList>
                      <CommandEmpty>No period found.</CommandEmpty>
                      <CommandGroup>
                        {periods.map((period) => (
                          <CommandItem
                            key={period.id}
                            value={period.id}
                            onSelect={() => {
                              form.setValue("periodId", period.id)
                              onPeriodChange(period.id)
                              setOpen(false)
                            }}
                          >
                            <Check
                              className={cn("mr-2 h-4 w-4", period.id === field.value ? "opacity-100" : "opacity-0")}
                            />
                            {period.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}
