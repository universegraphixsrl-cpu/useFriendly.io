import React, { useState } from 'react';
import { ChevronRightIcon } from 'lucide-react';
import { Sidebar, type View } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { Dashboard } from './pages/Dashboard';
import { SubAccountDashboard } from './pages/SubAccountDashboard';
import { Reports } from './pages/Reports';
import { Automations } from './pages/Automations';
import { Calendar } from './pages/Calendar';
import { Modules } from './pages/Modules';
import { Tasks } from './pages/Tasks';
import { Account } from './pages/Account';
import { Billing } from './pages/Billing';
import { IntegrationsCatalog } from './pages/IntegrationsCatalog';
import { Tutorials } from './pages/Tutorials';
import { Leads } from './pages/Leads';
import { Marketing } from './pages/Marketing';
import { WebBuilder } from './pages/WebBuilder';
import { Materials } from './pages/Materials';
import { PaymentLinks } from './pages/PaymentLinks';
import { Support } from './pages/Support';
import { CreateSubAccount } from './pages/CreateSubAccount';
import { SupportCall } from './pages/SupportCall';
import { ModuleWorkspace } from './pages/ModuleWorkspace';
import {
  WorkspaceProvider,
  useWorkspace } from
'./contexts/WorkspaceContext';
import { roleOf } from './data/subAccounts';
import type { CrmModule } from './data/modules';

function Workspace() {
  const { activeUser, setActiveUser } = useWorkspace();
  const [view, setView] = useState<View>('webBuilder');
  const [addedModules, setAddedModules] = useState<CrmModule[]>([]);
  const [activeModule, setActiveModule] = useState<CrmModule | null>(null);
  const [hiddenTutorials, setHiddenTutorials] = useState<string[]>([]);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleAddModule = (module: CrmModule) => {
    setAddedModules((current) =>
    current.some((item) => item.name === module.name) ?
    current :
    [...current, module]
    );
    setView('dashboard');
  };

  const handleOpenModule = (module: CrmModule) => {
    setActiveModule(module);
    setView('module');
  };

  const handlePreviewModule = (module: CrmModule) => {
    setActiveModule(module);
    setHiddenTutorials((current) =>
    current.filter((name) => name !== module.name)
    );
    setView('module');
  };

  const handleDismissTutorial = (moduleName: string) => {
    setHiddenTutorials((current) =>
    current.includes(moduleName) ? current : [...current, moduleName]
    );
  };

  /** Intră în contul unui sub-account, direct pe panoul lui general */
  const handleImpersonate = (name: string) => {
    setActiveUser(name);
    setView('dashboard');
  };

  const handleExitImpersonation = () => {
    setActiveUser(null);
    setView('dashboard');
  };

  return (
    <div
      className={`flex min-h-full w-full bg-slate-50 font-sans text-ink ${theme === 'dark' ? 'theme-dark' : ''}`}>
      
      {sidebarOpen ?
      <Sidebar
        onCollapse={() => setSidebarOpen(false)}
        view={view}
        onNavigate={setView}
        addedModules={addedModules}
        onAddModule={handleAddModule}
        activeModule={activeModule}
        onOpenModule={handleOpenModule}
        activeUser={activeUser}
        onImpersonate={handleImpersonate}
        onExitImpersonation={handleExitImpersonation} /> :


      <button
        type="button"
        onClick={() => setSidebarOpen(true)}
        aria-label="Afișează meniul"
        title="Afișează meniul"
        className="sidebar-toggle fixed left-0 top-[4.5rem] z-50 hidden h-9 w-7 items-center justify-center rounded-r-lg border border-l-0 border-slate-200 bg-white text-ink-700 shadow-md transition-colors duration-150 ease-out hover:border-brand-300 hover:text-brand-600 lg:inline-flex">
        
          <ChevronRightIcon
          className="h-4 w-4"
          strokeWidth={2.5}
          aria-hidden="true" />
        
        </button>
      }

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar view={view} onNavigate={setView} />

        <main
          className={`mx-auto w-full flex-1 px-4 py-6 sm:px-6 sm:py-8 ${
          sidebarOpen ? 'max-w-7xl' : 'max-w-none lg:pl-10'}`
          }>
          
          {view === 'dashboard' && (
          activeUser ?
          <SubAccountDashboard
            name={activeUser}
            role={roleOf(activeUser)} /> :


          <Dashboard />)
          }
          {view === 'calendar' && <Calendar />}
          {view === 'tasks' && <Tasks />}
          {view === 'account' &&
          <Account theme={theme} onThemeChange={setTheme} />
          }
          {view === 'billing' && <Billing />}
          {view === 'integrations' && <IntegrationsCatalog />}
          {view === 'tutorials' && <Tutorials />}
          {view === 'leads' && <Leads />}
          {view === 'marketing' && <Marketing />}
        {view === 'webBuilder' && <WebBuilder />}
          {view === 'payments' && <PaymentLinks />}
          {view === 'materials' && <Materials />}
          {view === 'createSubAccount' && <CreateSubAccount />}
          {view === 'support' &&
          <Support onOpenCallBooking={() => setView('supportCall')} />
          }
          {view === 'supportCall' &&
          <SupportCall onBack={() => setView('support')} />
          }
          {view === 'automations' && <Automations />}
          {view === 'reports' && <Reports />}
          {view === 'modules' &&
          <Modules
            addedModules={addedModules}
            onAddModule={handleAddModule}
            onPreviewModule={handlePreviewModule} />

          }
          {view === 'module' && activeModule &&
          <ModuleWorkspace
            module={activeModule}
            showTutorial={!hiddenTutorials.includes(activeModule.name)}
            onDismissTutorial={() =>
            handleDismissTutorial(activeModule.name)
            } />

          }
        </main>
      </div>
    </div>);

}

export function App() {
  return (
    <WorkspaceProvider>
      <Workspace />
    </WorkspaceProvider>);

}