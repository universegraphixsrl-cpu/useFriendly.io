import React, { useState } from 'react';
import {
  ArrowLeftIcon,
  LayoutDashboardIcon,
  UsersIcon,
  CalendarDaysIcon,
  CheckSquareIcon,
  ZapIcon,
  BellIcon,
  GraduationCapIcon,
  BarChart3Icon,
  PlugIcon,
  PlusIcon,
  ArrowRightIcon,
  UsersRoundIcon,
  ChevronRightIcon,
  MegaphoneIcon,
  LifeBuoyIcon,
  CreditCardIcon } from
'lucide-react';
import {
  PlayCircleIcon,
  LayoutTemplateIcon,
  ChevronLeftIcon } from
'lucide-react';
import { crmModules, type CrmModule } from '../data/modules';
import { subAccounts, subAccountsTotal } from '../data/subAccounts';
import { useWorkspace } from '../contexts/WorkspaceContext';
import { useUiActions } from '../contexts/UiActionsContext';

export type View =
'dashboard' |
'reports' |
'automations' |
'calendar' |
'modules' |
'module' |
'tasks' |
'account' |
'billing' |
'support' |
'supportCall' |
'createSubAccount' |
'integrations' |
'tutorials' |
'leads' |
'marketing' |
'materials' |
'payments' |
'webBuilder';

interface SidebarProps {
  view: View;
  onNavigate: (view: View) => void;
  addedModules: CrmModule[];
  onAddModule: (module: CrmModule) => void;
  activeModule: CrmModule | null;
  onOpenModule: (module: CrmModule) => void;
  /** null = contul de admin */
  activeUser: string | null;
  onImpersonate: (name: string) => void;
  onExitImpersonation: () => void;
  /** Ascunde meniul, ca secțiunea curentă să ocupe tot ecranul */
  onCollapse: () => void;
}

/** Secțiunile pe care le vede un sub-account */
const subAccountViews: View[] = [
'dashboard',
'leads',
'tasks',
'calendar',
'materials',
'reports'];


const primaryNav = [
{ label: 'Panou general', icon: LayoutDashboardIcon, view: 'dashboard' as View },
{
  label: 'Leads & Clients',
  icon: UsersIcon,
  badge: '4',
  view: 'leads' as View
},
{
  label: 'Task-uri',
  icon: CheckSquareIcon,
  badge: '5',
  view: 'tasks' as View
},
{
  label: 'Calendar',
  icon: CalendarDaysIcon,
  badge: '6',
  view: 'calendar' as View
},
{
  label: 'Automatizări',
  icon: ZapIcon,
  badge: '8',
  view: 'automations' as View
},
{
  label: 'Marketing',
  icon: MegaphoneIcon,
  badge: '3',
  view: 'marketing' as View
},
{
  label: 'Web builder',
  icon: LayoutTemplateIcon,
  view: 'webBuilder' as View
},
{
  label: 'Linkuri de plată',
  icon: CreditCardIcon,
  view: 'payments' as View
},
{
  label: 'Materiale & proceduri',
  icon: GraduationCapIcon,
  view: 'materials' as View
},
{ label: 'Rapoarte', icon: BarChart3Icon, view: 'reports' as View }];


const secondaryNav: {label: string;icon: typeof PlugIcon;view: View;}[] = [
{ label: 'Primește ajutor', icon: LifeBuoyIcon, view: 'support' },
{ label: 'Integrări', icon: PlugIcon, view: 'integrations' },
{ label: 'Tutoriale Friendly', icon: PlayCircleIcon, view: 'tutorials' }];


const suggestedModules = crmModules.slice(0, 6);

