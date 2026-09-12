import React, { useState } from 'react';
import { XIcon, CheckIcon } from 'lucide-react';
import { funnelStepKinds, type FunnelStepKind } from '../../data/funnels';

interface StepCreateDialogProps {
  onClose: () => void;
  onCreate: (
  name: string,
  kind: FunnelStepKind,
  source: 'template' | 'scratch')
  => void;
}

/** Pop-up pentru crearea unui pas nou de funnel */
export function StepCreateDialog({ onClose, onCreate }: StepCreateDialogProps) {
  const [name, setName] = useState('');
  const [kind, setKind] = useState<FunnelStepKind | ''>('');
  const [source, setSource] = useState<'template' | 'scratch'>('template');

  const valid = name.trim().length > 0 && kind !== '';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="step-dialog-title"
      className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      
      <button
        type="button"
        aria-label="Închide"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-ink/40" />
      

      <div className="menu-surface relative w-full max-w-xl rounded-xl border border-slate-200 bg-white p-7 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <h2
            id="step-dialog-title"
            className="font-display text-2xl font-extrabold tracking-tight text-ink">
            
            Creează un pas de funnel
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Închide"
            className="rounded-md p-1.5 text-ink-500 transition-colors duration-150 ease-out hover:bg-slate-50 hover:text-ink">
            
            <XIcon className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <label className="mt-6 block text-sm font-bold text-ink-700">
          Denumire<span className="text-red-500"> *</span>
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Ex.: Ofertă mentorat"
            className="mt-2 w-full rounded-md border border-slate-200 px-3.5 py-3 text-base font-normal text-ink outline-none focus:border-brand-400" />
          
        </label>

        <label className="mt-5 block text-sm font-bold text-ink-700">
          Tipul paginii<span className="text-red-500"> *</span>
          <select
            value={kind}
            onChange={(event) =>
            setKind(event.target.value as FunnelStepKind | '')
            }
            className={`mt-2 w-full rounded-md border border-slate-200 bg-white px-3.5 py-3 text-base font-normal outline-none focus:border-brand-400 ${
            kind ? 'text-ink' : 'text-ink-400'}`
            }>
            
            <option value="">Alege tipul de pagină</option>
            {funnelStepKinds.map((option) =>
            <option key={option} value={option}>
                {option}
              </option>
            )}
          </select>
        </label>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-6">
          {(
          [
          ['template', 'Alege din template'],
          ['scratch', 'Construiește de la zero']] as
          const).
          map(([value, label]) =>
          <button
            key={value}
            type="button"
            onClick={() => setSource(value)}
            aria-pressed={source === value}
            className="flex items-center gap-2.5">
            
              <span
              className={`flex h-6 w-6 items-center justify-center rounded-full border transition-colors duration-150 ease-out ${
              source === value ?
              'border-emerald-600 bg-emerald-600 text-white' :
              'border-slate-300 text-transparent'}`
              }>
              
                <CheckIcon className="h-3.5 w-3.5" strokeWidth={3} aria-hidden="true" />
              </span>
              <span
              className={`font-display text-base font-bold ${
              source === value ? 'text-ink' : 'text-ink-400'}`
              }>
              
                {label}
              </span>
            </button>
          )}
        </div>

        <div className="mt-7 flex justify-center">
          <button
            type="button"
            disabled={!valid}
            onClick={() => valid && onCreate(name.trim(), kind as FunnelStepKind, source)}
            className="rounded-md bg-brand-500 px-8 py-3 font-display text-[15px] font-bold text-white transition-colors duration-150 ease-out hover:bg-brand-600 disabled:cursor-not-allowed disabled:bg-slate-300">
            
            Salvează
          </button>
        </div>
      </div>
    </div>);

}