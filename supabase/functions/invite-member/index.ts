// ============================================================
// invite-member — trimite o invitație de intrare în CRM
//
// De ce există: a crea un cont nou cere cheia `service_role`, care are
// drepturi depline peste baza de date. Cheia aia nu are voie să ajungă
// niciodată în browser — cine o are poate citi și șterge orice. Așa că
// stă aici, pe serverele Supabase, iar pagina doar cere politicos.
//
// Ce face:
//   1. verifică cine cere (din tokenul lui de autentificare)
//   2. verifică în baza de date că are rolul admin sau manager
//   3. abia apoi trimite invitația pe email
//
// Pasul 2 e esențial: fără el, orice utilizator logat — inclusiv un
// caller — ar putea invita pe cine vrea, cu ce rol vrea.
// ============================================================

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const ROLES = ['admin', 'manager', 'closer', 'caller', 'marketer'];

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

function reply(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS, 'Content-Type': 'application/json' }
  });
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });
  if (req.method !== 'POST') return reply({ error: 'Metodă nepermisă' }, 405);

  const url = Deno.env.get('SUPABASE_URL')!;
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

  // --- 1. Cine cere? ---
  const authHeader = req.headers.get('Authorization') ?? '';
  if (!authHeader) return reply({ error: 'Lipsește autentificarea.' }, 401);

  const asCaller = createClient(url, anonKey, {
    global: { headers: { Authorization: authHeader } }
  });

  const { data: { user }, error: userError } = await asCaller.auth.getUser();
  if (userError || !user) {
    return reply({ error: 'Sesiune invalidă.' }, 401);
  }

  // --- 2. Are voie? ---
  const asAdmin = createClient(url, serviceKey);

  const { data: profile, error: profileError } = await asAdmin.
  from('profiles').
  select('role, full_name').
  eq('id', user.id).
  maybeSingle();

  if (profileError) {
    return reply({ error: 'Nu am putut verifica drepturile.' }, 500);
  }
  if (!profile || (profile.role !== 'admin' && profile.role !== 'manager')) {
    return reply(
      { error: 'Doar un administrator sau manager poate invita membri.' },
      403
    );
  }

  // --- 3. Ce se cere? ---
  let body: { email?: string; fullName?: string; role?: string; redirectTo?: string };
  try {
    body = await req.json();
  } catch {
    return reply({ error: 'Cerere invalidă.' }, 400);
  }

  const email = (body.email ?? '').trim().toLowerCase();
  const fullName = (body.fullName ?? '').trim();
  const role = (body.role ?? 'caller').trim();

  if (!email || !email.includes('@')) {
    return reply({ error: 'Adresa de email nu e validă.' }, 400);
  }
  if (!fullName) {
    return reply({ error: 'Numele e obligatoriu.' }, 400);
  }
  if (!ROLES.includes(role)) {
    return reply({ error: `Rol necunoscut: ${role}` }, 400);
  }
  // Un manager nu poate face pe altcineva administrator.
  if (profile.role === 'manager' && role === 'admin') {
    return reply(
      { error: 'Doar un administrator poate numi un alt administrator.' },
      403
    );
  }

  // --- 4. Trimite invitația ---
  const { data, error: inviteError } = await asAdmin.auth.admin.inviteUserByEmail(
    email,
    {
      data: { full_name: fullName, role },
      redirectTo: body.redirectTo
    }
  );

  if (inviteError) {
    const message = inviteError.message.toLowerCase();
    if (message.includes('already') || message.includes('registered')) {
      return reply({ error: 'Există deja un cont cu acest email.' }, 409);
    }
    return reply({ error: inviteError.message }, 400);
  }

  // Trigger-ul din baza de date creează profilul, dar ne asigurăm că
  // numele și rolul sunt exact cele cerute.
  if (data.user) {
    await asAdmin.
    from('profiles').
    upsert({ id: data.user.id, full_name: fullName, role });
  }

  return reply({
    ok: true,
    invited: { email, fullName, role },
    invitedBy: profile.full_name
  });
});
