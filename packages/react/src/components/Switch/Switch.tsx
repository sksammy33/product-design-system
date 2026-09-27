import { useId } from 'react';
import type { ComponentPropsWithRef } from 'react';
import { SelectionText } from '../../internal/SelectionText';
import styles from '../../internal/Selection.module.css';

export type SwitchSize = 'small' | 'medium' | 'large';
export type SwitchProps = Omit<ComponentPropsWithRef<'input'>, 'type' | 'size' | 'children' | 'readOnly' | 'aria-checked'> & {
  label: string;
  size?: SwitchSize;
  showLabel?: boolean;
};

/** Native checkbox participation with switch semantics and an explicit label. */
export function Switch({ label, size = 'small', showLabel = true, id, ref, className, disabled, ...props }: SwitchProps) {
  const generatedId = useId();
  const inputId = id ?? `pds-switch-${generatedId}`;
  const labelId = `${inputId}-label`;

  return <label className={[styles.root, className].filter(Boolean).join(' ')} data-kind="switch"
    data-size={size} data-disabled={disabled || undefined}>
    <span className={styles.switchHit}>
      <input {...props} id={inputId} ref={ref} className={styles.native} type="checkbox" role="switch"
        disabled={disabled} aria-labelledby={labelId} />
      <span className={styles.track} aria-hidden="true"><span className={styles.thumb} /></span>
    </span>
    <SelectionText label={label} labelId={labelId} supportId={`${inputId}-support`} hidden={!showLabel} />
  </label>;
}
