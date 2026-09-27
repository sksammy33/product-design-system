import styles from './Selection.module.css';

export type SelectionTextProps = {
  label: string;
  labelId: string;
  supportId: string;
  support?: string | undefined;
  hidden?: boolean;
};

export function SelectionText({ label, labelId, supportId, support, hidden = false }: SelectionTextProps) {
  return <span className={hidden ? styles.visuallyHidden : styles.text}>
    <span id={labelId} className={styles.labelText}>{label}</span>
    {support && <span id={supportId} className={styles.helper}>{support}</span>}
  </span>;
}
