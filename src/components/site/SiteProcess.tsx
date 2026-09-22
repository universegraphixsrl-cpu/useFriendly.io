import React from 'react';
import { XIcon, CheckIcon } from 'lucide-react';
import { siteSteps, siteComparison } from '../../data/site';

/** Cum începi + diferența față de stack-ul clasic de tool-uri */
export function SiteProcess() {
  return (
    <section className="bg-slate-50 py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-brand-600">
            Cum începi
          </p>
          <h2 className="mt-3 font-display text-3xl font-extrabold leading-tight tracking-tight text-ink sm:text-4xl">
            Trei pași până la primul funnel live
          </h2>
        </div>

        <ol className="mt-12 grid gap-8 lg:grid-cols-3">
          {siteSteps.map((step, index) =>
          <li
            key={step.title}
            className="rounded-xl border border-slate-200 bg-white p-7">
            
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-500 font-display text-lg font-extrabold text-white">
                {index + 1}
              </span>
              <h3 className="mt-5 font-display text-xl font-bold tracking-tight text-ink">
                {step.title}
              </h3>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-500">
                {step.description}
              </p>
            </li>
          )}
        </ol>

        <div className="mt-16 grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-white p-8">
            <h3 className="font-display text-xl font-bold tracking-tight text-ink-700">
              Cum arată acum
            </h3>
            <ul className="mt-5 space-y-3.5">
              {siteComparison.before.map((item) =>
              <li key={item} className="flex gap-3">
                  <XIcon
                  className="mt-0.5 h-5 w-5 shrink-0 text-red-500"
                  strokeWidth={3}
                  aria-hidden="true" />
                
                  <span className="text-[15px] text-ink-500">{item}</span>
                </li>
              )}
            </ul>
          </div>

          <div className="rounded-xl border-2 border-brand-500 bg-white p-8">
            <h3 className="font-display text-xl font-bold tracking-tight text-ink">
              Cum arată cu Friendly
            </h3>
            <ul className="mt-5 space-y-3.5">
              {siteComparison.after.map((item) =>
              <li key={item} className="flex gap-3">
                  <CheckIcon
                  className="mt-0.5 h-5 w-5 shrink-0 text-brand-500"
                  strokeWidth={3}
                  aria-hidden="true" />
                
                  <span className="text-[15px] font-semibold text-ink-700">
                    {item}
                  </span>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </section>);

}