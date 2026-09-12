import React, { useState } from 'react';
import {
  WorkflowIcon,
  MailIcon,
  CalendarIcon,
  MessageCircleIcon,
  HashIcon,
  CreditCardIcon,
  VideoIcon,
  MegaphoneIcon,
  SearchIcon,
  MusicIcon,
  FileSpreadsheetIcon,
  ReceiptIcon,
  ZapIcon,
  PhoneIcon,
  SendIcon,
  MailboxIcon,
  TableIcon,
  BookOpenIcon,
  FolderIcon,
  BarChart3Icon,
  LockIcon,
  PlugIcon } from
'lucide-react';
import {
  integrationCatalog,
  type CatalogIntegration,
  type IntegrationStatus } from
'../data/integrationsCatalog';

const icons = [
WorkflowIcon,
MailIcon,
CalendarIcon,
MessageCircleIcon,
HashIcon,
CreditCardIcon,
VideoIcon,
MegaphoneIcon,
SearchIcon,
MusicIcon,
FileSpreadsheetIcon,
ReceiptIcon,
ZapIcon,
PhoneIcon,
SendIcon,
MailboxIcon,
TableIcon,
BookOpenIcon,
FolderIcon,
BarChart3Icon];


const statusStyles: Record<IntegrationStatus, string> = {
  Conectat: 'bg-emerald-50 text-emerald-700',
  Disponibil: 'bg-slate-100 text-ink-700',
  'Necesită atenție': 'bg-amber-50 text-amber-700'
};

export function IntegrationsCatalog() {
  const [items, setItems] = useState<CatalogIntegration[]>(integrationCatalog);

  const connectedCount = items.filter(
    (item) => item.status === 'Conectat'
  ).length;
  const attentionCount = items.filter(
    (item) => item.status === 'Necesită atenție'
  ).length;

  const toggleConnection = (name: string) =>
  setItems((current) =>
  current.map((item) =>
  item.name === name && !item.standard ?
  {
    ...item,
    status: item.status === 'Disponibil' ? 'Conectat' : 'Disponibil'
  } :
  item
  )
  );

  return (
    <>
      <div className="max-w-2xl">
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
          Integrări
        </h1>
        <p className="mt-1 text-sm text-ink-700">
          {items.length} integrări disponibile · {connectedCount} conectate ·{' '}
          {attentionCount} necesită atenție.
        </p>
      </div>

      <section
        aria-labelledby="catalog-title"
        className="mt-6 rounded-2xl border border-slate-200 bg-white">
        
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
              <PlugIcon className="h-[18px] w-[18px]" aria-hidden="true" />
            </span>
            <div>
              <h2
                id="catalog-title"
                className="font-display text-base font-extrabold tracking-tight text-ink">
                
                Catalog complet
              </h2>
              <p className="text-xs text-ink-500">
                Make este integrarea standard, activă pe toate conturile.
              </p>
            </div>
          </div>
        </div>

        <ul className="grid gap-px bg-slate-100 sm:grid-cols-2 xl:grid-cols-4">
          {items.map((integration, index) => {
            const Icon = icons[index % icons.length];
            const connected = integration.status === 'Conectat';
            return (
              <li key={integration.name} className="flex bg-white p-5">
                <div className="flex w-full flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 text-ink-700">
                      <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${statusStyles[integration.status]}`}>
                      
                      {integration.status}
                    </span>
                  </div>
                  <p className="mt-3 flex items-center gap-1.5 font-display text-sm font-bold text-ink">
                    {integration.name}
                    {integration.standard &&
                    <LockIcon
                      className="h-3 w-3 text-ink-500"
                      aria-label="Integrare standard" />

                    }
                  </p>
                  <p className="text-xs text-ink-500">{integration.category}</p>
                  <p className="mt-2 text-xs leading-relaxed text-ink-500">
                    {integration.detail}
                  </p>

                  {integration.standard ?
                  <span className="mt-auto pt-4 text-left text-sm font-bold text-ink-500">
                      Integrare standard
                    </span> :

                  <button
                    type="button"
                    onClick={() => toggleConnection(integration.name)}
                    className={`mt-auto pt-4 text-left text-sm font-bold underline-offset-4 hover:underline ${
                    connected ? 'text-ink-700' : 'text-brand-600'}`
                    }>
                    
                      {connected ? 'Configurează' : 'Conectează'} →
                    </button>
                  }
                </div>
              </li>);

          })}
        </ul>
      </section>
    </>);

}