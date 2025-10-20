import { createServerClient as createSupabaseClient } from '@supabase/ssr';
import type { Database } from '@/types/supabase';
import type { CookieOptions } from '@supabase/ssr';

// Create a server-side supabase client
export async function createServerSupabaseClient() {
  const { cookies } = await import('next/headers');
  const cookieStore = cookies();
  
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
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

// Export aliases for backwards compatibility
export const createClient = createServerSupabaseClient;
export const createServerClient = createServerSupabaseClient;
