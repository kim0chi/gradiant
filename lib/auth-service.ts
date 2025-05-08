import { supabase, User } from './supabase'

// Authentication functions
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  
  if (error) {
    throw new Error(error.message)
  }
  
  return data
}

export async function signUp(email: string, password: string, userData: Partial<User>) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: userData,
    },
  })
  
  if (error) {
    throw new Error(error.message)
  }
  
  return data
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  
  if (error) {
    throw new Error(error.message)
  }
  
  return true
}

export async function getCurrentUser(): Promise<User | null> {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null
  
  try {
    // Get the user profile data from the profiles table
    // Remove the is_demo filter since the column doesn't exist
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
    
    if (error) {
      console.error('Error fetching user profile:', error)
      // If we can't get the profile data, return the auth user data
      return {
        ...user,
        id: user.id,
        email: user.email || '',
        role: user.user_metadata?.role || 'student',
        created_at: user.created_at || new Date().toISOString(),
      } as User
    }
    
    if (!data) {
      // If no profile exists, return the auth user data
      return {
        ...user,
        id: user.id,
        email: user.email || '',
        role: user.user_metadata?.role || 'student',
        created_at: user.created_at || new Date().toISOString(),
      } as User
    }
      
    return data as User
  } catch (error) {
    console.error('Unexpected error in getCurrentUser:', error)
    return null
  }
}

export async function getUserRole(): Promise<'teacher' | 'student' | 'admin' | null> {
  const user = await getCurrentUser()
  return user?.role || null
}

// Function to check if user is authenticated
export async function isAuthenticated(): Promise<boolean> {
  const { data: { session } } = await supabase.auth.getSession()
  return !!session
}

// Function to update user profile
export async function updateUserProfile(userId: string, updates: Partial<User>) {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()
    
  if (error) {
    throw new Error(error.message)
  }
  
  return data as User
}

// Password reset functionality
export async function resetPassword(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  })
  
  if (error) {
    throw new Error(error.message)
  }
  
  return true
}

// Update password
export async function updatePassword(newPassword: string) {
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  })
  
  if (error) {
    throw new Error(error.message)
  }
  
  return true
}
