/** Biblioteca de imagini încărcate în tot softul */
export interface LibraryImage {
  id: string;
  name: string;
  src: string;
}

const library: LibraryImage[] = [];

export const getLibraryImages = () => library;

export function addLibraryImage(name: string, src: string): LibraryImage {
  const existing = library.find((image) => image.src === src);
  if (existing) return existing;
  const image = { id: `img-${Date.now()}-${library.length}`, name, src };
  library.unshift(image);
  return image;
}