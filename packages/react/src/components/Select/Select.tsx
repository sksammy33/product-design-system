import { useEffect, useId, useRef, useState } from 'react';
import type { AriaAttributes, KeyboardEvent, ReactNode, Ref } from 'react';
import { ChevronDown, Loader, Search, X } from 'lucide-react';
import { Input } from '../Input/Input';
import { FieldLabel, FieldSupport, styles as fieldStyles } from '../Input/Field';
import type { FieldSize } from '../Input/Field';
import { useFormValue } from '../../internal/useFormValue';
import styles from './Select.module.css';

export type SelectOption = { value: string; label: string; disabled?: boolean };
type Common = Pick<AriaAttributes, 'aria-label' | 'aria-labelledby' | 'aria-describedby' | 'aria-invalid'> & {
  id?: string;
  name?: string;
  form?: string;
  label?: string;
  helperText?: string;
  error?: boolean;
  errorText?: string;
  required?: boolean;
  optional?: boolean;
  disabled?: boolean;
  options: readonly SelectOption[];
  placeholder?: string;
  className?: string;
  emptyText?: string;
  onBlur?: () => void;
};
type SingleValue = { value?: string; defaultValue?: string; onValueChange?: (value: string) => void };
export type SelectProps = Common & SingleValue & { size?: FieldSize; leadingIcon?: ReactNode; ref?: Ref<HTMLButtonElement> };
export type ComboboxProps = Common & SingleValue & {
  loading?: boolean;
  loadingText?: string;
  onQueryChange?: (query: string) => void;
  ref?: Ref<HTMLInputElement>;
};
export type MultiSelectProps = Common & {
  value?: readonly string[];
  defaultValue?: readonly string[];
  onValueChange?: (value: string[]) => void;
  ref?: Ref<HTMLButtonElement>;
};
const empty: readonly string[] = [];
const cx = (...values: (string | undefined | false)[]) => values.filter(Boolean).join(' ');

export function Select({ value, defaultValue, onValueChange, ref, ...props }: SelectProps) {
  return <Picker {...props} kind="select" buttonRef={ref} value={value === undefined ? undefined : value ? [value] : empty}
    defaultValue={defaultValue ? [defaultValue] : empty} onValueChange={next => onValueChange?.(next[0] ?? '')} />;
}
export function Combobox({ value, defaultValue, onValueChange, ref, ...props }: ComboboxProps) {
  return <Picker {...props} kind="combobox" inputRef={ref} value={value === undefined ? undefined : value ? [value] : empty}
    defaultValue={defaultValue ? [defaultValue] : empty} onValueChange={next => onValueChange?.(next[0] ?? '')} />;
}
export function MultiSelect({ ref, ...props }: MultiSelectProps) {
  return <Picker {...props} kind="multi" buttonRef={ref} />;
}

type PickerProps = Common & {
  kind: 'select' | 'combobox' | 'multi';
  value?: readonly string[] | undefined;
  defaultValue?: readonly string[];
  onValueChange?: (value: string[]) => void;
  size?: FieldSize;
  leadingIcon?: ReactNode;
  loading?: boolean;
  loadingText?: string;
  onQueryChange?: (query: string) => void;
  buttonRef?: Ref<HTMLButtonElement> | undefined;
  inputRef?: Ref<HTMLInputElement> | undefined;
};

