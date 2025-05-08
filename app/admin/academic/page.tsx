"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle, BookOpen, Users, GraduationCap, Calendar, BarChart } from "lucide-react"
import Link from "next/link"
import { AcademicStats } from "./components/academic-stats"
import { RecentClasses } from "./components/recent-classes"
import { UpcomingEvents } from "./components/upcoming-events"
import { GradingOverview } from "./components/grading-overview"

export default function AcademicDashboardPage() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Academic Management</h1>
          <p className="text-muted-foreground">Manage classes, subjects, grading systems, and academic calendars.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild>
            <Link href="/admin/academic/classes/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              New Class
            </Link>
          </Button>
        </div>
      </div>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 w-full">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="classes">Classes</TabsTrigger>
          <TabsTrigger value="subjects">Subjects</TabsTrigger>
          <TabsTrigger value="grading">Grading</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <AcademicStats />

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>Recent Classes</CardTitle>
                <CardDescription>Recently created or updated classes</CardDescription>
              </CardHeader>
              <CardContent>
                <RecentClasses />
              </CardContent>
            </Card>
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Upcoming Academic Events</CardTitle>
                <CardDescription>Exams, holidays, and important dates</CardDescription>
              </CardHeader>
              <CardContent>
                <UpcomingEvents />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Grading Overview</CardTitle>
              <CardDescription>Current grading distribution across classes</CardDescription>
            </CardHeader>
            <CardContent>
              <GradingOverview />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="classes" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Link href="/admin/academic/classes" className="block">
              <Card className="h-full transition-colors hover:border-primary/50">
                <CardHeader>
                  <Users className="h-8 w-8 mb-2 text-primary" />
                  <CardTitle>Class Management</CardTitle>
                  <CardDescription>Create and manage classes, sections, and schedules</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Organize students into classes, assign teachers, and set up class schedules.
                  </p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/admin/academic/classes/enrollment" className="block">
              <Card className="h-full transition-colors hover:border-primary/50">
                <CardHeader>
                  <GraduationCap className="h-8 w-8 mb-2 text-primary" />
                  <CardTitle>Student Enrollment</CardTitle>
                  <CardDescription>Manage student enrollment in classes</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Enroll students in classes, transfer students between classes, and manage class rosters.
                  </p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/admin/academic/classes/assignments" className="block">
              <Card className="h-full transition-colors hover:border-primary/50">
                <CardHeader>
                  <BookOpen className="h-8 w-8 mb-2 text-primary" />
                  <CardTitle>Teacher Assignments</CardTitle>
                  <CardDescription>Assign teachers to classes and subjects</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Manage teacher assignments, workloads, and schedules for all classes.
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </TabsContent>

        <TabsContent value="subjects" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Link href="/admin/academic/subjects" className="block">
              <Card className="h-full transition-colors hover:border-primary/50">
                <CardHeader>
                  <BookOpen className="h-8 w-8 mb-2 text-primary" />
                  <CardTitle>Subject Management</CardTitle>
                  <CardDescription>Create and manage academic subjects</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Define subjects, set up curricula, and organize course materials.
                  </p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/admin/academic/subjects/curriculum" className="block">
              <Card className="h-full transition-colors hover:border-primary/50">
                <CardHeader>
                  <GraduationCap className="h-8 w-8 mb-2 text-primary" />
                  <CardTitle>Curriculum Planning</CardTitle>
                  <CardDescription>Plan and organize curriculum by grade level</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Create curriculum maps, define learning objectives, and organize educational content.
                  </p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/admin/academic/subjects/materials" className="block">
              <Card className="h-full transition-colors hover:border-primary/50">
                <CardHeader>
                  <BookOpen className="h-8 w-8 mb-2 text-primary" />
                  <CardTitle>Learning Materials</CardTitle>
                  <CardDescription>Manage textbooks and learning resources</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Catalog textbooks, digital resources, and other learning materials for each subject.
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </TabsContent>

        <TabsContent value="grading" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Link href="/admin/academic/grading" className="block">
              <Card className="h-full transition-colors hover:border-primary/50">
                <CardHeader>
                  <BarChart className="h-8 w-8 mb-2 text-primary" />
                  <CardTitle>Grading System</CardTitle>
                  <CardDescription>Configure grading scales and policies</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Define grading scales, set up grade calculation rules, and manage assessment types.
                  </p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/admin/academic/grading/assessments" className="block">
              <Card className="h-full transition-colors hover:border-primary/50">
                <CardHeader>
                  <BookOpen className="h-8 w-8 mb-2 text-primary" />
                  <CardTitle>Assessment Types</CardTitle>
                  <CardDescription>Manage different types of assessments</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Configure assessment types, weights, and evaluation criteria for different subjects.
                  </p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/admin/academic/grading/reports" className="block">
              <Card className="h-full transition-colors hover:border-primary/50">
                <CardHeader>
                  <GraduationCap className="h-8 w-8 mb-2 text-primary" />
                  <CardTitle>Report Cards</CardTitle>
                  <CardDescription>Configure report card templates and settings</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Design report card templates, set up grading periods, and manage report generation.
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </TabsContent>

        <TabsContent value="calendar" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Link href="/admin/academic/calendar" className="block">
              <Card className="h-full transition-colors hover:border-primary/50">
                <CardHeader>
                  <Calendar className="h-8 w-8 mb-2 text-primary" />
                  <CardTitle>Academic Calendar</CardTitle>
                  <CardDescription>Manage academic terms and important dates</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Define academic years, terms, and semesters. Set up important dates and events.
                  </p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/admin/academic/calendar/schedule" className="block">
              <Card className="h-full transition-colors hover:border-primary/50">
                <CardHeader>
                  <Calendar className="h-8 w-8 mb-2 text-primary" />
                  <CardTitle>Class Schedules</CardTitle>
                  <CardDescription>Manage class schedules and timetables</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Create and manage class schedules, room assignments, and teacher timetables.
                  </p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/admin/academic/calendar/events" className="block">
              <Card className="h-full transition-colors hover:border-primary/50">
                <CardHeader>
                  <Calendar className="h-8 w-8 mb-2 text-primary" />
                  <CardTitle>Academic Events</CardTitle>
                  <CardDescription>Manage exams, holidays, and special events</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Schedule exams, holidays, parent-teacher conferences, and other academic events.
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
