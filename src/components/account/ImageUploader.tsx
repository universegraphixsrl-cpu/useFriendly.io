import React, { useEffect, useRef, useState } from 'react';
import { UploadIcon, Trash2Icon, LoaderIcon } from 'lucide-react';
import { uploadFile, fileUrl, removeFile } from '../../lib/storage';

interface ImageUploaderProps {
  label: string;
  hint: string;
  /** Inițialele arătate cât timp nu există poză */
  fallback: string;
  shape?: 'circle' | 'square';
  /** Calea imaginii salvate, așa cum vine din profil */
  value?: string;
  /** Se cheamă cu noua cale după încărcare, sau cu '' după ștergere */
  onSave?: (url: string) => void;
}

/**
 * Încarcă o imagine și o salvează cu adevărat.
 *
 * Înainte făcea doar `URL.createObjectURL`: o adresă validă în tabul
 * deschis și atât. Puneai poza, dădeai refresh, dispărea. Acum fișierul
 * urcă în spațiul privat de fișiere, iar afișarea se face cu o adresă
 * semnată.
 */
export function ImageUploader({
  label,
  hint,
  fallback,
  shape = 'circle',
  value = '',
  onSave
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  /** Când profilul aduce o imagine salvată, o afișăm */
  useEffect(() => {
    let active = true;
    if (!value) {
      setPreview(null);
      return;
    }
    fileUrl(value).then((address) => {
      if (active) setPreview(address);
    });
    return () => {
      active = false;
    };
  }, [value]);

  const handleFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    setError('');
    setBusy(true);
    const { url, error: uploadError } = await uploadFile(file, 'profil');
    setBusy(false);

    if (uploadError || !url) {
      setError(uploadError ?? 'Încărcarea a eșuat.');
      return;
    }
    onSave?.(url);
  };

  const clear = () => {
    if (value) void removeFile(value);
    setPreview(null);
    onSave?.('');
  };

  const rounded = shape === 'circle' ? 'rounded-full' : 'rounded-2xl';

  return (
    <div className="flex items-center gap-4">
      {preview ?
      <img
        src={preview}
        alt={label}
        className={`h-20 w-20 object-cover ${rounded} ring-1 ring-slate-200`} /> :


      <span
        className={`flex h-20 w-20 items-center justify-center bg-brand-50 font-display text-lg font-extrabold text-brand-600 ${rounded} ring-1 ring-slate-200`}
        aria-hidden="true">

          {fallback}
        </span>
      }

      <div>
        <p className="font-display text-sm font-bold text-ink">{label}</p>
        <p className="text-xs text-ink-500">{hint}</p>
        {error &&
        <p className="mt-1 text-xs font-semibold text-red-600">{error}</p>
        }
        <div className="mt-2 flex items-center gap-2">
          <button
            type="button"
            disabled={busy}
            onClick={() => inputRef.current?.click()}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-bold text-ink-700 transition-colors duration-150 ease-out hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700 disabled:text-ink-500">

            {busy ?
            <LoaderIcon className="h-3.5 w-3.5 animate-spin" aria-hidden="true" /> :

            <UploadIcon className="h-3.5 w-3.5" aria-hidden="true" />
            }
            {busy ? 'Se încarcă…' : 'Încarcă imagine'}
          </button>
          {preview &&
          <button
            type="button"
            onClick={clear}
            className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-bold text-ink-500 transition-colors duration-150 ease-out hover:bg-red-50 hover:text-red-600">

              <Trash2Icon className="h-3.5 w-3.5" aria-hidden="true" />
              Șterge
            </button>
          }
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={(event) => void handleFile(event)}
          className="hidden"
          aria-label={`Încarcă ${label}`} />

      </div>
    </div>);

}
