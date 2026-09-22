import React, { useState } from 'react';
import {
  EyeIcon,
  EyeOffIcon,
  RefreshCwIcon,
  CopyIcon,
  CheckIcon } from
'lucide-react';
import {
  AuthLayout,
  AuthDivider,
  AuthField,
  GoogleButton } from
'../components/auth/AuthLayout';
import { sitePlans, extraSeatPrice } from '../data/site';
import { suggestPassword, passwordStrength } from '../utils/password';
import { useAuth } from '../contexts/AuthContext';

/**
 * ─────────────────────────────────────────────────────────────
 * ÎNREGISTRAREA PUBLICĂ E ÎNCHISĂ DEOCAMDATĂ.
 *
 * Pagina arată exact ca în design și se poate completa, dar la trimitere
 * spune că înscrierile nu sunt deschise încă — altfel oricine nimerește
 * site-ul și-ar face cont gratis, fără să treacă prin plată.
 *
 * Când plata e pusă la punct, schimbă rândul de mai jos în `true` și
 * conturile încep să se creeze real în Supabase. Atât.
 * ─────────────────────────────────────────────────────────────
 */
const SIGNUP_OPEN = false;

interface SignupProps {
  onBackToSite: () => void;
  onGoToLogin: () => void;
}

const strengthLabels = ['Prea slabă', 'Slabă', 'Bună', 'Puternică'];

