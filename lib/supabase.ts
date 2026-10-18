import { createClient } from '@supabase/supabase-js';

const isValidHttpUrl = (url?: string): boolean => {
  if (!url) return false;
  const cleaned = url.trim().replace(/^["']|["']$/g, '');
  return cleaned.startsWith('http://') || cleaned.startsWith('https://');
};

const defaultSupabaseUrl = 'https://eqikssvbkpdtvvvhluts.supabase.co';
const defaultAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVxaWtzc3Zia3BkdHZ2dmhsdXRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIzMDQ0MjIsImV4cCI6MjEwNzg4MDQyMn0.lTYjgiREGr87XeCEl_wk2kFDheRIn20gZ46D09XRbE0';

const supabaseUrl = isValidHttpUrl(process.env.NEXT_PUBLIC_SUPABASE_URL)
  ? (process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim().replace(/^["']|["']$/g, '')
  : defaultSupabaseUrl;

const supabaseAnonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || defaultAnonKey).trim().replace(/^["']|["']$/g, '');

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});
