import React, { useState } from 'react';
import {
  SearchIcon,
  BellIcon,
  ChevronDownIcon,
  MenuIcon,
  UserIcon,
  CreditCardIcon,
  LogOutIcon,
  UserPlusIcon,
  LifeBuoyIcon } from
'lucide-react';
import type { View } from './Sidebar';
import { useWorkspace } from '../contexts/WorkspaceContext';
import { NotificationsPanel } from './NotificationsPanel';

interface TopbarProps {
  view: View;
  onNavigate: (view: View) => void;
}

const tabs: {label: string;value: View;}[] = [
{ label: 'Panou', value: 'dashboard' },
{ label: 'Calendar', value: 'calendar' },
{ label: 'Automatizări', value: 'automations' },
{ label: 'Rapoarte', value: 'reports' }];


const accountLinks: {
  label: string;
  icon: typeof UserIcon;
  view?: View;
}[] = [
{ label: 'Contul meu', icon: UserIcon, view: 'account' },
{ label: 'Informații facturare', icon: CreditCardIcon, view: 'billing' },
{ label: 'Deloghează-te', icon: LogOutIcon }];


export function Topbar({ view, onNavigate }: TopbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { activeUser } = useWorkspace();
  const displayName = activeUser ?? 'Andreas Bălan';
  const initials = displayName.
  split(' ').
  map((part) => part[0]).
  join('').
  slice(0, 2);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-md">
      <div className="flex items-center gap-3 px-4 py-3 sm:px-6">
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-lg text-ink transition-colors duration-150 ease-out hover:bg-slate-50 lg:hidden"
          aria-label="Deschide meniul">
          
          <MenuIcon className="h-5 w-5" aria-hidden="true" />
        </button>

        <div className="flex rounded-xl bg-slate-100 p-1 lg:hidden">
          {tabs.map((tab) =>
          <button
            key={tab.value}
            type="button"
            onClick={() => onNavigate(tab.value)}
            aria-current={view === tab.value ? 'page' : undefined}
            className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors duration-150 ease-out ${
            view === tab.value ?
            'bg-white text-brand-700 shadow-sm' :
            'text-ink-700'}`
            }>
            
              {tab.label}
            </button>
          )}
        </div>

        <div className="relative hidden min-w-0 max-w-md flex-1 sm:block">
          <SearchIcon
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-500"
            aria-hidden="true" />
          
          <input
            type="search"
            placeholder="Caută proiecte, contacte, facturi…"
            aria-label="Căutare globală"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm text-ink placeholder:text-ink-500 focus:border-brand-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-100" />
          
        </div>

        <div className="ml-auto flex items-center gap-2">
          <NotificationsPanel />

          <div
            className="relative"
            onMouseEnter={() => setMenuOpen(true)}
            onMouseLeave={() => setMenuOpen(false)}>
            
            <button
              type="button"
              onFocus={() => setMenuOpen(true)}
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              className="flex items-center gap-2 rounded-xl border border-slate-200 py-1.5 pl-1.5 pr-2.5 transition-colors duration-150 ease-out hover:border-brand-200 hover:bg-brand-50">
              
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-ink font-display text-[11px] font-bold text-white">
                {initials}
              </span>
              <span className="hidden text-sm font-semibold text-ink sm:block">
                {displayName}
              </span>
              <ChevronDownIcon
                className={`h-4 w-4 text-ink-500 transition-transform duration-150 ease-out ${menuOpen ? 'rotate-180' : ''}`}
                aria-hidden="true" />
              
            </button>

            {menuOpen &&
            <div
              role="menu"
              className="absolute right-0 top-full z-30 w-64 pt-2">
              
                <div className="rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
                  <div className="px-2.5 pb-2 pt-1">
                    <p className="font-display text-sm font-bold text-ink">
                      {displayName}
                    </p>
                    <p className="text-xs text-ink-500">
                      {activeUser ?
                    `${activeUser.split(' ')[0].toLowerCase()}@eliteclosers.ro` :
                    'andreas@eliteclosers.ro'}
                    </p>
                  </div>

                  {accountLinks.map((item) =>
                <button
                  key={item.label}
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    if (item.view) {
                      setMenuOpen(false);
                      onNavigate(item.view);
                    }
                  }}
                  className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm font-semibold text-ink-700 transition-colors duration-150 ease-out hover:bg-slate-50 hover:text-brand-700">
                  
                      <item.icon
                    className="h-4 w-4 text-ink-500"
                    aria-hidden="true" />
                  
                      {item.label}
                    </button>
                )}

                  <div className="mt-2 border-t border-slate-100 pt-2">
                    <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setMenuOpen(false);
                      onNavigate('support');
                    }}
                    className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm font-semibold text-ink-700 transition-colors duration-150 ease-out hover:bg-slate-50 hover:text-brand-700">
                    
                      <LifeBuoyIcon
                      className="h-4 w-4 text-ink-500"
                      aria-hidden="true" />
                    
                      Contactează suport
                    </button>
                  </div>

                  <div className="mt-2 border-t border-slate-100 pt-2">
                    <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setMenuOpen(false);
                      onNavigate('createSubAccount');
                    }}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-500 px-3 py-2.5 font-display text-sm font-bold text-white transition-colors duration-150 ease-out hover:bg-brand-600">
                    
                      <UserPlusIcon
                      className="h-4 w-4"
                      strokeWidth={2.5}
                      aria-hidden="true" />
                    
                      Creează sub-account
                    </button>
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    </header>);

}