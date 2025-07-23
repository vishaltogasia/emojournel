import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import type { Database } from "@/types/database"

export const createServerClient = () => {
  // Check for required environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Missing Supabase environment variables")
    // Return a mock client for development/preview
    return createMockServerClient()
  }

  return createServerComponentClient<Database>({ cookies })
}

// Mock server client for development when env vars are missing
function createMockServerClient() {
  return {
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          single: async () => ({ data: null, error: null }),
          order: () => ({ limit: () => async () => ({ data: [], error: null }) }),
          gte: () => ({
            not: () => ({
              order: () => ({ limit: async () => ({ data: [], error: null }) }),
            }),
          }),
        }),
      }),
      insert: () => ({ select: () => ({ single: async () => ({ data: null, error: null }) }) }),
    }),
  } as any
}
