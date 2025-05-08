"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, Eye, MoreHorizontal, MessageSquare } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock data for demonstration
const ticketData = [
  {
    id: "ticket-1",
    subject: "Cannot access gradebook",
    status: "open",
    priority: "high",
    category: "access",
    createdBy: "John Smith",
    userRole: "Teacher",
    createdAt: "2023-05-15T10:30:00",
    lastUpdated: "2023-05-15T14:45:00",
    assignedTo: "Admin",
    messages: [
      {
        id: "msg-1",
        sender: "John Smith",
        role: "Teacher",
        content:
          "I'm unable to access the gradebook. When I click on the gradebook link, I get an error message saying 'Access Denied'.",
        timestamp: "2023-05-15T10:30:00",
      },
      {
        id: "msg-2",
        sender: "Admin",
        role: "Support",
        content:
          "Thank you for reporting this issue. Could you please provide more details about when this started happening? Have you tried clearing your browser cache?",
        timestamp: "2023-05-15T11:15:00",
      },
      {
        id: "msg-3",
        sender: "John Smith",
        role: "Teacher",
        content:
          "It started happening this morning. I've tried clearing my cache and using a different browser, but I still get the same error.",
        timestamp: "2023-05-15T11:45:00",
      },
      {
        id: "msg-4",
        sender: "Admin",
        role: "Support",
        content:
          "I've checked your account permissions and found an issue. I've reset your access rights. Could you please try accessing the gradebook again and let me know if it works?",
        timestamp: "2023-05-15T14:45:00",
      },
    ],
  },
  {
    id: "ticket-2",
    subject: "Error when submitting grades",
    status: "in-progress",
    priority: "medium",
    category: "bug",
    createdBy: "Sarah Johnson",
    userRole: "Teacher",
    createdAt: "2023-05-14T15:20:00",
    lastUpdated: "2023-05-15T09:10:00",
    assignedTo: "Admin",
    messages: [
      {
        id: "msg-1",
        sender: "Sarah Johnson",
        role: "Teacher",
        content:
          "I'm getting an error when trying to submit grades for my Math class. The error says 'Invalid data format'.",
        timestamp: "2023-05-14T15:20:00",
      },
      {
        id: "msg-2",
        sender: "Admin",
        role: "Support",
        content:
          "I'll look into this right away. Could you tell me which specific class and assignment you're trying to grade?",
        timestamp: "2023-05-14T16:05:00",
      },
      {
        id: "msg-3",
        sender: "Sarah Johnson",
        role: "Teacher",
        content: "It's for Math 101, Period 3, the 'Quadratic Equations Quiz' from last week.",
        timestamp: "2023-05-14T16:30:00",
      },
    ],
  },
  {
    id: "ticket-3",
    subject: "Need help with attendance report",
    status: "closed",
    priority: "low",
    category: "question",
    createdBy: "Michael Brown",
    userRole: "Teacher",
    createdAt: "2023-05-12T09:45:00",
    lastUpdated: "2023-05-13T11:20:00",
    assignedTo: "Admin",
    messages: [
      {
        id: "msg-1",
        sender: "Michael Brown",
        role: "Teacher",
        content:
          "I need help generating an attendance report for the last month. I can't find the option in the reporting section.",
        timestamp: "2023-05-12T09:45:00",
      },
      {
        id: "msg-2",
        sender: "Admin",
        role: "Support",
        content:
          "The monthly attendance report can be generated from the Reports section. Go to Reports > Attendance > Monthly and select the month you need.",
        timestamp: "2023-05-12T10:30:00",
      },
      {
        id: "msg-3",
        sender: "Michael Brown",
        role: "Teacher",
        content: "Found it! Thank you for your help.",
        timestamp: "2023-05-12T11:15:00",
      },
      {
        id: "msg-4",
        sender: "Admin",
        role: "Support",
        content: "You're welcome! Let us know if you need anything else.",
        timestamp: "2023-05-12T11:45:00",
      },
    ],
  },
  {
    id: "ticket-4",
    subject: "Student profile not showing correct information",
    status: "open",
    priority: "medium",
    category: "data",
    createdBy: "Jennifer Lee",
    userRole: "Admin",
    createdAt: "2023-05-13T14:15:00",
    lastUpdated: "2023-05-14T10:05:00",
    assignedTo: "Admin",
    messages: [
      {
        id: "msg-1",
        sender: "Jennifer Lee",
        role: "Admin",
        content: "A student's profile (ID: ST12345) is showing incorrect contact information and class enrollments.",
        timestamp: "2023-05-13T14:15:00",
      },
      {
        id: "msg-2",
        sender: "Admin",
        role: "Support",
        content: "I'll check the database records for this student. When did you first notice this issue?",
        timestamp: "2023-05-13T15:00:00",
      },
    ],
  },
  {
    id: "ticket-5",
    subject: "Feature request: Export grades to CSV",
    status: "pending",
    priority: "low",
    category: "feature",
    createdBy: "Robert Wilson",
    userRole: "Teacher",
    createdAt: "2023-05-10T11:30:00",
    lastUpdated: "2023-05-11T09:45:00",
    assignedTo: "Admin",
    messages: [
      {
        id: "msg-1",
        sender: "Robert Wilson",
        role: "Teacher",
        content:
          "It would be very helpful to have an option to export grades to CSV format for further analysis in Excel.",
        timestamp: "2023-05-10T11:30:00",
      },
      {
        id: "msg-2",
        sender: "Admin",
        role: "Support",
        content:
          "Thank you for your suggestion. We'll add this to our feature request list and discuss it with the development team.",
        timestamp: "2023-05-11T09:45:00",
      },
    ],
  },
]

