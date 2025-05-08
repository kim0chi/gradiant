"use client"

import * as React from "react"
import Link from "next/link"
import { LayoutDashboard, Users, GraduationCap, Settings, ChevronDown, Shield, Settings2, Calendar, BarChart, BellRing, HelpCircle, LogOut } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { clearUser, getUser } from "@/lib/mockAuth"
import { useRouter } from "next/navigation"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { cn } from "@/lib/utils"

interface AdminSidebarProps {
  collapsed?: boolean
  onToggleCollapse?: () => void
  currentPath?: string
}

export function AdminSidebar({ collapsed = false, onToggleCollapse, currentPath = "" }: AdminSidebarProps) {
  const router = useRouter()
  const user = getUser()
  const [openSections, setOpenSections] = React.useState<string[]>([])

  // Initialize open sections based on current path
  React.useEffect(() => {
    if (currentPath) {
      if (currentPath.includes("/users")) {
        setOpenSections((prev) => [...prev, "users"])
      }
      if (currentPath.includes("/academic")) {
        setOpenSections((prev) => [...prev, "academic"])
      }
      if (currentPath.includes("/system")) {
        setOpenSections((prev) => [...prev, "system"])
      }
      if (currentPath.includes("/calendar")) {
        setOpenSections((prev) => [...prev, "calendar"])
      }
      if (currentPath.includes("/reports")) {
        setOpenSections((prev) => [...prev, "reports"])
      }
    }
  }, [currentPath])

  const toggleSection = (section: string) => {
    setOpenSections((prev) => (prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]))
  }

  const isActive = (path: string) => {
    if (path === "/admin/dashboard" && currentPath === "/admin/dashboard") {
      return true
    }
    return currentPath === path || (currentPath?.startsWith(`${path}/`) && path !== "/admin/dashboard")
  }

  const handleLogout = () => {
    clearUser()
    router.push("/login")
  }

  return (
    <div className="h-full flex flex-col bg-background">
      <div
        className={cn("h-16 flex items-center border-b", collapsed ? "justify-center px-2" : "justify-between px-4")}
      >
        {!collapsed && (
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
              <Shield className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg">Admin</span>
          </Link>
        )}
        {collapsed && (
          <Link href="/admin/dashboard" className="flex items-center justify-center">
            <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
              <Shield className="h-5 w-5 text-primary-foreground" />
            </div>
          </Link>
        )}
        {!collapsed && (
          <Button variant="outline" size="sm" onClick={onToggleCollapse} aria-label="Collapse sidebar">
            <ChevronDown className="h-4 w-4 rotate-90" />
          </Button>
        )}
      </div>

      <ScrollArea className="flex-1">
        <div className={cn("py-4", collapsed ? "px-2" : "px-4")}>
          <div className="mb-4">
            <h2 className={cn("text-xs uppercase font-semibold text-muted-foreground mb-2", collapsed && "sr-only")}>
              Quick Access
            </h2>
            <nav className="space-y-1">
              <Link
                href="/admin/dashboard"
                className={cn(
                  "flex items-center py-2 rounded-md text-sm",
                  collapsed ? "justify-center px-2" : "px-3",
                  isActive("/admin/dashboard")
                    ? "bg-accent text-accent-foreground font-medium"
                    : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground",
                )}
              >
                <LayoutDashboard className={cn("h-4 w-4", !collapsed && "mr-2")} />
                {!collapsed && <span>Dashboard</span>}
              </Link>
              <Link
                href="/admin/users"
                className={cn(
                  "flex items-center py-2 rounded-md text-sm",
                  collapsed ? "justify-center px-2" : "px-3",
                  isActive("/admin/users")
                    ? "bg-accent text-accent-foreground font-medium"
                    : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground",
                )}
              >
                <Users className={cn("h-4 w-4", !collapsed && "mr-2")} />
                {!collapsed && <span>Users</span>}
              </Link>
              <Link
                href="/admin/system/settings"
                className={cn(
                  "flex items-center py-2 rounded-md text-sm",
                  collapsed ? "justify-center px-2" : "px-3",
                  isActive("/admin/system/settings")
                    ? "bg-accent text-accent-foreground font-medium"
                    : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground",
                )}
              >
                <Settings className={cn("h-4 w-4", !collapsed && "mr-2")} />
                {!collapsed && <span>Settings</span>}
              </Link>
            </nav>
          </div>

          {!collapsed && (
            <>
              <div className="mb-4">
                <h2 className="text-xs uppercase font-semibold text-muted-foreground mb-2">Management</h2>
                <nav className="space-y-1">
                  <Collapsible open={openSections.includes("users")} onOpenChange={() => toggleSection("users")}>
                    <CollapsibleTrigger className="w-full">
                      <div
                        className={cn(
                          "flex items-center justify-between w-full px-3 py-2 text-sm rounded-md",
                          currentPath?.includes("/users")
                            ? "bg-accent text-accent-foreground font-medium"
                            : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground",
                        )}
                      >
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-2" />
                          <span>User Management</span>
                        </div>
                        <ChevronDown
                          className={cn("h-4 w-4 transition-transform", openSections.includes("users") && "rotate-180")}
                        />
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="pl-6 mt-1 space-y-1">
                        <Link
                          href="/admin/users/dashboard"
                          className={cn(
                            "flex items-center px-3 py-2 text-sm rounded-md",
                            isActive("/admin/users/dashboard")
                              ? "bg-accent/70 text-accent-foreground font-medium"
                              : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground",
                          )}
                        >
                          User Management
                        </Link>
                        <Link
                          href="/admin/users"
                          className={cn(
                            "flex items-center px-3 py-2 text-sm rounded-md",
                            isActive("/admin/users") && currentPath === "/admin/users"
                              ? "bg-accent/70 text-accent-foreground font-medium"
                              : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground",
                          )}
                        >
                          All Users
                        </Link>
                        <Link
                          href="/admin/users/teachers"
                          className={cn(
                            "flex items-center px-3 py-2 text-sm rounded-md",
                            isActive("/admin/users/teachers")
                              ? "bg-accent/70 text-accent-foreground font-medium"
                              : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground",
                          )}
                        >
                          Teachers
                        </Link>
                        <Link
                          href="/admin/users/students"
                          className={cn(
                            "flex items-center px-3 py-2 text-sm rounded-md",
                            isActive("/admin/users/students")
                              ? "bg-accent/70 text-accent-foreground font-medium"
                              : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground",
                          )}
                        >
                          Students
                        </Link>
                        <Link
                          href="/admin/users/admins"
                          className={cn(
                            "flex items-center px-3 py-2 text-sm rounded-md",
                            isActive("/admin/users/admins")
                              ? "bg-accent/70 text-accent-foreground font-medium"
                              : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground",
                          )}
                        >
                          Admins
                        </Link>
                        <Link
                          href="/admin/users/new"
                          className={cn(
                            "flex items-center px-3 py-2 text-sm rounded-md",
                            isActive("/admin/users/new")
                              ? "bg-accent/70 text-accent-foreground font-medium"
                              : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground",
                          )}
                        >
                          Add New User
                        </Link>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>

                  <Collapsible open={openSections.includes("academic")} onOpenChange={() => toggleSection("academic")}>
                    <CollapsibleTrigger className="w-full">
                      <div
                        className={cn(
                          "flex items-center justify-between w-full px-3 py-2 text-sm rounded-md",
                          currentPath?.includes("/academic")
                            ? "bg-accent text-accent-foreground font-medium"
                            : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground",
                        )}
                      >
                        <div className="flex items-center">
                          <GraduationCap className="h-4 w-4 mr-2" />
                          <span>Academic</span>
                        </div>
                        <ChevronDown
                          className={cn(
                            "h-4 w-4 transition-transform",
                            openSections.includes("academic") && "rotate-180",
                          )}
                        />
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="pl-6 mt-1 space-y-1">
                        <Button
                          variant="ghost"
                          className={cn(
                            "w-full justify-start",
                            isActive("/admin/academic/classes") &&
                              "bg-accent/70 text-accent-foreground font-medium border-l-4 border-primary pl-3",
                          )}
                          asChild
                          role="menuitem"
                        >
                          <Link href="/admin/academic/classes" onClick={(e) => e.stopPropagation()}>
                            Classes
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          className={cn(
                            "w-full justify-start",
                            isActive("/admin/academic/subjects") &&
                              "bg-accent/70 text-accent-foreground font-medium border-l-4 border-primary pl-3",
                          )}
                          asChild
                          role="menuitem"
                        >
                          <Link href="/admin/academic/subjects" onClick={(e) => e.stopPropagation()}>
                            Subjects
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          className={cn(
                            "w-full justify-start",
                            isActive("/admin/academic/grading") &&
                              "bg-accent/70 text-accent-foreground font-medium border-l-4 border-primary pl-3",
                          )}
                          asChild
                          role="menuitem"
                        >
                          <Link href="/admin/academic/grading" onClick={(e) => e.stopPropagation()}>
                            Grading System
                          </Link>
                        </Button>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>

                  <Collapsible open={openSections.includes("system")} onOpenChange={() => toggleSection("system")}>
                    <CollapsibleTrigger className="w-full">
                      <div
                        className={cn(
                          "flex items-center justify-between w-full px-3 py-2 text-sm rounded-md",
                          currentPath?.includes("/system")
                            ? "bg-accent text-accent-foreground font-medium"
                            : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground",
                        )}
                      >
                        <div className="flex items-center">
                          <Settings2 className="h-4 w-4 mr-2" />
                          <span>System</span>
                        </div>
                        <ChevronDown
                          className={cn(
                            "h-4 w-4 transition-transform",
                            openSections.includes("system") && "rotate-180",
                          )}
                        />
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="pl-6 mt-1 space-y-1">
                        <Link
                          href="/admin/system/settings"
                          className={cn(
                            "flex items-center px-3 py-2 text-sm rounded-md",
                            isActive("/admin/system/settings")
                              ? "bg-accent/70 text-accent-foreground font-medium"
                              : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground",
                          )}
                        >
                          General Settings
                        </Link>
                        <Link
                          href="/admin/system/roles"
                          className={cn(
                            "flex items-center px-3 py-2 text-sm rounded-md",
                            isActive("/admin/system/roles")
                              ? "bg-accent/70 text-accent-foreground font-medium"
                              : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground",
                          )}
                        >
                          Roles & Permissions
                        </Link>
                        <Link
                          href="/admin/system/logs"
                          className={cn(
                            "flex items-center px-3 py-2 text-sm rounded-md",
                            isActive("/admin/system/logs")
                              ? "bg-accent/70 text-accent-foreground font-medium"
                              : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground",
                          )}
                        >
                          Audit Logs
                        </Link>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </nav>
              </div>

              <div className="mb-4">
                <h2 className="text-xs uppercase font-semibold text-muted-foreground mb-2">Resources</h2>
                <nav className="space-y-1">
                  <Link
                    href="/admin/calendar"
                    className={cn(
                      "flex items-center px-3 py-2 text-sm rounded-md",
                      isActive("/admin/calendar")
                        ? "bg-accent text-accent-foreground font-medium"
                        : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground",
                    )}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>Calendar</span>
                  </Link>
                  <Link
                    href="/admin/reports"
                    className={cn(
                      "flex items-center px-3 py-2 text-sm rounded-md",
                      isActive("/admin/reports")
                        ? "bg-accent text-accent-foreground font-medium"
                        : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground",
                    )}
                  >
                    <BarChart className="h-4 w-4 mr-2" />
                    <span>Reports</span>
                  </Link>
                  <Link
                    href="/admin/notifications"
                    className={cn(
                      "flex items-center px-3 py-2 text-sm rounded-md",
                      isActive("/admin/notifications")
                        ? "bg-accent text-accent-foreground font-medium"
                        : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground",
                    )}
                  >
                    <BellRing className="h-4 w-4 mr-2" />
                    <span>Notifications</span>
                  </Link>
                  <Link
                    href="/admin/help"
                    className={cn(
                      "flex items-center px-3 py-2 text-sm rounded-md",
                      isActive("/admin/help")
                        ? "bg-accent text-accent-foreground font-medium"
                        : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground",
                    )}
                  >
                    <HelpCircle className="h-4 w-4 mr-2" />
                    <span>Help & Support</span>
                  </Link>
                </nav>
              </div>
            </>
          )}
        </div>
      </ScrollArea>

      {!collapsed && (
        <div className="p-4 border-t">
          <div className="flex items-center">
            <Avatar className="h-8 w-8">
              <AvatarFallback>
                {/* Using a static fallback to prevent hydration mismatch */}
                AU
              </AvatarFallback>
            </Avatar>
            <div className="ml-2 leading-none">
              <p className="text-sm font-medium">{user?.name || "Admin User"}</p>
              <p className="text-xs text-muted-foreground">Administrator</p>
            </div>
            <Button variant="ghost" size="icon" className="ml-auto" onClick={handleLogout} aria-label="Log out">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
