'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase/client'

interface Profile {
  id: string
  name: string | null
  role: string
  phone: string | null
  address: any | null
  avatar_url: string | null
  is_active: boolean
  last_login: string | null
  total_orders: number
  total_spent: number
  created_at: string
  updated_at: string
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
      console.log(`Auth state change event: ${event}`, { session })
      setSession(session)
      const currentUser = session?.user ?? null
      setUser(currentUser)

      if (event === 'SIGNED_IN') {
        if (currentUser) {
          console.log('User signed in, fetching profile for', currentUser.id)
          await fetchProfile(currentUser.id)
        }
      } else if (event === 'SIGNED_OUT') {
        console.log('User signed out, clearing profile.')
        setProfile(null)
        setLoading(false)
      } else if (event === 'INITIAL_SESSION' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
        if (currentUser) {
          console.log(`Event: ${event}, user found, fetching profile for`, currentUser.id)
          await fetchProfile(currentUser.id)
        } else {
          console.log(`Event: ${event}, no user, clearing profile.`)
          setProfile(null)
          setLoading(false)
        }
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
          try {
            await createProfile(userId)
          } catch (createError) {
            console.error('useAuth - Failed to create profile:', createError)
            // Even if profile creation fails, set loading to false
            setLoading(false)
          }
        } else {
          // For other errors, still set loading to false
          setLoading(false)
        }
      } else {
        console.log('useAuth - Profile fetched successfully:', data)
        setProfile(data)
        setLoading(false)
      }
    } catch (error) {
      console.error('useAuth - Error fetching profile:', error)
      setLoading(false)
    }
  }

  const createProfile = async (userId: string) => {
    try {
      // Get the current user data from auth
      const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser()

      if (userError || !currentUser) {
        console.error('useAuth - No authenticated user found for profile creation:', userError)
        throw new Error('No authenticated user')
      }

      console.log('Creating profile for user:', userId, 'with email:', currentUser.email)

      // Check if this is an admin signup (based on email domain or specific emails)
      const adminEmails = [
        'admin.itsyourchoice@gmail.com',
        'tausiful11@gmail.com',
        'admin@itsyourchoice.com'
      ]

      const isAdminEmail = adminEmails.includes(currentUser.email || '') ||
                          (currentUser.email || '').includes('admin') ||
                          (currentUser.email || '').includes('Admin')

      // Extract name from user metadata or email
      const userName = currentUser.user_metadata?.full_name ||
                      currentUser.user_metadata?.name ||
                      (currentUser.email || '').split('@')[0] ||
                      'User'

      const profileData = {
        id: userId,
        name: userName,
        role: isAdminEmail ? 'admin' : 'customer',
        is_active: true,
        total_orders: 0,
        total_spent: 0
      }

      console.log('Creating profile with data:', profileData)

      const { data, error } = await supabase
        .from('profiles')
        .insert(profileData as any)
        .select()
        .single()

      if (error) {
        console.error('Error creating profile:', error)
        throw error
      } else {
        console.log('Profile created successfully:', data)
        setProfile(data)
        setLoading(false)
        return data
      }
    } catch (error) {
      console.error('Error in createProfile:', error)
      setLoading(false)
      throw error
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
    try {
      console.log('Signing up user with email:', email, 'and name:', fullName)
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            name: fullName
          }
        }
      })

      if (error) {
        console.error('Signup error:', error)
        return { error }
      }

      console.log('Signup successful:', data)

      // If user is immediately available (email confirmation disabled), create profile
      if (data.user && !data.user.email_confirmed_at) {
        console.log('User created but needs email confirmation')
      }

      return { error: null }
    } catch (error) {
      console.error('Signup exception:', error)
      return { error }
    }
  }

  const signOut = async () => {
    console.log('Starting sign out process...')
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Error signing out:', error)
        throw error
      } else {
        console.log('Sign out successful, auth state should be cleared.')
        // Force clear local state immediately
        setUser(null)
        setProfile(null)
        setSession(null)
      }
    } catch (error) {
      console.error('Exception during sign out:', error)
      // Even if there's an error, clear local state
      setUser(null)
      setProfile(null)
      setSession(null)
      throw error
    }
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
