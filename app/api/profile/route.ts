import { type NextRequest, NextResponse } from "next/server"
import { getUserProfile, updateUserProfile } from "@/lib/profile-service"

export async function GET(_request: NextRequest) {
  try {
    const profile = await getUserProfile()

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    return NextResponse.json({ profile })
  } catch (error) {
    console.error("Error in GET /api/profile:", error)
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { profile: updatedProfile } = await request.json()

    if (!updatedProfile) {
      return NextResponse.json({ error: "No profile data provided" }, { status: 400 })
    }

    const profile = await updateUserProfile(updatedProfile)

    if (!profile) {
      return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
    }

    return NextResponse.json({ profile })
  } catch (error) {
    console.error("Error in PUT /api/profile:", error)
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
  }
}
