import { supabase } from './supabase'

// Define a more flexible user type that works with both auth and profiles
export interface AuthUser {
  id: string;
  email?: string;
  name?: string;
  full_name?: string;
  role?: 'teacher' | 'student' | 'admin';
  created_at?: string;
  avatar_url?: string;
  user_metadata?: any;
}

// Authentication functions
export async function signIn(email: string, password: string) {
  console.log('Signing in with:', email);
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  
  if (error) {
    console.error('Sign in error:', error);
    throw new Error(error.message)
  }
  
  console.log('Sign in successful:', data);
  return data
}

export async function signUp(email: string, password: string, userData: any) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: userData,
      emailRedirectTo: `${window.location.origin}/auth/callback`,
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

export async function getCurrentUser(): Promise<AuthUser | null> {
  console.log('Getting current user...');
  
  try {
    // First, get the current authenticated user from Supabase Auth
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error('Error getting auth user:', userError);
      return null;
    }
    
    if (!user) {
      console.log('No authenticated user found');
      return null;
    }
    
    console.log('Auth user found:', user.id);
    
    // Skip profile lookup and just use the auth user data
    // This avoids the issue with the profiles table that might not exist
    return {
      id: user.id,
      email: user.email,
      name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
      role: (user.user_metadata?.role || 'teacher') as 'teacher' | 'student' | 'admin',
      created_at: user.created_at,
      user_metadata: user.user_metadata
    };
  } catch (error) {
    console.error('Error in getCurrentUser:', error);
    return null;
  }
}

export async function getUserRole(): Promise<'teacher' | 'student' | 'admin' | null> {
  const user = await getCurrentUser();
  return user?.role || null;
}

// Function to check if user is authenticated
export async function isAuthenticated(): Promise<boolean> {
  const { data: { session } } = await supabase.auth.getSession();
  return !!session;
}

// Function to update user profile
export async function updateUserProfile(userId: string, updates: Partial<AuthUser>) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();
    
  if (error) {
    throw new Error(error.message);
  }
  
  return data as AuthUser;
}

// Password reset functionality
export async function resetPassword(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });
  
  if (error) {
    throw new Error(error.message);
  }
  
  return true;
}

// Update password
export async function updatePassword(newPassword: string) {
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });
  
  if (error) {
    throw new Error(error.message);
  }
  
  return true;
}
