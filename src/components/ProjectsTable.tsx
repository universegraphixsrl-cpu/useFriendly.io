import React from 'react';
import { FilterIcon, PlusIcon, MoreHorizontalIcon } from 'lucide-react';
import { projects, type Project } from '../data/crm';

const stageStyles: Record<Project['stage'], string> = {
  Ofertare: 'bg-slate-100 text-ink-700',
  Negociere: 'bg-amber-50 text-amber-700',
  Implementare: 'bg-brand-50 text-brand-700',
  Livrat: 'bg-emerald-50 text-emerald-700'
};

export function ProjectsTable() {
  return (
    <section
      aria-labelledby="projects-title"
      className="rounded-2xl border border-slate-200 bg-white">
      
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
        <div>
          <h2
            id="projects-title"
            className="font-display text-lg font-extrabold tracking-tight text-ink">
            
            Proiecte active
          </h2>
          <p className="text-sm text-ink-500">
            5 din 12 proiecte, sortate după activitate recentă
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-ink-700 transition-colors duration-150 ease-out hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700">
            
            <FilterIcon className="h-4 w-4" aria-hidden="true" />
            Filtre
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-3 py-2 text-sm font-bold text-white transition-colors duration-150 ease-out hover:bg-brand-600">
            
            <PlusIcon className="h-4 w-4" strokeWidth={2.5} aria-hidden="true" />
            Proiect
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse text-left">
          <thead>
            <tr className="text-xs font-bold uppercase tracking-wide text-ink-500">
              <th scope="col" className="px-5 py-3 font-bold">
                Proiect
              </th>
              <th scope="col" className="px-5 py-3 font-bold">
                Etapă
              </th>
              <th scope="col" className="px-5 py-3 font-bold">
                Progres
              </th>
              <th scope="col" className="px-5 py-3 font-bold">
                Valoare
              </th>
              <th scope="col" className="px-5 py-3 font-bold">
                Termen
              </th>
              <th scope="col" className="px-5 py-3">
                <span className="sr-only">Acțiuni</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {projects.map((project) =>
            <tr key={project.id} className="align-middle">
                <td className="px-5 py-4">
                  <p className="font-display text-sm font-bold text-ink">
                    {project.name}
                  </p>
                  <p className="mt-0.5 text-xs text-ink-500">
                    {project.client} · responsabil {project.owner}
                  </p>
                </td>
                <td className="px-5 py-4">
                  <span
                  className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${stageStyles[project.stage]}`}>
                  
                    {project.stage}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex w-32 items-center gap-2">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                      <div
                      className="h-full rounded-full bg-brand-500"
                      style={{ width: `${project.progress}%` }} />
                    
                    </div>
                    <span className="w-9 text-xs font-semibold text-ink-700">
                      {project.progress}%
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-ink-500">{project.tasks}</p>
                </td>
                <td className="px-5 py-4 text-sm font-semibold text-ink">
                  {project.value}
                </td>
                <td className="px-5 py-4 text-sm text-ink-700">
                  {project.due}
                </td>
                <td className="px-5 py-4 text-right">
                  <button
                  type="button"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-ink-500 transition-colors duration-150 ease-out hover:bg-slate-50 hover:text-brand-600"
                  aria-label={`Opțiuni pentru ${project.name}`}>
                  
                    <MoreHorizontalIcon className="h-4 w-4" aria-hidden="true" />
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="border-t border-slate-100 px-5 py-3">
        <button
          type="button"
          className="text-sm font-bold text-brand-600 underline-offset-4 hover:underline">
          
          Vezi toate proiectele →
        </button>
      </div>
    </section>);

}