import { expect, test, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { page, userEvent } from 'vitest/browser';
import { Breadcrumbs, NavigationMenu, Pagination, Stepper, Tabs } from '@product-design-system/react';
import { assertAccessible } from './accessibility';

test('breadcrumbs mark the current page and reveal collapsed ancestors', async () => {
  await render(<main className="pds-scope"><Breadcrumbs variant="collapsed" items={[
    { label: 'Home', href: '/' }, { label: 'Products', href: '/products' }, { label: 'Current Page' },
  ]} /></main>);
  await expect.element(page.getByText('Current Page')).toHaveAttribute('aria-current', 'page');
  await page.getByRole('button', { name: 'Show hidden breadcrumb pages' }).click();
  await expect.element(page.getByRole('link', { name: 'Products' })).toBeVisible();
  await assertAccessible(document.body);
});

test('pagination labels pages and disables previous/next at endpoints', async () => {
  const change = vi.fn();
  const view = await render(<main className="pds-scope"><Pagination page={1} pageCount={10} onPageChange={change} /></main>);
  await expect.element(page.getByRole('button', { name: 'Previous page' })).toBeDisabled();
  await page.getByRole('button', { name: 'Page 2' }).click();
  expect(change).toHaveBeenCalledWith(2);
  view.rerender(<main className="pds-scope"><Pagination page={10} pageCount={10} onPageChange={change} /></main>);
  await expect.element(page.getByRole('button', { name: 'Next page' })).toBeDisabled();
  await assertAccessible(document.body);
});

test('stepper exposes current and completed status as text and semantics', async () => {
  await render(<main className="pds-scope"><Stepper orientation="vertical" currentStep={2} steps={[
    { label: 'Account Setup' }, { label: 'Personal Info' }, { label: 'Confirmation' },
  ]} /></main>);
  await expect.element(page.getByText('Personal Info').element().closest('li')!).toHaveAttribute('aria-current', 'step');
  await expect.element(page.getByText('Account Setup').element().closest('li')!).toHaveTextContent('completed');
  await assertAccessible(document.body);
});

test('tabs use roving focus and associate the active panel', async () => {
  await render(<main className="pds-scope"><Tabs items={[
    { id: 'general', label: 'General', content: 'General settings' },
    { id: 'billing', label: 'Billing', content: 'Billing settings' },
    { id: 'security', label: 'Security', content: 'Security settings', disabled: true },
  ]} /></main>);
  const first = page.getByRole('tab', { name: 'General' });
  await first.click(); await userEvent.keyboard('{ArrowRight}');
  await expect.element(page.getByRole('tab', { name: 'Billing' })).toHaveAttribute('aria-selected', 'true');
  await expect.element(page.getByRole('tabpanel', { name: 'Billing' })).toHaveTextContent('Billing settings');
  await userEvent.keyboard('{ArrowRight}');
  await expect.element(first).toHaveAttribute('aria-selected', 'true');
  await assertAccessible(document.body);
});

test('tabs contain horizontal scrolling at 320px and keep the focused tab visible', async () => {
  await page.viewport(320, 800);
  try {
    await render(<main className="pds-scope" style={{ padding: 16 }}><Tabs items={[
      { id: 'general', label: 'General', content: 'General settings' },
      { id: 'billing', label: 'Billing', content: 'Billing settings' },
      { id: 'security', label: 'Security', content: 'Security settings' },
      { id: 'notifications', label: 'Notifications', content: 'Notification settings' },
    ]} /></main>);
    const list = page.getByRole('tablist').element();
    expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(window.innerWidth);
    expect(list.scrollWidth).toBeGreaterThan(list.clientWidth);
    page.getByRole('tab', { name: 'General' }).element().focus();
    await userEvent.keyboard('{End}');
    const last = page.getByRole('tab', { name: 'Notifications' }).element();
    await expect.element(last).toHaveFocus();
    expect(last.getBoundingClientRect().right).toBeLessThanOrEqual(list.getBoundingClientRect().right + 2);
    expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(window.innerWidth);
  } finally {
    await page.viewport(900, 800);
  }
});

test('navigation menu skips disabled items, opens and closes submenu, and activates enabled items', async () => {
  const action = vi.fn();
  await render(<main className="pds-scope"><NavigationMenu items={[
    { id: 'edit', label: 'Edit', onSelect: action },
    { id: 'disabled', label: 'Disabled', disabled: true, onSelect: action },
    { id: 'move', label: 'Move to', submenu: [{ id: 'archive', label: 'Archive', onSelect: action }] },
    { id: 'divider', label: '', divider: true },
    { id: 'delete', label: 'Delete', destructive: true, onSelect: action },
  ]} /></main>);
  page.getByRole('menuitem', { name: 'Edit' }).element().focus();
  await userEvent.keyboard('{ArrowDown}');
  await expect.element(page.getByRole('menuitem', { name: 'Move to' })).toHaveFocus();
  await userEvent.keyboard('{ArrowRight}');
  await expect.element(page.getByRole('menuitem', { name: 'Archive' })).toHaveFocus();
  await userEvent.keyboard('{Escape}');
  await expect.element(page.getByRole('menuitem', { name: 'Move to' })).toHaveFocus();
  await page.getByRole('menuitem', { name: 'Disabled' }).click({ force: true });
  expect(action).not.toHaveBeenCalled();
  await page.getByRole('menuitem', { name: 'Edit' }).click();
  expect(action).toHaveBeenCalledOnce();
  await assertAccessible(document.body);
});
