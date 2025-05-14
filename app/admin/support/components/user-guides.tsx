"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Book, FileText, Video, Plus, Edit, Trash2, Eye, Search } from "lucide-react"

// Mock data for demonstration
const guidesData = [
  {
    id: "guide-1",
    title: "Getting Started with Gradiant",
    category: "general",
    type: "document",
    audience: ["all"],
    lastUpdated: "2023-05-10",
    author: "Admin",
  },
  {
    id: "guide-2",
    title: "Setting Up Your Gradebook",
    category: "gradebook",
    type: "document",
    audience: ["teachers"],
    lastUpdated: "2023-05-08",
    author: "Admin",
  },
  {
    id: "guide-3",
    title: "Managing Student Attendance",
    category: "attendance",
    type: "video",
    audience: ["teachers", "admins"],
    lastUpdated: "2023-05-05",
    author: "Admin",
  },
  {
    id: "guide-4",
    title: "Generating Reports",
    category: "reports",
    type: "document",
    audience: ["teachers", "admins"],
    lastUpdated: "2023-05-03",
    author: "Admin",
  },
  {
    id: "guide-5",
    title: "Student Portal Tutorial",
    category: "general",
    type: "video",
    audience: ["students"],
    lastUpdated: "2023-04-28",
    author: "Admin",
  },
  {
    id: "guide-6",
    title: "Parent Access Guide",
    category: "general",
    type: "document",
    audience: ["parents"],
    lastUpdated: "2023-04-25",
    author: "Admin",
  },
]

const categories = [
  { id: "general", name: "General" },
  { id: "gradebook", name: "Gradebook" },
  { id: "attendance", name: "Attendance" },
  { id: "reports", name: "Reports & Analytics" },
  { id: "admin", name: "Administration" },
]

const audiences = [
  { id: "all", name: "All Users" },
  { id: "teachers", name: "Teachers" },
  { id: "students", name: "Students" },
  { id: "parents", name: "Parents" },
  { id: "admins", name: "Administrators" },
]

