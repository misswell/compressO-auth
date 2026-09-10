import type { Session } from '@supabase/supabase-js'
import React, { createContext, useContext, useEffect, useState } from 'react'

import { isAuthConfigured, supabase } from '@/lib/supabase'

type AuthContextValue = {
  session: Session | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<void>
  /** Returns true when the user must confirm their email before signing in. */
  signUp: (email: string, password: string) => Promise<boolean>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(isAuthConfigured)

  useEffect(() => {
    if (!supabase) return

    supabase.auth
      .getSession()
      .then(({ data }) => setSession(data.session))
      .finally(() => setIsLoading(false))

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
    })

    return () => subscription.unsubscribe()
  }, [])

  const requireClient = () => {
    if (!supabase) throw new Error('Auth is not configured.')
    return supabase
  }

  const signIn = async (email: string, password: string) => {
    const { error } = await requireClient().auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
  }

  const signUp = async (email: string, password: string) => {
    const { data, error } = await requireClient().auth.signUp({
      email,
      password,
    })
    if (error) throw error
    return !data.session
  }

  const signOut = async () => {
    await requireClient().auth.signOut()
  }

  return (
    <AuthContext.Provider
      value={{ session, isLoading, signIn, signUp, signOut }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export { isAuthConfigured }
export default AuthProvider