export function Sidebar({
  view,
  onNavigate,
  addedModules,
  onAddModule,
  activeModule,
  onOpenModule,
  activeUser,
  onImpersonate,
  onExitImpersonation,
  onCollapse
}: SidebarProps) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [subAccountsOpen, setSubAccountsOpen] = useState(false);
  const { unseenTasksFor, unseenSectionFor, markSectionSeen, openTasksFor } =
  useWorkspace();
  const { runLabel } = useUiActions();

  const impersonating = activeUser !== null;
  const navItems = impersonating ?
  primaryNav.filter((item) => subAccountViews.includes(item.view)) :
  primaryNav;
  const newTasks = activeUser ? unseenTasksFor(activeUser).length : 0;

  return (
    <aside className="relative z-50 flex w-64 shrink-0 flex-col border-r border-slate-200 bg-white max-lg:fixed max-lg:inset-y-0 max-lg:left-0 max-lg:shadow-2xl">
      <button
        type="button"
        onClick={onCollapse}
        aria-label="Ascunde meniul"
        title="Ascunde meniul"
        className="sidebar-toggle absolute -right-3 top-6 z-30 flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white text-ink-500 shadow-sm transition-colors duration-150 ease-out hover:border-brand-300 hover:text-brand-600">
        
        <ChevronLeftIcon className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden="true" />
      </button>

      <div className="flex items-center gap-2.5 px-5 py-5">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500 font-display text-sm font-semibold text-white">
          F
        </span>
        <span className="font-display text-lg font-medium tracking-tight text-ink">
          Friendly
        </span>
      </div>

      <div className="relative px-4 pb-4">
        {impersonating ?
        <button
          type="button"
          onClick={onExitImpersonation}
          className="exit-impersonation flex w-full items-center justify-center gap-1.5 whitespace-nowrap rounded-xl bg-ink px-3 py-2.5 font-display text-xs font-bold text-white transition-colors duration-150 ease-out hover:bg-ink-700">
          
            <ArrowLeftIcon
            className="h-3.5 w-3.5 shrink-0"
            strokeWidth={2.5}
            aria-hidden="true" />
          
            Întoarce-te în contul tău
          </button> :

          <div className="space-y-2">
          <button
            type="button"
            onClick={() => runLabel('Proiect nou')}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-500 px-4 py-2.5 font-display text-sm font-bold text-white transition-colors duration-150 ease-out hover:bg-brand-600">
            
            <PlusIcon
            className="h-4 w-4"
            strokeWidth={2.5}
            aria-hidden="true" />
          
            Proiect nou
          </button>
          <button
            type="button"
            onClick={() => setPickerOpen((value) => !value)}
            aria-expanded={pickerOpen}
            aria-haspopup="menu"
            className="flex w-full items-center justify-center rounded-lg px-3 py-1.5 text-xs font-bold text-brand-600 hover:bg-brand-50">
            Adaugă un modul
          </button>
          </div>
        }

        {pickerOpen && !impersonating &&
        <>
            <button
            type="button"
            className="fixed inset-0 z-10 cursor-default"
            onClick={() => setPickerOpen(false)}
            tabIndex={-1}
            aria-label="Închide lista de module" />
          
            <div
            role="menu"
            className="absolute left-4 right-0 top-[calc(100%-0.5rem)] z-20 w-72 rounded-xl border border-slate-200 bg-white py-2 shadow-xl">
            
              <p className="px-3.5 pb-1.5 text-[11px] font-bold uppercase tracking-wide text-ink-500">
                Adaugă un modul în meniu
              </p>
              {suggestedModules.map((module) =>
            <button
              key={module.name}
              type="button"
              role="menuitem"
              onClick={() => {
                setPickerOpen(false);
                onAddModule(module);
              }}
              className="flex w-full items-start gap-2.5 px-3.5 py-2 text-left transition-colors duration-150 ease-out hover:bg-slate-50">
              
                  <span className="text-base leading-5" aria-hidden="true">
                    {module.emoji}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-ink">
                      {module.name}
                    </span>
                    <span className="block truncate text-xs text-ink-500">
                      {module.description}
                    </span>
                  </span>
                </button>
            )}

              <div className="mt-1 border-t border-slate-100 pt-1">
                <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setPickerOpen(false);
                  onNavigate('modules');
                }}
                className="flex w-full items-center justify-between gap-2 px-3.5 py-2.5 text-left text-sm font-bold text-brand-600 transition-colors duration-150 ease-out hover:bg-brand-50">
                
                  Vezi toate cele {crmModules.length} de module
                  <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          </>
        }
      </div>

      <nav
        className="flex flex-1 flex-col gap-1 px-3 pb-6"
        aria-label="Navigație principală">
        
        {navItems.map((item) => {
          const active = item.view !== undefined && item.view === view;
          const openTasks = item.view === 'tasks' ? openTasksFor(activeUser) : 0;
          const alertCount =
          impersonating && item.view ?
          item.view === 'tasks' ?
          0 :
          item.view === 'leads' ||
          item.view === 'calendar' ||
          item.view === 'materials' ?
          unseenSectionFor(activeUser as string, item.view) :
          0 :
          0;
          return (
            <button
              key={item.label}
              type="button"
              onClick={
              item.view ?
              () => {
                if (
                activeUser && (
                item.view === 'leads' ||
                item.view === 'calendar' ||
                item.view === 'materials'))
                {
                  markSectionSeen(activeUser, item.view);
                }
                onNavigate(item.view as View);
              } :
              undefined
              }
              aria-current={active ? 'page' : undefined}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors duration-150 ease-out ${
              active ?
              'bg-brand-50 text-brand-700' :
              'text-ink-700 hover:bg-slate-50 hover:text-brand-600'}`
              }>
              
              <item.icon className="h-[18px] w-[18px]" aria-hidden="true" />
              <span className="flex-1 text-left">{item.label}</span>
              {item.view === 'tasks' ?
              openTasks > 0 &&
              <span
                className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                newTasks > 0 ?
                'bg-brand-500 text-white' :
                'bg-slate-100 text-ink-500'}`
                }>
                
                    {openTasks}
                  </span> :


              alertCount > 0 &&
              <span className="rounded-full bg-brand-500 px-2 py-0.5 text-[11px] font-bold text-white">
                    {alertCount}
                  </span>

              }
            </button>);

        })}

        {!impersonating && addedModules.length > 0 &&
        <>
            <p className="mt-4 px-3 pb-1 text-[11px] font-bold uppercase tracking-wide text-ink-500">
              Module adăugate
            </p>
            {addedModules.map((module) =>
          <button
            key={module.name}
            type="button"
            onClick={() => onOpenModule(module)}
            aria-current={
            view === 'module' && activeModule?.name === module.name ?
            'page' :
            undefined
            }
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-semibold transition-colors duration-150 ease-out ${
            view === 'module' && activeModule?.name === module.name ?
            'bg-brand-50 text-brand-700' :
            'text-ink-700 hover:bg-slate-50 hover:text-brand-600'}`
            }>
            
                <span className="w-[18px] text-center text-base leading-none" aria-hidden="true">
                  {module.emoji}
                </span>
                <span className="flex-1 truncate">{module.name}</span>
              </button>
          )}
          </>
        }

        <div className="my-3 h-px bg-slate-100" />

        {!impersonating &&
        <div
          className="relative"
          onMouseEnter={() => setSubAccountsOpen(true)}
          onMouseLeave={() => setSubAccountsOpen(false)}>
          
          <button
            type="button"
            onFocus={() => setSubAccountsOpen(true)}
            aria-expanded={subAccountsOpen}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-ink-700 transition-colors duration-150 ease-out hover:bg-slate-50 hover:text-brand-600">
            
            <UsersRoundIcon className="h-[18px] w-[18px]" aria-hidden="true" />
            <span className="flex-1 text-left">Sub-accounts</span>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-ink-500">
              {subAccountsTotal}
            </span>
            <ChevronRightIcon
              className={`h-4 w-4 text-ink-500 transition-transform duration-150 ease-out ${subAccountsOpen ? 'rotate-90' : ''}`}
              aria-hidden="true" />
            
          </button>

          {subAccountsOpen &&
          <div className="absolute left-full top-0 z-40 w-72 pl-3">
              <div className="max-h-80 overflow-y-auto rounded-xl border border-slate-200 bg-white p-3 shadow-2xl">
                <p className="pb-2 text-[11px] font-bold uppercase tracking-wide text-ink-500">
                  Sub-accounts active · {subAccountsTotal}
                </p>
                {subAccounts.map((group) =>
              <div key={group.role} className="mb-3 last:mb-0">
                    <p className="flex items-center gap-2 pb-1 text-[11px] font-bold uppercase tracking-wide text-ink-500">
                      <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: group.color }}
                    aria-hidden="true" />
                  
                      {group.role}
                    </p>
                    {group.members.map((member) =>
                <button
                  key={member}
                  type="button"
                  onClick={() => {
                    setSubAccountsOpen(false);
                    onImpersonate(member);
                  }}
                  title={`Deschide contul lui ${member}`}
                  className="flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-left text-sm font-semibold text-ink-700 transition-colors duration-150 ease-out hover:bg-brand-50 hover:text-brand-600">
                  
                        <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: group.color }}
                    aria-hidden="true" />
                  
                        <span className="truncate">{member}</span>
                      </button>
                )}
                  </div>
              )}
              </div>
            </div>
          }
        </div>
        }

        {(impersonating ? secondaryNav.slice(0, 1) : secondaryNav).map((item) =>
        <button
          key={item.label}
          type="button"
          onClick={() => onNavigate(item.view)}
          aria-current={view === item.view ? 'page' : undefined}
          className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors duration-150 ease-out ${
          view === item.view ?
          'bg-brand-50 text-brand-700' :
          'text-ink-700 hover:bg-slate-50 hover:text-brand-600'}`
          }>
          
            <item.icon className="h-[18px] w-[18px]" aria-hidden="true" />
            {item.label}
          </button>
        )}


      </nav>

      <div className="border-t border-slate-100 px-4 py-4">
        {impersonating ?
        <p className="text-center text-xs font-semibold text-ink-500">
            Powered by Friendly
          </p> :

        <div className="rounded-xl bg-brand-50 p-4">
            <p className="font-display text-xs font-bold uppercase tracking-wide text-brand-600">
              Plan Growth
            </p>
            <p className="mt-1.5 text-sm leading-snug text-ink-700">
              7 din 10 locuri de utilizator folosite.
            </p>
            <button
            type="button"
            onClick={() => onNavigate('billing')}
            className="mt-3 text-sm font-bold text-brand-600 underline-offset-4 hover:underline">
            
              Extinde echipa →
            </button>
          </div>
        }
      </div>
    </aside>);

}