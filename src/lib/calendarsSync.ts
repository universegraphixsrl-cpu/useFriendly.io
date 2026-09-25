import { useEffect, useRef, useState } from 'react';
import { supabase, supabaseConfigured } from './supabase';
import type { BookingCalendar, CalendarMember } from '../data/calendars';

/**
 * Calendarele de programări și membrii lor, legate de baza de date.
 * Același tipar ca la leaduri și task-uri.
 */

type SyncStatus = 'idle' | 'loading' | 'ready' | 'error';

interface CalendarRow {
  id: string;
  name: string;
  purpose: string;
  duration: number;
  location: string;
  type: string;
  days: string;
  color: string;
  active: boolean;
  host: string;
  initials: string;
  owner: string;
  position: number;
}

function toCalendarRow(
calendar: BookingCalendar,
position: number)
: CalendarRow {
  return {
    id: calendar.id,
    name: calendar.name ?? '',
    purpose: calendar.purpose ?? '',
    duration: Number(calendar.duration) || 30,
    location: calendar.location ?? '',
    type: calendar.type,
    days: calendar.days ?? '',
    color: calendar.color ?? '#2f6bff',
    active: Boolean(calendar.active),
    host: calendar.host ?? '',
    initials: calendar.initials ?? '',
    owner: calendar.owner ?? '',
    position
  };
}

const fingerprint = (value: unknown) => JSON.stringify(value);

export function useCalendarsSync(options: {
  enabled: boolean;
  calendars: BookingCalendar[];
  setCalendars: React.Dispatch<React.SetStateAction<BookingCalendar[]>>;
}) {
  const { enabled, calendars, setCalendars } = options;
  const [status, setStatus] = useState<SyncStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  const savedCalendars = useRef(new Map<string, string>());
  const savedMembers = useRef(new Map<string, string>());
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ---------- încărcarea inițială ----------
  useEffect(() => {
    if (!enabled || !supabaseConfigured) return;

    let active = true;
    setStatus('loading');

    (async () => {
      const [calendarsResult, membersResult] = await Promise.all([
      supabase.
      from('booking_calendars').
      select('*').
      order('position', { ascending: true }),
      supabase.from('calendar_members').select('*')]
      );

      if (!active) return;

      const failure = calendarsResult.error ?? membersResult.error;
      if (failure) {
        console.error('[Supabase] Încărcarea calendarelor a eșuat:', failure.message);
        setError(failure.message);
        setStatus('error');
        return;
      }

      const membersByCalendar = new Map<string, CalendarMember[]>();
      (membersResult.data ?? []).forEach((row: any) => {
        const bucket = membersByCalendar.get(row.calendar_id) ?? [];
        bucket.push({
          name: row.name,
          role: row.role ?? '',
          connected: Boolean(row.connected)
        });
        membersByCalendar.set(row.calendar_id, bucket);
      });

      const nextCalendars: BookingCalendar[] = (calendarsResult.data ?? []).map(
        (row: any) => ({
          id: row.id,
          name: row.name ?? '',
          purpose: row.purpose ?? '',
          duration: Number(row.duration) || 30,
          location: row.location ?? '',
          type: row.type,
          days: row.days ?? '',
          color: row.color ?? '#2f6bff',
          active: Boolean(row.active),
          host: row.host ?? '',
          initials: row.initials ?? '',
          members: membersByCalendar.get(row.id) ?? undefined,
          owner: row.owner || undefined
        })
      );

      savedCalendars.current = new Map(
        nextCalendars.map((item, index) => [
        item.id,
        fingerprint(toCalendarRow(item, index))]
        )
      );
      savedMembers.current = new Map(
        nextCalendars.flatMap((calendar) =>
        (calendar.members ?? []).map((member) => [
        `${calendar.id}|${member.name}`,
        fingerprint(member)]
        )
        )
      );

      setCalendars(nextCalendars);
      setStatus('ready');
    })();

    return () => {
      active = false;
    };
  }, [enabled]);

  // ---------- salvarea modificărilor ----------
  useEffect(() => {
    if (status !== 'ready') return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      void pushChanges();
    }, 600);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [calendars, status]);

  async function pushChanges() {
    const calendarRows = calendars.map((item, index) =>
    toCalendarRow(item, index)
    );
    const changedCalendars = calendarRows.filter(
      (row) => savedCalendars.current.get(row.id) !== fingerprint(row)
    );
    const removedCalendarIds = [...savedCalendars.current.keys()].filter(
      (id) => !calendarRows.some((row) => row.id === id)
    );

    if (changedCalendars.length) {
      const { error: calendarError } = await supabase.
      from('booking_calendars').
      upsert(changedCalendars);
      if (calendarError) {
        console.error('[Supabase] Salvarea calendarelor a eșuat:', calendarError.message);
        setError(calendarError.message);
        return;
      }
    }
    if (removedCalendarIds.length) {
      await supabase.
      from('booking_calendars').
      delete().
      in('id', removedCalendarIds);
    }

    // --- membrii ---
    const memberRows = calendars.flatMap((calendar) =>
    (calendar.members ?? []).map((member) => ({
      calendar_id: calendar.id,
      name: member.name,
      role: member.role ?? '',
      connected: Boolean(member.connected)
    }))
    );
    const currentMemberKeys = new Set(
      memberRows.map((row) => `${row.calendar_id}|${row.name}`)
    );
    const changedMembers = memberRows.filter((row) => {
      const key = `${row.calendar_id}|${row.name}`;
      return (
        savedMembers.current.get(key) !==
        fingerprint({
          name: row.name,
          role: row.role,
          connected: row.connected
        }));

    });
    if (changedMembers.length) {
      await supabase.from('calendar_members').upsert(changedMembers);
    }

    const removedMembers = [...savedMembers.current.keys()].filter(
      (key) => !currentMemberKeys.has(key)
    );
    for (const key of removedMembers) {
      const [calendarId, name] = key.split('|');
      if (calendarRows.some((row) => row.id === calendarId)) {
        await supabase.
        from('calendar_members').
        delete().
        eq('calendar_id', calendarId).
        eq('name', name);
      }
    }

    savedCalendars.current = new Map(
      calendarRows.map((row) => [row.id, fingerprint(row)])
    );
    savedMembers.current = new Map(
      memberRows.map((row) => [
      `${row.calendar_id}|${row.name}`,
      fingerprint({
        name: row.name,
        role: row.role,
        connected: row.connected
      })]
      )
    );
    setError(null);
  }

  return { status, error };
}
