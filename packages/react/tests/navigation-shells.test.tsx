import { useState } from 'react';
import type { MouseEvent } from 'react';
import { afterEach, expect, test, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { page, userEvent } from 'vitest/browser';
import { Bell, Calendar, Heart, House, Inbox, LogOut, Search, Settings, User } from 'lucide-react';
import { MobileNavigation, NavigationBar, SideNavigation } from '@product-design-system/react';
import type { SideNavigationGroup, SideNavigationItem } from '@product-design-system/react';
import { assertAccessible } from './accessibility';

const groups: SideNavigationGroup[] = [
  { id: 'main', label: 'Main', items: [
    { id: 'home', label: 'Dashboard', icon: <House />, href: '/dashboard' },
    { id: 'inbox', label: 'Inbox', icon: <Inbox /> },
    { id: 'calendar', label: 'Calendar', icon: <Calendar />, disabled: true },
  ] },
];
const utilities: SideNavigationItem[] = [
  { id: 'settings', label: 'Settings', icon: <Settings /> },
  { id: 'logout', label: 'Log out', icon: <LogOut /> },
];
const destinations: SideNavigationItem[] = [
  { id: 'home', label: 'Home', icon: <House /> },
  { id: 'search', label: 'Search', icon: <Search /> },
  { id: 'favorites', label: 'Favorites', icon: <Heart /> },
  { id: 'alerts', label: 'Alerts', icon: <Bell /> },
  { id: 'profile', label: 'Profile', icon: <User /> },
];
afterEach(() => document.documentElement.removeAttribute('data-theme'));

test('desktop links expose current page and router callbacks can prevent navigation', async () => {
  const navigate = vi.fn((_id: string, event: MouseEvent<HTMLElement>) => event.preventDefault());
  const search = vi.fn(), notifications = vi.fn(), profile = vi.fn();
  await render(<main className="pds-scope"><NavigationBar brand={{ label: 'Acme', href: '/' }}
    items={[{ id: 'home', label: 'Dashboard', href: '/dashboard' }, { id: 'products', label: 'Products', href: '/products' }]}
    currentId="home" onNavigate={navigate} onSearch={search} onNotifications={notifications} onProfile={profile} /></main>);
  await expect.element(page.getByRole('link', { name: 'Dashboard' })).toHaveAttribute('aria-current', 'page');
  const products = page.getByRole('link', { name: 'Products' });
  products.element().focus(); await userEvent.keyboard('{Enter}');
  expect(navigate).toHaveBeenCalledOnce(); expect(navigate.mock.calls[0]![0]).toBe('products');
  for (const label of ['Search', 'Notifications', 'Profile']) {
    page.getByRole('button', { name: label, exact: true }).element().focus(); await userEvent.keyboard('{Enter}');
  }
  expect(search).toHaveBeenCalledOnce(); expect(notifications).toHaveBeenCalledOnce(); expect(profile).toHaveBeenCalledOnce();
  await assertAccessible(document.body);
});

test('mobile bar names menu and notification controls and exposes controlled menu relationships', async () => {
  const notifications = vi.fn();
  function Fixture() {
    const [open, setOpen] = useState(false);
    return <main className="pds-scope"><NavigationBar variant="mobile" onMenu={() => setOpen(!open)}
      menuExpanded={open} menuControls="mobile-links" onNotifications={notifications} />
      <div id="mobile-links" hidden={!open}>Mobile links supplied by the app</div></main>;
  }
  await render(<Fixture />);
  const menu = page.getByRole('button', { name: 'Open navigation menu' });
  menu.element().focus(); await userEvent.keyboard('{Enter}');
  await expect.element(menu).toHaveAttribute('aria-expanded', 'true');
  await expect.element(menu).toHaveAttribute('aria-controls', 'mobile-links');
  await page.getByRole('button', { name: 'Notifications' }).click(); expect(notifications).toHaveBeenCalledOnce();
  await assertAccessible(document.body);
});

for (const collapsed of [false, true]) test(`sidebar ${collapsed ? 'collapsed' : 'expanded'} preserves grouping, names and keyboard access`, async () => {
  const navigate = vi.fn((_id: string, event: MouseEvent<HTMLElement>) => event.preventDefault());
  await render(<main className="pds-scope"><SideNavigation groups={groups} utilities={utilities}
    collapsed={collapsed} currentId="home" onNavigate={navigate} /></main>);
  await expect.element(page.getByRole('group', { name: 'Main' })).toBeInTheDocument();
  await expect.element(page.getByRole('link', { name: 'Dashboard' })).toHaveAttribute('aria-current', 'page');
  page.getByRole('link', { name: 'Dashboard' }).element().focus(); await userEvent.keyboard('{Tab}');
  await expect.element(page.getByRole('button', { name: 'Inbox' })).toHaveFocus();
  await userEvent.keyboard(' '); expect(navigate.mock.calls[0]![0]).toBe('inbox');
  await userEvent.keyboard('{Tab}'); await expect.element(page.getByRole('button', { name: 'Settings' })).toHaveFocus();
  await userEvent.keyboard('{Tab}{Enter}'); expect(navigate.mock.calls[1]![0]).toBe('logout');
  await page.getByRole('button', { name: 'Calendar' }).click({ force: true }); expect(navigate).toHaveBeenCalledTimes(2);
  await assertAccessible(document.body);
});

test('bottom navigation updates current destination and supplies a visible non-color cue', async () => {
  function Fixture() {
    const [current, setCurrent] = useState('home');
    return <main className="pds-scope"><MobileNavigation variant="bottom" items={destinations} currentId={current} onNavigate={setCurrent} /></main>;
  }
  await render(<Fixture />);
  const search = page.getByRole('button', { name: 'Search' });
  search.element().focus(); await userEvent.keyboard('{Enter}');
  await expect.element(search).toHaveAttribute('aria-current', 'page');
  expect(page.getByRole('button', { name: 'Home' }).element().hasAttribute('aria-current')).toBe(false);
  expect(getComputedStyle(search.element().querySelector('span:last-child')!).textDecorationLine).toContain('underline');
  await assertAccessible(document.body);
});

test('top back and close bars keep titles centered and actions keyboard operable', async () => {
  const back = vi.fn(), close = vi.fn(), search = vi.fn();
  await render(<main className="pds-scope"><MobileNavigation variant="top-back" title="Products" onBack={back}
    action={{ label: 'Search products', icon: <Search />, onClick: search }} />
    <MobileNavigation variant="top-close" title="Edit product" onClose={close} closeLabel="Close editor" /></main>);
  for (const label of ['Go back', 'Search products', 'Close editor']) {
    page.getByRole('button', { name: label }).element().focus(); await userEvent.keyboard('{Enter}');
  }
  expect(back).toHaveBeenCalledOnce(); expect(close).toHaveBeenCalledOnce(); expect(search).toHaveBeenCalledOnce();
  await expect.element(page.getByRole('navigation', { name: 'Products navigation' })).toHaveTextContent('Products');
  await assertAccessible(document.body);
});

test('disabled links have no href and cannot activate callbacks', async () => {
  const action = vi.fn();
  await render(<main className="pds-scope"><NavigationBar items={[{ id: 'blocked', label: 'Blocked', href: '/blocked', disabled: true, onSelect: action }]} /></main>);
  const blocked = page.getByText('Blocked');
  expect(blocked.element().closest('a')!.hasAttribute('href')).toBe(false);
  await blocked.click({ force: true }); expect(action).not.toHaveBeenCalled();
  await assertAccessible(document.body);
});

for (const theme of ['light', 'dark']) test(`all shell variants pass axe and retain source dimensions in ${theme}`, async () => {
  document.documentElement.setAttribute('data-theme', theme);
  await render(<main className="pds-scope"><NavigationBar variant="mobile" onMenu={() => {}} onNotifications={() => {}} />
    <SideNavigation groups={groups} utilities={utilities} label="Expanded sidebar" />
    <SideNavigation groups={groups} utilities={utilities} collapsed label="Collapsed sidebar" />
    <MobileNavigation variant="bottom" items={destinations} currentId="home" />
    <MobileNavigation variant="top-back" title="Page Title" label="Back navigation" onBack={() => {}} />
    <MobileNavigation variant="top-close" title="Page Title" label="Close navigation" onClose={() => {}} /></main>);
  const size = (name: string) => page.getByRole('navigation', { name }).element().getBoundingClientRect();
  expect(size('Expanded sidebar').width).toBe(240); expect(size('Expanded sidebar').height).toBe(600);
  expect(size('Collapsed sidebar').width).toBe(64); expect(size('Mobile destinations').height).toBe(64);
  await assertAccessible(document.body);
});
