import type { MouseEvent, ReactNode } from 'react';
import { ArrowLeft, Bell, Menu, Search, User, X } from 'lucide-react';
import { Button } from '../Button/Button';
import brandMark from './assets/brand-mark.svg';
import styles from './NavigationShells.module.css';

export type NavigationDestination = {
  id: string;
  label: string;
  href?: string;
  target?: string;
  rel?: string;
  icon?: ReactNode;
  disabled?: boolean;
  /** Router integrations may preventDefault on this event. */
  onSelect?: (event: MouseEvent<HTMLElement>) => void;
};
export type NavigationControl = { label: string; icon: ReactNode; onClick: () => void; disabled?: boolean };
export type NavigationBrand = { label: string; logo?: ReactNode; href?: string };

function Brand({ brand, collapsed = false }: { brand: NavigationBrand; collapsed?: boolean }) {
  const content = <><span className={styles.brandMark} aria-hidden="true">{brand.logo ?? <img src={brandMark} width={24} height={24} alt="" />}</span>
    <span className={collapsed ? styles.srOnly : undefined}>{brand.label}</span></>;
  return brand.href ? <a className={styles.brand} href={brand.href} aria-label={collapsed ? brand.label : undefined}>{content}</a>
    : <div className={styles.brand}>{content}</div>;
}

function Destination({ item, current, className, hideLabel, onNavigate }: {
  item: NavigationDestination; current: boolean; className: string | undefined; hideLabel?: boolean;
  onNavigate?: ((id: string, event: MouseEvent<HTMLElement>) => void) | undefined;
}) {
  const click = (event: MouseEvent<HTMLElement>) => {
    if (item.disabled) { event.preventDefault(); return; }
    item.onSelect?.(event); onNavigate?.(item.id, event);
  };
  const content = <>{item.icon && <span className={styles.destinationIcon} aria-hidden="true">{item.icon}</span>}
    <span className={hideLabel ? styles.srOnly : styles.destinationLabel}>{item.label}</span></>;
  const common = { className, 'aria-current': current ? 'page' as const : undefined,
    'aria-label': hideLabel ? item.label : undefined, title: hideLabel ? item.label : undefined };
  return item.href !== undefined ? <a {...common} href={item.disabled ? undefined : item.href} target={item.target} rel={item.rel}
    aria-disabled={item.disabled || undefined} tabIndex={item.disabled ? -1 : undefined} onClick={click}>{content}</a>
    : <button {...common} type="button" disabled={item.disabled} onClick={click}>{content}</button>;
}

function Control({ control, size = 24, ...relationships }: {
  control: NavigationControl; size?: 20 | 24; 'aria-expanded'?: boolean | undefined; 'aria-controls'?: string | undefined;
}) {
  return <Button variant="ghost" iconOnly aria-label={control.label} disabled={control.disabled}
    onClick={control.onClick} className={styles.control} data-icon-size={size} {...relationships}>
    <span className={styles.controlIcon}>{control.icon}</span>
  </Button>;
}

export type NavigationBarProps = {
  variant?: 'desktop' | 'mobile'; brand?: NavigationBrand;
  items?: readonly NavigationDestination[]; currentId?: string;
  onNavigate?: (id: string, event: MouseEvent<HTMLElement>) => void;
  onSearch?: () => void; onNotifications?: () => void; onProfile?: () => void; onMenu?: () => void;
  searchLabel?: string; notificationsLabel?: string; profileLabel?: string; menuLabel?: string;
  menuExpanded?: boolean; menuControls?: string; label?: string; className?: string;
};

/** Navigation Bar 140:8393. Variants are explicit; the consuming app chooses its breakpoint. */
export function NavigationBar({ variant = 'desktop', brand = { label: 'Brand' }, items = [], currentId,
  onNavigate, onSearch, onNotifications, onProfile, onMenu, searchLabel = 'Search',
  notificationsLabel = 'Notifications', profileLabel = 'Profile', menuLabel = 'Open navigation menu',
  menuExpanded, menuControls, label = 'Primary navigation', className }: NavigationBarProps) {
  const mobile = variant === 'mobile';
  return <nav aria-label={label} className={[styles.bar, mobile ? styles.mobileBar : styles.desktopBar, className].filter(Boolean).join(' ')}>
    {mobile && onMenu && <Control control={{ label: menuLabel, icon: <Menu size={24} />, onClick: onMenu }}
      aria-expanded={menuExpanded} aria-controls={menuControls} />}
    <Brand brand={brand} />
    {!mobile && <ul className={styles.barLinks}>{items.map(item => <li key={item.id}>
      <Destination item={item} current={currentId === item.id} className={styles.barLink} onNavigate={onNavigate} />
    </li>)}</ul>}
    <div className={styles.barActions}>
      {!mobile && onSearch && <Control size={20} control={{ label: searchLabel, icon: <Search size={20} />, onClick: onSearch }} />}
      {onNotifications && <Control size={mobile ? 24 : 20} control={{ label: notificationsLabel, icon: <Bell size={mobile ? 24 : 20} />, onClick: onNotifications }} />}
      {!mobile && onProfile && <Control size={20} control={{ label: profileLabel, icon: <User size={20} />, onClick: onProfile }} />}
    </div>
  </nav>;
}

