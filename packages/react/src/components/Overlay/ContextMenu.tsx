import { useCallback, useId, useRef, useState } from 'react';
import type { KeyboardEvent, MouseEvent, ReactNode } from 'react';
import type { MenuEntry } from './Menu';
import { Menu } from './Menu';
import { OverlayLayer } from './OverlayLayer';
import { useOverlayDismiss } from './useOverlayDismiss';
import styles from './Overlay.module.css';

export type ContextMenuProps = {
  label?: string;
  children: ReactNode;
  items: readonly MenuEntry[];
  className?: string;
};
/** Pointer context menu and Shift+F10/Menu-key trigger with a side submenu. */
export function ContextMenu({ label = 'Context menu target', children, items, className }: ContextMenuProps) {
  const id = `pds-context-menu-${useId()}`;
  const anchor = useRef<HTMLDivElement>(null);
  const surface = useRef<HTMLDivElement>(null);
  const [point, setPoint] = useState<{ x: number; y: number }>();
  const [open, setOpen] = useState(false);
  const close = useCallback((restore = true) => { setOpen(false); if (restore) queueMicrotask(() => anchor.current?.focus()); }, []);
  useOverlayDismiss(open, anchor, surface, () => close(false));
  const context = (event: MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    anchor.current?.focus();
    setPoint({ x: event.clientX, y: event.clientY });
    setOpen(true);
  };
  const keyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ContextMenu' || (event.shiftKey && event.key === 'F10')) {
      event.preventDefault();
      const rect = anchor.current?.getBoundingClientRect();
      setPoint({ x: rect?.left ?? 0, y: rect?.bottom ?? 0 });
      setOpen(true);
    }
  };
  return <>
    <div ref={anchor} tabIndex={0} role="group" aria-label={label} aria-haspopup="menu" aria-controls={open ? id : undefined}
      aria-expanded={open} className={[styles.contextTarget, className].filter(Boolean).join(' ')}
      onContextMenu={context} onKeyDown={keyDown}>{children}</div>
    <OverlayLayer anchor={anchor} surfaceRef={surface} open={open} point={point} gap={0} landmarkLabel={`${label} menu`}>
      <Menu id={id} variant="context" label={label} items={items} onClose={() => close()} onAction={() => close()} />
    </OverlayLayer>
  </>;
}
