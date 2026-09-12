import React from 'react';
import { SparklesIcon } from 'lucide-react';
import type { Task, TaskCategory } from '../../data/tasks';

interface CategoryPickerProps {
  categories: TaskCategory[];
  tasks: Task[];
  /** 'below' = se deschide sub buton (header), 'above' = deasupra butonului (jos în pagină) */
  placement: 'below' | 'above';
  onPick: (categoryId: string) => void;
  onCreateNew: () => void;
  onClose: () => void;
}

export function CategoryPicker({
  categories,
  tasks,
  placement,
  onPick,
  onCreateNew,
  onClose
}: CategoryPickerProps) {
  return (
    <>
      <button
        type="button"
        className="fixed inset-0 z-10 cursor-default"
        onClick={onClose}
        tabIndex={-1}
        aria-label="Închide lista de categorii" />
      
      <div
        role="menu"
        className={`absolute z-20 w-72 rounded-xl border border-slate-200 bg-white py-2 shadow-xl ${
        placement === 'below' ?
        'right-0 top-full mt-2' :
        'bottom-full left-1/2 mb-2 -translate-x-1/2'}`
        }>
        
        <p className="px-3.5 pb-1.5 text-[11px] font-bold uppercase tracking-wide text-ink-500">
          În ce categorie intră task-ul?
        </p>
        {categories.map((category) =>
        <button
          key={category.id}
          type="button"
          role="menuitem"
          onClick={() => onPick(category.id)}
          className="flex w-full items-center gap-2.5 px-3.5 py-2 text-left text-sm font-semibold text-ink-700 transition-colors duration-150 ease-out hover:bg-slate-50 hover:text-brand-700">
          
            <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: category.color }}
            aria-hidden="true" />
          
            <span className="flex-1 truncate">{category.name}</span>
            <span className="text-xs text-ink-500">
              {tasks.filter((task) => task.categoryId === category.id).length}
            </span>
          </button>
        )}

        <div className="mt-1 border-t border-slate-100 pt-1">
          <button
            type="button"
            role="menuitem"
            onClick={onCreateNew}
            className="flex w-full items-center gap-2 px-3.5 py-2.5 text-left text-sm font-bold text-brand-600 transition-colors duration-150 ease-out hover:bg-brand-50">
            
            <SparklesIcon className="h-4 w-4" aria-hidden="true" />
            Creează o categorie nouă
          </button>
        </div>
      </div>
    </>);

}