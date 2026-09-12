import React from 'react';
import type { PageBlock } from '../../data/webPages';

interface BlockPreviewProps {
  block: PageBlock;
  color: string;
}

/** Randarea simplificată a unui bloc în canvasul builderului */
export function BlockPreview({ block, color }: BlockPreviewProps) {
  if (block.type === 'hero' || block.type === 'cta') {
    return (
      <div
        className="rounded-xl px-6 py-8 text-center"
        style={{ backgroundColor: '#0f1729' }}>
        
        <h3 className="font-display text-xl font-extrabold tracking-tight text-white">
          {block.heading}
        </h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-slate-300">
          {block.body}
        </p>
        {block.action &&
        <span
          className="mt-4 inline-flex rounded-lg px-4 py-2 font-display text-sm font-bold text-white"
          style={{ backgroundColor: color }}>
          
            {block.action}
          </span>
        }
      </div>);

  }

  if (block.type === 'form') {
    return (
      <div className="rounded-xl border border-slate-200 bg-white px-6 py-6">
        <h3 className="font-display text-base font-extrabold tracking-tight text-ink">
          {block.heading}
        </h3>
        <p className="mt-1 text-sm text-ink-500">{block.body}</p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {['Prenume', 'Nume', 'Email', 'Telefon'].map((field) =>
          <div
            key={field}
            className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-ink-500">
            
              {field}
            </div>
          )}
        </div>
        {block.action &&
        <span
          className="mt-3 inline-flex rounded-lg px-4 py-2 font-display text-sm font-bold text-white"
          style={{ backgroundColor: color }}>
          
            {block.action}
          </span>
        }
      </div>);

  }

  if (block.type === 'video') {
    return (
      <div className="rounded-xl border border-slate-200 bg-white px-6 py-6">
        <h3 className="font-display text-base font-extrabold tracking-tight text-ink">
          {block.heading}
        </h3>
        <p className="mt-1 text-sm text-ink-500">{block.body}</p>
        <div className="mt-4 flex aspect-video items-center justify-center rounded-lg bg-slate-900">
          <span
            className="flex h-12 w-12 items-center justify-center rounded-full text-white"
            style={{ backgroundColor: color }}
            aria-hidden="true">
            
            ▶
          </span>
        </div>
      </div>);

  }

  if (block.type === 'pricing') {
    return (
      <div className="rounded-xl border border-slate-200 bg-white px-6 py-6">
        <h3 className="font-display text-base font-extrabold tracking-tight text-ink">
          {block.heading}
        </h3>
        <p className="mt-1 text-sm text-ink-500">{block.body}</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {['Growth', 'Pro'].map((plan, index) =>
          <div
            key={plan}
            className="rounded-lg border border-slate-200 px-4 py-4"
            style={index === 1 ? { borderColor: color } : undefined}>
            
              <p className="font-display text-sm font-bold text-ink">{plan}</p>
              <p className="mt-1 font-display text-xl font-extrabold text-ink">
                {index === 0 ? '198 €' : '349 €'}
              </p>
              <p className="text-xs text-ink-500">pe lună</p>
            </div>
          )}
        </div>
      </div>);

  }

  if (block.type === 'testimonials' || block.type === 'faq') {
    return (
      <div className="rounded-xl border border-slate-200 bg-white px-6 py-6">
        <h3 className="font-display text-base font-extrabold tracking-tight text-ink">
          {block.heading}
        </h3>
        <div className="mt-3 space-y-2">
          {block.body.split(/(?<=[.?])\s+/).map((line, index) =>
          <p
            key={index}
            className="rounded-lg bg-slate-50 px-3 py-2 text-sm text-ink-700">
            
              {line}
            </p>
          )}
        </div>
      </div>);

  }

  if (block.type === 'footer') {
    return (
      <div className="rounded-xl bg-slate-100 px-6 py-5 text-center">
        <p className="font-display text-sm font-bold text-ink">
          {block.heading}
        </p>
        <p className="mt-1 text-xs text-ink-500">{block.body}</p>
      </div>);

  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white px-6 py-6">
      <h3 className="font-display text-base font-extrabold tracking-tight text-ink">
        {block.heading}
      </h3>
      <p className="mt-1 text-sm leading-relaxed text-ink-700">{block.body}</p>
    </div>);

}