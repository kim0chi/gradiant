"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Save, Plus, Minus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

type RoundingMethod = "nearest" | "up" | "down" | "truncate"
type PassingGradeMethod = "lowestPassingGrade" | "customPercentage"

interface GradeCalculationConfig {
  roundingMethod: RoundingMethod
  roundingPrecision: number
  lowestPassingGrade: string
  passingPercentage: number
  passingGradeMethod: PassingGradeMethod
  showDecimalPlaces: number
  dropLowestGradePerType: boolean
  calculateRunningAverage: boolean
  weightByAssessmentTypes: boolean
  weightByCategories: boolean
  gradingScale: string
  categories: CategoryWeight[]
}

interface CategoryWeight {
  id: string
  name: string
  weight: number
}

const defaultConfig: GradeCalculationConfig = {
  roundingMethod: "nearest",
  roundingPrecision: 2,
  lowestPassingGrade: "D",
  passingPercentage: 60,
  passingGradeMethod: "lowestPassingGrade",
  showDecimalPlaces: 2,
  dropLowestGradePerType: true,
  calculateRunningAverage: true,
  weightByAssessmentTypes: true,
  weightByCategories: false,
  gradingScale: "Standard Letter Grades",
  categories: [
    { id: "1", name: "Tests", weight: 30 },
    { id: "2", name: "Quizzes", weight: 20 },
    { id: "3", name: "Homework", weight: 15 },
    { id: "4", name: "Projects", weight: 25 },
    { id: "5", name: "Participation", weight: 10 },
  ],
}

