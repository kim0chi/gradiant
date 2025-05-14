"use client"

import { useSettings } from "@/contexts/settings-context"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

export function GradebookSettings() {
  const { settings, updateSettings } = useSettings()

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="defaultGradebookView">Default View</Label>
        <Select
          value={settings.defaultGradebookView || "grid"}
          onValueChange={(value) => updateSettings({ defaultGradebookView: value })}
        >
          <SelectTrigger id="defaultGradebookView">
            <SelectValue placeholder="Select default view" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="grid">Grid View</SelectItem>
            <SelectItem value="list">List View</SelectItem>
            <SelectItem value="summary">Summary View</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="gradeRounding">Grade Rounding</Label>
        <Select
          value={settings.gradeRounding || "nearest"}
          onValueChange={(value) => updateSettings({ gradeRounding: value })}
        >
          <SelectTrigger id="gradeRounding">
            <SelectValue placeholder="Select rounding method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="nearest">Round to nearest</SelectItem>
            <SelectItem value="up">Always round up</SelectItem>
            <SelectItem value="down">Always round down</SelectItem>
            <SelectItem value="none">No rounding</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="showPercentages">Show Percentages</Label>
          <div className="text-sm text-muted-foreground">Display percentage values alongside letter grades</div>
        </div>
        <Switch
          id="showPercentages"
          checked={settings.showPercentages !== false}
          onCheckedChange={(checked) => updateSettings({ showPercentages: checked })}
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="highlightLowGrades">Highlight Low Grades</Label>
          <div className="text-sm text-muted-foreground">Visually highlight grades below passing threshold</div>
        </div>
        <Switch
          id="highlightLowGrades"
          checked={settings.highlightLowGrades !== false}
          onCheckedChange={(checked) => updateSettings({ highlightLowGrades: checked })}
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="autoCalculateFinals">Auto-Calculate Finals</Label>
          <div className="text-sm text-muted-foreground">
            Automatically calculate final grades based on category weights
          </div>
        </div>
        <Switch
          id="autoCalculateFinals"
          checked={settings.autoCalculateFinals !== false}
          onCheckedChange={(checked) => updateSettings({ autoCalculateFinals: checked })}
        />
      </div>
    </div>
  )
}
