"use client"

import { useSettings } from "@/contexts/settings-context"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useTheme } from "next-themes"

export function AppearanceSettings() {
  const { settings, updateSettings } = useSettings()
  const { setTheme } = useTheme()

  const handleThemeChange = (theme: string) => {
    updateSettings({ theme })
    setTheme(theme)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Theme</Label>
        <RadioGroup
          defaultValue={settings.theme || "system"}
          value={settings.theme || "system"}
          onValueChange={handleThemeChange}
          className="flex flex-col space-y-1"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="light" id="theme-light" />
            <Label htmlFor="theme-light">Light</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="dark" id="theme-dark" />
            <Label htmlFor="theme-dark">Dark</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="system" id="theme-system" />
            <Label htmlFor="theme-system">System</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <Label htmlFor="fontSize">Font Size</Label>
        <Select value={settings.fontSize || "medium"} onValueChange={(value) => updateSettings({ fontSize: value })}>
          <SelectTrigger id="fontSize">
            <SelectValue placeholder="Select font size" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="small">Small</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="large">Large</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="sidebarCollapsed">Collapsed Sidebar</Label>
          <div className="text-sm text-muted-foreground">Keep the sidebar collapsed by default</div>
        </div>
        <Switch
          id="sidebarCollapsed"
          checked={settings.sidebarCollapsed === true}
          onCheckedChange={(checked) => updateSettings({ sidebarCollapsed: checked })}
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="animations">Interface Animations</Label>
          <div className="text-sm text-muted-foreground">Enable animations in the user interface</div>
        </div>
        <Switch
          id="animations"
          checked={settings.animations !== false}
          onCheckedChange={(checked) => updateSettings({ animations: checked })}
        />
      </div>
    </div>
  )
}
