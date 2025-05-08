"use client"

import { useRouter } from "next/navigation"
import { LogOut } from "lucide-react"

import { Button } from "@/components/ui/button"
import { clearUser } from "@/lib/mockAuth"

export function LogoutButton() {
  const router = useRouter()

  const handleLogout = () => {
    clearUser()
    router.push("/login")
  }

  return (
    <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2">
      <LogOut className="h-4 w-4" />
      <span>Logout</span>
    </Button>
  )
}
