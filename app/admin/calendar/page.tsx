import type { Metadata } from "next"
import { AdminCalendarView } from "./components/admin-calendar-view"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { CalendarIcon, ListTodo, Calendar } from "lucide-react"
import { UpcomingEvents } from "../academic/components/upcoming-events"
import { EventCategoriesManager } from "./components/event-categories-manager"

export const metadata: Metadata = {
  title: "Calendar Management | Gradiant Admin",
  description: "Manage school calendar, events, holidays and important dates",
}

export default function AdminCalendarPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Calendar Management</h1>
          <Breadcrumb className="text-sm text-muted-foreground">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/admin/dashboard">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Calendar</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      <Tabs defaultValue="calendar" className="space-y-4">
        <TabsList>
          <TabsTrigger value="calendar" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Calendar View
          </TabsTrigger>
          <TabsTrigger value="events" className="flex items-center gap-2">
            <ListTodo className="h-4 w-4" />
            Events List
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Manage school calendar, events, holidays, and important dates. Click on a date to add or view events.
          </p>
          <AdminCalendarView />
        </TabsContent>

        <TabsContent value="events" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  Upcoming Events
                </CardTitle>
                <CardDescription>View and manage upcoming school events</CardDescription>
              </CardHeader>
              <CardContent>
                <UpcomingEvents />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Event Categories</CardTitle>
                <CardDescription>Manage event types and categories</CardDescription>
              </CardHeader>
              <CardContent>
                <EventCategoriesManager />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
