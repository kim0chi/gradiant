"use client"

import { useState } from "react"
import { Grip, Plus, Trash } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function RubricEditor({ rubric: initialRubric, maxPoints, onRubricChange }) {
  const [rubric, setRubric] = useState(initialRubric || [])
  const [isEditing, setIsEditing] = useState(false)

  const handleAddCriterion = () => {
    const newRubric = [
      ...rubric,
      {
        criterion: "New Criterion",
        maxPoints: 10,
        description: "Description of this criterion",
      },
    ]
    setRubric(newRubric)
    onRubricChange(newRubric)
  }

  const handleRemoveCriterion = (index) => {
    const newRubric = rubric.filter((_, i) => i !== index)
    setRubric(newRubric)
    onRubricChange(newRubric)
  }

  const handleCriterionChange = (index, field, value) => {
    const newRubric = rubric.map((criterion, i) => {
      if (i === index) {
        return { ...criterion, [field]: field === "maxPoints" ? Number.parseInt(value, 10) : value }
      }
      return criterion
    })
    setRubric(newRubric)
    onRubricChange(newRubric)
  }

  const totalPoints = rubric.reduce((sum, criterion) => sum + criterion.maxPoints, 0)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Grading Criteria</h3>
          <p className="text-sm text-muted-foreground">
            Total: {totalPoints} / {maxPoints} points
          </p>
        </div>
        <Button
          variant={isEditing ? "default" : "outline"}
          onClick={() => setIsEditing(!isEditing)}
          className={
            isEditing ? "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600" : ""
          }
        >
          {isEditing ? "Done Editing" : "Edit Rubric"}
        </Button>
      </div>

      {isEditing ? (
        <div className="space-y-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40px]"></TableHead>
                  <TableHead>Criterion</TableHead>
                  <TableHead className="w-[100px]">Points</TableHead>
                  <TableHead className="w-[80px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rubric.map((criterion, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Grip className="h-4 w-4 text-muted-foreground cursor-move" />
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        <Input
                          value={criterion.criterion}
                          onChange={(e) => handleCriterionChange(index, "criterion", e.target.value)}
                          placeholder="Criterion name"
                        />
                        <Textarea
                          value={criterion.description}
                          onChange={(e) => handleCriterionChange(index, "description", e.target.value)}
                          placeholder="Description of this criterion"
                          className="h-20 min-h-[80px]"
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="0"
                        max={maxPoints}
                        value={criterion.maxPoints}
                        onChange={(e) => handleCriterionChange(index, "maxPoints", e.target.value)}
                      />
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={() => handleRemoveCriterion(index)}>
                        <Trash className="h-4 w-4 text-destructive" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <Button variant="outline" size="sm" className="gap-1" onClick={handleAddCriterion}>
            <Plus className="h-4 w-4" />
            Add Criterion
          </Button>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Criterion</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Points</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rubric.map((criterion, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{criterion.criterion}</TableCell>
                  <TableCell>{criterion.description}</TableCell>
                  <TableCell className="text-right">{criterion.maxPoints}</TableCell>
                </TableRow>
              ))}
              {rubric.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-6 text-muted-foreground">
                    No rubric criteria defined. Click "Edit Rubric" to add criteria.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}

