/**
 * Test de fum: randează paginile principale pe server (fără browser) și
 * cade dacă vreuna crapă sau afișează „NaN”.
 *
 * Rulează-l în două feluri:
 *   npm run smoke       → cont nou, gol, cu baza de date conectată
 *   npm run smoke:demo  → datele fictive de lucru local
 *
 * A prins deja două erori reale: un `subAccounts is not defined` și
 * „NaN%” pe tabloul de bord al unui cont gol.
 */
import React from 'react';
import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../src/contexts/AuthContext';
import { WorkspaceProvider } from '../src/contexts/WorkspaceContext';
import { UiActionsProvider } from '../src/contexts/UiActionsContext';
import { Reports } from '../src/pages/Reports';
import { Leads } from '../src/pages/Leads';
import { Dashboard } from '../src/pages/Dashboard';
import { Tasks } from '../src/pages/Tasks';
import { Calendar } from '../src/pages/Calendar';
import { CreateSubAccount } from '../src/pages/CreateSubAccount';
import { WebBuilder } from '../src/pages/WebBuilder';
import { Marketing } from '../src/pages/Marketing';
import { PaymentLinks } from '../src/pages/PaymentLinks';
import { Materials } from '../src/pages/Materials';
import { Automations } from '../src/pages/Automations';
import { Billing } from '../src/pages/Billing';
import { Account } from '../src/pages/Account';

const pages: [string, React.ComponentType][] = [
  ['Reports', Reports],
  ['Leads', Leads],
  ['Dashboard', Dashboard],
  ['Tasks', Tasks],
  ['Calendar', Calendar],
  ['CreateSubAccount', CreateSubAccount],
  ['WebBuilder', WebBuilder],
  ['Marketing', Marketing],
  ['PaymentLinks', PaymentLinks],
  ['Materials', Materials],
  ['Automations', Automations],
  ['Billing', Billing],
  ['Account', () => <Account theme="light" onThemeChange={() => {}} />]
];

// Avertismentele de useLayoutEffect sunt normale la randarea pe server
const realError = console.error;
console.error = (...args: unknown[]) => {
  if (typeof args[0] === 'string' && args[0].includes('useLayoutEffect')) return;
  realError(...args);
};

let failed = false;
for (const [name, Page] of pages) {
  try {
    const html = renderToString(
      <MemoryRouter>
      <AuthProvider>
        <WorkspaceProvider>
          <UiActionsProvider>
            <Page />
          </UiActionsProvider>
        </WorkspaceProvider>
      </AuthProvider>
      </MemoryRouter>
    );
    const bad = /NaN|Infinity|undefined%/.exec(html);
    console.log(`OK   ${name}  (${html.length} chars)${bad ? '  !! ' + bad[0] : ''}`);
    if (bad) {
      failed = true;
      const all = [...html.matchAll(/NaN|Infinity|undefined%/g)];
      all.slice(0, 12).forEach((m) => {
        const at = m.index ?? 0;
        console.log('     …' + html.slice(Math.max(0, at - 160), at + 40).replace(/\s+/g, ' ') + '…');
      });
      console.log('     total: ' + all.length);
    }
  } catch (error) {
    console.log(`FAIL ${name}: ${(error as Error).message}`);
    failed = true;
  }
}
process.exit(failed ? 1 : 0);
