import type { DragPayload } from '../../data/editor';

const MIME = 'application/x-friendly-editor';

/** Ține payload-ul și în memorie, pentru că dataTransfer nu e citibil în dragOver */
let active: DragPayload | null = null;

export const startDrag = (
event: React.DragEvent,
payload: DragPayload)
: void => {
  active = payload;
  event.dataTransfer.setData(MIME, JSON.stringify(payload));
  event.dataTransfer.effectAllowed = 'copy';
};

export const endDrag = (): void => {
  active = null;
};

export const currentPayload = (): DragPayload | null => active;

export const readDrag = (event: React.DragEvent): DragPayload | null => {
  const raw = event.dataTransfer.getData(MIME);
  if (raw) {
    try {
      return JSON.parse(raw) as DragPayload;
    } catch {
      return active;
    }
  }
  return active;
};