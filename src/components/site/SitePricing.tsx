import React from 'react';
import { CheckIcon } from 'lucide-react';
import { sitePlans } from '../../data/site';

interface SitePricingProps {
  onEnterApp: () => void;
}

/** Cele trei pachete de abonament */
export function SitePricing({ onEnterApp }: SitePricingProps) {
  return (
    <section id="preturi" className="bg-white py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-brand-600">
            Investiție
          </p>
          <h2 className="mt-3 font-display text-3xl font-extrabold leading-tight tracking-tight text-ink sm:text-4xl">
            Un abonament, în locul a șase
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-ink-500">
            Toate modulele sunt incluse în fiecare pachet. Diferența e câți
            oameni lucrează în cont și câte mesaje trimiți lunar.
          </p>
        </div>

        <div className="mt-14 grid items-start gap-6 lg:grid-cols-3">
          {sitePlans.map((plan) =>
          <div
            key={plan.name}
            className={`flex h-full flex-col rounded-2xl bg-white p-8 ${
            plan.recommended ?
            'border-2 border-brand-500 shadow-lg lg:-mt-4 lg:pb-10 lg:pt-10' :
            'border border-slate-200'}`
            }>
            
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-display text-xl font-bold tracking-tight text-ink">
                  {plan.name}
                </h3>
                {plan.recommended &&
              <span className="rounded-full bg-brand-500 px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-white">
                    Recomandat
                  </span>
              }
              </div>

              <p className="mt-2 min-h-[48px] text-sm leading-relaxed text-ink-500">
                {plan.tagline}
              </p>

              <p className="mt-5 flex items-baseline gap-1.5">
                <span className="font-display text-5xl font-extrabold tracking-tight text-ink">
                  {plan.price}€
                </span>
                <span className="text-sm font-semibold text-ink-500">
                  / lună
                </span>
              </p>

              <button
              type="button"
              onClick={onEnterApp}
              className={`mt-6 w-full rounded-lg px-5 py-3.5 font-display text-[15px] font-bold transition-colors duration-150 ease-out ${
              plan.recommended ?
              'bg-brand-500 text-white hover:bg-brand-600' :
              'border border-slate-200 text-ink hover:border-ink-500'}`
              }>
              
                {plan.cta}
              </button>

              <ul className="mt-7 space-y-3">
                {plan.features.map((feature) =>
              <li key={feature} className="flex gap-2.5">
                    <CheckIcon
                  className="mt-0.5 h-[18px] w-[18px] shrink-0 text-brand-500"
                  strokeWidth={3}
                  aria-hidden="true" />
                
                    <span className="text-[15px] text-ink-700">{feature}</span>
                  </li>
              )}
              </ul>

              <p className="mt-auto pt-7 text-xs font-semibold text-ink-500">
                14 zile gratuit · anulezi oricând
              </p>
            </div>
          )}
        </div>
      </div>
    </section>);

}