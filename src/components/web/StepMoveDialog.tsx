import React from 'react';

interface StepMoveDialogProps {
  stepName: string;
  targetName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

/** Confirmarea mutării unui pas într-un alt funnel */
export function StepMoveDialog({
  stepName,
  targetName,
  onConfirm,
  onCancel
}: StepMoveDialogProps) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="move-dialog-title"
      className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      
      <button
        type="button"
        aria-label="Închide"
        onClick={onCancel}
        className="absolute inset-0 cursor-default bg-ink/40" />
      

      <div className="menu-surface relative w-full max-w-md rounded-xl border border-slate-200 bg-white p-7 shadow-2xl">
        <h2
          id="move-dialog-title"
          className="font-display text-xl font-extrabold tracking-tight text-ink">
          
          Mută pagina
        </h2>
        <p className="mt-3 text-base text-ink-700">
          Această pagină va fi mutată în funnelul{' '}
          <span className="font-bold text-ink">{targetName}</span>.
        </p>
        <p className="mt-1.5 text-sm text-ink-500">
          „{stepName}” va deveni ultima pagină din acel funnel.
        </p>

        <div className="mt-7 flex justify-end gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md border border-slate-200 px-4 py-2.5 text-[15px] font-semibold text-ink-700 transition-colors duration-150 ease-out hover:bg-slate-50">
            
            Anulează
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-md bg-brand-500 px-5 py-2.5 font-display text-[15px] font-bold text-white transition-colors duration-150 ease-out hover:bg-brand-600">
            
            Mută
          </button>
        </div>
      </div>
    </div>);

}