function Picker({ kind, value, defaultValue = empty, onValueChange, options, label, helperText, error, errorText,
  id, name, form, required, optional, disabled, size = 'medium', leadingIcon, loading = false,
  loadingText = 'Loading options…', emptyText = 'No options found', onQueryChange, onBlur,
  placeholder = kind === 'combobox' ? 'Search or select...' : kind === 'multi' ? 'Select options...' : 'Select an option',
  className, buttonRef, inputRef, 'aria-label': ariaLabel, 'aria-labelledby': labelledBy,
  'aria-describedby': describedBy, 'aria-invalid': invalid }: PickerProps) {
  const generatedId = useId();
  const fieldId = id ?? `pds-${kind}-${generatedId}`;
  const listId = `${fieldId}-list`;
  const owner = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement | HTMLInputElement>(null);
  const [selected, setSelected] = useFormValue<readonly string[]>(value, defaultValue, next => onValueChange?.([...next]), owner, form);
  const [open, setOpen] = useState(false);
  const [activeValue, setActiveValue] = useState<string>();
  const [query, setQuery] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState('');
  const [resetVersion, setResetVersion] = useState(0);
  const typeahead = useRef({ text: '', time: 0 });
  const isMulti = kind === 'multi';
  const editable = kind === 'combobox';
  const support = error && errorText ? errorText : helperText;
  const description = [describedBy, support && `${fieldId}-support`].filter(Boolean).join(' ') || undefined;
  const selectedOptions = options.filter(option => selected.includes(option.value));
  const selectedLabel = selectedOptions[0]?.label ?? '';
  const filtered = editable && query ? options.filter(option => option.label.toLocaleLowerCase().includes(query.toLocaleLowerCase())) : options;
  const enabled = loading ? [] : filtered.filter(option => !option.disabled);
  const expanded = open && !disabled;
  const active = enabled.find(option => option.value === activeValue);
  const optionId = (option: SelectOption) => `${listId}-${options.indexOf(option)}`;
  const inert = () => disabled || trigger.current?.matches(':disabled');
  const close = () => { setOpen(false); setQuery(null); setActiveValue(undefined); };
  const openList = (last = false) => {
    if (inert()) return;
    setOpen(true);
    setActiveValue(enabled.find(option => selected.includes(option.value))?.value ?? (last ? enabled.at(-1)?.value : enabled[0]?.value));
  };
  const choose = (option: SelectOption) => {
    if (option.disabled || loading || inert()) return;
    const removing = selected.includes(option.value);
    setSelected(isMulti ? removing ? selected.filter(v => v !== option.value) : [...selected, option.value] : [option.value]);
    setAnnouncement(`${option.label} ${isMulti && removing ? 'removed' : 'selected'}`);
    if (!isMulti) close();
    trigger.current?.focus();
  };
  const remove = (option: SelectOption) => {
    if (inert() || option.disabled) return;
    setSelected(selected.filter(v => v !== option.value));
    setAnnouncement(`${option.label} removed`);
    trigger.current?.focus();
  };
  useEffect(() => {
    if (!expanded) return;
    const dismiss = (event: PointerEvent) => { if (event.target instanceof Node && !owner.current?.contains(event.target)) close(); };
    document.addEventListener('pointerdown', dismiss);
    return () => document.removeEventListener('pointerdown', dismiss);
  }, [expanded]);
  useEffect(() => {
    if (expanded && active) document.getElementById(optionId(active))?.scrollIntoView({ block: 'nearest' });
  }, [expanded, activeValue]);
  useEffect(() => {
    const ownerForm = form ? document.getElementById(form) : owner.current?.closest('form');
    if (!(ownerForm instanceof HTMLFormElement)) return;
    // Remount the form proxy after the browser's default reset, including for controlled values.
    const reset = (event: Event) => setTimeout(() => {
      if (!event.defaultPrevented) { close(); setResetVersion(version => version + 1); }
    });
    ownerForm.addEventListener('reset', reset);
    return () => ownerForm.removeEventListener('reset', reset);
  }, [form]);
  const keyDown = (event: KeyboardEvent<HTMLButtonElement | HTMLInputElement>) => {
    if (inert() || event.nativeEvent.isComposing) return;
    const key = event.key;
    if (key === 'Tab') { close(); return; }
    if (key === 'Escape') { if (expanded) { event.preventDefault(); event.stopPropagation(); close(); } return; }
    if (key === 'ArrowDown' || key === 'ArrowUp') {
      event.preventDefault();
      if (!expanded) { openList(key === 'ArrowUp'); return; }
      const index = enabled.findIndex(option => option.value === activeValue);
      setActiveValue(enabled[(index + (key === 'ArrowDown' ? 1 : -1) + enabled.length) % enabled.length]?.value);
      return;
    }
    if (expanded && (key === 'Home' || key === 'End') && !editable) {
      event.preventDefault(); setActiveValue(key === 'Home' ? enabled[0]?.value : enabled.at(-1)?.value); return;
    }
    if (key === 'Enter' || (!editable && key === ' ')) {
      event.preventDefault();
      if (!expanded) openList(); else if (active) choose(active);
      return;
    }
    if (!editable && key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
      event.preventDefault();
      const now = Date.now();
      const previous = now - typeahead.current.time < 700 ? typeahead.current.text : '';
      const text = previous + key.toLocaleLowerCase();
      typeahead.current = { text, time: now };
      const search = [...text].every(letter => letter === text[0]) ? text[0]! : text;
      const start = enabled.findIndex(option => option.value === activeValue) + 1;
      const ordered = [...enabled.slice(start), ...enabled.slice(0, start)];
      const match = ordered.find(option => option.label.toLocaleLowerCase().startsWith(search));
      setOpen(true);
      if (match) setActiveValue(match.value);
    }
  };
  const aria = {
    role: 'combobox' as const,
    'aria-label': ariaLabel,
    'aria-labelledby': labelledBy,
    'aria-describedby': description,
    'aria-invalid': error || invalid || undefined,
    'aria-required': required || undefined,
    'aria-expanded': expanded,
    'aria-controls': expanded ? listId : undefined,
    'aria-haspopup': 'listbox' as const,
    'aria-activedescendant': expanded && active ? optionId(active) : undefined,
  };
  const chevron = <ChevronDown aria-hidden="true" focusable="false" size={16} className={styles.chevron} data-open={expanded || undefined} />;
  return <div ref={owner} className={cx(styles.root, fieldStyles.root, className)} data-kind={kind} data-size={size}
    aria-disabled={disabled || undefined}
    data-disabled={disabled || undefined} data-error={error || undefined} data-open={expanded || undefined}
    onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) { close(); onBlur?.(); } }}>
    {editable ? <Input {...aria} id={fieldId} ref={node => {
      trigger.current = node;
      if (typeof inputRef === 'function') return inputRef(node);
      if (inputRef) inputRef.current = node;
    }} className={styles.combo} {...(label ? { label } : {})} disabled={disabled} required={required} optional={optional ?? false}
      value={query ?? selectedLabel} placeholder={placeholder} autoComplete="off" aria-autocomplete="list" aria-busy={loading || undefined}
      onKeyDown={keyDown} onClick={() => { if (!expanded) openList(); }}
      onChange={event => {
        const next = event.target.value;
        setQuery(next); setOpen(true);
        setActiveValue(options.find(option => !option.disabled && option.label.toLocaleLowerCase().includes(next.toLocaleLowerCase()))?.value);
        if (selected.length) setSelected([]);
        onQueryChange?.(next);
      }}
      leadingIcon={!selectedLabel && <Search size={16} />}
      trailingAction={<>
        {(selected.length > 0 || query || expanded) && !disabled && <button className={styles.clear} type="button" aria-label={`Clear ${label ?? ariaLabel ?? 'selection'}`}
          onMouseDown={event => event.preventDefault()} onClick={() => { setSelected([]); setQuery(''); onQueryChange?.(''); trigger.current?.focus(); }}><X size={14} aria-hidden="true" /></button>}
        {loading ? <Loader size={16} className={styles.loader} aria-hidden="true" /> : <button className={styles.toggle} type="button" tabIndex={-1} disabled={disabled}
          aria-label={`${expanded ? 'Close' : 'Open'} ${label ?? ariaLabel ?? 'options'}`} onMouseDown={event => event.preventDefault()}
          onClick={() => { if (expanded) close(); else openList(); trigger.current?.focus(); }}>{chevron}</button>}
      </>} /> : <>
      <FieldLabel id={fieldId} label={label} required={required} optional={optional} />
      <div className={styles.control}>
        {isMulti && selectedOptions.map(option => <span className={styles.tag} key={option.value}>
          <span>{option.label}</span>
          {!disabled && <button type="button" className={styles.remove} disabled={option.disabled} aria-label={`Remove ${option.label}`}
            onClick={() => remove(option)}><X size={12} aria-hidden="true" /></button>}
        </span>)}
        <button {...aria} type="button" id={fieldId} disabled={disabled} ref={node => {
          trigger.current = node;
          if (typeof buttonRef === 'function') return buttonRef(node);
          if (buttonRef) buttonRef.current = node;
        }} className={styles.trigger} onKeyDown={keyDown} onClick={() => { if (expanded) close(); else openList(); }}>
          {!isMulti && leadingIcon && <span className={styles.leading} aria-hidden="true">{leadingIcon}</span>}
          <span className={cx(styles.value, !selectedLabel && styles.placeholder)}>
            {isMulti ? selected.length ? <span className={styles.visuallyHidden}>{selectedOptions.map(option => option.label).join(', ')}</span> : placeholder : selectedLabel || placeholder}
          </span>{chevron}
        </button>
      </div>
    </>}
    <FieldSupport id={`${fieldId}-support`} text={support} />
    {/* Native form participation and constraint validation; focus invalid controls on the visible trigger. */}
    <select key={resetVersion} className={styles.native} tabIndex={-1} aria-hidden="true" name={name} form={form} disabled={disabled}
      required={required} multiple={isMulti} value={isMulti ? [...selected] : selected[0] ?? ''} onChange={() => {}}
      onInvalid={event => { event.preventDefault(); trigger.current?.focus(); }}>
      {!isMulti && <option value="" />}
      {options.map(option => <option key={option.value} value={option.value} disabled={option.disabled}>{option.label}</option>)}
    </select>
    {expanded && <div className={styles.popup}>
      <div id={listId} role="listbox" aria-label={label ?? ariaLabel ?? 'Options'} aria-labelledby={labelledBy}
        aria-multiselectable={isMulti || undefined} aria-busy={loading || undefined} className={styles.list}>
        {!loading && filtered.map(option => <div key={option.value} id={optionId(option)} role="option" aria-selected={selected.includes(option.value)}
          aria-disabled={option.disabled || undefined} data-active={active?.value === option.value || undefined} className={styles.option}
          onMouseDown={event => event.preventDefault()} onPointerMove={() => { if (!option.disabled) setActiveValue(option.value); }}
          onClick={() => choose(option)}>{option.label}</div>)}
      </div>
      {(loading || !filtered.length) && <div className={styles.message} role="status">{loading ? loadingText : emptyText}</div>}
    </div>}
    <span role="status" className={styles.visuallyHidden}>{loading ? loadingText : announcement}</span>
  </div>;
}
