import { createServerClient as createClient } from '@supabase/ssr';
import type { Database } from '@/types/supabase';
import { type ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies';

// Create a server-side supabase client
export async function createServerSupabaseClient() {
  const { cookies } = await import('next/headers');
  const cookieStore = cookies();
  
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          cookieStore.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: any) {
          cookieStore.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );
}

export async function getServerUser() {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase.auth.getUser();

    if (error || !data.user) {
      return null;
    }

    return data.user;
  } catch (error) {
    console.error('Error getting server user:', error);
    return null;
  }
}

export async function getServerSession() {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase.auth.getSession();

    if (error || !data.session) {
      return null;
    }

    return data.session;
  } catch (error) {
    console.error('Error getting server session:', error);
    return null;
  }
}
