import type { View } from './components/Sidebar';

export const viewPath: Record<View, string> = {
  dashboard: '/',
  leads: '/leads',
  tasks: '/tasks',
  calendar: '/calendar',
  automations: '/automations',
  marketing: '/marketing',
  webBuilder: '/web',
  payments: '/payments',
  materials: '/materials',
  reports: '/reports',
  support: '/support',
  supportCall: '/support/call',
  integrations: '/integrations',
  tutorials: '/tutorials',
  account: '/account',
  billing: '/billing',
  modules: '/modules',
  module: '/modules',
  createSubAccount: '/sub-accounts/new'
};

export function modulePath(name: string) {
  return `/modules/${encodeURIComponent(name)}`;
}

export function viewFromPath(pathname: string): View {
  if (pathname === '/') return 'dashboard';
  if (pathname === '/support/call') return 'supportCall';
  if (pathname === '/sub-accounts/new') return 'createSubAccount';
  if (pathname === '/modules') return 'modules';
  if (pathname.startsWith('/modules/')) return 'module';
  const match = (Object.entries(viewPath) as Array<[View, string]>).find(
    ([view, path]) => view !== 'module' && view !== 'dashboard' && path === pathname
  );
  return match?.[0] ?? 'dashboard';
}
