import type { ReactNode } from 'react';
export const options = [
  { value: 'design', label: 'Design' },
  { value: 'engineering', label: 'Engineering' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'archived', label: 'Archived', disabled: true },
];
export function BatchFrame({ children }: { children: ReactNode }) {
  return <div style={{ display: 'grid', gap: 'var(--spacing-space-24)', padding: 'var(--spacing-space-24)', maxWidth: 656 }}>{children}</div>;
}