export function Signup({ onBackToSite, onGoToLogin }: SignupProps) {
  const { signUp, signInWithGoogle } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [plan, setPlan] = useState(sitePlans[1].name);
  const [seats, setSeats] = useState(sitePlans[1].includedSeats);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [show, setShow] = useState(false);
  const [suggestion, setSuggestion] = useState(suggestPassword);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const strength = passwordStrength(password);
  const activePlan = sitePlans.find((item) => item.name === plan) ?? sitePlans[0];
  const planPrice = activePlan.price;
  const includedSeats = activePlan.includedSeats;
  const extraSeats = Math.max(0, seats - includedSeats);
  const seatsPrice = extraSeats * extraSeatPrice;
  const total = planPrice + seatsPrice;
  const filled =
  firstName.trim() !== '' &&
  lastName.trim() !== '' &&
  email.trim() !== '' &&
  phone.trim() !== '' &&
  address.trim() !== '' &&
  password !== '' &&
  confirm !== '';

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (password !== confirm) {
      setError('Parolele nu coincid.');
      return;
    }
    if (strength < 2) {
      setError(
        'Parola e prea slabă. Folosește minim 8 caractere, litere mari și mici, o cifră și un simbol.'
      );
      return;
    }
    setError('');

    if (!SIGNUP_OPEN) {
      setError(
        'Înscrierile nu sunt deschise încă. Scrie-ne și îți facem noi contul.'
      );
      return;
    }

    const message = await signUp({
      email,
      password,
      fullName: `${firstName.trim()} ${lastName.trim()}`.trim(),
      plan,
      seats
    });
    if (message) setError(message);
    // La reușită sesiunea se schimbă și aplicația intră singură în CRM.
  };

  const useSuggestion = () => {
    setPassword(suggestion);
    setConfirm(suggestion);
    setShow(true);
    setError('');
  };

  return (
    <AuthLayout
      wide
      title="Creează-ți contul Friendly"
      subtitle="14 zile gratuit, toate modulele deblocate. Fără card la înscriere."
      onBackToSite={onBackToSite}
      footer={
      <>
          Ai deja cont?{' '}
          <button
          type="button"
          onClick={onGoToLogin}
          className="font-semibold text-brand-600 hover:text-brand-700">
          
            Log in
          </button>
        </>
      }>
      
      <GoogleButton
        label="Înscrie-te cu Google"
        onClick={async () => {
          if (!SIGNUP_OPEN) {
            setError(
              'Înscrierile nu sunt deschise încă. Scrie-ne și îți facem noi contul.'
            );
            return;
          }
          const message = await signInWithGoogle();
          if (message) setError(message);
        }} />

      <AuthDivider />

      <form onSubmit={submit} className="space-y-6" noValidate>
        <div className="grid gap-5 sm:grid-cols-2">
          <AuthField
            label="Prenume"
            value={firstName}
            onChange={setFirstName}
            placeholder="Andreas"
            autoComplete="given-name"
            required />
          
          <AuthField
            label="Nume"
            value={lastName}
            onChange={setLastName}
            placeholder="Bălan"
            autoComplete="family-name"
            required />
          
          <AuthField
            label="Email de lucru"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="nume@companie.ro"
            autoComplete="email"
            required />
          
          <AuthField
            label="Telefon"
            type="tel"
            value={phone}
            onChange={setPhone}
            placeholder="+40 7xx xxx xxx"
            autoComplete="tel"
            required />
          
        </div>

        <AuthField
          label="Adresă de facturare"
          value={address}
          onChange={setAddress}
          placeholder="Strada, nr., oraș, județ, cod poștal"
          autoComplete="street-address"
          required />
        

        <div>
          <p className="text-sm font-bold text-ink-700">
            Pachetul dorit
            <span className="text-red-500"> *</span>
          </p>
          <div className="mt-2 grid gap-3 sm:grid-cols-3">
            {sitePlans.map((option) =>
            <button
              key={option.name}
              type="button"
              onClick={() => {
                setPlan(option.name);
                setSeats(option.includedSeats);
              }}
              aria-pressed={plan === option.name}
              className={`rounded-lg border p-4 text-left transition-colors duration-150 ease-out ${
              plan === option.name ?
              'border-brand-500 bg-brand-50' :
              'border-slate-200 bg-white hover:border-slate-300'}`
              }>
              
                <span className="flex items-center justify-between gap-2">
                  <span className="font-display text-[15px] font-bold text-ink">
                    {option.name}
                  </span>
                  {plan === option.name &&
                <CheckIcon
                  className="h-4 w-4 text-brand-600"
                  strokeWidth={3}
                  aria-hidden="true" />

                }
                </span>
                <span className="mt-1 block font-display text-xl font-extrabold tracking-tight text-ink">
                  {option.price}€
                  <span className="text-xs font-semibold text-ink-500">
                    {' '}
                    / lună
                  </span>
                </span>
                <span className="mt-1 block text-xs font-semibold text-brand-600">
                  {option.includedSeats} sub-account
                  {option.includedSeats === 1 ? '' : 's'} inclus
                  {option.includedSeats === 1 ? '' : 'e'}
                </span>
              </button>
            )}
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-bold text-ink-700">
              Câte sub-accounts îți trebuie?
              <span className="text-red-500"> *</span>
            </span>
            <input
              type="number"
              min={0}
              max={50}
              value={seats}
              onChange={(event) =>
              setSeats(
                Math.min(50, Math.max(0, Number(event.target.value) || 0))
              )
              }
              className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3.5 py-3 text-[15px] font-semibold text-ink outline-none focus:border-brand-500" />
            
            {extraSeats === 0 ?
            <span className="mt-1.5 block text-xs font-semibold text-brand-600">
                {seats}/{includedSeats} sub-accounts incluse în ofertă
              </span> :

            <span className="mt-1.5 block text-xs font-semibold text-ink-700">
                {includedSeats}/{includedSeats} incluse ·{' '}
                <span className="text-brand-600">
                  +{extraSeats} extra × {extraSeatPrice}€ = {seatsPrice}€ / lună
                </span>
              </span>
            }
          </label>

          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-ink-500">
              Sugestie de parolă
            </p>
            <p className="mt-1.5 font-mono text-[15px] font-bold text-ink">
              {suggestion}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={useSuggestion}
                className="rounded-md bg-brand-500 px-3 py-1.5 text-xs font-bold text-white transition-colors duration-150 ease-out hover:bg-brand-600">
                
                Folosește-o
              </button>
              <button
                type="button"
                onClick={() => {
                  setSuggestion(suggestPassword());
                  setCopied(false);
                }}
                className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-ink-700 transition-colors duration-150 ease-out hover:border-slate-300">
                
                <RefreshCwIcon className="h-3.5 w-3.5" aria-hidden="true" />
                Altă sugestie
              </button>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard?.writeText(suggestion);
                  setCopied(true);
                }}
                className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-ink-700 transition-colors duration-150 ease-out hover:border-slate-300">
                
                {copied ?
                <CheckIcon
                  className="h-3.5 w-3.5 text-green-600"
                  strokeWidth={3}
                  aria-hidden="true" /> :


                <CopyIcon className="h-3.5 w-3.5" aria-hidden="true" />
                }
                {copied ? 'Copiată' : 'Copiază'}
              </button>
            </div>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <AuthField
              label="Parolă"
              type={show ? 'text' : 'password'}
              value={password}
              onChange={(value) => {
                setPassword(value);
                setError('');
              }}
              placeholder="Minim 8 caractere"
              autoComplete="new-password"
              required>
              
              <button
                type="button"
                onClick={() => setShow((value) => !value)}
                aria-label={show ? 'Ascunde parola' : 'Arată parola'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-500 transition-colors duration-150 ease-out hover:text-ink">
                
                {show ?
                <EyeOffIcon className="h-5 w-5" aria-hidden="true" /> :

                <EyeIcon className="h-5 w-5" aria-hidden="true" />
                }
              </button>
            </AuthField>

            {password !== '' &&
            <div className="mt-2 flex items-center gap-2">
                <span className="flex flex-1 gap-1">
                  {[0, 1, 2].map((index) =>
                <span
                  key={index}
                  className={`h-1 flex-1 rounded-full ${
                  index < strength ? 'bg-brand-500' : 'bg-slate-200'}`
                  } />

                )}
                </span>
                <span className="text-xs font-semibold text-ink-500">
                  {strengthLabels[strength]}
                </span>
              </div>
            }
          </div>

          <AuthField
            label="Confirmă parola"
            type={show ? 'text' : 'password'}
            value={confirm}
            onChange={(value) => {
              setConfirm(value);
              setError('');
            }}
            placeholder="Scrie parola din nou"
            autoComplete="new-password"
            required />
          
        </div>

        <div className="rounded-lg border border-slate-200 bg-slate-50 p-5">
          <dl className="space-y-2 text-[15px]">
            <div className="flex items-center justify-between gap-3">
              <dt className="text-ink-700">
                Pachet {plan}
                <span className="text-ink-500">
                  {' '}
                  · {includedSeats} sub-account
                  {includedSeats === 1 ? '' : 's'} inclus
                  {includedSeats === 1 ? '' : 'e'}
                </span>
              </dt>
              <dd className="font-semibold text-ink">{planPrice}€</dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-ink-700">
                {extraSeats} sub-accounts extra × {extraSeatPrice}€
              </dt>
              <dd className="font-semibold text-ink">{seatsPrice}€</dd>
            </div>
          </dl>
          <div className="mt-3 flex items-baseline justify-between gap-3 border-t border-slate-200 pt-3">
            <p className="font-display text-base font-bold text-ink">
              Total de plată
            </p>
            <p className="font-display text-2xl font-extrabold tracking-tight text-ink">
              {total}€
              <span className="text-sm font-semibold text-ink-500">
                {' '}
                / lună
              </span>
            </p>
          </div>
        </div>

        {error &&
        <p className="text-xs font-semibold text-red-600" role="alert">
            {error}
          </p>
        }

        <button
          type="submit"
          disabled={!filled}
          className="w-full rounded-lg bg-brand-500 px-5 py-3.5 font-display text-[15px] font-bold text-white transition-colors duration-150 ease-out hover:bg-brand-600 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-ink-400">
          
          Creează contul · {total}€/lună
        </button>

        <p className="text-center text-xs text-ink-500">
          Creând contul accepți termenii și politica de confidențialitate.
        </p>
      </form>
    </AuthLayout>);

}