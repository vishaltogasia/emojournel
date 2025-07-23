import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/types/database"

// Create a singleton client to avoid multiple instances
let supabaseClient: ReturnType<typeof createClientComponentClient<Database>> | null = null

export const createClient = () => {
  if (!supabaseClient) {
    // Check for required environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error("Missing Supabase environment variables")
      // Return a mock client for development/preview
      return createMockClient()
    }

    supabaseClient = createClientComponentClient<Database>()
  }

  return supabaseClient
}

// Mock client for development when env vars are missing
function createMockClient() {
  return {
    auth: {
      signUp: async () => ({ data: null, error: new Error("Supabase not configured") }),
      signInWithPassword: async () => ({ data: null, error: new Error("Supabase not configured") }),
      getSession: async () => ({ data: { session: null }, error: null }),
      signOut: async () => ({ error: null }),
    },
    from: () => ({
      select: () => ({ eq: () => ({ single: async () => ({ data: null, error: null }) }) }),
      insert: () => ({ select: () => ({ single: async () => ({ data: null, error: null }) }) }),
      update: () => ({ eq: () => ({ single: async () => ({ data: null, error: null }) }) }),
    }),
  } as any
}