export function UserGuides({ searchQuery = "" }) {
  const [guides, setGuides] = useState(guidesData)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [currentGuide, setCurrentGuide] = useState(null)
  const [newGuide, setNewGuide] = useState({
    title: "",
    category: "",
    type: "document",
    audience: [],
    content: "",
  })

  const filteredGuides = guides.filter(
    (guide) =>
      guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      categories
        .find((c) => c.id === guide.category)
        ?.name.toLowerCase()
        .includes(searchQuery.toLowerCase()),
  )

  const handleCreateGuide = () => {
    const guide = {
      id: `guide-${guides.length + 1}`,
      ...newGuide,
      author: "Admin",
      lastUpdated: new Date().toLocaleDateString(),
    }
    setGuides([...guides, guide])
    setNewGuide({
      title: "",
      category: "",
      type: "document",
      audience: [],
      content: "",
    })
    setIsCreateDialogOpen(false)
  }

  const handleEditGuide = (guide) => {
    setCurrentGuide(guide)
    setIsEditDialogOpen(true)
  }

  const handleSaveEdit = () => {
    setGuides(
      guides.map((guide) =>
        guide.id === currentGuide.id
          ? {
              ...currentGuide,
              lastUpdated: new Date().toLocaleDateString(),
            }
          : guide,
      ),
    )
    setIsEditDialogOpen(false)
  }

  const handleDeleteGuide = (guideId) => {
    setGuides(guides.filter((guide) => guide.id !== guideId))
  }

  const getGuideIcon = (type) => {
    switch (type) {
      case "document":
        return <FileText className="h-10 w-10 text-blue-500" />
      case "video":
        return <Video className="h-10 w-10 text-red-500" />
      default:
        return <Book className="h-10 w-10 text-green-500" />
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>User Guides & Documentation</CardTitle>
            <CardDescription>Create and manage guides and documentation for users.</CardDescription>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-1">
                <Plus className="h-4 w-4" />
                New Guide
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px]">
              <DialogHeader>
                <DialogTitle>Create User Guide</DialogTitle>
                <DialogDescription>Create a new guide or documentation for users.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-right">
                    Title
                  </Label>
                  <Input
                    id="title"
                    value={newGuide.title}
                    onChange={(e) => setNewGuide({ ...newGuide, title: e.target.value })}
                    className="col-span-3"
                    placeholder="Enter guide title"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="category" className="text-right">
                    Category
                  </Label>
                  <Select
                    value={newGuide.category}
                    onValueChange={(value) => setNewGuide({ ...newGuide, category: value })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="type" className="text-right">
                    Type
                  </Label>
                  <Select value={newGuide.type} onValueChange={(value) => setNewGuide({ ...newGuide, type: value })}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="document">Document</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="audience" className="text-right">
                    Audience
                  </Label>
                  <Select
                    value={newGuide.audience}
                    onValueChange={(value) => setNewGuide({ ...newGuide, audience: [value] })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select audience" />
                    </SelectTrigger>
                    <SelectContent>
                      {audiences.map((audience) => (
                        <SelectItem key={audience.id} value={audience.id}>
                          {audience.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="content" className="text-right pt-2">
                    Content
                  </Label>
                  <Textarea
                    id="content"
                    value={newGuide.content}
                    onChange={(e) => setNewGuide({ ...newGuide, content: e.target.value })}
                    className="col-span-3"
                    rows={10}
                    placeholder="Write guide content here or provide a URL for video guides..."
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateGuide}>Create Guide</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Edit Guide Dialog */}
          {currentGuide && (
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogContent className="sm:max-w-[700px]">
                <DialogHeader>
                  <DialogTitle>Edit User Guide</DialogTitle>
                  <DialogDescription>Make changes to the user guide.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-title" className="text-right">
                      Title
                    </Label>
                    <Input
                      id="edit-title"
                      value={currentGuide.title}
                      onChange={(e) => setCurrentGuide({ ...currentGuide, title: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-category" className="text-right">
                      Category
                    </Label>
                    <Select
                      value={currentGuide.category}
                      onValueChange={(value) => setCurrentGuide({ ...currentGuide, category: value })}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-type" className="text-right">
                      Type
                    </Label>
                    <Select
                      value={currentGuide.type}
                      onValueChange={(value) => setCurrentGuide({ ...currentGuide, type: value })}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="document">Document</SelectItem>
                        <SelectItem value="video">Video</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-audience" className="text-right">
                      Audience
                    </Label>
                    <Select
                      value={currentGuide.audience[0]}
                      onValueChange={(value) => setCurrentGuide({ ...currentGuide, audience: [value] })}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select audience" />
                      </SelectTrigger>
                      <SelectContent>
                        {audiences.map((audience) => (
                          <SelectItem key={audience.id} value={audience.id}>
                            {audience.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-start gap-4">
                    <Label htmlFor="edit-content" className="text-right pt-2">
                      Content
                    </Label>
                    <Textarea
                      id="edit-content"
                      value={currentGuide.content || ""}
                      onChange={(e) => setCurrentGuide({ ...currentGuide, content: e.target.value })}
                      className="col-span-3"
                      rows={10}
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
        </CardHeader>
        <CardContent>
          <div className="relative mb-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search guides..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Tabs defaultValue="all" className="space-y-4">
            <TabsList>
              <TabsTrigger value="all">All Guides</TabsTrigger>
              <TabsTrigger value="teachers">For Teachers</TabsTrigger>
              <TabsTrigger value="students">For Students</TabsTrigger>
              <TabsTrigger value="parents">For Parents</TabsTrigger>
              <TabsTrigger value="admins">For Admins</TabsTrigger>
            </TabsList>

            {["all", "teachers", "students", "parents", "admins"].map((audience) => (
              <TabsContent key={audience} value={audience} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredGuides
                    .filter((guide) => audience === "all" || guide.audience.includes(audience))
                    .map((guide) => (
                      <Card key={guide.id} className="overflow-hidden">
                        <CardHeader className="p-4 pb-0">
                          <div className="flex justify-between items-start">
                            <Badge variant="outline" className="mb-2">
                              {categories.find((c) => c.id === guide.category)?.name}
                            </Badge>
                            <Badge variant={guide.type === "document" ? "default" : "secondary"}>{guide.type}</Badge>
                          </div>
                          <CardTitle className="text-lg">{guide.title}</CardTitle>
                          <CardDescription>
                            For: {guide.audience.map((a) => audiences.find((aud) => aud.id === a)?.name).join(", ")}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="p-4 pt-2">
                          <div className="flex justify-between items-center mt-4">
                            <p className="text-sm text-muted-foreground">Updated: {guide.lastUpdated}</p>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="icon">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleEditGuide(guide)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleDeleteGuide(guide.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
