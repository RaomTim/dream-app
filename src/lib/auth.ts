import { createClient } from '@supabase/supabase-js'

/**
 * Client Supabase côté browser (pour l'auth).
 * Utilise les clés publiques — safe pour le client.
 */
export function createBrowserClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export type AuthUser = {
  id: string
  email: string
  display_name?: string
}
