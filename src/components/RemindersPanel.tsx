import React from 'react';
import { BellIcon, SendIcon } from 'lucide-react';
import { reminders, type Reminder } from '../data/crm';
import { useUiActions } from '../contexts/UiActionsContext';

const channelStyles: Record<Reminder['channel'], string> = {
  Email: 'bg-brand-50 text-brand-700',
  SMS: 'bg-amber-50 text-amber-700',
  WhatsApp: 'bg-emerald-50 text-emerald-700',
  Intern: 'bg-slate-100 text-ink-700'
};

export function RemindersPanel() {
  const { runLabel } = useUiActions();
  return (
    <section
      aria-labelledby="reminders-title"
      className="rounded-2xl border border-slate-200 bg-white">
      
      <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
            <BellIcon className="h-[18px] w-[18px]" aria-hidden="true" />
          </span>
          <div>
            <h2
              id="reminders-title"
              className="font-display text-base font-extrabold tracking-tight text-ink">
              
              Remindere azi
            </h2>
            <p className="text-xs text-ink-500">4 programate · 1 în așteptare</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => runLabel('Trimite reminder')}
          className="inline-flex items-center gap-1.5 rounded-lg bg-brand-500 px-2.5 py-1.5 text-xs font-bold text-white transition-colors duration-150 ease-out hover:bg-brand-600">
          
          <SendIcon className="h-3.5 w-3.5" aria-hidden="true" />
          Trimite
        </button>
      </div>

      <ol className="px-5 py-4">
        {reminders.map((reminder, index) =>
        <li key={reminder.title} className="relative flex gap-4 pb-5 last:pb-0">
            {index !== reminders.length - 1 &&
          <span
            className="absolute left-[5px] top-4 h-full w-px bg-slate-100"
            aria-hidden="true" />

          }
            <span
            className="relative mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full border-2 border-brand-500 bg-white"
            aria-hidden="true" />
          
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-display text-xs font-bold text-ink-500">
                  {reminder.time}
                </span>
                <span
                className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${channelStyles[reminder.channel]}`}>
                
                  {reminder.channel}
                </span>
              </div>
              <p className="mt-1 text-sm font-semibold leading-snug text-ink">
                {reminder.title}
              </p>
              <p className="text-xs text-ink-500">{reminder.meta}</p>
            </div>
          </li>
        )}
      </ol>
    </section>);

}