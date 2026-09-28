import { useCallback, useId, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { MenuEntry } from './Menu';
import { Menu } from './Menu';
import { OverlayLayer } from './OverlayLayer';
import { useOverlayDismiss } from './useOverlayDismiss';
import styles from './Overlay.module.css';

export type DropdownProps = {
  label?: string;
  items: readonly MenuEntry[];
  onSelect?: (id: string) => void;
  disabled?: boolean;
  className?: string;
};
/** Menu-backed 40px Dropdown trigger from 160:9457. */
export function Dropdown({ label = 'Select option', items, onSelect, disabled, className }: DropdownProps) {
  const id = `pds-dropdown-${useId()}`;
  const anchor = useRef<HTMLButtonElement>(null);
  const surface = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [selection, setSelection] = useState<string | null>(null);
  const close = useCallback((restore = true) => { setOpen(false); if (restore) queueMicrotask(() => anchor.current?.focus()); }, []);
  useOverlayDismiss(open, anchor, surface, () => close(false));
  const chosen = (id: string) => {
    const find = (entries: readonly MenuEntry[]): string | undefined => {
      for (const entry of entries) if (entry.type === undefined || entry.type === 'item') {
        if (entry.id === id) return entry.label;
        const child = entry.submenu && find(entry.submenu);
        if (child) return child;
      }
    };
    setSelection(find(items) ?? null); onSelect?.(id); close();
  };
  return <>
    <button ref={anchor} type="button" id={`${id}-trigger`} className={[styles.dropdownTrigger, className].filter(Boolean).join(' ')}
      data-open={open || undefined} disabled={disabled} aria-haspopup="menu" aria-controls={open ? id : undefined}
      aria-expanded={open} onClick={() => setOpen(current => !current)}
      onKeyDown={event => { if (!open && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) { event.preventDefault(); setOpen(true); } }}>
      <span data-selected={selection ? true : undefined}>{selection ?? label}</span><ChevronDown size={16} aria-hidden="true" />
    </button>
    <OverlayLayer anchor={anchor} surfaceRef={surface} open={open} gap={4} className={styles.dropdownLayer} landmarkLabel={`${selection ?? label} menu`}>
      <Menu id={id} variant="dropdown" labelledBy={`${id}-trigger`} items={items} onClose={() => close()} onAction={chosen} />
    </OverlayLayer>
  </>;
}
