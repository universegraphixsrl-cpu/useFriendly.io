import React, { useState } from 'react';
import { PlusIcon, CheckIcon, XIcon, SendIcon, UsersIcon } from 'lucide-react';
import { subAccounts } from '../data/subAccounts';
import { categoryColors } from '../data/tasks';

interface Category {
  role: string;
  color: string;
  description: string;
  members: number;
}

const NAME_LIMIT = 30;
const SEAT_LIMIT = 50;

const initialCategories: Category[] = subAccounts.map((group) => ({
  role: group.role,
  color: group.color,
  description:
  group.role === 'Closers' ?
  'Închid apelurile de vânzare și gestionează ofertele.' :
  group.role === 'Callers' ?
  'Califică leadurile și programează apelurile.' :
  group.role === 'Managers' ?
  'Coordonează echipa și urmăresc targeturile.' :
  'Rulează campaniile și conținutul de achiziție.',
  members: group.members.length
}));

interface Member {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'Activ' | 'Pending';
}

const initialMembers: Member[] = subAccounts.flatMap((group) =>
group.members.map((member) => ({
  id: `${group.role}-${member}`,
  name: member,
  email: `${member.
  toLowerCase().
  normalize('NFD').
  replace(/[\u0300-\u036f]/g, '').
  replace(/[^a-z ]/g, '').
  split(' ').
  join('.')}@eliteclosers.ro`,
  role: group.role,
  status: 'Activ' as const
}))
);

