'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase/client'

interface Profile {
  id: string
  full_name: string | null
  email: string
  phone: string | null
  address: string | null
  role: string
  created_at: string
}

interface AuthContextType {
  user: User | null
  profile: Profile | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user.id)
      } else {
        setLoading(false)
      }
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session)
      setUser(session?.user ?? null)

      if (session?.user) {
        await fetchProfile(session.user.id)
      } else {
        setProfile(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const fetchProfile = async (userId: string) => {
    try {
      console.log('useAuth - Fetching profile for user:', userId)
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('useAuth - Error fetching profile:', error)
        // If profile doesn't exist, create one
        if (error.code === 'PGRST116') {
          console.log('useAuth - Profile doesn\'t exist, creating...')
          await createProfile(userId)
        }
      } else {
        console.log('useAuth - Profile fetched successfully:', data)
        setProfile(data)
      }
    } catch (error) {
      console.error('useAuth - Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const createProfile = async (userId: string) => {
    try {
      const { data: userData } = await supabase.auth.getUser()
      if (!userData.user) return

      // Check if this is an admin signup (based on email domain or specific emails)
      const isAdminEmail = userData.user.email?.includes('admin') || 
                          userData.user.email === 'admin.itsyourchoice@gmail.com' ||
                          userData.user.email === 'tausiful11@gmail.com'

      const { data, error } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          full_name: userData.user.user_metadata?.full_name || null,
          email: userData.user.email || '',
          role: isAdminEmail ? 'admin' : 'customer' // Default role based on email
        } as any)
        .select()
        .single()

      if (error) {
        console.error('Error creating profile:', error)
      } else {
        setProfile(data)
      }
    } catch (error) {
      console.error('Error creating profile:', error)
    }
  }

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { error }
  }

  const signUp = async (email: string, password: string, fullName: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        }
      }
    })
    return { error }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id)
    }
  }

  const value = {
    user,
    profile,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    refreshProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Helper hook to check if user is admin
export function useIsAdmin() {
  const { profile } = useAuth()
  return profile?.role === 'admin' || profile?.role === 'super_admin'
}

// Helper hook to check if user is authenticated
export function useIsAuthenticated() {
  const { user } = useAuth()
  return !!user
}
