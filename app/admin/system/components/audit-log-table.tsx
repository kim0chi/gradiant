"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Search,
  UserPlus,
  LogIn,
  Settings,
  FileEdit,
  Trash2,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

// Sample audit log data
const auditLogs = [
  {
    id: "log-001",
    timestamp: "2023-05-06 10:42:15",
    user: "Admin User",
    action: "settings_changed",
    details: "Updated system settings",
    ip: "192.168.1.1",
    severity: "info",
  },
  {
    id: "log-002",
    timestamp: "2023-05-06 09:30:22",
    user: "John Smith",
    action: "user_login",
    details: "User logged in",
    ip: "192.168.1.42",
    severity: "info",
  },
  {
    id: "log-003",
    timestamp: "2023-05-06 09:15:10",
    user: "Emma Thompson",
    action: "user_created",
    details: "New user account created",
    ip: "192.168.1.56",
    severity: "info",
  },
  {
    id: "log-004",
    timestamp: "2023-05-05 16:42:30",
    user: "System",
    action: "backup_completed",
    details: "Database backup completed successfully",
    ip: "localhost",
    severity: "info",
  },
  {
    id: "log-005",
    timestamp: "2023-05-05 14:22:18",
    user: "Sarah Johnson",
    action: "record_updated",
    details: "Updated student record ID: STU-2023-042",
    ip: "192.168.1.105",
    severity: "info",
  },
  {
    id: "log-006",
    timestamp: "2023-05-05 11:05:45",
    user: "Michael Chen",
    action: "record_deleted",
    details: "Deleted class record ID: CLS-2023-015",
    ip: "192.168.1.87",
    severity: "warning",
  },
  {
    id: "log-007",
    timestamp: "2023-05-05 10:18:33",
    user: "System",
    action: "system_error",
    details: "Database connection timeout",
    ip: "localhost",
    severity: "error",
  },
  {
    id: "log-008",
    timestamp: "2023-05-04 15:42:12",
    user: "David Wilson",
    action: "user_login_failed",
    details: "Failed login attempt",
    ip: "192.168.1.201",
    severity: "warning",
  },
  {
    id: "log-009",
    timestamp: "2023-05-04 14:30:55",
    user: "Admin User",
    action: "user_role_changed",
    details: "Changed role for user ID: USR-2023-078",
    ip: "192.168.1.1",
    severity: "info",
  },
  {
    id: "log-010",
    timestamp: "2023-05-04 09:15:22",
    user: "System",
    action: "system_update",
    details: "System updated to version 2.4.1",
    ip: "localhost",
    severity: "info",
  },
]

export function AuditLogTable() {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [filterSeverity, setFilterSeverity] = useState("all")
  const [filterAction, setFilterAction] = useState("all")

  const itemsPerPage = 8

  // Filter logs based on search term and filters
  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch =
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.ip.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesSeverity = filterSeverity === "all" || log.severity === filterSeverity
    const matchesAction = filterAction === "all" || log.action === filterAction

    return matchesSearch && matchesSeverity && matchesAction
  })

  // Paginate logs
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage)
  const paginatedLogs = filteredLogs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  // Function to get action icon
  const getActionIcon = (action: string) => {
    switch (action) {
      case "user_login":
        return <LogIn className="h-4 w-4" />
      case "user_created":
        return <UserPlus className="h-4 w-4" />
      case "settings_changed":
        return <Settings className="h-4 w-4" />
      case "record_updated":
        return <FileEdit className="h-4 w-4" />
      case "record_deleted":
        return <Trash2 className="h-4 w-4" />
      case "system_error":
        return <AlertTriangle className="h-4 w-4" />
      case "backup_completed":
        return <CheckCircle className="h-4 w-4" />
      case "user_login_failed":
        return <AlertTriangle className="h-4 w-4" />
      case "user_role_changed":
        return <RefreshCw className="h-4 w-4" />
      case "system_update":
        return <RefreshCw className="h-4 w-4" />
      default:
        return <FileEdit className="h-4 w-4" />
    }
  }

  // Function to get severity badge
  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "info":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-600">
            Info
          </Badge>
        )
      case "warning":
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-600">
            Warning
          </Badge>
        )
      case "error":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-600">
            Error
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex w-full max-w-sm items-center space-x-2">
          <Input
            placeholder="Search logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
          <Button variant="outline" size="icon">
            <Search className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex flex-row gap-2">
          <Select value={filterSeverity} onValueChange={setFilterSeverity}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Severity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Severities</SelectItem>
              <SelectItem value="info">Info</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
              <SelectItem value="error">Error</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterAction} onValueChange={setFilterAction}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Action" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Actions</SelectItem>
              <SelectItem value="user_login">Login</SelectItem>
              <SelectItem value="user_created">User Created</SelectItem>
              <SelectItem value="settings_changed">Settings Changed</SelectItem>
              <SelectItem value="record_updated">Record Updated</SelectItem>
              <SelectItem value="record_deleted">Record Deleted</SelectItem>
              <SelectItem value="system_error">System Error</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[180px]">Timestamp</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Action</TableHead>
              <TableHead className="hidden md:table-cell">Details</TableHead>
              <TableHead className="hidden md:table-cell">IP Address</TableHead>
              <TableHead>Severity</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedLogs.length > 0 ? (
              paginatedLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-mono text-xs">{log.timestamp}</TableCell>
                  <TableCell>{log.user}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "p-1 rounded-full",
                          log.severity === "info"
                            ? "bg-blue-50"
                            : log.severity === "warning"
                              ? "bg-amber-50"
                              : "bg-red-50",
                        )}
                      >
                        {getActionIcon(log.action)}
                      </span>
                      <span className="hidden sm:inline capitalize">{log.action.replace(/_/g, " ")}</span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell max-w-[200px] truncate">{log.details}</TableCell>
                  <TableCell className="hidden md:table-cell font-mono text-xs">{log.ip}</TableCell>
                  <TableCell>{getSeverityBadge(log.severity)}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {paginatedLogs.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to{" "}
          {Math.min(currentPage * itemsPerPage, filteredLogs.length)} of {filteredLogs.length} entries
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="text-sm">
            Page {currentPage} of {totalPages || 1}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
