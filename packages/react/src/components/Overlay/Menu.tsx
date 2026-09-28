import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';
import { Divider } from './Divider';
import { MenuItem } from './MenuItem';
import styles from './Overlay.module.css';

export type MenuEntry =
  | { type: 'label'; label: string }
  | { type: 'separator' }
  | { type?: 'item'; id: string; label: string; icon?: ReactNode; shortcut?: string; disabled?: boolean;
      selected?: boolean; destructive?: boolean; onSelect?: () => void; submenu?: readonly MenuEntry[] };
export type MenuProps = {
  items: readonly MenuEntry[];
  label?: string;
  labelledBy?: string;
  id?: string;
  variant?: 'menu' | 'dropdown' | 'context';
  onClose?: () => void;
  onAction?: (id: string) => void;
  autoFocus?: boolean;
  className?: string | undefined;
};

/** Menu surface with roving DOM focus, typeahead and nested submenu navigation. */
export function Menu({ items, label = 'Menu', labelledBy, id, variant = 'menu', onClose, onAction,
  autoFocus = true, className }: MenuProps) {
  const generatedId = useId();
  const menuId = id ?? `pds-menu-${generatedId}`;
  const root = useRef<HTMLDivElement>(null);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const typeahead = useRef({ text: '', time: 0 });
  const focusable = () => [...(root.current?.querySelectorAll<HTMLElement>(':scope > [data-menu-row] > [data-menu-row] > [role="menuitem"]') ?? [])]
    .filter(node => node.getAttribute('aria-disabled') !== 'true');
  const focusFirst = () => focusable()[0]?.focus();

  useLayoutEffect(() => {
    if (!autoFocus) return;
    focusFirst();
  }, [autoFocus]);
  const submenuEntry = (target: HTMLElement | null) => {
    const row = target?.closest('[data-entry-id]');
    const key = row?.getAttribute('data-entry-id');
    return items.find(item => (item.type === undefined || item.type === 'item') && item.id === key);
  };
  const keyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.target instanceof Element && event.target.closest('[role="menu"]') !== root.current) return;
    const nodes = focusable();
    const current = event.target instanceof HTMLElement ? event.target.closest<HTMLElement>('[role="menuitem"]') : null;
    const index = nodes.indexOf(current!);
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      if (!nodes.length) return;
      nodes[(index + (event.key === 'ArrowDown' ? 1 : -1) + nodes.length) % nodes.length]?.focus();
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault(); (event.key === 'Home' ? nodes[0] : nodes.at(-1))?.focus();
    } else if (event.key === 'ArrowRight') {
      const entry = submenuEntry(current);
      if (entry && 'submenu' in entry && entry.submenu?.length && !entry.disabled) {
        event.preventDefault(); setOpenSubmenu(entry.id);
      }
    } else if (event.key === 'ArrowLeft') {
      if (onClose) { event.preventDefault(); onClose(); }
    } else if (event.key === 'Escape') {
      event.preventDefault(); event.stopPropagation();
      if (openSubmenu) {
        const row = items.find(item => (item.type === undefined || item.type === 'item') && item.id === openSubmenu);
        if (row && 'id' in row) document.getElementById(`${menuId}-${row.id}`)?.focus();
        setOpenSubmenu(null);
      } else onClose?.();
    } else if (event.key === 'Enter' || event.key === ' ') {
      const entry = submenuEntry(current);
      if (!entry || entry.type === 'separator' || entry.type === 'label' || entry.disabled) return;
      event.preventDefault();
      if (entry.submenu?.length) setOpenSubmenu(entry.id);
      else { entry.onSelect?.(); onAction?.(entry.id); }
    } else if (event.key.length === 1 && !event.altKey && !event.ctrlKey && !event.metaKey) {
      const now = Date.now();
      const previous = now - typeahead.current.time < 700 ? typeahead.current.text : '';
      const text = previous + event.key.toLocaleLowerCase();
      typeahead.current = { text, time: now };
      const search = [...text].every(letter => letter === text[0]) ? text[0]! : text;
      const ordered = [...nodes.slice(index + 1), ...nodes.slice(0, index + 1)];
      ordered.find(node => node.textContent?.trim().toLocaleLowerCase().startsWith(search))?.focus();
    }
  };
  return <div ref={root} id={menuId} role="menu" aria-label={labelledBy ? undefined : label} aria-labelledby={labelledBy}
    className={[styles.menu, className].filter(Boolean).join(' ')} data-variant={variant} onKeyDown={keyDown}>
    {items.map((entry, index) => {
      if (entry.type === 'separator') return <Divider key={`separator-${index}`} />;
      if (entry.type === 'label') return <div key={`label-${index}`} className={styles.menuSectionLabel} role="presentation">{entry.label}</div>;
      const hasSubmenu = !!entry.submenu?.length;
      const isOpen = openSubmenu === entry.id && hasSubmenu;
      const rowId = `${menuId}-${entry.id}`;
      const childId = `${rowId}-submenu`;
      return <div key={entry.id} data-menu-row data-entry-id={entry.id} className={styles.menuRow}>
        <MenuItem id={rowId} inMenu label={entry.label} icon={entry.icon ?? null} shortcut={entry.shortcut}
          disabled={entry.disabled} selected={entry.selected} destructive={entry.destructive}
          submenu={hasSubmenu} expanded={isOpen} controls={childId}
          onSelect={() => { entry.onSelect?.(); onAction?.(entry.id); }}
          onOpenSubmenu={() => { if (!entry.disabled) setOpenSubmenu(entry.id); }} />
        {isOpen && <Menu id={childId} variant={variant} items={entry.submenu!} label={`${entry.label} submenu`}
          onClose={() => { setOpenSubmenu(null); document.getElementById(rowId)?.focus(); }}
          onAction={id => { onAction?.(id); }} className={styles.submenu} />}
      </div>;
    })}
  </div>;
}
