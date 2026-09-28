import styles from './Command.module.css';

export type KeyboardShortcutProps = {
  keys: readonly string[];
  className?: string;
};

/** Supplementary visual hint; the command label remains the accessible action name. */
export function KeyboardShortcut({ keys, className }: KeyboardShortcutProps) {
  return <span aria-hidden="true" className={[styles.shortcut, className].filter(Boolean).join(' ')}>
    {keys.map((key, index) => <kbd className={styles.key} key={`${key}-${index}`}>{key}</kbd>)}
  </span>;
}
