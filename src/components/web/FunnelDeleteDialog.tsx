import React from 'react';
import { AlertTriangleIcon } from 'lucide-react';

interface FunnelDeleteDialogProps {
  funnelName: string;
  pageCount: number;
  onKeep: () => void;
  onDelete: () => void;
}

/** Confirmarea ștergerii definitive a unui funnel */
export function FunnelDeleteDialog({
  funnelName,
  pageCount,
  onKeep,
  onDelete
}: FunnelDeleteDialogProps) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-dialog-title"
      className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      
      <button
        type="button"
        aria-label="Închide"
        onClick={onKeep}
        className="absolute inset-0 cursor-default bg-ink/40" />
      

      <div className="menu-surface relative w-full max-w-lg rounded-xl border border-slate-200 bg-white p-7 shadow-2xl">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-red-50 text-red-600">
            <AlertTriangleIcon className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <h2
              id="delete-dialog-title"
              className="font-display text-xl font-extrabold tracking-tight text-ink">
              
              Ștergi funnelul „{funnelName}”?
            </h2>
            <p className="mt-2.5 text-base text-ink-700">
              Odată șters, funnelul nu mai poate fi recuperat niciodată. Toate
              cele {pageCount} pagini și editările lor vor fi șterse automat.
            </p>
          </div>
        </div>

        <div className="mt-7 flex justify-end gap-2.5">
          <button
            type="button"
            onClick={onKeep}
            className="rounded-md border border-slate-200 px-4 py-2.5 text-[15px] font-semibold text-ink-700 transition-colors duration-150 ease-out hover:bg-slate-50">
            
            Păstrează
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="rounded-md bg-red-600 px-5 py-2.5 font-display text-[15px] font-bold text-white transition-colors duration-150 ease-out hover:bg-red-700">
            
            Șterge
          </button>
        </div>
      </div>
    </div>);

}