import React from 'react';
import { MailIcon, MessageSquareIcon, ClockIcon } from 'lucide-react';
import {
  delayOptions,
  sendHours,
  emailTemplate,
  smsTemplate,
  type FlowStep,
  type FlowStepChannel } from
'../../data/marketing';

interface StepEditorProps {
  step: FlowStep;
  index: number;
  onChange: (patch: Partial<FlowStep>) => void;
}

const SMS_LIMIT = 160;

const labelClass = 'text-[11px] font-bold uppercase tracking-wide text-ink-500';
const fieldClass =
'mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-ink focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-100';

export function StepEditor({ step, index, onChange }: StepEditorProps) {
  const channels: {
    value: FlowStepChannel;
    label: string;
    icon: typeof MailIcon;
  }[] = [
  { value: 'email', label: 'Email', icon: MailIcon },
  { value: 'sms', label: 'SMS', icon: MessageSquareIcon }];


  const instant = index === 0 && step.delayDays === 0;

  const switchChannel = (channel: FlowStepChannel) => {
    if (channel === step.channel) return;
    const template = channel === 'email' ? emailTemplate : smsTemplate;
    onChange({ channel, subject: template.subject, body: template.body });
  };

  return (
    <div className="border-t border-slate-100 p-4">
      <div className="flex flex-wrap items-end gap-3">
        <div>
          <p className={labelClass}>Canal</p>
          <div className="mt-1.5 flex gap-1.5">
            {channels.map((channel) =>
            <button
              key={channel.value}
              type="button"
              onClick={() => switchChannel(channel.value)}
              aria-pressed={step.channel === channel.value}
              className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-bold transition-colors duration-150 ease-out ${
              step.channel === channel.value ?
              'border-brand-300 bg-brand-50 text-brand-700' :
              'border-slate-200 text-ink-700 hover:bg-slate-50'}`
              }>
              
                <channel.icon className="h-3.5 w-3.5" aria-hidden="true" />
                {channel.label}
              </button>
            )}
          </div>
        </div>

        <div className="min-w-[9rem]">
          <label className={labelClass} htmlFor={`delay-${step.id}`}>
            Când se trimite
          </label>
          <select
            id={`delay-${step.id}`}
            value={step.delayDays}
            onChange={(event) =>
            onChange({ delayDays: Number(event.target.value) })
            }
            className={fieldClass}>
            
            {delayOptions.map((option) =>
            <option key={option.value} value={option.value}>
                {index === 0 && option.value === 0 ?
              'Instant, când intră în flux' :
              option.label}
              </option>
            )}
          </select>
        </div>

        {instant ?
        <p className="inline-flex items-center gap-1.5 rounded-lg bg-slate-50 px-3 py-2 text-xs font-semibold text-ink-500">
            <ClockIcon className="h-3.5 w-3.5" aria-hidden="true" />
            Se trimite instant, fără oră fixă
          </p> :

        <div className="min-w-[7rem]">
            <label className={labelClass} htmlFor={`hour-${step.id}`}>
              <span className="inline-flex items-center gap-1">
                <ClockIcon className="h-3 w-3" aria-hidden="true" />
                La ora
              </span>
            </label>
            <select
            id={`hour-${step.id}`}
            value={step.sendAt}
            onChange={(event) => onChange({ sendAt: event.target.value })}
            className={fieldClass}>
            
              {sendHours.map((hour) =>
            <option key={hour} value={hour}>
                  {hour}
                </option>
            )}
            </select>
          </div>
        }
      </div>

      <div className="mt-4">
        <label className={labelClass} htmlFor={`subject-${step.id}`}>
          {step.channel === 'email' ? 'Subiect email' : 'Titlu intern SMS'}
        </label>
        <input
          id={`subject-${step.id}`}
          type="text"
          value={step.subject}
          onChange={(event) => onChange({ subject: event.target.value })}
          placeholder={
          step.channel === 'email' ?
          'Ex.: Ce urmează după webinar' :
          'Ex.: Reminder apel'
          }
          className={fieldClass} />
        
      </div>

      <div className="mt-3">
        <label className={labelClass} htmlFor={`body-${step.id}`}>
          {step.channel === 'email' ? 'Conținut email' : 'Text SMS'}
        </label>
        <textarea
          id={`body-${step.id}`}
          rows={step.channel === 'email' ? 8 : 3}
          value={step.body}
          maxLength={step.channel === 'sms' ? SMS_LIMIT : undefined}
          onChange={(event) => onChange({ body: event.target.value })}
          className={`${fieldClass} resize-y font-normal leading-relaxed`} />
        
        <div className="mt-1.5 flex flex-wrap items-center justify-between gap-2">
          <p className="text-[11px] text-ink-500">
            Variabile: {'{{prenume}}'}, {'{{ora}}'}, {'{{link_calendar}}'}
          </p>
          {step.channel === 'sms' &&
          <p className="text-[11px] font-bold text-ink-500">
              {step.body.length}/{SMS_LIMIT} caractere
            </p>
          }
        </div>
      </div>
    </div>);

}