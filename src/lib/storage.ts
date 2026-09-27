import { supabase, supabaseConfigured } from './supabase';

/**
 * Încărcarea fișierelor (facturi, contracte, materiale).
 *
 * Până acum, un fișier atașat trăia doar în tabul deschis:
 * `URL.createObjectURL` face o adresă temporară, validă exact până la
 * refresh. Adică atașai contractul, îl vedeai, dădeai refresh și
 * rămâneai cu numele lui și un link mort. Acum fișierul urcă într-adevăr.
 *
 * Bucket-ul e privat: nu se ajunge la el cu un link ghicit. Descărcarea
 * se face cu o adresă semnată, valabilă o oră.
 */

const BUCKET = 'documents';

/** Limita din bucket: 25 MB. O spunem înainte, nu după încărcare. */
export const MAX_FILE_BYTES = 25 * 1024 * 1024;

/** Curăță numele fișierului de diacritice și caractere care supără */
function safeName(name: string) {
  return (
    name.
    normalize('NFD').
    replace(/[̀-ͯ]/g, '').
    replace(/[^a-zA-Z0-9._-]/g, '-').
    replace(/-+/g, '-').
    slice(-80) || 'fisier');

}

/** Prefixul care spune „asta e o cale în Storage”, nu o adresă web */
const MARK = 'storage:';

export const isStoredFile = (url: string) => url.startsWith(MARK);
export const storedPath = (url: string) => url.slice(MARK.length);

/**
 * Urcă un fișier și întoarce ce trebuie salvat în baza de date.
 * La eroare întoarce mesajul, în română, gata de afișat.
 */
export async function uploadFile(
file: File,
folder: string)
: Promise<{url: string;error: null;} | {url: null;error: string;}> {
  if (!supabaseConfigured) {
    // Lucru local pe design, fără bază de date: rămâne adresa temporară
    return { url: URL.createObjectURL(file), error: null };
  }

  if (file.size > MAX_FILE_BYTES) {
    return {
      url: null,
      error: `Fișierul are ${Math.round(file.size / 1024 / 1024)} MB, iar limita e 25 MB.`
    };
  }

  const path = `${folder}/${Date.now()}-${safeName(file.name)}`;
  const { error } = await supabase.storage.
  from(BUCKET).
  upload(path, file, { upsert: false, contentType: file.type || undefined });

  if (error) {
    console.error('[Supabase] Încărcarea fișierului a eșuat:', error.message);
    return {
      url: null,
      error:
      error.message.toLowerCase().includes('bucket') ?
      'Spațiul de fișiere nu e încă pregătit în baza de date (rulează 05_module_data.sql).' :
      error.message
    };
  }

  return { url: MARK + path, error: null };
}

/**
 * Adresa de descărcare a unui fișier încărcat. Valabilă o oră, ca să nu
 * circule linkuri permanente către documentele clienților.
 */
export async function fileUrl(url: string): Promise<string | null> {
  if (!isStoredFile(url)) return url || null;
  if (!supabaseConfigured) return null;

  const { data, error } = await supabase.storage.
  from(BUCKET).
  createSignedUrl(storedPath(url), 3600);

  if (error) {
    console.error('[Supabase] Nu am putut deschide fișierul:', error.message);
    return null;
  }
  return data?.signedUrl ?? null;
}

/** Șterge fișierul din Storage (folosit când se scoate documentul) */
export async function removeFile(url: string) {
  if (!isStoredFile(url) || !supabaseConfigured) return;
  await supabase.storage.from(BUCKET).remove([storedPath(url)]);
}
