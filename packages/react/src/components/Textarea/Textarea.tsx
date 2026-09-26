import { useId } from 'react';
import type { ComponentPropsWithRef } from 'react';
import { FieldLabel, FieldSupport, styles } from '../Input/Field';
import type { FieldCommon } from '../Input/Field';

export type TextareaProps = Omit<ComponentPropsWithRef<'textarea'>, 'children'> & FieldCommon;

/** Native multiline form field with Figma Textarea sizing and semantic feedback. */
export function Textarea({ size = 'medium', label, helperText, validation, validationMessage, optional,
  disabled, readOnly, required, id, ref, className,
  'aria-describedby': describedBy, 'aria-invalid': invalid, ...textareaProps }: TextareaProps) {
  const generatedId = useId();
  const fieldId = id ?? `pds-textarea-${generatedId}`;
  const supportId = `${fieldId}-support`;
  const support = validation && validationMessage ? validationMessage : helperText;
  const description = [describedBy, support && supportId].filter(Boolean).join(' ') || undefined;
  return <div className={[styles.root, className].filter(Boolean).join(' ')} data-kind="textarea" data-size={size}
    aria-disabled={disabled || undefined}
    data-validation={validation} data-disabled={disabled || undefined} data-readonly={readOnly || undefined}>
    <FieldLabel id={fieldId} label={label} required={required} optional={optional} />
    <div className={styles.control}>
      <textarea {...textareaProps} id={fieldId} ref={ref} className={styles.textarea}
        disabled={disabled} readOnly={readOnly} required={required} aria-describedby={description}
        aria-invalid={validation === 'error' ? true : invalid} />
    </div>
    <FieldSupport id={supportId} text={support} validation={validation} />
  </div>;
}
