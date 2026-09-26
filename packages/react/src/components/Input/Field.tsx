import type { ReactNode } from 'react';
import { CircleAlert, CircleCheck, TriangleAlert } from 'lucide-react';
import styles from './Field.module.css';

export type FieldSize = 'small' | 'medium' | 'large';
export type FieldValidation = 'error' | 'warning' | 'success';

export type FieldCommon = {
  size?: FieldSize;
  label?: string;
  helperText?: string;
  validation?: FieldValidation;
  validationMessage?: string;
  optional?: boolean;
};

export { styles };

export function FieldLabel({ id, label, required, optional }: { id: string; label?: string | undefined; required?: boolean | undefined; optional?: boolean | undefined }) {
  if (!label) return null;
  return <div className={styles.labelRow}>
    <label htmlFor={id} className={styles.label}>{label}</label>
    {required && <span className={styles.required} aria-hidden="true">*</span>}
    {optional && !required && <span className={styles.optional}>(Optional)</span>}
  </div>;
}

const icons = { error: CircleAlert, warning: TriangleAlert, success: CircleCheck };
export function FieldSupport({ id, text, validation, withIcon = false }: {
  id: string; text?: ReactNode; validation?: FieldValidation | undefined; withIcon?: boolean;
}) {
  if (!text) return null;
  const Icon = validation ? icons[validation] : null;
  return <div id={id} className={styles.supporting}>
    {withIcon && Icon && <Icon aria-hidden="true" focusable="false" className={styles.validationIcon} />}
    <span>{text}</span>
  </div>;
}
