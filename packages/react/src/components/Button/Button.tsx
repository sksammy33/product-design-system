import type { ComponentPropsWithRef, ReactElement, ReactNode } from 'react';
import { LoaderCircle } from 'lucide-react';
import styles from './Button.module.css';

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'ghost' | 'destructive' | 'destructive-secondary' | 'link' | 'destructive-ghost' | 'destructive-link';
export type ButtonSize = 'xs' | 'small' | 'medium' | 'large' | 'xl';
type Selection =
  | { variant?: Exclude<ButtonVariant, 'link' | 'destructive-link'>; selected?: boolean }
  | { variant?: ButtonVariant; selected?: never };
type Content =
  | { iconOnly: true; children: ReactElement; 'aria-label': string; leadingIcon?: never; trailingIcon?: never }
  | { iconOnly?: false; children: ReactNode; leadingIcon?: ReactNode; trailingIcon?: ReactNode };
export type ButtonProps = Omit<ComponentPropsWithRef<'button'>, 'children' | 'aria-pressed'> & Selection & Content & {
  size?: ButtonSize;
  loading?: boolean;
};

/** Native action button. Use an anchor for navigation, even for link-like appearance. */
export function Button({ variant = 'primary', size = 'small', selected, iconOnly = false,
  children, leadingIcon, trailingIcon, disabled = false, loading = false,
  type = 'button', className, ...props }: ButtonProps) {
  const selectable = variant !== 'link' && variant !== 'destructive-link';
  return (
    <button {...props} type={type} disabled={disabled || loading}
      aria-busy={loading || undefined}
      aria-pressed={selectable ? selected : undefined}
      className={[styles.button, className].filter(Boolean).join(' ')}
      data-variant={variant} data-size={size} data-loading={loading || undefined}
      data-disabled={disabled || undefined} data-selected={selectable && selected || undefined}>
      <span className={styles.content}>
        {iconOnly ? <span className={styles.icon} aria-hidden="true">{children}</span> : <>
          {leadingIcon && <span className={styles.icon} aria-hidden="true">{leadingIcon}</span>}
          <span className={styles.label}>{children}</span>
          {trailingIcon && <span className={styles.icon} aria-hidden="true">{trailingIcon}</span>}
        </>}
      </span>
      {loading && <span className={styles.loader} aria-hidden="true"><LoaderCircle focusable="false" /></span>}
    </button>
  );
}
