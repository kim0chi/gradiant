"use client"

import { useSettings } from "@/contexts/settings-context"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function GradebookSettings() {
  const { settings, updateSettings } = useSettings()

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Default Grade View</Label>
        <RadioGroup
          value={settings.defaultGradeView}
          onValueChange={(value) => updateSettings({ defaultGradeView: value as "table" | "card" })}
          className="flex flex-col space-y-1"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="table" id="table" />
            <Label htmlFor="table">Table View</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="card" id="card" />
            <Label htmlFor="card">Card View</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="show-percentages">Show Grade Percentages</Label>
          <div className="text-sm text-muted-foreground">Display percentage values alongside letter grades</div>
        </div>
        <Switch
          id="show-percentages"
          checked={settings.showGradePercentages}
          onCheckedChange={(checked) => updateSettings({ showGradePercentages: checked })}
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="round-grades">Round Grades</Label>
          <div className="text-sm text-muted-foreground">Automatically round grade values</div>
        </div>
        <Switch
          id="round-grades"
          checked={settings.roundGrades}
          onCheckedChange={(checked) => updateSettings({ roundGrades: checked })}
        />
      </div>

      {settings.roundGrades && (
        <div className="space-y-2">
          <Label htmlFor="rounding-method">Rounding Method</Label>
          <Select
            value={settings.roundingMethod}
            onValueChange={(value) => updateSettings({ roundingMethod: value as any })}
            disabled={!settings.roundGrades}
          >
            <SelectTrigger id="rounding-method">
              <SelectValue placeholder="Select rounding method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="up">Always Round Up</SelectItem>
              <SelectItem value="down">Always Round Down</SelectItem>
              <SelectItem value="nearest">Round to Nearest</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  )
}
