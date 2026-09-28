import { cloneElement, useId, useState } from 'react';
import type { ReactElement, ReactNode, KeyboardEvent, FocusEvent, PointerEvent } from 'react';
import topArrow from './assets/tooltip-top.svg';
import bottomArrow from './assets/tooltip-bottom.svg';
import leftArrow from './assets/tooltip-left.svg';
import rightArrow from './assets/tooltip-right.svg';
import styles from './Overlay.module.css';

type Trigger = {
  'aria-describedby'?: string;
  onFocus?: (event: FocusEvent<HTMLElement>) => void;
  onBlur?: (event: FocusEvent<HTMLElement>) => void;
  onPointerEnter?: (event: PointerEvent<HTMLElement>) => void;
  onPointerLeave?: (event: PointerEvent<HTMLElement>) => void;
  onKeyDown?: (event: KeyboardEvent<HTMLElement>) => void;
};
export type TooltipProps = {
  trigger: ReactElement<Trigger>;
  children: ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  shortcut?: string;
  className?: string;
};
const arrows = { top: topArrow, bottom: bottomArrow, left: leftArrow, right: rightArrow };
/** A noninteractive description, revealed by pointer hover or keyboard focus. */
export function Tooltip({ trigger, children, position = 'top', shortcut, className }: TooltipProps) {
  const id = `pds-tooltip-${useId()}`;
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const visible = !dismissed && (hovered || focused);
  const props = trigger.props;
  const describedBy = [props['aria-describedby'], visible && id].filter(Boolean).join(' ') || undefined;
  const target = cloneElement(trigger, {
    ...(describedBy ? { 'aria-describedby': describedBy } : {}),
    onFocus: event => { setFocused(true); setDismissed(false); props.onFocus?.(event); },
    onBlur: event => { setFocused(false); props.onBlur?.(event); },
    onPointerEnter: event => { setHovered(true); setDismissed(false); props.onPointerEnter?.(event); },
    onPointerLeave: event => { setHovered(false); props.onPointerLeave?.(event); },
    onKeyDown: event => { if (event.key === 'Escape' && visible) { setDismissed(true); event.stopPropagation(); } props.onKeyDown?.(event); },
  });
  return <span className={[styles.tooltipAnchor, className].filter(Boolean).join(' ')}>
    {target}
    {visible && <span id={id} role="tooltip" className={styles.tooltip} data-position={position}>
      {(position === 'bottom' || position === 'right') && <img className={styles.tooltipArrow} src={arrows[position]} alt="" />}
      <span className={styles.tooltipBody}><span>{children}</span>{shortcut && <kbd className={styles.tooltipShortcut}>{shortcut}</kbd>}</span>
      {(position === 'top' || position === 'left') && <img className={styles.tooltipArrow} src={arrows[position]} alt="" />}
    </span>}
  </span>;
}