export function SupportTickets() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [isViewTicketOpen, setIsViewTicketOpen] = useState(false)
  const [currentTicket, setCurrentTicket] = useState(null)
  const [replyText, setReplyText] = useState("")

  const filteredTickets = ticketData.filter((ticket) => {
    const matchesSearch =
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.createdBy.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter
    const matchesPriority = priorityFilter === "all" || ticket.priority === priorityFilter
    return matchesSearch && matchesStatus && matchesPriority
  })

  const handleViewTicket = (ticket) => {
    setCurrentTicket(ticket)
    setIsViewTicketOpen(true)
  }

  const handleSendReply = () => {
    if (!replyText.trim()) return

    const updatedTicket = {
      ...currentTicket,
      messages: [
        ...currentTicket.messages,
        {
          id: `msg-${currentTicket.messages.length + 1}`,
          sender: "Admin",
          role: "Support",
          content: replyText,
          timestamp: new Date().toISOString(),
        },
      ],
      lastUpdated: new Date().toISOString(),
    }

    // In a real app, you would update the ticket in your database
    setCurrentTicket(updatedTicket)
    setReplyText("")
  }

  const handleUpdateStatus = (status) => {
    const updatedTicket = {
      ...currentTicket,
      status,
      lastUpdated: new Date().toISOString(),
    }

    // In a real app, you would update the ticket in your database
    setCurrentTicket(updatedTicket)
  }

  const handleUpdatePriority = (priority) => {
    const updatedTicket = {
      ...currentTicket,
      priority,
      lastUpdated: new Date().toISOString(),
    }

    // In a real app, you would update the ticket in your database
    setCurrentTicket(updatedTicket)
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Support Tickets</CardTitle>
          <CardDescription>Manage and respond to support requests from users.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tickets..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[130px]">
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      <SelectValue placeholder="Status" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger className="w-[130px]">
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      <SelectValue placeholder="Priority" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priorities</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Tabs defaultValue="active" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="active">Active Tickets</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="closed">Closed</TabsTrigger>
              </TabsList>
              <TabsContent value="active" className="pt-4">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Created By</TableHead>
                        <TableHead>Last Updated</TableHead>
                        <TableHead className="w-[80px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTickets
                        .filter((ticket) => ticket.status === "open" || ticket.status === "in-progress")
                        .map((ticket) => (
                          <TableRow key={ticket.id}>
                            <TableCell className="font-mono text-xs">{ticket.id}</TableCell>
                            <TableCell className="font-medium">{ticket.subject}</TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  ticket.status === "open"
                                    ? "default"
                                    : ticket.status === "in-progress"
                                      ? "secondary"
                                      : ticket.status === "pending"
                                        ? "outline"
                                        : "destructive"
                                }
                              >
                                {ticket.status === "in-progress" ? "in progress" : ticket.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  ticket.priority === "high"
                                    ? "destructive"
                                    : ticket.priority === "medium"
                                      ? "default"
                                      : "outline"
                                }
                              >
                                {ticket.priority}
                              </Badge>
                            </TableCell>
                            <TableCell>{ticket.createdBy}</TableCell>
                            <TableCell>{new Date(ticket.lastUpdated).toLocaleString()}</TableCell>
                            <TableCell>
                              <div className="flex items-center justify-end gap-2">
                                <Button variant="ghost" size="icon" onClick={() => handleViewTicket(ticket)}>
                                  <MessageSquare className="h-4 w-4" />
                                </Button>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => handleViewTicket(ticket)}>
                                      View Details
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>Assign to Me</DropdownMenuItem>
                                    <DropdownMenuItem>Mark as Closed</DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
              <TabsContent value="pending" className="pt-4">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Created By</TableHead>
                        <TableHead>Last Updated</TableHead>
                        <TableHead className="w-[80px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTickets
                        .filter((ticket) => ticket.status === "pending")
                        .map((ticket) => (
                          <TableRow key={ticket.id}>
                            <TableCell className="font-mono text-xs">{ticket.id}</TableCell>
                            <TableCell className="font-medium">{ticket.subject}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{ticket.status}</Badge>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  ticket.priority === "high"
                                    ? "destructive"
                                    : ticket.priority === "medium"
                                      ? "default"
                                      : "outline"
                                }
                              >
                                {ticket.priority}
                              </Badge>
                            </TableCell>
                            <TableCell>{ticket.createdBy}</TableCell>
                            <TableCell>{new Date(ticket.lastUpdated).toLocaleString()}</TableCell>
                            <TableCell>
                              <div className="flex items-center justify-end gap-2">
                                <Button variant="ghost" size="icon" onClick={() => handleViewTicket(ticket)}>
                                  <MessageSquare className="h-4 w-4" />
                                </Button>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => handleViewTicket(ticket)}>
                                      View Details
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>Assign to Me</DropdownMenuItem>
                                    <DropdownMenuItem>Mark as Closed</DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
              <TabsContent value="closed" className="pt-4">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Created By</TableHead>
                        <TableHead>Last Updated</TableHead>
                        <TableHead className="w-[80px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTickets
                        .filter((ticket) => ticket.status === "closed")
                        .map((ticket) => (
                          <TableRow key={ticket.id}>
                            <TableCell className="font-mono text-xs">{ticket.id}</TableCell>
                            <TableCell className="font-medium">{ticket.subject}</TableCell>
                            <TableCell>
                              <Badge variant="secondary">{ticket.status}</Badge>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  ticket.priority === "high"
                                    ? "destructive"
                                    : ticket.priority === "medium"
                                      ? "default"
                                      : "outline"
                                }
                              >
                                {ticket.priority}
                              </Badge>
                            </TableCell>
                            <TableCell>{ticket.createdBy}</TableCell>
                            <TableCell>{new Date(ticket.lastUpdated).toLocaleString()}</TableCell>
                            <TableCell>
                              <div className="flex items-center justify-end gap-2">
                                <Button variant="ghost" size="icon" onClick={() => handleViewTicket(ticket)}>
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => handleViewTicket(ticket)}>
                                      View Details
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>Reopen Ticket</DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>

            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" isActive>
                    1
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">2</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">3</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext href="#" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>

      {/* View Ticket Dialog */}
      {currentTicket && (
        <Dialog open={isViewTicketOpen} onOpenChange={setIsViewTicketOpen}>
          <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Ticket: {currentTicket.subject}</DialogTitle>
              <DialogDescription>
                ID: {currentTicket.id} | Created: {new Date(currentTicket.createdAt).toLocaleString()}
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-2 gap-4 py-4">
              <div>
                <p className="text-sm font-medium">Status</p>
                <Select value={currentTicket.status} onValueChange={handleUpdateStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <p className="text-sm font-medium">Priority</p>
                <Select value={currentTicket.priority} onValueChange={handleUpdatePriority}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <p className="text-sm font-medium">Created By</p>
                <p className="text-sm">
                  {currentTicket.createdBy} ({currentTicket.userRole})
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Assigned To</p>
                <p className="text-sm">{currentTicket.assignedTo}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Category</p>
                <p className="text-sm capitalize">{currentTicket.category}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Last Updated</p>
                <p className="text-sm">{new Date(currentTicket.lastUpdated).toLocaleString()}</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Conversation</h3>
              <div className="space-y-4 max-h-[300px] overflow-y-auto p-2">
                {currentTicket.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${message.role === "Support" ? "justify-start" : "justify-end"}`}
                  >
                    {message.role === "Support" && (
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>AD</AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={`rounded-lg p-3 max-w-[80%] ${
                        message.role === "Support" ? "bg-muted" : "bg-primary text-primary-foreground"
                      }`}
                    >
                      <div className="flex justify-between items-start gap-2 mb-1">
                        <p className="text-xs font-medium">{message.sender}</p>
                        <p className="text-xs opacity-70">{new Date(message.timestamp).toLocaleTimeString()}</p>
                      </div>
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    </div>
                    {message.role !== "Support" && (
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {message.sender
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <Textarea
                  placeholder="Type your reply here..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  rows={3}
                />
                <div className="flex justify-end">
                  <Button onClick={handleSendReply}>Send Reply</Button>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsViewTicketOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
