import React from 'react';
import { QuickActions } from '../components/QuickActions';
import { PipelineSummary } from '../components/PipelineSummary';
import { ProjectsTable } from '../components/ProjectsTable';
import { AutomationsPanel } from '../components/AutomationsPanel';
import { RemindersPanel } from '../components/RemindersPanel';
import { Integrations } from '../components/Integrations';

export function Dashboard() {
  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
            Bună, Andreas 👋
          </h1>
          <p className="mt-1 text-sm text-ink-700">
            12 proiecte în lucru, 4 remindere programate azi și o integrare care
            are nevoie de atenție.
          </p>
        </div>
        <span className="rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold text-ink-500 ring-1 ring-slate-200">
          Luni, 24 august · Echipa Vânzări
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