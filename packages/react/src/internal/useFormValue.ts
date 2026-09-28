import { useEffect, useState } from 'react';
import type { RefObject } from 'react';

/** Keep uncontrolled composite controls aligned with their owner form's reset event. */
export function useFormValue<T>(value: T | undefined, defaultValue: T, onChange: ((value: T) => void) | undefined,
  owner: RefObject<HTMLElement | null>, formId?: string) {
  const [internal, setInternal] = useState(defaultValue);
  useEffect(() => {
    const form = formId ? document.getElementById(formId) : owner.current?.closest('form');
    if (!(form instanceof HTMLFormElement)) return;
    const reset = (event: Event) => setTimeout(() => {
      if (!event.defaultPrevented && value === undefined) setInternal(defaultValue);
    });
    form.addEventListener('reset', reset);
    return () => form.removeEventListener('reset', reset);
  }, [value, defaultValue, owner, formId]);
  return [value === undefined ? internal : value, (next: T) => {
    if (value === undefined) setInternal(next);
    onChange?.(next);
  }] as const;
}
