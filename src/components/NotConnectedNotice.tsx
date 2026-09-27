import React from 'react';
import { InfoIcon } from 'lucide-react';
import { supabaseConfigured } from '../lib/supabase';

/**
 * Semnul care spune, pe șleau, ce nu merge încă.
 *
 * De ce există: în platformă sunt ecrane care arată ca și cum ar
 * trimite emailuri sau ar încasa bani, dar deocamdată doar salvează ce
 * construiești. Fără un semn clar, un tester raportează „bug: nu am
 * primit emailul" — și pierdem o zi pe ceva ce știam deja.
 *
 * Regula: dacă un buton pare că face ceva în lumea reală și nu face,
 * scrie aici ce face de fapt și ce lipsește.
 */
export function NotConnectedNotice({
  children,
  title = 'Ce funcționează și ce nu, deocamdată'




}: {children: React.ReactNode;title?: string;}) {
  // Pe datele fictive de lucru local nu are rost — acolo oricum e tot demo
  if (!supabaseConfigured) return null;

  return (
    <div className="mt-4 flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
      <InfoIcon
        className="mt-0.5 h-4 w-4 shrink-0 text-amber-700"
        aria-hidden="true" />

      <div>
        <p className="font-display text-sm font-bold text-amber-900">{title}</p>
        <p className="mt-1 text-sm leading-relaxed text-amber-900/90">
          {children}
        </p>
      </div>
    </div>);

}
