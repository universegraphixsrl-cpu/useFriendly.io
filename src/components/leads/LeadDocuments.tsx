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

  const attach = (files: FileList | null, type: LeadDocumentType) => {
    if (!files) return;
    Array.from(files).forEach((file) => {
      onAdd({
        id: `doc-${Date.now()}-${file.name}`,
        fileName: file.name,
        type,
        addedOn: today(),
        url: URL.createObjectURL(file)
      });
    });
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
              <a
            href={document.url ?? '#'}
            download={document.fileName}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-bold text-ink-700 transition-colors duration-150 ease-out hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700">
            
                <DownloadIcon className="h-3.5 w-3.5" aria-hidden="true" />
                PDF
              </a>
              <button
            type="button"
            onClick={() => onRemove(document.id)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-500 transition-colors duration-150 ease-out hover:bg-red-50 hover:text-red-600"
            aria-label={`Șterge ${document.fileName}`}>
            
                <Trash2Icon className="h-4 w-4" aria-hidden="true" />
              </button>
            </li>
        )}
        </ul> :

      <p className="mt-2 text-sm text-ink-500">Niciun document atașat</p>
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
          attach(event.dataTransfer.files, pendingType);
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
          attach(event.target.files, pendingType);
          event.target.value = '';
        }} />
      
    </div>);

}