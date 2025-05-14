"use client"

import { useState, useEffect } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { getMockUser } from "@/lib/mockAuth"

// Mock classes data for testing navigation
const MOCK_CLASSES = [
  { id: "class-1", name: "Mathematics 101", subject: "Math", period: 1, room: "A101" },
  { id: "class-2", name: "English Literature", subject: "English", period: 2, room: "B202" },
  { id: "class-3", name: "Physics", subject: "Science", period: 3, room: "C303" },
  { id: "class-4", name: "History", subject: "Social Studies", period: 4, room: "D404" },
]

type ClassSelectorProps = {
  selectedClass: string | null
  onSelectClass: (classId: string) => void
}

export function ClassSelector({ selectedClass, onSelectClass }: ClassSelectorProps) {
  const [open, setOpen] = useState(false)
  const [classes, setClasses] = useState<any[]>([]) // Initialize as empty array
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchClasses() {
      try {
        setLoading(true)

        // Get current user from mock auth
        const user = getMockUser()

        // Use mock classes data
        const classesData = [...MOCK_CLASSES]

        // Filter classes based on user role if needed
        if (user?.role === "teacher") {
          // For teachers, we could filter classes if needed
          // This is just for demonstration
        }

        setClasses(classesData)

        // Auto-select the first class if none is selected
        if (!selectedClass && classesData.length > 0) {
          onSelectClass(classesData[0].id)
        }
      } catch (error) {
        console.error("Error fetching classes:", error)
        // Set empty array to prevent undefined
        setClasses([])
      } finally {
        setLoading(false)
      }
    }

    fetchClasses()
  }, [selectedClass, onSelectClass])

  // Get the selected class name - safely handle the case where classes might be undefined
  const selectedClassName =
    classes && classes.length > 0
      ? classes.find((c) => c.id === selectedClass)?.name || "Select a class"
      : "Select a class"

  if (loading) {
    return <Skeleton className="h-10 w-[200px]" />
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-[200px] justify-between">
          {selectedClassName}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search classes..." />
          <CommandList>
            <CommandEmpty>No classes found.</CommandEmpty>
            <CommandGroup>
              {classes.map((classItem) => (
                <CommandItem
                  key={classItem.id}
                  value={classItem.name}
                  onSelect={() => {
                    onSelectClass(classItem.id)
                    setOpen(false)
                  }}
                >
                  <Check className={cn("mr-2 h-4 w-4", selectedClass === classItem.id ? "opacity-100" : "opacity-0")} />
                  {classItem.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
