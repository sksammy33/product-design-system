import { useEffect } from 'react';
import type { RefObject } from 'react';

export function useOverlayDismiss(open: boolean, anchor: RefObject<HTMLElement | null>, surface: RefObject<HTMLElement | null>,
  dismiss: () => void) {
  useEffect(() => {
    if (!open) return;
    const inside = (target: EventTarget | null) => target instanceof Node &&
      (anchor.current?.contains(target) || surface.current?.contains(target));
    const pointer = (event: PointerEvent) => { if (!inside(event.target)) dismiss(); };
    const focus = (event: FocusEvent) => { if (!inside(event.target)) dismiss(); };
    document.addEventListener('pointerdown', pointer);
    document.addEventListener('focusin', focus);
    return () => { document.removeEventListener('pointerdown', pointer); document.removeEventListener('focusin', focus); };
  }, [open, anchor, surface, dismiss]);
}
