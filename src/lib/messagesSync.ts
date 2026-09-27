import { useEffect, useRef, useState } from 'react';
import { supabase, supabaseConfigured } from './supabase';
import type { TeamMessage } from '../data/notifications';

/**
 * Mesajele dintre oamenii din echipă.
 *
 * Până acum trăiau doar în memoria browserului: le scriai, dădeai
 * refresh, dispăreau — și, mai rău, nu ajungeau niciodată la
 * destinatar, pentru că fiecare avea propria copie în capul lui.
 *
 * Aici se salvează, iar „citit” e o listă de nume pe mesaj, ca în
 * restul aplicației.
 */

type SyncStatus = 'idle' | 'loading' | 'ready' | 'error';

interface MessageRow {
  id: string;
  sender: string;
  recipients: string[];
  body: string;
  sent_label: string;
  read_by: string[];
}

function toRow(message: TeamMessage): MessageRow {
  return {
    id: message.id,
    sender: message.from ?? '',
    recipients: message.to ?? [],
    body: message.text ?? '',
    sent_label: message.time ?? '',
    read_by: message.readBy ?? []
  };
}

function fromRow(row: any): TeamMessage {
  return {
    id: row.id,
    from: row.sender ?? '',
    to: Array.isArray(row.recipients) ? row.recipients : [],
    text: row.body ?? '',
    time: row.sent_label ?? '',
    readBy: Array.isArray(row.read_by) ? row.read_by : []
  };
}

const fingerprint = (value: unknown) => JSON.stringify(value);

export function useMessagesSync(options: {
  enabled: boolean;
  messages: TeamMessage[];
  setMessages: React.Dispatch<React.SetStateAction<TeamMessage[]>>;
}) {
  const { enabled, messages, setMessages } = options;
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
      from('team_messages').
      select('*').
      order('created_at', { ascending: false });

      if (!active) return;

      if (loadError) {
        console.error(
          '[Supabase] Încărcarea mesajelor a eșuat:',
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
      setMessages(next);
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
  }, [messages, status]);

  async function pushChanges() {
    const rows = messages.map(toRow);
    const changed = rows.filter(
      (row) => saved.current.get(row.id) !== fingerprint(row)
    );

    if (changed.length) {
      for (let start = 0; start < changed.length; start += 200) {
        const { error: saveError } = await supabase.
        from('team_messages').
        upsert(changed.slice(start, start + 200));
        if (saveError) {
          console.error(
            '[Supabase] Salvarea mesajelor a eșuat:',
            saveError.message
          );
          setError(saveError.message);
          return;
        }
      }
    }

    saved.current = new Map(rows.map((row) => [row.id, fingerprint(row)]));
    setError(null);
  }

  return { status, error };
}
