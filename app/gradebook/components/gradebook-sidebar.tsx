"use client"
import { CalendarDays, FileSpreadsheet, Settings, BarChart3, Layers } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

type GradebookView = "grades" | "attendance" | "analytics" | "settings"

interface GradebookSidebarProps {
  activeView: GradebookView
  onViewChange: (view: GradebookView) => void
  className?: string
}

export function GradebookSidebar({ activeView, onViewChange, className }: GradebookSidebarProps) {
  return (
    <Sidebar className={cn("h-[calc(100vh-4rem)]", className)} variant="inset" collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Gradebook</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeView === "grades"}
                  onClick={() => onViewChange("grades")}
                  tooltip="Grades"
                >
                  <FileSpreadsheet />
                  <span>Grades</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeView === "attendance"}
                  onClick={() => onViewChange("attendance")}
                  tooltip="Attendance"
                >
                  <CalendarDays />
                  <span>Attendance</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeView === "analytics"}
                  onClick={() => onViewChange("analytics")}
                  tooltip="Analytics"
                >
                  <BarChart3 />
                  <span>Analytics</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeView === "settings"}
                  onClick={() => onViewChange("settings")}
                  tooltip="Settings"
                >
                  <Settings />
                  <span>Settings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Categories</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="All Categories">
                  <Layers />
                  <span>All Categories</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {["Homework", "Quizzes", "Tests", "Projects"].map((category) => (
                <SidebarMenuItem key={category}>
                  <SidebarMenuButton tooltip={category}>
                    <span>{category}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
