import { useCallback, useId, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { X } from 'lucide-react';
import { Button } from '../Button/Button';
import { OverlayLayer } from './OverlayLayer';
import { useOverlayDismiss } from './useOverlayDismiss';
import { Divider } from './Divider';
import arrow from './assets/popover-top.svg';
import styles from './Overlay.module.css';

export type PopoverProps = {
  triggerLabel: string;
  title: string;
  description?: string;
  children: ReactNode;
  onApply?: () => void;
  onCancel?: () => void;
  showFooter?: boolean;
  className?: string;
};
/** Nonmodal dialog anchored above its trigger, matching the approved top variant. */
export function Popover({ triggerLabel, title, description, children, onApply, onCancel, showFooter = true, className }: PopoverProps) {
  const id = `pds-popover-${useId()}`;
  const anchor = useRef<HTMLButtonElement>(null);
  const surface = useRef<HTMLDivElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const close = useCallback((restore = true) => { setOpen(false); if (restore) queueMicrotask(() => anchor.current?.focus()); }, []);
  useOverlayDismiss(open, anchor, surface, () => close(false));
  return <>
    <Button ref={anchor} size="small" variant="secondary" aria-haspopup="dialog" aria-expanded={open} aria-controls={open ? id : undefined}
      onClick={() => { setOpen(current => !current); if (!open) queueMicrotask(() => closeButton.current?.focus()); }}>
      {triggerLabel}
    </Button>
    <OverlayLayer anchor={anchor} surfaceRef={surface} open={open} placement="top" align="center" gap={6} className={className} landmarkLabel={`${title} popover`}>
      <div className={styles.popoverPosition}>
        <div id={id} role="dialog" aria-modal="false" aria-labelledby={`${id}-title`} aria-describedby={description ? `${id}-description` : undefined}
          className={styles.popover} onKeyDown={event => { if (event.key === 'Escape') { event.stopPropagation(); close(); } }}>
          <div className={styles.popoverHeader}>
            <div className={styles.popoverHeading}><h2 id={`${id}-title`}>{title}</h2>
              {description && <p id={`${id}-description`}>{description}</p>}</div>
            <button ref={closeButton} type="button" className={styles.popoverClose} aria-label="Close popover" onClick={() => close()}><X size={16} aria-hidden="true" /></button>
          </div>
          <Divider className={styles.flatDivider} />
          <div className={styles.popoverContent}>{children}</div>
          {showFooter && <><Divider className={styles.flatDivider} />
            <div className={styles.popoverFooter}>
              <Button size="small" variant="secondary" onClick={() => { onCancel?.(); close(); }}>Cancel</Button>
              <Button size="small" onClick={() => { onApply?.(); close(); }}>Apply</Button>
            </div></>}
        </div>
        <img className={styles.popoverArrow} src={arrow} alt="" />
      </div>
    </OverlayLayer>
  </>;
}
