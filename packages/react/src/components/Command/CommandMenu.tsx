import { useId, useRef, useState } from 'react';
import type { ChangeEvent, KeyboardEvent } from 'react';
import { ArrowDown, ArrowUp, CornerDownLeft, Inbox, Search, X } from 'lucide-react';
import { Divider } from '../Overlay/Divider';
import { ModalBase } from '../Modal/ModalBase';
import type { CommandGroupData, CommandGroupProps } from './CommandGroup';
import { CommandGroup } from './CommandGroup';
import styles from './Command.module.css';

export type CommandMenuProps = {
  groups: readonly CommandGroupData[];
  id?: string;
  label?: string;
  placeholder?: string;
  emptyMessage?: string;
  query?: string;
  onQueryChange?: (query: string) => void;
  selectedId?: string | null;
  onSelectedIdChange?: (id: string | null) => void;
  onSelect?: (id: string) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
};

/** Canonical Command Menu from component set 186:8754, usable inline or as a modal overlay. */
export function CommandMenu({ groups, id, label = 'Command menu', placeholder = 'Type a command or search...',
  emptyMessage = 'No results found.', query, onQueryChange, selectedId, onSelectedIdChange,
  onSelect, open, onOpenChange, className }: CommandMenuProps) {
  const generatedId = useId();
  const menuId = id ?? `pds-command-${generatedId}`;
  const listId = `${menuId}-list`;
  const [internalQuery, setInternalQuery] = useState('');
  const [internalSelected, setInternalSelected] = useState<string | null>(null);
  const input = useRef<HTMLInputElement>(null);
  const text = query ?? internalQuery;
  const selected = selectedId === undefined ? internalSelected : selectedId;
  const setSelected = (next: string | null) => {
    if (selectedId === undefined) setInternalSelected(next);
    onSelectedIdChange?.(next);
  };
  const filtered = groups.map(group => ({ ...group, items: group.items.filter(item => {
    const terms = [item.label, ...(item.keywords ?? [])].join(' ').toLocaleLowerCase();
    return terms.includes(text.trim().toLocaleLowerCase());
  }) })).filter(group => group.items.length);
  const displayGroups = text ? [{ id: 'results', label: 'Results', items: filtered.flatMap(group => group.items) }] : filtered;
  const enabled = filtered.flatMap(group => group.items).filter(item => !item.disabled);
  const active = enabled.some(item => item.id === selected) ? selected : null;
  const setQuery = (next: string) => {
    if (query === undefined) setInternalQuery(next);
    onQueryChange?.(next);
    const first = groups.flatMap(group => group.items).find(item => !item.disabled &&
      [item.label, ...(item.keywords ?? [])].join(' ').toLocaleLowerCase().includes(next.trim().toLocaleLowerCase()));
    setSelected(next ? first?.id ?? null : null);
  };
  const activate = (commandId: string) => {
    const command = enabled.find(item => item.id === commandId);
    if (!command) return;
    command.onSelect?.();
    onSelect?.(commandId);
    if (open !== undefined) onOpenChange?.(false);
  };
  const keyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      if (!enabled.length) return;
      const index = enabled.findIndex(item => item.id === active);
      const next = index < 0 ? event.key === 'ArrowDown' ? 0 : enabled.length - 1
        : (index + (event.key === 'ArrowDown' ? 1 : -1) + enabled.length) % enabled.length;
      setSelected(enabled[next]!.id);
    } else if (event.key === 'Home' || event.key === 'End') {
      if (!enabled.length) return;
      event.preventDefault(); setSelected((event.key === 'Home' ? enabled[0] : enabled.at(-1))!.id);
    } else if (event.key === 'Enter') {
      if (active) { event.preventDefault(); activate(active); }
    } else if (event.key === 'Escape' && open !== undefined) {
      event.preventDefault(); onOpenChange?.(false);
    }
  };
  const change = (event: ChangeEvent<HTMLInputElement>) => setQuery(event.currentTarget.value);
  const groupProps: Pick<CommandGroupProps, 'selectedId' | 'optionIdPrefix' | 'onActivate' | 'onHighlight'> = {
    selectedId: active, optionIdPrefix: `${menuId}-option`, onActivate: activate, onHighlight: setSelected,
  };
  const surface = <div className={[styles.menu, className].filter(Boolean).join(' ')}
    onKeyDown={event => {
      if (open === undefined || event.key !== 'Tab') return;
      const focusable = [...event.currentTarget.querySelectorAll<HTMLElement>('input, button:not([disabled])')];
      const first = focusable[0];
      const last = focusable.at(-1);
      if (!first || !last) return;
      if (focusable.length === 1 || (event.shiftKey && document.activeElement === first) ||
        (!event.shiftKey && document.activeElement === last)) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
      }
    }}>
    <div className={styles.searchBar}>
      <Search size={16} aria-hidden="true" />
      <input ref={input} type="text" role="combobox" aria-label="Search commands" aria-autocomplete="list"
        aria-expanded="true" aria-controls={listId} aria-activedescendant={active ? `${menuId}-option-${active}` : undefined}
        placeholder={placeholder} value={text} onChange={change} onKeyDown={keyDown} />
      {text && <button type="button" className={styles.clear} aria-label="Clear search"
        onClick={() => { setQuery(''); input.current?.focus(); }}><X size={14} aria-hidden="true" /></button>}
    </div>
    <Divider className={styles.divider} />
    <div id={listId} role="listbox" aria-label="Commands" className={styles.list}>
      {filtered.length ? displayGroups.map(group => <CommandGroup key={group.id} {...group} {...groupProps} />) : null}
    </div>
    {!filtered.length && <div className={styles.empty} role="status"><Inbox size={28} aria-hidden="true" /><span>{emptyMessage}</span></div>}
    <Divider className={styles.divider} />
    <div className={styles.footer} aria-hidden="true"><ArrowUp size={12} /><ArrowDown size={12} /><span>navigate</span>
      <span>·</span><CornerDownLeft size={12} /><span>select</span><span>·</span><strong>esc</strong><span>close</span></div>
  </div>;
  if (open === undefined) return <section id={menuId} aria-label={label} className={styles.inline}>{surface}</section>;
  return <ModalBase open={open} onOpenChange={onOpenChange ?? (() => {})} titleId={`${menuId}-title`}
    className={styles.dialog ?? ''}>
    <h2 id={`${menuId}-title`} className={styles.srOnly}>{label}</h2>
    {surface}
  </ModalBase>;
}
