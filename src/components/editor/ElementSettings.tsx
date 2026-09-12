import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  AlignCenterIcon,
  AlignLeftIcon,
  AlignRightIcon,
  CheckIcon,
  ChevronDownIcon,
  RefreshCwIcon,
  UploadCloudIcon,
  XIcon } from
'lucide-react';
import { bookingCalendars } from '../../data/calendars';
import { googleFonts, loadGoogleFont } from '../../data/googleFonts';
import { MenuItemsPanel } from './MenuItemsPanel';
import {
  defaultStyle,
  elementColorFields,
  fontStyleOptions,
  shadowOptions,
  elementLabels,
  elementTextFields,
  hasTypography,
  type ElementNode,
  type ElementStyle,
  type TextAlign,
  type Typography } from
'../../data/editor';
import { ColorPickerPopover } from './ColorPickerPopover';
import { FormFieldsPanel } from './FormFieldsPanel';
import { ImagePickerDialog } from './ImagePickerDialog';
import { bulletIcon, bulletIconOptions } from './bulletIcons';
import { ElementIcon, elementIcon, elementIconOptions } from './elementIcons';

interface ElementSettingsProps {
  node: ElementNode;
  device: 'desktop' | 'mobile';
  onChange: (
  patch: Partial<ElementStyle> & {calendarId?: string | null;})
  => void;
  onClose: () => void;
}

const typoFields: Array<{
  key: 'fontSize' | 'lineHeight' | 'letterSpacing';
  label: string;
  min: number;
  max: number;
}> = [
{ key: 'fontSize', label: 'Mărime font', min: 10, max: 80 },
{ key: 'lineHeight', label: 'Înălțime rând', min: 12, max: 100 },
{ key: 'letterSpacing', label: 'Spațiere litere', min: -3, max: 20 }];


const alignOptions: Array<{
  value: TextAlign;
  label: string;
  icon: typeof AlignLeftIcon;
}> = [
{ value: 'left', label: 'Stânga', icon: AlignLeftIcon },
{ value: 'center', label: 'Centru', icon: AlignCenterIcon },
{ value: 'right', label: 'Dreapta', icon: AlignRightIcon }];


