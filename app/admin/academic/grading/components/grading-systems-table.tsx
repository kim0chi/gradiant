"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, MoreHorizontal, Search, FileOutputIcon as FileExport, Filter, Edit, Trash, Copy } from "lucide-react"

type GradingSystem = {
  id: string
  name: string
  description: string
  type: "Numeric" | "Letter" | "Percentage" | "Custom"
  status: "Active" | "Inactive" | "Draft"
  department: string
  gradeLevel: string
  isDefault: boolean
}

const MOCK_GRADING_SYSTEMS: GradingSystem[] = [
  {
    id: "1",
    name: "Standard Letter Grading",
    description: "Traditional A-F letter grading system",
    type: "Letter",
    status: "Active",
    department: "All",
    gradeLevel: "All",
    isDefault: true,
  },
  {
    id: "2",
    name: "Elementary Progress",
    description: "Progress-based assessment for elementary grades",
    type: "Custom",
    status: "Active",
    department: "Elementary",
    gradeLevel: "K-5",
    isDefault: false,
  },
  {
    id: "3",
    name: "IB Assessment",
    description: "International Baccalaureate 1-7 scale",
    type: "Numeric",
    status: "Active",
    department: "High School",
    gradeLevel: "11-12",
    isDefault: false,
  },
  {
    id: "4",
    name: "Standards-Based Grading",
    description: "Competency-based assessment system",
    type: "Custom",
    status: "Draft",
    department: "Middle School",
    gradeLevel: "6-8",
    isDefault: false,
  },
  {
    id: "5",
    name: "AP Courses",
    description: "Advanced Placement weighted grading",
    type: "Percentage",
    status: "Active",
    department: "High School",
    gradeLevel: "9-12",
    isDefault: false,
  },
]

