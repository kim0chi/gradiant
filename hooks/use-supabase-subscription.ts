"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase/client"
import { isDebugMode } from "@/lib/mockAuth"
import type { RealtimeChannel } from "@supabase/supabase-js"

type SubscriptionOptions = {
  event?: "INSERT" | "UPDATE" | "DELETE" | "*"
  callback?: (payload: any) => void
}

export function useSupabaseSubscription(table: string, options: SubscriptionOptions = {}) {
  const { event = "*", callback } = options
  const [subscription, setSubscription] = useState<RealtimeChannel | null>(null)

  useEffect(() => {
    // Skip subscription in debug mode or if supabase.channel is not available
    if (isDebugMode() || typeof supabase.channel !== "function") {
      console.log(`Mock subscription to ${table} (skipped in debug mode)`)
      return () => {}
    }

    try {
      // Create the subscription
      const channel = supabase
        .channel(`public:${table}`)
        .on("postgres_changes", { event, schema: "public", table }, (payload) => {
          callback?.(payload)
        })
        .subscribe()

      setSubscription(channel)

      // Cleanup function
      return () => {
        channel.unsubscribe()
      }
    } catch (error) {
      console.error("Error creating subscription:", error)
      return () => {}
    }
  }, [table, event, callback])

  return subscription
}
