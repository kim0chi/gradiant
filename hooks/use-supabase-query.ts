"use client"

import { useState, useEffect } from "react"
import type { PostgrestFilterBuilder } from "@supabase/postgrest-js"

type QueryOptions<T> = {
  initialData?: T
  enabled?: boolean
  onSuccess?: (data: T) => void
  onError?: (error: Error) => void
}

export function useSupabaseQuery<T>(
  queryFn: () => Promise<T> | PostgrestFilterBuilder<any, any, T[]>,
  options: QueryOptions<T> = {},
) {
  const { initialData, enabled = true, onSuccess, onError } = options
  const [data, setData] = useState<T | undefined>(initialData)
  const [error, setError] = useState<Error | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(enabled)
  const [isRefetching, setIsRefetching] = useState<boolean>(false)

  const execute = async () => {
    setIsLoading(true)
    setError(null)

    try {
      let result: T

      if (typeof queryFn === "function") {
        result = await queryFn()
      } else {
        const { data, error } = await queryFn

        if (error) {
          throw error
        }

        result = data as T
      }

      setData(result)
      onSuccess?.(result)
      return result
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err))
      setError(error)
      onError?.(error)
      return undefined
    } finally {
      setIsLoading(false)
      setIsRefetching(false)
    }
  }

  const refetch = () => {
    setIsRefetching(true)
    return execute()
  }

  useEffect(() => {
    if (enabled) {
      execute()
    }
  }, [enabled])

  return {
    data,
    error,
    isLoading,
    isRefetching,
    refetch,
  }
}
