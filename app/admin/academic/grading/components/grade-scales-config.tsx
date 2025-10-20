"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Plus, Trash, Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

type GradeScale = {
  id: string
  name: string
  type: "Letter" | "Numeric" | "Percentage" | "Custom"
  grades: GradeItem[]
}

type GradeItem = {
  id: string
  name: string
  value: string
  minPercentage: number
  maxPercentage: number
  gpa: number | null
  description: string
}

const LETTER_GRADES_TEMPLATE: GradeItem[] = [
  { id: "1", name: "A", value: "A", minPercentage: 90, maxPercentage: 100, gpa: 4.0, description: "Excellent" },
  { id: "2", name: "B", value: "B", minPercentage: 80, maxPercentage: 89, gpa: 3.0, description: "Good" },
  { id: "3", name: "C", value: "C", minPercentage: 70, maxPercentage: 79, gpa: 2.0, description: "Satisfactory" },
  { id: "4", name: "D", value: "D", minPercentage: 60, maxPercentage: 69, gpa: 1.0, description: "Needs Improvement" },
  { id: "5", name: "F", value: "F", minPercentage: 0, maxPercentage: 59, gpa: 0.0, description: "Failing" },
]

const NUMERIC_GRADES_TEMPLATE: GradeItem[] = [
  { id: "1", name: "5", value: "5", minPercentage: 90, maxPercentage: 100, gpa: 4.0, description: "Excellent" },
  { id: "2", name: "4", value: "4", minPercentage: 80, maxPercentage: 89, gpa: 3.0, description: "Good" },
  { id: "3", name: "3", value: "3", minPercentage: 70, maxPercentage: 79, gpa: 2.0, description: "Satisfactory" },
  { id: "4", name: "2", value: "2", minPercentage: 60, maxPercentage: 69, gpa: 1.0, description: "Needs Improvement" },
  { id: "5", name: "1", value: "1", minPercentage: 0, maxPercentage: 59, gpa: 0.0, description: "Failing" },
]

const MOCK_GRADE_SCALES: GradeScale[] = [
  {
    id: "1",
    name: "Standard Letter Grades",
    type: "Letter",
    grades: LETTER_GRADES_TEMPLATE,
  },
  {
    id: "2",
    name: "Elementary Scale (1-5)",
    type: "Numeric",
    grades: NUMERIC_GRADES_TEMPLATE,
  },
]

