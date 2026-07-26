'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { createBrowserClient, type AuthUser } from '@/lib/auth'
import type { SupabaseClient, Session } from '@supabase/supabase-js'

type AuthContextType = {
  user: AuthUser | null
  session: Session | null
  supabase: SupabaseClient
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [supabase] = useState(() => createBrowserClient())
  const [user, setUser] = useState<AuthUser | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Récupérer la session existante
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setSession(session)
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          display_name: session.user.user_metadata?.display_name,
        })
      }
      setLoading(false)
    })

    // Écouter les changements d'auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          setSession(session)
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            display_name: session.user.user_metadata?.display_name,
          })
        } else {
          setSession(null)
          setUser(null)
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase])

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setSession(null)
  }

  return (
    <AuthContext.Provider value={{ user, session, supabase, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}
