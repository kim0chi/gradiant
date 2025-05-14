import { redirect } from "next/navigation"

/**
 * Default Class Gradebook Page
 *
 * This page redirects users to the grading tab
 * when they select a class from the class selection page.
 */
export default function ClassGradebookPage({ params }: { params: { classId: string } }) {
  // Redirect to the grading tab for this class
  redirect(`/dashboard/gradebook/${params.classId}/grading`)
}
