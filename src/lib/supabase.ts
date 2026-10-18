import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Environment variables
const envUrl = import.meta.env.VITE_SUPABASE_URL;
const envAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check localStorage for runtime override
const storedUrl = typeof window !== 'undefined' ? localStorage.getItem('greencred_supabase_url') : null;
const storedKey = typeof window !== 'undefined' ? localStorage.getItem('greencred_supabase_key') : null;

export const supabaseUrl = (storedUrl || envUrl || '').trim();
export const supabaseAnonKey = (storedKey || envAnonKey || '').trim();

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith('http') &&
  !supabaseUrl.includes('your-project-ref') &&
  !supabaseAnonKey.includes('your-anon-key-here')
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;

/**
 * Update runtime Supabase credentials without rebuilding
 */
export function setRuntimeSupabaseConfig(url: string, anonKey: string) {
  if (url && anonKey) {
    localStorage.setItem('greencred_supabase_url', url.trim());
    localStorage.setItem('greencred_supabase_key', anonKey.trim());
    window.location.reload();
  }
}

export function clearRuntimeSupabaseConfig() {
  localStorage.removeItem('greencred_supabase_url');
  localStorage.removeItem('greencred_supabase_key');
  window.location.reload();
}
