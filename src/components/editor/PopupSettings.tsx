import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { CheckIcon, ChevronDownIcon, RefreshCwIcon, XIcon } from 'lucide-react';
import {
  defaultPopupStyle,
  shadowOptions,
  type PopupStyle } from
'../../data/editor';
import { ColorPickerPopover } from './ColorPickerPopover';

interface PopupSettingsProps {
  style: PopupStyle;
  onChange: (patch: Partial<PopupStyle>) => void;
  onClose: () => void;
}

/** Un select simplu On/Off, folosit de comutatoarele pop-up-ului */
function Toggle({
  label,
  value,
  onChange




}: {label: string;value: boolean;onChange: (next: boolean) => void;}) {
  return (
    <label className="mt-4 block first:mt-0">
      <span className="text-sm font-semibold text-ink-500">{label}</span>
      <select
        value={value ? 'on' : 'off'}
        onChange={(event) => onChange(event.target.value === 'on')}
        className="mt-1.5 w-full rounded-md border border-slate-200 px-3 py-2.5 text-sm font-semibold text-ink focus:border-brand-500 focus:outline-none">
        
        <option value="on">On</option>
        <option value="off">Off</option>
      </select>
    </label>);

}

/** Panoul de editare al ferestrei pop-up */
export function PopupSettings({ style, onChange, onClose }: PopupSettingsProps) {
  const [bgOpen, setBgOpen] = useState(false);
  const [bgAnchor, setBgAnchor] = useState({ top: 0, left: 0 });
  const [borderOpen, setBorderOpen] = useState(false);
  const [borderAnchor, setBorderAnchor] = useState({ top: 0, left: 0 });
  const [shadowOpen, setShadowOpen] = useState(false);
  const shadowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!shadowOpen) return;
    const onDown = (event: MouseEvent) => {
      if (!shadowRef.current?.contains(event.target as Node))
      setShadowOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [shadowOpen]);

  const shadow =
  shadowOptions.find((option) => option.key === style.shadow) ??
  shadowOptions[0];

  const widthPercent = (style.width - 320) / (1200 - 320) * 100;

  return (
    <aside className="flex h-full w-[340px] shrink-0 flex-col overflow-y-auto border-r border-slate-200 bg-white px-6 py-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-bold text-ink">Popup</h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Închide setările pop-up-ului"
          className="rounded-md p-1.5 text-ink-500 transition-colors duration-150 ease-out hover:bg-slate-100">
          
          <XIcon className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      <section className="mt-6">
        <Toggle
          label="Arată butonul de închidere"
          value={style.showClose}
          onChange={(showClose) => onChange({ showClose })} />
        
        <Toggle
          label="Se deschide automat?"
          value={style.autoOpen}
          onChange={(autoOpen) => onChange({ autoOpen })} />
        
        <Toggle
          label="Se deschide la intenția de ieșire?"
          value={style.exitIntent}
          onChange={(exitIntent) => onChange({ exitIntent })} />
        

        <p className="mt-4 text-sm font-semibold text-ink-500">Lățime</p>
        <div className="mt-1.5 flex items-center gap-3">
          <input
            type="range"
            min={320}
            max={1200}
            value={style.width}
            aria-label="Lățimea pop-up-ului"
            onChange={(event) => onChange({ width: Number(event.target.value) })}
            className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full accent-brand-500"
            style={{
              background: `linear-gradient(to right, #2f6bff 0%, #2f6bff ${widthPercent}%, #e2e8f0 ${widthPercent}%, #e2e8f0 100%)`
            }} />
          
          <input
            type="number"
            min={320}
            max={1200}
            value={style.width}
            onChange={(event) =>
            onChange({ width: Number(event.target.value) || 320 })
            }
            aria-label="Lățimea pop-up-ului — valoare"
            className="w-[84px] rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-ink focus:border-brand-500 focus:outline-none" />
          
        </div>
      </section>

      <section className="mt-8 border-t border-slate-200 pt-6">
        <h3 className="font-display text-base font-bold text-ink">Culori</h3>
        <div className="mt-3 flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-ink-700">Culoare fundal</p>
          <button
            type="button"
            onClick={(event) => {
              if (bgOpen) {
                setBgOpen(false);
                return;
              }
              const rect = event.currentTarget.getBoundingClientRect();
              setBgAnchor({
                top: rect.top + rect.height / 2,
                left: rect.right + 16
              });
              setBgOpen(true);
            }}
            data-color-trigger
            aria-label="Alege culoarea de fundal"
            className="h-7 w-7 shrink-0 rounded-full border border-slate-200 shadow-sm transition-transform duration-150 ease-out hover:scale-110"
            style={{ backgroundColor: style.bgColor }} />
          
          {bgOpen &&
          createPortal(
            <div
              className="fixed z-[80] -translate-y-1/2"
              style={{ top: bgAnchor.top, left: bgAnchor.left }}>
              
                <ColorPickerPopover
                value={style.bgColor}
                onChange={(hex) => onChange({ bgColor: hex })}
                onClose={() => setBgOpen(false)} />
              
              </div>,
            document.body
          )}
        </div>
      </section>

      <section className="mt-8 border-t border-slate-200 pt-6">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-base font-bold text-ink">
            Dimensiune și poziție
          </h3>
          <button
            type="button"
            onClick={() => onChange({ padY: 30, padX: 30 })}
            aria-label="Resetează spațierea"
            className="rounded-md p-1.5 text-ink-500 transition-colors duration-150 ease-out hover:bg-slate-100">
            
            <RefreshCwIcon className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
        <p className="mt-3 text-sm font-semibold text-ink-500">
          Spațiere interioară (padding)
        </p>
        <div className="mt-2 grid grid-cols-2 gap-3">
          <label className="block">
            <span className="text-xs font-semibold text-ink-400">Sus/jos</span>
            <input
              type="number"
              min={0}
              value={style.padY}
              onChange={(event) =>
              onChange({ padY: Number(event.target.value) || 0 })
              }
              className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-ink focus:border-brand-500 focus:outline-none" />
            
          </label>
          <label className="block">
            <span className="text-xs font-semibold text-ink-400">
              Stânga/dreapta
            </span>
            <input
              type="number"
              min={0}
              value={style.padX}
              onChange={(event) =>
              onChange({ padX: Number(event.target.value) || 0 })
              }
              className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-ink focus:border-brand-500 focus:outline-none" />
            
          </label>
        </div>
      </section>

      <section className="mt-8 border-t border-slate-200 pt-6">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-base font-bold text-ink">Border</h3>
          <button
            type="button"
            onClick={() => {
              const base = defaultPopupStyle();
              onChange({
                borderMode: base.borderMode,
                borderStyle: base.borderStyle,
                borderWidth: base.borderWidth,
                borderColor: base.borderColor,
                radius: base.radius
              });
            }}
            aria-label="Resetează conturul"
            className="rounded-md p-1.5 text-ink-500 transition-colors duration-150 ease-out hover:bg-slate-100">
            
            <RefreshCwIcon className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <label className="mt-3 block">
          <span className="text-sm font-semibold text-ink-500">
            Rotunjirea colțurilor
          </span>
          <input
            type="number"
            min={0}
            value={style.radius}
            onChange={(event) =>
            onChange({ radius: Number(event.target.value) || 0 })
            }
            className="mt-1.5 w-full rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-ink focus:border-brand-500 focus:outline-none" />
          
        </label>

        <p className="mt-4 text-sm font-semibold text-ink-500">
          Stilul conturului
        </p>
        <div className="mt-1.5 grid grid-cols-3 rounded-md border border-slate-200 p-1">
          {(['solid', 'dotted', 'dashed'] as const).map((option) =>
          <button
            key={option}
            type="button"
            onClick={() => onChange({ borderStyle: option })}
            aria-pressed={style.borderStyle === option}
            className={`rounded py-1.5 text-sm font-semibold capitalize transition-colors duration-150 ease-out ${
            style.borderStyle === option ?
            'bg-slate-100 text-ink' :
            'text-ink-500 hover:text-ink'}`
            }>
            
              {option}
            </button>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-ink-700">
            Culoarea conturului
          </p>
          <button
            type="button"
            onClick={(event) => {
              if (borderOpen) {
                setBorderOpen(false);
                return;
              }
              const rect = event.currentTarget.getBoundingClientRect();
              setBorderAnchor({
                top: rect.top + rect.height / 2,
                left: rect.right + 16
              });
              setBorderOpen(true);
            }}
            data-color-trigger
            aria-label="Alege culoarea conturului"
            className="relative h-7 w-7 shrink-0 overflow-hidden rounded-full border border-slate-200 shadow-sm transition-transform duration-150 ease-out hover:scale-110"
            style={{
              backgroundColor:
              style.borderColor === 'transparent' ?
              '#ffffff' :
              style.borderColor
            }}>
            
            {style.borderColor === 'transparent' &&
            <span className="absolute left-1/2 top-1/2 h-[1px] w-9 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-red-500" />
            }
          </button>
          {borderOpen &&
          createPortal(
            <div
              className="fixed z-[80] -translate-y-1/2"
              style={{ top: borderAnchor.top, left: borderAnchor.left }}>
              
                <ColorPickerPopover
                value={style.borderColor}
                onChange={(hex) => onChange({ borderColor: hex })}
                onClose={() => setBorderOpen(false)} />
              
              </div>,
            document.body
          )}
        </div>

        <p className="mt-4 text-sm font-semibold text-ink-500">
          Grosimea conturului
        </p>
        <div className="mt-1.5 flex items-center gap-3">
          <input
            type="range"
            min={1}
            max={20}
            value={style.borderWidth}
            aria-label="Grosimea conturului"
            onChange={(event) =>
            onChange({ borderWidth: Number(event.target.value) })
            }
            className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full accent-brand-500"
            style={{
              background: `linear-gradient(to right, #2f6bff 0%, #2f6bff ${
              (style.borderWidth - 1) / 19 * 100}%, #e2e8f0 ${

              (style.borderWidth - 1) / 19 * 100}%, #e2e8f0 100%)`

            }} />
          
          <input
            type="number"
            min={1}
            max={20}
            value={style.borderWidth}
            onChange={(event) =>
            onChange({ borderWidth: Number(event.target.value) || 1 })
            }
            aria-label="Grosimea conturului — valoare"
            className="w-[84px] rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-ink focus:border-brand-500 focus:outline-none" />
          
        </div>

        <label className="mt-4 block">
          <span className="text-sm font-semibold text-ink-500">
            Tipul conturului
          </span>
          <select
            value={style.borderMode}
            onChange={(event) =>
            onChange({
              borderMode: event.target.value as PopupStyle['borderMode']
            })
            }
            className="mt-1.5 w-full rounded-md border border-slate-200 px-3 py-2.5 text-sm font-semibold text-ink focus:border-brand-500 focus:outline-none">
            
            <option value="none">Fără contur</option>
            <option value="full">Contur complet</option>
            <option value="bottom">Doar linia de jos</option>
            <option value="top">Doar linia de sus</option>
            <option value="topBottom">Sus și jos</option>
          </select>
        </label>
      </section>

      <section className="mt-8 border-t border-slate-200 pb-6 pt-6">
        <h3 className="font-display text-base font-bold text-ink">Umbră</h3>
        <div className="relative mt-2" ref={shadowRef}>
          <button
            type="button"
            onClick={() => setShadowOpen((open) => !open)}
            className="flex w-full items-center justify-between rounded-md border border-slate-200 px-3 py-2.5 text-left text-sm font-semibold text-ink transition-colors duration-150 ease-out hover:border-brand-400">
            
            {shadow.label}
            <ChevronDownIcon
              className="h-4 w-4 text-ink-400"
              aria-hidden="true" />
            
          </button>
          {shadowOpen &&
          <div className="absolute z-30 mt-1 max-h-72 w-full overflow-y-auto rounded-md border border-slate-200 bg-white py-1 shadow-xl">
              {shadowOptions.map((option) =>
            <button
              key={option.key}
              type="button"
              onClick={() => {
                onChange({ shadow: option.key });
                setShadowOpen(false);
              }}
              className="flex w-full items-center justify-between px-3 py-2.5 text-left text-sm font-semibold text-ink transition-colors duration-150 ease-out hover:bg-slate-50">
              
                  {option.label}
                  {style.shadow === option.key &&
              <CheckIcon
                className="h-4 w-4 text-brand-600"
                aria-hidden="true" />

              }
                </button>
            )}
            </div>
          }
        </div>
      </section>
    </aside>);

}