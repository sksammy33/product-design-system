import { useId, useRef } from 'react';
import type { ComponentPropsWithoutRef } from 'react';
import { Checkbox } from '../Checkbox/Checkbox';
import { Radio } from '../Radio/Radio';
import { useFormValue } from '../../internal/useFormValue';
import styles from './SelectionGroup.module.css';

export type SelectionOption = { value: string; label: string; helperText?: string; disabled?: boolean };
type Common = Omit<ComponentPropsWithoutRef<'fieldset'>, 'onChange' | 'defaultValue' | 'children'> & {
  label: string;
  options: readonly SelectionOption[];
  layout?: 'vertical' | 'horizontal';
  helperText?: string;
  error?: boolean;
  errorText?: string;
};
export type CheckboxGroupProps = Common & { value?: readonly string[]; defaultValue?: readonly string[]; onValueChange?: (value: string[]) => void };
export type RadioGroupProps = Common & { value?: string; defaultValue?: string; onValueChange?: (value: string) => void; required?: boolean };
const empty: readonly string[] = [];

export function CheckboxGroup({ value, defaultValue = empty, onValueChange, ...props }: CheckboxGroupProps) {
  const owner = useRef<HTMLFieldSetElement>(null);
  const [selected, setSelected] = useFormValue<readonly string[]>(value, defaultValue, next => onValueChange?.([...next]), owner, props.form);
  return <Group {...props} owner={owner} renderOption={(option, name, description) => <Checkbox {...option}
    key={option.value} name={name} form={props.form} checked={selected.includes(option.value)} error={props.error ?? false}
    disabled={props.disabled || option.disabled} aria-describedby={description}
    onChange={event => setSelected(event.target.checked ? [...selected, option.value] : selected.filter(v => v !== option.value))} />} />;
}
export function RadioGroup({ value, defaultValue = '', onValueChange, required, ...props }: RadioGroupProps) {
  const owner = useRef<HTMLFieldSetElement>(null);
  const [selected, setSelected] = useFormValue(value, defaultValue, onValueChange, owner, props.form);
  return <Group {...props} owner={owner} renderOption={(option, name, description) => <Radio {...option}
    key={option.value} name={name} form={props.form} checked={selected === option.value} required={required} error={props.error ?? false}
    disabled={props.disabled || option.disabled} aria-describedby={description}
    onChange={() => setSelected(option.value)} />} />;
}

import type { ReactNode, RefObject } from 'react';
function Group({ label, options, layout = 'vertical', helperText, error, errorText, className, name, id, owner,
  'aria-describedby': describedBy, renderOption, ...props }: Common & {
  owner: RefObject<HTMLFieldSetElement | null>;
  renderOption: (option: SelectionOption, name: string, description: string | undefined) => ReactNode;
}) {
  const generatedId = useId();
  const groupId = id ?? `pds-group-${generatedId}`;
  const support = error && errorText ? errorText : helperText;
  const description = [describedBy, support && `${groupId}-support`].filter(Boolean).join(' ') || undefined;
  return <fieldset {...props} ref={owner} id={groupId} name={name} className={[styles.group, className].filter(Boolean).join(' ')}
    aria-describedby={description} aria-invalid={error || undefined} data-error={error || undefined}>
    <legend className={styles.legend}>{label}</legend>
    <div className={styles.options} data-layout={layout}>{options.map(option => renderOption(option, name ?? groupId, description))}</div>
    {support && <p id={`${groupId}-support`} className={styles.support}>{support}</p>}
  </fieldset>;
}
