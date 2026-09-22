import { createClient } from '@supabase/supabase-js';

/**
 * Conexiunea către Supabase.
 *
 * Valorile vin din fișierul .env.local (local) și din Environment Variables
 * din Vercel (pe site-ul live). Cheia "anon" este publică prin design — ea
 * ajunge oricum în browserul fiecărui vizitator. Ce protejează datele sunt
 * politicile RLS din supabase/01_schema.sql, nu secretul cheii.
 *
 * NICIODATĂ nu pune aici cheia "service_role" și nici vreo cheie de API
 * plătită (Anthropic, OpenAI, SendGrid). Acelea trebuie să stea pe server.
 */

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

/** false = aplicația rulează pe datele fictive, fără bază de date */
export const supabaseConfigured = Boolean(url && anonKey);

if (!supabaseConfigured) {
  console.warn(
    '[Supabase] Lipsesc VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY. ' +
      'Aplicația pornește pe datele fictive, fără salvare.'
  );
}

export const supabase = createClient(
  url ?? 'https://placeholder.supabase.co',
  anonKey ?? 'placeholder-anon-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true
    }
  }
);

export type Role = 'admin' | 'manager' | 'closer' | 'caller' | 'marketer';

export interface Profile {
  id: string;
  full_name: string;
  role: Role;
  color: string | null;
}

/** Admin și manager văd toate leadurile; restul doar pe ale lor. */
export function isStaff(profile: Profile | null) {
  return profile?.role === 'admin' || profile?.role === 'manager';
}
