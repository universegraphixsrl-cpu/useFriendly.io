import React, { useRef, useState } from 'react';
import { UploadIcon, Trash2Icon } from 'lucide-react';

interface ImageUploaderProps {
  label: string;
  hint: string;
  fallback: string;
  shape?: 'circle' | 'square';
  onChanged?: () => void;
}

export function ImageUploader({
  label,
  hint,
  fallback,
  shape = 'circle',
  onChanged
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      onChanged?.();
    }
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
        <div className="mt-2 flex items-center gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-bold text-ink-700 transition-colors duration-150 ease-out hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700">
            
            <UploadIcon className="h-3.5 w-3.5" aria-hidden="true" />
            Încarcă imagine
          </button>
          {preview &&
          <button
            type="button"
            onClick={() => {
              setPreview(null);
              onChanged?.();
            }}
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
          onChange={handleFile}
          className="hidden"
          aria-label={`Încarcă ${label}`} />
        
      </div>
    </div>);

}