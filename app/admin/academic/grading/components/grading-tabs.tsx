"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GradingSystemsTable } from "./grading-systems-table"
import { AssessmentTypesTable } from "./assessment-types-table"
import { GradeScalesConfig } from "./grade-scales-config"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GradeCalculationSettings } from "./grade-calculation-settings"

export function GradingTabs() {
  const [activeTab, setActiveTab] = useState("systems")

  return (
    <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="systems">Grading Systems</TabsTrigger>
        <TabsTrigger value="scales">Grade Scales</TabsTrigger>
        <TabsTrigger value="assessments">Assessment Types</TabsTrigger>
        <TabsTrigger value="calculation">Grade Calculation</TabsTrigger>
      </TabsList>

      <TabsContent value="systems" className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Grading Systems</CardTitle>
            <CardDescription>Manage different grading systems used across departments and grade levels</CardDescription>
          </CardHeader>
          <CardContent>
            <GradingSystemsTable />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="scales" className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Grade Scales</CardTitle>
            <CardDescription>Configure grade scales with customizable grade boundaries and descriptors</CardDescription>
          </CardHeader>
          <CardContent>
            <GradeScalesConfig />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="assessments" className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Assessment Types</CardTitle>
            <CardDescription>
              Define assessment types and their characteristics for use in grade calculations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AssessmentTypesTable />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="calculation" className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Grade Calculation Settings</CardTitle>
            <CardDescription>Configure how grades are calculated and weighted across assessment types</CardDescription>
          </CardHeader>
          <CardContent>
            <GradeCalculationSettings />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
