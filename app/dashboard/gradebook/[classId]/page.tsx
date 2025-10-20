import { use } from "react"
import { redirect } from "next/navigation"

/**
 * Default Class Gradebook Page
 *
 * This page redirects users to the grading tab
 * when they select a class from the class selection page.
 */
export default function ClassGradebookPage({ params }: { params: Promise<{ classId: string }> }) {
  const { classId } = use(params)
  // Redirect to the grading tab for this class
  redirect(`/dashboard/gradebook/${classId}/grading`)
}
