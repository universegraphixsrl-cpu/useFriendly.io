import React from "react";
import { PlusIcon, BoxIcon } from "lucide-react";
interface EmptyCollectionProps {
  icon: BoxIcon;
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
}

/** Starea goală pentru colecțiile din Web builder (formulare, bloguri) */
export function EmptyCollection({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction
}: EmptyCollectionProps) {
  return <div className="mt-6 flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-md bg-slate-100 text-ink-400">
        <Icon className="h-6 w-6" aria-hidden="true" />
      </span>
      <p className="mt-4 font-display text-lg font-bold text-ink">{title}</p>
      <p className="mt-1.5 max-w-md text-sm text-ink-500">{description}</p>
      <button type="button" onClick={onAction} className="mt-6 inline-flex items-center gap-2 rounded-md bg-brand-500 px-4 py-2.5 font-display text-[15px] font-bold text-white transition-colors duration-150 ease-out hover:bg-brand-600">
        <PlusIcon className="h-4 w-4" strokeWidth={2.5} aria-hidden="true" />
        {actionLabel}
      </button>
    </div>;
}