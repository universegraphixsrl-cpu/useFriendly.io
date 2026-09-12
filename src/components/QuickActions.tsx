import React from 'react';
import {
  FolderPlusIcon,
  ZapIcon,
  BellPlusIcon,
  UserPlusIcon,
  FileSignatureIcon,
  CalendarPlusIcon,
  MailPlusIcon,
  ReceiptIcon,
  WorkflowIcon,
  UploadCloudIcon } from
'lucide-react';

const primaryActions = [
{
  label: 'Deschide proiect nou',
  hint: 'Din șablon sau de la zero',
  icon: FolderPlusIcon
},
{
  label: 'Setează automatizare',
  hint: 'Declanșator → acțiune',
  icon: ZapIcon
},
{
  label: 'Trimite reminder',
  hint: 'Email, SMS sau WhatsApp',
  icon: BellPlusIcon
}];


const secondaryActions = [
{ label: 'Adaugă contact', icon: UserPlusIcon },
{ label: 'Generează ofertă', icon: FileSignatureIcon },
{ label: 'Programează apel', icon: CalendarPlusIcon },
{ label: 'Secvență de emailuri', icon: MailPlusIcon },
{ label: 'Emite factură', icon: ReceiptIcon },
{ label: 'Creează workflow', icon: WorkflowIcon },
{ label: 'Importă leaduri', icon: UploadCloudIcon }];


export function QuickActions() {
  return (
    <section aria-labelledby="quick-actions-title">
      <h2
        id="quick-actions-title"
        className="font-display text-sm font-bold uppercase tracking-wide text-ink-500">
        
        Acțiuni rapide
      </h2>

      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        {primaryActions.map((action, index) =>
        <button
          key={action.label}
          type="button"
          className={`group flex items-center gap-3 rounded-2xl px-4 py-4 text-left transition-colors duration-150 ease-out ${
          index === 0 ?
          'bg-brand-500 hover:bg-brand-600' :
          'border border-slate-200 bg-white hover:border-brand-200 hover:bg-brand-50'}`
          }>
          
            <span
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
            index === 0 ?
            'bg-white/15 text-white' :
            'bg-brand-50 text-brand-600'}`
            }>
            
              <action.icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="min-w-0">
              <span
              className={`block font-display text-sm font-bold ${index === 0 ? 'text-white' : 'text-ink'}`}>
              
                {action.label}
              </span>
              <span
              className={`block text-xs ${index === 0 ? 'text-brand-100' : 'text-ink-500'}`}>
              
                {action.hint}
              </span>
            </span>
          </button>
        )}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {secondaryActions.map((action) =>
        <button
          key={action.label}
          type="button"
          className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-ink-700 transition-colors duration-150 ease-out hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700">
          
            <action.icon className="h-4 w-4 text-ink-500" aria-hidden="true" />
            {action.label}
          </button>
        )}
      </div>
    </section>);

}