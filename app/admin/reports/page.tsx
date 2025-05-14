import type { Metadata } from "next"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { GradesReport } from "./components/grades-report"
import { AttendanceReport } from "./components/attendance-report"
import { UserActivityReport } from "./components/user-activity-report"
import { SystemUsageReport } from "./components/system-usage-report"

export const metadata: Metadata = {
  title: "Reports & Analytics | Gradiant Admin",
  description: "View and generate reports for grades, attendance, and system usage",
}

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Reports & Analytics</h1>
          <Breadcrumb className="text-sm text-muted-foreground">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/admin/dashboard">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Reports</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      <p className="text-muted-foreground">
        Generate and download reports for school performance, attendance, and system usage.
      </p>

      <Tabs defaultValue="grades" className="space-y-4">
        <TabsList>
          <TabsTrigger value="grades">Academic Performance</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="user-activity">User Activity</TabsTrigger>
          <TabsTrigger value="system-usage">System Usage</TabsTrigger>
        </TabsList>

        <TabsContent value="grades">
          <GradesReport />
        </TabsContent>

        <TabsContent value="attendance">
          <AttendanceReport />
        </TabsContent>

        <TabsContent value="user-activity">
          <UserActivityReport />
        </TabsContent>

        <TabsContent value="system-usage">
          <SystemUsageReport />
        </TabsContent>
      </Tabs>
    </div>
  )
}
