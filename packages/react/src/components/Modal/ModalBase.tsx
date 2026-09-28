import { useLayoutEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import styles from './Modal.module.css';

export type ModalBaseProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  titleId: string;
  descriptionId?: string | undefined;
  className: string;
  dismissible?: boolean;
  children: ReactNode;
};

/** showModal provides native focus containment and makes the document behind it inert. */
export function ModalBase({ open, onOpenChange, titleId, descriptionId, className,
  dismissible = true, children }: ModalBaseProps) {
  const dialog = useRef<HTMLDialogElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const onChange = useRef(onOpenChange);
  onChange.current = onOpenChange;
  useLayoutEffect(() => {
    const node = dialog.current;
    if (!node) return;
    if (open && !node.open) {
      returnFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      node.showModal();
    } else if (!open && node.open) {
      node.close();
      queueMicrotask(() => returnFocus.current?.isConnected && returnFocus.current.focus());
    }
  }, [open]);
  useLayoutEffect(() => () => {
    if (dialog.current?.open) dialog.current.close();
    if (returnFocus.current?.isConnected) returnFocus.current.focus();
  }, []);
  if (typeof document === 'undefined') return null;
  const theme = (document.activeElement as Element | null)?.closest('[data-theme]')?.getAttribute('data-theme')
    ?? document.documentElement.getAttribute('data-theme') ?? undefined;
  return createPortal(<dialog ref={dialog} className={[styles.modal, className].join(' ')}
    data-theme={theme} aria-labelledby={titleId} aria-describedby={descriptionId}
    onCancel={event => { event.preventDefault(); if (dismissible) onChange.current(false); }}
    onClose={() => { if (open) onChange.current(false); }}>
    {children}
  </dialog>, document.body);
}
