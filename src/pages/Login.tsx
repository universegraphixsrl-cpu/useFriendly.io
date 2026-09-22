import React, { useState } from 'react';
import {
  EyeIcon,
  EyeOffIcon,
  CheckIcon,
  ArrowLeftIcon,
  LoaderIcon } from
'lucide-react';
import {
  AuthLayout,
  AuthDivider,
  AuthField,
  GoogleButton } from
'../components/auth/AuthLayout';
import { useAuth } from '../contexts/AuthContext';

/**
 * Designul e cel făcut în Magic Patterns.
 *
 * Singura schimbare față de varianta de acolo: emailul și parola nu mai sunt
 * scrise în cod. Verificarea se face de Supabase, pe server — în browser nu
 * ajunge nicio parolă, iar conturile sunt reale. La fel și „am uitat parola":
 * trimite un link adevărat de resetare pe email.
 */

interface LoginProps {
  onBackToSite: () => void;
  onGoToSignup: () => void;
}

export function Login({ onBackToSite, onGoToSignup }: LoginProps) {
  const { signIn, resetPassword, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [forgot, setForgot] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError('');
    const message = await signIn(email, password);
    // La reușită nu facem nimic aici: sesiunea se schimbă și aplicația
    // trece singură în CRM.
    if (message) setError(message);
    setBusy(false);
  };

  const sendReset = async (event: React.FormEvent) => {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError('');
    const message = await resetPassword(email);
    if (message) setError(message);else
    setResetSent(true);
    setBusy(false);
  };

  const withGoogle = async () => {
    setError('');
    const message = await signInWithGoogle();
    if (message) setError(message);
  };

  if (forgot) {
    return (
      <AuthLayout
        title="Ți-ai uitat parola?"
        subtitle="Scrie adresa de email și îți trimitem un link de resetare."
        onBackToSite={onBackToSite}
        footer={
        <button
          type="button"
          onClick={() => {
            setForgot(false);
            setResetSent(false);
            setError('');
          }}
          className="inline-flex items-center gap-1.5 font-semibold text-brand-600 hover:text-brand-700">

            <ArrowLeftIcon className="h-4 w-4" aria-hidden="true" />
            Înapoi la log in
          </button>
        }>

        {resetSent ?
        <p className="flex items-start gap-2.5 rounded-lg border border-green-200 bg-green-50 px-4 py-3.5 text-[15px] font-semibold text-green-800">
            <CheckIcon
            className="mt-0.5 h-5 w-5 shrink-0"
            strokeWidth={3}
            aria-hidden="true" />

            Am trimis linkul de resetare pe {email || 'adresa ta de email'}.
          </p> :

        <form onSubmit={sendReset} className="space-y-5">
            <AuthField
            label="Email"
            type="email"
            value={email}
            onChange={(value) => {
              setEmail(value);
              setError('');
            }}
            placeholder="nume@email.com"
            autoComplete="email"
            required />

            {error &&
          <p className="text-xs font-semibold text-red-600" role="alert">
                {error}
              </p>
          }
            <button
            type="submit"
            disabled={busy}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-500 px-5 py-3.5 font-display text-[15px] font-bold text-white transition-colors duration-150 ease-out hover:bg-brand-600 disabled:opacity-60">

              {busy &&
            <LoaderIcon className="h-4 w-4 animate-spin" aria-hidden="true" />
            }
              Trimite linkul de resetare
            </button>
          </form>
        }
      </AuthLayout>);

  }

  return (
    <AuthLayout
      title="Bine ai revenit"
      subtitle="Intră în contul tău Friendly."
      onBackToSite={onBackToSite}
      footer={
      <>
          Nu ai încă un cont?{' '}
          <button
          type="button"
          onClick={onGoToSignup}
          className="font-semibold text-brand-600 hover:text-brand-700">

            Creează unul gratuit
          </button>
        </>
      }>

      <GoogleButton label="Continuă cu Google" onClick={withGoogle} />
      <AuthDivider />

      <form onSubmit={submit} className="space-y-5" noValidate>
        <AuthField
          label="Email"
          type="email"
          value={email}
          onChange={(value) => {
            setEmail(value);
            setError('');
          }}
          placeholder="nume@email.com"
          autoComplete="email"
          required />


        <div>
          <AuthField
            label="Parolă"
            type={show ? 'text' : 'password'}
            value={password}
            onChange={(value) => {
              setPassword(value);
              setError('');
            }}
            placeholder="Parola ta"
            autoComplete="current-password"
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

          <div className="mt-2 flex items-center justify-between gap-3">
            {error ?
            <p className="text-xs font-semibold text-red-600" role="alert">
                {error}
              </p> :

            <span />
            }
            <button
              type="button"
              onClick={() => {
                setForgot(true);
                setError('');
              }}
              className="text-xs font-semibold text-brand-600 hover:text-brand-700">

              Am uitat parola
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={busy}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-500 px-5 py-3.5 font-display text-[15px] font-bold text-white transition-colors duration-150 ease-out hover:bg-brand-600 disabled:opacity-60">

          {busy &&
          <LoaderIcon className="h-4 w-4 animate-spin" aria-hidden="true" />
          }
          {busy ? 'Se conectează…' : 'Log in'}
        </button>
      </form>
    </AuthLayout>);

}
