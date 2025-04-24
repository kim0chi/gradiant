import {
  Calendar,
  ClipboardCheck,
  FileSpreadsheet,
  GraduationCap,
  LineChart,
  Users,
  Database,
  FileText,
  Laptop,
} from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const features = [
  {
    icon: FileSpreadsheet,
    title: "Grade Management",
    description:
      "Input, edit, and calculate student grades with custom weighted components and auto-grade calculation.",
  },
  {
    icon: ClipboardCheck,
    title: "Attendance Tracking",
    description:
      "Digital roll call with status markers and automated attendance reports integrated with student profiles.",
  },
  {
    icon: GraduationCap,
    title: "Student Information",
    description: "Centralized student database with personal details, academic records, and performance analytics.",
  },
  {
    icon: Calendar,
    title: "Class & Schedule",
    description:
      "Organize courses and sections with visual class schedules and instructor-student assignment tracking.",
  },
  {
    icon: LineChart,
    title: "Data Analytics",
    description:
      "Visual grade distribution with student progress tracking and predictive analytics for at-risk students.",
  },
  {
    icon: Users,
    title: "Student Clustering",
    description: "AI-powered clustering based on performance for group recommendations and peer learning.",
  },
  {
    icon: FileText,
    title: "Report Generation",
    description:
      "PDF and Excel exports for grade reports with customizable formats for different educational standards.",
  },
  {
    icon: Database,
    title: "LMS Integration",
    description: "Seamless integration with existing Learning Management Systems like Moodle and Google Classroom.",
  },
  {
    icon: Laptop,
    title: "Cross-Platform",
    description: "Works on desktops and mobile devices with responsive UI for tablets and phones.",
  },
]

export function FeatureSection() {
  return (
    <section id="features" className="py-20 md:py-32">
      <div className="container">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">Powerful features for modern educators</h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to streamline grading, track performance, and manage your classroom effectively.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="border-0 bg-gradient-to-br from-white to-gray-50 shadow-md transition-all hover:shadow-lg dark:from-gray-900 dark:to-gray-800"
            >
              <CardHeader>
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 text-white">
                  <feature.icon className="h-6 w-6" />
                </div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

