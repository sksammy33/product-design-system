import { useId } from 'react';
import { Info, LoaderCircle, TriangleAlert } from 'lucide-react';
import { Button } from '../Button/Button';
import { Divider } from '../Overlay/Divider';
import { ModalBase } from './ModalBase';
import type { DialogState } from './Dialog';
import styles from './Modal.module.css';

export type ConfirmationDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  state?: DialogState;
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  className?: string;
};

export function ConfirmationDialog({ open, onOpenChange, state = 'default', title, description, confirmLabel,
  cancelLabel = 'Cancel', onConfirm, onCancel, className }: ConfirmationDialogProps) {
  const id = `pds-confirmation-${useId()}`;
  const loading = state === 'loading';
  const destructive = state === 'destructive';
  const heading = title ?? (loading ? 'Processing' : destructive ? 'Delete Permanently' : 'Confirm Action');
  const detail = description ?? (loading ? 'Please wait while we process your request.' : destructive
    ? 'This action cannot be undone. All associated data will be permanently removed.'
    : 'Are you sure you want to proceed with this action?');
  const actionLabel = confirmLabel ?? (destructive ? 'Delete' : 'Confirm');
  const close = () => onOpenChange(false);
  return <ModalBase open={open} onOpenChange={onOpenChange} titleId={`${id}-title`} descriptionId={`${id}-description`}
    dismissible={!loading} className={[styles.confirmation, className].filter(Boolean).join(' ')}>
    <div className={styles.confirmationSurface} data-state={state}>
      <div className={styles.confirmationContent}>
        <span className={styles.confirmationIcon} aria-hidden="true">
          {loading ? <LoaderCircle size={20} /> : destructive ? <TriangleAlert size={20} /> : <Info size={20} />}
        </span>
        <div className={styles.confirmationText}>
          <h2 id={`${id}-title`}>{heading}</h2><p id={`${id}-description`}>{detail}</p>
        </div>
      </div>
      <Divider className={styles.divider} />
      <footer className={styles.confirmationFooter}>
        <Button size="medium" variant="secondary" disabled={loading} onClick={() => { onCancel?.(); close(); }}>{cancelLabel}</Button>
        <Button size="medium" variant={destructive ? 'destructive' : 'primary'} loading={loading}
          aria-label={loading ? `${actionLabel} in progress` : undefined}
          onClick={() => { if (!loading) onConfirm?.(); }}>{actionLabel}</Button>
      </footer>
    </div>
  </ModalBase>;
}
