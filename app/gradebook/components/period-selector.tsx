"use client"

import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useState } from "react"

// Define the available grading periods
const periods = [
  { id: "current-quarter", name: "Current Quarter" },
  { id: "quarter-1", name: "Quarter 1" },
  { id: "quarter-2", name: "Quarter 2" },
  { id: "quarter-3", name: "Quarter 3" },
  { id: "quarter-4", name: "Quarter 4" },
  { id: "semester-1", name: "Semester 1" },
  { id: "semester-2", name: "Semester 2" },
  { id: "full-year", name: "Full Year" },
  { id: "custom", name: "Custom Range" },
]

type PeriodSelectorProps = {
  selectedPeriod: string
  onPeriodChange: (period: string) => void
}

export function PeriodSelector({ selectedPeriod, onPeriodChange }: PeriodSelectorProps) {
  const [open, setOpen] = useState(false)

  // Find the selected period
  const selected = periods.find((period) => period.id === selectedPeriod)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-[200px] justify-between">
          {selected?.name || "Select period..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search period..." />
          <CommandList>
            <CommandEmpty>No period found.</CommandEmpty>
            <CommandGroup>
              {periods.map((period) => (
                <CommandItem
                  key={period.id}
                  value={period.id}
                  onSelect={() => {
                    onPeriodChange(period.id)
                    setOpen(false)
                  }}
                >
                  <Check className={cn("mr-2 h-4 w-4", selectedPeriod === period.id ? "opacity-100" : "opacity-0")} />
                  {period.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
