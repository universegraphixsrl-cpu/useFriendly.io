import React, { useState } from 'react';
import { BarChart3Icon } from 'lucide-react';
import { FormFilterBar } from './FormFilterBar';
import { filterLabel, type LeadDateFilter } from '../leads/DateFilter';

interface FormAnalyticsProps {
  forms: {id: string;name: string;}[];
}

/** Statisticile formularelor: vizualizări, răspunsuri, durată medie, rată de completare */
export function FormAnalytics({ forms }: FormAnalyticsProps) {
  const [dateFilter, setDateFilter] = useState<LeadDateFilter>({ kind: 'all' });
  const [formFilter, setFormFilter] = useState('toate');

  const cards = [
  { label: 'Vizualizări totale', value: '0' },
  { label: 'Răspunsuri', value: '0' },
  { label: 'Durată medie', value: '00:00' },
  { label: 'Rată de completare', value: '0,00%' }];


  return (
    <div className="mt-6">
      <FormFilterBar
        forms={forms}
        selectedFormId={formFilter}
        onSelectForm={setFormFilter}
        dateFilter={dateFilter}
        onDateChange={setDateFilter} />
      

      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card, index) =>
        <div
          key={card.label}
          className={`rounded-lg border bg-white p-5 ${
          index === 0 ? 'border-brand-300' : 'border-slate-200'}`
          }>
          
            <p
            className={`text-sm font-bold ${
            index === 0 ? 'text-brand-600' : 'text-ink-500'}`
            }>
            
              {card.label}
            </p>
            <p className="mt-2 font-display text-3xl font-extrabold tracking-tight text-ink">
              {card.value}
            </p>
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-col items-center justify-center rounded-lg border border-slate-200 bg-white px-6 py-16 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-md bg-slate-100 text-ink-400">
          <BarChart3Icon className="h-6 w-6" aria-hidden="true" />
        </span>
        <p className="mt-4 font-display text-lg font-bold text-ink">
          Nicio statistică pentru perioada selectată
        </p>
        <p className="mt-1.5 text-sm text-ink-500">
          {filterLabel(dateFilter)} · datele apar imediat ce un formular începe
          să primească vizite.
        </p>
      </div>
    </div>);

}