export type SideNavigationItem = NavigationDestination & { icon: ReactNode };
export type SideNavigationGroup = { id: string; label: string; items: readonly SideNavigationItem[] };
export type SideNavigationProps = {
  brand?: NavigationBrand; groups: readonly SideNavigationGroup[]; utilities?: readonly SideNavigationItem[];
  collapsed?: boolean; currentId?: string; onNavigate?: (id: string, event: MouseEvent<HTMLElement>) => void;
  label?: string; className?: string;
};

/** Side Navigation 140:8465, with 240/64px widths and a 600px reference height. */
export function SideNavigation({ brand = { label: 'Brand' }, groups, utilities = [], collapsed = false,
  currentId, onNavigate, label = 'Side navigation', className }: SideNavigationProps) {
  return <nav aria-label={label} className={[styles.side, collapsed ? styles.collapsed : '', className].filter(Boolean).join(' ')}>
    <div className={styles.sideHeader}><Brand brand={brand} collapsed={collapsed} /></div>
    <div className={styles.sideGroups}>{groups.map(group => <div key={group.id} role="group" aria-label={group.label} className={styles.sideGroup}>
      <h2 className={collapsed ? styles.srOnly : styles.groupLabel}>{group.label}</h2>
      <ul>{group.items.map(item => <li key={item.id}><Destination item={item} current={currentId === item.id}
        hideLabel={collapsed} className={styles.sideLink} onNavigate={onNavigate} /></li>)}</ul>
    </div>)}</div>
    {utilities.length > 0 && <ul className={styles.utilities} aria-label="Utilities">{utilities.map(item => <li key={item.id}>
      <Destination item={item} current={currentId === item.id} hideLabel={collapsed} className={styles.sideLink} onNavigate={onNavigate} />
    </li>)}</ul>}
  </nav>;
}

type MobileCommon = { label?: string; className?: string };
export type MobileNavigationProps = MobileCommon & (
  | { variant: 'bottom'; items: readonly SideNavigationItem[]; currentId?: string;
      onNavigate?: (id: string, event: MouseEvent<HTMLElement>) => void; title?: never; onBack?: never; onClose?: never; action?: never }
  | { variant: 'top-back'; title: string; onBack: () => void; backLabel?: string; action?: NavigationControl;
      items?: never; currentId?: never; onNavigate?: never; onClose?: never }
  | { variant: 'top-close'; title: string; onClose: () => void; closeLabel?: string; action?: NavigationControl;
      items?: never; currentId?: never; onNavigate?: never; onBack?: never }
);

/** Mobile Navigation 140:8502: Bottom Bar, Top Bar Back, and Top Bar Close. */
export function MobileNavigation(props: MobileNavigationProps) {
  if (props.variant === 'bottom') return <nav aria-label={props.label ?? 'Mobile destinations'}
    className={[styles.bottomBar, props.className].filter(Boolean).join(' ')}><ul>
    {props.items.map(item => <li key={item.id}><Destination item={item} current={props.currentId === item.id}
      className={styles.bottomLink} onNavigate={props.onNavigate} /></li>)}
  </ul></nav>;
  const back = props.variant === 'top-back';
  const leading = back ? { label: props.backLabel ?? 'Go back', icon: <ArrowLeft size={24} />, onClick: props.onBack }
    : { label: props.closeLabel ?? 'Close', icon: <X size={24} />, onClick: props.onClose };
  return <nav aria-label={props.label ?? `${props.title} navigation`}
    className={[styles.topBar, !back ? styles.closeBar : '', props.className].filter(Boolean).join(' ')}>
    <Control control={leading} /><span className={styles.topTitle}>{props.title}</span>
    {props.action ? <Control control={props.action} /> : <span className={styles.actionPlaceholder} aria-hidden="true" />}
  </nav>;
}
