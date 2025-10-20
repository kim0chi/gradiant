"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Edit, MoreHorizontal, Plus, Trash } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"

type AssessmentType = {
  id: string
  name: string
  description: string
  defaultWeight: number
  includeInFinalGrade: boolean
  isRequired: boolean
  allowResubmission: boolean
  minPerPeriod: number
  status: "Active" | "Inactive" | "Draft"
}

const MOCK_ASSESSMENT_TYPES: AssessmentType[] = [
  {
    id: "1",
    name: "Test",
    description: "Major summative assessment for a unit or chapter",
    defaultWeight: 30,
    includeInFinalGrade: true,
    isRequired: true,
    allowResubmission: false,
    minPerPeriod: 2,
    status: "Active",
  },
  {
    id: "2",
    name: "Quiz",
    description: "Short assessment to check understanding",
    defaultWeight: 15,
    includeInFinalGrade: true,
    isRequired: false,
    allowResubmission: true,
    minPerPeriod: 4,
    status: "Active",
  },
  {
    id: "3",
    name: "Homework",
    description: "Practice assignments completed outside of class",
    defaultWeight: 10,
    includeInFinalGrade: true,
    isRequired: false,
    allowResubmission: true,
    minPerPeriod: 8,
    status: "Active",
  },
  {
    id: "4",
    name: "Project",
    description: "In-depth application of learning through larger assignment",
    defaultWeight: 25,
    includeInFinalGrade: true,
    isRequired: true,
    allowResubmission: false,
    minPerPeriod: 1,
    status: "Active",
  },
  {
    id: "5",
    name: "Participation",
    description: "Engagement and contribution in class activities",
    defaultWeight: 10,
    includeInFinalGrade: true,
    isRequired: false,
    allowResubmission: false,
    minPerPeriod: 1,
    status: "Active",
  },
  {
    id: "6",
    name: "Final Exam",
    description: "Comprehensive assessment at the end of term",
    defaultWeight: 20,
    includeInFinalGrade: true,
    isRequired: true,
    allowResubmission: false,
    minPerPeriod: 1,
    status: "Active",
  },
]

