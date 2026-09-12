import { formatEur, formatPercent } from '../../data/kpis';
import { UNASSIGNED, type Lead } from '../../data/leads';

export interface ExtraMetric {
  id: string;
  label: string;
  /** Ce măsoară indicatorul, arătat în selectorul de rapoarte */
  description: string;
  /** Valoarea afișată mare pe card */
  value: (leads: Lead[]) => string;
  /** Detaliul gri de sub valoare */
  note: (leads: Lead[]) => string;
  accent?: boolean;
  /**
   * 'caller' = indicatorul se raportează la callerul alocat, nu la responsabil,
   * deci la filtrarea per agent se folosesc leadurile în care apare ca caller.
   */
  scope?: 'owner' | 'caller';
  /**
   * Indicator afișat doar când raportul e restrâns la un caller anume.
   * Sumele colectate sunt deja numărate la closeri, deci nu se mai adună
   * în totalurile din contul de admin.
   */
  callerOnly?: boolean;
  /** Indicator de closer — nu are sens în raportul unui caller */
  closerOnly?: boolean;
}

const held = (leads: Lead[]) =>
leads.filter(
  (lead) => lead.listId === 'list-offers' || lead.listId === 'list-clients'
);

const signed = (leads: Lead[]) =>
leads.filter((lead) => lead.status === 'Semnat');

const booked = (leads: Lead[]) =>
leads.filter((lead) => lead.listId === 'list-calls').length +
held(leads).length;

const collected = (leads: Lead[]) =>
leads.reduce((sum, lead) => sum + lead.paidAmount, 0);

const generated = (leads: Lead[]) =>
leads.reduce((sum, lead) => sum + lead.generatedAmount, 0);

/** Indicatorii principali, pre-selectați, dar care pot fi scoși oricând */
export const coreMetricIds = [
'collected',
'generated',
'signed',
'booked-calls',
'held-calls',
'commission'];


const withCaller = (leads: Lead[]) => leads.filter((lead) => lead.caller);

const withVocaroo = (leads: Lead[]) =>
leads.filter((lead) => lead.vocarooLink.trim().length > 0);

const withZoom = (leads: Lead[]) =>
leads.filter((lead) => lead.zoomLink.trim().length > 0);

