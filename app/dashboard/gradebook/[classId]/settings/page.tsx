"use client"
import { useState } from "react"
import { Save } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CategoryWeightsForm } from "../components/category-weights-form"
import { PeriodSettings } from "../components/period-settings"
import { GradeCalculationSettings } from "../components/grade-calculation-settings"

export default function SettingsPage({ params }: { params: { classId: string } }) {
  const [isSaving, setIsSaving] = useState(false)

  const handleSaveAll = async () => {
    setIsSaving(true)
    try {
      // Simulate API call to save all settings
      await new Promise((resolve) => setTimeout(resolve, 1500))
      // Success handling would go here
    } catch (error) {
      // Error handling would go here
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold">Gradebook Settings</h2>
        <Button onClick={handleSaveAll} disabled={isSaving} className="flex items-center gap-1">
          <Save className="h-4 w-4" />
          <span>{isSaving ? "Saving..." : "Save All Settings"}</span>
        </Button>
      </div>

      <Tabs defaultValue="categories" className="mb-6">
        <TabsList>
          <TabsTrigger value="categories">Grade Categories</TabsTrigger>
          <TabsTrigger value="periods">Grading Periods</TabsTrigger>
          <TabsTrigger value="calculation">Grade Calculation</TabsTrigger>
          <TabsTrigger value="policies">Grading Policies</TabsTrigger>
        </TabsList>

        <TabsContent value="categories" className="pt-4">
          <CategoryWeightsForm classId={params.classId} />
        </TabsContent>

        <TabsContent value="periods" className="pt-4">
          <PeriodSettings classId={params.classId} />
        </TabsContent>

        <TabsContent value="calculation" className="pt-4">
          <GradeCalculationSettings classId={params.classId} />
        </TabsContent>

        <TabsContent value="policies" className="pt-4">
          <div className="text-center p-8 text-muted-foreground">Grading policies configuration will appear here</div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
