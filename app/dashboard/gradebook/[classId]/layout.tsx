"use client"

import React, { use } from "react"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { Book, BarChart2, CheckSquare, Settings, ArrowLeft, Users, FileSpreadsheet, ListTodo } from "lucide-react"

import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slot } from "@/components/ui/slot"

// Define the props for the GradebookLayout component
interface GradebookLayoutProps {
  children: React.ReactNode
  params: Promise<{
    classId: string
  }>
}

// Define the tab type
type Tab = {
  name: string
  href: string
  icon: React.ElementType
}

export default function GradebookLayout({ children, params }: GradebookLayoutProps) {
  const { classId } = use(params)
  const pathname = usePathname()

  // Define the tabs for the gradebook
  // Updated to include Grade Sheet between Attendance and Analytics
  // Added Tasks tab from Settings into the primary navigation
  const tabs: Tab[] = [
    {
      name: "Grading",
      href: `/dashboard/gradebook/${classId}/grading`,
      icon: Book,
    },
    {
      name: "Attendance",
      href: `/dashboard/gradebook/${classId}/attendance`,
      icon: CheckSquare,
    },
    {
      name: "Grade Sheet",
      href: `/dashboard/gradebook/${classId}/gradesheet`,
      icon: FileSpreadsheet,
    },
    {
      name: "Tasks",
      href: `/dashboard/gradebook/${classId}/tasks`,
      icon: ListTodo,
    },
    {
      name: "Analytics",
      href: `/dashboard/gradebook/${classId}/analytics`,
      icon: BarChart2,
    },
    {
      name: "Students",
      href: `/dashboard/gradebook/${classId}/students`,
      icon: Users,
    },
    {
      name: "Settings",
      href: `/dashboard/gradebook/${classId}/settings`,
      icon: Settings,
    },
  ]

  // Check if a tab is active
  const isActive = (href: string) => pathname === href

  return (
    <div className="container mx-auto py-6">
      {/* Class information and breadcrumb */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <Button variant="ghost" size="sm" className="h-8 px-2" asChild>
            <Link href="/dashboard/gradebook" className="flex items-center gap-1">
              <ArrowLeft className="h-4 w-4" />
              Back to Classes
            </Link>
          </Button>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Mathematics 101</h1>
        <p className="text-muted-foreground mt-1">Section A • First Semester 2023-2024</p>
      </div>

      {/* Desktop tabs - horizontal navigation */}
      <div className="hidden md:block mb-6 overflow-x-auto">
        <div className="border-b min-w-max" role="tablist" aria-label="Gradebook tabs">
          <div className="flex space-x-4">
            {tabs.map((tab) => (
              <Link
                key={tab.name}
                href={tab.href}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors",
                  isActive(tab.href)
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted",
                )}
                aria-selected={isActive(tab.href)}
                role="tab"
              >
                <tab.icon className="h-4 w-4" />
                {tab.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile tabs - bottom navigation with scrolling */}
      <div className="fixed bottom-0 left-0 right-0 z-10 bg-background border-t md:hidden overflow-x-auto">
        <div className="grid grid-cols-7 h-16 min-w-max" role="tablist" aria-label="Gradebook tabs">
          {tabs.map((tab) => (
            <Link
              key={tab.name}
              href={tab.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 px-3",
                isActive(tab.href) ? "text-primary" : "text-muted-foreground",
              )}
              aria-selected={isActive(tab.href)}
              role="tab"
            >
              <tab.icon className="h-5 w-5" />
              <span className="text-xs whitespace-nowrap">{tab.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Main content area */}
      <Card className="p-6 mb-20 md:mb-6" role="tabpanel">
        <Slot>{children}</Slot>
      </Card>
    </div>
  )
}
