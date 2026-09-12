import React from 'react';
import {
  DownloadIcon,
  CreditCardIcon,
  PencilIcon,
  PlusIcon,
  CheckCircle2Icon,
  ClockIcon,
  AlertTriangleIcon,
  ArrowUpRightIcon } from
'lucide-react';
import { invoices, planUsage, type Invoice } from '../data/billing';

const statusStyles: Record<Invoice['status'], string> = {
  Plătită: 'bg-emerald-50 text-emerald-700',
  'În procesare': 'bg-brand-50 text-brand-700',
  Eșuată: 'bg-red-50 text-red-700'
};

const statusIcons: Record<Invoice['status'], typeof CheckCircle2Icon> = {
  Plătită: CheckCircle2Icon,
  'În procesare': ClockIcon,
  Eșuată: AlertTriangleIcon
};

const companyFields = [
{ label: 'Nume companie', value: 'EliteClosers România SRL' },
{ label: 'CUI / CIF', value: 'RO45120983' },
{ label: 'Nr. registrul comerțului', value: 'J12/2841/2023' },
{ label: 'Adresă', value: 'Str. Mihai Viteazu 14, Cluj-Napoca, România' },
{ label: 'Email facturare', value: 'facturi@eliteclosers.ro' },
{ label: 'Bancă / IBAN', value: 'ING · RO49 INGB 0000 9999 1234 5678' }];


