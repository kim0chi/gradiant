import { RoleNav } from "@/components/role-nav"

export default function ExamplePage() {
  // This could come from your authentication system
  const userRole = "teacher" // or "admin" or "student"

  return (
    <div className="min-h-screen bg-background">
      <RoleNav role={userRole} />
      <main className="p-4 md:ml-64">
        <h1 className="text-2xl font-bold">Example Page</h1>
        <p>Current role: {userRole}</p>
        {/* Your page content here */}
      </main>
    </div>
  )
}
