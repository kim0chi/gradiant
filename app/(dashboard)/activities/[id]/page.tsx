"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import {
  ArrowLeft,
  Calendar,
  Edit,
  GraduationCap,
  LayoutGrid,
  MessageSquare,
  Paperclip,
  BarChart3,
  Users,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { GradeDistribution } from "@/components/activities/grade-distribution"
import { CompletionStatus } from "@/components/activities/completion-status"
import { ActivityTimeline } from "@/components/activities/activity-timeline"
import { StudentSubmissionsTable } from "@/components/activities/student-submissions-table"
import { RubricEditor } from "@/components/activities/rubric-editor"

// Mock data
const initialActivities = [
  {
    id: "ACT001",
    title: "Math Quiz 1",
    type: "Quiz",
    class: "Algebra II",
    dueDate: "2023-07-15",
    maxPoints: 20,
    weight: 10,
    status: "Active",
    description: "First quiz covering linear equations and inequalities.",
    instructions: `
      <h3>Instructions:</h3>
      <p>This quiz covers the following topics:</p>
      <ul>
        <li>Linear equations</li>
        <li>Systems of inequalities</li>
        <li>Graphing lines</li>
        <li>Word problems</li>
      </ul>
      <p>You will have 30 minutes to complete this quiz. Show all your work to receive full credit.</p>
      <p>Good luck!</p>
    `,
    isGraded: true,
    isPublished: true,
    createdAt: "2023-07-01",
    rubric: [
      {
        criterion: "Understanding of concepts",
        maxPoints: 8,
        description: "Demonstrates clear understanding of linear equations and inequalities",
      },
      {
        criterion: "Problem-solving approach",
        maxPoints: 6,
        description: "Uses appropriate methods to solve problems",
      },
      { criterion: "Accuracy of calculations", maxPoints: 4, description: "Performs calculations correctly" },
      {
        criterion: "Presentation and clarity",
        maxPoints: 2,
        description: "Work is well-organized and clearly presented",
      },
    ],
    attachments: [
      { name: "Quiz-1-Formula-Sheet.pdf", type: "PDF", size: "284 KB" },
      { name: "Practice-Problems.docx", type: "Word", size: "156 KB" },
    ],
  },
  {
    id: "ACT002",
    title: "Biology Lab Report",
    type: "Assignment",
    class: "Biology 101",
    dueDate: "2023-07-18",
    maxPoints: 50,
    weight: 15,
    status: "Active",
    description: "Lab report on cell structure and function observation.",
    instructions: `
      <h3>Lab Report Guidelines:</h3>
      <p>Your lab report should include the following sections:</p>
      <ol>
        <li>Title page</li>
        <li>Abstract (summary of the lab)</li>
        <li>Introduction</li>
        <li>Materials and Methods</li>
        <li>Results (including diagrams and data)</li>
        <li>Discussion</li>
        <li>Conclusion</li>
        <li>References</li>
      </ol>
      <p>Your report should be 3-5 pages in length, double-spaced, using 12pt Times New Roman font.</p>
    `,
    isGraded: true,
    isPublished: true,
    createdAt: "2023-07-02",
    rubric: [
      {
        criterion: "Introduction and background",
        maxPoints: 10,
        description: "Clearly introduces the topic and provides necessary background",
      },
      {
        criterion: "Materials and methods",
        maxPoints: 10,
        description: "Clearly describes procedures and materials used",
      },
      {
        criterion: "Results and data presentation",
        maxPoints: 15,
        description: "Presents data accurately with appropriate tables and figures",
      },
      {
        criterion: "Discussion and conclusion",
        maxPoints: 10,
        description: "Interprets results correctly and draws valid conclusions",
      },
      {
        criterion: "Writing quality and formatting",
        maxPoints: 5,
        description: "Clear writing, proper citations, and correct formatting",
      },
    ],
    attachments: [
      { name: "Lab-Report-Template.docx", type: "Word", size: "112 KB" },
      { name: "Cell-Images.zip", type: "ZIP", size: "4.2 MB" },
    ],
  },
  // Include other activities here
]

