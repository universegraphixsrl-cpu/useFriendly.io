import React from 'react';
import { UserIcon, UsersRoundIcon, XIcon } from 'lucide-react';

interface CalendarTypeDialogProps {
  /** Ascunde opțiunea Round Robin în sub-conturi */
  allowTeam: boolean;
  onChoose: (type: 'solo' | 'team') => void;
  onClose: () => void;
}

const options = [
{
  id: 'solo' as const,
  icon: UserIcon,
  title: 'Calendar individual',
  description: 'Programări unu-la-unu cu o singură gazdă.',
  example: 'Ex.: apeluri de strategie, consultanță privată.'
},
{
  id: 'team' as const,
  icon: UsersRoundIcon,
  title: 'Round Robin',
  description:
  'Distribuie programările între membrii echipei, prin rotație.',
  example: 'Ex.: apeluri de vânzare, sesiuni de onboarding.'
}];


/** Pop-up de alegere a tipului de calendar înainte de formularul de creare */
export function CalendarTypeDialog({
  allowTeam,
  onChoose,
  onClose
}: CalendarTypeDialogProps) {
  const visible = allowTeam ?
  options :
  options.filter((option) => option.id === 'solo');

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="calendar-type-title"
      className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      
      <button
        type="button"
        aria-label="Închide"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-ink/40" />
      

      <div className="menu-surface relative w-full max-w-2xl rounded-xl border border-slate-200 bg-white p-7 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2
              id="calendar-type-title"
              className="font-display text-2xl font-extrabold tracking-tight text-ink">
              
              Alege tipul de calendar
            </h2>
            <p className="mt-1.5 text-sm text-ink-500">
              Tipul stabilește cine găzduiește întâlnirile și cum se distribuie
              programările.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Închide"
            className="rounded-md p-1.5 text-ink-500 transition-colors duration-150 ease-out hover:bg-slate-50 hover:text-ink">
            
            <XIcon className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {visible.map((option) =>
          <button
            key={option.id}
            type="button"
            onClick={() => onChoose(option.id)}
            className="flex gap-3 rounded-lg border border-slate-200 p-5 text-left transition-colors duration-150 ease-out hover:border-brand-300 hover:bg-brand-50/60">
            
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-brand-50 text-brand-600">
                <option.icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <span>
                <span className="block font-display text-base font-bold text-ink">
                  {option.title}
                </span>
                <span className="mt-1 block text-sm text-ink-500">
                  {option.description}
                </span>
                <span className="mt-1 block text-xs text-ink-400">
                  {option.example}
                </span>
              </span>
            </button>
          )}
        </div>
      </div>
    </div>);

}