import type { Metadata } from "next"
import { GradingTabs } from "./components/grading-tabs"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { GraduationCap, Home } from "lucide-react"

export const metadata: Metadata = {
  title: "Grading System Management",
  description: "Manage institution-wide grading systems, scales, and assessment criteria",
}

export default function GradingSystemPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col gap-2">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin/dashboard">
                <Home className="h-4 w-4 mr-1" />
                Admin
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin/academic">
                <GraduationCap className="h-4 w-4 mr-1" />
                Academic
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink>Grading System</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="text-3xl font-bold tracking-tight">Grading System Management</h1>
        <p className="text-muted-foreground">
          Configure and manage institution-wide grading systems, scales, and assessment criteria.
        </p>
      </div>

      <GradingTabs />
    </div>
  )
}
