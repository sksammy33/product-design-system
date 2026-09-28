import type { KeyboardEvent, ReactNode } from 'react';
import { File } from 'lucide-react';
import { KeyboardShortcut } from './KeyboardShortcut';
import styles from './Command.module.css';

export type CommandItemData = {
  id: string;
  label: string;
  icon?: ReactNode;
  shortcut?: readonly string[];
  keywords?: readonly string[];
  disabled?: boolean;
  onSelect?: () => void;
};
export type CommandItemProps = CommandItemData & {
  selected?: boolean;
  onActivate?: ((id: string) => void) | undefined;
  onHighlight?: ((id: string) => void) | undefined;
  optionId?: string | undefined;
  inMenu?: boolean;
  className?: string;
};

export function CommandItem({ id, label, icon, shortcut, disabled, selected, onSelect,
  onActivate, onHighlight, optionId, inMenu = false, className }: CommandItemProps) {
  const activate = () => {
    if (disabled) return;
    if (!inMenu) onSelect?.();
    onActivate?.(id);
  };
  const keyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (inMenu || disabled) return;
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); activate(); }
  };
  return <div id={optionId} role="option" aria-selected={selected || false} aria-disabled={disabled || undefined}
    tabIndex={inMenu || disabled ? -1 : 0} data-selected={selected || undefined}
    className={[styles.item, className].filter(Boolean).join(' ')}
    onPointerMove={() => { if (!disabled) onHighlight?.(id); }} onClick={activate} onKeyDown={keyDown}>
    <span className={styles.itemIcon} aria-hidden="true">{icon ?? <File size={16} />}</span>
    <span className={styles.itemLabel}>{label}</span>
    {shortcut && <KeyboardShortcut keys={shortcut} />}
  </div>;
}
