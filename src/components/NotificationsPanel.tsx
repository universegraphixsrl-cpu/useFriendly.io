import React, { useEffect, useRef, useState } from 'react';
import {
  BellIcon,
  SendIcon,
  CheckIcon,
  ChevronLeftIcon,
  PenSquareIcon,
  ActivityIcon } from
'lucide-react';
import { subAccounts } from '../data/subAccounts';
import {
  systemNotifications,
  agentNotifications,
  type TeamMessage } from
'../data/notifications';
import { useWorkspace } from '../contexts/WorkspaceContext';

const ADMIN = 'Andreas Bălan';

const colorOf = (name: string) =>
subAccounts.find((group) => group.members.includes(name))?.color ?? '#0f1729';

/** Clopoțelul din bara de sus: notificări de sistem + chat cu echipa */
export function NotificationsPanel() {
  const { activeUser, messages, sendMessage, markMessagesRead } = useWorkspace();
  const isSub = activeUser !== null;
  const me = activeUser ?? ADMIN;

  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<'activity' | 'messages'>('activity');
  const [thread, setThread] = useState<string | null>(null);
  const [composing, setComposing] = useState(false);
  const [recipients, setRecipients] = useState<string[]>([]);
  const [text, setText] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKey);
    };
  }, [open]);

  const notifications = isSub ?
  agentNotifications(activeUser) :
  systemNotifications;

  const unread = messages.filter(
    (message) => message.to.includes(me) && !message.readBy.includes(me)
  ).length;

  /** Partenerii de conversație ai contului curent */
  const counterparts = isSub ?
  [ADMIN] :
  Array.from(
    new Set(
      messages.flatMap((message) =>
      message.from === me ? message.to : [message.from]
      )
    )
  ).filter((name) => name !== me);

  const threadMessages = (person: string) =>
  messages.
  filter(
    (message) =>
    message.from === person && message.to.includes(me) ||
    message.from === me && message.to.includes(person)
  ).
  slice().
  reverse();

  const unreadFrom = (person: string) =>
  messages.filter(
    (message) =>
    message.from === person &&
    message.to.includes(me) &&
    !message.readBy.includes(me)
  ).length;

  const openThread = (person: string) => {
    setThread(person);
    setComposing(false);
    markMessagesRead(me, person);
  };

  const toggleRecipient = (name: string) =>
  setRecipients((current) =>
  current.includes(name) ?
  current.filter((item) => item !== name) :
  [...current, name]
  );

  const push = (to: string[], body: string) => {
    const message: TeamMessage = {
      id: `msg-${Date.now()}`,
      from: me,
      to,
      text: body,
      time: 'acum câteva secunde',
      readBy: []
    };
    sendMessage(message);
    setText('');
  };

  const allMembers = subAccounts.flatMap((group) => group.members);

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="dialog"
        className={`relative flex h-10 w-10 items-center justify-center rounded-lg transition-colors duration-150 ease-out ${
        open ?
        'bg-brand-50 text-brand-600' :
        'text-ink-700 hover:bg-slate-50 hover:text-brand-600'}`
        }
        aria-label="Notificări și mesaje">
        
        <BellIcon className="h-5 w-5" aria-hidden="true" />
        {unread > 0 &&
        <span className="absolute right-0.5 top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-brand-500 px-1 text-[10px] font-bold text-white">
            {unread}
          </span>
        }
      </button>

      {open &&
      <div className="absolute right-0 top-full z-40 mt-2 w-[22rem] rounded-xl border border-slate-200 bg-white shadow-2xl">
          <div className="flex gap-1 border-b border-slate-100 p-2">
            <button
            type="button"
            onClick={() => setTab('activity')}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold transition-colors duration-150 ease-out ${
            tab === 'activity' ?
            'bg-brand-50 text-brand-700' :
            'text-ink-700 hover:bg-slate-50'}`
            }>
            
              <ActivityIcon className="h-3.5 w-3.5" aria-hidden="true" />
              Notificări
            </button>
            <button
            type="button"
            onClick={() => setTab('messages')}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold transition-colors duration-150 ease-out ${
            tab === 'messages' ?
            'bg-brand-50 text-brand-700' :
            'text-ink-700 hover:bg-slate-50'}`
            }>
            
              <SendIcon className="h-3.5 w-3.5" aria-hidden="true" />
              Mesaje
              {unread > 0 &&
            <span className="rounded-full bg-brand-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                  {unread}
                </span>
            }
            </button>
          </div>

          {tab === 'activity' &&
        <ul className="max-h-96 divide-y divide-slate-100 overflow-y-auto">
              {notifications.map((item) =>
          <li key={item.id} className="px-4 py-3">
                  <p className="text-sm text-ink">
                    <span className="font-bold">{item.actor}</span>{' '}
                    {item.action}
                  </p>
                  <p className="mt-0.5 text-[11px] text-ink-500">{item.time}</p>
                </li>
          )}
            </ul>
        }

          {tab === 'messages' && thread === null && !composing &&
        <div>
              <ul className="max-h-80 divide-y divide-slate-100 overflow-y-auto">
                {counterparts.length === 0 &&
            <li className="px-4 py-6 text-center text-xs text-ink-500">
                    Nicio conversație încă.
                  </li>
            }
                {counterparts.map((person) => {
              const list = threadMessages(person);
              const last = list[list.length - 1];
              const count = unreadFrom(person);
              return (
                <li key={person}>
                      <button
                    type="button"
                    onClick={() => openThread(person)}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors duration-150 ease-out hover:bg-slate-50">
                    
                        <span
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[11px] font-bold text-white"
                      style={{ backgroundColor: colorOf(person) }}
                      aria-hidden="true">
                      
                          {person.
                      split(' ').
                      map((part) => part[0]).
                      join('').
                      slice(0, 2)}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-bold text-ink">
                            {person}
                          </span>
                          <span className="block truncate text-xs text-ink-500">
                            {last ?
                        `${last.from === me ? 'Tu: ' : ''}${last.text}` :
                        'Conversație nouă'}
                          </span>
                        </span>
                        {count > 0 &&
                    <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-brand-500 px-1.5 text-[10px] font-bold text-white">
                            {count}
                          </span>
                    }
                      </button>
                    </li>);

            })}
              </ul>
              {!isSub &&
          <div className="border-t border-slate-100 p-3">
                  <button
              type="button"
              onClick={() => setComposing(true)}
              className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-brand-500 px-3 py-2 text-xs font-bold text-white transition-colors duration-150 ease-out hover:bg-brand-600">
              
                    <PenSquareIcon className="h-3.5 w-3.5" aria-hidden="true" />
                    Mesaj nou către echipă
                  </button>
                </div>
          }
            </div>
        }

          {tab === 'messages' && thread !== null &&
        <div className="flex h-[26rem] flex-col">
              <div className="flex items-center gap-2 border-b border-slate-100 px-3 py-2.5">
                <button
              type="button"
              onClick={() => setThread(null)}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-ink-500 transition-colors duration-150 ease-out hover:bg-slate-50 hover:text-brand-600"
              aria-label="Înapoi la conversații">
              
                  <ChevronLeftIcon className="h-4 w-4" aria-hidden="true" />
                </button>
                <span
              className="flex h-7 w-7 items-center justify-center rounded-lg text-[10px] font-bold text-white"
              style={{ backgroundColor: colorOf(thread) }}
              aria-hidden="true">
              
                  {thread.
              split(' ').
              map((part) => part[0]).
              join('').
              slice(0, 2)}
                </span>
                <p className="font-display text-sm font-bold text-ink">
                  {thread}
                </p>
              </div>

              <ul className="flex-1 space-y-2 overflow-y-auto p-3">
                {threadMessages(thread).map((message) => {
              const mine = message.from === me;
              const seen =
              mine && message.to.every((n) => message.readBy.includes(n));
              return (
                <li
                  key={message.id}
                  className={`flex flex-col ${mine ? 'items-end' : 'items-start'}`}>
                  
                      <span
                    className={`max-w-[85%] rounded-2xl px-3 py-2 text-xs ${
                    mine ?
                    'rounded-br-sm bg-brand-500 text-white' :
                    'rounded-bl-sm bg-slate-100 text-ink'}`
                    }>
                    
                        {message.text}
                      </span>
                      <span className="mt-1 flex items-center gap-1.5 text-[10px] text-ink-500">
                        {message.time}
                        {seen &&
                    <span className="inline-flex items-center gap-0.5 text-ink-500">
                            <CheckIcon className="h-3 w-3" aria-hidden="true" />
                            Văzut
                          </span>
                    }
                      </span>
                    </li>);

            })}
              </ul>

              <div className="flex items-end gap-2 border-t border-slate-100 p-3">
                <label htmlFor="chatInput" className="sr-only">
                  Mesaj către {thread}
                </label>
                <textarea
              id="chatInput"
              value={text}
              onChange={(event) => setText(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault();
                  if (text.trim()) push([thread], text.trim());
                }
              }}
              rows={1}
              placeholder="Scrie un mesaj…"
              className="max-h-24 flex-1 resize-none rounded-xl border border-slate-200 px-3 py-2 text-xs text-ink placeholder:text-ink-500 focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-100" />
            
                <button
              type="button"
              disabled={text.trim().length === 0}
              onClick={() => push([thread], text.trim())}
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-500 text-white transition-colors duration-150 ease-out hover:bg-brand-600 disabled:bg-slate-200 disabled:text-ink-500"
              aria-label="Trimite mesajul">
              
                  <SendIcon className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>
        }

          {tab === 'messages' && composing &&
        <div className="max-h-[26rem] overflow-y-auto p-4">
              <button
            type="button"
            onClick={() => setComposing(false)}
            className="mb-3 inline-flex items-center gap-1.5 text-xs font-semibold text-ink-500 transition-colors duration-150 ease-out hover:text-brand-600">
            
                <ChevronLeftIcon className="h-3.5 w-3.5" aria-hidden="true" />
                Înapoi la conversații
              </button>

              <div className="flex items-center gap-2">
                <button
              type="button"
              onClick={() =>
              setRecipients(
                recipients.length === allMembers.length ? [] : allMembers
              )
              }
              className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-[11px] font-bold text-ink-700 transition-colors duration-150 ease-out hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700">
              
                  Toată echipa
                </button>
                <span className="text-[11px] text-ink-500">
                  {recipients.length} selectați
                </span>
              </div>

              <div className="mt-2 max-h-44 overflow-y-auto rounded-xl border border-slate-200 p-2">
                {subAccounts.map((group) =>
            <div key={group.role} className="mb-2 last:mb-0">
                    <p className="flex items-center gap-2 pb-1 text-[10px] font-bold uppercase tracking-wide text-ink-500">
                      <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: group.color }}
                  aria-hidden="true" />
                
                      {group.role}
                    </p>
                    {group.members.map((member) => {
                const selected = recipients.includes(member);
                return (
                  <button
                    key={member}
                    type="button"
                    onClick={() => toggleRecipient(member)}
                    aria-pressed={selected}
                    className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs font-semibold transition-colors duration-150 ease-out ${
                    selected ?
                    'bg-brand-50 text-brand-700' :
                    'text-ink-700 hover:bg-slate-50'}`
                    }>
                    
                          <span
                      className="h-2 w-2 shrink-0 rounded-full"
                      style={{ backgroundColor: group.color }}
                      aria-hidden="true" />
                    
                          <span className="flex-1">{member}</span>
                          {selected &&
                    <CheckIcon
                      className="h-3.5 w-3.5"
                      aria-hidden="true" />

                    }
                        </button>);

              })}
                  </div>
            )}
              </div>

              <label htmlFor="teamMessage" className="sr-only">
                Mesaj
              </label>
              <textarea
            id="teamMessage"
            value={text}
            onChange={(event) => setText(event.target.value)}
            rows={3}
            placeholder="Scrie mesajul…"
            className="mt-3 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-ink placeholder:text-ink-500 focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-100" />
          
              <button
            type="button"
            disabled={text.trim().length === 0 || recipients.length === 0}
            onClick={() => {
              push(recipients, text.trim());
              setRecipients([]);
              setComposing(false);
            }}
            className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-brand-500 px-3 py-2 text-xs font-bold text-white transition-colors duration-150 ease-out hover:bg-brand-600 disabled:bg-slate-200 disabled:text-ink-500">
            
                <SendIcon className="h-3.5 w-3.5" aria-hidden="true" />
                Trimite mesajul
              </button>
            </div>
        }
        </div>
      }
    </div>);

}