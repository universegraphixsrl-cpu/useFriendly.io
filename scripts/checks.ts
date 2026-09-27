/**
 * Verificări de calcul pentru rapoarte și pentru citirea datelor.
 * `npm run checks` — cade dacă vreo formulă începe să dea alt rezultat.
 */
import { leadsByMonth, funnelFromLeads, showUpTrendFromLeads, agentPerformanceFromLeads } from '../src/lib/reportsFromLeads';

const base = {
  listId: 'l1', owner: 'Ion Pop', caller: 'Ion Pop', firstName: 'A', lastName: 'B',
  phone: '', email: '', details: '', vocarooLink: '', zoomLink: '',
  paidAmount: 0, generatedAmount: 0, payments: [], documents: []
};
const lead = (id: string, addedOn: string, status: string, paid = 0) =>
  ({ ...base, id, addedOn, status, paidAmount: paid }) as any;

const now = new Date();
const iso = (monthsBack: number) => {
  const d = new Date(now.getFullYear(), now.getMonth() - monthsBack, 15);
  return d.toISOString().slice(0, 10);
};

const leads = [
  lead('1', iso(0), 'Semnat', 1000),
  lead('2', iso(0), 'A zis da'),
  lead('3', iso(0), 'Programat apel'),
  lead('4', iso(0), 'Înscris webinar'),
  lead('5', iso(2), 'Semnat', 500),
  lead('6', iso(9), 'Semnat', 999)  // în afara ferestrei de 8 luni
];

const check = (label: string, got: unknown, want: unknown) => {
  const ok = JSON.stringify(got) === JSON.stringify(want);
  console.log(`${ok ? 'OK  ' : 'FAIL'} ${label}` + (ok ? '' : `\n     got  ${JSON.stringify(got)}\n     want ${JSON.stringify(want)}`));
  if (!ok) process.exitCode = 1;
};

const buckets = leadsByMonth(leads);
check('8 luni în fereastră', buckets.length, 8);
check('luna curentă are 4 leaduri', buckets[7].leads.length, 4);
check('acum 2 luni are 1 lead', buckets[5].leads.length, 1);
check('acum 9 luni nu intră', buckets.reduce((s, b) => s + b.leads.length, 0), 5);
check('suma încasată luna curentă', buckets[7].leads.reduce((s, l) => s + l.paidAmount, 0), 1000);

const funnel = funnelFromLeads(leads);
check('pâlnie: total', funnel[0].value, 6);
check('pâlnie: programate', funnel[1].value, 5); // 1,2,3,5,6
check('pâlnie: prezenți', funnel[2].value, 4);   // 1,2,5,6
check('pâlnie: semnate', funnel[3].value, 3);    // 1,5,6
check('pâlnie: procent programate', funnel[1].percent, 83);

check('pâlnie goală nu dă NaN', funnelFromLeads([]).map((s) => s.percent), [100, 0, 0, 0]);
check('trend gol e listă goală', showUpTrendFromLeads([]).length, 0);
check('performanță fără echipă', agentPerformanceFromLeads(leads, []).length, 0);

const perf = agentPerformanceFromLeads(leads, [
  { role: 'Closers', color: '#000', members: ['Ion Pop'] }
] as any);
check('un singur rând pentru Ion Pop', perf.length, 1);
check('apeluri programate Ion Pop', perf[0].calls, 5);
check('show-up Ion Pop', perf[0].showUp, 80);   // 4 din 5
check('close rate Ion Pop', perf[0].closeRate, 75); // 3 semnate din 4 prezenți

import { leadDateIso } from '../src/data/leads';
check('data „18 aug 2026”', leadDateIso('18 aug 2026'), '2026-08-18');
check('data „18 sept. 2026”', leadDateIso('18 sept. 2026'), '2026-09-18');
check('data ISO cu oră', leadDateIso('2026-08-18T09:30:00.000Z'), '2026-08-18');
check('data ISO simplă', leadDateIso('2026-08-18'), '2026-08-18');
check('data „18.08.2026”', leadDateIso('18.08.2026'), '2026-08-18');
check('data goală', leadDateIso(''), '');
check('text fără sens', leadDateIso('cândva'), '');
