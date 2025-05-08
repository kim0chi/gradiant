"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Copy, Eye } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock data for demonstration
const templateData = [
  {
    id: "temp-1",
    name: "System Maintenance",
    category: "system",
    lastUsed: "2023-05-10",
    createdBy: "Admin",
    subject: "Scheduled System Maintenance",
    body: "Dear {user},\n\nWe will be performing scheduled maintenance on {date} from {start_time} to {end_time}. During this time, the system may be unavailable.\n\nThank you for your understanding.\n\nGradiant Support Team",
  },
  {
    id: "temp-2",
    name: "New Grading Period",
    category: "academic",
    lastUsed: "2023-04-28",
    createdBy: "Admin",
    subject: "New Grading Period Started",
    body: "Dear {teacher},\n\nA new grading period ({period_name}) has started. Please ensure all grades for the previous period are finalized by {deadline}.\n\nThank you,\nGradiant Administration",
  },
  {
    id: "temp-3",
    name: "Welcome Message",
    category: "onboarding",
    lastUsed: "2023-05-01",
    createdBy: "System",
    subject: "Welcome to Gradiant",
    body: "Hello {user},\n\nWelcome to Gradiant! Your account has been successfully created.\n\nUsername: {username}\nRole: {role}\n\nGet started by exploring your dashboard.\n\nBest regards,\nThe Gradiant Team",
  },
  {
    id: "temp-4",
    name: "Password Reset",
    category: "account",
    lastUsed: "2023-05-12",
    createdBy: "System",
    subject: "Password Reset Request",
    body: "Hello {user},\n\nWe received a request to reset your password. Click the link below to reset your password:\n\n{reset_link}\n\nIf you didn't request this, please ignore this email.\n\nGradiant Support",
  },
]

export function NotificationTemplates() {
  const [templates, setTemplates] = useState(templateData)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [currentTemplate, setCurrentTemplate] = useState(null)
  const [newTemplate, setNewTemplate] = useState({
    name: "",
    category: "system",
    subject: "",
    body: "",
  })

  const handleCreateTemplate = () => {
    const template = {
      id: `temp-${templates.length + 1}`,
      ...newTemplate,
      lastUsed: "Never",
      createdBy: "Admin",
    }
    setTemplates([...templates, template])
    setNewTemplate({
      name: "",
      category: "system",
      subject: "",
      body: "",
    })
    setIsCreateDialogOpen(false)
  }

  const handleEditTemplate = (template) => {
    setCurrentTemplate(template)
    setIsEditDialogOpen(true)
  }

  const handleViewTemplate = (template) => {
    setCurrentTemplate(template)
    setIsViewDialogOpen(true)
  }

  const handleDuplicateTemplate = (template) => {
    const duplicatedTemplate = {
      ...template,
      id: `temp-${templates.length + 1}`,
      name: `${template.name} (Copy)`,
      lastUsed: "Never",
    }
    setTemplates([...templates, duplicatedTemplate])
  }

  const handleDeleteTemplate = (templateId) => {
    setTemplates(templates.filter((template) => template.id !== templateId))
  }

  const handleSaveEdit = () => {
    setTemplates(templates.map((template) => (template.id === currentTemplate.id ? currentTemplate : template)))
    setIsEditDialogOpen(false)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Notification Templates</CardTitle>
          <CardDescription>Create and manage reusable notification templates.</CardDescription>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-1">
              <Plus className="h-4 w-4" />
              New Template
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create Notification Template</DialogTitle>
              <DialogDescription>Create a new reusable template for notifications.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={newTemplate.name}
                  onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">
                  Category
                </Label>
                <Select
                  value={newTemplate.category}
                  onValueChange={(value) => setNewTemplate({ ...newTemplate, category: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="system">System</SelectItem>
                    <SelectItem value="academic">Academic</SelectItem>
                    <SelectItem value="onboarding">Onboarding</SelectItem>
                    <SelectItem value="account">Account</SelectItem>
                    <SelectItem value="event">Event</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="subject" className="text-right">
                  Subject
                </Label>
                <Input
                  id="subject"
                  value={newTemplate.subject}
                  onChange={(e) => setNewTemplate({ ...newTemplate, subject: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="body" className="text-right">
                  Body
                </Label>
                <Textarea
                  id="body"
                  value={newTemplate.body}
                  onChange={(e) => setNewTemplate({ ...newTemplate, body: e.target.value })}
                  className="col-span-3"
                  rows={8}
                  placeholder="Use {variable} for dynamic content"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateTemplate}>Create Template</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Template Dialog */}
        {currentTemplate && (
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Edit Template</DialogTitle>
                <DialogDescription>Make changes to the notification template.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="edit-name"
                    value={currentTemplate.name}
                    onChange={(e) => setCurrentTemplate({ ...currentTemplate, name: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-category" className="text-right">
                    Category
                  </Label>
                  <Select
                    value={currentTemplate.category}
                    onValueChange={(value) => setCurrentTemplate({ ...currentTemplate, category: value })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="system">System</SelectItem>
                      <SelectItem value="academic">Academic</SelectItem>
                      <SelectItem value="onboarding">Onboarding</SelectItem>
                      <SelectItem value="account">Account</SelectItem>
                      <SelectItem value="event">Event</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-subject" className="text-right">
                    Subject
                  </Label>
                  <Input
                    id="edit-subject"
                    value={currentTemplate.subject}
                    onChange={(e) => setCurrentTemplate({ ...currentTemplate, subject: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-body" className="text-right">
                    Body
                  </Label>
                  <Textarea
                    id="edit-body"
                    value={currentTemplate.body}
                    onChange={(e) => setCurrentTemplate({ ...currentTemplate, body: e.target.value })}
                    className="col-span-3"
                    rows={8}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveEdit}>Save Changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {/* View Template Dialog */}
        {currentTemplate && (
          <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>{currentTemplate.name}</DialogTitle>
                <DialogDescription>Template Preview</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Subject:</h4>
                  <p className="text-sm rounded-md bg-muted p-3">{currentTemplate.subject}</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Body:</h4>
                  <pre className="text-sm rounded-md bg-muted p-3 whitespace-pre-wrap font-sans">
                    {currentTemplate.body}
                  </pre>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Available Variables:</h4>
                  <div className="flex flex-wrap gap-2">
                    {currentTemplate.body.match(/\{([^}]+)\}/g)?.map((variable, index) => (
                      <Badge key={index} variant="outline">
                        {variable}
                      </Badge>
                    )) || <p className="text-sm text-muted-foreground">No variables found</p>}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                  Close
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Last Used</TableHead>
                <TableHead>Created By</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {templates.map((template) => (
                <TableRow key={template.id}>
                  <TableCell className="font-medium">{template.name}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        template.category === "system"
                          ? "default"
                          : template.category === "academic"
                            ? "secondary"
                            : template.category === "onboarding"
                              ? "outline"
                              : template.category === "account"
                                ? "destructive"
                                : "default"
                      }
                    >
                      {template.category}
                    </Badge>
                  </TableCell>
                  <TableCell>{template.lastUsed}</TableCell>
                  <TableCell>{template.createdBy}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleViewTemplate(template)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleEditTemplate(template)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDuplicateTemplate(template)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteTemplate(template.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
