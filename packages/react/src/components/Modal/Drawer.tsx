import { useId } from 'react';
import type { ReactNode } from 'react';
import { X } from 'lucide-react';
import { Button } from '../Button/Button';
import { Divider } from '../Overlay/Divider';
import { ModalBase } from './ModalBase';
import styles from './Modal.module.css';

export type DrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children?: ReactNode;
  size?: 'small' | 'medium' | 'large';
  direction?: 'left' | 'right';
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  className?: string;
};

export function Drawer({ open, onOpenChange, title, description, children, size = 'small', direction = 'left',
  confirmLabel = 'Save', cancelLabel = 'Cancel', onConfirm, onCancel, className }: DrawerProps) {
  const id = `pds-drawer-${useId()}`;
  const close = () => onOpenChange(false);
  return <ModalBase open={open} onOpenChange={onOpenChange} titleId={`${id}-title`}
    descriptionId={description ? `${id}-description` : undefined}
    className={[styles.drawer, className].filter(Boolean).join(' ')}>
    <div className={styles.drawerSurface} data-size={size} data-direction={direction}>
      <header className={styles.header}>
        <div className={styles.heading}><h2 id={`${id}-title`}>{title}</h2>
          {description && <p id={`${id}-description`}>{description}</p>}</div>
        <button className={styles.close} type="button" aria-label="Close drawer" onClick={close}><X size={20} aria-hidden="true" /></button>
      </header>
      <Divider className={styles.divider} />
      <div className={styles.drawerContent}>{children ?? <p>Drawer content goes here. This area scrolls when content exceeds the available height.</p>}</div>
      <Divider className={styles.divider} />
      <footer className={styles.footer}>
        <Button size="medium" variant="secondary" onClick={() => { onCancel?.(); close(); }}>{cancelLabel}</Button>
        <Button size="medium" onClick={onConfirm}>{confirmLabel}</Button>
      </footer>
    </div>
  </ModalBase>;
}
