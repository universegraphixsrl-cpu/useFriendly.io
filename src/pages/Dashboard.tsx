import React from 'react';
import { QuickActions } from '../components/QuickActions';
import { PipelineSummary } from '../components/PipelineSummary';
import { ProjectsTable } from '../components/ProjectsTable';
import { AutomationsPanel } from '../components/AutomationsPanel';
import { RemindersPanel } from '../components/RemindersPanel';
import { Integrations } from '../components/Integrations';
import { useWorkspace } from '../contexts/WorkspaceContext';
import { useAuth } from '../contexts/AuthContext';
import { supabaseConfigured } from '../lib/supabase';
import { remindersFromTasks } from '../lib/remindersFromTasks';

export function Dashboard() {
  const { projects, tasks, leads, activeUser } = useWorkspace();
  const { profile } = useAuth();

  /** Numele celui logat; la lucrul local rămâne exemplul din design */
  const name =
  activeUser ??
  profile?.full_name ??
  (supabaseConfigured ? '' : 'Andreas');
  const firstName = name.split(' ')[0] ?? '';

  const openProjects = projects.filter(
    (project) => project.stage !== 'Livrat'
  ).length;
  const todayReminders = supabaseConfigured ?
  remindersFromTasks(tasks).length :
  4;

  const today = new Date().toLocaleDateString('ro-RO', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  });

  /** Ce scriem sub salut: doar lucruri care chiar există */
  const parts: string[] = [];
  if (openProjects) {
    parts.push(
      openProjects === 1 ? 'un proiect în lucru' : `${openProjects} proiecte în lucru`
    );
  }
  if (todayReminders) {
    parts.push(
      todayReminders === 1 ?
      'un reminder programat azi' :
      `${todayReminders} remindere programate azi`
    );
  }
  const summary =
  parts.length === 0 ?
  leads.length === 0 ?
  'Contul e gol deocamdată. Începe cu o listă de leaduri sau un proiect nou.' :
  'Nimic programat azi.' :
  `${parts.join(' și ')}.`;

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
            Bună{firstName ? `, ${firstName}` : ''} 👋
          </h1>
          <p className="mt-1 text-sm text-ink-700">{summary}</p>
        </div>
        <span className="rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold text-ink-500 ring-1 ring-slate-200">
          {today.charAt(0).toUpperCase() + today.slice(1)}
        </span>
      </div>

      <div className="mt-6 space-y-6">
        <QuickActions />

        <PipelineSummary />

        <div className="grid gap-6 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <ProjectsTable />
          </div>
          <div className="space-y-6">
            <RemindersPanel />
            <AutomationsPanel />
          </div>
        </div>

        <Integrations />
      </div>
    </>);

}
