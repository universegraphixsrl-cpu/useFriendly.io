import { useMemo } from 'react';
import { supabase, supabaseConfigured, type Profile, type Role } from './supabase';
import { useAuth } from '../contexts/AuthContext';
import {
  subAccounts as demoSubAccounts,
  subAccountsTotal as demoTotal,
  type SubAccountRole } from
'../data/subAccounts';
import {
  callerNames as demoCallerNames,
  leadOwners as demoLeadOwners,
  UNASSIGNED } from
'../data/leads';

/**
 * Echipa reală: oamenii care chiar au cont în acest CRM.
 *
 * Restul aplicației se aștepta la lista fixă din `data/subAccounts`
 * (Closers, Callers, Managers, Marketers, cu nume scrise în cod).
 * Aici construim exact aceeași formă, dar din conturile adevărate —
 * așa paginile existente merg neschimbate, doar că afișează oameni
 * care există.
 */

/** Numele rolului așa cum apare în interfață */
const GROUP_OF: Record<Role, SubAccountRole['role']> = {
  admin: 'Managers',
  manager: 'Managers',
  closer: 'Closers',
  caller: 'Callers',
  marketer: 'Marketers'
};

const GROUP_COLOR: Record<SubAccountRole['role'], string> = {
  Closers: '#2f6bff',
  Callers: '#f97316',
  Managers: '#10b981',
  Marketers: '#eab308'
};

const GROUP_ORDER: SubAccountRole['role'][] = [
'Closers',
'Callers',
'Managers',
'Marketers'];


export function groupsFromProfiles(profiles: Profile[]): SubAccountRole[] {
  return GROUP_ORDER.map((group) => ({
    role: group,
    color: GROUP_COLOR[group],
    members: profiles.
    filter((person) => GROUP_OF[person.role] === group).
    map((person) => person.full_name)
  })).filter((group) => group.members.length > 0);
}

/**
 * Lista echipei, în forma pe care o așteaptă paginile.
 * Fără bază de date (lucru local) rămâne lista de exemplu.
 */
export function useTeam() {
  const { teamMembers } = useAuth();

  return useMemo(() => {
    if (!supabaseConfigured) {
      return {
        groups: demoSubAccounts,
        total: demoTotal,
        names: demoSubAccounts.flatMap((group) => group.members),
        profiles: [] as Profile[]
      };
    }

    const groups = groupsFromProfiles(teamMembers);
    return {
      groups,
      total: teamMembers.length,
      names: teamMembers.map((person) => person.full_name),
      profiles: teamMembers
    };
  }, [teamMembers]);
}

/** Rolul unui om, după nume — varianta care lucrează pe echipa reală */
export function roleOfIn(groups: SubAccountRole[], name: string) {
  const group = groups.find((item) => item.members.includes(name));
  if (!group) return 'Sub-account';
  return {
    Closers: 'Closer',
    Callers: 'Caller',
    Managers: 'Manager',
    Marketers: 'Marketer'
  }[group.role];
}

/**
 * Numele callerilor reali — pentru rapoartele și selectoarele lor.
 * Fără bază de date rămâne lista de exemplu, ca să poți lucra local.
 */
export function callerNamesIn(groups: SubAccountRole[]) {
  if (!supabaseConfigured) return demoCallerNames;
  return groups.find((item) => item.role === 'Callers')?.members ?? [];
}

/**
 * Cine poate fi responsabil de un lead: toți oamenii cu cont, plus
 * „Neatribuit”. Înainte era o listă scrisă în cod — de aceea apăreau
 * nume inventate în selectoare.
 */
export function ownerNamesIn(groups: SubAccountRole[]) {
  if (!supabaseConfigured) return demoLeadOwners;
  return [UNASSIGNED, ...groups.flatMap((group) => group.members)];
}

/** Culoarea rolului, pentru buline și accente */
export function roleColorIn(groups: SubAccountRole[], name: string) {
  return (
    groups.find((item) => item.members.includes(name))?.color ?? '#64748b');

}

/** Trimite o invitație prin funcția care rulează pe server */
export async function inviteMember(input: {
  email: string;
  fullName: string;
  role: Role;
}): Promise<string | null> {
  if (!supabaseConfigured) {
    return 'Invitațiile funcționează doar cu baza de date conectată.';
  }

  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return 'Sesiune expirată. Intră din nou în cont.';

  const { data, error } = await supabase.functions.invoke('invite-member', {
    body: {
      email: input.email,
      fullName: input.fullName,
      role: input.role,
      redirectTo: `${window.location.origin}/login`
    }
  });

  if (error) {
    // Mesajul util vine din corpul răspunsului, nu din eroarea generică.
    try {
      const details = await (error as any).context?.json?.();
      if (details?.error) return details.error as string;
    } catch {
      // mergem pe mesajul generic
    }
    return error.message;
  }
  if (data && (data as any).error) return (data as any).error as string;
  return null;
}