/** Toți indicatorii disponibili în pagina de rapoarte */
export const extraMetrics: ExtraMetric[] = [
{
  id: 'collected',
  label: 'Sumă totală colectată',
  description: 'Cât s-a încasat efectiv în perioada selectată.',
  closerOnly: true,
  value: (leads) => formatEur(collected(leads)),
  note: (leads) =>
  `${formatPercent(
    generated(leads) ? collected(leads) / generated(leads) * 100 : 0
  )} din suma totală generată`
},
{
  id: 'generated',
  label: 'Sumă totală generată',
  description: 'Valoarea totală a contractelor semnate.',
  closerOnly: true,
  value: (leads) => formatEur(generated(leads)),
  note: () => 'Valoarea totală a contractelor semnate'
},
{
  id: 'signed',
  label: 'Clienți noi semnați',
  description: 'Numărul de contracte noi semnate.',
  closerOnly: true,
  value: (leads) => `${signed(leads).length}`,
  note: (leads) => {
    const present = held(leads).length;
    return `Rată de conversie ${formatPercent(
      present ? signed(leads).length / present * 100 : 0
    )} — ${signed(leads).length}/${present} dintre cei prezenți au semnat`;
  }
},
{
  id: 'booked-calls',
  label: 'Apeluri totale programate',
  description: 'Toate apelurile programate, ținute sau nu.',
  closerOnly: true,
  value: (leads) => `${booked(leads)}`,
  note: () => 'Programați book-a-call + apeluri ținute + clienți semnați'
},
{
  id: 'held-calls',
  label: 'Apeluri totale ținute',
  description: 'Apelurile la care leadul s-a prezentat.',
  closerOnly: true,
  value: (leads) => `${held(leads).length}`,
  note: (leads) =>
  `Rată de prezență ${formatPercent(
    booked(leads) ? held(leads).length / booked(leads) * 100 : 0
  )} din cei programați`
},
{
  id: 'commission',
  label: 'Comision',
  description: '10% din suma totală colectată.',
  closerOnly: true,
  value: (leads) => formatEur(Math.round(collected(leads) * 0.1)),
  note: () => '10% din suma totală colectată',
  accent: true
},
{
  id: 'caller-signed',
  label: 'Clienți noi semnați',
  description:
  'Câți clienți s-au semnat pe leadurile alocate callerului (nu se adună în totalul echipei).',
  scope: 'caller',
  callerOnly: true,
  value: (leads) => `${signed(leads).length}`,
  note: (leads) =>
  `${signed(leads).length} clienți semnați pe leadurile lui · deja numărați la closeri`
},
{
  id: 'caller-leads',
  label: 'Lead-uri alocate (caller)',
  description: 'Câte leaduri și-a alocat callerul pentru a suna.',
  scope: 'caller',
  value: (leads) => `${withCaller(leads).length}`,
  note: (leads) =>
  `${withCaller(leads).length} din ${leads.length} leaduri au caller alocat`
},
{
  id: 'caller-collected',
  label: 'Sumă colectată (caller)',
  description:
  'Cât s-a încasat pe leadurile alocate callerului (nu se adună în totalul echipei).',
  scope: 'caller',
  callerOnly: true,
  value: (leads) => formatEur(collected(leads)),
  note: (leads) =>
  `${signed(leads).length} clienți semnați pe leadurile lui · deja numărate la closeri`
},
{
  id: 'caller-commission',
  label: 'Comision caller (3%)',
  description:
  '3% din suma colectată pe leadurile callerului (nu se adună în totalul echipei).',
  scope: 'caller',
  callerOnly: true,
  accent: true,
  value: (leads) => formatEur(Math.round(collected(leads) * 0.03)),
  note: (leads) => `3% din ${formatEur(collected(leads))} colectați`
},
{
  id: 'vocaroo-count',
  label: 'Număr Vocaroo-uri încărcate',
  description: 'Câte înregistrări Vocaroo au fost încărcate.',
  scope: 'caller',
  value: (leads) => `${withVocaroo(leads).length}`,
  note: (leads) =>
  `${formatPercent(
    withCaller(leads).length ?
    withVocaroo(leads).length / withCaller(leads).length * 100 :
    0
  )} din leadurile alocate au înregistrare`
},
{
  id: 'zoom-count',
  label: 'Număr înreg. video încărcate',
  description: 'Câte înregistrări video de Zoom au fost încărcate.',
  scope: 'caller',
  value: (leads) => `${withZoom(leads).length}`,
  note: (leads) =>
  `${formatPercent(
    held(leads).length ? withZoom(leads).length / held(leads).length * 100 : 0
  )} din apelurile ținute au înregistrare`
},
{
  id: 'no-show-rate',
  label: 'Rată de no-show',
  description: 'Câți dintre cei programați nu s-au prezentat la apel.',
  value: (leads) => {
    const total = booked(leads);
    const noShow = leads.filter((lead) => lead.status === 'No-show').length;
    return formatPercent(total ? noShow / total * 100 : 0);
  },
  note: (leads) =>
  `${leads.filter((lead) => lead.status === 'No-show').length}/${booked(
    leads
  )} apeluri programate`
},
{
  id: 'refusal-rate',
  label: 'Rată de refuz la apel',
  description: 'Procentul celor prezenți care au spus „Nu”.',
  value: (leads) => {
    const present = held(leads).length;
    const no = leads.filter((lead) => lead.status === 'A zis „Nu”').length;
    return formatPercent(present ? no / present * 100 : 0);
  },
  note: (leads) =>
  `${leads.filter((lead) => lead.status === 'A zis „Nu”').length}/${
  held(leads).length} dintre cei prezenți`

},
{
  id: 'open-followups',
  label: 'Follow-up-uri deschise',
  description: 'Leaduri rămase în „Așteptăm răspuns”, de reluat.',
  value: (leads) =>
  `${leads.filter((lead) => lead.status === 'Așteptăm răspuns').length}`,
  note: (leads) =>
  `${leads.filter((lead) => lead.status === 'A zis da').length} au zis „da” și nu au semnat încă`
},
{
  id: 'avg-contract',
  label: 'Valoare medie contract',
  description: 'Media valorii contractelor semnate.',
  value: (leads) => {
    const list = signed(leads);
    return formatEur(
      list.length ? Math.round(generated(list) / list.length) : 0
    );
  },
  note: (leads) => `${signed(leads).length} contracte semnate`
},
{
  id: 'avg-collected',
  label: 'Încasare medie per client',
  description: 'Cât s-a încasat efectiv, în medie, per client semnat.',
  value: (leads) => {
    const list = signed(leads);
    return formatEur(
      list.length ? Math.round(collected(list) / list.length) : 0
    );
  },
  note: (leads) =>
  `${formatEur(collected(leads))} încasat din ${signed(leads).length} contracte`
},
{
  id: 'outstanding',
  label: 'Sumă rămasă de încasat',
  description: 'Diferența dintre contractat și încasat.',
  value: (leads) => formatEur(Math.max(0, generated(leads) - collected(leads))),
  note: (leads) =>
  `${formatEur(collected(leads))} încasat din ${formatEur(
    generated(leads)
  )} contractat`
},
{
  id: 'book-rate',
  label: 'Rată book-a-call din webinar',
  description: 'Câți înscriși la webinar au programat un apel.',
  value: (leads) => {
    const webinar = leads.filter(
      (lead) => lead.listId === 'list-webinar'
    ).length;
    const total = webinar + booked(leads);
    return formatPercent(total ? booked(leads) / total * 100 : 0);
  },
  note: (leads) =>
  `${booked(leads)} apeluri din ${
  leads.filter((lead) => lead.listId === 'list-webinar').length +
  booked(leads)} înscriși`

},
{
  id: 'unassigned',
  label: 'Leaduri neatribuite',
  description: 'Leaduri fără responsabil, disponibile de preluat.',
  value: (leads) =>
  `${leads.filter((lead) => lead.owner === UNASSIGNED).length}`,
  note: (leads) =>
  `din ${leads.length} leaduri în perioada selectată`
},
{
  id: 'no-answer',
  label: 'Leaduri fără răspuns',
  description: 'Câți au fost sunați și nu au răspuns.',
  value: (leads) =>
  `${leads.filter((lead) => lead.status === 'Nu a răspuns').length}`,
  note: (leads) =>
  formatPercent(
    leads.length ?
    leads.filter((lead) => lead.status === 'Nu a răspuns').length /
    leads.length *
    100 :
    0
  ) + ' din totalul leadurilor'
},
{
  id: 'installments',
  label: 'Clienți cu plată în rate',
  description: 'Contracte cu mai multe tranșe înregistrate.',
  value: (leads) =>
  `${leads.filter((lead) => lead.payments.length > 0).length}`,
  note: (leads) =>
  `${leads.reduce((sum, lead) => sum + lead.payments.length, 0)} plăți adăugate manual`
},
{
  id: 'documents',
  label: 'Documente emise',
  description: 'Facturi, proforme și documente atașate leadurilor.',
  value: (leads) =>
  `${leads.reduce((sum, lead) => sum + lead.documents.length, 0)}`,
  note: (leads) =>
  `pe ${leads.filter((lead) => lead.documents.length > 0).length} leaduri`
},
{
  id: 'recordings',
  label: 'Apeluri înregistrate',
  description: 'Leaduri cu înregistrare Vocaroo sau Zoom atașată.',
  value: (leads) =>
  `${
  leads.filter((lead) => lead.vocarooLink || lead.zoomLink).length}`,

  note: (leads) =>
  `${leads.filter((lead) => lead.vocarooLink).length} Vocaroo · ${
  leads.filter((lead) => lead.zoomLink).length} Zoom`

},
{
  id: 'lead-value',
  label: 'Valoare medie per lead',
  description: 'Cât aduce, în medie, un lead intrat în pipeline.',
  value: (leads) =>
  formatEur(leads.length ? Math.round(collected(leads) / leads.length) : 0),
  note: (leads) => `${formatEur(collected(leads))} / ${leads.length} leaduri`,
  accent: true
},
{
  id: 'caller-coverage',
  label: 'Acoperire calleri',
  description: 'Câte leaduri au deja un caller alocat.',
  value: (leads) => {
    const withCaller = leads.filter((lead) => lead.caller).length;
    return formatPercent(leads.length ? withCaller / leads.length * 100 : 0);
  },
  note: (leads) =>
  `${leads.filter((lead) => lead.caller).length}/${leads.length} leaduri alocate`
}];