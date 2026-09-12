export interface Currency {
  code: string;
  label: string;
  symbol: string;
}

export const currencies: Currency[] = [
{ code: 'RON', label: 'Leu românesc', symbol: 'lei' },
{ code: 'EUR', label: 'Euro', symbol: '€' },
{ code: 'USD', label: 'Dolar american', symbol: '$' },
{ code: 'GBP', label: 'Liră sterlină', symbol: '£' },
{ code: 'CHF', label: 'Franc elvețian', symbol: 'CHF' },
{ code: 'AED', label: 'Dirham UAE', symbol: 'AED' },
{ code: 'SAR', label: 'Riyal saudit', symbol: 'SAR' },
{ code: 'CAD', label: 'Dolar canadian', symbol: 'C$' },
{ code: 'AUD', label: 'Dolar australian', symbol: 'A$' },
{ code: 'SEK', label: 'Coroană suedeză', symbol: 'kr' },
{ code: 'NOK', label: 'Coroană norvegiană', symbol: 'kr' },
{ code: 'DKK', label: 'Coroană daneză', symbol: 'kr' },
{ code: 'PLN', label: 'Zlot polonez', symbol: 'zł' },
{ code: 'HUF', label: 'Forint maghiar', symbol: 'Ft' },
{ code: 'CZK', label: 'Coroană cehă', symbol: 'Kč' },
{ code: 'BGN', label: 'Leva bulgărească', symbol: 'лв' },
{ code: 'TRY', label: 'Liră turcească', symbol: '₺' },
{ code: 'MDL', label: 'Leu moldovenesc', symbol: 'L' },
{ code: 'JPY', label: 'Yen japonez', symbol: '¥' },
{ code: 'SGD', label: 'Dolar Singapore', symbol: 'S$' }];


export type IntervalUnit = 'zile' | 'săptămâni' | 'luni';

export const intervalUnits: IntervalUnit[] = ['zile', 'săptămâni', 'luni'];

/** Forma singulară, pentru „la fiecare lună” vs. „la fiecare 3 luni” */
const singular: Record<IntervalUnit, string> = {
  zile: 'zi',
  săptămâni: 'săptămână',
  luni: 'lună'
};

export interface Product {
  id: string;
  name: string;
  /** Suma încasată la fiecare plată */
  price: number;
  currency: string;
  recurring: boolean;
  /** Câte unități trec între plăți (ex. 2 săptămâni) */
  interval: number;
  intervalUnit: IntervalUnit;
  /** Culoare de identificare internă — vizibilă doar în CRM, nu pe checkout */
  color: string;
}

export const initialProducts: Product[] = [
{
  id: 'prod-mentorat',
  name: 'Mentorat 1-la-1 · 3 luni',
  price: 4500,
  currency: 'EUR',
  recurring: false,
  interval: 1,
  intervalUnit: 'luni',
  color: '#2f6bff'
},
{
  id: 'prod-academy',
  name: 'Closer Academy · acces lunar',
  price: 249,
  currency: 'EUR',
  recurring: true,
  interval: 1,
  intervalUnit: 'luni',
  color: '#10b981'
},
{
  id: 'prod-audit',
  name: 'Audit pipeline & scripturi',
  price: 2400,
  currency: 'RON',
  recurring: false,
  interval: 1,
  intervalUnit: 'luni',
  color: '#f59e0b'
}];


/** Câmpurile standard, prezente pe orice link de plată */
export const standardFields = [
'Prenume',
'Nume',
'Email',
'Telefon',
'Adresă de facturare'];


/** Câmpuri opționale pe care le poate adăuga adminul */
export const optionalFields = [
'Țară',
'Oraș',
'Cod poștal',
'CNP',
'Data nașterii',
'Cod cupon / voucher',
'Cum ne-ai găsit?',
'Numărul de participanți',
'Profil Instagram / site',
'Mesaj pentru echipă',
'Acceptă termenii și condițiile',
'Se abonează la newsletter'];


/** Câmpurile completate de clienții persoane juridice */
export const companyFields = [
'Denumire firmă',
'CUI / CIF',
'Nr. reg. comerțului',
'Adresă sediu social',
'Bancă',
'IBAN'];


export interface PaymentLink {
  id: string;
  productId: string;
  url: string;
  createdOn: string;
  active: boolean;
  /** Câmpurile opționale adăugate peste cele standard */
  extraFields: string[];
  /** Permite plata ca persoană juridică */
  allowCompany: boolean;
}

export const initialPaymentLinks: PaymentLink[] = [
{
  id: 'pay-1',
  productId: 'prod-mentorat',
  url: 'https://pay.friendly.ro/l/4KQ8PL',
  createdOn: '24 aug 2026',
  active: true,
  extraFields: ['Țară', 'Cod cupon / voucher'],
  allowCompany: true
},
{
  id: 'pay-2',
  productId: 'prod-academy',
  url: 'https://pay.friendly.ro/l/9MT2XZ',
  createdOn: '26 aug 2026',
  active: true,
  extraFields: [],
  allowCompany: false
}];


export function formatPrice(amount: number, currencyCode: string) {
  const currency = currencies.find((item) => item.code === currencyCode);
  const value = amount.toLocaleString('ro-RO', { minimumFractionDigits: 0 });
  return `${value} ${currency?.symbol ?? currencyCode}`;
}

/** „lună” / „3 luni” — folosit după „la fiecare” sau după „/” */
export function intervalText(product: Product) {
  return product.interval === 1 ?
  singular[product.intervalUnit] :
  `${product.interval} ${product.intervalUnit}`;
}

export function billingLabel(product: Product) {
  return product.recurring ?
  `Recurent · la fiecare ${intervalText(product)}` :
  'Plată unică';
}