import { supabaseClient } from './supabase-client';

export interface User {
  id: string;
  email?: string;
  role?: 'teacher' | 'student' | 'admin';
  name?: string;
}

// Sign in with email and password
export async function signIn(email: string, password: string) {
  try {
    console.log('Auth: Attempting to sign in with', email);
    
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.error('Auth: Sign in error:', error);
      throw error;
    }
    
    console.log('Auth: Sign in successful', data);
    return data;
  } catch (error) {
    console.error('Auth: Error during sign in:', error);
    throw error;
  }
}

// Get the current user
export async function getUser(): Promise<User | null> {
  try {
    const { data: { session }, error } = await supabaseClient.auth.getSession();
    
    if (error || !session) {
      console.log('Auth: No active session or error getting session', error);
      return null;
    }
    
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    
    if (userError || !user) {
      console.log('Auth: Error getting user or no user found', userError);
      return null;
    }
    
    console.log('Auth: User found', user.id);
    
    return {
      id: user.id,
      email: user.email,
      role: (user.user_metadata?.role || 'teacher') as 'teacher' | 'student' | 'admin',
      name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
    };
  } catch (error) {
    console.error('Auth: Error getting user:', error);
    return null;
  }
}

// Sign out
export async function signOut() {
  try {
    const { error } = await supabaseClient.auth.signOut();
    
    if (error) {
      console.error('Auth: Sign out error:', error);
      throw error;
    }
    
    console.log('Auth: Sign out successful');
    return true;
  } catch (error) {
    console.error('Auth: Error during sign out:', error);
    throw error;
  }
}

// Sign up with email and password
export async function signUp(email: string, password: string, userData: any) {
  try {
    console.log('Auth: Attempting to sign up with', email);
    
    const { data, error } = await supabaseClient.auth.signUp({
      email,
      password,
      options: {
        data: userData,
      },
    });
    
    if (error) {
      console.error('Auth: Sign up error:', error);
      throw error;
    }
    
    console.log('Auth: Sign up successful', data);
    return data;
  } catch (error) {
    console.error('Auth: Error during sign up:', error);
    throw error;
  }
}