export function GradeScalesConfig() {
  const [gradeScales, setGradeScales] = useState<GradeScale[]>(MOCK_GRADE_SCALES)
  const { toast } = useToast()
  const [activeScale, setActiveScale] = useState<string>(MOCK_GRADE_SCALES[0].id)
  const [editedGradeScale, setEditedGradeScale] = useState<GradeScale | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [newScaleName, setNewScaleName] = useState("")
  const [newScaleType, setNewScaleType] = useState<"Letter" | "Numeric" | "Percentage" | "Custom">("Letter")

  useEffect(() => {
    // Set the edited grade scale to the active scale
    const scale = gradeScales.find((scale) => scale.id === activeScale)
    if (scale) {
      setEditedGradeScale({ ...scale, grades: [...scale.grades] })
    }
  }, [activeScale, gradeScales])

  const handleAddGradeScale = () => {
    if (!newScaleName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a name for the new grade scale",
        variant: "destructive",
      })
      return
    }

    const newId = (Math.max(...gradeScales.map((s) => Number.parseInt(s.id))) + 1).toString()

    let template: GradeItem[]
    if (newScaleType === "Letter") {
      template = [...LETTER_GRADES_TEMPLATE]
    } else if (newScaleType === "Numeric") {
      template = [...NUMERIC_GRADES_TEMPLATE]
    } else {
      template = []
    }

    const newScale: GradeScale = {
      id: newId,
      name: newScaleName,
      type: newScaleType,
      grades: template,
    }

    setGradeScales([...gradeScales, newScale])
    setActiveScale(newId)
    setIsAdding(false)
    setNewScaleName("")
  }

  const handleAddGrade = () => {
    if (!editedGradeScale) return

    const newId = (Math.max(...editedGradeScale.grades.map((g) => Number.parseInt(g.id))) + 1).toString()
    const newGrade: GradeItem = {
      id: newId,
      name: "",
      value: "",
      minPercentage: 0,
      maxPercentage: 0,
      gpa: null,
      description: "",
    }

    setEditedGradeScale({
      ...editedGradeScale,
      grades: [...editedGradeScale.grades, newGrade],
    })
  }

  const handleRemoveGrade = (gradeId: string) => {
    if (!editedGradeScale) return

    setEditedGradeScale({
      ...editedGradeScale,
      grades: editedGradeScale.grades.filter((g) => g.id !== gradeId),
    })
  }

  const handleGradeChange = (gradeId: string, field: keyof GradeItem, value: string | number | null) => {
    if (!editedGradeScale) return

    setEditedGradeScale({
      ...editedGradeScale,
      grades: editedGradeScale.grades.map((g) => (g.id === gradeId ? { ...g, [field]: value } : g)),
    })
  }

  const handleSaveChanges = () => {
    if (!editedGradeScale) return

    setGradeScales(gradeScales.map((scale) => (scale.id === editedGradeScale.id ? editedGradeScale : scale)))

    toast({
      title: "Success",
      description: "Grade scale saved successfully",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div>
          <h3 className="text-lg font-semibold">Grade Scales Configuration</h3>
          <p className="text-sm text-muted-foreground">Define how grades are structured and their ranges</p>
        </div>
        {isAdding ? (
          <div className="flex items-center gap-2">
            <Input
              className="w-48"
              placeholder="Scale Name"
              value={newScaleName}
              onChange={(e) => setNewScaleName(e.target.value)}
            />
            <Select
              value={newScaleType}
              onValueChange={(value) => setNewScaleType(value as "Letter" | "Numeric" | "Percentage" | "Custom")}
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Letter">Letter</SelectItem>
                <SelectItem value="Numeric">Numeric</SelectItem>
                <SelectItem value="Percentage">Percentage</SelectItem>
                <SelectItem value="Custom">Custom</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={() => setIsAdding(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleAddGradeScale}>
              Create
            </Button>
          </div>
        ) : (
          <Button onClick={() => setIsAdding(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Scale
          </Button>
        )}
      </div>

      <Tabs value={activeScale} onValueChange={setActiveScale}>
        <TabsList className="w-full overflow-x-auto flex flex-row flex-nowrap">
          {gradeScales.map((scale) => (
            <TabsTrigger key={scale.id} value={scale.id} className="whitespace-nowrap">
              {scale.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {gradeScales.map((scale) => (
          <TabsContent key={scale.id} value={scale.id} className="space-y-4">
            {editedGradeScale && editedGradeScale.id === scale.id && (
              <>
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold">{editedGradeScale.name}</h3>
                    <p className="text-sm text-muted-foreground">{editedGradeScale.type} Grading Scale</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleAddGrade}>
                      <Plus className="h-4 w-4 mr-1" />
                      Add Grade
                    </Button>
                    <Button onClick={handleSaveChanges}>
                      <Save className="h-4 w-4 mr-1" />
                      Save Changes
                    </Button>
                  </div>
                </div>

                <div className="space-y-4 border rounded-md p-4">
                  {editedGradeScale.grades.map((grade) => (
                    <div
                      key={grade.id}
                      className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center pb-4 border-b last:border-0 last:pb-0"
                    >
                      <div className="md:col-span-2 flex items-center gap-2">
                        <div className="flex flex-col">
                          <Label htmlFor={`grade-${grade.id}-name`}>Grade</Label>
                          <Input
                            id={`grade-${grade.id}-name`}
                            value={grade.name}
                            onChange={(e) => handleGradeChange(grade.id, "name", e.target.value)}
                            className="mt-1"
                          />
                        </div>
                      </div>
                      <div className="md:col-span-2 flex flex-col">
                        <Label htmlFor={`grade-${grade.id}-value`}>Value</Label>
                        <Input
                          id={`grade-${grade.id}-value`}
                          value={grade.value}
                          onChange={(e) => handleGradeChange(grade.id, "value", e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div className="md:col-span-4 space-y-2">
                        <div className="flex justify-between">
                          <Label>Percentage Range</Label>
                          <span className="text-sm text-muted-foreground">
                            {grade.minPercentage}% - {grade.maxPercentage}%
                          </span>
                        </div>
                        <Slider
                          value={[grade.minPercentage, grade.maxPercentage]}
                          min={0}
                          max={100}
                          step={1}
                          onValueChange={([min, max]) => {
                            handleGradeChange(grade.id, "minPercentage", min)
                            handleGradeChange(grade.id, "maxPercentage", max)
                          }}
                        />
                      </div>
                      <div className="md:col-span-1 flex flex-col">
                        <Label htmlFor={`grade-${grade.id}-gpa`}>GPA</Label>
                        <Input
                          id={`grade-${grade.id}-gpa`}
                          type="number"
                          step="0.1"
                          value={grade.gpa !== null ? grade.gpa : ""}
                          onChange={(e) =>
                            handleGradeChange(
                              grade.id,
                              "gpa",
                              e.target.value === "" ? null : Number.parseFloat(e.target.value),
                            )
                          }
                          className="mt-1"
                        />
                      </div>
                      <div className="md:col-span-2 flex flex-col">
                        <Label htmlFor={`grade-${grade.id}-description`}>Description</Label>
                        <Input
                          id={`grade-${grade.id}-description`}
                          value={grade.description}
                          onChange={(e) => handleGradeChange(grade.id, "description", e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div className="md:col-span-1 flex items-end justify-end">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveGrade(grade.id)}
                          disabled={editedGradeScale.grades.length <= 1}
                        >
                          <Trash className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
