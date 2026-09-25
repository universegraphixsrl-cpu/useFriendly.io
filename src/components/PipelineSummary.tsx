import React, { useMemo, useState } from 'react';
import { TrendingUpIcon, TrendingDownIcon, ChevronDownIcon, CheckIcon } from 'lucide-react';
import { pipelineOptions as demoPipelines, type PipelineData } from '../data/pipelines';
import { useWorkspace } from '../contexts/WorkspaceContext';
import { supabaseConfigured } from '../lib/supabase';
import { pipelinesFromLeads, safePercent } from '../lib/pipelineFromLeads';

const formatPercent = (value: number) =>
`${value.toFixed(1).replace('.', ',')}%`;

export function PipelineSummary() {
  const { leads, lists } = useWorkspace();

  /**
   * Cifrele se calculează din leadurile reale. Fără bază de date (lucru
   * local pe date fictive) rămân exemplele din `data/pipelines`.
   */
  const pipelineOptions = useMemo(
    () =>
    supabaseConfigured ? pipelinesFromLeads(leads, lists) : demoPipelines,
    [leads, lists]
  );

  const [selectedId, setSelectedId] = useState<string>(
    pipelineOptions[0]?.id ?? 'toate'
  );
  const [open, setOpen] = useState(false);

  const selected: PipelineData =
  pipelineOptions.find((item) => item.id === selectedId) ??
  pipelineOptions[0] ?? {
    id: 'toate',
    name: 'Toate leadurile',
    value: 0,
    delta: 0,
    inscrisiWebinar: 0,
    apeluriProgramate: 0,
    prezentiApel: 0,
    vanzariNoi: 0,
    integrale: 0,
    rate: 0,
    avansuri: 0
  };

  /** Contul e gol: nu are rost să arătăm procente sau comparații */
  const empty = selected.inscrisiWebinar === 0;

  const stages = [
  { label: 'Înscriși webinar', count: selected.inscrisiWebinar },
  {
    label: 'Apeluri programate',
    count: selected.apeluriProgramate,
    note: `(${formatPercent(safePercent(selected.apeluriProgramate, selected.inscrisiWebinar))} din înscriși)`
  },
  {
    label: 'Prezenți la apel',
    count: selected.prezentiApel,
    note: `(${formatPercent(safePercent(selected.prezentiApel, selected.apeluriProgramate))} din apeluri)`
  },
  {
    label: 'Vânzări noi',
    count: selected.vanzariNoi,
    note: `(${formatPercent(safePercent(selected.vanzariNoi, selected.prezentiApel))} din prezenți)`
  }];


  const payments = [
  { label: 'Integrale', count: selected.integrale },
  { label: 'Rate', count: selected.rate },
  { label: 'Avansuri', count: selected.avansuri }].
  map((item) => ({
    ...item,
    note: `(${formatPercent(safePercent(item.count, selected.vanzariNoi))} din vânzări)`,
    width: safePercent(item.count, selected.vanzariNoi)
  }));

  return (
    <section
      aria-labelledby="pipeline-title"
      className="rounded-2xl bg-ink px-6 py-6 text-white">
      
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p
            id="pipeline-title"
            className="font-display text-xs font-bold uppercase tracking-wide text-brand-300">
            
            Pipeline {new Date().toLocaleDateString('ro-RO', { month: 'long' })} · {selected.name}
          </p>
          <p className="mt-2 font-display text-4xl font-extrabold tracking-tight">
            {selected.value.toLocaleString('ro-RO')} €
          </p>
          {empty ?
          <p className="mt-1 text-sm text-slate-300">
              Încă niciun lead — cifrele apar pe măsură ce intră.
            </p> :
          selected.delta === 0 ?
          <p className="mt-1 text-sm text-slate-300">
              Fără date pentru luna trecută, deci nu avem cu ce compara.
            </p> :

          <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-300">
              {selected.delta > 0 ?
            <TrendingUpIcon
              className="h-4 w-4 text-brand-300"
              aria-hidden="true" /> :


            <TrendingDownIcon
              className="h-4 w-4 text-red-400"
              aria-hidden="true" />

            }
              {selected.delta > 0 ? '+' : ''}
              {formatPercent(selected.delta)} față de luna trecută
            </p>
          }
        </div>

        <div className="flex flex-col items-end gap-5">
          <div className="relative">
            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-haspopup="listbox"
              aria-expanded={open}
              className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/[0.06] px-3 py-2 text-sm font-semibold text-white transition-colors duration-150 ease-out hover:bg-white/10">
              
              {selected.name}
              <ChevronDownIcon
                className={`h-4 w-4 text-brand-300 transition-transform duration-150 ease-out ${open ? 'rotate-180' : ''}`}
                aria-hidden="true" />
              
            </button>

            {open &&
            <>
                <button
                type="button"
                className="fixed inset-0 z-10 cursor-default"
                onClick={() => setOpen(false)}
                tabIndex={-1}
                aria-label="Închide lista de proiecte" />
              
                <ul
                role="listbox"
                aria-label="Selectează proiectul"
                className="absolute right-0 z-20 mt-2 max-h-80 w-64 overflow-y-auto rounded-xl border border-slate-200 bg-white py-1.5 text-ink shadow-xl">
                
                  {pipelineOptions.map((option) => {
                  const active = option.id === selected.id;
                  return (
                    <li key={option.id}>
                        <button
                        type="button"
                        role="option"
                        aria-selected={active}
                        onClick={() => {
                          setSelectedId(option.id);
                          setOpen(false);
                        }}
                        className={`flex w-full items-center gap-2 px-3.5 py-2.5 text-left text-sm font-semibold transition-colors duration-150 ease-out ${
                        active ?
                        'bg-brand-50 text-brand-700' :
                        'text-ink-700 hover:bg-slate-50'}`
                        }>
                        
                          <span className="flex-1 truncate">{option.name}</span>
                          <span className="text-xs font-semibold text-ink-500">
                            {option.value.toLocaleString('ro-RO')} €
                          </span>
                          {active &&
                        <CheckIcon
                          className="h-4 w-4 text-brand-600"
                          aria-hidden="true" />

                        }
                        </button>
                      </li>);

                })}
                </ul>
              </>
            }
          </div>

          <div className="flex gap-8">
            <div className="text-right">
              <p className="font-display text-2xl font-extrabold">
                {formatPercent(
                  selected.vanzariNoi / selected.prezentiApel * 100
                )}
              </p>
              <p className="text-xs text-slate-400">Closing rate la apel</p>
            </div>
            <div className="text-right">
              <p className="font-display text-2xl font-extrabold">
                {formatPercent(
                  selected.prezentiApel / selected.apeluriProgramate * 100
                )}
              </p>
              <p className="text-xs text-slate-400">Show-up rate</p>
            </div>
          </div>
        </div>
      </div>

      <ul className="mt-6 space-y-2.5">
        {stages.map((stage) =>
        <li key={stage.label} className="flex items-center gap-4">
            <span className="w-36 shrink-0 text-sm text-slate-300">
              {stage.label}
            </span>
            <span className="h-2 flex-1 overflow-hidden rounded-full bg-white/10">
              <span
              className="block h-full rounded-full bg-brand-400 transition-[width] duration-200 ease-out"
              style={{
                width: `${Math.max(stage.count / selected.inscrisiWebinar * 100, 4)}%`
              }} />
            
            </span>
            <span className="w-14 shrink-0 text-right font-display text-sm font-bold">
              {stage.count.toLocaleString('ro-RO')}
            </span>
            <span className="hidden w-36 shrink-0 text-right text-xs text-slate-400 sm:block">
              {stage.note ?? ''}
            </span>
          </li>
        )}
      </ul>

      <div className="mt-5 border-t border-white/10 pt-5">
        <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
          Structura celor {selected.vanzariNoi} de vânzări
        </p>
        <ul className="mt-3 space-y-2.5">
          {payments.map((payment) =>
          <li key={payment.label} className="flex items-center gap-4">
              <span className="w-36 shrink-0 text-sm text-slate-300">
                {payment.label}
              </span>
              <span className="h-2 flex-1 overflow-hidden rounded-full bg-white/10">
                <span
                className="block h-full rounded-full bg-brand-200 transition-[width] duration-200 ease-out"
                style={{ width: `${payment.width}%` }} />
              
              </span>
              <span className="w-14 shrink-0 text-right font-display text-sm font-bold">
                {payment.count}
              </span>
              <span className="hidden w-36 shrink-0 text-right text-xs text-slate-400 sm:block">
                {payment.note}
              </span>
            </li>
          )}
        </ul>
      </div>
    </section>);

}