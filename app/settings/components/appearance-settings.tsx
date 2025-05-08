"use client"

import { useSettings } from "@/contexts/settings-context"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"

export function AppearanceSettings() {
  const { settings, updateSettings } = useSettings()

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Theme</Label>
        <RadioGroup
          value={settings.theme}
          onValueChange={(value) => updateSettings({ theme: value as "light" | "dark" | "system" })}
          className="flex flex-col space-y-1"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="light" id="light" />
            <Label htmlFor="light">Light</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="dark" id="dark" />
            <Label htmlFor="dark">Dark</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="system" id="system" />
            <Label htmlFor="system">System</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="sidebar-collapsed">Collapsed Sidebar</Label>
          <div className="text-sm text-muted-foreground">Start with the sidebar collapsed</div>
        </div>
        <Switch
          id="sidebar-collapsed"
          checked={settings.sidebarCollapsed}
          onCheckedChange={(checked) => updateSettings({ sidebarCollapsed: checked })}
        />
      </div>
    </div>
  )
}
