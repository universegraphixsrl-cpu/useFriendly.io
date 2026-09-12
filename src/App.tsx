import React, { useState } from 'react';
import { ChevronRightIcon } from 'lucide-react';
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams } from
'react-router-dom';
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
import { UiActionsProvider } from './contexts/UiActionsContext';
import { roleOf } from './data/subAccounts';
import { crmModules, type CrmModule } from './data/modules';
import { modulePath, viewFromPath, viewPath } from './appRoutes';

function AppShell({
  addedModules,
  onAddModule,
  theme,
  setTheme }: {
  addedModules: CrmModule[];
  onAddModule: (module: CrmModule) => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}) {
  const { activeUser, setActiveUser } = useWorkspace();
  const navigate = useNavigate();
  const location = useLocation();
  const view = viewFromPath(location.pathname);
  const [sidebarOpen, setSidebarOpen] = useState(
    () => typeof window !== 'undefined' && window.innerWidth >= 1024
  );

  const go = (next: View) => {
    if (next === 'module') return;
    navigate(viewPath[next]);
  };

  const activeModuleName =
  location.pathname.startsWith('/modules/') && location.pathname !== '/modules' ?
  decodeURIComponent(location.pathname.slice('/modules/'.length)) :
  null;
  const activeModule =
  crmModules.find((item) => item.name === activeModuleName) ?? null;

  void setTheme;

  return (
    <div
      className={`flex min-h-full w-full bg-slate-50 font-sans text-ink ${theme === 'dark' ? 'theme-dark' : ''}`}>
      
      {sidebarOpen &&
      <button
        type="button"
        aria-label="Închide meniul"
        onClick={() => setSidebarOpen(false)}
        className="fixed inset-0 z-40 bg-ink/40 lg:hidden" />

      }
      {sidebarOpen ?
      <Sidebar
        onCollapse={() => setSidebarOpen(false)}
        view={view}
        onNavigate={go}
        addedModules={addedModules}
        onAddModule={(module) => {
          onAddModule(module);
          navigate(viewPath.dashboard);
        }}
        activeModule={activeModule}
        onOpenModule={(module) => navigate(modulePath(module.name))}
        activeUser={activeUser}
        onImpersonate={(name) => {
          setActiveUser(name);
          navigate(viewPath.dashboard);
        }}
        onExitImpersonation={() => {
          setActiveUser(null);
          navigate(viewPath.dashboard);
        }} /> :


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
        <Topbar
          view={view}
          onNavigate={go}
          onOpenMenu={() => setSidebarOpen(true)} />
        
        <main
          className={`mx-auto w-full flex-1 px-4 py-6 sm:px-6 sm:py-8 ${
          sidebarOpen ? 'max-w-7xl' : 'max-w-none lg:pl-10'}`
          }>
          
          <Outlet />
        </main>
      </div>
    </div>);

}

function DashboardRoute() {
  const { activeUser } = useWorkspace();
  return activeUser ?
  <SubAccountDashboard name={activeUser} role={roleOf(activeUser)} /> :

  <Dashboard />;

}

function SupportRoute() {
  const navigate = useNavigate();
  return <Support onOpenCallBooking={() => navigate(viewPath.supportCall)} />;
}

function SupportCallRoute() {
  const navigate = useNavigate();
  return <SupportCall onBack={() => navigate(viewPath.support)} />;
}

function ModulesRoute({
  addedModules,
  onAddModule,
  onPreview }: {
  addedModules: CrmModule[];
  onAddModule: (module: CrmModule) => void;
  onPreview: (module: CrmModule) => void;
}) {
  const navigate = useNavigate();
  return (
    <Modules
      addedModules={addedModules}
      onAddModule={(module) => {
        onAddModule(module);
        navigate(viewPath.dashboard);
      }}
      onPreviewModule={(module) => {
        onPreview(module);
        navigate(modulePath(module.name));
      }} />);

}

function ModulePage({
  hiddenTutorials,
  onDismissTutorial }: {
  hiddenTutorials: string[];
  onDismissTutorial: (name: string) => void;
}) {
  const { moduleName } = useParams();
  const name = moduleName ? decodeURIComponent(moduleName) : '';
  const module = crmModules.find((item) => item.name === name);
  if (!module) return <Navigate to={viewPath.modules} replace />;
  return (
    <ModuleWorkspace
      module={module}
      showTutorial={!hiddenTutorials.includes(module.name)}
      onDismissTutorial={() => onDismissTutorial(module.name)} />);

}

export function App() {
  const [addedModules, setAddedModules] = useState<CrmModule[]>([]);
  const [hiddenTutorials, setHiddenTutorials] = useState<string[]>([]);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const addModule = (module: CrmModule) => {
    setAddedModules((current) =>
    current.some((item) => item.name === module.name) ?
    current :
    [...current, module]
    );
  };

  return (
    <BrowserRouter>
      <WorkspaceProvider>
        <UiActionsProvider>
          <Routes>
            <Route
              element={
              <AppShell
                addedModules={addedModules}
                onAddModule={(module) => {
                  addModule(module);
                }}
                theme={theme}
                setTheme={setTheme} />

              }>
              
              <Route path="/" element={<DashboardRoute />} />
              <Route path="/leads" element={<Leads />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/automations" element={<Automations />} />
              <Route path="/marketing" element={<Marketing />} />
              <Route path="/web" element={<WebBuilder />} />
              <Route path="/payments" element={<PaymentLinks />} />
              <Route path="/materials" element={<Materials />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/support" element={<SupportRoute />} />
              <Route path="/support/call" element={<SupportCallRoute />} />
              <Route path="/integrations" element={<IntegrationsCatalog />} />
              <Route path="/tutorials" element={<Tutorials />} />
              <Route
                path="/account"
                element={<Account theme={theme} onThemeChange={setTheme} />} />
              
              <Route path="/billing" element={<Billing />} />
              <Route
                path="/modules"
                element={
                <ModulesRoute
                  addedModules={addedModules}
                  onAddModule={addModule}
                  onPreview={(module) =>
                  setHiddenTutorials((current) =>
                  current.filter((name) => name !== module.name)
                  )
                  } />

                } />
              
              <Route
                path="/modules/:moduleName"
                element={
                <ModulePage
                  hiddenTutorials={hiddenTutorials}
                  onDismissTutorial={(name) =>
                  setHiddenTutorials((current) =>
                  current.includes(name) ? current : [...current, name]
                  )
                  } />

                } />
              
              <Route path="/sub-accounts/new" element={<CreateSubAccount />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </UiActionsProvider>
      </WorkspaceProvider>
    </BrowserRouter>);

}
