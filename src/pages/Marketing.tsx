import React, { useState } from 'react';
import {
  PlusIcon,
  MailIcon,
  MessageSquareIcon,
  UsersIcon,
  PencilIcon } from
'lucide-react';
import {
  marketingFlows,
  emailTemplate,
  flowAudiences,
  type MarketingFlow } from
'../data/marketing';
import { FlowBuilder } from '../components/marketing/FlowBuilder';
import { Toast } from '../components/Toast';

const blankFlow = (): MarketingFlow => ({
  id: `flow-${Date.now()}`,
  name: '',
  audience: flowAudiences[0],
  active: true,
  sent: 0,
  openRate: 0,
  steps: [
  {
    id: `step-${Date.now()}`,
    channel: 'email',
    delayDays: 0,
    sendAt: '19:00',
    subject: emailTemplate.subject,
    body: emailTemplate.body
  }]

});

export function Marketing() {
  const [flows, setFlows] = useState<MarketingFlow[]>(marketingFlows);
  const [editing, setEditing] = useState<MarketingFlow | null>(null);
  const [toast, setToast] = useState(false);

  const saveFlow = (flow: MarketingFlow) => {
    setFlows((current) =>
    current.some((item) => item.id === flow.id) ?
    current.map((item) => item.id === flow.id ? flow : item) :
    [flow, ...current]
    );
    setEditing(null);
    setToast(true);
    window.setTimeout(() => setToast(false), 2500);
  };

  const toggleFlow = (id: string) =>
  setFlows((current) =>
  current.map((flow) =>
  flow.id === id ? { ...flow, active: !flow.active } : flow
  )
  );

  const totalSteps = flows.reduce((sum, flow) => sum + flow.steps.length, 0);

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
            Marketing
          </h1>
          <p className="mt-1 text-sm text-ink-700">
            {flows.length} fluxuri cu {totalSteps} mesaje programate pe email și
            SMS.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setEditing(blankFlow())}
          className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-3.5 py-2.5 font-display text-sm font-bold text-white transition-colors duration-150 ease-out hover:bg-brand-600">
          
          <PlusIcon className="h-4 w-4" strokeWidth={2.5} aria-hidden="true" />
          Creează un flux
        </button>
      </div>

      {editing &&
      <FlowBuilder
        key={editing.id}
        flow={editing}
        onSave={saveFlow}
        onCancel={() => setEditing(null)} />

      }

      <ul className="mt-6 space-y-3">
        {flows.map((flow) =>
        <li
          key={flow.id}
          className="rounded-2xl border border-slate-200 bg-white p-5">
          
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-display text-base font-extrabold tracking-tight text-ink">
                    {flow.name}
                  </h2>
                  <span
                  className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                  flow.active ?
                  'bg-emerald-50 text-emerald-700' :
                  'bg-amber-50 text-amber-700'}`
                  }>
                  
                    {flow.active ? 'Activ' : 'Draft'}
                  </span>
                </div>
                <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-500">
                  <span className="inline-flex items-center gap-1.5">
                    <UsersIcon className="h-3.5 w-3.5" aria-hidden="true" />
                    {flow.audience}
                  </span>
                  <span>{flow.steps.length} pași</span>
                  <span>{flow.sent.toLocaleString('ro-RO')} trimise</span>
                  <span>{flow.openRate}% rată de deschidere</span>
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                type="button"
                role="switch"
                aria-checked={flow.active}
                onClick={() => toggleFlow(flow.id)}
                className="inline-flex items-center gap-2">
                
                  <span
                  className={`relative flex h-5 w-9 shrink-0 items-center rounded-full transition-colors duration-150 ease-out ${
                  flow.active ? 'bg-emerald-500' : 'bg-slate-300'}`
                  }>
                  
                    <span
                    className={`absolute h-4 w-4 rounded-full bg-white transition-transform duration-150 ease-out ${
                    flow.active ? 'translate-x-[1.125rem]' : 'translate-x-0.5'}`
                    } />
                  
                  </span>
                  <span className="text-[11px] font-bold uppercase tracking-wide text-ink-500">
                    {flow.active ? 'On' : 'Off'}
                  </span>
                </button>
                <button
                type="button"
                onClick={() => setEditing(flow)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-ink-700 transition-colors duration-150 ease-out hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700">
                
                  <PencilIcon className="h-3.5 w-3.5" aria-hidden="true" />
                  Editează fluxul
                </button>
              </div>
            </div>

            <ol className="mt-4 flex flex-wrap items-center gap-2">
              {flow.steps.map((step, index) =>
            <li key={step.id} className="flex items-center gap-2">
                  {index > 0 &&
              <span
                className="h-px w-4 bg-slate-300"
                aria-hidden="true" />

              }
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-50 px-2.5 py-1.5 text-[11px] font-bold text-ink-700">
                    {step.channel === 'email' ?
                <MailIcon className="h-3.5 w-3.5" aria-hidden="true" /> :

                <MessageSquareIcon
                  className="h-3.5 w-3.5"
                  aria-hidden="true" />

                }
                    {index === 0 && step.delayDays === 0 ?
                'Instant' :
                `Zi ${step.delayDays} · ${step.sendAt}`}
                  </span>
                </li>
            )}
            </ol>
          </li>
        )}
      </ul>

      {toast && <Toast message="Acțiune modificată cu succes" />}
    </>);

}