export function GradingSystemsTable() {
  const [gradingSystems, setGradingSystems] = useState<GradingSystem[]>(MOCK_GRADING_SYSTEMS)
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedSystem, setSelectedSystem] = useState<GradingSystem | null>(null)
  const [newSystem, setNewSystem] = useState<Partial<GradingSystem>>({
    name: "",
    description: "",
    type: "Letter",
    status: "Draft",
    department: "All",
    gradeLevel: "All",
    isDefault: false,
  })

  const filteredSystems = gradingSystems.filter(
    (system) =>
      system.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      system.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      system.department.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleAddSystem = () => {
    const newId = (Math.max(...gradingSystems.map((s) => Number.parseInt(s.id))) + 1).toString()
    setGradingSystems([...gradingSystems, { ...(newSystem as GradingSystem), id: newId }])
    setIsAddDialogOpen(false)
    setNewSystem({
      name: "",
      description: "",
      type: "Letter",
      status: "Draft",
      department: "All",
      gradeLevel: "All",
      isDefault: false,
    })
  }

  const handleEditSystem = () => {
    if (selectedSystem) {
      setGradingSystems(gradingSystems.map((system) => (system.id === selectedSystem.id ? selectedSystem : system)))
      setIsEditDialogOpen(false)
      setSelectedSystem(null)
    }
  }

  const handleDeleteSystem = () => {
    if (selectedSystem) {
      setGradingSystems(gradingSystems.filter((system) => system.id !== selectedSystem.id))
      setIsDeleteDialogOpen(false)
      setSelectedSystem(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-500/10 text-green-600 hover:bg-green-500/20"
      case "Inactive":
        return "bg-gray-500/10 text-gray-600 hover:bg-gray-500/20"
      case "Draft":
        return "bg-amber-500/10 text-amber-600 hover:bg-amber-500/20"
      default:
        return "bg-gray-500/10 text-gray-600 hover:bg-gray-500/20"
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search grading systems"
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuLabel>Filter By</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Checkbox id="status-active" className="mr-2" />
                <Label htmlFor="status-active">Active</Label>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Checkbox id="status-inactive" className="mr-2" />
                <Label htmlFor="status-inactive">Inactive</Label>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Checkbox id="status-draft" className="mr-2" />
                <Label htmlFor="status-draft">Draft</Label>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Button variant="ghost" size="sm" className="w-full justify-start">
                  Apply Filters
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" size="sm">
            <FileExport className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add System
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Add New Grading System</DialogTitle>
                <DialogDescription>Create a new grading system for your institution</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    className="col-span-3"
                    value={newSystem.name}
                    onChange={(e) => setNewSystem({ ...newSystem, name: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Description
                  </Label>
                  <Input
                    id="description"
                    className="col-span-3"
                    value={newSystem.description}
                    onChange={(e) => setNewSystem({ ...newSystem, description: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="type" className="text-right">
                    Type
                  </Label>
                  <Select
                    value={newSystem.type}
                    onValueChange={(value) =>
                      setNewSystem({ ...newSystem, type: value as "Numeric" | "Letter" | "Percentage" | "Custom" })
                    }
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Letter">Letter</SelectItem>
                      <SelectItem value="Numeric">Numeric</SelectItem>
                      <SelectItem value="Percentage">Percentage</SelectItem>
                      <SelectItem value="Custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="department" className="text-right">
                    Department
                  </Label>
                  <Select
                    value={newSystem.department}
                    onValueChange={(value) => setNewSystem({ ...newSystem, department: value })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Departments</SelectItem>
                      <SelectItem value="Elementary">Elementary</SelectItem>
                      <SelectItem value="Middle School">Middle School</SelectItem>
                      <SelectItem value="High School">High School</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="gradeLevel" className="text-right">
                    Grade Level
                  </Label>
                  <Select
                    value={newSystem.gradeLevel}
                    onValueChange={(value) => setNewSystem({ ...newSystem, gradeLevel: value })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select grade level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Grades</SelectItem>
                      <SelectItem value="K-5">K-5</SelectItem>
                      <SelectItem value="6-8">6-8</SelectItem>
                      <SelectItem value="9-12">9-12</SelectItem>
                      <SelectItem value="11-12">11-12</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="status" className="text-right">
                    Status
                  </Label>
                  <Select
                    value={newSystem.status}
                    onValueChange={(value) =>
                      setNewSystem({ ...newSystem, status: value as "Active" | "Inactive" | "Draft" })
                    }
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                      <SelectItem value="Draft">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="isDefault" className="text-right">
                    Set as Default
                  </Label>
                  <div className="col-span-3 flex items-center space-x-2">
                    <Checkbox
                      id="isDefault"
                      checked={newSystem.isDefault}
                      onCheckedChange={(checked) => setNewSystem({ ...newSystem, isDefault: checked as boolean })}
                    />
                    <label
                      htmlFor="isDefault"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Make this the default grading system
                    </label>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddSystem}>Add Grading System</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Grade Level</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Default</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSystems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No grading systems found.
                </TableCell>
              </TableRow>
            ) : (
              filteredSystems.map((system) => (
                <TableRow key={system.id}>
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      <span>{system.name}</span>
                      <span className="text-xs text-muted-foreground">{system.description}</span>
                    </div>
                  </TableCell>
                  <TableCell>{system.type}</TableCell>
                  <TableCell>{system.department}</TableCell>
                  <TableCell>{system.gradeLevel}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(system.status)} variant="outline">
                      {system.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{system.isDefault ? "Yes" : "No"}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedSystem(system)
                            setIsEditDialogOpen(true)
                          }}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Copy className="h-4 w-4 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => {
                            setSelectedSystem(system)
                            setIsDeleteDialogOpen(true)
                          }}
                        >
                          <Trash className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Edit Grading System</DialogTitle>
            <DialogDescription>Update the details of this grading system</DialogDescription>
          </DialogHeader>
          {selectedSystem && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">
                  Name
                </Label>
                <Input
                  id="edit-name"
                  className="col-span-3"
                  value={selectedSystem.name}
                  onChange={(e) => setSelectedSystem({ ...selectedSystem, name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-description" className="text-right">
                  Description
                </Label>
                <Input
                  id="edit-description"
                  className="col-span-3"
                  value={selectedSystem.description}
                  onChange={(e) => setSelectedSystem({ ...selectedSystem, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-type" className="text-right">
                  Type
                </Label>
                <Select
                  value={selectedSystem.type}
                  onValueChange={(value) =>
                    setSelectedSystem({ ...selectedSystem, type: value as "Numeric" | "Letter" | "Percentage" | "Custom" })
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Letter">Letter</SelectItem>
                    <SelectItem value="Numeric">Numeric</SelectItem>
                    <SelectItem value="Percentage">Percentage</SelectItem>
                    <SelectItem value="Custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-department" className="text-right">
                  Department
                </Label>
                <Select
                  value={selectedSystem.department}
                  onValueChange={(value) => setSelectedSystem({ ...selectedSystem, department: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Departments</SelectItem>
                    <SelectItem value="Elementary">Elementary</SelectItem>
                    <SelectItem value="Middle School">Middle School</SelectItem>
                    <SelectItem value="High School">High School</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-gradeLevel" className="text-right">
                  Grade Level
                </Label>
                <Select
                  value={selectedSystem.gradeLevel}
                  onValueChange={(value) => setSelectedSystem({ ...selectedSystem, gradeLevel: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select grade level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Grades</SelectItem>
                    <SelectItem value="K-5">K-5</SelectItem>
                    <SelectItem value="6-8">6-8</SelectItem>
                    <SelectItem value="9-12">9-12</SelectItem>
                    <SelectItem value="11-12">11-12</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-status" className="text-right">
                  Status
                </Label>
                <Select
                  value={selectedSystem.status}
                  onValueChange={(value) =>
                    setSelectedSystem({ ...selectedSystem, status: value as "Active" | "Inactive" | "Draft" })
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                    <SelectItem value="Draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-isDefault" className="text-right">
                  Set as Default
                </Label>
                <div className="col-span-3 flex items-center space-x-2">
                  <Checkbox
                    id="edit-isDefault"
                    checked={selectedSystem.isDefault}
                    onCheckedChange={(checked) =>
                      setSelectedSystem({ ...selectedSystem, isDefault: checked as boolean })
                    }
                  />
                  <label
                    htmlFor="edit-isDefault"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Make this the default grading system
                  </label>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditSystem}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the &quot;{selectedSystem?.name}&quot; grading system? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteSystem}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