const studentSubmissions = [
  {
    id: "SUB001",
    student: {
      id: "STU001",
      name: "Emma Thompson",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    status: "Submitted",
    submittedAt: "2023-07-14T14:32:00Z",
    grade: 18,
    feedback: "Excellent work on the linear equations section!",
    lateSubmission: false,
  },
  {
    id: "SUB002",
    student: {
      id: "STU002",
      name: "Michael Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    status: "Submitted",
    submittedAt: "2023-07-15T09:15:00Z",
    grade: 15,
    feedback: "Good work, but showing your steps would have earned more points.",
    lateSubmission: false,
  },
  {
    id: "SUB003",
    student: {
      id: "STU003",
      name: "Sophia Williams",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    status: "Submitted",
    submittedAt: "2023-07-15T23:59:00Z",
    grade: 20,
    feedback: "Perfect! All problems solved correctly with clear work shown.",
    lateSubmission: true,
  },
  {
    id: "SUB004",
    student: {
      id: "STU004",
      name: "James Brown",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    status: "Missing",
    submittedAt: null,
    grade: null,
    feedback: "",
    lateSubmission: false,
  },
  {
    id: "SUB005",
    student: {
      id: "STU005",
      name: "Olivia Davis",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    status: "Submitted",
    submittedAt: "2023-07-14T18:42:00Z",
    grade: 19,
    feedback: "Excellent work! Minor error in problem 3.",
    lateSubmission: false,
  },
]

export default function ActivityDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { id } = params

  const [activity, setActivity] = useState(null)
  const [submissions, setSubmissions] = useState([])
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    // Simulate fetching activity data
    const foundActivity = initialActivities.find((act) => act.id === id)
    setActivity(foundActivity || null)

    // Simulate fetching submissions
    setSubmissions(studentSubmissions)
  }, [id])

  if (!activity) {
    return (
      <div className="flex h-full items-center justify-center">
        <p>Loading activity...</p>
      </div>
    )
  }

  const getStatusClass = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "Draft":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
      case "Upcoming":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "Completed":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      case "Archived":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  const submittedCount = submissions.filter((sub) => sub.status === "Submitted").length
  const completionRate = (submittedCount / submissions.length) * 100

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={() => router.back()} className="h-9 w-9">
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Back</span>
        </Button>
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold tracking-tight">{activity.title}</h1>
          <div className="flex items-center gap-3 text-muted-foreground">
            <span>{activity.class}</span>
            <span>•</span>
            <span>{activity.type}</span>
            <span>•</span>
            <Badge className={getStatusClass(activity.status)}>{activity.status}</Badge>
          </div>
        </div>
        <div className="ml-auto">
          <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
            <Edit className="mr-2 h-4 w-4" />
            Edit Activity
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">
            <LayoutGrid className="mr-2 h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="submissions">
            <Users className="mr-2 h-4 w-4" />
            Submissions
          </TabsTrigger>
          <TabsTrigger value="rubric">
            <GraduationCap className="mr-2 h-4 w-4" />
            Rubric
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <BarChart3 className="mr-2 h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Activity Details</CardTitle>
                <CardDescription>Description and instructions for this activity</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="mb-2 text-lg font-medium">Description</h3>
                  <p className="text-muted-foreground">{activity.description}</p>
                </div>
                <div>
                  <h3 className="mb-2 text-lg font-medium">Instructions</h3>
                  <div
                    className="prose max-w-none dark:prose-invert"
                    dangerouslySetInnerHTML={{ __html: activity.instructions }}
                  />
                </div>

                {activity.attachments && activity.attachments.length > 0 && (
                  <div>
                    <h3 className="mb-2 text-lg font-medium">Attachments</h3>
                    <div className="space-y-2">
                      {activity.attachments.map((attachment, index) => (
                        <div key={index} className="flex items-center gap-2 rounded-md border p-2">
                          <Paperclip className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{attachment.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {attachment.type} • {attachment.size}
                            </p>
                          </div>
                          <Button variant="ghost" size="sm" className="ml-auto">
                            Download
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Activity Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Due Date</p>
                      <p className="text-sm text-muted-foreground">{activity.dueDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Points</p>
                      <p className="text-sm text-muted-foreground">
                        {activity.maxPoints} points • {activity.weight}% of grade
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Submission Status</p>
                      <div className="mt-1">
                        <Progress value={completionRate} className="h-2" />
                        <p className="mt-1 text-xs text-muted-foreground">
                          {submittedCount} of {submissions.length} students submitted ({Math.round(completionRate)}%)
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Activity Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <ActivityTimeline created={activity.createdAt} dueDate={activity.dueDate} submissions={submissions} />
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="submissions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Student Submissions</CardTitle>
              <CardDescription>View and grade student submissions for this activity</CardDescription>
            </CardHeader>
            <CardContent>
              <StudentSubmissionsTable
                submissions={submissions}
                maxPoints={activity.maxPoints}
                onGradeChange={(submissionId, newGrade) => {
                  // Handle grade change
                  console.log("Grade changed:", submissionId, newGrade)
                }}
                onFeedbackChange={(submissionId, newFeedback) => {
                  // Handle feedback change
                  console.log("Feedback changed:", submissionId, newFeedback)
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rubric" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Grading Rubric</CardTitle>
              <CardDescription>Define criteria for evaluating student work</CardDescription>
            </CardHeader>
            <CardContent>
              <RubricEditor
                rubric={activity.rubric}
                maxPoints={activity.maxPoints}
                onRubricChange={(newRubric) => {
                  // Handle rubric change
                  console.log("Rubric changed:", newRubric)
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Grade Distribution</CardTitle>
                <CardDescription>Distribution of grades across all student submissions</CardDescription>
              </CardHeader>
              <CardContent>
                <GradeDistribution submissions={submissions} maxPoints={activity.maxPoints} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Completion Status</CardTitle>
                <CardDescription>Overview of submission status and completion rates</CardDescription>
              </CardHeader>
              <CardContent>
                <CompletionStatus submissions={submissions} />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Performance Analysis</CardTitle>
              <CardDescription>Detailed analysis of student performance on this activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center border rounded-md">
                <p className="text-muted-foreground">Detailed performance analytics coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

