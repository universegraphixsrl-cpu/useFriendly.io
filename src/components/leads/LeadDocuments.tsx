import React, { useRef, useState } from 'react';
import {
  FileTextIcon,
  DownloadIcon,
  Trash2Icon,
  UploadCloudIcon } from
'lucide-react';
import {
  leadDocumentTypes,
  type LeadDocument,
  type LeadDocumentType } from
'../../data/leads';
import { uploadFile, fileUrl, removeFile } from '../../lib/storage';

interface LeadDocumentsProps {
  documents: LeadDocument[];
  onAdd: (document: LeadDocument) => void;
  onRemove: (id: string) => void;
}

const today = () =>
new Date().toLocaleDateString('ro-RO', {
  day: 'numeric',
  month: 'short',
  year: 'numeric'
});

export function LeadDocuments({
  documents,
  onAdd,
  onRemove
}: LeadDocumentsProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [pendingType, setPendingType] = useState<LeadDocumentType>('Factură');
  const [dragging, setDragging] = useState(false);
  const [busy, setBusy] = useState(false);
  const [uploadError, setUploadError] = useState('');

  /** Urcă fișierele și abia apoi le adaugă în fișa leadului */
  const attach = async (files: FileList | null, type: LeadDocumentType) => {
    if (!files || files.length === 0) return;
    setUploadError('');
    setBusy(true);
    for (const file of Array.from(files)) {
      const { url, error } = await uploadFile(file, 'leads');
      if (error || !url) {
        setUploadError(error ?? 'Încărcarea a eșuat.');
        continue;
      }
      onAdd({
        id: `doc-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        fileName: file.name,
        type,
        addedOn: today(),
        url
      });
    }
    setBusy(false);
  };

  /** Deschide fișierul cu o adresă semnată, valabilă o oră */
  const openDocument = async (document: LeadDocument) => {
    const address = await fileUrl(document.url ?? '');
    if (!address) {
      setUploadError('Fișierul nu mai poate fi descărcat.');
      return;
    }
    window.open(address, '_blank', 'noopener');
  };

  return (
    <div className="rounded-xl border border-slate-200 p-4">
      <p className="text-xs font-bold uppercase tracking-wide text-ink-500">
        Documente atașate
      </p>

      {documents.length > 0 ?
      <ul className="mt-2.5 space-y-1.5">
          {documents.map((document) =>
        <li
          key={document.id}
          className="flex items-center gap-2.5 rounded-lg bg-slate-50 px-3 py-2">
          
              <FileTextIcon
            className="h-4 w-4 shrink-0 text-ink-500"
            aria-hidden="true" />
          
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold text-ink">
                  {document.fileName}
                </span>
                <span className="block text-[11px] font-semibold text-ink-500">
                  {document.type} · {document.addedOn}
                </span>
              </span>
              <button
            type="button"
            onClick={() => void openDocument(document)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-bold text-ink-700 transition-colors duration-150 ease-out hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700">
            
                <DownloadIcon className="h-3.5 w-3.5" aria-hidden="true" />
                Deschide
              </button>
              <button
            type="button"
            onClick={() => {
              void removeFile(document.url ?? '');
              onRemove(document.id);
            }}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-500 transition-colors duration-150 ease-out hover:bg-red-50 hover:text-red-600"
            aria-label={`Șterge ${document.fileName}`}>
            
                <Trash2Icon className="h-4 w-4" aria-hidden="true" />
              </button>
            </li>
        )}
        </ul> :

      <p className="mt-2 text-sm text-ink-500">Niciun document atașat</p>
      }

      {busy &&
      <p className="mt-3 rounded-lg bg-brand-50 px-3 py-2 text-xs font-semibold text-brand-700">
          Se încarcă fișierul…
        </p>
      }
      {uploadError &&
      <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-700">
          {uploadError}
        </p>
      }

      <p className="mt-4 text-[11px] font-bold uppercase tracking-wide text-ink-500">
        Atașează un document
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        {leadDocumentTypes.map((type) =>
        <button
          key={type}
          type="button"
          onClick={() => {
            setPendingType(type);
            inputRef.current?.click();
          }}
          className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-ink-700 transition-colors duration-150 ease-out hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700">
          
            {type}
          </button>
        )}
      </div>

      <div
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          void attach(event.dataTransfer.files, pendingType);
        }}
        className={`mt-3 flex flex-col items-center justify-center gap-1 rounded-xl border border-dashed px-4 py-5 text-center transition-colors duration-150 ease-out ${
        dragging ?
        'border-brand-300 bg-brand-50' :
        'border-slate-300 bg-slate-50'}`
        }>
        
        <UploadCloudIcon
          className="h-5 w-5 text-ink-500"
          aria-hidden="true" />
        
        <p className="text-xs font-semibold text-ink-700">
          Trage PDF-ul aici sau alege tipul de document mai sus
        </p>
        <p className="text-[11px] text-ink-500">
          Se atașează ca „{pendingType}” · doar PDF
        </p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        multiple
        className="hidden"
        onChange={(event) => {
          void attach(event.target.files, pendingType);
          event.target.value = '';
        }} />
      
    </div>);

}