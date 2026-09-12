export interface Invoice {
  id: string;
  number: string;
  date: string;
  description: string;
  amount: string;
  status: 'Plătită' | 'În procesare' | 'Eșuată';
}

export const invoices: Invoice[] = [
{
  id: 'inv-2026-08',
  number: 'EC-2026-0084',
  date: '1 august 2026',
  description: 'Plan Growth · abonament lunar + 2 locuri suplimentare',
  amount: '198,00 €',
  status: 'Plătită'
},
{
  id: 'inv-2026-07',
  number: 'EC-2026-0071',
  date: '1 iulie 2026',
  description: 'Plan Growth · abonament lunar',
  amount: '149,00 €',
  status: 'Plătită'
},
{
  id: 'inv-2026-06',
  number: 'EC-2026-0063',
  date: '1 iunie 2026',
  description: 'Plan Growth · abonament lunar',
  amount: '149,00 €',
  status: 'Plătită'
},
{
  id: 'inv-2026-05',
  number: 'EC-2026-0052',
  date: '1 mai 2026',
  description: 'Plan Growth · abonament lunar',
  amount: '149,00 €',
  status: 'Plătită'
},
{
  id: 'inv-2026-04',
  number: 'EC-2026-0041',
  date: '1 aprilie 2026',
  description: 'Plan Starter · abonament lunar',
  amount: '69,00 €',
  status: 'Plătită'
},
{
  id: 'inv-2026-03',
  number: 'EC-2026-0035',
  date: '1 martie 2026',
  description: 'Plan Starter · abonament lunar',
  amount: '69,00 €',
  status: 'Eșuată'
}];


export const planUsage = [
{ label: 'Locuri de utilizator', used: 7, total: 10 },
{ label: 'Automatizări active', used: 8, total: 25 },
{ label: 'Contacte în baza de date', used: 6420, total: 15000 },
{ label: 'Apeluri programate / lună', used: 678, total: 2000 }];