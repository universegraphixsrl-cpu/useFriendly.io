import React from 'react';
import {
  SparklesIcon,
  MessageSquareIcon,
  VideoIcon,
  ClockIcon,
  CheckCircle2Icon,
  LockIcon,
  ArrowRightIcon } from
'lucide-react';

interface SupportProps {
  onOpenCallBooking: () => void;
}

export function Support({ onOpenCallBooking }: SupportProps) {
  return (
    <>
      <div className="max-w-2xl">
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
          Contactează suportul
        </h1>
        <p className="mt-1 text-sm leading-relaxed text-ink-700">
          Alege canalul potrivit pentru problema ta. Pentru configurări simple,
          asistentul AI răspunde instant. Pentru situații complexe, un consultant
          preia cazul până la rezolvare.
        </p>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <section className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
            <SparklesIcon className="h-[18px] w-[18px]" aria-hidden="true" />
          </span>
          <h2 className="mt-3 font-display text-base font-extrabold tracking-tight text-ink">
            Suport AI
          </h2>
          <p className="mt-1.5 text-sm leading-relaxed text-ink-500">
            Răspuns instant, în chat, cu acces la documentația CRM-ului și la
            configurația contului tău.
          </p>
          <ul className="mt-4 space-y-2 text-xs text-ink-700">
            <li className="flex items-center gap-2">
              <ClockIcon
                className="h-3.5 w-3.5 text-ink-500"
                aria-hidden="true" />
              
              Răspuns în câteva secunde
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2Icon
                className="h-3.5 w-3.5 text-ink-500"
                aria-hidden="true" />
              
              Rezolvă ~70% din întrebările frecvente
            </li>
          </ul>
          <button
            type="button"
            className="mt-auto pt-5 text-left text-sm font-bold text-brand-600 underline-offset-4 hover:underline">
            
            Deschide asistentul AI →
          </button>
        </section>

        <section className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
            <MessageSquareIcon
              className="h-[18px] w-[18px]"
              aria-hidden="true" />
            
          </span>
          <h2 className="mt-3 font-display text-base font-extrabold tracking-tight text-ink">
            Chat cu un consultant
          </h2>
          <p className="mt-1.5 text-sm leading-relaxed text-ink-500">
            Un specialist uman intră în conversație, verifică setările tale și
            duce problema până la capăt.
          </p>
          <ul className="mt-4 space-y-2 text-xs text-ink-700">
            <li className="flex items-center gap-2">
              <ClockIcon
                className="h-3.5 w-3.5 text-amber-600"
                aria-hidden="true" />
              
              Durează cu până la 10 minute mai mult decât AI-ul
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2Icon
                className="h-3.5 w-3.5 text-emerald-600"
                aria-hidden="true" />
              
              <span className="font-semibold">
                Rată de succes 100% în soluționarea problemei
              </span>
            </li>
          </ul>
          <button
            type="button"
            className="mt-auto pt-5 text-left text-sm font-bold text-brand-600 underline-offset-4 hover:underline">
            
            Începe conversația →
          </button>
        </section>

        <section className="flex flex-col rounded-2xl bg-ink p-5 text-white">
          <div className="flex items-start justify-between gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-brand-200">
              <VideoIcon className="h-[18px] w-[18px]" aria-hidden="true" />
            </span>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-full bg-brand-500 px-2.5 py-1 text-[11px] font-bold text-white transition-colors duration-150 ease-out hover:bg-brand-400">
              
              <LockIcon className="h-3 w-3" aria-hidden="true" />
              Doar Pro, fă upgrade acum
            </button>
          </div>
          <h2 className="mt-3 font-display text-base font-extrabold tracking-tight">
            Apel de suport pe Zoom
          </h2>
          <p className="mt-1.5 text-sm leading-relaxed text-slate-300">
            Sesiune 1-la-1 de 15 minute, cu partajare de ecran, pentru
            configurări de pipeline, automatizări sau migrări de date.
          </p>
          <ul className="mt-4 space-y-2 text-xs text-slate-300">
            <li className="flex items-center gap-2">
              <ClockIcon
                className="h-3.5 w-3.5 text-brand-200"
                aria-hidden="true" />
              
              Sloturi de 15 minute, în aceeași zi
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2Icon
                className="h-3.5 w-3.5 text-brand-200"
                aria-hidden="true" />
              
              Include rezumat scris după apel
            </li>
          </ul>
          <button
            type="button"
            onClick={onOpenCallBooking}
            className="mt-auto flex items-center justify-center gap-2 rounded-lg bg-brand-500 px-3.5 py-2.5 font-display text-sm font-bold text-white transition-colors duration-150 ease-out hover:bg-brand-400">
            
            Programează apelul
            <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
          </button>
        </section>
      </div>

      <p className="mt-5 text-xs text-ink-500">
        Ai pachetul Growth, fă un upgrade instant{' '}
        <button
          type="button"
          className="font-bold text-brand-600 underline-offset-4 hover:underline">
          
          APĂSÂND AICI
        </button>
        .
      </p>
    </>);

}