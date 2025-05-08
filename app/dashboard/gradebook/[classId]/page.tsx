import React from "react"
import { redirect } from "next/navigation"

/**
 * Default Class Gradebook Page
 *
 * This page redirects users to the grading tab
 * when they select a class from the class selection page.
 */
export default function ClassGradebookPage({ params }: { params: Promise<{ classId: string }> }) {
  // Unwrap params using React.use()
  const unwrappedParams = React.use(params)
  const classId = unwrappedParams.classId
  
  // Redirect to the grading tab for this class
  redirect(`/dashboard/gradebook/${classId}/grading`)
}
