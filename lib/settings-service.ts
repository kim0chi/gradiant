import { createServerClient } from "@/lib/supabase/server"

export interface UserSettings {
  id: string
  user_id: string
  settings_data: Record<string, unknown>
  created_at: string
  updated_at: string
}

export async function getUserSettings(userId: string): Promise<Record<string, unknown> | null> {
  const supabase = createServerClient()

  const { data, error } = await supabase.from("user_settings").select("settings_data").eq("user_id", userId).single()

  if (error) {
    console.error("Error fetching user settings:", error)
    return null
  }

  return data?.settings_data || null
}

export async function saveUserSettings(userId: string, settings: Record<string, unknown>): Promise<boolean> {
  const supabase = createServerClient()

  // Check if settings exist for this user
  const { data: existingSettings } = await supabase.from("user_settings").select("id").eq("user_id", userId).single()

  let result

  if (existingSettings) {
    // Update existing settings
    result = await supabase
      .from("user_settings")
      .update({
        settings_data: settings,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", userId)
  } else {
    // Insert new settings
    result = await supabase.from("user_settings").insert({
      user_id: userId,
      settings_data: settings,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
  }

  if (result.error) {
    console.error("Error saving user settings:", result.error)
    return false
  }

  return true
}
