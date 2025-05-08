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
  LogOut,
  AlertTriangle,
  CheckCircle,
  ShieldAlert,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"

// Sample login activity data
const loginActivities = [
  {
    id: "login-001",
    timestamp: "2023-05-06 10:42:15",
    user: "Admin User",
    action: "login_success",
    ip: "192.168.1.1",
    device: "Chrome / Windows 10",
    location: "New York, USA",
  },
  {
    id: "login-002",
    timestamp: "2023-05-06 09:30:22",
    user: "John Smith",
    action: "login_success",
    ip: "192.168.1.42",
    device: "Safari / macOS",
    location: "San Francisco, USA",
  },
  {
    id: "login-003",
    timestamp: "2023-05-06 08:15:10",
    user: "Unknown",
    action: "login_failed",
    ip: "203.0.113.42",
    device: "Firefox / Linux",
    location: "Toronto, Canada",
  },
  {
    id: "login-004",
    timestamp: "2023-05-05 16:42:30",
    user: "Sarah Johnson",
    action: "login_success",
    ip: "192.168.1.105",
    device: "Edge / Windows 11",
    location: "Chicago, USA",
  },
  {
    id: "login-005",
    timestamp: "2023-05-05 15:22:18",
    user: "Michael Chen",
    action: "logout",
    ip: "192.168.1.87",
    device: "Chrome / Android",
    location: "Boston, USA",
  },
  {
    id: "login-006",
    timestamp: "2023-05-05 14:05:45",
    user: "Unknown",
    action: "login_failed",
    ip: "198.51.100.73",
    device: "Chrome / Windows 10",
    location: "London, UK",
  },
  {
    id: "login-007",
    timestamp: "2023-05-05 12:18:33",
    user: "Emma Thompson",
    action: "login_success",
    ip: "192.168.1.56",
    device: "Safari / iOS",
    location: "Miami, USA",
  },
  {
    id: "login-008",
    timestamp: "2023-05-04 15:42:12",
    user: "David Wilson",
    action: "login_failed",
    ip: "192.168.1.201",
    device: "Chrome / Windows 10",
    location: "Seattle, USA",
  },
  {
    id: "login-009",
    timestamp: "2023-05-04 14:30:55",
    user: "Admin User",
    action: "login_success",
    ip: "192.168.1.1",
    device: "Firefox / Windows 10",
    location: "New York, USA",
  },
  {
    id: "login-010",
    timestamp: "2023-05-04 09:15:22",
    user: "Unknown",
    action: "login_failed",
    ip: "203.0.113.105",
    device: "Chrome / macOS",
    location: "Berlin, Germany",
  },
]

export function LoginActivityTable() {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [filterAction, setFilterAction] = useState("all")

  const itemsPerPage = 8

  // Filter logs based on search term and filters
  const filteredLogs = loginActivities.filter((log) => {
    const matchesSearch =
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.ip.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.device.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.location.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesAction = filterAction === "all" || log.action === filterAction

    return matchesSearch && matchesAction
  })

  // Paginate logs
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage)
  const paginatedLogs = filteredLogs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  // Function to get action icon and badge
  const getActionBadge = (action: string) => {
    switch (action) {
      case "login_success":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-600 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            <span>Success</span>
          </Badge>
        )
      case "login_failed":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-600 flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            <span>Failed</span>
          </Badge>
        )
      case "logout":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-600 flex items-center gap-1">
            <LogOut className="h-3 w-3" />
            <span>Logout</span>
          </Badge>
        )
      case "suspicious":
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-600 flex items-center gap-1">
            <ShieldAlert className="h-3 w-3" />
            <span>Suspicious</span>
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
            placeholder="Search login activity..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
          <Button variant="outline" size="icon">
            <Search className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex flex-row gap-2">
          <Select value={filterAction} onValueChange={setFilterAction}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Action" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Actions</SelectItem>
              <SelectItem value="login_success">Success</SelectItem>
              <SelectItem value="login_failed">Failed</SelectItem>
              <SelectItem value="logout">Logout</SelectItem>
              <SelectItem value="suspicious">Suspicious</SelectItem>
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
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">IP Address</TableHead>
              <TableHead className="hidden md:table-cell">Device / Browser</TableHead>
              <TableHead className="hidden lg:table-cell">Location</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedLogs.length > 0 ? (
              paginatedLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-mono text-xs">{log.timestamp}</TableCell>
                  <TableCell>{log.user}</TableCell>
                  <TableCell>{getActionBadge(log.action)}</TableCell>
                  <TableCell className="hidden md:table-cell font-mono text-xs">{log.ip}</TableCell>
                  <TableCell className="hidden md:table-cell">{log.device}</TableCell>
                  <TableCell className="hidden lg:table-cell">{log.location}</TableCell>
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
