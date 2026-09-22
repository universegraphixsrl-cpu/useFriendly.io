import React, { useState } from 'react';
import { ChevronDownIcon } from 'lucide-react';
import { siteFaq } from '../../data/site';

/** Întrebările frecvente, pliabile */
export function SiteFaq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="intrebari" className="bg-white py-20 lg:py-24">
      <div className="mx-auto max-w-3xl px-5 lg:px-8">
        <h2 className="font-display text-3xl font-extrabold leading-tight tracking-tight text-ink sm:text-4xl">
          Întrebări frecvente
        </h2>

        <div className="mt-10 divide-y divide-slate-200 border-y border-slate-200">
          {siteFaq.map((item, index) =>
          <div key={item.question}>
              <button
              type="button"
              onClick={() => setOpen(open === index ? null : index)}
              aria-expanded={open === index}
              className="flex w-full items-center justify-between gap-4 py-5 text-left">
              
                <span className="font-display text-lg font-bold tracking-tight text-ink">
                  {item.question}
                </span>
                <ChevronDownIcon
                className={`h-5 w-5 shrink-0 text-ink-500 transition-transform duration-200 ease-out ${
                open === index ? 'rotate-180' : ''}`
                }
                aria-hidden="true" />
              
              </button>
              {open === index &&
            <p className="pb-6 text-[15px] leading-relaxed text-ink-500">
                  {item.answer}
                </p>
            }
            </div>
          )}
        </div>
      </div>
    </section>);

}