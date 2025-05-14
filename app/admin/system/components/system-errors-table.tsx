"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, ChevronRight, Download, Search, AlertTriangle, XCircle, Info } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

// Sample system errors data
const systemErrors = [
  {
    id: "err-001",
    timestamp: "2023-05-06 10:42:15",
    type: "database",
    severity: "critical",
    message: "Database connection timeout",
    details:
      "Failed to connect to database after 30 seconds. Connection refused at host 192.168.1.100:5432. This is likely due to network issues or the database server being down for maintenance.",
    status: "resolved",
  },
  {
    id: "err-002",
    timestamp: "2023-05-06 09:30:22",
    type: "api",
    severity: "warning",
    message: "API rate limit exceeded",
    details:
      "The external API rate limit was exceeded when calling the grades synchronization endpoint. This may result in incomplete data synchronization. The system will retry automatically in 15 minutes.",
    status: "resolved",
  },
  {
    id: "err-003",
    timestamp: "2023-05-05 16:42:30",
    type: "authentication",
    severity: "critical",
    message: "Authentication service unavailable",
    details:
      "The authentication service is not responding. Users may be unable to log in. The system is using cached authentication data where possible. This appears to be related to the network outage reported by IT.",
    status: "resolved",
  },
  {
    id: "err-004",
    timestamp: "2023-05-05 14:22:18",
    type: "file_storage",
    severity: "warning",
    message: "Low disk space warning",
    details:
      "The file storage system is running low on disk space (85% used). This may impact file uploads and system backups. Please clean up unnecessary files or increase storage capacity.",
    status: "active",
  },
  {
    id: "err-005",
    timestamp: "2023-05-04 15:42:12",
    type: "email",
    severity: "error",
    message: "Failed to send notification emails",
    details:
      "The system failed to send 24 notification emails due to SMTP server configuration issues. The emails have been queued for retry. Please check the SMTP server settings and ensure the server is operational.",
    status: "active",
  },
  {
    id: "err-006",
    timestamp: "2023-05-04 09:15:22",
    type: "performance",
    severity: "warning",
    message: "High CPU usage detected",
    details:
      "The system detected unusually high CPU usage (92%) for more than 15 minutes. This may impact system performance and user experience. The issue appears to be related to the report generation process running during peak hours.",
    status: "resolved",
  },
  {
    id: "err-007",
    timestamp: "2023-05-03 11:30:45",
    type: "security",
    severity: "critical",
    message: "Multiple failed login attempts detected",
    details:
      "The system detected 25 failed login attempts for user 'admin' from IP address 203.0.113.42 within 5 minutes. The account has been temporarily locked for security reasons. This may indicate a brute force attack attempt.",
    status: "resolved",
  },
  {
    id: "err-008",
    timestamp: "2023-05-03 10:18:33",
    type: "database",
    severity: "error",
    message: "Database query timeout",
    details:
      "A complex report query timed out after 60 seconds. This affects the generation of the annual performance report. The query has been optimized and scheduled for retry during off-peak hours.",
    status: "resolved",
  },
]

export function SystemErrorsTable() {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [filterSeverity, setFilterSeverity] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [selectedError, setSelectedError] = useState<(typeof systemErrors)[0] | null>(null)

  const itemsPerPage = 6

  // Filter errors based on search term and filters
  const filteredErrors = systemErrors.filter((error) => {
    const matchesSearch =
      error.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      error.type.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesSeverity = filterSeverity === "all" || error.severity === filterSeverity
    const matchesStatus = filterStatus === "all" || error.status === filterStatus

    return matchesSearch && matchesSeverity && matchesStatus
  })

  // Paginate errors
  const totalPages = Math.ceil(filteredErrors.length / itemsPerPage)
  const paginatedErrors = filteredErrors.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  // Function to get severity badge
  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "critical":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-600">
            Critical
          </Badge>
        )
      case "error":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-600">
            Error
          </Badge>
        )
      case "warning":
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-600">
            Warning
          </Badge>
        )
      case "info":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-600">
            Info
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  // Function to get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-600">
            Active
          </Badge>
        )
      case "resolved":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-600">
            Resolved
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  // Function to get severity icon
  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return <XCircle className="h-5 w-5 text-red-600" />
      case "error":
        return <XCircle className="h-5 w-5 text-red-600" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-amber-600" />
      case "info":
        return <Info className="h-5 w-5 text-blue-600" />
      default:
        return <Info className="h-5 w-5" />
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex w-full max-w-sm items-center space-x-2">
          <Input
            placeholder="Search errors..."
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
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="error">Error</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
              <SelectItem value="info">Info</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
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
              <TableHead>Type</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedErrors.length > 0 ? (
              paginatedErrors.map((error) => (
                <TableRow key={error.id}>
                  <TableCell className="font-mono text-xs">{error.timestamp}</TableCell>
                  <TableCell className="capitalize">{error.type.replace(/_/g, " ")}</TableCell>
                  <TableCell className="max-w-[300px] truncate">{error.message}</TableCell>
                  <TableCell>{getSeverityBadge(error.severity)}</TableCell>
                  <TableCell>{getStatusBadge(error.status)}</TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setSelectedError(error)}>
                          Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2">
                            {selectedError && getSeverityIcon(selectedError.severity)}
                            <span>Error Details</span>
                          </DialogTitle>
                          <DialogDescription>
                            {selectedError?.id} • {selectedError?.timestamp}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h4 className="text-sm font-medium mb-1">Type</h4>
                              <p className="text-sm capitalize">{selectedError?.type.replace(/_/g, " ")}</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium mb-1">Severity</h4>
                              <p className="text-sm">{selectedError && getSeverityBadge(selectedError.severity)}</p>
                            </div>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium mb-1">Message</h4>
                            <p className="text-sm">{selectedError?.message}</p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium mb-1">Details</h4>
                            <p className="text-sm whitespace-pre-wrap">{selectedError?.details}</p>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h4 className="text-sm font-medium mb-1">Status</h4>
                              <p className="text-sm">{selectedError && getStatusBadge(selectedError.status)}</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium mb-1">Error ID</h4>
                              <p className="text-sm font-mono">{selectedError?.id}</p>
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
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
          Showing {paginatedErrors.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to{" "}
          {Math.min(currentPage * itemsPerPage, filteredErrors.length)} of {filteredErrors.length} entries
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
