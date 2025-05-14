"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Edit, Eye, MoreHorizontal, Plus } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

// Mock data for demonstration
const articleData = [
  {
    id: "kb-1",
    title: "How to Reset Your Password",
    category: "account",
    status: "published",
    author: "Admin",
    lastUpdated: "2023-05-10T10:30:00",
    views: 1245,
  },
  {
    id: "kb-2",
    title: "Setting Up Grading Categories",
    category: "gradebook",
    status: "published",
    author: "Admin",
    lastUpdated: "2023-05-08T14:15:00",
    views: 876,
  },
  {
    id: "kb-3",
    title: "Importing Student Data",
    category: "data",
    status: "published",
    author: "Admin",
    lastUpdated: "2023-05-05T09:45:00",
    views: 654,
  },
  {
    id: "kb-4",
    title: "Configuring Attendance Tracking",
    category: "attendance",
    status: "draft",
    author: "Admin",
    lastUpdated: "2023-05-03T16:20:00",
    views: 0,
  },
  {
    id: "kb-5",
    title: "Generating Report Cards",
    category: "reports",
    status: "published",
    author: "Admin",
    lastUpdated: "2023-04-28T11:10:00",
    views: 932,
  },
  {
    id: "kb-6",
    title: "Managing User Permissions",
    category: "admin",
    status: "published",
    author: "Admin",
    lastUpdated: "2023-04-25T13:40:00",
    views: 543,
  },
]

const categories = [
  { id: "account", name: "Account Management" },
  { id: "gradebook", name: "Gradebook" },
  { id: "attendance", name: "Attendance" },
  { id: "reports", name: "Reports & Analytics" },
  { id: "data", name: "Data Management" },
  { id: "admin", name: "Administration" },
]

export function KnowledgeBase({ searchQuery = "" }) {
  const [articles, setArticles] = useState(articleData)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [currentArticle, setCurrentArticle] = useState(null)
  const [newArticle, setNewArticle] = useState({
    title: "",
    category: "",
    content: "",
    status: "draft",
  })

  const filteredArticles = articles.filter(
    (article) =>
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      categories
        .find((c) => c.id === article.category)
        ?.name.toLowerCase()
        .includes(searchQuery.toLowerCase()),
  )

  const handleCreateArticle = () => {
    const article = {
      id: `kb-${articles.length + 1}`,
      ...newArticle,
      author: "Admin",
      lastUpdated: new Date().toISOString(),
      views: 0,
    }
    setArticles([...articles, article])
    setNewArticle({
      title: "",
      category: "",
      content: "",
      status: "draft",
    })
    setIsCreateDialogOpen(false)
  }

  const handleEditArticle = (article) => {
    setCurrentArticle(article)
    setIsEditDialogOpen(true)
  }

  const handleSaveEdit = () => {
    setArticles(
      articles.map((article) =>
        article.id === currentArticle.id
          ? {
              ...currentArticle,
              lastUpdated: new Date().toISOString(),
            }
          : article,
      ),
    )
    setIsEditDialogOpen(false)
  }

  const handleDeleteArticle = (articleId) => {
    setArticles(articles.filter((article) => article.id !== articleId))
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Knowledge Base Articles</CardTitle>
          <CardDescription>Create and manage help articles for users.</CardDescription>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-1">
              <Plus className="h-4 w-4" />
              New Article
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle>Create Knowledge Base Article</DialogTitle>
              <DialogDescription>Create a new help article for the knowledge base.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Title
                </Label>
                <Input
                  id="title"
                  value={newArticle.title}
                  onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })}
                  className="col-span-3"
                  placeholder="Enter article title"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">
                  Category
                </Label>
                <Select
                  value={newArticle.category}
                  onValueChange={(value) => setNewArticle({ ...newArticle, category: value })}
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
                <Label htmlFor="status" className="text-right">
                  Status
                </Label>
                <Select
                  value={newArticle.status}
                  onValueChange={(value) => setNewArticle({ ...newArticle, status: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="content" className="text-right pt-2">
                  Content
                </Label>
                <Textarea
                  id="content"
                  value={newArticle.content}
                  onChange={(e) => setNewArticle({ ...newArticle, content: e.target.value })}
                  className="col-span-3"
                  rows={10}
                  placeholder="Write article content here..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateArticle}>Create Article</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Article Dialog */}
        {currentArticle && (
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="sm:max-w-[700px]">
              <DialogHeader>
                <DialogTitle>Edit Knowledge Base Article</DialogTitle>
                <DialogDescription>Make changes to the knowledge base article.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-title" className="text-right">
                    Title
                  </Label>
                  <Input
                    id="edit-title"
                    value={currentArticle.title}
                    onChange={(e) => setCurrentArticle({ ...currentArticle, title: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-category" className="text-right">
                    Category
                  </Label>
                  <Select
                    value={currentArticle.category}
                    onValueChange={(value) => setCurrentArticle({ ...currentArticle, category: value })}
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
                  <Label htmlFor="edit-status" className="text-right">
                    Status
                  </Label>
                  <Select
                    value={currentArticle.status}
                    onValueChange={(value) => setCurrentArticle({ ...currentArticle, status: value })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="edit-content" className="text-right pt-2">
                    Content
                  </Label>
                  <Textarea
                    id="edit-content"
                    value={currentArticle.content || ""}
                    onChange={(e) => setCurrentArticle({ ...currentArticle, content: e.target.value })}
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
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead>Views</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredArticles.map((article) => (
                <TableRow key={article.id}>
                  <TableCell className="font-medium">{article.title}</TableCell>
                  <TableCell>{categories.find((c) => c.id === article.category)?.name}</TableCell>
                  <TableCell>
                    <Badge variant={article.status === "published" ? "default" : "secondary"}>{article.status}</Badge>
                  </TableCell>
                  <TableCell>{new Date(article.lastUpdated).toLocaleDateString()}</TableCell>
                  <TableCell>{article.views}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleEditArticle(article)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Statistics</DropdownMenuItem>
                          <DropdownMenuItem>Duplicate</DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteArticle(article.id)}
                            className="text-destructive"
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="mt-4">
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
  )
}
