"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function AdminsPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to the users page with the admins filter
    router.push("/admin/users?tab=admin")
  }, [router])

  return (
    <div className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  )
}