export function Billing() {
  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
            Informații facturare
          </h1>
          <p className="mt-1 text-sm text-ink-700">
            Abonamentul, metoda de plată, datele firmei și istoricul facturilor.
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-ink-700 transition-colors duration-150 ease-out hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700">
          
          <DownloadIcon className="h-4 w-4" aria-hidden="true" />
          Descarcă toate facturile
        </button>
      </div>

      <section
        aria-labelledby="plan-title"
        className="mt-6 rounded-2xl bg-ink px-6 py-6 text-white">
        
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <p className="font-display text-xs font-bold uppercase tracking-wide text-brand-300">
              Abonament activ
            </p>
            <h2
              id="plan-title"
              className="mt-2 font-display text-3xl font-extrabold tracking-tight">
              
              Plan Growth
            </h2>
            <p className="mt-1 text-sm text-slate-300">
              198,00 € / lună · se reînnoiește pe 1 septembrie 2026
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-3.5 py-2.5 text-sm font-semibold text-white transition-colors duration-150 ease-out hover:bg-white/10">
              
              Anulează abonamentul
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-3.5 py-2.5 font-display text-sm font-bold text-white transition-colors duration-150 ease-out hover:bg-brand-400">
              
              <ArrowUpRightIcon className="h-4 w-4" aria-hidden="true" />
              Schimbă planul
            </button>
          </div>
        </div>

        <ul className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {planUsage.map((item) => {
            const percent = Math.round(item.used / item.total * 100);
            return (
              <li key={item.label}>
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-xs text-slate-400">{item.label}</span>
                  <span className="font-display text-sm font-bold">
                    {item.used.toLocaleString('ro-RO')}
                    <span className="text-slate-400">
                      /{item.total.toLocaleString('ro-RO')}
                    </span>
                  </span>
                </div>
                <span className="mt-2 block h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                  <span
                    className={`block h-full rounded-full ${percent >= 80 ? 'bg-amber-400' : 'bg-brand-400'}`}
                    style={{ width: `${percent}%` }} />
                  
                </span>
              </li>);

          })}
        </ul>
      </section>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <section
          aria-labelledby="payment-title"
          className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
          
          <h2
            id="payment-title"
            className="font-display text-base font-extrabold tracking-tight text-ink">
            
            Metodă de plată
          </h2>
          <p className="text-xs text-ink-500">
            Cardul folosit pentru reînnoirea automată.
          </p>

          <div className="mt-4 flex items-center gap-3 rounded-xl border border-slate-200 p-4">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
              <CreditCardIcon className="h-[18px] w-[18px]" aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-display text-sm font-bold text-ink">
                Visa •••• 4242
              </p>
              <p className="text-xs text-ink-500">Expiră în 09/2029</p>
            </div>
            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700">
              Principal
            </span>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-bold text-ink-700 transition-colors duration-150 ease-out hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700">
              
              <PencilIcon className="h-3.5 w-3.5" aria-hidden="true" />
              Actualizează cardul
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-bold text-ink-700 transition-colors duration-150 ease-out hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700">
              
              <PlusIcon
                className="h-3.5 w-3.5"
                strokeWidth={2.5}
                aria-hidden="true" />
              
              Adaugă metodă
            </button>
          </div>

          <div className="mt-5 border-t border-slate-100 pt-4">
            <p className="text-xs font-bold uppercase tracking-wide text-ink-500">
              Următoarea plată
            </p>
            <p className="mt-1.5 font-display text-2xl font-extrabold text-ink">
              198,00 €
            </p>
            <p className="text-xs text-ink-500">
              Se retrage automat pe 1 septembrie 2026
            </p>
          </div>
        </section>

        <section
          aria-labelledby="company-title"
          className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 xl:col-span-2">
          
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2
                id="company-title"
                className="font-display text-base font-extrabold tracking-tight text-ink">
                
                Date de facturare firmă
              </h2>
              <p className="text-xs text-ink-500">
                Apar pe fiecare factură emisă către tine.
              </p>
            </div>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-bold text-ink-700 transition-colors duration-150 ease-out hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700">
              
              <PencilIcon className="h-3.5 w-3.5" aria-hidden="true" />
              Editează datele
            </button>
          </div>

          <dl className="mt-5 grid gap-x-8 gap-y-4 sm:grid-cols-2">
            {companyFields.map((field) =>
            <div key={field.label}>
                <dt className="text-xs font-bold uppercase tracking-wide text-ink-500">
                  {field.label}
                </dt>
                <dd className="mt-1 text-sm font-semibold text-ink">
                  {field.value}
                </dd>
              </div>
            )}
          </dl>

          <div className="mt-5 flex items-start gap-2.5 rounded-xl bg-brand-50 p-4">
            <CheckCircle2Icon
              className="mt-0.5 h-4 w-4 shrink-0 text-brand-600"
              aria-hidden="true" />
            
            <p className="text-xs leading-relaxed text-ink-700">
              Firma este înregistrată în scopuri de TVA, deci facturile se emit
              cu taxare inversă. Modificarea CUI-ului se aplică de la următoarea
              factură.
            </p>
          </div>
        </section>
      </div>

      <section
        aria-labelledby="invoices-title"
        className="mt-6 rounded-2xl border border-slate-200 bg-white">
        
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
          <div>
            <h2
              id="invoices-title"
              className="font-display text-lg font-extrabold tracking-tight text-ink">
              
              Istoric plăți
            </h2>
            <p className="text-sm text-ink-500">
              {invoices.length} facturi · total plătit 783,00 €
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {['Toate', '2026', '2025'].map((filter, index) =>
            <button
              key={filter}
              type="button"
              className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition-colors duration-150 ease-out ${
              index === 0 ?
              'bg-ink text-white' :
              'border border-slate-200 text-ink-700 hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700'}`
              }>
              
                {filter}
              </button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left">
            <thead>
              <tr className="text-xs font-bold uppercase tracking-wide text-ink-500">
                <th scope="col" className="px-5 py-3 font-bold">
                  Factură
                </th>
                <th scope="col" className="px-5 py-3 font-bold">
                  Data
                </th>
                <th scope="col" className="px-5 py-3 font-bold">
                  Descriere
                </th>
                <th scope="col" className="px-5 py-3 font-bold">
                  Sumă
                </th>
                <th scope="col" className="px-5 py-3 font-bold">
                  Status
                </th>
                <th scope="col" className="px-5 py-3 text-right font-bold">
                  Acțiuni
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {invoices.map((invoice) => {
                const StatusIcon = statusIcons[invoice.status];
                return (
                  <tr key={invoice.id}>
                    <td className="px-5 py-4 font-display text-sm font-bold text-ink">
                      {invoice.number}
                    </td>
                    <td className="px-5 py-4 text-sm text-ink-700">
                      {invoice.date}
                    </td>
                    <td className="px-5 py-4 text-sm text-ink-500">
                      {invoice.description}
                    </td>
                    <td className="px-5 py-4 text-sm font-semibold text-ink">
                      {invoice.amount}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${statusStyles[invoice.status]}`}>
                        
                        <StatusIcon
                          className="h-3.5 w-3.5"
                          aria-hidden="true" />
                        
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        {invoice.status === 'Eșuată' &&
                        <button
                          type="button"
                          className="rounded-lg bg-red-50 px-2.5 py-1.5 text-xs font-bold text-red-700 transition-colors duration-150 ease-out hover:bg-red-100">
                          
                            Reîncearcă plata
                          </button>
                        }
                        <button
                          type="button"
                          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-bold text-ink-700 transition-colors duration-150 ease-out hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700">
                          
                          <DownloadIcon
                            className="h-3.5 w-3.5"
                            aria-hidden="true" />
                          
                          Descarcă PDF
                        </button>
                      </div>
                    </td>
                  </tr>);

              })}
            </tbody>
          </table>
        </div>
      </section>
    </>);

}