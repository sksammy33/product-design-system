import { useId } from 'react';
import type { CommandItemData } from './CommandItem';
import { CommandItem } from './CommandItem';
import styles from './Command.module.css';

export type CommandGroupData = { id: string; label: string; items: readonly CommandItemData[] };
export type CommandGroupProps = CommandGroupData & {
  selectedId?: string | null;
  optionIdPrefix?: string;
  onActivate?: (id: string) => void;
  onHighlight?: (id: string) => void;
  className?: string;
};

export function CommandGroup({ label, items, selectedId, optionIdPrefix, onActivate, onHighlight,
  className }: CommandGroupProps) {
  const labelId = `pds-command-group-${useId()}`;
  return <div role="group" aria-labelledby={labelId} className={[styles.group, className].filter(Boolean).join(' ')}>
    <div id={labelId} className={styles.groupLabel}>{label}</div>
    {items.map(item => <CommandItem key={item.id} {...item} inMenu={!!optionIdPrefix}
      optionId={optionIdPrefix ? `${optionIdPrefix}-${item.id}` : undefined}
      selected={selectedId === item.id} onActivate={onActivate} onHighlight={onHighlight} />)}
  </div>;
}
