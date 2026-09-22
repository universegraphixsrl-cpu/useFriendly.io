import React from 'react';
import { CheckIcon } from 'lucide-react';

const builderPoints = [
'Secțiuni, row-uri și elemente trase direct pe pagină',
'Fiecare element cu panoul lui: culori, fonturi, spațiere, hover',
'Editare separată pe desktop și pe mobil',
'Pop-up-uri, timere, bare de progres și calendare de booking'];


const automationPoints = [
'Trigger din funnel: formular completat, pagină vizitată, plată reușită',
'Acțiuni înlănțuite: taguri, campanii, cursuri, etape de pipeline',
'Email și SMS cu întârziere pe zile și oră fixă de trimitere',
'Webhook-uri și Make conectat din prima zi'];


/** Două secțiuni „spotlight”: web builder și automatizări */
export function SiteSpotlight() {
  return (
    <>
      <section id="builder" className="bg-slate-50 py-20 lg:py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 lg:grid-cols-2 lg:px-8">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-brand-600">
              Web builder
            </p>
            <h2 className="mt-3 font-display text-3xl font-extrabold leading-tight tracking-tight text-ink sm:text-4xl">
              Îți construiești paginile singur, în aceeași seară
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-ink-500">
              Editorul lucrează pe secțiuni, row-uri și elemente, exact ca
              tool-urile mari — doar că îl înțelegi din prima. Publici pagina
              când vrei, o modifici oricând, fără să aștepți pe nimeni.
            </p>
            <ul className="mt-7 space-y-3">
              {builderPoints.map((point) =>
              <li key={point} className="flex gap-3">
                  <CheckIcon
                  className="mt-0.5 h-5 w-5 shrink-0 text-brand-500"
                  strokeWidth={3}
                  aria-hidden="true" />
                
                  <span className="text-[15px] font-semibold text-ink-700">
                    {point}
                  </span>
                </li>
              )}
            </ul>
          </div>

          <img
            src="/e9fa61d3-f64f-4878-84ec-e23e4a995b54.jpg"
            alt="Editorul de pagini din Friendly, cu paleta de elemente și canvasul de editare"
            className="w-full rounded-2xl border border-slate-200 shadow-sm" />
          
        </div>
      </section>

      <section id="automatizari" className="bg-white py-20 lg:py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 lg:grid-cols-2 lg:px-8">
          <img
            src="/392beaba-6027-4840-9484-f01c71077f15.jpg"
            alt="Constructorul de automatizări din Friendly, cu pași legați pe verticală"
            className="w-full rounded-2xl border border-slate-200 shadow-sm lg:order-last" />
          

          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-brand-600">
              Automatizări, email & SMS
            </p>
            <h2 className="mt-3 font-display text-3xl font-extrabold leading-tight tracking-tight text-ink sm:text-4xl">
              Vinde și când nu ești la laptop
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-ink-500">
              Construiești fluxul pe pași, ca un funnel: cine intră, ce
              primește, când și pe ce canal. Fiecare mesaj se scrie în editorul
              nostru, cu variabile și previzualizare.
            </p>
            <ul className="mt-7 space-y-3">
              {automationPoints.map((point) =>
              <li key={point} className="flex gap-3">
                  <CheckIcon
                  className="mt-0.5 h-5 w-5 shrink-0 text-brand-500"
                  strokeWidth={3}
                  aria-hidden="true" />
                
                  <span className="text-[15px] font-semibold text-ink-700">
                    {point}
                  </span>
                </li>
              )}
            </ul>
          </div>
        </div>
      </section>
    </>);

}