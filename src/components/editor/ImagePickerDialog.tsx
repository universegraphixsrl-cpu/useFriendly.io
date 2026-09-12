import React, { useState } from 'react';
import { CheckIcon } from 'lucide-react';
import {
  addLibraryImage,
  getLibraryImages,
  type LibraryImage } from
'../../data/imageLibrary';

interface ImagePickerDialogProps {
  onInsert: (image: LibraryImage) => void;
  onClose: () => void;
  /** Tipul fișierului acceptat: imagine (implicit) sau video */
  kind?: 'image' | 'video';
}

/** Fereastra de alegere a imaginii: încărcare nouă sau din biblioteca ta */
export function ImagePickerDialog({
  onInsert,
  onClose,
  kind = 'image'
}: ImagePickerDialogProps) {
  const isVideo = kind === 'video';
  const [tab, setTab] = useState<'upload' | 'library'>('upload');
  const [optimize, setOptimize] = useState(true);
  const [dragOver, setDragOver] = useState(false);
  const [selected, setSelected] = useState<LibraryImage | null>(null);
  const [images, setImages] = useState<LibraryImage[]>(() => [
  ...getLibraryImages()]
  );

  const handleFiles = (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const image = addLibraryImage(file.name, String(reader.result));
      setImages([...getLibraryImages()]);
      setSelected(image);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-ink/40 px-4"
      role="dialog"
      aria-modal="true"
      aria-label={isVideo ? 'Alege un video' : 'Alege o imagine'}
      onClick={onClose}>
      
      <div
        className="w-full max-w-lg overflow-hidden rounded-xl bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}>
        
        <div className="flex gap-6 border-b border-slate-200 px-6 pt-5">
          {(
          [
          { key: 'upload' as const, label: 'Încarcă' },
          {
            key: 'library' as const,
            label: isVideo ? 'Fișierele tale' : 'Imaginile tale'
          }] as
          const).
          map((item) =>
          <button
            key={item.key}
            type="button"
            onClick={() => setTab(item.key)}
            className={`-mb-px border-b-2 pb-3 text-sm font-bold transition-colors duration-150 ease-out ${
            tab === item.key ?
            'border-brand-500 text-ink' :
            'border-transparent text-ink-500 hover:text-ink'}`
            }>
            
              {item.label}
            </button>
          )}
        </div>

        <div className="px-6 py-5">
          {tab === 'upload' ?
          <>
              <label
              onDragOver={(event) => {
                event.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(event) => {
                event.preventDefault();
                setDragOver(false);
                handleFiles(event.dataTransfer.files);
              }}
              className={`flex h-36 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed text-center transition-colors duration-150 ease-out ${
              dragOver ?
              'border-brand-500 bg-brand-50' :
              'border-slate-300 hover:border-brand-400'}`
              }>
              
                <p className="text-sm font-semibold text-ink">
                  Trage un fișier sau{' '}
                  <span className="text-brand-600">apasă pentru a încărca</span>
                </p>
                <p className="mt-1 text-xs font-semibold text-ink-400">
                  Toate formatele sunt acceptate
                </p>
                <input
                type="file"
                accept={isVideo ? 'video/*' : 'image/*'}
                className="sr-only"
                onChange={(event) => handleFiles(event.target.files)} />
              
              </label>

              {selected &&
            <div className="mt-4 flex items-center gap-3 rounded-lg border border-slate-200 p-3">
                  {isVideo ?
              <video
                src={selected.src}
                className="h-12 w-12 rounded object-cover" /> :


              <img
                src={selected.src}
                alt=""
                className="h-12 w-12 rounded object-cover" />

              }
                  <span className="min-w-0 flex-1 truncate text-sm font-semibold text-ink">
                    {selected.name}
                  </span>
                </div>
            }

              <label className="mt-4 flex cursor-pointer items-center gap-3 text-sm font-semibold text-ink">
                <span
                className={`flex h-5 w-5 items-center justify-center rounded transition-colors duration-150 ease-out ${
                optimize ?
                'bg-brand-500 text-white' :
                'border border-slate-300 bg-white'}`
                }>
                
                  {optimize &&
                <CheckIcon className="h-3.5 w-3.5" aria-hidden="true" />
                }
                </span>
                <input
                type="checkbox"
                checked={optimize}
                onChange={(event) => setOptimize(event.target.checked)}
                className="sr-only" />
              
                {isVideo ?
              'Optimizează fișierele încărcate' :
              'Optimizează imaginile încărcate'}
              </label>
            </> :
          images.length === 0 ?
          <p className="py-10 text-center text-sm font-semibold text-ink-500">
              {isVideo ?
            'Nu ai încărcat încă niciun fișier.' :
            'Nu ai încărcat încă nicio imagine.'}
            </p> :

          <div className="grid max-h-64 grid-cols-3 gap-3 overflow-y-auto">
              {images.map((image) =>
            <button
              key={image.id}
              type="button"
              onClick={() => setSelected(image)}
              className={`overflow-hidden rounded-lg border-2 transition-colors duration-150 ease-out ${
              selected?.id === image.id ?
              'border-brand-500' :
              'border-transparent hover:border-slate-300'}`
              }>
              
                  {image.src.startsWith('data:video') ?
              <video src={image.src} className="h-24 w-full object-cover" /> :

              <img
                src={image.src}
                alt={image.name}
                className="h-24 w-full object-cover" />

              }
                </button>
            )}
            </div>
          }
        </div>

        <div className="flex items-center gap-3 border-t border-slate-200 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md bg-slate-100 px-4 py-2 text-sm font-bold text-ink-600 transition-colors duration-150 ease-out hover:bg-slate-200">
            
            Anulează
          </button>
          <button
            type="button"
            disabled={!selected}
            onClick={() => selected && onInsert(selected)}
            className="rounded-md bg-brand-500 px-4 py-2 text-sm font-bold text-white transition-colors duration-150 ease-out hover:bg-brand-600 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-ink-400">
            
            Inserează
          </button>
        </div>
      </div>
    </div>);

}