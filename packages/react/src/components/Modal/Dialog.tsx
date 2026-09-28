import { useId } from 'react';
import type { ReactNode } from 'react';
import { LoaderCircle, X } from 'lucide-react';
import { Button } from '../Button/Button';
import { Divider } from '../Overlay/Divider';
import { ModalBase } from './ModalBase';
import styles from './Modal.module.css';

export type DialogSize = 'small' | 'medium' | 'large';
export type DialogState = 'default' | 'loading' | 'destructive';
export type DialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children?: ReactNode;
  size?: DialogSize;
  state?: DialogState;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  className?: string;
};

/** The nine approved Dialog size × state variants. */
export function Dialog({ open, onOpenChange, title, description, children, size = 'medium', state = 'default',
  confirmLabel, cancelLabel = 'Cancel', onConfirm, onCancel, className }: DialogProps) {
  const id = `pds-dialog-${useId()}`;
  const loading = state === 'loading';
  const destructive = state === 'destructive';
  const actionLabel = confirmLabel ?? (destructive ? 'Delete' : 'Confirm');
  const close = () => onOpenChange(false);
  return <ModalBase open={open} onOpenChange={onOpenChange} titleId={`${id}-title`}
    descriptionId={description ? `${id}-description` : undefined} dismissible={!loading}
    className={[styles.dialog, className].filter(Boolean).join(' ')}>
    <div className={styles.dialogSurface} data-size={size} data-state={state}>
      <header className={styles.header}>
        <div className={styles.heading}>
          <h2 id={`${id}-title`}>{title}</h2>
          {description && <p id={`${id}-description`}>{description}</p>}
        </div>
        <button className={styles.close} type="button" aria-label="Close dialog" disabled={loading} onClick={close}><X size={20} aria-hidden="true" /></button>
      </header>
      <Divider className={styles.divider} />
      <div className={styles.dialogContent} aria-busy={loading || undefined}>
        {loading ? <div className={styles.loadingContent} role="status"><LoaderCircle size={24} aria-hidden="true" /><span>Loading content...</span></div>
          : children ?? <p>{destructive ? 'Are you sure you want to delete this item? This action is permanent and cannot be reversed.'
            : 'Dialog content goes here. You can place any content within this area including forms, text, or other components.'}</p>}
      </div>
      <Divider className={styles.divider} />
      <footer className={styles.footer}>
        <Button size={size === 'small' ? 'small' : 'medium'} variant="secondary" disabled={loading}
          onClick={() => { onCancel?.(); close(); }}>{cancelLabel}</Button>
        <Button size={size === 'small' ? 'small' : 'medium'} variant={destructive ? 'destructive' : 'primary'}
          loading={loading} aria-label={loading ? `${actionLabel} in progress` : undefined}
          onClick={() => { if (!loading) onConfirm?.(); }}>{actionLabel}</Button>
      </footer>
    </div>
  </ModalBase>;
}
