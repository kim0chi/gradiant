"use client"

import * as React from "react"
import Link from "next/link"
import {
  LayoutDashboard,
  BookOpen,
  Calendar,
  Users,
  GraduationCap,
  Settings,
  FileText,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Shield,
  Building,
  Building2,
  FolderKanban,
  FileSpreadsheet,
  Settings2,
  ShieldCheck,
  Share2,
  Upload,
  BarChart,
  PieChart,
  Activity,
  FileBarChart,
  FileEdit,
  CalendarDays,
  PartyPopperIcon as Party,
} from "lucide-react"

// Import UI components
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

// Define the props for the RoleNav component
type RoleNavProps = {
  role: "teacher" | "admin" | "student"
  variant: "desktop" | "mobile" | "tabs"
  isCollapsed?: boolean
  onToggleCollapse?: () => void
  onClose?: () => void
  currentPath?: string
}

// Define the navigation item type
type NavItem = {
  title: string
  href: string
  icon: React.ElementType
  submenu?: NavItem[]
}

/**
 * RoleNav - A responsive navigation component that adapts based on user role
 *
 * This component renders different navigation items based on the user's role
 * and adapts its UI between desktop (sidebar), mobile (drawer), and tabs (bottom bar)
 *
 * @param {RoleNavProps} props - Component props including user role and variant
 */
