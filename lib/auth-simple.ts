import { supabase } from './supabase';

// Simple authentication service with robust error handling
export async function signIn(email: string, password: string) {
  try {
    console.log('Simple Auth: Signing in with:', email);
    
    // Check if supabase is properly initialized
    if (!supabase) {
      console.error('Simple Auth: Supabase client is not initialized');
      throw new Error('Authentication service is not available');
    }
    
    console.log('Simple Auth: Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
    
    // Try to sign in with a timeout to handle potential API issues
    const signInPromise = supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    const timeoutPromise = new Promise<{data: null, error: Error}>((_, reject) => 
      setTimeout(() => reject(new Error('Sign in timed out')), 10000)
    );
    
    // Use Promise.race with proper typing
    const result = await Promise.race([signInPromise, timeoutPromise]);
    const { data, error } = result;
    
    if (error) {
      console.error('Simple Auth: Sign in error:', error);
      throw new Error(error.message);
    }
    
    if (!data) {
      console.error('Simple Auth: No data returned from sign in');
      throw new Error('Failed to sign in');
    }
    
    console.log('Simple Auth: Sign in successful', data);
    return data;
  } catch (error) {
    console.error('Simple Auth: Unexpected error during sign in:', error);
    throw error;
  }
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('Simple Auth: Sign out error:', error);
      throw new Error(error.message);
    }
    
    return true;
  } catch (error) {
    console.error('Simple Auth: Unexpected error during sign out:', error);
    throw error;
  }
}

export async function getSession() {
  try {
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Simple Auth: Get session error:', error);
      return null;
    }
    
    return data.session;
  } catch (error) {
    console.error('Simple Auth: Unexpected error getting session:', error);
    return null;
  }
}

export async function getUser() {
  try {
    const { data, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error('Simple Auth: Get user error:', error);
      return null;
    }
    
    if (!data.user) {
      console.log('Simple Auth: No user found');
      return null;
    }
    
    return {
      id: data.user.id,
      email: data.user.email,
      role: data.user.user_metadata?.role || 'teacher',
      name: data.user.user_metadata?.full_name || data.user.email?.split('@')[0] || 'User',
    };
  } catch (error) {
    console.error('Simple Auth: Unexpected error getting user:', error);
    return null;
  }
}
