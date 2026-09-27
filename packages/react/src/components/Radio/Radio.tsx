import { useId } from 'react';
import type { ComponentPropsWithRef } from 'react';
import { SelectionText } from '../../internal/SelectionText';
import styles from '../../internal/Selection.module.css';

export type RadioProps = Omit<ComponentPropsWithRef<'input'>, 'type' | 'size' | 'children' | 'readOnly' | 'aria-checked'> & {
  name: string;
  label: string;
  helperText?: string;
  error?: boolean;
  errorText?: string;
};

/** Radios with the same name use the browser's native group and arrow-key behavior. */
export function Radio({ label, helperText, error = false, errorText, name, id, ref, className,
  disabled, 'aria-describedby': describedBy, 'aria-invalid': invalid, ...props }: RadioProps) {
  const generatedId = useId();
  const inputId = id ?? `pds-radio-${generatedId}`;
  const labelId = `${inputId}-label`;
  const supportId = `${inputId}-support`;
  const support = error && errorText ? errorText : helperText;
  const description = [describedBy, support && supportId].filter(Boolean).join(' ') || undefined;

  return <label className={[styles.root, className].filter(Boolean).join(' ')} data-kind="radio"
    data-disabled={disabled || undefined} data-error={error || undefined}>
    <span className={styles.hit}>
      <input {...props} id={inputId} ref={ref} className={styles.native} type="radio" name={name} disabled={disabled}
        aria-labelledby={labelId} aria-describedby={description} aria-invalid={error || invalid || undefined} />
      <span className={styles.indicator} aria-hidden="true"><span className={styles.dot} /></span>
    </span>
    <SelectionText label={label} labelId={labelId} supportId={supportId} support={support} />
  </label>;
}
