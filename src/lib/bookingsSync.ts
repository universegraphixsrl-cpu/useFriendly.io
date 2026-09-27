import { useEffect, useRef, useState } from 'react';
import { supabase, supabaseConfigured } from './supabase';
import type { Booking } from '../data/bookings';

/**
 * Rezervările din calendarele de programare, salvate în baza de date.
 *
 * Spre deosebire de pagini sau funnel-uri, rezervările chiar se caută
 * și se numără („ce am săptămâna asta”, „câte a ținut Ana”), deci stau
 * într-un tabel normal, cu data pe o coloană de tip dată.
 */

type SyncStatus = 'idle' | 'loading' | 'ready' | 'error';

interface BookingRow {
  id: string;
  calendar_id: string;
  owner: string;
  lead_name: string;
  phone: string;
  email: string;
  booking_date: string | null;
  booking_time: string;
  fields: {label: string;value: string;}[];
}

function toRow(booking: Booking): BookingRow {
  return {
    id: booking.id,
    calendar_id: booking.calendarId,
    owner: booking.owner ?? '',
    lead_name: booking.leadName ?? '',
    phone: booking.phone ?? '',
    email: booking.email ?? '',
    // Coloana e de tip dată: un text gol ar fi respins de Postgres
    booking_date: booking.date ? booking.date : null,
    booking_time: booking.time ?? '',
    fields: booking.fields ?? []
  };
}

function fromRow(row: any): Booking {
  return {
    id: row.id,
    calendarId: row.calendar_id ?? '',
    owner: row.owner ?? '',
    leadName: row.lead_name ?? '',
    phone: row.phone ?? '',
    email: row.email ?? '',
    date: row.booking_date ?? '',
    time: row.booking_time ?? '',
    fields: Array.isArray(row.fields) ? row.fields : []
  };
}

const fingerprint = (value: unknown) => JSON.stringify(value);

export function useBookingsSync(options: {
  enabled: boolean;
  bookings: Booking[];
  setBookings: React.Dispatch<React.SetStateAction<Booking[]>>;
}) {
  const { enabled, bookings, setBookings } = options;
  const [status, setStatus] = useState<SyncStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  const saved = useRef(new Map<string, string>());
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!enabled || !supabaseConfigured) return;

    let active = true;
    setStatus('loading');

    (async () => {
      const { data, error: loadError } = await supabase.
      from('bookings').
      select('*').
      order('booking_date', { ascending: true });

      if (!active) return;

      if (loadError) {
        console.error(
          '[Supabase] Încărcarea rezervărilor a eșuat:',
          loadError.message
        );
        setError(loadError.message);
        setStatus('error');
        return;
      }

      const next = (data ?? []).map(fromRow);
      saved.current = new Map(
        next.map((item) => [item.id, fingerprint(toRow(item))])
      );
      setBookings(next);
      setStatus('ready');
    })();

    return () => {
      active = false;
    };
  }, [enabled]);

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
  }, [bookings, status]);

  async function pushChanges() {
    const rows = bookings.map(toRow);
    const changed = rows.filter(
      (row) => saved.current.get(row.id) !== fingerprint(row)
    );
    const removed = [...saved.current.keys()].filter(
      (id) => !rows.some((row) => row.id === id)
    );

    if (changed.length) {
      for (let start = 0; start < changed.length; start += 200) {
        const { error: saveError } = await supabase.
        from('bookings').
        upsert(changed.slice(start, start + 200));
        if (saveError) {
          console.error(
            '[Supabase] Salvarea rezervărilor a eșuat:',
            saveError.message
          );
          setError(saveError.message);
          return;
        }
      }
    }

    if (removed.length) {
      await supabase.from('bookings').delete().in('id', removed);
    }

    saved.current = new Map(rows.map((row) => [row.id, fingerprint(row)]));
    setError(null);
  }

  return { status, error };
}
