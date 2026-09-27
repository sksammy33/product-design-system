import { useEffect, useId, useImperativeHandle, useRef } from 'react';
import type { ComponentPropsWithRef } from 'react';
import { Check, Minus } from 'lucide-react';
import { SelectionText } from '../../internal/SelectionText';
import styles from '../../internal/Selection.module.css';

export type CheckboxProps = Omit<ComponentPropsWithRef<'input'>, 'type' | 'size' | 'children' | 'readOnly' | 'aria-checked'> & {
  label: string;
  helperText?: string;
  error?: boolean;
  errorText?: string;
  indeterminate?: boolean;
};

/** Native checkbox; indeterminate is a DOM property rather than an HTML attribute. */
export function Checkbox({ label, helperText, error = false, errorText, indeterminate = false,
  id, ref, className, disabled, 'aria-describedby': describedBy, 'aria-invalid': invalid, ...props }: CheckboxProps) {
  const generatedId = useId();
  const inputId = id ?? `pds-checkbox-${generatedId}`;
  const labelId = `${inputId}-label`;
  const supportId = `${inputId}-support`;
  const support = error && errorText ? errorText : helperText;
  const description = [describedBy, support && supportId].filter(Boolean).join(' ') || undefined;
  const inputRef = useRef<HTMLInputElement>(null);
  useImperativeHandle(ref, () => inputRef.current!, []);
  useEffect(() => { if (inputRef.current) inputRef.current.indeterminate = indeterminate; }, [indeterminate]);

  return <label className={[styles.root, className].filter(Boolean).join(' ')} data-kind="checkbox"
    data-disabled={disabled || undefined} data-error={error || undefined}>
    <span className={styles.hit}>
      <input {...props} id={inputId} ref={inputRef} className={styles.native} type="checkbox" disabled={disabled}
        aria-labelledby={labelId} aria-describedby={description} aria-invalid={error || invalid || undefined} />
      <span className={styles.indicator} aria-hidden="true">
        <Check className={styles.check} focusable="false" />
        <Minus className={styles.minus} focusable="false" />
      </span>
    </span>
    <SelectionText label={label} labelId={labelId} supportId={supportId} support={support} />
  </label>;
}
