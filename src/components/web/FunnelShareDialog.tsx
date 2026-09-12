import React, { useState } from 'react';
import { XIcon } from 'lucide-react';

interface FunnelShareDialogProps {
  funnelName: string;
  shareUrl: string;
  onClose: () => void;
}

/** Pop-up de distribuire a unui funnel, cu link și copiere în clipboard */
export function FunnelShareDialog({
  funnelName,
  shareUrl,
  onClose
}: FunnelShareDialogProps) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard?.writeText(shareUrl);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-dialog-title"
      className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      
      <button
        type="button"
        aria-label="Închide"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-ink/40" />
      

      <div className="menu-surface relative w-full max-w-lg rounded-xl border border-slate-200 bg-white p-7 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <h2
            id="share-dialog-title"
            className="font-display text-2xl font-extrabold tracking-tight text-ink">
            
            Distribuie acest funnel
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Închide"
            className="rounded-md p-1.5 text-ink-500 transition-colors duration-150 ease-out hover:bg-slate-50 hover:text-ink">
            
            <XIcon className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <p className="mt-6 text-sm text-ink-500">
          Folosește acest link pentru a distribui funnelul „{funnelName}”
        </p>
        <input
          readOnly
          value={shareUrl}
          aria-label="Link de distribuire"
          onFocus={(event) => event.currentTarget.select()}
          className="mt-2 w-full truncate rounded-md border border-slate-200 bg-slate-50 px-3.5 py-3 text-base text-ink-700 outline-none" />
        

        <div className="mt-7 flex justify-center">
          <button
            type="button"
            onClick={copy}
            className="rounded-md bg-brand-500 px-6 py-3 font-display text-[15px] font-bold text-white transition-colors duration-150 ease-out hover:bg-brand-600">
            
            {copied ? 'Link copiat' : 'Copiază linkul în clipboard'}
          </button>
        </div>
      </div>
    </div>);

}