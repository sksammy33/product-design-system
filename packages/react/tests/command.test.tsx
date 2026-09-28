import { useState } from 'react';
import { afterEach, expect, test, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { page, userEvent } from 'vitest/browser';
import { Button, CommandGroup, CommandItem, CommandMenu, KeyboardShortcut } from '@product-design-system/react';
import type { CommandGroupData } from '@product-design-system/react';
import { assertAccessible } from './accessibility';

const groups: CommandGroupData[] = [
  { id: 'suggestions', label: 'Suggestions', items: [
    { id: 'calendar', label: 'Calendar', shortcut: ['⌘', 'C'] },
    { id: 'disabled', label: 'Disabled action', disabled: true },
    { id: 'search', label: 'Search', shortcut: ['⌘', 'S'] },
    { id: 'mail', label: 'Mail' },
  ] },
  { id: 'settings', label: 'Settings', items: [
    { id: 'calculator', label: 'Calculator', keywords: ['cal'] },
    { id: 'theme', label: 'Theme' },
  ] },
];
afterEach(() => document.documentElement.removeAttribute('data-theme'));

function OverlayFixture({ onSelect = () => {} }: { onSelect?: (id: string) => void }) {
  const [open, setOpen] = useState(false);
  return <main className="pds-scope"><Button aria-haspopup="dialog" aria-expanded={open}
    aria-controls={open ? 'test-command-menu' : undefined} onClick={() => setOpen(true)}>Open commands</Button>
    <CommandMenu id="test-command-menu" groups={groups} open={open} onOpenChange={setOpen} onSelect={onSelect} />
  </main>;
}

test('KeyboardShortcut stays supplementary to CommandItem action name', async () => {
  const action = vi.fn();
  await render(<main className="pds-scope"><div role="listbox" aria-label="Commands">
    <CommandItem id="new-file" label="New File" shortcut={['⌘', 'K']} onSelect={action} />
    <CommandItem id="blocked" label="Blocked" disabled onSelect={action} />
  </div><KeyboardShortcut keys={['⌘', 'K']} /></main>);
  const option = page.getByRole('option', { name: 'New File' });
  await expect.element(option).toBeVisible();
  expect(option.element().querySelector('[aria-hidden="true"]')).toBeTruthy();
  option.element().focus();
  await userEvent.keyboard('{Enter}');
  expect(action).toHaveBeenCalledOnce();
  await page.getByRole('option', { name: 'Blocked' }).click({ force: true });
  expect(action).toHaveBeenCalledOnce();
  await assertAccessible(document.body);
});

test('CommandGroup labels its options', async () => {
  await render(<main className="pds-scope"><div role="listbox" aria-label="Commands">
    <CommandGroup id="suggestions" label="Suggestions" items={groups[0]!.items} />
  </div></main>);
  await expect.element(page.getByRole('group', { name: 'Suggestions' })).toBeVisible();
  await expect.element(page.getByRole('option', { name: 'Calendar' })).toBeVisible();
  await assertAccessible(document.body);
});

test('CommandMenu arrows skip disabled options and Enter activates selected command', async () => {
  const action = vi.fn();
  await render(<main className="pds-scope"><CommandMenu groups={groups} onSelect={action} /></main>);
  const input = page.getByRole('combobox', { name: 'Search commands' });
  await input.click();
  await userEvent.keyboard('{ArrowDown}');
  await expect.element(page.getByRole('option', { name: 'Calendar' })).toHaveAttribute('aria-selected', 'true');
  await userEvent.keyboard('{ArrowDown}');
  await expect.element(page.getByRole('option', { name: 'Search' })).toHaveAttribute('aria-selected', 'true');
  await userEvent.keyboard('{ArrowUp}');
  await expect.element(page.getByRole('option', { name: 'Calendar' })).toHaveAttribute('aria-selected', 'true');
  await userEvent.keyboard('{Enter}');
  expect(action).toHaveBeenCalledExactlyOnceWith('calendar');
  await assertAccessible(document.body);
});

test('search filters across groups, selects a result and clears back to Default', async () => {
  await render(<main className="pds-scope"><CommandMenu groups={groups} /></main>);
  const input = page.getByRole('combobox', { name: 'Search commands' });
  await input.fill('cal');
  await expect.element(page.getByRole('group', { name: 'Results' })).toBeVisible();
  expect(page.getByRole('option').all().length).toBe(2);
  await expect.element(page.getByRole('option', { name: 'Calendar' })).toHaveAttribute('aria-selected', 'true');
  await page.getByRole('button', { name: 'Clear search' }).click();
  await expect.element(input).toHaveValue('');
  expect(page.getByRole('option').all().length).toBe(6);
  await assertAccessible(document.body);
});

test('empty results expose a status and no active option', async () => {
  await render(<main className="pds-scope"><CommandMenu groups={groups} /></main>);
  const input = page.getByRole('combobox', { name: 'Search commands' });
  await input.fill('xyzabc');
  await expect.element(page.getByRole('status')).toHaveTextContent('No results found.');
  expect(input.element().hasAttribute('aria-activedescendant')).toBe(false);
  await assertAccessible(document.body);
});

test('overlay contains focus, closes with Escape and returns focus to its trigger', async () => {
  const action = vi.fn();
  await render(<OverlayFixture onSelect={action} />);
  const trigger = page.getByRole('button', { name: 'Open commands' });
  await trigger.click();
  await expect.element(page.getByRole('dialog', { name: 'Command menu' })).toBeVisible();
  await expect.element(page.getByRole('combobox', { name: 'Search commands' })).toHaveFocus();
  await assertAccessible(document.body);
  await userEvent.keyboard('{Tab}');
  expect(document.activeElement?.closest('dialog')).toBeTruthy();
  await userEvent.keyboard('{Escape}');
  await expect.element(trigger).toHaveFocus();
  expect(document.querySelector('dialog')?.open).toBe(false);
  expect(action).not.toHaveBeenCalled();
});

test('dark Command Menu retains accessible names and contrast', async () => {
  document.documentElement.setAttribute('data-theme', 'dark');
  await render(<main className="pds-scope"><CommandMenu groups={groups} /></main>);
  await expect.element(page.getByRole('combobox', { name: 'Search commands' })).toBeVisible();
  await assertAccessible(document.body);
});

test('overlay selection activates once and returns focus', async () => {
  const action = vi.fn();
  await render(<OverlayFixture onSelect={action} />);
  const trigger = page.getByRole('button', { name: 'Open commands' });
  await trigger.click();
  await userEvent.keyboard('{ArrowDown}{Enter}');
  expect(action).toHaveBeenCalledExactlyOnceWith('calendar');
  await expect.element(trigger).toHaveFocus();
});
