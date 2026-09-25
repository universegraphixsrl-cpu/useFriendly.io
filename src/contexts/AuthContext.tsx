import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState } from
'react';
import type { Session } from '@supabase/supabase-js';
import {
  supabase,
  supabaseConfigured,
  type Profile } from
'../lib/supabase';

interface AuthValue {
  /** null cât timp încă verificăm sesiunea */
  loading: boolean;
  session: Session | null;
  profile: Profile | null;
  /** true dacă proiectul nu are chei Supabase — rulăm pe date fictive */
  demoMode: boolean;
  /** Toți oamenii cu cont în acest CRM (pentru atribuiri și numărători) */
  teamMembers: Profile[];
  signIn: (email: string, password: string) => Promise<string | null>;
  signOut: () => Promise<void>;
  /** Trimite pe email un link de resetare a parolei */
  resetPassword: (email: string) => Promise<string | null>;
  /** Autentificare cu Google (trebuie activată în Supabase → Authentication → Providers) */
  signInWithGoogle: () => Promise<string | null>;
  /** Cont nou. Folosit doar când înregistrarea publică e deschisă. */
  signUp: (input: {
    email: string;
    password: string;
    fullName: string;
    plan: string;
    seats: number;
  }) => Promise<string | null>;
}

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: {children: React.ReactNode;}) {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [teamMembers, setTeamMembers] = useState<Profile[]>([]);

  useEffect(() => {
    if (!supabaseConfigured) {
      setLoading(false);
      return;
    }

    let active = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setSession(data.session);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, next) => {
        setSession(next);
      }
    );

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  /** Profilul (nume + rol) se încarcă de fiecare dată când se schimbă sesiunea */
  useEffect(() => {
    if (!session?.user) {
      setProfile(null);
      return;
    }

    let active = true;

    supabase.
    from('profiles').
    select('id, full_name, role, color').
    eq('id', session.user.id).
    maybeSingle().
    then(({ data, error }) => {
      if (!active) return;
      if (error) {
        console.error('[Supabase] Nu am putut citi profilul:', error.message);
        setProfile(null);
        return;
      }
      setProfile(data as Profile | null);
    });

    return () => {
      active = false;
    };
  }, [session?.user?.id]);

  /** Lista echipei: toți cei cu profil în acest CRM */
  useEffect(() => {
    if (!session?.user) {
      setTeamMembers([]);
      return;
    }

    let active = true;

    supabase.
    from('profiles').
    select('id, full_name, role, color').
    order('full_name', { ascending: true }).
    then(({ data, error: loadError }) => {
      if (!active) return;
      if (loadError) {
        console.error('[Supabase] Nu am putut citi echipa:', loadError.message);
        return;
      }
      setTeamMembers((data ?? []) as Profile[]);
    });

    return () => {
      active = false;
    };
  }, [session?.user?.id]);

  const value = useMemo<AuthValue>(
    () => ({
      loading,
      session,
      profile,
      demoMode: !supabaseConfigured,
      teamMembers,
      signIn: async (email, password) => {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password
        });
        if (!error) return null;
        if (error.message.toLowerCase().includes('invalid login')) {
          return 'Email sau parolă greșită.';
        }
        if (error.message.toLowerCase().includes('email not confirmed')) {
          return 'Contul nu e confirmat încă. Verifică emailul de confirmare.';
        }
        return error.message;
      },
      signOut: async () => {
        await supabase.auth.signOut();
        setProfile(null);
      },
      resetPassword: async (email) => {
        const { error } = await supabase.auth.resetPasswordForEmail(
          email.trim(),
          { redirectTo: `${window.location.origin}/login` }
        );
        return error ? error.message : null;
      },
      signInWithGoogle: async () => {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: { redirectTo: window.location.origin }
        });
        if (!error) return null;
        if (error.message.toLowerCase().includes('provider is not enabled')) {
          return 'Autentificarea cu Google nu e activată încă în Supabase.';
        }
        return error.message;
      },
      signUp: async ({ email, password, fullName, plan, seats }) => {
        const { error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            // Trigger-ul din baza de date citește `full_name` și `role`
            // când creează profilul.
            data: { full_name: fullName, role: 'admin', plan, seats }
          }
        });
        if (!error) return null;
        if (error.message.toLowerCase().includes('already registered')) {
          return 'Există deja un cont cu acest email.';
        }
        return error.message;
      }
    }),
    [loading, session, profile, teamMembers]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error('useAuth trebuie folosit în AuthProvider');
  }
  return value;
}