const spacingFields: Array<{
  group: 'pad' | 'mar';
  key: keyof ElementStyle;
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


/** Panoul din stânga: setările elementului selectat */
export function ElementSettings({
  node,
  device,
  onChange,
  onClose
}: ElementSettingsProps) {
  const style = node.style ?? defaultStyle(node.kind);
  const typo =
  device === 'mobile' ?
  { ...style.typo, ...style.typoMobile } :
  style.typo;

  /** Fontul se setează separat pe desktop și pe mobil */
  const setTypoFont = (family: string) =>
  device === 'mobile' ?
  onChange({ typoMobile: { fontFamily: family } }) :
  onChange({ typo: { fontFamily: family } as Partial<Typography> });

  /** Grosimea/înclinarea se setează la fel, separat pe desktop și mobil */
  const setTypoStyle = (value: string) =>
  device === 'mobile' ?
  onChange({ typoMobile: { fontStyle: value } }) :
  onChange({ typo: { fontStyle: value } as Partial<Typography> });

  /** Tipografia subtextului de pe buton, editată separat de textul principal */
  const subTypo = {
    fontFamily: '',
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: 0,
    fontStyle: '400',
    ...style.btnSubTypo
  };

  const setSubTypo = (patch: Record<string, number | string>) =>
  onChange({ btnSubTypo: { ...subTypo, ...patch } });

  const setTypo = (key: keyof Typography, value: number) =>
  device === 'mobile' ?
  onChange({ typoMobile: { [key]: value } }) :
  onChange({ typo: { [key]: value } as Partial<Typography> });

  const [openColor, setOpenColor] = useState<string | null>(null);
  const [anchor, setAnchor] = useState({ top: 0, left: 0 });
  const [calendarOpen, setCalendarOpen] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);
  const [imagePicker, setImagePicker] = useState(false);
  const [bulletMenu, setBulletMenu] = useState(false);
  const [fontStyleOpen, setFontStyleOpen] = useState(false);
  const fontStyleRef = useRef<HTMLDivElement>(null);

  // închide lista de stiluri la click în afara ei
  useEffect(() => {
    if (!fontStyleOpen) return;
    const onDown = (event: MouseEvent) => {
      if (!fontStyleRef.current?.contains(event.target as Node))
      setFontStyleOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [fontStyleOpen]);
  const [optionalHint, setOptionalHint] = useState(false);
  const [hintAnchor, setHintAnchor] = useState({ top: 0, left: 0 });

  // închide explicația la click oriunde în afara ei
  useEffect(() => {
    if (!optionalHint) return;
    const onDown = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('[data-optional-hint]')) setOptionalHint(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [optionalHint]);
  const bulletMenuRef = useRef<HTMLDivElement>(null);
  const [iconMenu, setIconMenu] = useState(false);
  const iconMenuRef = useRef<HTMLDivElement>(null);

  // închide biblioteca de iconițe la click în afara ei
  useEffect(() => {
    if (!iconMenu) return;
    const onDown = (event: MouseEvent) => {
      if (!iconMenuRef.current?.contains(event.target as Node))
      setIconMenu(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [iconMenu]);

  // închide lista de iconițe la click în afara ei
  useEffect(() => {
    if (!bulletMenu) return;
    const onDown = (event: MouseEvent) => {
      if (!bulletMenuRef.current?.contains(event.target as Node))
      setBulletMenu(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [bulletMenu]);
  const [fontOpen, setFontOpen] = useState(false);
  const [fontQuery, setFontQuery] = useState('');
  const fontRef = useRef<HTMLDivElement>(null);
  const [subFontOpen, setSubFontOpen] = useState(false);
  const [subFontQuery, setSubFontQuery] = useState('');
  const subFontRef = useRef<HTMLDivElement>(null);

  // închide lista de fonturi a subtextului la click în afara ei
  useEffect(() => {
    if (!subFontOpen) return;
    const onDown = (event: MouseEvent) => {
      if (!subFontRef.current?.contains(event.target as Node))
      setSubFontOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [subFontOpen]);

  // închide lista de fonturi la click în afara ei
  useEffect(() => {
    if (!fontOpen) return;
    const onDown = (event: MouseEvent) => {
      if (!fontRef.current?.contains(event.target as Node)) setFontOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [fontOpen]);

  // închide lista de calendare la click în afara ei
  useEffect(() => {
    if (!calendarOpen) return;
    const onDown = (event: MouseEvent) => {
      if (!calendarRef.current?.contains(event.target as Node))
      setCalendarOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [calendarOpen]);

  const textField = elementTextFields[node.kind];
  const colorFields = elementColorFields[node.kind];
  const activeCalendars = bookingCalendars.filter((item) => item.active);
  const selectedCalendar = activeCalendars.find(
    (item) => item.id === node.calendarId
  );

  return (
    <aside className="flex h-full w-[340px] shrink-0 flex-col overflow-y-auto border-r border-slate-200 bg-white px-6 py-6">
      <div
        className="flex items-center justify-between"
        style={{ order: -3 }}>
        
        <h2 className="font-display text-xl font-bold text-ink">
          {elementLabels[node.kind]}
        </h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Închide setările"
          className="rounded-md p-1.5 text-ink-500 transition-colors duration-150 ease-out hover:bg-slate-100">
          
          <XIcon className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      {node.kind === 'calendar' &&
      <section className="mt-6">
          <h3 className="font-display text-base font-bold text-ink">
            Selectează calendar
          </h3>
          <div className="relative mt-2" ref={calendarRef}>
            <button
            type="button"
            onClick={() => setCalendarOpen((value) => !value)}
            className={`flex w-full items-center justify-between rounded-md border px-3 py-2.5 text-left text-sm font-semibold transition-colors duration-150 ease-out ${
            selectedCalendar ?
            'border-slate-200 text-ink' :
            'border-brand-300 text-ink-400'}`
            }>
            
              <span className="flex min-w-0 items-center gap-2">
                {selectedCalendar &&
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: selectedCalendar.color }} />

              }
                <span className="truncate">
                  {selectedCalendar ?
                selectedCalendar.name :
                'Selectează calendar'}
                </span>
              </span>
              <ChevronDownIcon className="h-4 w-4 shrink-0" aria-hidden="true" />
            </button>

            {calendarOpen &&
          <div className="absolute z-20 mt-1 w-full overflow-hidden rounded-md border border-slate-200 bg-white shadow-xl">
                {activeCalendars.map((calendar) =>
            <button
              key={calendar.id}
              type="button"
              onClick={() => {
                onChange({ calendarId: calendar.id });
                setCalendarOpen(false);
              }}
              className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm font-semibold text-ink transition-colors duration-150 ease-out hover:bg-slate-50">
              
                    <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: calendar.color }} />
              
                    <span className="min-w-0 flex-1 truncate">
                      {calendar.name}
                    </span>
                    {node.calendarId === calendar.id &&
              <CheckIcon
                className="h-4 w-4 text-brand-600"
                aria-hidden="true" />

              }
                  </button>
            )}
              </div>
          }
          </div>
          {!selectedCalendar &&
        <p className="mt-2 text-xs font-semibold text-red-500">
              Alege un calendar activ. Fără el, pagina nu poate fi salvată.
            </p>
        }
        </section>
      }

      {node.kind === 'menu' &&
      <MenuItemsPanel
        items={style.menuItems ?? []}
        onChange={(menuItems) => onChange({ menuItems })} />

      }

      {node.kind === 'icon' &&
      // prima secțiune din panoul elementului Icon
      <section className="mt-6" style={{ order: -1 }}>
          <h3 className="font-display text-base font-bold text-ink">
            Model iconiță
          </h3>

          <div className="relative mt-2" ref={iconMenuRef}>
            <button
            type="button"
            onClick={() => setIconMenu((open) => !open)}
            aria-expanded={iconMenu}
            className="flex w-full items-center gap-3 rounded-md border border-slate-200 px-3 py-2.5 text-left transition-colors duration-150 ease-out hover:border-brand-300">
            
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-slate-100">
                <ElementIcon
                iconKey={style.iconName}
                size={20}
                color="#0f1729" />
              
              </span>
              <span className="text-sm font-semibold text-ink">
                {elementIcon(style.iconName).label}
              </span>
              <ChevronDownIcon
              className="ml-auto h-4 w-4 text-ink-400"
              aria-hidden="true" />
            
            </button>

            {iconMenu &&
          <div className="absolute z-30 mt-1 w-full rounded-md border border-slate-200 bg-white p-3 shadow-xl">
                <p className="text-xs font-bold text-ink-500">
                  {elementIconOptions.length} iconițe
                </p>
                <div className="mt-2 grid max-h-72 grid-cols-6 gap-2 overflow-y-auto">
                  {elementIconOptions.map((option) =>
              <button
                key={option.key}
                type="button"
                onClick={() => {
                  onChange({ iconName: option.key });
                  setIconMenu(false);
                }}
                title={option.label}
                aria-label={option.label}
                aria-pressed={elementIcon(style.iconName).key === option.key}
                className={`flex h-9 w-9 items-center justify-center rounded-md border transition-colors duration-150 ease-out ${
                elementIcon(style.iconName).key === option.key ?
                'border-brand-500 bg-brand-50' :
                'border-slate-200 hover:border-slate-300'}`
                }>
                
                      <ElementIcon
                  iconKey={option.key}
                  size={18}
                  color="#0f1729" />
                
                    </button>
              )}
                </div>
              </div>
          }
          </div>

          <p className="mt-4 text-sm font-semibold text-ink-500">
            Câte iconițe vrei?
          </p>
          <input
          type="number"
          min={1}
          max={20}
          step={1}
          value={style.iconCount ?? 1}
          onChange={(event) =>
          onChange({
            iconCount: Math.min(
              20,
              Math.max(1, Number(event.target.value) || 1)
            )
          })
          }
          aria-label="Câte iconițe"
          className="mt-1.5 w-full rounded-md border border-slate-200 px-3 py-2.5 text-sm font-semibold text-ink focus:border-brand-500 focus:outline-none" />
        

          <p className="mt-4 text-sm font-semibold text-ink-500">Dimensiune</p>
          <div className="mt-2 flex items-center gap-3">
            <input
            type="range"
            min={12}
            max={120}
            value={style.iconSize ?? 32}
            onChange={(event) =>
            onChange({ iconSize: Number(event.target.value) })
            }
            aria-label="Dimensiune iconiță"
            className="h-1 flex-1 accent-brand-500" />
          
            <input
            type="number"
            min={12}
            max={200}
            value={style.iconSize ?? 32}
            onChange={(event) =>
            onChange({ iconSize: Math.max(4, Number(event.target.value) || 0) })
            }
            aria-label="Dimensiune iconiță, valoare"
            className="w-16 rounded-md border border-slate-200 px-2 py-1.5 text-center text-sm font-semibold text-ink focus:border-brand-500 focus:outline-none" />
          
          </div>
        </section>
      }

      {node.kind === 'bulleted' &&
      // apare imediat sub secțiunea de conținut
      <section className="mt-6" style={{ order: -1 }}>
          <h3 className="font-display text-base font-bold text-ink">
            Puncte de listă
          </h3>

          <p className="mt-3 text-sm font-semibold text-ink-500">Alege icon</p>
          <div className="relative mt-1.5" ref={bulletMenuRef}>
            <button
            type="button"
            onClick={() => setBulletMenu((open) => !open)}
            className="flex w-full items-center justify-between rounded-md border border-slate-200 text-left transition-colors duration-150 ease-out hover:border-brand-300">
            
              <span className="px-3 py-2.5 text-sm font-semibold text-ink-500">
                {bulletIcon(style.bulletIcon ?? 'dot').label}
              </span>
              <span className="flex h-11 w-14 items-center justify-center rounded-r-md bg-slate-100">
                {bulletIcon(style.bulletIcon ?? 'dot').render(18, '#0f1729')}
              </span>
            </button>

            {bulletMenu &&
          <div className="absolute z-30 mt-1 w-full rounded-md border border-slate-200 bg-white p-3 shadow-xl">
                <p className="text-xs font-bold text-ink-500">
                  Iconițe populare
                </p>
                <div className="mt-2 grid max-h-64 grid-cols-7 gap-2 overflow-y-auto">
                  {bulletIconOptions.map((option) =>
              <button
                key={option.key}
                type="button"
                onClick={() => {
                  onChange({ bulletIcon: option.key });
                  setBulletMenu(false);
                }}
                aria-label={option.label}
                aria-pressed={(style.bulletIcon ?? 'dot') === option.key}
                className={`flex h-9 w-9 items-center justify-center rounded-md border transition-colors duration-150 ease-out ${
                (style.bulletIcon ?? 'dot') === option.key ?
                'border-brand-500 bg-brand-50' :
                'border-slate-200 hover:border-slate-300'}`
                }>
                
                      {option.render(18, '#0f1729')}
                    </button>
              )}
                </div>
              </div>
          }
          </div>
        </section>
      }

      {node.kind === 'image' &&
      <section className="mt-6">
          <p className="text-sm font-semibold text-ink-500">Fișier imagine</p>
          <div className="mt-1.5 flex">
            <input
            type="text"
            readOnly
            value={style.imageName ?? ''}
            placeholder="Nicio imagine aleasă"
            aria-label="Imaginea selectată"
            className="min-w-0 flex-1 rounded-l-md border border-r-0 border-slate-200 px-3 py-2.5 text-sm text-ink focus:outline-none" />
          
            <button
            type="button"
            onClick={() => setImagePicker(true)}
            aria-label="Alege o imagine"
            className="rounded-r-md border border-slate-200 bg-slate-50 px-3 text-ink-600 transition-colors duration-150 ease-out hover:bg-slate-100">
            
              <UploadCloudIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          <label className="mt-4 block">
            <span className="text-sm font-semibold text-ink-500">
              Acțiune la click pe imagine
            </span>
            <select
            value={style.imageAction ?? 'none'}
            onChange={(event) =>
            onChange({
              imageAction: event.target.
              value as NonNullable<ElementStyle['imageAction']>
            })
            }
            className="mt-1.5 w-full rounded-md border border-slate-200 px-3 py-2.5 text-sm font-semibold text-ink focus:border-brand-500 focus:outline-none">
            
              <option value="none">Nicio acțiune</option>
              <option value="url">Deschide un link</option>
              <option value="popup">Deschide imaginea mărită</option>
            </select>
          </label>
          {style.imageAction === 'url' &&
        <input
          type="url"
          value={style.imageActionUrl ?? ''}
          placeholder="https://..."
          aria-label="Linkul deschis la click"
          onChange={(event) =>
          onChange({ imageActionUrl: event.target.value })
          }
          className="mt-2 w-full rounded-md border border-slate-200 px-3 py-2.5 text-sm text-ink focus:border-brand-500 focus:outline-none" />

        }

          <label className="mt-4 block">
            <span className="text-sm font-semibold text-ink-500">
              Text alternativ (alt)
            </span>
            <input
            type="text"
            value={style.imageAlt ?? ''}
            onChange={(event) => onChange({ imageAlt: event.target.value })}
            className="mt-1.5 w-full rounded-md border border-slate-200 px-3 py-2.5 text-sm text-ink focus:border-brand-500 focus:outline-none" />
          
          </label>

          <label className="mt-4 flex cursor-pointer items-center gap-3 text-sm font-semibold text-ink">
            <span
            className={`flex h-5 w-5 items-center justify-center rounded transition-colors duration-150 ease-out ${
            style.imageFull ?
            'bg-brand-500 text-white' :
            'border border-slate-300 bg-white'}`
            }>
            
              {style.imageFull &&
            <CheckIcon className="h-3.5 w-3.5" aria-hidden="true" />
            }
            </span>
            <input
            type="checkbox"
            checked={Boolean(style.imageFull)}
            onChange={(event) => onChange({ imageFull: event.target.checked })}
            className="sr-only" />
          
            Ocupă 100% din lățime
          </label>

          {!style.imageFull &&
        <>
              <p className="mt-4 text-sm font-semibold text-ink-500">
                Dimensiunea imaginii
              </p>
              <div className="mt-1.5 flex items-center gap-3">
                <input
              type="range"
              min={80}
              max={1200}
              value={style.imageSize ?? 480}
              aria-label="Dimensiunea imaginii"
              onChange={(event) =>
              onChange({ imageSize: Number(event.target.value) })
              }
              className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full accent-brand-500"
              style={{
                background: `linear-gradient(to right, #2f6bff 0%, #2f6bff ${
                ((style.imageSize ?? 480) - 80) / 1120 * 100}%, #e2e8f0 ${

                ((style.imageSize ?? 480) - 80) / 1120 * 100}%, #e2e8f0 100%)`

              }} />
            
                <input
              type="number"
              min={80}
              max={1200}
              value={style.imageSize ?? 480}
              onChange={(event) =>
              onChange({ imageSize: Number(event.target.value) || 80 })
              }
              aria-label="Dimensiunea imaginii — valoare"
              className="w-[84px] rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-ink focus:border-brand-500 focus:outline-none" />
            
              </div>
            </>
        }

          <h3 className="mt-6 font-display text-base font-bold text-ink">
            Filtre
          </h3>
          <p className="mt-3 text-sm font-semibold text-ink-500">Blur</p>
          <div className="mt-1.5 flex items-center gap-3">
            <input
            type="range"
            min={0}
            max={20}
            value={style.imageBlur ?? 0}
            aria-label="Blur"
            onChange={(event) =>
            onChange({ imageBlur: Number(event.target.value) })
            }
            className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full accent-brand-500"
            style={{
              background: `linear-gradient(to right, #2f6bff 0%, #2f6bff ${
              (style.imageBlur ?? 0) / 20 * 100}%, #e2e8f0 ${

              (style.imageBlur ?? 0) / 20 * 100}%, #e2e8f0 100%)`

            }} />
          
            <input
            type="number"
            min={0}
            max={20}
            value={style.imageBlur ?? 0}
            onChange={(event) =>
            onChange({ imageBlur: Number(event.target.value) || 0 })
            }
            aria-label="Blur — valoare"
            className="w-[84px] rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-ink focus:border-brand-500 focus:outline-none" />
          
          </div>

          {imagePicker &&
        <ImagePickerDialog
          onClose={() => setImagePicker(false)}
          onInsert={(image) => {
            onChange({ imageSrc: image.src, imageName: image.name });
            setImagePicker(false);
          }} />

        }
        </section>
      }

      {node.kind === 'video' &&
      <section className="mt-6">
          <label className="block">
            <span className="text-sm font-semibold text-ink-500">
              Tipul videoclipului
            </span>
            <select
            value={style.videoType ?? 'link'}
            onChange={(event) =>
            onChange({
              videoType: event.target.
              value as NonNullable<ElementStyle['videoType']>
            })
            }
            className="mt-1.5 w-full rounded-md border border-slate-200 px-3 py-2.5 text-sm font-semibold text-ink focus:border-brand-500 focus:outline-none">
            
              <option value="link">Link direct</option>
              <option value="embed">Cod embed</option>
              <option value="upload">Încarcă fișier</option>
            </select>
          </label>

          {(style.videoType ?? 'link') === 'link' &&
        <label className="mt-4 block">
              <span className="text-sm font-semibold text-ink-500">URL</span>
              <input
            type="url"
            value={style.videoUrl ?? ''}
            placeholder="https://youtu.be/..."
            onChange={(event) => onChange({ videoUrl: event.target.value })}
            className="mt-1.5 w-full rounded-md border border-slate-200 px-3 py-2.5 text-sm text-ink focus:border-brand-500 focus:outline-none" />
          
            </label>
        }

          {style.videoType === 'embed' &&
        <label className="mt-4 block">
              <span className="text-sm font-semibold text-ink-500">
                Cod embed
              </span>
              <textarea
            rows={4}
            value={style.videoEmbed ?? ''}
            placeholder="<iframe ...></iframe>"
            onChange={(event) =>
            onChange({ videoEmbed: event.target.value })
            }
            className="mt-1.5 w-full resize-y rounded-md border border-slate-200 px-3 py-2 text-sm text-ink focus:border-brand-500 focus:outline-none" />
          
            </label>
        }

          {style.videoType === 'upload' &&
        <div className="mt-4">
              <span className="text-sm font-semibold text-ink-500">Fișier</span>
              <label className="mt-1.5 flex cursor-pointer items-center justify-center rounded-md border border-dashed border-slate-300 px-3 py-4 text-sm font-semibold text-ink-500 transition-colors duration-150 ease-out hover:border-brand-400 hover:text-brand-600">
                {style.videoFileName || 'Alege un fișier video'}
                <input
              type="file"
              accept="video/*"
              className="sr-only"
              onChange={(event) =>
              onChange({
                videoFileName: event.target.files?.[0]?.name ?? ''
              })
              } />
            
              </label>
            </div>
        }

          <label className="mt-4 block">
            <span className="text-sm font-semibold text-ink-500">
              Redare automată
            </span>
            <select
            value={style.videoAutoplay ? 'on' : 'off'}
            onChange={(event) =>
            onChange({ videoAutoplay: event.target.value === 'on' })
            }
            className="mt-1.5 w-full rounded-md border border-slate-200 px-3 py-2.5 text-sm font-semibold text-ink focus:border-brand-500 focus:outline-none">
            
              <option value="off">Off</option>
              <option value="on">On</option>
            </select>
          </label>

          <label className="mt-4 block">
            <span className="text-sm font-semibold text-ink-500">
              Butoane de control
            </span>
            <select
            value={style.videoControls === false ? 'off' : 'on'}
            onChange={(event) =>
            onChange({ videoControls: event.target.value === 'on' })
            }
            className="mt-1.5 w-full rounded-md border border-slate-200 px-3 py-2.5 text-sm font-semibold text-ink focus:border-brand-500 focus:outline-none">
            
              <option value="on">On</option>
              <option value="off">Off</option>
            </select>
          </label>

          <label className="mt-4 block">
            <span className="text-sm font-semibold text-ink-500">
              Proporție (aspect ratio)
            </span>
            <select
            value={style.videoRatio ?? '16:9'}
            onChange={(event) =>
            onChange({
              videoRatio: event.target.
              value as NonNullable<ElementStyle['videoRatio']>
            })
            }
            className="mt-1.5 w-full rounded-md border border-slate-200 px-3 py-2.5 text-sm font-semibold text-ink focus:border-brand-500 focus:outline-none">
            
              <option value="16:9">16:9</option>
              <option value="4:3">4:3</option>
              <option value="1:1">1:1</option>
              <option value="9:16">9:16</option>
            </select>
          </label>

          <div className="mt-8 border-t border-slate-200 pt-6">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-base font-bold text-ink">
                Border
              </h3>
              <button
              type="button"
              onClick={() =>
              onChange({
                videoBorderMode: 'none',
                videoBorderStyle: 'solid',
                videoBorderWidth: 1,
                videoRadius: 8
              })
              }
              aria-label="Resetează rama"
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
              value={style.videoRadius ?? 8}
              onChange={(event) =>
              onChange({ videoRadius: Number(event.target.value) || 0 })
              }
              className="mt-1.5 w-full rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-ink focus:border-brand-500 focus:outline-none" />
            
            </label>

            <p className="mt-4 text-sm font-semibold text-ink-500">
              Stilul ramei
            </p>
            <div className="mt-1.5 grid grid-cols-3 rounded-md border border-slate-200 p-1">
              {(['solid', 'dotted', 'dashed'] as const).map((option) =>
            <button
              key={option}
              type="button"
              onClick={() => onChange({ videoBorderStyle: option })}
              aria-pressed={(style.videoBorderStyle ?? 'solid') === option}
              className={`rounded py-1.5 text-sm font-semibold capitalize transition-colors duration-150 ease-out ${
              (style.videoBorderStyle ?? 'solid') === option ?
              'bg-slate-100 text-ink' :
              'text-ink-500 hover:text-ink'}`
              }>
              
                  {option}
                </button>
            )}
            </div>

            <p className="mt-4 text-sm font-semibold text-ink-500">
              Grosimea ramei
            </p>
            <div className="mt-1.5 flex items-center gap-3">
              <input
              type="range"
              min={1}
              max={20}
              value={style.videoBorderWidth ?? 1}
              aria-label="Grosimea ramei"
              onChange={(event) =>
              onChange({ videoBorderWidth: Number(event.target.value) })
              }
              className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full accent-brand-500"
              style={{
                background: `linear-gradient(to right, #2f6bff 0%, #2f6bff ${
                ((style.videoBorderWidth ?? 1) - 1) / 19 * 100}%, #e2e8f0 ${

                ((style.videoBorderWidth ?? 1) - 1) / 19 * 100}%, #e2e8f0 100%)`

              }} />
            
              <input
              type="number"
              min={1}
              max={20}
              value={style.videoBorderWidth ?? 1}
              onChange={(event) =>
              onChange({ videoBorderWidth: Number(event.target.value) || 1 })
              }
              aria-label="Grosimea ramei — valoare"
              className="w-[84px] rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-ink focus:border-brand-500 focus:outline-none" />
            
            </div>

            <label className="mt-4 block">
              <span className="text-sm font-semibold text-ink-500">
                Tipul ramei
              </span>
              <select
              value={style.videoBorderMode ?? 'none'}
              onChange={(event) =>
              onChange({
                videoBorderMode: event.target.
                value as NonNullable<ElementStyle['videoBorderMode']>
              })
              }
              className="mt-1.5 w-full rounded-md border border-slate-200 px-3 py-2.5 text-sm font-semibold text-ink focus:border-brand-500 focus:outline-none">
              
                <option value="none">Fără ramă</option>
                <option value="full">Ramă completă</option>
                <option value="bottom">Doar linia de jos</option>
                <option value="top">Doar linia de sus</option>
                <option value="topBottom">Sus și jos</option>
              </select>
            </label>
          </div>
        </section>
      }

      {node.kind === 'form' &&
      <>
          <FormFieldsPanel
          fields={style.formFields ?? []}
          onChange={(fields) => onChange({ formFields: fields })}
          button={{
            text: style.formButtonText ?? 'Trimite',
            subtext: style.formButtonSubtext ?? '',
            icon: style.formButtonIcon ?? ''
          }}
          onButtonChange={(patch) => onChange(patch)} />
        

          <section className="mt-8 border-t border-slate-200 pt-6">
            <h3 className="font-display text-base font-bold text-ink">
              Contur
            </h3>
            <select
            value={style.formBorderMode ?? 'full'}
            onChange={(event) =>
            onChange({
              formBorderMode: event.target.
              value as NonNullable<ElementStyle['formBorderMode']>
            })
            }
            aria-label="Tipul conturului"
            className="mt-2 w-full rounded-md border border-slate-200 px-3 py-2.5 text-sm font-semibold text-ink focus:border-brand-500 focus:outline-none">
            
              <option value="none">Fără contur</option>
              <option value="full">Contur complet</option>
              <option value="bottom">Doar linia de jos</option>
            </select>

            <p className="mt-4 text-sm font-semibold text-ink-500">
              Stil contur
            </p>
            <div className="mt-1.5 grid grid-cols-3 gap-1 rounded-lg border border-slate-200 bg-slate-50 p-1">
              {(['solid', 'dotted', 'dashed'] as const).map((option) =>
            <button
              key={option}
              type="button"
              onClick={() => onChange({ formBorderStyle: option })}
              aria-pressed={(style.formBorderStyle ?? 'solid') === option}
              className={`rounded-md py-2 text-xs font-bold capitalize transition-colors duration-150 ease-out ${
              (style.formBorderStyle ?? 'solid') === option ?
              'bg-white text-ink shadow-sm' :
              'text-ink-500 hover:text-ink-700'}`
              }>
              
                  {option}
                </button>
            )}
            </div>

            <p className="mt-4 text-sm font-semibold text-ink-500">
              Grosime contur
            </p>
            <div className="mt-1.5 flex items-center gap-3">
              <input
              type="range"
              min={0}
              max={10}
              value={style.formBorderWidth ?? 1}
              aria-label="Grosime contur"
              onChange={(event) =>
              onChange({ formBorderWidth: Number(event.target.value) })
              }
              className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full accent-brand-500"
              style={{
                background: `linear-gradient(to right, #2f6bff 0%, #2f6bff ${
                (style.formBorderWidth ?? 1) / 10 * 100}%, #e2e8f0 ${

                (style.formBorderWidth ?? 1) / 10 * 100}%, #e2e8f0 100%)`

              }} />
            
              <input
              type="number"
              min={0}
              max={10}
              value={style.formBorderWidth ?? 1}
              onChange={(event) =>
              onChange({
                formBorderWidth: Number(event.target.value) || 0
              })
              }
              aria-label="Grosime contur — valoare"
              className="w-[76px] rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-ink focus:border-brand-500 focus:outline-none" />
            
            </div>

            <label className="mt-4 block">
              <span className="text-sm font-semibold text-ink-500">
                Rotunjire colțuri
              </span>
              <input
              type="number"
              min={0}
              max={40}
              value={style.formRadius ?? 12}
              onChange={(event) =>
              onChange({ formRadius: Number(event.target.value) || 0 })
              }
              className="mt-1.5 w-full rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-ink focus:border-brand-500 focus:outline-none" />
            
            </label>
          </section>

          <section className="mt-8 border-t border-slate-200 pt-6">
            <h3 className="font-display text-base font-bold text-ink">Buton</h3>
            <label className="mt-3 block">
              <span className="text-sm font-semibold text-ink-500">
                Text pe buton
              </span>
              <input
              type="text"
              value={style.formButtonText ?? 'Trimite'}
              onChange={(event) =>
              onChange({ formButtonText: event.target.value })
              }
              className="mt-1.5 w-full rounded-md border border-slate-200 px-3 py-2.5 text-sm text-ink focus:border-brand-500 focus:outline-none" />
            
            </label>
            <label className="mt-4 block">
              <span className="text-sm font-semibold text-ink-500">
                Poziția butonului
              </span>
              <select
              value={style.formButtonPosition ?? 'full'}
              onChange={(event) =>
              onChange({
                formButtonPosition: event.target.
                value as NonNullable<ElementStyle['formButtonPosition']>
              })
              }
              className="mt-1.5 w-full rounded-md border border-slate-200 px-3 py-2.5 text-sm font-semibold text-ink focus:border-brand-500 focus:outline-none">
              
                <option value="left">Stânga</option>
                <option value="center">Centru</option>
                <option value="right">Dreapta</option>
                <option value="full">Toată lățimea</option>
              </select>
            </label>
          </section>
        </>
      }

      {textField &&
      <section
        className="mt-6"
        // la listă, conținutul rămâne primul, urmat de punctele de listă
        style={node.kind === 'bulleted' ? { order: -2 } : undefined}>
        
          <h3 className="font-display text-base font-bold text-ink">
            Conținut
          </h3>
          <label className="mt-2 block">
            <span className="text-sm font-semibold text-ink-500">
              {textField.label}
            </span>
            {textField.multiline ?
          <textarea
            rows={4}
            value={style.text}
            onChange={(event) => onChange({ text: event.target.value })}
            className="mt-1.5 w-full resize-y rounded-md border border-slate-200 px-3 py-2 text-sm text-ink focus:border-brand-500 focus:outline-none" /> :


          <input
            type="text"
            value={style.text}
            onChange={(event) => onChange({ text: event.target.value })}
            className="mt-1.5 w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-ink focus:border-brand-500 focus:outline-none" />

          }
          </label>

          {node.kind === 'checkbox' &&
        <>
              <label className="mt-4 block">
                <span className="text-sm font-semibold text-ink-500">
                  Mesaj dacă rămâne nebifată
                </span>
                <input
              type="text"
              value={style.checkboxMessage ?? ''}
              disabled={Boolean(style.checkboxOptional)}
              placeholder="Mesaj dacă rămâne nebifată"
              onChange={(event) =>
              onChange({ checkboxMessage: event.target.value })
              }
              className="mt-1.5 w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-ink focus:border-brand-500 focus:outline-none disabled:bg-slate-50 disabled:text-ink-400" />
            
              </label>

              <label className="mt-3 flex cursor-pointer items-center gap-3 text-sm font-semibold text-ink">
                <span
              className={`flex h-5 w-5 items-center justify-center rounded transition-colors duration-150 ease-out ${
              style.checkboxOptional ?
              'bg-brand-500 text-white' :
              'border border-slate-300 bg-white'}`
              }>
              
                  {style.checkboxOptional &&
              <CheckIcon className="h-3.5 w-3.5" aria-hidden="true" />
              }
                </span>
                <input
              type="checkbox"
              checked={Boolean(style.checkboxOptional)}
              onChange={(event) =>
              onChange({ checkboxOptional: event.target.checked })
              }
              className="sr-only" />
            
                Opțional
                <span>
                  <button
                type="button"
                aria-label="Ce înseamnă opțional?"
                data-optional-hint
                onClick={(event) => {
                  event.preventDefault();
                  const rect = event.currentTarget.getBoundingClientRect();
                  setHintAnchor({
                    top: rect.top + rect.height / 2,
                    left: rect.right + 10
                  });
                  setOptionalHint((open) => !open);
                }}
                className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-200 text-[11px] font-bold text-ink-500 transition-colors duration-150 ease-out hover:bg-slate-300">
                
                    ?
                  </button>
                  {optionalHint &&
              createPortal(
                <span
                  data-optional-hint
                  className="fixed z-[80] w-60 -translate-y-1/2 rounded-md border border-slate-200 bg-white p-3 text-xs font-semibold leading-relaxed text-ink-600 shadow-xl"
                  style={{ top: hintAnchor.top, left: hintAnchor.left }}>
                  
                        Dacă vrei ca această căsuță să fie opțională, bifează
                        funcția de „Opțional”.
                      </span>,
                document.body
              )}
                </span>
              </label>
            </>
        }
        </section>
      }

      {(hasTypography(node.kind) || node.kind === 'timer') &&
      <section
        className="mt-8 border-t border-slate-200 pt-6"
        // la timer, tipografia vine după secțiunea de numărătoare inversă
        style={node.kind === 'timer' ? { order: -1 } : undefined}>
        
          <div className="flex items-center justify-between">
            <h3 className="font-display text-base font-bold text-ink">
              Tipografie
            </h3>
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-ink-500">
              {device === 'mobile' ? 'Mobil' : 'Desktop'}
            </span>
          </div>
          {device === 'mobile' &&
        <p className="mt-2 text-xs font-semibold text-ink-500">
              Modificările se aplică doar pe mobil. Desktopul rămâne neatins.
            </p>
        }
          <div className="mt-3" ref={fontRef}>
            <p className="text-sm font-semibold text-ink-500">Font type</p>
            <div className="relative mt-1.5">
              <button
              type="button"
              onClick={() => setFontOpen((open) => !open)}
              className="flex w-full items-center justify-between rounded-md border border-slate-200 px-3 py-2.5 text-left text-sm font-semibold text-ink transition-colors duration-150 ease-out hover:border-brand-300"
              style={
              typo.fontFamily ?
              { fontFamily: `'${typo.fontFamily}', sans-serif` } :
              undefined
              }>
              
                {typo.fontFamily || 'Google Fonts'}
                <ChevronDownIcon
                className="h-4 w-4 text-ink-400"
                aria-hidden="true" />
              
              </button>
              {fontOpen &&
            <div className="absolute z-30 mt-1 max-h-72 w-full overflow-hidden rounded-md border border-slate-200 bg-white shadow-xl">
                  <div className="border-b border-slate-100 p-2">
                    <input
                  type="text"
                  value={fontQuery}
                  autoFocus
                  onChange={(event) => setFontQuery(event.target.value)}
                  placeholder="Caută un font Google"
                  className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-ink focus:border-brand-500 focus:outline-none" />
                
                  </div>
                  <div className="max-h-56 overflow-y-auto py-1">
                    <button
                  type="button"
                  onClick={() => {
                    setTypoFont('');
                    setFontOpen(false);
                  }}
                  className="flex w-full items-center px-3 py-2 text-left text-sm font-semibold text-ink-500 transition-colors duration-150 ease-out hover:bg-slate-50">
                  
                      Același font ca al paginii
                    </button>
                    {googleFonts.
                filter((family) =>
                family.toLowerCase().includes(fontQuery.toLowerCase())
                ).
                map((family) =>
                <button
                  key={family}
                  type="button"
                  onMouseEnter={() => loadGoogleFont(family)}
                  onClick={() => {
                    loadGoogleFont(family);
                    setTypoFont(family);
                    setFontOpen(false);
                  }}
                  style={{ fontFamily: `'${family}', sans-serif` }}
                  className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm transition-colors duration-150 ease-out hover:bg-slate-50 ${
                  typo.fontFamily === family ?
                  'bg-brand-50 text-brand-700' :
                  'text-ink'}`
                  }>
                  
                          {family}
                          {typo.fontFamily === family &&
                  <CheckIcon
                    className="h-4 w-4 shrink-0"
                    aria-hidden="true" />

                  }
                        </button>
                )}
                  </div>
                </div>
            }
            </div>
          </div>

          <div className="mt-4" ref={fontStyleRef}>
            <p className="text-sm font-semibold text-ink-500">Font style</p>
            <div className="relative mt-1.5">
              <button
              type="button"
              onClick={() => setFontStyleOpen((open) => !open)}
              className="flex w-full items-center justify-between rounded-md border border-slate-200 px-3 py-2.5 text-left text-sm font-semibold text-ink transition-colors duration-150 ease-out hover:border-brand-300">
              
                {fontStyleOptions.find(
                (option) => option.key === (typo.fontStyle ?? '400')
              )?.label ?? 'Regular'}
                <ChevronDownIcon
                className="h-4 w-4 text-ink-400"
                aria-hidden="true" />
              
              </button>
              {fontStyleOpen &&
            <div className="absolute z-30 mt-1 max-h-72 w-full overflow-y-auto rounded-md border border-slate-200 bg-white py-1 shadow-xl">
                  {fontStyleOptions.map((option) =>
              <button
                key={option.key}
                type="button"
                onClick={() => {
                  setTypoStyle(option.key);
                  setFontStyleOpen(false);
                }}
                style={{
                  fontWeight: Number(option.key.replace('i', '')),
                  fontStyle: option.key.endsWith('i') ?
                  'italic' :
                  'normal'
                }}
                className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm transition-colors duration-150 ease-out hover:bg-slate-50 ${
                (typo.fontStyle ?? '400') === option.key ?
                'bg-brand-50 text-brand-700' :
                'text-ink'}`
                }>
                
                      {option.label}
                      {(typo.fontStyle ?? '400') === option.key &&
                <CheckIcon
                  className="h-4 w-4 shrink-0"
                  aria-hidden="true" />

                }
                    </button>
              )}
                </div>
            }
            </div>
          </div>

          <div className="mt-4 space-y-4">
            {typoFields.map((field) =>
          <div key={field.key}>
                <p className="text-sm font-semibold text-ink-500">
                  {field.label}
                </p>
                <div className="mt-1.5 flex items-center gap-3">
                  <input
                type="range"
                min={field.min}
                max={field.max}
                value={typo[field.key]}
                aria-label={field.label}
                onChange={(event) =>
                setTypo(field.key, Number(event.target.value))
                }
                className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full accent-brand-500"
                style={{
                  background: `linear-gradient(to right, #2f6bff 0%, #2f6bff ${
                  (Number(typo[field.key]) - field.min) / (
                  field.max - field.min) *
                  100}%, #e2e8f0 ${

                  (Number(typo[field.key]) - field.min) / (
                  field.max - field.min) *
                  100}%, #e2e8f0 100%)`

                }} />
              
                  <input
                type="number"
                min={field.min}
                max={field.max}
                value={typo[field.key]}
                onChange={(event) =>
                setTypo(field.key, Number(event.target.value) || 0)
                }
                aria-label={`${field.label} — valoare`}
                className="w-[76px] rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-ink focus:border-brand-500 focus:outline-none" />
              
                </div>
              </div>
          )}

            {node.kind === 'bulleted' &&
          <div>
                <p className="text-sm font-semibold text-ink-500">
                  Mărime iconiță
                </p>
                <div className="mt-1.5 flex items-center gap-3">
                  <input
                type="range"
                min={8}
                max={48}
                value={style.bulletSize ?? 16}
                aria-label="Mărime iconiță"
                onChange={(event) =>
                onChange({ bulletSize: Number(event.target.value) })
                }
                className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full accent-brand-500"
                style={{
                  background: `linear-gradient(to right, #2f6bff 0%, #2f6bff ${
                  ((style.bulletSize ?? 16) - 8) / 40 * 100}%, #e2e8f0 ${

                  ((style.bulletSize ?? 16) - 8) / 40 * 100}%, #e2e8f0 100%)`

                }} />
              
                  <input
                type="number"
                min={8}
                max={48}
                value={style.bulletSize ?? 16}
                onChange={(event) =>
                onChange({ bulletSize: Number(event.target.value) || 8 })
                }
                aria-label="Mărime iconiță — valoare"
                className="w-[76px] rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-ink focus:border-brand-500 focus:outline-none" />
              
                </div>
              </div>
          }
          </div>
        </section>
      }

      {node.kind === 'button' &&
      <>
          <section className="mt-8 border-t border-slate-200 pt-6">
            <h3 className="font-display text-base font-bold text-ink">
              Subtext
            </h3>
            <label className="mt-3 block">
              <span className="text-sm font-semibold text-ink-500">
                Text sub butonul principal
              </span>
              <input
              type="text"
              value={style.btnSubtext ?? ''}
              placeholder="Ex. Fără card bancar"
              onChange={(event) =>
              onChange({ btnSubtext: event.target.value })
              }
              className="mt-1.5 w-full rounded-md border border-slate-200 px-3 py-2.5 text-sm text-ink focus:border-brand-500 focus:outline-none" />
            
            </label>

            <div className="mt-4" ref={subFontRef}>
              <p className="text-sm font-semibold text-ink-500">Font subtext</p>
              <div className="relative mt-1.5">
                <button
                type="button"
                onClick={() => setSubFontOpen((open) => !open)}
                style={{
                  fontFamily: subTypo.fontFamily ?
                  `'${subTypo.fontFamily}', sans-serif` :
                  undefined
                }}
                className="flex w-full items-center justify-between rounded-md border border-slate-200 px-3 py-2.5 text-left text-sm font-semibold text-ink transition-colors duration-150 ease-out hover:border-brand-300">
                
                  {subTypo.fontFamily || 'Același font ca al paginii'}
                  <ChevronDownIcon
                  className="h-4 w-4 text-ink-400"
                  aria-hidden="true" />
                
                </button>
                {subFontOpen &&
              <div className="absolute z-30 mt-1 max-h-72 w-full overflow-hidden rounded-md border border-slate-200 bg-white shadow-xl">
                    <div className="border-b border-slate-100 p-2">
                      <input
                    type="text"
                    value={subFontQuery}
                    autoFocus
                    onChange={(event) => setSubFontQuery(event.target.value)}
                    placeholder="Caută un font Google"
                    className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-ink focus:border-brand-500 focus:outline-none" />
                  
                    </div>
                    <div className="max-h-56 overflow-y-auto py-1">
                      <button
                    type="button"
                    onClick={() => {
                      setSubTypo({ fontFamily: '' });
                      setSubFontOpen(false);
                    }}
                    className="flex w-full items-center px-3 py-2 text-left text-sm font-semibold text-ink-500 transition-colors duration-150 ease-out hover:bg-slate-50">
                    
                        Același font ca al paginii
                      </button>
                      {googleFonts.
                  filter((family) =>
                  family.
                  toLowerCase().
                  includes(subFontQuery.toLowerCase())
                  ).
                  map((family) =>
                  <button
                    key={family}
                    type="button"
                    onMouseEnter={() => loadGoogleFont(family)}
                    onClick={() => {
                      loadGoogleFont(family);
                      setSubTypo({ fontFamily: family });
                      setSubFontOpen(false);
                    }}
                    style={{ fontFamily: `'${family}', sans-serif` }}
                    className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm transition-colors duration-150 ease-out hover:bg-slate-50 ${
                    subTypo.fontFamily === family ?
                    'bg-brand-50 text-brand-700' :
                    'text-ink'}`
                    }>
                    
                            {family}
                            {subTypo.fontFamily === family &&
                    <CheckIcon
                      className="h-4 w-4 shrink-0"
                      aria-hidden="true" />

                    }
                          </button>
                  )}
                    </div>
                  </div>
              }
              </div>
            </div>

            <label className="mt-4 block">
              <span className="text-sm font-semibold text-ink-500">
                Stil subtext
              </span>
              <select
              value={subTypo.fontStyle}
              onChange={(event) => setSubTypo({ fontStyle: event.target.value })}
              className="mt-1.5 w-full rounded-md border border-slate-200 px-3 py-2.5 text-sm font-semibold text-ink focus:border-brand-500 focus:outline-none">
              
                {fontStyleOptions.map((option) =>
              <option key={option.key} value={option.key}>
                    {option.label}
                  </option>
              )}
              </select>
            </label>

            <div className="mt-4 space-y-4">
              {(
            [
            {
              key: 'fontSize' as const,
              label: 'Mărime subtext',
              min: 8,
              max: 40
            },
            {
              key: 'lineHeight' as const,
              label: 'Înălțime rând',
              min: 10,
              max: 60
            },
            {
              key: 'letterSpacing' as const,
              label: 'Spațiere litere',
              min: -2,
              max: 12
            }] as
            const).
            map((field) =>
            <div key={field.key}>
                  <p className="text-sm font-semibold text-ink-500">
                    {field.label}
                  </p>
                  <div className="mt-1.5 flex items-center gap-3">
                    <input
                  type="range"
                  min={field.min}
                  max={field.max}
                  value={subTypo[field.key]}
                  aria-label={field.label}
                  onChange={(event) =>
                  setSubTypo({ [field.key]: Number(event.target.value) })
                  }
                  className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full accent-brand-500"
                  style={{
                    background: `linear-gradient(to right, #2f6bff 0%, #2f6bff ${
                    (subTypo[field.key] - field.min) / (
                    field.max - field.min) *
                    100}%, #e2e8f0 ${

                    (subTypo[field.key] - field.min) / (
                    field.max - field.min) *
                    100}%, #e2e8f0 100%)`

                  }} />
                
                    <input
                  type="number"
                  min={field.min}
                  max={field.max}
                  value={subTypo[field.key]}
                  onChange={(event) =>
                  setSubTypo({
                    [field.key]: Number(event.target.value) || 0
                  })
                  }
                  aria-label={`${field.label} — valoare`}
                  className="w-[76px] rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-ink focus:border-brand-500 focus:outline-none" />
                
                  </div>
                </div>
            )}
            </div>
          </section>

          <section className="mt-8 border-t border-slate-200 pt-6">
            <h3 className="font-display text-base font-bold text-ink">Umbră</h3>
            <select
            value={style.btnShadow ?? 'none'}
            onChange={(event) => onChange({ btnShadow: event.target.value })}
            aria-label="Umbra butonului"
            className="mt-3 w-full rounded-md border border-slate-200 px-3 py-2.5 text-sm font-semibold text-ink focus:border-brand-500 focus:outline-none">
            
              {shadowOptions.map((option) =>
            <option key={option.key} value={option.key}>
                  {option.label}
                </option>
            )}
            </select>
          </section>

          <section className="mt-8 border-t border-slate-200 pt-6">
            <h3 className="font-display text-base font-bold text-ink">Hover</h3>
            <label className="mt-3 flex items-center justify-between gap-3">
              <span className="text-sm font-semibold text-ink-500">
                Efect la trecerea cursorului
              </span>
              <input
              type="checkbox"
              checked={Boolean(style.btnHoverEnabled)}
              onChange={(event) =>
              onChange({ btnHoverEnabled: event.target.checked })
              }
              className="h-4 w-4 accent-brand-500" />
            
            </label>

            {style.btnHoverEnabled &&
          <>
                <p className="mt-4 text-sm font-semibold text-ink-500">
                  Cât de mult creste (1 = subtil, 10 = maxim)
                </p>
                <input
              type="number"
              min={1}
              max={10}
              step={1}
              value={style.btnHoverScale ?? 3}
              onChange={(event) =>
              onChange({
                btnHoverScale: Math.min(
                  10,
                  Math.max(1, Number(event.target.value) || 1)
                )
              })
              }
              aria-label="Intensitatea efectului de hover"
              className="mt-2 w-[92px] rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-ink focus:border-brand-500 focus:outline-none" />
            

                {(
            [
            {
              key: 'hoverBg',
              label: 'Culoare fundal la hover',
              value: style.btnHoverBg ?? style.colors.bg,
              apply: (hex: string) => onChange({ btnHoverBg: hex })
            },
            {
              key: 'hoverText',
              label: 'Culoare text la hover',
              value: style.btnHoverText ?? style.colors.text,
              apply: (hex: string) => onChange({ btnHoverText: hex })
            }] as
            const).
            map((field) =>
            <div
              key={field.key}
              className="mt-4 flex items-center justify-between gap-3">
              
                    <span className="text-sm font-semibold text-ink-500">
                      {field.label}
                    </span>
                    <button
                type="button"
                onClick={(event) => {
                  if (openColor === field.key) {
                    setOpenColor(null);
                    return;
                  }
                  const rect =
                  event.currentTarget.getBoundingClientRect();
                  setAnchor({
                    top: rect.top + rect.height / 2,
                    left: rect.right + 16
                  });
                  setOpenColor(field.key);
                }}
                data-color-trigger
                aria-label={`${field.label} — alege culoarea`}
                className="h-7 w-7 shrink-0 rounded-full border border-slate-200 shadow-sm transition-transform duration-150 ease-out hover:scale-110"
                style={{ backgroundColor: field.value }} />
              
                    {openColor === field.key &&
              createPortal(
                <div
                  className="fixed z-[70] -translate-y-1/2"
                  style={{ top: anchor.top, left: anchor.left }}>
                  
                          <ColorPickerPopover
                    value={field.value}
                    onChange={field.apply}
                    onClose={() => setOpenColor(null)} />
                  
                        </div>,
                document.body
              )}
                  </div>
            )}
              </>
          }
          </section>
        </>
      }

      {node.kind === 'timer' &&
      <section
        className="mt-6 border-t border-slate-200 pt-6"
        style={{ order: -2 }}>
        
          <h3 className="font-display text-base font-bold text-ink">
            Numărătoare inversă
          </h3>

          <p className="mt-4 text-sm font-semibold text-ink-500">
            Tip numărătoare
          </p>
          <select
          value={style.timerType ?? 'fixed'}
          onChange={(event) =>
          onChange({
            timerType: event.target.
            value as NonNullable<ElementStyle['timerType']>
          })
          }
          className="mt-1.5 w-full rounded-md border border-slate-200 px-3 py-2.5 text-sm font-semibold text-ink focus:border-brand-500 focus:outline-none">
          
            <option value="fixed">Dată și oră fixă</option>
            <option value="delay">Delay</option>
            <option value="daily">Daily</option>
          </select>

          {(style.timerType ?? 'fixed') === 'fixed' &&
        <div className="mt-3 grid grid-cols-2 gap-3">
              <input
            type="date"
            value={style.timerDate ?? ''}
            onChange={(event) => onChange({ timerDate: event.target.value })}
            aria-label="Data expirării"
            className="rounded-md border border-slate-200 px-3 py-2.5 text-sm font-semibold text-ink focus:border-brand-500 focus:outline-none" />
          
              <input
            type="time"
            value={style.timerTime ?? ''}
            onChange={(event) => onChange({ timerTime: event.target.value })}
            aria-label="Ora expirării"
            className="rounded-md border border-slate-200 px-3 py-2.5 text-sm font-semibold text-ink focus:border-brand-500 focus:outline-none" />
          
            </div>
        }

          {style.timerType === 'delay' &&
        <div className="mt-3 space-y-4">
              {(
          [
          { key: 'days' as const, label: 'Zile', max: 30 },
          { key: 'hours' as const, label: 'Ore', max: 23 },
          { key: 'minutes' as const, label: 'Minute', max: 59 },
          { key: 'seconds' as const, label: 'Secunde', max: 59 }] as
          const).
          map((unit) => {
            const delay = style.timerDelay ?? {
              days: 0,
              hours: 1,
              minutes: 0,
              seconds: 0
            };
            const value = delay[unit.key];
            const percent = value / unit.max * 100;
            return (
              <div key={unit.key}>
                    <p className="text-sm font-semibold text-ink-500">
                      {unit.label}
                    </p>
                    <div className="mt-1.5 flex items-center gap-3">
                      <input
                    type="range"
                    min={0}
                    max={unit.max}
                    value={value}
                    aria-label={unit.label}
                    onChange={(event) =>
                    onChange({
                      timerDelay: {
                        ...delay,
                        [unit.key]: Number(event.target.value)
                      }
                    })
                    }
                    className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full accent-brand-500"
                    style={{
                      background: `linear-gradient(to right, #2f6bff 0%, #2f6bff ${percent}%, #e2e8f0 ${percent}%, #e2e8f0 100%)`
                    }} />
                  
                      <input
                    type="number"
                    min={0}
                    max={unit.max}
                    value={value}
                    onChange={(event) =>
                    onChange({
                      timerDelay: {
                        ...delay,
                        [unit.key]: Number(event.target.value) || 0
                      }
                    })
                    }
                    aria-label={`${unit.label} — valoare`}
                    className="w-[76px] rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-ink focus:border-brand-500 focus:outline-none" />
                  
                    </div>
                  </div>);

          })}
            </div>
        }

          {style.timerType === 'daily' &&
        <select
          value={style.timerTime ?? '00:00'}
          onChange={(event) => onChange({ timerTime: event.target.value })}
          aria-label="Ora zilnică"
          size={8}
          className="mt-3 w-full rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-ink focus:border-brand-500 focus:outline-none">
          
              {Array.from({ length: 144 }, (_, index) => {
            const minutes = index * 10;
            const hour = Math.floor(minutes / 60);
            const minute = minutes % 60;
            const value = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
            const suffix = hour < 12 ? 'AM' : 'PM';
            const display = `${hour % 12 === 0 ? 12 : hour % 12}:${String(minute).padStart(2, '0')} ${suffix}`;
            return (
              <option key={value} value={value}>
                    {display}
                  </option>);

          })}
            </select>
        }

          <p className="mt-4 text-sm font-semibold text-ink-500">
            Acțiune la expirarea numărătorii
          </p>
          <select
          value={style.timerAction ?? 'nothing'}
          onChange={(event) =>
          onChange({
            timerAction: event.target.
            value as NonNullable<ElementStyle['timerAction']>
          })
          }
          className="mt-1.5 w-full rounded-md border border-slate-200 px-3 py-2.5 text-sm font-semibold text-ink focus:border-brand-500 focus:outline-none">
          
            <option value="nothing">Nu face nimic</option>
            <option value="redirect">Redirecționează către URL</option>
            <option value="reset">Resetare automată</option>
          </select>
          {style.timerAction === 'redirect' &&
        <input
          type="url"
          value={style.timerRedirectUrl ?? ''}
          onChange={(event) =>
          onChange({ timerRedirectUrl: event.target.value })
          }
          placeholder="https://..."
          aria-label="Adresa de redirecționare"
          className="mt-2 w-full rounded-md border border-slate-200 px-3 py-2.5 text-sm text-ink focus:border-brand-500 focus:outline-none" />

        }

          <label className="mt-4 flex cursor-pointer items-center gap-3 text-sm font-semibold text-ink">
            <span
            className={`flex h-5 w-5 items-center justify-center rounded transition-colors duration-150 ease-out ${
            style.timerLabels !== false ?
            'bg-brand-500 text-white' :
            'border border-slate-300 bg-white'}`
            }>
            
              {style.timerLabels !== false &&
            <CheckIcon className="h-3.5 w-3.5" aria-hidden="true" />
            }
            </span>
            <input
            type="checkbox"
            checked={style.timerLabels !== false}
            onChange={(event) =>
            onChange({ timerLabels: event.target.checked })
            }
            className="sr-only" />
          
            Afișează zile / ore / minute sub cifre
          </label>
        </section>
      }

      {node.kind === 'progress' &&
      <section className="mt-6 border-t border-slate-200 pt-6">
          <h3 className="font-display text-base font-bold text-ink">
            Progress bar
          </h3>

          <p className="mt-4 text-sm font-semibold text-ink-500">
            Progres completat
          </p>
          <div className="mt-2 flex items-center gap-3">
            <input
            type="range"
            min={0}
            max={100}
            value={style.progressValue ?? 66}
            onChange={(event) =>
            onChange({ progressValue: Number(event.target.value) })
            }
            aria-label="Procent completat"
            className="h-1 flex-1 accent-brand-500" />
          
            <div className="flex items-center gap-1">
              <input
              type="number"
              min={0}
              max={100}
              value={style.progressValue ?? 66}
              onChange={(event) =>
              onChange({
                progressValue: Math.min(
                  100,
                  Math.max(0, Number(event.target.value) || 0)
                )
              })
              }
              aria-label="Procent completat, valoare"
              className="w-16 rounded-md border border-slate-200 px-2 py-1.5 text-center text-sm font-semibold text-ink focus:border-brand-500 focus:outline-none" />
            
              <span className="text-sm font-semibold text-ink-400">%</span>
            </div>
          </div>

          <p className="mt-4 text-sm font-semibold text-ink-500">Model</p>
          <select
          value={style.progressStyle ?? 'plain'}
          onChange={(event) =>
          onChange({
            progressStyle: event.target.
            value as NonNullable<ElementStyle['progressStyle']>
          })
          }
          className="mt-1.5 w-full rounded-md border border-slate-200 px-3 py-2.5 text-sm font-semibold text-ink focus:border-brand-500 focus:outline-none">
          
            <option value="plain">Bară simplă</option>
            <option value="striped">Bară dungată</option>
          </select>

          <p className="mt-4 text-sm font-semibold text-ink-500">Grosime</p>
          <select
          value={style.progressThickness ?? 1}
          onChange={(event) =>
          onChange({ progressThickness: Number(event.target.value) })
          }
          className="mt-1.5 w-full rounded-md border border-slate-200 px-3 py-2.5 text-sm font-semibold text-ink focus:border-brand-500 focus:outline-none">
          
            {[1, 2, 3, 4, 5].map((level) =>
          <option key={level} value={level}>
                {level}
              </option>
          )}
          </select>
        </section>
      }

      {node.kind === 'divider' &&
      <section className="mt-6 border-t border-slate-200 pt-6">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-base font-bold text-ink">
              Border
            </h3>
            <button
            type="button"
            onClick={() =>
            onChange({
              lineStyle: 'solid',
              lineWidth: 1,
              radius: [0, 0, 0, 0]
            })
            }
            aria-label="Resetează setările liniei"
            className="rounded-md p-1.5 text-ink-500 transition-colors duration-150 ease-out hover:bg-slate-100">
            
              <RefreshCwIcon className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <p className="mt-4 text-sm font-semibold text-ink-500">
            Rotunjire colțuri
          </p>
          <div className="mt-2 flex items-center gap-2">
            {(style.radius ?? [0, 0, 0, 0]).map((value, index) =>
          <input
            key={index}
            type="number"
            min={0}
            value={value}
            aria-label={`Colț ${index + 1}`}
            onChange={(event) => {
              const next = [...(style.radius ?? [0, 0, 0, 0])] as [
                number,
                number,
                number,
                number];

              next[index] = Number(event.target.value) || 0;
              onChange({ radius: next });
            }}
            className="w-full border-b border-slate-300 px-1 py-1.5 text-center text-sm font-semibold text-ink focus:border-brand-500 focus:outline-none" />

          )}
          </div>

          <p className="mt-4 text-sm font-semibold text-ink-500">Stil</p>
          <select
          value={style.lineStyle ?? 'solid'}
          onChange={(event) =>
          onChange({
            lineStyle: event.target.
            value as NonNullable<ElementStyle['lineStyle']>
          })
          }
          className="mt-1.5 w-full rounded-md border border-slate-200 px-3 py-2.5 text-sm font-semibold text-ink focus:border-brand-500 focus:outline-none">
          
            <option value="none">None</option>
            <option value="solid">Solid</option>
            <option value="dotted">Dotted</option>
            <option value="dashed">Dashed</option>
          </select>

          <p className="mt-4 text-sm font-semibold text-ink-500">Grosime</p>
          <div className="mt-1.5 flex items-center gap-3">
            <input
            type="range"
            min={1}
            max={20}
            value={style.lineWidth ?? 1}
            aria-label="Grosimea liniei"
            onChange={(event) =>
            onChange({ lineWidth: Number(event.target.value) })
            }
            className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full accent-brand-500"
            style={{
              background: `linear-gradient(to right, #2f6bff 0%, #2f6bff ${
              ((style.lineWidth ?? 1) - 1) / 19 * 100}%, #e2e8f0 ${

              ((style.lineWidth ?? 1) - 1) / 19 * 100}%, #e2e8f0 100%)`

            }} />
          
            <input
            type="number"
            min={1}
            max={20}
            value={style.lineWidth ?? 1}
            onChange={(event) =>
            onChange({ lineWidth: Number(event.target.value) || 1 })
            }
            aria-label="Grosimea liniei — valoare"
            className="w-[76px] rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-ink focus:border-brand-500 focus:outline-none" />
          
          </div>
        </section>
      }

      <section className="mt-8 border-t border-slate-200 pt-6">
        <h3 className="font-display text-base font-bold text-ink">Aliniere</h3>
        <div className="mt-2 grid grid-cols-3 gap-1 rounded-lg border border-slate-200 bg-slate-50 p-1">
          {alignOptions.map((option) =>
          <button
            key={option.value}
            type="button"
            onClick={() => onChange({ align: option.value })}
            aria-pressed={style.align === option.value}
            className={`flex items-center justify-center gap-1.5 rounded-md py-2 text-xs font-bold transition-colors duration-150 ease-out ${
            style.align === option.value ?
            'bg-white text-ink shadow-sm' :
            'text-ink-500 hover:text-ink-700'}`
            }>
            
              <option.icon className="h-4 w-4" aria-hidden="true" />
              {option.label}
            </button>
          )}
        </div>
      </section>

      <section className="mt-8 border-t border-slate-200 pt-6">
        <h3 className="font-display text-base font-bold text-ink">Culori</h3>
        <div className="mt-3 space-y-3">
          {colorFields.map((field) =>
          <div
            key={field.key}
            className="flex items-center justify-between gap-3">
            
              <p className="text-sm font-semibold text-ink-700">
                {field.label}
              </p>
              <button
              type="button"
              onClick={(event) => {
                if (openColor === field.key) {
                  setOpenColor(null);
                  return;
                }
                const rect = event.currentTarget.getBoundingClientRect();
                setAnchor({
                  top: rect.top + rect.height / 2,
                  left: rect.right + 16
                });
                setOpenColor(field.key);
              }}
              data-color-trigger
              aria-label={`${field.label} — alege culoarea`}
              className="relative h-7 w-7 shrink-0 overflow-hidden rounded-full border border-slate-200 shadow-sm transition-transform duration-150 ease-out hover:scale-110"
              style={{
                backgroundColor:
                (style.colors[field.key] ?? field.value) === 'transparent' ?
                '#ffffff' :
                style.colors[field.key] ?? field.value
              }}>
              
                {(style.colors[field.key] ?? field.value) === 'transparent' &&
              <span
                aria-hidden="true"
                className="absolute left-1/2 top-1/2 h-px w-9 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-red-400" />

              }
              </button>

              {openColor === field.key &&
            createPortal(
              <div
                className="fixed z-[70] -translate-y-1/2"
                style={{ top: anchor.top, left: anchor.left }}>
                
                    <ColorPickerPopover
                  value={style.colors[field.key] ?? field.value}
                  onChange={(hex) => onChange({ colors: { [field.key]: hex } })}
                  onClose={() => setOpenColor(null)} />
                
                  </div>,
              document.body
            )}
            </div>
          )}
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
                  // valorile negative sunt permise, pentru a strânge elementele
                  [field.key]: Number(event.target.value) || 0
                } as Partial<ElementStyle>)
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
          { key: 'visibleMobile' as const, label: 'Mobil' }] as
          const).
          map((option) =>
          <label
            key={option.key}
            className="flex cursor-pointer items-center gap-3 text-sm font-semibold text-ink">
            
              <span
              className={`flex h-5 w-5 items-center justify-center rounded transition-colors duration-150 ease-out ${
              style[option.key] !== false ?
              'bg-brand-500 text-white' :
              'border border-slate-300 bg-white'}`
              }>
              
                {style[option.key] !== false &&
              <CheckIcon className="h-3.5 w-3.5" aria-hidden="true" />
              }
              </span>
              <input
              type="checkbox"
              checked={style[option.key] !== false}
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