export function AssessmentTypesTable() {
  const [assessmentTypes, setAssessmentTypes] = useState<AssessmentType[]>(MOCK_ASSESSMENT_TYPES)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedType, setSelectedType] = useState<AssessmentType | null>(null)
  const [newType, setNewType] = useState<Partial<AssessmentType>>({
    name: "",
    description: "",
    defaultWeight: 10,
    includeInFinalGrade: true,
    isRequired: false,
    allowResubmission: false,
    minPerPeriod: 1,
    status: "Active",
  })

  const handleAddType = () => {
    const newId = (Math.max(...assessmentTypes.map((t) => Number.parseInt(t.id))) + 1).toString()
    setAssessmentTypes([...assessmentTypes, { ...(newType as AssessmentType), id: newId }])
    setIsAddDialogOpen(false)
    setNewType({
      name: "",
      description: "",
      defaultWeight: 10,
      includeInFinalGrade: true,
      isRequired: false,
      allowResubmission: false,
      minPerPeriod: 1,
      status: "Active",
    })
  }

  const handleEditType = () => {
    if (selectedType) {
      setAssessmentTypes(assessmentTypes.map((type) => (type.id === selectedType.id ? selectedType : type)))
      setIsEditDialogOpen(false)
      setSelectedType(null)
    }
  }

  const handleDeleteType = () => {
    if (selectedType) {
      setAssessmentTypes(assessmentTypes.filter((type) => type.id !== selectedType.id))
      setIsDeleteDialogOpen(false)
      setSelectedType(null)
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
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Assessment Types</h3>
          <p className="text-sm text-muted-foreground">
            Configure the types of assessments used in your grading system
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Type
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Add Assessment Type</DialogTitle>
              <DialogDescription>Define a new type of assessment for your grading system</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  className="col-span-3"
                  value={newType.name}
                  onChange={(e) => setNewType({ ...newType, name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="description"
                  className="col-span-3"
                  value={newType.description}
                  onChange={(e) => setNewType({ ...newType, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="defaultWeight" className="text-right">
                  Default Weight (%)
                </Label>
                <Input
                  id="defaultWeight"
                  type="number"
                  min="0"
                  max="100"
                  className="col-span-3"
                  value={newType.defaultWeight}
                  onChange={(e) => setNewType({ ...newType, defaultWeight: Number.parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="minPerPeriod" className="text-right">
                  Min. Per Period
                </Label>
                <Input
                  id="minPerPeriod"
                  type="number"
                  min="0"
                  className="col-span-3"
                  value={newType.minPerPeriod}
                  onChange={(e) => setNewType({ ...newType, minPerPeriod: Number.parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="text-right">Options</div>
                <div className="col-span-3 space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="includeInFinalGrade"
                      checked={newType.includeInFinalGrade}
                      onCheckedChange={(checked) => setNewType({ ...newType, includeInFinalGrade: checked as boolean })}
                    />
                    <Label htmlFor="includeInFinalGrade">Include in final grade</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isRequired"
                      checked={newType.isRequired}
                      onCheckedChange={(checked) => setNewType({ ...newType, isRequired: checked as boolean })}
                    />
                    <Label htmlFor="isRequired">Required assessment</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="allowResubmission"
                      checked={newType.allowResubmission}
                      onCheckedChange={(checked) => setNewType({ ...newType, allowResubmission: checked as boolean })}
                    />
                    <Label htmlFor="allowResubmission">Allow resubmission</Label>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddType}>Add Assessment Type</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Name</TableHead>
              <TableHead>Default Weight</TableHead>
              <TableHead>Min. Per Period</TableHead>
              <TableHead>Required</TableHead>
              <TableHead>Resubmission</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assessmentTypes.map((type) => (
              <TableRow key={type.id}>
                <TableCell className="font-medium">
                  <div className="flex flex-col">
                    <span>{type.name}</span>
                    <span className="text-xs text-muted-foreground">{type.description}</span>
                  </div>
                </TableCell>
                <TableCell>{type.defaultWeight}%</TableCell>
                <TableCell>{type.minPerPeriod}</TableCell>
                <TableCell>{type.isRequired ? "Yes" : "No"}</TableCell>
                <TableCell>{type.allowResubmission ? "Allowed" : "Not Allowed"}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(type.status)} variant="outline">
                    {type.status}
                  </Badge>
                </TableCell>
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
                          setSelectedType(type)
                          setIsEditDialogOpen(true)
                        }}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => {
                          setSelectedType(type)
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
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Edit Assessment Type</DialogTitle>
            <DialogDescription>Update the properties of this assessment type</DialogDescription>
          </DialogHeader>
          {selectedType && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">
                  Name
                </Label>
                <Input
                  id="edit-name"
                  className="col-span-3"
                  value={selectedType.name}
                  onChange={(e) => setSelectedType({ ...selectedType, name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-description" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="edit-description"
                  className="col-span-3"
                  value={selectedType.description}
                  onChange={(e) => setSelectedType({ ...selectedType, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-defaultWeight" className="text-right">
                  Default Weight (%)
                </Label>
                <Input
                  id="edit-defaultWeight"
                  type="number"
                  min="0"
                  max="100"
                  className="col-span-3"
                  value={selectedType.defaultWeight}
                  onChange={(e) =>
                    setSelectedType({ ...selectedType, defaultWeight: Number.parseInt(e.target.value) || 0 })
                  }
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-minPerPeriod" className="text-right">
                  Min. Per Period
                </Label>
                <Input
                  id="edit-minPerPeriod"
                  type="number"
                  min="0"
                  className="col-span-3"
                  value={selectedType.minPerPeriod}
                  onChange={(e) =>
                    setSelectedType({ ...selectedType, minPerPeriod: Number.parseInt(e.target.value) || 0 })
                  }
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="text-right">Options</div>
                <div className="col-span-3 space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="edit-includeInFinalGrade"
                      checked={selectedType.includeInFinalGrade}
                      onCheckedChange={(checked) =>
                        setSelectedType({ ...selectedType, includeInFinalGrade: checked as boolean })
                      }
                    />
                    <Label htmlFor="edit-includeInFinalGrade">Include in final grade</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="edit-isRequired"
                      checked={selectedType.isRequired}
                      onCheckedChange={(checked) =>
                        setSelectedType({ ...selectedType, isRequired: checked as boolean })
                      }
                    />
                    <Label htmlFor="edit-isRequired">Required assessment</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="edit-allowResubmission"
                      checked={selectedType.allowResubmission}
                      onCheckedChange={(checked) =>
                        setSelectedType({ ...selectedType, allowResubmission: checked as boolean })
                      }
                    />
                    <Label htmlFor="edit-allowResubmission">Allow resubmission</Label>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditType}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the &quot;{selectedType?.name}&quot; assessment type? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteType}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
