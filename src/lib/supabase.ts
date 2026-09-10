import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isAuthConfigured = Boolean(supabaseUrl && supabaseAnonKey)

export const supabase: SupabaseClient | null =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null

if (!isAuthConfigured && import.meta.env.DEV) {
  // biome-ignore lint/suspicious/noConsole: helpful dev hint
  console.warn(
    'Auth is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env to enable the sign-in gate. See .env.example.',
  )
}
