import { Loader2 } from "lucide-react"

export default function StudentLoginLoading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-indigo-50 to-white">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        <p className="text-lg text-indigo-600">Loading student portal...</p>
      </div>
    </div>
  )
}
