import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  CheckIcon,
  ChevronDownIcon,
  RefreshCwIcon,
  XIcon } from
'lucide-react';
import {
  defaultContainerStyle,
  shadowOptions,
  type ContainerStyle,
  type RowNode,
  type SectionNode } from
'../../data/editor';
import { ColorPickerPopover } from './ColorPickerPopover';
import { ImagePickerDialog } from './ImagePickerDialog';

interface ContainerSettingsProps {
  node: SectionNode | RowNode;
  onChange: (patch: Partial<ContainerStyle>) => void;
  onClose: () => void;
}

const spacingFields: Array<{
  group: 'pad' | 'mar';
  key: keyof ContainerStyle;
  label: string;
}> = [
{ group: 'pad', key: 'padTop', label: 'Sus' },
{ group: 'pad', key: 'padBottom', label: 'Jos' },
{ group: 'pad', key: 'padLeft', label: 'Stânga' },
{ group: 'pad', key: 'padRight', label: 'Dreapta' },
{ group: 'mar', key: 'marTop', label: 'Sus' },
{ group: 'mar', key: 'marBottom', label: 'Jos' },
{ group: 'mar', key: 'marLeft', label: 'Stânga' },
{ group: 'mar', key: 'marRight', label: 'Dreapta' }];


/** Panoul de editare pentru o secțiune sau un row */
export function ContainerSettings({
  node,
  onChange,
  onClose
}: ContainerSettingsProps) {
  const style = { ...defaultContainerStyle(node.type), ...node.style };
  const [colorOpen, setColorOpen] = useState(false);
  const [anchor, setAnchor] = useState({ top: 0, left: 0 });
  const [borderColorOpen, setBorderColorOpen] = useState(false);
  const [borderAnchor, setBorderAnchor] = useState({ top: 0, left: 0 });
  const [picker, setPicker] = useState<'bgImage' | 'bgVideo' | null>(null);
  const [shadowOpen, setShadowOpen] = useState(false);
  const shadowRef = useRef<HTMLDivElement>(null);

  // închide lista de umbre la click în afara ei
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

  return (
    <aside className="flex h-full w-[340px] shrink-0 flex-col overflow-y-auto border-r border-slate-200 bg-white px-6 py-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-bold text-ink">
          {node.type === 'section' ? 'Section' : 'Row'}
        </h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Închide setările"
          className="rounded-md p-1.5 text-ink-500 transition-colors duration-150 ease-out hover:bg-slate-100">
          
          <XIcon className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      <section className="mt-6">
        <h3 className="font-display text-base font-bold text-ink">Fundal</h3>

        <div className="mt-3 flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-ink-700">Culoare fundal</p>
          <button
            type="button"
            onClick={(event) => {
              if (colorOpen) {
                setColorOpen(false);
                return;
              }
              const rect = event.currentTarget.getBoundingClientRect();
              setAnchor({
                top: rect.top + rect.height / 2,
                left: rect.right + 16
              });
              setColorOpen(true);
            }}
            data-color-trigger
            aria-label="Alege culoarea de fundal"
            className="h-7 w-7 shrink-0 rounded-full border border-slate-200 shadow-sm transition-transform duration-150 ease-out hover:scale-110"
            style={{ backgroundColor: style.bgColor }} />
          
          {colorOpen &&
          createPortal(
            <div
              className="fixed z-[70] -translate-y-1/2"
              style={{ top: anchor.top, left: anchor.left }}>
              
                <ColorPickerPopover
                value={style.bgColor}
                onChange={(hex) => onChange({ bgColor: hex })}
                onClose={() => setColorOpen(false)} />
              
              </div>,
            document.body
          )}
        </div>

        <div className="mt-4 space-y-3">
          <div>
            <p className="text-sm font-semibold text-ink-500">Imagine fundal</p>
            {style.bgImage ?
            <div className="mt-1.5 flex items-center gap-2">
                <img
                src={style.bgImage}
                alt="Fundal"
                className="h-12 w-20 rounded-md object-cover" />
              
                <button
                type="button"
                onClick={() => onChange({ bgImage: '' })}
                className="text-sm font-semibold text-red-500 transition-colors duration-150 ease-out hover:text-red-600">
                
                  Elimină
                </button>
              </div> :

            <button
              type="button"
              onClick={() => setPicker('bgImage')}
              className="mt-1.5 flex w-full cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-slate-200 px-3 py-4 text-sm font-semibold text-ink-500 transition-colors duration-150 ease-out hover:border-brand-400 hover:text-brand-600">
              
                Alege o imagine
              </button>
            }
          </div>

          <div>
            <p className="text-sm font-semibold text-ink-500">Video fundal</p>
            {style.bgVideo ?
            <div className="mt-1.5 flex items-center gap-2">
                <span className="truncate text-sm font-semibold text-ink">
                  Video încărcat
                </span>
                <button
                type="button"
                onClick={() => onChange({ bgVideo: '' })}
                className="text-sm font-semibold text-red-500 transition-colors duration-150 ease-out hover:text-red-600">
                
                  Elimină
                </button>
              </div> :

            <button
              type="button"
              onClick={() => setPicker('bgVideo')}
              className="mt-1.5 flex w-full cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-slate-200 px-3 py-4 text-sm font-semibold text-ink-500 transition-colors duration-150 ease-out hover:border-brand-400 hover:text-brand-600">
              
                Alege un video
              </button>
            }
          </div>
        </div>

        {picker &&
        <ImagePickerDialog
          kind={picker === 'bgVideo' ? 'video' : 'image'}
          onClose={() => setPicker(null)}
          onInsert={(media) => {
            onChange({ [picker]: media.src } as Partial<ContainerStyle>);
            setPicker(null);
          }} />

        }
      </section>

      <section className="mt-8 border-t border-slate-200 pt-6">
        <h3 className="font-display text-base font-bold text-ink">Umbră</h3>
        <div className="relative mt-2" ref={shadowRef}>
          <button
            type="button"
            onClick={() => setShadowOpen((open) => !open)}
            className="flex w-full items-center justify-between rounded-md border border-slate-200 px-3 py-2.5 text-left text-sm font-semibold text-ink transition-colors duration-150 ease-out hover:border-brand-400">
            
            {shadow.label}
            <ChevronDownIcon className="h-4 w-4" aria-hidden="true" />
          </button>
          {shadowOpen &&
          <div className="absolute z-20 mt-1 max-h-64 w-full overflow-y-auto rounded-md border border-slate-200 bg-white shadow-xl">
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

      <section className="mt-8 border-t border-slate-200 pt-6">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-base font-bold text-ink">Border</h3>
          <button
            type="button"
            onClick={() =>
            onChange({
              borderMode: 'none',
              borderStyle: 'solid',
              borderWidth: 1,
              borderRadius: 0,
              borderColor: 'transparent'
            })
            }
            aria-label="Resetează conturul"
            className="rounded-md p-1.5 text-ink-500 transition-colors duration-150 ease-out hover:bg-slate-100">
            
            <RefreshCwIcon className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <select
          value={style.borderMode ?? 'none'}
          onChange={(event) =>
          onChange({
            borderMode: event.target.
            value as NonNullable<ContainerStyle['borderMode']>
          })
          }
          aria-label="Tipul conturului"
          className="mt-3 w-full rounded-md border border-slate-200 px-3 py-2.5 text-sm font-semibold text-ink focus:border-brand-500 focus:outline-none">
          
          <option value="none">Fără contur</option>
          <option value="full">Contur complet</option>
          <option value="bottom">Doar linia de jos</option>
          <option value="top">Doar linia de sus</option>
          <option value="topBottom">Sus și jos</option>
        </select>

        {(style.borderMode ?? 'none') !== 'none' &&
        <>
            <p className="mt-4 text-sm font-semibold text-ink-500">
              Stilul conturului
            </p>
            <div className="mt-1.5 grid grid-cols-3 rounded-md border border-slate-200 p-1">
              {(['solid', 'dotted', 'dashed'] as const).map((option) =>
            <button
              key={option}
              type="button"
              onClick={() => onChange({ borderStyle: option })}
              aria-pressed={(style.borderStyle ?? 'solid') === option}
              className={`rounded py-1.5 text-sm font-semibold capitalize transition-colors duration-150 ease-out ${
              (style.borderStyle ?? 'solid') === option ?
              'bg-slate-100 text-ink' :
              'text-ink-500 hover:text-ink'}`
              }>
              
                  {option}
                </button>
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
              value={style.borderWidth ?? 1}
              aria-label="Grosimea conturului"
              onChange={(event) =>
              onChange({ borderWidth: Number(event.target.value) })
              }
              className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full accent-brand-500"
              style={{
                background: `linear-gradient(to right, #2f6bff 0%, #2f6bff ${
                ((style.borderWidth ?? 1) - 1) / 19 * 100}%, #e2e8f0 ${

                ((style.borderWidth ?? 1) - 1) / 19 * 100}%, #e2e8f0 100%)`

              }} />
            
              <input
              type="number"
              min={1}
              max={20}
              value={style.borderWidth ?? 1}
              onChange={(event) =>
              onChange({ borderWidth: Number(event.target.value) || 1 })
              }
              aria-label="Grosimea conturului — valoare"
              className="w-[84px] rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-ink focus:border-brand-500 focus:outline-none" />
            
            </div>

            <div className="mt-4 flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-ink-700">
                Culoarea conturului
              </p>
              <button
              type="button"
              onClick={(event) => {
                if (borderColorOpen) {
                  setBorderColorOpen(false);
                  return;
                }
                const rect = event.currentTarget.getBoundingClientRect();
                setBorderAnchor({
                  top: rect.top + rect.height / 2,
                  left: rect.right + 16
                });
                setBorderColorOpen(true);
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
              
                {(style.borderColor ?? 'transparent') === 'transparent' &&
              <span className="absolute left-1/2 top-1/2 h-[1px] w-9 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-red-500" />
              }
              </button>
              {borderColorOpen &&
            createPortal(
              <div
                className="fixed z-[70] -translate-y-1/2"
                style={{ top: borderAnchor.top, left: borderAnchor.left }}>
                
                    <ColorPickerPopover
                  value={style.borderColor ?? '#0f1729'}
                  onChange={(hex) => onChange({ borderColor: hex })}
                  onClose={() => setBorderColorOpen(false)} />
                
                  </div>,
              document.body
            )}
            </div>
          </>
        }
      </section>

      <section className="mt-8 border-t border-slate-200 pt-6">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-base font-bold text-ink">
            Rotunjirea colțurilor
          </h3>
          <button
            type="button"
            onClick={() => onChange({ borderRadius: 0 })}
            aria-label="Resetează rotunjirea colțurilor"
            className="rounded-md p-1.5 text-ink-500 transition-colors duration-150 ease-out hover:bg-slate-100">
            
            <RefreshCwIcon className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
        <div className="mt-3 flex items-center gap-3">
          <input
            type="range"
            min={0}
            max={60}
            value={style.borderRadius ?? 0}
            aria-label="Rotunjirea colțurilor"
            onChange={(event) =>
            onChange({ borderRadius: Number(event.target.value) })
            }
            className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full accent-brand-500"
            style={{
              background: `linear-gradient(to right, #2f6bff 0%, #2f6bff ${
              (style.borderRadius ?? 0) / 60 * 100}%, #e2e8f0 ${

              (style.borderRadius ?? 0) / 60 * 100}%, #e2e8f0 100%)`

            }} />
          
          <input
            type="number"
            min={0}
            value={style.borderRadius ?? 0}
            onChange={(event) =>
            onChange({ borderRadius: Number(event.target.value) || 0 })
            }
            aria-label="Rotunjirea colțurilor — valoare"
            className="w-[84px] rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-ink focus:border-brand-500 focus:outline-none" />
          
        </div>
      </section>

      <section className="mt-8 border-t border-slate-200 pt-6">
        <h3 className="font-display text-base font-bold text-ink">
          Dimensiune și poziție
        </h3>
        {(['pad', 'mar'] as const).map((group) =>
        <div key={group} className="mt-4">
            <p className="text-sm font-semibold text-ink-500">
              {group === 'pad' ?
            'Spațiere interioară (padding)' :
            'Spațiere exterioară (margin)'}
            </p>
            <div className="mt-2 grid grid-cols-2 gap-3">
              {spacingFields.
            filter((field) => field.group === group).
            map((field) =>
            <label key={field.key} className="block">
                    <span className="text-xs font-semibold text-ink-400">
                      {field.label}
                    </span>
                    <input
                type="number"
                value={style[field.key] as number}
                onChange={(event) =>
                onChange({
                  // valorile negative sunt permise, pentru a strânge secțiunile
                  [field.key]: Number(event.target.value) || 0
                } as Partial<ContainerStyle>)
                }
                className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-ink focus:border-brand-500 focus:outline-none" />
              
                  </label>
            )}
            </div>
          </div>
        )}
      </section>

      <section className="mt-8 border-t border-slate-200 pb-6 pt-6">
        <h3 className="font-display text-base font-bold text-ink">
          Element vizibil pe:
        </h3>
        <div className="mt-3 space-y-2.5">
          {(
          [
          { key: 'visibleDesktop' as const, label: 'Desktop' },
          { key: 'visibleMobile' as const, label: 'Mobil' }] satisfies
          Array<{key: keyof ContainerStyle;label: string;}>).
          map((option) =>
          <label
            key={option.key}
            className="flex cursor-pointer items-center gap-3 text-sm font-semibold text-ink">
            
              <span
              className={`flex h-5 w-5 items-center justify-center rounded transition-colors duration-150 ease-out ${
              style[option.key] ?
              'bg-brand-500 text-white' :
              'border border-slate-300 bg-white'}`
              }>
              
                {style[option.key] &&
              <CheckIcon className="h-3.5 w-3.5" aria-hidden="true" />
              }
              </span>
              <input
              type="checkbox"
              checked={Boolean(style[option.key])}
              onChange={(event) =>
              onChange({ [option.key]: event.target.checked })
              }
              className="sr-only" />
            
              {option.label}
            </label>
          )}
        </div>
      </section>
    </aside>);

}