export interface MonthRevenue {
  month: string;
  incasat: number;
  target: number;
}

export const monthlyRevenue: MonthRevenue[] = [
{ month: 'Ian', incasat: 118400, target: 130000 },
{ month: 'Feb', incasat: 126900, target: 130000 },
{ month: 'Mar', incasat: 141200, target: 140000 },
{ month: 'Apr', incasat: 134700, target: 140000 },
{ month: 'Mai', incasat: 158300, target: 150000 },
{ month: 'Iun', incasat: 147600, target: 150000 },
{ month: 'Iul', incasat: 169800, target: 160000 },
{ month: 'Aug', incasat: 186450, target: 170000 }];


export interface AgentShare {
  name: string;
  amount: number;
  color: string;
}

export const revenueByAgent: AgentShare[] = [
{ name: 'Andreas Bălan', amount: 62400, color: '#2f6bff' },
{ name: 'Radu Toma', amount: 48900, color: '#6389ff' },
{ name: 'Mihai Stan', amount: 39750, color: '#93b2ff' },
{ name: 'Alexandra V.', amount: 24300, color: '#bdd1ff' },
{ name: 'Alți closeri', amount: 11100, color: '#dbe6ff' }];


export interface SourceShare {
  name: string;
  value: number;
  color: string;
}

export const revenueBySource: SourceShare[] = [
{ name: 'Webinar live', value: 44, color: '#2f6bff' },
{ name: 'Meta Lead Ads', value: 23, color: '#6389ff' },
{ name: 'Recomandări', value: 18, color: '#93b2ff' },
{ name: 'Outbound', value: 9, color: '#bdd1ff' },
{ name: 'Organic', value: 6, color: '#dbe6ff' }];


export interface AgentPerformance {
  name: string;
  role: string;
  showUp: number;
  closeRate: number;
  calls: number;
  revenue: string;
  trend: number;
}

export const agentPerformance: AgentPerformance[] = [
{
  name: 'Andreas Bălan',
  role: 'Senior closer',
  showUp: 87,
  closeRate: 34,
  calls: 96,
  revenue: '62.400 €',
  trend: 6.2
},
{
  name: 'Radu Toma',
  role: 'Closer',
  showUp: 81,
  closeRate: 29,
  calls: 88,
  revenue: '48.900 €',
  trend: 3.4
},
{
  name: 'Mihai Stan',
  role: 'Closer',
  showUp: 74,
  closeRate: 26,
  calls: 79,
  revenue: '39.750 €',
  trend: -1.8
},
{
  name: 'Alexandra Vlad',
  role: 'Setter senior',
  showUp: 69,
  closeRate: 19,
  calls: 112,
  revenue: '24.300 €',
  trend: 2.1
},
{
  name: 'Dan Ionescu',
  role: 'Setter',
  showUp: 58,
  closeRate: 14,
  calls: 104,
  revenue: '11.100 €',
  trend: -4.3
}];


export interface WebinarBooking {
  webinar: string;
  date: string;
  inscrisi: number;
  prezenti: number;
  apeluriRezervate: number;
  bookRate: number;
}

export const webinarBookings: WebinarBooking[] = [
{
  webinar: 'Scale Academy — ediția 12',
  date: '4 aug',
  inscrisi: 640,
  prezenti: 312,
  apeluriRezervate: 108,
  bookRate: 34.6
},
{
  webinar: 'Sisteme de vânzare pentru mentori',
  date: '11 aug',
  inscrisi: 512,
  prezenti: 233,
  apeluriRezervate: 71,
  bookRate: 30.5
},
{
  webinar: 'Masterclass ofertă irezistibilă',
  date: '18 aug',
  inscrisi: 738,
  prezenti: 401,
  apeluriRezervate: 152,
  bookRate: 37.9
},
{
  webinar: 'Workshop closing avansat',
  date: '22 aug',
  inscrisi: 296,
  prezenti: 178,
  apeluriRezervate: 79,
  bookRate: 44.4
}];


export interface FunnelStage {
  label: string;
  value: number;
  percent: number;
}

export const webinarFunnel: FunnelStage[] = [
{ label: 'Înscriși la webinar', value: 2186, percent: 100 },
{ label: 'Participanți live', value: 1124, percent: 51 },
{ label: 'Au rămas la ofertă', value: 702, percent: 32 },
{ label: 'Apeluri rezervate', value: 410, percent: 19 },
{ label: 'Show-up la apel', value: 318, percent: 15 },
{ label: 'Contracte semnate', value: 97, percent: 4 }];


export interface ShowUpPoint {
  week: string;
  showUp: number;
  bookRate: number;
}

export const showUpTrend: ShowUpPoint[] = [
{ week: 'S1', showUp: 71, bookRate: 28 },
{ week: 'S2', showUp: 74, bookRate: 31 },
{ week: 'S3', showUp: 69, bookRate: 30 },
{ week: 'S4', showUp: 78, bookRate: 35 },
{ week: 'S5', showUp: 76, bookRate: 33 },
{ week: 'S6', showUp: 81, bookRate: 38 },
{ week: 'S7', showUp: 79, bookRate: 36 },
{ week: 'S8', showUp: 84, bookRate: 41 }];