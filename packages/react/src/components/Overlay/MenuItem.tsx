import type { KeyboardEvent, ReactNode } from 'react';
import { ChevronRight, Settings } from 'lucide-react';
import styles from './Overlay.module.css';

export type MenuItemProps = {
  label: string;
  icon?: ReactNode;
  shortcut?: string | undefined;
  selected?: boolean | undefined;
  disabled?: boolean | undefined;
  destructive?: boolean | undefined;
  submenu?: boolean;
  expanded?: boolean;
  controls?: string | undefined;
  onSelect?: () => void;
  onOpenSubmenu?: () => void;
  className?: string;
  id?: string;
  inMenu?: boolean;
  children?: ReactNode;
};
/** Action row from Overlay Menu Item 160:5910, with native focus and ARIA menu semantics. */
export function MenuItem({ label, icon, shortcut, selected, disabled, destructive, submenu, expanded,
  controls, onSelect, onOpenSubmenu, className, id, inMenu = false, children }: MenuItemProps) {
  const activate = () => {
    if (disabled) return;
    if (submenu) onOpenSubmenu?.(); else onSelect?.();
  };
  const keyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (inMenu || disabled) return;
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); activate(); }
    if (submenu && event.key === 'ArrowRight') { event.preventDefault(); onOpenSubmenu?.(); }
  };
  return <div className={[styles.menuRow, className].filter(Boolean).join(' ')} data-menu-row>
    <div id={id} role="menuitem" tabIndex={disabled ? -1 : inMenu ? -1 : 0} aria-disabled={disabled || undefined}
      aria-haspopup={submenu ? 'menu' : undefined} aria-expanded={submenu ? expanded || false : undefined}
      aria-controls={submenu && expanded ? controls : undefined}
      className={styles.menuItem} data-selected={selected || undefined} data-destructive={destructive || undefined}
      onClick={activate} onKeyDown={keyDown} onPointerDown={event => { if (!disabled) event.currentTarget.focus(); }}>
      {icon !== null && <span className={styles.menuIcon} aria-hidden="true">{icon ?? <Settings size={16} />}</span>}
      <span className={styles.menuLabel}>{label}</span>
      {shortcut && <span className={styles.menuShortcut} aria-hidden="true">{shortcut}</span>}
      {submenu && <ChevronRight className={styles.submenuChevron} size={16} aria-hidden="true" />}
    </div>
    {children}
  </div>;
}
