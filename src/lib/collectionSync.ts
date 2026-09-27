import { useEffect, useRef, useState } from 'react';
import { supabase, supabaseConfigured } from './supabase';

/**
 * Salvarea modulelor care se editează ca niște documente: pagini din
 * web builder, funnel-uri, fluxuri de email, produse, linkuri de
 * plată, automatizări, cursuri.
 *
 * De ce o singură funcție pentru toate: sunt șapte module diferite,
 * dar problema e aceeași — „am o listă de obiecte cu id, ține-mi-o
 * minte”. Un singur cod, scris și verificat o dată, în loc de șapte
 * variante aproape la fel în care se strecoară șapte feluri de
 * greșeli.
 *
 * Fiecare obiect se salvează întreg, așa cum îl folosește aplicația.
 * O pagină de web builder are secțiuni, care au row-uri, care au
 * elemente cu zeci de setări de stil — nu are rost spart în tabele,
 * pentru că nimeni nu caută vreodată „toate butoanele roșii”.
 *
 * Mod de folosire, în pagina respectivă:
 *
 *   const [pages, setPages] = useState<WebPage[]>(startWith(webPages));
 *   useCollectionSync('web_page', pages, setPages);
 */

type SyncStatus = 'idle' | 'loading' | 'ready' | 'error';

/** Tipurile de documente păstrate în tabelul `collections` */
export type CollectionKind =
'web_page' |
'funnel' |
'marketing_flow' |
'product' |
'payment_link' |
'automation' |
'course';

interface Identified {
  id: string;
}

const fingerprint = (value: unknown) => JSON.stringify(value);

/**
 * Cu ce pornește o listă înainte să se încarce din baza de date.
 * Cu Supabase conectat: gol, ca un cont nou să fie într-adevăr gol.
 * Fără Supabase (lucru local pe design): datele fictive de exemplu.
 */
export function startWith<T>(demo: T[]): T[] {
  return supabaseConfigured ? [] : demo;
}

export function useCollectionSync<T extends Identified>(
kind: CollectionKind,
items: T[],
setItems: React.Dispatch<React.SetStateAction<T[]>>,
options?: {owner?: string;})
{
  const owner = options?.owner ?? '';
  const [status, setStatus] = useState<SyncStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  const saved = useRef(new Map<string, string>());
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const toRow = (item: T, position: number) => ({
    id: item.id,
    kind,
    owner,
    data: item as unknown as Record<string, unknown>,
    position
  });

  /** Încărcarea la pornire */
  useEffect(() => {
    if (!supabaseConfigured) return;

    let active = true;
    setStatus('loading');

    (async () => {
      const { data, error: loadError } = await supabase.
      from('collections').
      select('id, data, position').
      eq('kind', kind).
      order('position', { ascending: true });

      if (!active) return;

      if (loadError) {
        console.error(
          `[Supabase] Încărcarea („${kind}”) a eșuat:`,
          loadError.message
        );
        setError(loadError.message);
        setStatus('error');
        return;
      }

      const next = (data ?? []).
      map((row: any) => row.data as T).
      filter((item): item is T => Boolean(item && item.id));

      saved.current = new Map(
        next.map((item, index) => [item.id, fingerprint(toRow(item, index))])
      );
      setItems(next);
      setStatus('ready');
    })();

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kind]);

  /** Salvarea, la 600 ms după ultima modificare */
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
  }, [items, status]);

  async function pushChanges() {
    const rows = items.
    filter((item) => item && item.id).
    map((item, index) => toRow(item, index));

    // Se trimite doar ce s-a schimbat, nu toată lista de fiecare dată
    const changed = rows.filter(
      (row) => saved.current.get(row.id) !== fingerprint(row)
    );
    const removed = [...saved.current.keys()].filter(
      (id) => !rows.some((row) => row.id === id)
    );

    if (changed.length) {
      for (let start = 0; start < changed.length; start += 200) {
        const { error: saveError } = await supabase.
        from('collections').
        upsert(changed.slice(start, start + 200));
        if (saveError) {
          console.error(
            `[Supabase] Salvarea („${kind}”) a eșuat:`,
            saveError.message
          );
          setError(saveError.message);
          return;
        }
      }
    }

    if (removed.length) {
      const { error: deleteError } = await supabase.
      from('collections').
      delete().
      eq('kind', kind).
      in('id', removed);
      if (deleteError) {
        console.error(
          `[Supabase] Ștergerea („${kind}”) a eșuat:`,
          deleteError.message
        );
        setError(deleteError.message);
        return;
      }
    }

    saved.current = new Map(rows.map((row) => [row.id, fingerprint(row)]));
    setError(null);
  }

  return { status, error };
}
