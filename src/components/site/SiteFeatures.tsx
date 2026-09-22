import React from 'react';
import {
  LayoutTemplateIcon,
  FilterIcon,
  MailIcon,
  ZapIcon,
  UsersIcon,
  CalendarIcon,
  CreditCardIcon,
  BookOpenIcon,
  BarChart3Icon } from
'lucide-react';
import { siteFeatures, type SiteFeature } from '../../data/site';

const icons: Record<SiteFeature['icon'], typeof ZapIcon> = {
  layout: LayoutTemplateIcon,
  filter: FilterIcon,
  mail: MailIcon,
  zap: ZapIcon,
  users: UsersIcon,
  calendar: CalendarIcon,
  card: CreditCardIcon,
  book: BookOpenIcon,
  chart: BarChart3Icon
};

/** Grila cu toate serviciile incluse în tool */
export function SiteFeatures() {
  return (
    <section id="functii" className="bg-white py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-brand-600">
            Tot ce include
          </p>
          <h2 className="mt-3 font-display text-3xl font-extrabold leading-tight tracking-tight text-ink sm:text-4xl">
            Nouă module care lucrează cu aceleași date
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-ink-500">
            Nu mai muți contacte între tool-uri și nu mai plătești integrări.
            Un lead intrat din pagina ta ajunge în listă, primește mailurile și
            apare în raportul closerului.
          </p>
        </div>

        <ul className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {siteFeatures.map((feature) => {
            const Icon = icons[feature.icon];
            return (
              <li key={feature.title} className="flex flex-col">
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                  <Icon className="h-[22px] w-[22px]" aria-hidden="true" />
                </span>
                <h3 className="mt-4 font-display text-lg font-bold tracking-tight text-ink">
                  {feature.title}
                </h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-500">
                  {feature.description}
                </p>
              </li>);

          })}
        </ul>
      </div>
    </section>);

}