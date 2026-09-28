import { useId } from 'react';
import type { ReactNode } from 'react';
import { X } from 'lucide-react';
import { Button } from '../Button/Button';
import { Divider } from '../Overlay/Divider';
import { ModalBase } from './ModalBase';
import styles from './Modal.module.css';

export type BottomSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  children?: ReactNode;
  size?: 'small' | 'medium' | 'large';
  confirmLabel?: string;
  onConfirm?: () => void;
  className?: string;
};

export function BottomSheet({ open, onOpenChange, title = 'Bottom Sheet', children, size = 'small',
  confirmLabel = 'Confirm', onConfirm, className }: BottomSheetProps) {
  const id = `pds-sheet-${useId()}`;
  return <ModalBase open={open} onOpenChange={onOpenChange} titleId={`${id}-title`}
    className={[styles.sheet, className].filter(Boolean).join(' ')}>
    <div className={styles.sheetSurface} data-size={size}>
      <div className={styles.sheetHandle} aria-hidden="true"><span /></div>
      <header className={styles.sheetHeader}>
        <h2 id={`${id}-title`}>{title}</h2>
        <button className={styles.close} type="button" aria-label="Close bottom sheet" onClick={() => onOpenChange(false)}><X size={20} aria-hidden="true" /></button>
      </header>
      <Divider className={styles.divider} />
      <div className={styles.sheetContent}>{children ?? <p>Bottom sheet content goes here. This area can contain lists, forms, or any other content.</p>}</div>
      <footer className={styles.sheetFooter}><Button size="medium" onClick={onConfirm}>{confirmLabel}</Button></footer>
    </div>
  </ModalBase>;
}
