import { useLayoutEffect, useRef, useState } from 'react';
import type { CSSProperties, ReactNode, RefObject } from 'react';
import { createPortal } from 'react-dom';

export type LayerPosition = 'top' | 'bottom';

/** Portals inherit the nearest explicit token mode while remaining outside clipped containers. */
export function OverlayLayer({ anchor, open, children, placement = 'bottom', align = 'start', point,
  gap = 4, className, surfaceRef, landmarkLabel }: {
  anchor: RefObject<HTMLElement | null>;
  open: boolean;
  children: ReactNode;
  placement?: LayerPosition;
  align?: 'start' | 'center';
  point?: { x: number; y: number } | undefined;
  gap?: number;
  className?: string | undefined;
  surfaceRef?: RefObject<HTMLDivElement | null>;
  landmarkLabel: string;
}) {
  const ownRef = useRef<HTMLDivElement>(null);
  const ref = surfaceRef ?? ownRef;
  // Keep the surface focusable during its first layout pass; it moves before paint.
  const [style, setStyle] = useState<CSSProperties>({ position: 'fixed', top: -10000, left: -10000 });
  const theme = anchor.current?.closest('[data-theme]')?.getAttribute('data-theme') ?? undefined;

  useLayoutEffect(() => {
    if (!open) return;
    const update = () => {
      const surface = ref.current;
      const trigger = anchor.current;
      if (!surface || (!trigger && !point)) return;
      const rect = trigger?.getBoundingClientRect();
      const width = surface.offsetWidth;
      const height = surface.offsetHeight;
      const margin = 8;
      const idealX = point?.x ?? (align === 'center' && rect ? rect.left + (rect.width - width) / 2 : rect?.left ?? 0);
      const left = Math.max(margin, Math.min(idealX, window.innerWidth - width - margin));
      const below = point?.y ?? (rect?.bottom ?? 0);
      const above = rect ? rect.top - height - gap : below;
      const top = placement === 'top' && above >= margin ? above :
        below + height + gap <= window.innerHeight - margin ? below + gap :
        Math.max(margin, rect ? rect.top - height - gap : below - height);
      setStyle({ position: 'fixed', left, top, visibility: 'visible' });
    };
    update();
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, true);
    return () => { window.removeEventListener('resize', update); window.removeEventListener('scroll', update, true); };
  }, [anchor, align, gap, open, placement, point?.x, point?.y, ref]);

  if (!open) return null;
  return createPortal(<div ref={ref} role="region" aria-label={landmarkLabel}
    className={['pds-scope', className].filter(Boolean).join(' ')} data-theme={theme} style={style}>
    {children}
  </div>, document.body);
}
