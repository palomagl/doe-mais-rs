import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Reads config from Vite env vars, falling back to the values that are
// currently deployed so existing environments keep working unchanged.
// Set VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY in `.env` (local)
// and in the Vercel project settings (production).
const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL ?? "https://ejlsbejjifbcyastjoil.supabase.co";
const SUPABASE_PUBLISHABLE_KEY =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ??
  "sb_publishable_jEq0Qhvol34PK2pXYGsbMQ_-oQ_I-yv";

if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
  throw new Error(
    "Supabase config ausente: defina VITE_SUPABASE_URL e VITE_SUPABASE_PUBLISHABLE_KEY.",
  );
}

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});