export function GradeCalculationSettings() {
  const [config, setConfig] = useState<GradeCalculationConfig>(defaultConfig)
  const [activeTab, setActiveTab] = useState("general")
  const { toast } = useToast()

  const handleSaveConfig = () => {
    // Validate total weight is 100%
    if (config.weightByCategories) {
      const totalWeight = config.categories.reduce((sum, cat) => sum + cat.weight, 0)
      if (totalWeight !== 100) {
        toast({
          title: "Error",
          description: `Total category weight must equal 100%. Current total: ${totalWeight}%`,
          variant: "destructive",
        })
        return
      }
    }

    // In a real application, this would save to your database
    toast({
      title: "Success",
      description: "Grade calculation settings saved successfully",
    })
  }

  const handleAddCategory = () => {
    const newId = (Math.max(...config.categories.map((c) => Number.parseInt(c.id))) + 1).toString()
    setConfig({
      ...config,
      categories: [...config.categories, { id: newId, name: "New Category", weight: 0 }],
    })
  }

  const handleRemoveCategory = (id: string) => {
    setConfig({
      ...config,
      categories: config.categories.filter((c) => c.id !== id),
    })
  }

  const handleUpdateCategory = (id: string, field: keyof CategoryWeight, value: string | number) => {
    setConfig({
      ...config,
      categories: config.categories.map((c) =>
        c.id === id ? { ...c, [field]: field === "weight" ? Number.parseInt(String(value)) || 0 : value } : c,
      ),
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Grade Calculation Settings</h3>
          <p className="text-sm text-muted-foreground">
            Configure how grades are calculated and displayed across the system
          </p>
        </div>
        <Button onClick={handleSaveConfig}>
          <Save className="h-4 w-4 mr-2" />
          Save Settings
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="rounding">Rounding & Display</TabsTrigger>
          <TabsTrigger value="passing">Passing Criteria</TabsTrigger>
          <TabsTrigger value="weights">Weighting</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4 pt-4">
          <div className="grid gap-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Grading Scale</Label>
                <p className="text-sm text-muted-foreground">Select the default grading scale to use</p>
              </div>
              <Select
                value={config.gradingScale}
                onValueChange={(value) => setConfig({ ...config, gradingScale: value })}
              >
                <SelectTrigger className="w-[240px]">
                  <SelectValue placeholder="Select grading scale" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Standard Letter Grades">Standard Letter Grades</SelectItem>
                  <SelectItem value="Elementary Scale (1-5)">Elementary Scale (1-5)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Drop Lowest Grade</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically drop the lowest grade for each assessment type
                </p>
              </div>
              <Switch
                checked={config.dropLowestGradePerType}
                onCheckedChange={(checked) => setConfig({ ...config, dropLowestGradePerType: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Running Average</Label>
                <p className="text-sm text-muted-foreground">
                  Calculate and display running average throughout the term
                </p>
              </div>
              <Switch
                checked={config.calculateRunningAverage}
                onCheckedChange={(checked) => setConfig({ ...config, calculateRunningAverage: checked })}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="rounding" className="space-y-4 pt-4">
          <div className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Rounding Method</Label>
                <RadioGroup
                  value={config.roundingMethod}
                  onValueChange={(value) => setConfig({ ...config, roundingMethod: value as RoundingMethod })}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="nearest" id="r-nearest" />
                    <Label htmlFor="r-nearest">Round to nearest</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="up" id="r-up" />
                    <Label htmlFor="r-up">Always round up</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="down" id="r-down" />
                    <Label htmlFor="r-down">Always round down</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="truncate" id="r-truncate" />
                    <Label htmlFor="r-truncate">Truncate (no rounding)</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label>Precision Settings</Label>
                <div className="grid gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="roundingPrecision">Rounding Precision</Label>
                    <Select
                      value={config.roundingPrecision.toString()}
                      onValueChange={(value) => setConfig({ ...config, roundingPrecision: Number.parseInt(value) })}
                    >
                      <SelectTrigger id="roundingPrecision">
                        <SelectValue placeholder="Select precision" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">Whole number (0 decimal places)</SelectItem>
                        <SelectItem value="1">Tenths (1 decimal place)</SelectItem>
                        <SelectItem value="2">Hundredths (2 decimal places)</SelectItem>
                        <SelectItem value="3">Thousandths (3 decimal places)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="showDecimalPlaces">Display Decimal Places</Label>
                    <Select
                      value={config.showDecimalPlaces.toString()}
                      onValueChange={(value) => setConfig({ ...config, showDecimalPlaces: Number.parseInt(value) })}
                    >
                      <SelectTrigger id="showDecimalPlaces">
                        <SelectValue placeholder="Select display precision" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">Whole number (0 decimal places)</SelectItem>
                        <SelectItem value="1">Tenths (1 decimal place)</SelectItem>
                        <SelectItem value="2">Hundredths (2 decimal places)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="passing" className="space-y-4 pt-4">
          <div className="grid gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Passing Grade Method</Label>
                <RadioGroup
                  value={config.passingGradeMethod}
                  onValueChange={(value) => setConfig({ ...config, passingGradeMethod: value as PassingGradeMethod })}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="lowestPassingGrade" id="pg-letter" />
                    <Label htmlFor="pg-letter">Use the lowest passing grade</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="customPercentage" id="pg-percentage" />
                    <Label htmlFor="pg-percentage">Use a custom percentage</Label>
                  </div>
                </RadioGroup>
              </div>

              {config.passingGradeMethod === "lowestPassingGrade" ? (
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="lowestPassingGrade">Lowest Passing Grade</Label>
                  <Select
                    value={config.lowestPassingGrade}
                    onValueChange={(value) => setConfig({ ...config, lowestPassingGrade: value })}
                  >
                    <SelectTrigger id="lowestPassingGrade" className="w-[200px]">
                      <SelectValue placeholder="Select grade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A">A (90-100%)</SelectItem>
                      <SelectItem value="B">B (80-89%)</SelectItem>
                      <SelectItem value="C">C (70-79%)</SelectItem>
                      <SelectItem value="D">D (60-69%)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="passingPercentage">Passing Percentage</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="passingPercentage"
                      type="number"
                      min="0"
                      max="100"
                      className="w-[200px]"
                      value={config.passingPercentage}
                      onChange={(e) =>
                        setConfig({ ...config, passingPercentage: Number.parseInt(e.target.value) || 0 })
                      }
                    />
                    <span>%</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="weights" className="space-y-4 pt-4">
          <div className="grid gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Weighting Method</Label>
                <RadioGroup
                  value={config.weightByCategories ? "categories" : "assessmentTypes"}
                  onValueChange={(value) => {
                    const byCategories = value === "categories"
                    setConfig({
                      ...config,
                      weightByCategories: byCategories,
                      weightByAssessmentTypes: !byCategories,
                    })
                  }}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="assessmentTypes" id="w-types" />
                    <Label htmlFor="w-types">Weight by assessment types</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="categories" id="w-categories" />
                    <Label htmlFor="w-categories">Weight by custom categories</Label>
                  </div>
                </RadioGroup>
              </div>

              {config.weightByCategories && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label>Category Weights</Label>
                    <Button size="sm" variant="outline" onClick={handleAddCategory}>
                      <Plus className="h-4 w-4 mr-1" />
                      Add Category
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {config.categories.map((category) => (
                      <div key={category.id} className="flex items-center space-x-3">
                        <Input
                          className="flex-1"
                          value={category.name}
                          onChange={(e) => handleUpdateCategory(category.id, "name", e.target.value)}
                          placeholder="Category name"
                        />
                        <div className="flex items-center space-x-2 w-[100px]">
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            value={category.weight}
                            onChange={(e) => handleUpdateCategory(category.id, "weight", e.target.value)}
                          />
                          <span>%</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveCategory(category.id)}
                          disabled={config.categories.length <= 1}
                        >
                          <Minus className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    ))}

                    <div className="flex justify-between text-sm pt-2">
                      <span>Total weight:</span>
                      <span
                        className={
                          config.categories.reduce((sum, cat) => sum + cat.weight, 0) !== 100
                            ? "font-semibold text-destructive"
                            : "font-semibold text-green-500"
                        }
                      >
                        {config.categories.reduce((sum, cat) => sum + cat.weight, 0)}%
                        {config.categories.reduce((sum, cat) => sum + cat.weight, 0) !== 100 && " (should be 100%)"}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