export function CreateSubAccount() {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [selected, setSelected] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState(categoryColors[0]);
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [memberName, setMemberName] = useState('');
  const [memberEmail, setMemberEmail] = useState('');

  const colorOf = (role: string) =>
  categories.find((category) => category.role === role)?.color ?? '#94a3b8';

  const sendInvite = () => {
    const trimmedName = memberName.trim();
    if (!trimmedName || !selected) return;
    setMembers((current) => [
    {
      id: `member-${Date.now()}`,
      name: trimmedName,
      email: memberEmail.trim() || '—',
      role: selected,
      status: 'Pending'
    },
    ...current]
    );
    setMemberName('');
    setMemberEmail('');
  };

  const createCategory = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setCategories((current) => [
    ...current,
    { role: trimmed, color, description, members: 0 }]
    );
    setSelected(trimmed);
    setName('');
    setDescription('');
    setColor(categoryColors[0]);
    setFormOpen(false);
  };

  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-2xl">
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
            Creează un sub-account
          </h1>
          <p className="mt-1 text-sm leading-relaxed text-ink-700">
            Alege categoria în care intră noul membru. Categoria stabilește
            permisiunile, rapoartele la care are acces și culoarea cu care apare
            în meniu.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4">
          <p className="text-[11px] font-bold uppercase tracking-wide text-ink-500">
            Pachet Pro
          </p>
          <p className="mt-1 font-display text-xl font-extrabold tracking-tight text-ink">
            {members.length}{' '}
            <span className="text-base font-bold text-ink-500">
              / {SEAT_LIMIT} sub-accounts
            </span>
          </p>
          <div
            className="mt-2 h-1.5 w-40 overflow-hidden rounded-full bg-slate-100"
            role="presentation">
            
            <div
              className="h-full rounded-full bg-brand-500"
              style={{
                width: `${Math.min(100, members.length / SEAT_LIMIT * 100)}%`
              }} />
            
          </div>
          <p className="mt-2 text-xs text-ink-500">
            {Math.max(0, SEAT_LIMIT - members.length)} locuri disponibile
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {categories.map((category) => {
          const active = selected === category.role;
          return (
            <button
              key={category.role}
              type="button"
              onClick={() => setSelected(category.role)}
              aria-pressed={active}
              className={`flex flex-col rounded-2xl border border-t-4 bg-white p-5 text-left transition-colors duration-150 ease-out ${
              active ?
              'border-brand-300 bg-brand-50' :
              'border-slate-200 hover:border-brand-200 hover:bg-brand-50'}`
              }
              style={{ borderTopColor: category.color }}>
              
              <div className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-2 font-display text-base font-extrabold tracking-tight text-ink">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: category.color }}
                    aria-hidden="true" />
                  
                  {category.role}
                </span>
                {active &&
                <CheckIcon
                  className="h-4 w-4 text-brand-600"
                  strokeWidth={3}
                  aria-hidden="true" />

                }
              </div>
              <p className="mt-1.5 text-xs leading-relaxed text-ink-500">
                {category.description || 'Fără descriere'}
              </p>
              <span className="mt-auto flex items-center gap-1.5 pt-4 text-xs font-bold text-ink-500">
                <UsersIcon className="h-3.5 w-3.5" aria-hidden="true" />
                {category.members} membri activi
              </span>
            </button>);

        })}

        <button
          type="button"
          onClick={() => setFormOpen(true)}
          className="flex flex-col items-start justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-5 text-left transition-colors duration-150 ease-out hover:border-brand-300 hover:bg-brand-50">
          
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
            <PlusIcon className="h-5 w-5" strokeWidth={2.5} aria-hidden="true" />
          </span>
          <span className="mt-3 font-display text-base font-extrabold tracking-tight text-ink">
            Creează o categorie nouă
          </span>
          <span className="mt-1 text-xs leading-relaxed text-ink-500">
            Alege numele, culoarea și, opțional, o descriere a rolului.
          </span>
        </button>
      </div>

      {formOpen &&
      <section
        aria-labelledby="new-category-title"
        className="mt-6 rounded-2xl border border-brand-200 bg-white p-5 sm:p-6">
        
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2
              id="new-category-title"
              className="font-display text-base font-extrabold tracking-tight text-ink">
              
                Categorie nouă de sub-accounts
              </h2>
              <p className="text-xs text-ink-500">
                Numele este obligatoriu, maximum {NAME_LIMIT} de caractere.
              </p>
            </div>
            <button
            type="button"
            onClick={() => setFormOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-500 transition-colors duration-150 ease-out hover:bg-slate-50 hover:text-ink"
            aria-label="Anulează">
            
              <XIcon className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <div>
              <label
              htmlFor="categoryName"
              className="text-xs font-bold uppercase tracking-wide text-ink-500">
              
                Nume categorie *
              </label>
              <input
              id="categoryName"
              type="text"
              autoFocus
              maxLength={NAME_LIMIT}
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Ex.: Setteri, Onboarding, Suport"
              className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-semibold text-ink placeholder:font-normal placeholder:text-ink-500 focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-100" />
            
              <p className="mt-1.5 text-xs text-ink-500">
                {name.length}/{NAME_LIMIT} caractere
              </p>
            </div>

            <div>
              <label
              htmlFor="categoryDescription"
              className="text-xs font-bold uppercase tracking-wide text-ink-500">
              
                Descriere (opțional)
              </label>
              <input
              id="categoryDescription"
              type="text"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Ce face rolul acesta în echipă?"
              className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-ink placeholder:text-ink-500 focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-100" />
            
            </div>
          </div>

          <p className="mt-4 text-[11px] font-bold uppercase tracking-wide text-ink-500">
            Culoare
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {categoryColors.map((option) =>
          <button
            key={option}
            type="button"
            onClick={() => setColor(option)}
            aria-pressed={color === option}
            aria-label={`Culoarea ${option}`}
            className={`flex h-8 w-8 items-center justify-center rounded-full transition-transform duration-150 ease-out ${
            color === option ?
            'ring-2 ring-ink ring-offset-2' :
            'hover:scale-105'}`
            }
            style={{ backgroundColor: option }}>
            
                {color === option &&
            <CheckIcon
              className="h-4 w-4 text-white"
              strokeWidth={3}
              aria-hidden="true" />

            }
              </button>
          )}
          </div>

          <div className="mt-5 flex items-center gap-2">
            <button
            type="button"
            disabled={name.trim().length === 0}
            onClick={createCategory}
            className="rounded-lg bg-brand-500 px-3.5 py-2.5 font-display text-sm font-bold text-white transition-colors duration-150 ease-out hover:bg-brand-600 disabled:bg-slate-200 disabled:text-ink-500">
            
              Creează categoria
            </button>
            <button
            type="button"
            onClick={() => setFormOpen(false)}
            className="text-sm font-semibold text-ink-500 underline-offset-4 hover:text-ink-700 hover:underline">
            
              Anulează
            </button>
          </div>
        </section>
      }

      {selected &&
      <section
        aria-labelledby="invite-title"
        className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
        
          <h2
          id="invite-title"
          className="font-display text-base font-extrabold tracking-tight text-ink">
          
            Sub-account nou în „{selected}”
          </h2>
          <p className="text-xs text-ink-500">
            Primește invitație pe email și își setează singur parola.
          </p>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label
              htmlFor="memberName"
              className="text-xs font-bold uppercase tracking-wide text-ink-500">
              
                Nume complet
              </label>
              <input
              id="memberName"
              type="text"
              value={memberName}
              onChange={(event) => setMemberName(event.target.value)}
              placeholder="Ex.: Andrei Popescu"
              className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-semibold text-ink placeholder:font-normal placeholder:text-ink-500 focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-100" />
            
            </div>
            <div>
              <label
              htmlFor="memberEmail"
              className="text-xs font-bold uppercase tracking-wide text-ink-500">
              
                Email de lucru
              </label>
              <input
              id="memberEmail"
              type="email"
              value={memberEmail}
              onChange={(event) => setMemberEmail(event.target.value)}
              placeholder="nume@eliteclosers.ro"
              className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-semibold text-ink placeholder:font-normal placeholder:text-ink-500 focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-100" />
            
            </div>
          </div>

          <button
          type="button"
          onClick={sendInvite}
          disabled={memberName.trim().length === 0}
          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-brand-500 px-3.5 py-2.5 font-display text-sm font-bold text-white transition-colors duration-150 ease-out hover:bg-brand-600 disabled:bg-slate-200 disabled:text-ink-500">
          
            <SendIcon className="h-4 w-4" aria-hidden="true" />
            Trimite invitația
          </button>
        </section>
      }

      <section
        aria-labelledby="members-title"
        className="mt-6 rounded-2xl border border-slate-200 bg-white">
        
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
          <div>
            <h2
              id="members-title"
              className="font-display text-base font-extrabold tracking-tight text-ink">
              
              Sub-accounts existente
            </h2>
            <p className="text-xs text-ink-500">
              {members.filter((member) => member.status === 'Activ').length}{' '}
              active ·{' '}
              {members.filter((member) => member.status === 'Pending').length} în
              așteptare
            </p>
          </div>
        </div>

        <ul className="divide-y divide-slate-100">
          {members.map((member) =>
          <li
            key={member.id}
            className="flex flex-wrap items-center gap-4 px-5 py-3.5">
            
              <div className="min-w-[200px] flex-1">
                <p className="font-display text-sm font-bold text-ink">
                  {member.name}
                </p>
                <p className="text-xs text-ink-500">{member.email}</p>
              </div>
              <span className="inline-flex items-center gap-2 text-xs font-semibold text-ink-700">
                <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: colorOf(member.role) }}
                aria-hidden="true" />
              
                {member.role}
              </span>
              <span
              className={`rounded-full px-2.5 py-1 text-xs font-bold ${
              member.status === 'Activ' ?
              'bg-emerald-100 text-emerald-800' :
              'bg-amber-100 text-amber-800'}`
              }>
              
                {member.status}
              </span>
            </li>
          )}
        </ul>
      </section>
    </>);

}