import { useId, useRef, useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';
import { Check, ChevronDown, ChevronLeft, ChevronRight, Home } from 'lucide-react';
import styles from './Navigation.module.css';

export type NavigationMenuEntry = {
  id: string; label: string; icon?: ReactNode; shortcut?: string; disabled?: boolean;
  destructive?: boolean; selected?: boolean; divider?: boolean;
  onSelect?: () => void; submenu?: readonly NavigationMenuEntry[];
};
export type NavigationMenuItemProps = NavigationMenuEntry & {
  active?: boolean; expanded?: boolean; onActivate?: () => void; onSubmenuOpen?: () => void;
  submenuId?: string; tabIndex?: number; idAttribute?: string;
};

/** Navigation-specific item from 140:8108. Overlay MenuItem remains independent. */
export function NavigationMenuItem({ label, icon, shortcut, disabled, destructive, selected, divider,
  submenu, active, expanded, onActivate, onSubmenuOpen, submenuId, tabIndex = -1,
  idAttribute }: NavigationMenuItemProps) {
  if (divider) return <span role="separator" className={styles.menuDivider} />;
  const activate = () => { if (disabled) return; if (submenu?.length) onSubmenuOpen?.(); else onActivate?.(); };
  return <button id={idAttribute} type="button" role={selected ? 'menuitemcheckbox' : 'menuitem'}
    aria-checked={selected ? true : undefined} aria-disabled={disabled || undefined}
    aria-haspopup={submenu?.length ? 'menu' : undefined} aria-expanded={submenu?.length ? !!expanded : undefined}
    aria-controls={submenu?.length && expanded ? submenuId : undefined}
    className={styles.menuItem} data-active={active || undefined} data-destructive={destructive || undefined}
    tabIndex={disabled ? -1 : tabIndex} onClick={activate}>
    {icon && <span className={styles.menuIcon} aria-hidden="true">{icon}</span>}
    <span className={styles.menuLabel}>{label}</span>
    {shortcut && <span className={styles.menuShortcut} aria-hidden="true">{shortcut}</span>}
    {selected && <Check size={16} aria-hidden="true" />}
    {submenu?.length ? <ChevronRight size={16} aria-hidden="true" /> : null}
  </button>;
}

export type NavigationMenuProps = {
  items: readonly NavigationMenuEntry[]; label?: string; id?: string; className?: string;
  onSelect?: (id: string) => void;
};

/** Keyboard-operated Navigation Menu from 140:8300. */
export function NavigationMenu({ items, label = 'Navigation menu', id, className, onSelect }: NavigationMenuProps) {
  const generatedId = useId();
  const menuId = id ?? `pds-navigation-menu-${generatedId}`;
  const [path, setPath] = useState<string[]>([]);
  const [active, setActive] = useState<Record<number, string>>({});
  const rootRef = useRef<HTMLUListElement>(null);
  const menuItems = (depth: number) => depth === 0 ? items : path.slice(0, depth).reduce<readonly NavigationMenuEntry[]>((list, key) => list.find(item => item.id === key)?.submenu ?? [], items);
  const enabled = (depth: number) => menuItems(depth).filter(item => !item.divider && !item.disabled);
  const focus = (depth: number, key: string) => {
    setActive(previous => ({ ...previous, [depth]: key }));
    requestAnimationFrame(() => {
      const menu = depth === 0 ? rootRef.current : rootRef.current?.querySelector<HTMLElement>(`[data-menu-depth="${depth}"]`);
      menu?.querySelector<HTMLElement>(`[data-menu-key="${CSS.escape(key)}"] > button`)?.focus();
    });
  };
  const open = (depth: number, item: NavigationMenuEntry) => {
    if (!item.submenu?.length || item.disabled) return;
    setPath(previous => [...previous.slice(0, depth), item.id]);
    const first = item.submenu.find(entry => !entry.divider && !entry.disabled);
    if (first) focus(depth + 1, first.id);
  };
  const activate = (item: NavigationMenuEntry, depth: number) => {
    if (item.disabled || item.divider) return;
    if (item.submenu?.length) open(depth, item);
    else { item.onSelect?.(); onSelect?.(item.id); setPath([]); }
  };
  const onKeyDown = (event: KeyboardEvent<HTMLUListElement>, depth: number) => {
    const list = enabled(depth);
    const current = (event.target as HTMLElement).closest<HTMLElement>('[data-menu-key]')?.dataset.menuKey;
    const index = list.findIndex(item => item.id === current);
    let next: NavigationMenuEntry | undefined;
    if (event.key === 'ArrowDown') next = list[(index + 1 + list.length) % list.length];
    else if (event.key === 'ArrowUp') next = list[(index - 1 + list.length) % list.length];
    else if (event.key === 'Home') next = list[0];
    else if (event.key === 'End') next = list.at(-1);
    if (next) { event.preventDefault(); event.stopPropagation(); focus(depth, next.id); return; }
    if (event.key === 'ArrowRight' && current) { const item = list.find(entry => entry.id === current); if (item?.submenu?.length) { event.preventDefault(); event.stopPropagation(); open(depth, item); } }
    if ((event.key === 'ArrowLeft' || event.key === 'Escape') && depth > 0) {
      event.preventDefault(); event.stopPropagation(); const parent = path[depth - 1]!;
      setPath(previous => previous.slice(0, depth - 1)); focus(depth - 1, parent);
    } else if (event.key === 'Escape' && depth === 0) { setPath([]); }
  };
  const renderMenu = (entries: readonly NavigationMenuEntry[], depth: number, submenu = false): ReactNode =>
    <ul ref={depth === 0 ? rootRef : undefined} id={depth === 0 ? menuId : `${menuId}-submenu-${depth}`}
      role="menu" aria-label={depth === 0 ? label : entries[0]?.label ? `${label} submenu` : 'Submenu'}
      className={[styles.menu, submenu ? styles.submenu : '', className ?? ''].join(' ')}
      data-menu-depth={depth} onKeyDown={event => onKeyDown(event, depth)}>
      {entries.map(item => <li key={item.id} role="none" className={styles.menuEntry} data-menu-key={item.id}>
        <NavigationMenuItem {...item} active={active[depth] === item.id}
          expanded={path[depth] === item.id} submenuId={`${menuId}-submenu-${depth + 1}`}
          tabIndex={active[depth] === item.id || (!active[depth] && enabled(depth)[0]?.id === item.id) ? 0 : -1}
          onActivate={() => activate(item, depth)} onSubmenuOpen={() => open(depth, item)} />
        {path[depth] === item.id && item.submenu?.length ? renderMenu(item.submenu, depth + 1, true) : null}
      </li>)}
    </ul>;
  return renderMenu(items, 0);
}

export type BreadcrumbItem = { label: string; href?: string };
export type BreadcrumbsProps = { items: readonly BreadcrumbItem[]; variant?: 'default' | 'home' | 'collapsed'; label?: string; className?: string };

export function Breadcrumbs({ items, variant = 'default', label = 'Breadcrumb', className }: BreadcrumbsProps) {
  const [expanded, setExpanded] = useState(false);
  const collapse = variant === 'collapsed' && items.length > 2 && !expanded;
  return <nav aria-label={label} className={[styles.breadcrumbs, className ?? ''].join(' ')}><ol>
    {items.map((item, index) => {
      if (collapse && index > 0 && index < items.length - 1) return index === 1
        ? <li key="collapsed"><ChevronRight aria-hidden="true" /><button type="button" aria-label="Show hidden breadcrumb pages" onClick={() => setExpanded(true)}>…</button></li> : null;
      const current = index === items.length - 1;
      return <li key={`${item.label}-${index}`}>
        {index > 0 && <ChevronRight aria-hidden="true" />}
        {current ? <span aria-current="page">{item.label}</span> : <a href={item.href ?? '#'} aria-label={index === 0 && variant === 'home' ? item.label : undefined}>
          {index === 0 && variant === 'home' ? <Home aria-hidden="true" /> : item.label}</a>}
      </li>;
    })}
  </ol></nav>;
}

export type PaginationProps = { page: number; pageCount: number; onPageChange: (page: number) => void;
  size?: 'small' | 'medium' | 'large'; label?: string; className?: string };
export function Pagination({ page, pageCount, onPageChange, size = 'medium', label = 'Pagination', className }: PaginationProps) {
  const pages = Array.from(new Set([1, pageCount, page - 1, page, page + 1].filter(n => n >= 1 && n <= pageCount))).sort((a, b) => a - b);
  const button = (target: number, text: ReactNode, name: string, disabled = false) => <button type="button" aria-label={name}
    aria-current={target === page && name.startsWith('Page ') ? 'page' : undefined}
    disabled={disabled} onClick={() => onPageChange(target)}>{text}</button>;
  return <nav aria-label={label} className={[styles.pagination, styles[size], className ?? ''].join(' ')}>
    {button(page - 1, <ChevronLeft aria-hidden="true" />, 'Previous page', page <= 1)}
    {pages.map((number, index) => <span key={number} className={styles.pageSlot}>
      {index > 0 && number - pages[index - 1]! > 1 && <span className={styles.ellipsis} aria-hidden="true">…</span>}
      {button(number, number, `Page ${number}`)}
    </span>)}
    {button(page + 1, <ChevronRight aria-hidden="true" />, 'Next page', page >= pageCount)}
  </nav>;
}

export type StepperStep = { label: string; status?: 'completed' | 'current' | 'upcoming' | 'error' | 'disabled' };
export type StepperProps = { steps: readonly StepperStep[]; currentStep?: number; orientation?: 'horizontal' | 'vertical'; label?: string; className?: string };
export function Stepper({ steps, currentStep = 1, orientation = 'horizontal', label = 'Progress', className }: StepperProps) {
  return <nav aria-label={label} className={[styles.stepper, styles[orientation], className ?? ''].join(' ')}><ol>
    {steps.map((step, index) => { const state = step.status ?? (index + 1 < currentStep ? 'completed' : index + 1 === currentStep ? 'current' : 'upcoming');
      return <li key={`${step.label}-${index}`} data-state={state} aria-current={state === 'current' ? 'step' : undefined}>
        <span className={styles.stepMarker} aria-hidden="true">{state === 'completed' ? <Check size={18} /> : index + 1}</span>
        <span className={styles.stepLabel}>{step.label}<span className={styles.srOnly}> — {state}</span></span>
      </li>; })}
  </ol></nav>;
}

export type TabItem = { id: string; label: string; content: ReactNode; disabled?: boolean };
export type TabsProps = { items: readonly TabItem[]; value?: string; defaultValue?: string; onValueChange?: (id: string) => void;
  variant?: 'underline' | 'contained'; label?: string; className?: string };
export function Tabs({ items, value, defaultValue, onValueChange, variant = 'underline', label = 'Tabs', className }: TabsProps) {
  const generatedId = useId();
  const [internal, setInternal] = useState(defaultValue ?? items.find(item => !item.disabled)?.id);
  const selected = value ?? internal;
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});
  const select = (id: string) => { if (value === undefined) setInternal(id); onValueChange?.(id); };
  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, id: string) => {
    const available = items.filter(item => !item.disabled);
    const index = available.findIndex(item => item.id === id);
    const next = event.key === 'ArrowRight' ? available[(index + 1) % available.length]
      : event.key === 'ArrowLeft' ? available[(index - 1 + available.length) % available.length]
      : event.key === 'Home' ? available[0] : event.key === 'End' ? available.at(-1) : undefined;
    if (next) {
      event.preventDefault(); select(next.id);
      const target = refs.current[next.id];
      target?.focus();
      target?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    }
  };
  const active = items.find(item => item.id === selected && !item.disabled);
  return <div className={[styles.tabs, styles[variant], className ?? ''].join(' ')}>
    <div role="tablist" aria-label={label} className={styles.tabList}>
      {items.map(item => <button key={item.id} ref={node => { refs.current[item.id] = node; }} type="button" role="tab"
        id={`${generatedId}-tab-${item.id}`} aria-controls={`${generatedId}-panel-${item.id}`}
        aria-selected={active?.id === item.id} disabled={item.disabled} tabIndex={active?.id === item.id ? 0 : -1}
        onClick={() => select(item.id)} onKeyDown={event => onKeyDown(event, item.id)}>{item.label}</button>)}
    </div>
    {active && <div role="tabpanel" id={`${generatedId}-panel-${active.id}`} aria-labelledby={`${generatedId}-tab-${active.id}`}
      tabIndex={0} className={styles.tabPanel}>{active.content}</div>}
  </div>;
}
