"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Filter, Search, Settings } from "lucide-react"
import { Input } from "@/components/ui/input"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { ClassSelector } from "./components/class-selector"
import { PeriodSelector } from "./components/period-selector"
import { GradeOverview } from "./components/grade-overview"
import { GradeTable } from "./components/grade-table"
import { AttendanceCalendar } from "./components/attendance-calendar"
import { AnalyticsWidget } from "./components/analytics-widget"
import { NewTaskDialog } from "./components/new-task-dialog"
import { CategoryManager } from "./components/category-manager"
import { GradebookSettings } from "./components/gradebook-settings"
import { ImportExportMenu } from "./components/import-export-menu"

// Define types for our props and state
type Class = {
  id: string
  name: string
  subject: string
  period: number
  room: string
}

type GradebookClientProps = {
  initialClasses: Class[]
  userId: string
}

export default function GradebookClient({ initialClasses, userId }: GradebookClientProps) {
  // Initialize Supabase client
  const router = useRouter()
  const searchParams = useSearchParams()

  // Get the active tab from URL or default to "grades"
  const activeTab = searchParams.get("tab") || "grades"

  // State for the component
  const [classes, setClasses] = useState<Class[]>(initialClasses)
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null)
  const [selectedPeriod, setSelectedPeriod] = useState<string>("current-quarter")
  const [isNewTaskDialogOpen, setIsNewTaskDialogOpen] = useState(false)
  const [isCategoryManagerOpen, setIsCategoryManagerOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  // Set the first class as selected by default if none is selected
  useEffect(() => {
    if (classes.length > 0 && !selectedClassId) {
      setSelectedClassId(classes[0].id)
    }
  }, [classes, selectedClassId])

  // Handle tab change
  const handleTabChange = (value: string) => {
    router.push(`/gradebook?tab=${value}`)
  }

  // Handle class change
  const handleClassChange = (classId: string) => {
    setSelectedClassId(classId)
  }

  // Handle period change
  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period)
  }

  // Get the selected class object
  const selectedClass = classes.find((c) => c.id === selectedClassId)

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex flex-col gap-2">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Gradebook</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="text-3xl font-bold tracking-tight">Gradebook</h1>
          <p className="text-muted-foreground">Manage grades and attendance for your classes</p>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button variant="outline" size="icon" onClick={() => setIsSettingsOpen(true)}>
            <Settings className="h-4 w-4" />
            <span className="sr-only">Settings</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-2">
          <CardHeader className="pb-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                <ClassSelector classes={classes} selectedClassId={selectedClassId} onClassChange={handleClassChange} />
              </div>
              <PeriodSelector selectedPeriod={selectedPeriod} onPeriodChange={handlePeriodChange} />
            </div>
          </CardHeader>
          <CardContent>
            {selectedClass && <GradeOverview classId={selectedClass.id} period={selectedPeriod} />}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="default" className="w-full justify-start" onClick={() => setIsNewTaskDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              New Task
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={() => setIsCategoryManagerOpen(true)}>
              <Filter className="mr-2 h-4 w-4" />
              Manage Categories
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => router.push(`/analytics?classId=${selectedClassId}`)}
            >
              View Full Analytics
            </Button>
            <ImportExportMenu classId={selectedClassId} />
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search students or tasks..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList>
          <TabsTrigger value="grades">Grades</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
        </TabsList>

        <TabsContent value="grades" className="space-y-4 mt-6">
          {selectedClassId && (
            <GradeTable classId={selectedClassId} period={selectedPeriod} searchQuery={searchQuery} />
          )}
        </TabsContent>

        <TabsContent value="attendance" className="space-y-4 mt-6">
          {selectedClassId && <AttendanceCalendar classId={selectedClassId} searchQuery={searchQuery} />}
        </TabsContent>
      </Tabs>

      {selectedClassId && (
        <Card>
          <CardHeader>
            <CardTitle>Class Performance</CardTitle>
            <CardDescription>Grade distribution for {selectedClass?.name}</CardDescription>
          </CardHeader>
          <CardContent>
            <AnalyticsWidget classId={selectedClassId} period={selectedPeriod} />
          </CardContent>
        </Card>
      )}

      {/* Dialogs */}
      <NewTaskDialog open={isNewTaskDialogOpen} onOpenChange={setIsNewTaskDialogOpen} classId={selectedClassId} />
      <CategoryManager open={isCategoryManagerOpen} onOpenChange={setIsCategoryManagerOpen} classId={selectedClassId} />
      <GradebookSettings open={isSettingsOpen} onOpenChange={setIsSettingsOpen} classId={selectedClassId} />
    </div>
  )
}
