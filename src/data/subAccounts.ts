export interface SubAccountRole {
  role: 'Closers' | 'Callers' | 'Managers' | 'Marketers';
  color: string;
  members: string[];
}

export const subAccounts: SubAccountRole[] = [
{
  role: 'Closers',
  color: '#2f6bff',
  members: ['Vlad Ionescu', 'Ana Dumitrescu', 'Sergiu Petrache']
},
{
  role: 'Callers',
  color: '#f97316',
  members: ['Bianca Moldovan', 'Rareș Ciobanu', 'Teodora Sava']
},
{
  role: 'Managers',
  color: '#10b981',
  members: ['Cristian Barbu', 'Larisa Neagu']
},
{
  role: 'Marketers',
  color: '#eab308',
  members: ['Paul Grigore', 'Miruna Oprea']
}];


export const subAccountsTotal = subAccounts.reduce(
  (total, group) => total + group.members.length,
  0
);

/** Rolul (la singular) al unui sub-account, după nume */
export function roleOf(name: string) {
  const group = subAccounts.find((item) => item.members.includes(name));
  if (!group) return 'Sub-account';
  return {
    Closers: 'Closer',
    Callers: 'Caller',
    Managers: 'Manager',
    Marketers: 'Marketer'
  }[group.role];
}

/** Culoarea rolului, pentru buline și accente */
export function roleColor(name: string) {
  return (
    subAccounts.find((group) => group.members.includes(name))?.color ??
    '#64748b');

}