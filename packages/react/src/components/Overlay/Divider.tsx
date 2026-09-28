import type { ComponentPropsWithoutRef } from 'react';
import styles from './Overlay.module.css';

/** Eight-pixel separator from Overlay Divider 160:5866. */
export type DividerProps = ComponentPropsWithoutRef<'div'>;
export function Divider({ className, ...props }: DividerProps) {
  return <div {...props} role="separator" aria-orientation="horizontal" className={[styles.divider, className].filter(Boolean).join(' ')}>
    <span className={styles.dividerLine} />
  </div>;
}
