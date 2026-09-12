import React, { useState } from 'react';
import {
  ChevronDownIcon,
  ChevronUpIcon,
  CornerDownRightIcon,
  Trash2Icon } from
'lucide-react';
import {
  createMenuItem,
  createSubmenuItem,
  type MenuItem } from
'../../data/editor';

interface MenuItemsPanelProps {
  items: MenuItem[];
  onChange: (items: MenuItem[]) => void;
}

/** Editorul linkurilor din elementul Meniu, cu sub-meniuri pe fiecare item */
export function MenuItemsPanel({ items, onChange }: MenuItemsPanelProps) {
  const [open, setOpen] = useState<string | null>(items[0]?.id ?? null);

  const patch = (id: string, changes: Partial<MenuItem>) =>
  onChange(
    items.map((item) => item.id === id ? { ...item, ...changes } : item)
  );

  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  return (
    <section className="mt-6" style={{ order: -1 }}>
      <h3 className="font-display text-base font-bold text-ink">Meniu</h3>

      <div className="mt-3 space-y-5">
        {items.map((item, index) => {
          const expanded = open === item.id;
          return (
            <div
              key={item.id}
              className="border-b border-slate-100 pb-5 last:border-b-0">
              
              <div className="flex items-center justify-between">
                <p className="font-display text-sm font-bold text-ink">
                  Menu item {index + 1}
                </p>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    aria-label="Șterge itemul"
                    onClick={() =>
                    onChange(items.filter((entry) => entry.id !== item.id))
                    }
                    className="rounded-md p-1.5 text-red-500 transition-colors duration-150 ease-out hover:bg-red-50">
                    
                    <Trash2Icon className="h-4 w-4" aria-hidden="true" />
                  </button>
                  {index > 0 &&
                  <button
                    type="button"
                    aria-label="Mută mai sus"
                    onClick={() => move(index, -1)}
                    className="rounded-md p-1.5 text-ink-500 transition-colors duration-150 ease-out hover:bg-slate-100">
                    
                      <ChevronUpIcon className="h-4 w-4" aria-hidden="true" />
                    </button>
                  }
                  <button
                    type="button"
                    aria-label={expanded ? 'Închide itemul' : 'Deschide itemul'}
                    onClick={() => setOpen(expanded ? null : item.id)}
                    className="rounded-md p-1.5 text-ink-500 transition-colors duration-150 ease-out hover:bg-slate-100">
                    
                    <ChevronDownIcon
                      className={`h-4 w-4 transition-transform duration-150 ease-out ${
                      expanded ? 'rotate-180' : ''}`
                      }
                      aria-hidden="true" />
                    
                  </button>
                </div>
              </div>

              {expanded &&
              <div className="mt-3 space-y-2.5">
                  <input
                  type="text"
                  value={item.label}
                  placeholder="Denumire"
                  onChange={(event) =>
                  patch(item.id, { label: event.target.value })
                  }
                  className="w-full rounded-md border border-slate-200 px-3 py-2.5 text-sm text-ink focus:border-brand-500 focus:outline-none" />
                
                  <input
                  type="text"
                  value={item.link}
                  placeholder="Link"
                  onChange={(event) =>
                  patch(item.id, { link: event.target.value })
                  }
                  className="w-full rounded-md border border-slate-200 px-3 py-2.5 text-sm text-ink focus:border-brand-500 focus:outline-none" />
                

                  <label className="flex cursor-pointer items-center gap-2.5 text-sm font-semibold text-ink">
                    <input
                    type="checkbox"
                    checked={item.newWindow}
                    onChange={(event) =>
                    patch(item.id, { newWindow: event.target.checked })
                    }
                    className="h-4 w-4 rounded border-slate-300 text-brand-500 focus:ring-brand-500" />
                  
                    Deschide într-o fereastră nouă
                  </label>

                  <label className="flex cursor-pointer items-center gap-2.5 text-sm font-semibold text-ink">
                    <span
                    className={`relative h-5 w-9 shrink-0 rounded-full transition-colors duration-150 ease-out ${
                    item.hasSubmenu ? 'bg-brand-500' : 'bg-slate-300'}`
                    }>
                    
                      <span
                      className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform duration-150 ease-out ${
                      item.hasSubmenu ? 'translate-x-4' : 'translate-x-0.5'}`
                      } />
                    
                    </span>
                    <input
                    type="checkbox"
                    checked={item.hasSubmenu}
                    onChange={(event) =>
                    patch(item.id, {
                      hasSubmenu: event.target.checked,
                      children:
                      event.target.checked && item.children.length === 0 ?
                      [createSubmenuItem()] :
                      item.children
                    })
                    }
                    className="sr-only" />
                  
                    Are sub-meniu
                  </label>

                  {item.hasSubmenu &&
                <div className="space-y-4 pt-1">
                      {item.children.map((child, childIndex) =>
                  <div key={child.id}>
                          <div className="flex items-center justify-between">
                            <p className="flex items-center gap-1.5 font-display text-sm font-bold text-ink">
                              <CornerDownRightIcon
                          className="h-4 w-4 text-ink-400"
                          aria-hidden="true" />
                        
                              Sub-item {childIndex + 1}
                            </p>
                            <button
                        type="button"
                        aria-label="Șterge sub-itemul"
                        onClick={() =>
                        patch(item.id, {
                          children: item.children.filter(
                            (entry) => entry.id !== child.id
                          )
                        })
                        }
                        className="rounded-md p-1.5 text-red-500 transition-colors duration-150 ease-out hover:bg-red-50">
                        
                              <Trash2Icon
                          className="h-4 w-4"
                          aria-hidden="true" />
                        
                            </button>
                          </div>

                          <div className="mt-2 space-y-2.5 pl-5">
                            <input
                        type="text"
                        value={child.label}
                        placeholder="Denumire"
                        onChange={(event) =>
                        patch(item.id, {
                          children: item.children.map((entry) =>
                          entry.id === child.id ?
                          { ...entry, label: event.target.value } :
                          entry
                          )
                        })
                        }
                        className="w-full rounded-md border border-slate-200 px-3 py-2.5 text-sm text-ink focus:border-brand-500 focus:outline-none" />
                      
                            <input
                        type="text"
                        value={child.link}
                        placeholder="Link"
                        onChange={(event) =>
                        patch(item.id, {
                          children: item.children.map((entry) =>
                          entry.id === child.id ?
                          { ...entry, link: event.target.value } :
                          entry
                          )
                        })
                        }
                        className="w-full rounded-md border border-slate-200 px-3 py-2.5 text-sm text-ink focus:border-brand-500 focus:outline-none" />
                      
                            <label className="flex cursor-pointer items-center gap-2.5 text-sm font-semibold text-ink">
                              <input
                          type="checkbox"
                          checked={child.newWindow}
                          onChange={(event) =>
                          patch(item.id, {
                            children: item.children.map((entry) =>
                            entry.id === child.id ?
                            {
                              ...entry,
                              newWindow: event.target.checked
                            } :
                            entry
                            )
                          })
                          }
                          className="h-4 w-4 rounded border-slate-300 text-brand-500 focus:ring-brand-500" />
                        
                              Deschide într-o fereastră nouă
                            </label>
                          </div>
                        </div>
                  )}

                      <button
                    type="button"
                    onClick={() =>
                    patch(item.id, {
                      children: [...item.children, createSubmenuItem()]
                    })
                    }
                    className="w-full rounded-md border border-slate-200 py-2.5 text-sm font-semibold text-ink transition-colors duration-150 ease-out hover:border-brand-300 hover:text-brand-600">
                    
                        Adaugă sub-item
                      </button>
                    </div>
                }
                </div>
              }
            </div>);

        })}
      </div>

      <button
        type="button"
        onClick={() => {
          const item = createMenuItem('Menu item', '');
          onChange([...items, item]);
          setOpen(item.id);
        }}
        className="mt-4 w-full rounded-md bg-brand-500 py-2.5 text-sm font-semibold text-white transition-colors duration-150 ease-out hover:bg-brand-600">
        
        Adaugă item în meniu
      </button>
    </section>);

}