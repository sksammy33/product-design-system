import { useId, useImperativeHandle, useRef, useState } from 'react';
import type { ChangeEvent, ComponentPropsWithRef, ReactNode } from 'react';
import { X } from 'lucide-react';
import { FieldLabel, FieldSupport, styles } from './Field';
import type { FieldCommon } from './Field';

export type InputType = 'text' | 'email' | 'password' | 'search' | 'number' | 'url' | 'tel';
type ClearAction = { clearable?: false; onClear?: () => void } | { clearable: true; onClear: () => void };
export type InputProps = Omit<ComponentPropsWithRef<'input'>, 'size' | 'children' | 'type'> & FieldCommon & ClearAction & {
  type?: InputType;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  prefix?: string;
  suffix?: string;
};

/** Figma Input action field. Native input attributes keep form and keyboard behavior. */
export function Input({ size = 'medium', label, helperText, validation, validationMessage, optional,
  leadingIcon, trailingIcon, prefix, suffix, clearable, onClear, type = 'text',
  value, defaultValue, onChange, disabled, readOnly, required, id, ref, className,
  'aria-describedby': describedBy, 'aria-invalid': invalid, ...inputProps }: InputProps) {
  const generatedId = useId();
  const fieldId = id ?? `pds-input-${generatedId}`;
  const supportId = `${fieldId}-support`;
  const prefixId = `${fieldId}-prefix`;
  const suffixId = `${fieldId}-suffix`;
  const inputRef = useRef<HTMLInputElement>(null);
  useImperativeHandle(ref, () => inputRef.current!, []);
  const [internalValue, setInternalValue] = useState(() => String(defaultValue ?? ''));
  const currentValue = value === undefined ? internalValue : String(value);
  const support = validation && validationMessage ? validationMessage : helperText;
  const description = [describedBy, prefix && prefixId, suffix && suffixId, support && supportId].filter(Boolean).join(' ') || undefined;
  const showClear = clearable && Boolean(currentValue) && !disabled && !readOnly;
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (value === undefined) setInternalValue(event.target.value);
    onChange?.(event);
  };
  const handleClear = () => {
    if (value === undefined) setInternalValue('');
    onClear?.();
    inputRef.current?.focus();
  };
  return <div className={[styles.root, className].filter(Boolean).join(' ')} data-kind="input" data-size={size}
    aria-disabled={disabled || undefined}
    data-validation={validation} data-filled={currentValue ? true : undefined}
    data-disabled={disabled || undefined} data-readonly={readOnly || undefined}>
    <FieldLabel id={fieldId} label={label} required={required} optional={optional} />
    <div className={styles.control}>
      {leadingIcon && <span className={[styles.adornment, styles.icon].join(' ')} aria-hidden="true">{leadingIcon}</span>}
      {prefix && <span id={prefixId} className={styles.adornment}>{prefix}</span>}
      <input {...inputProps} id={fieldId} ref={inputRef} className={styles.input}
        type={type} value={currentValue} onChange={handleChange} disabled={disabled} readOnly={readOnly}
        required={required} aria-describedby={description} aria-invalid={validation === 'error' ? true : invalid} />
      {suffix && <span id={suffixId} className={styles.adornment}>{suffix}</span>}
      {trailingIcon && <span className={[styles.adornment, styles.icon].join(' ')} aria-hidden="true">{trailingIcon}</span>}
      {showClear && <button type="button" className={styles.clear} aria-label={label ? `Clear ${label}` : 'Clear input'}
        onMouseDown={event => event.preventDefault()} onClick={handleClear}><X aria-hidden="true" focusable="false" /></button>}
    </div>
    <FieldSupport id={supportId} text={support} validation={validation} withIcon />
  </div>;
}
