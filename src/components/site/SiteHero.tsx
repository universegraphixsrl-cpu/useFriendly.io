import React from 'react';
import { ArrowRightIcon, CheckIcon } from 'lucide-react';
import { siteStats } from '../../data/site';

interface SiteHeroProps {
  onEnterApp: () => void;
}

const proofs = [
'Fără cod, fără developer',
'Toate modulele incluse',
'Anulezi într-un click'];


/** Hero-ul site-ului: promisiunea principală + captura din produs */
export function SiteHero({ onEnterApp }: SiteHeroProps) {
  return (
    <section id="top" className="bg-white">
      <div className="mx-auto max-w-5xl px-5 pb-10 pt-16 text-center lg:px-8 lg:pt-24">
        <p className="inline-flex rounded-full bg-brand-50 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.12em] text-brand-700">
          Cel mai ușor tool all-in-one de marketing
        </p>

        <h1 className="mt-7 font-display text-4xl font-extrabold leading-[1.08] tracking-tight text-ink sm:text-5xl lg:text-6xl">
          Tot marketingul afacerii tale{' '}
          <span className="text-brand-500">
            într-un singur tool, fără șase abonamente
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-ink-500">
          Friendly îți dă web builder, sales funnels, email și SMS,
          automatizări, CRM, calendare de programări, linkuri de plată și
          cursuri — în același cont, cu aceleași leaduri și aceleași rapoarte.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onEnterApp}
            className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-7 py-4 font-display text-base font-bold text-white transition-colors duration-150 ease-out hover:bg-brand-600">
            
            Începe gratuit 14 zile
            <ArrowRightIcon className="h-5 w-5" aria-hidden="true" />
          </button>
          <a
            href="#preturi"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-7 py-4 font-display text-base font-bold text-ink transition-colors duration-150 ease-out hover:border-ink-500">
            
            Vezi pachetele
          </a>
        </div>

        <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {proofs.map((proof) =>
          <li
            key={proof}
            className="flex items-center gap-1.5 text-sm font-semibold text-ink-500">
            
              <CheckIcon
              className="h-4 w-4 text-brand-500"
              strokeWidth={3}
              aria-hidden="true" />
            
              {proof}
            </li>
          )}
        </ul>
      </div>

      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <div className="rounded-2xl border-[3px] border-brand-200 p-2">
          <img
            src="/f5161b45-b1c6-4540-9cc0-9ab99249d7cc.jpg"
            alt="Panoul general din Friendly, cu indicatori, grafic de venit și lista de leaduri"
            className="w-full rounded-xl" />
          
        </div>
      </div>

      <div className="mx-auto mt-14 max-w-6xl px-5 lg:px-8">
        <dl className="grid gap-y-8 border-y border-slate-200 py-10 sm:grid-cols-2 lg:grid-cols-4">
          {siteStats.map((stat) =>
          <div key={stat.label} className="text-center">
              <dt className="font-display text-3xl font-extrabold tracking-tight text-brand-500">
                {stat.value}
              </dt>
              <dd className="mt-1 text-sm font-semibold text-ink-500">
                {stat.label}
              </dd>
            </div>
          )}
        </dl>
      </div>
    </section>);

}