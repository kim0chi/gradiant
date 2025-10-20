import type { NextRequest } from "next/server"

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ classId: string }> }
) {
  const { classId: _classId } = await params
  // Implement your task retrieval logic here
  return new Response(JSON.stringify({ message: "Tasks endpoint" }), {
    headers: { "content-type": "application/json" },
  })
}
