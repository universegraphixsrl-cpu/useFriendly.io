import { useEffect, useRef, useState } from 'react';
import { supabase, supabaseConfigured } from './supabase';
import type { Project } from '../data/crm';

/**
 * Proiectele din tabelul de pe panoul general, legate de baza de date.
 * Un cont nou pornește cu tabelul gol și îl umple singur.
 */

type SyncStatus = 'idle' | 'loading' | 'ready' | 'error';

interface ProjectRow {
  id: string;
  name: string;
  client: string;
  owner: string;
  stage: string;
  value: string;
  progress: number;
  due: string;
  tasks: string;
  position: number;
}

function toRow(project: Project, position: number): ProjectRow {
  return {
    id: project.id,
    name: project.name ?? '',
    client: project.client ?? '',
    owner: project.owner ?? '',
    stage: project.stage,
    value: project.value ?? '',
    progress: Number(project.progress) || 0,
    due: project.due ?? '',
    tasks: project.tasks ?? '',
    position
  };
}

const fingerprint = (value: unknown) => JSON.stringify(value);

export function useProjectsSync(options: {
  enabled: boolean;
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
}) {
  const { enabled, projects, setProjects } = options;
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
      from('projects').
      select('*').
      order('position', { ascending: true });

      if (!active) return;

      if (loadError) {
        console.error('[Supabase] Încărcarea proiectelor a eșuat:', loadError.message);
        setError(loadError.message);
        setStatus('error');
        return;
      }

      const next: Project[] = (data ?? []).map((row: any) => ({
        id: row.id,
        name: row.name ?? '',
        client: row.client ?? '',
        owner: row.owner ?? '',
        stage: row.stage,
        value: row.value ?? '',
        progress: Number(row.progress) || 0,
        due: row.due ?? '',
        tasks: row.tasks ?? ''
      }));

      saved.current = new Map(
        next.map((item, index) => [item.id, fingerprint(toRow(item, index))])
      );
      setProjects(next);
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
  }, [projects, status]);

  async function pushChanges() {
    const rows = projects.map((item, index) => toRow(item, index));
    const changed = rows.filter(
      (row) => saved.current.get(row.id) !== fingerprint(row)
    );
    const removed = [...saved.current.keys()].filter(
      (id) => !rows.some((row) => row.id === id)
    );

    if (changed.length) {
      const { error: saveError } = await supabase.
      from('projects').
      upsert(changed);
      if (saveError) {
        console.error('[Supabase] Salvarea proiectelor a eșuat:', saveError.message);
        setError(saveError.message);
        return;
      }
    }
    if (removed.length) {
      await supabase.from('projects').delete().in('id', removed);
    }

    saved.current = new Map(rows.map((row) => [row.id, fingerprint(row)]));
    setError(null);
  }

  return { status, error };
}