export function RoleNav({
  role,
  variant,
  isCollapsed = false,
  onToggleCollapse,
  onClose,
  currentPath = "",
}: RoleNavProps) {
  // Track open submenus - we'll initialize this based on the current path
  const [openSubmenus, setOpenSubmenus] = React.useState<string[]>([])

  // Define navigation items for each role - UPDATED to unify Classes and Gradebook
  const navItems: Record<string, NavItem[]> = {
    teacher: [
      {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
      },
      {
        title: "Gradebook",
        href: "/dashboard/gradebook",
        icon: BookOpen,
      },
      {
        title: "Calendar",
        href: "/dashboard/calendar",
        icon: Calendar,
        submenu: [
          {
            title: "Holidays",
            href: "/dashboard/calendar/holidays",
            icon: Calendar,
          },
          {
            title: "Events",
            href: "/dashboard/calendar/events",
            icon: Calendar,
          },
          {
            title: "Exams",
            href: "/dashboard/calendar/exams",
            icon: FileText,
          },
        ],
      },
      {
        title: "Settings",
        href: "/dashboard/settings",
        icon: Settings,
      },
    ],
    admin: [
      {
        title: "Dashboard",
        href: "/admin/dashboard",
        icon: LayoutDashboard,
      },
      {
        title: "User Management",
        href: "/admin/users",
        icon: Users,
        submenu: [
          {
            title: "All Users",
            href: "/admin/users",
            icon: Users,
          },
          {
            title: "Teachers",
            href: "/admin/users/teachers",
            icon: GraduationCap,
          },
          {
            title: "Students",
            href: "/admin/users/students",
            icon: BookOpen,
          },
          {
            title: "Admins",
            href: "/admin/users/admins",
            icon: Shield,
          },
          {
            title: "Bulk Import",
            href: "/admin/users/import",
            icon: Upload,
          },
        ],
      },
      {
        title: "Institutions",
        href: "/admin/institutions",
        icon: Building2,
        submenu: [
          {
            title: "Schools",
            href: "/admin/institutions/schools",
            icon: Building,
          },
          {
            title: "Departments",
            href: "/admin/institutions/departments",
            icon: FolderKanban,
          },
        ],
      },
      {
        title: "Academic",
        href: "/admin/academic",
        icon: GraduationCap,
        submenu: [
          {
            title: "Classes",
            href: "/admin/academic/classes",
            icon: Users,
          },
          {
            title: "Subjects",
            href: "/admin/academic/subjects",
            icon: BookOpen,
          },
          {
            title: "Grading System",
            href: "/admin/academic/grading",
            icon: FileSpreadsheet,
          },
        ],
      },
      {
        title: "System",
        href: "/admin/system",
        icon: Settings2,
        submenu: [
          {
            title: "General Settings",
            href: "/admin/system/settings",
            icon: Settings,
          },
          {
            title: "Roles & Permissions",
            href: "/admin/system/roles",
            icon: ShieldCheck,
          },
          {
            title: "Audit Logs",
            href: "/admin/system/logs",
            icon: FileText,
          },
          {
            title: "Integrations",
            href: "/admin/system/integrations",
            icon: Share2,
          },
        ],
      },
      {
        title: "Calendar",
        href: "/dashboard/calendar",
        icon: Calendar,
        submenu: [
          {
            title: "Academic Year",
            href: "/admin/calendar/academic-year",
            icon: CalendarDays,
          },
          {
            title: "Holidays",
            href: "/dashboard/calendar/holidays",
            icon: Calendar,
          },
          {
            title: "Events",
            href: "/dashboard/calendar/events",
            icon: Party,
          },
          {
            title: "Exams",
            href: "/dashboard/calendar/exams",
            icon: FileText,
          },
        ],
      },
      {
        title: "Reports",
        href: "/admin/reports",
        icon: BarChart,
        submenu: [
          {
            title: "System Overview",
            href: "/admin/reports/overview",
            icon: PieChart,
          },
          {
            title: "User Activity",
            href: "/admin/reports/activity",
            icon: Activity,
          },
          {
            title: "Academic Reports",
            href: "/admin/reports/academic",
            icon: FileBarChart,
          },
          {
            title: "Custom Reports",
            href: "/admin/reports/custom",
            icon: FileEdit,
          },
        ],
      },
    ],
    student: [
      {
        title: "Dashboard",
        href: "/dashboard/student",
        icon: LayoutDashboard,
      },
      {
        title: "Assignments",
        href: "/dashboard/student/assignments",
        icon: FileText,
      },
      {
        title: "Grades",
        href: "/dashboard/student/grades",
        icon: GraduationCap,
      },
      {
        title: "Attendance",
        href: "/dashboard/student/attendance",
        icon: Calendar,
      },
      {
        title: "Profile",
        href: "/dashboard/student/profile",
        icon: Users,
      },
      {
        title: "Settings",
        href: "/dashboard/settings",
        icon: Settings,
      },
    ],
  }

  // Get the current role's navigation items
  const currentNavItems = navItems[role] || []

  // Initialize open submenus based on current path
  React.useEffect(() => {
    if (currentPath) {
      // Find any parent menu items that should be open based on the current path
      const parentMenus = currentNavItems
        .filter((item) =>
          item.submenu?.some((subItem) => currentPath === subItem.href || currentPath.startsWith(`${subItem.href}/`)),
        )
        .map((item) => item.title)

      if (parentMenus.length > 0) {
        setOpenSubmenus(parentMenus)
      }
    }
  }, [currentPath, currentNavItems])

  // Check if a path is active - improved to handle nested routes correctly
  const isActive = (path: string) => {
    if (path === "/dashboard" && currentPath === "/dashboard") {
      return true
    }

    // Special case for gradebook - highlight for any gradebook path
    if (path === "/dashboard/gradebook" && currentPath?.startsWith("/dashboard/gradebook")) {
      return true
    }

    return currentPath === path || (currentPath?.startsWith(`${path}/`) && path !== "/dashboard")
  }

  // Toggle submenu open/closed
  const toggleSubmenu = (title: string) => {
    setOpenSubmenus((prev) => (prev.includes(title) ? prev.filter((item) => item !== title) : [...prev, title]))
  }

  // Get primary navigation items for mobile tab bar (limit to 5 items)
  // We're selecting specific items to ensure consistency between desktop and mobile
  const getMobileNavItems = () => {
    // For teachers, we want to show: Dashboard, Gradebook, Calendar, Settings
    if (role === "teacher") {
      return [
        currentNavItems.find((item) => item.title === "Dashboard"),
        currentNavItems.find((item) => item.title === "Gradebook"),
        currentNavItems.find((item) => item.title === "Calendar"),
        currentNavItems.find((item) => item.title === "Settings"),
      ].filter(Boolean) as NavItem[]
    }

    // For other roles, use the standard items
    return [
      currentNavItems.find((item) => item.title === "Dashboard"),
      currentNavItems.find((item) => item.title === "Gradebook" || item.title === "Grades"),
      currentNavItems.find((item) => item.title === "Calendar"),
      currentNavItems.find((item) => item.title === "Settings"),
    ].filter(Boolean) as NavItem[]
  }

  const mobileNavItems = getMobileNavItems()

  // Render desktop sidebar navigation
  if (variant === "desktop") {
    return (
      <div className="h-full flex flex-col">
        {/* Sidebar Header with App Logo/Name */}
        <div
          className={cn(
            "h-16 flex items-center px-4 border-b",
            // Center the logo when collapsed, otherwise justify between logo and toggle button
            isCollapsed ? "justify-center" : "justify-between",
          )}
        >
          {/* Show full logo or just "G" based on collapsed state */}
          {!isCollapsed && <div className="font-semibold text-lg">Gradiant</div>}
          {isCollapsed && <div className="font-semibold text-lg">G</div>}

          {/* Toggle button for collapsing/expanding the sidebar */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
            className="h-8 w-8"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        {/* Scrollable Navigation Area */}
        <ScrollArea className="flex-1">
          <div className={cn("py-4", isCollapsed ? "px-2" : "px-4")}>
            <nav className="space-y-1" role="menu">
              {currentNavItems.map((item) => (
                <div key={item.title} className="py-1">
                  {item.submenu && !isCollapsed ? (
                    <Collapsible
                      open={openSubmenus.includes(item.title)}
                      onOpenChange={() => toggleSubmenu(item.title)}
                    >
                      <CollapsibleTrigger asChild>
                        <div className="w-full">
                          <Link
                            href={item.href}
                            className={cn(
                              "flex items-center w-full px-3 py-2 rounded-md",
                              isCollapsed ? "justify-center" : "justify-start",
                              isActive(item.href)
                                ? "bg-secondary text-secondary-foreground"
                                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                              isActive(item.href) && !isCollapsed && "border-l-4 border-primary pl-3",
                            )}
                            role="menuitem"
                            onClick={(e) => {
                              // Prevent the default link behavior to allow the submenu to toggle
                              e.preventDefault()
                              // Navigate to the href
                              window.location.href = item.href
                            }}
                          >
                            <item.icon className={cn("h-4 w-4", !isCollapsed && "mr-2")} />
                            {!isCollapsed && <span>{item.title}</span>}
                          </Link>
                        </div>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="ml-6 mt-1 space-y-1" role="menu">
                          {item.submenu.map((subItem) => (
                            <Button
                              key={subItem.title}
                              variant={isActive(subItem.href) ? "secondary" : "ghost"}
                              className={cn(
                                "w-full justify-start",
                                // Add left border for active state
                                isActive(subItem.href) && "border-l-4 border-primary pl-3",
                              )}
                              asChild
                              role="menuitem"
                            >
                              <Link href={subItem.href}>
                                <subItem.icon className="mr-2 h-4 w-4" />
                                {subItem.title}
                              </Link>
                            </Button>
                          ))}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  ) : (
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center w-full px-3 py-2 rounded-md",
                        isCollapsed ? "justify-center" : "justify-start",
                        isActive(item.href)
                          ? "bg-secondary text-secondary-foreground"
                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                        isActive(item.href) && !isCollapsed && "border-l-4 border-primary pl-3",
                      )}
                      title={isCollapsed ? item.title : undefined}
                      aria-label={isCollapsed ? item.title : undefined}
                      role="menuitem"
                    >
                      <item.icon className={cn("h-4 w-4", !isCollapsed && "mr-2")} />
                      {!isCollapsed && <span>{item.title}</span>}
                    </Link>
                  )}
                </div>
              ))}
            </nav>
          </div>
        </ScrollArea>
      </div>
    )
  }

  // Render mobile drawer navigation
  if (variant === "mobile") {
    return (
      <div className="h-full flex flex-col">
        <div className="h-16 flex items-center justify-between px-4 border-b">
          <div className="font-semibold text-lg">Gradiant</div>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8" aria-label="Close navigation menu">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>
        <ScrollArea className="flex-1">
          <div className="px-4 py-4">
            <div className="text-sm font-medium text-muted-foreground mb-2 uppercase">
              {role.charAt(0).toUpperCase() + role.slice(1)} Menu
            </div>
            <nav className="space-y-1" role="menu">
              {currentNavItems.map((item) => (
                <div key={item.title} className="py-1">
                  {item.submenu ? (
                    <Collapsible
                      open={openSubmenus.includes(item.title)}
                      onOpenChange={() => toggleSubmenu(item.title)}
                    >
                      <CollapsibleTrigger asChild>
                        <Button
                          variant={isActive(item.href) ? "secondary" : "ghost"}
                          className={cn(
                            "w-full justify-start",
                            // Add left border for active state
                            isActive(item.href) && "border-l-4 border-primary pl-3",
                          )}
                          aria-expanded={openSubmenus.includes(item.title)}
                          role="menuitem"
                        >
                          <item.icon className="mr-2 h-4 w-4" />
                          {item.title}
                          <ChevronDown
                            className={cn(
                              "ml-auto h-4 w-4 transition-transform",
                              // Rotate the chevron when submenu is open
                              openSubmenus.includes(item.title) && "rotate-180",
                            )}
                            aria-hidden="true"
                          />
                        </Button>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="ml-6 mt-1 space-y-1" role="menu">
                          {item.submenu.map((subItem) => (
                            <Button
                              key={subItem.title}
                              variant={isActive(subItem.href) ? "secondary" : "ghost"}
                              className={cn(
                                "w-full justify-start",
                                // Add left border for active state
                                isActive(subItem.href) && "border-l-4 border-primary pl-3",
                              )}
                              asChild
                              role="menuitem"
                            >
                              <Link href={subItem.href} onClick={onClose}>
                                <subItem.icon className="mr-2 h-4 w-4" />
                                {subItem.title}
                              </Link>
                            </Button>
                          ))}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  ) : (
                    <Button
                      variant={isActive(item.href) ? "secondary" : "ghost"}
                      className={cn(
                        "w-full justify-start",
                        // Add left border for active state
                        isActive(item.href) && "border-l-4 border-primary pl-3",
                      )}
                      asChild
                      role="menuitem"
                    >
                      <Link href={item.href} onClick={onClose}>
                        <item.icon className="mr-2 h-4 w-4" />
                        {item.title}
                      </Link>
                    </Button>
                  )}
                </div>
              ))}
            </nav>
          </div>
        </ScrollArea>
      </div>
    )
  }

  // Render bottom tab bar for mobile
  if (variant === "tabs") {
    return (
      <div className="grid grid-cols-5 h-16" role="navigation" aria-label="Mobile navigation">
        {/* 
          We're using the filtered mobileNavItems array to ensure we show
          the appropriate navigation items for each role
        */}
        {mobileNavItems.map((item) => (
          <Link
            key={item.title}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center gap-1 text-muted-foreground",
              // Highlight active item with primary color
              isActive(item.href) && "text-primary",
              // Add top border for active state to provide visual cue
              isActive(item.href) && "border-t-2 border-primary pt-0.5",
            )}
            aria-label={item.title}
            aria-current={isActive(item.href) ? "page" : undefined}
          >
            <item.icon className="h-5 w-5" />
            <span className="text-xs">{item.title}</span>
          </Link>
        ))}
      </div>
    )
  }

  return null
}
