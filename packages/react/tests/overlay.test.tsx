import { afterEach, expect, test, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { page, userEvent } from 'vitest/browser';
import { Button, ContextMenu, Divider, Dropdown, Menu, MenuItem, Popover, Tooltip } from '@product-design-system/react';
import type { MenuEntry } from '@product-design-system/react';
import { assertAccessible } from './accessibility';

afterEach(() => document.documentElement.removeAttribute('data-theme'));
const items: MenuEntry[] = [
  { type: 'label', label: 'Actions' },
  { id: 'open', label: 'Open', shortcut: '⌘O' },
  { id: 'locked', label: 'Locked', disabled: true },
  { type: 'separator' },
  { id: 'save', label: 'Save' },
  { id: 'delete', label: 'Delete', destructive: true },
];
const submenuItems: MenuEntry[] = [
  { id: 'share', label: 'Share' },
  { id: 'tools', label: 'More Tools', submenu: [
    { id: 'developer', label: 'Developer Tools' },
    { id: 'disabled-tool', label: 'Unavailable Tool', disabled: true },
    { id: 'extensions', label: 'Extensions' },
  ] },
  { id: 'settings', label: 'Settings' },
];

test('Divider is an eight-pixel semantic separator and Menu Item has approved geometry', async () => {
  await render(<main className="pds-scope"><div role="menu" aria-label="Example menu" style={{ width: 240 }}>
    <MenuItem label="Menu Item" shortcut="⌘K" /><Divider /><MenuItem label="Danger" destructive />
  </div></main>);
  const item = page.getByRole('menuitem', { name: 'Menu Item' });
  expect(item.element().getBoundingClientRect().height).toBe(36);
  expect(item.element().querySelector('svg')!.getBoundingClientRect().width).toBe(16);
  expect(page.getByRole('separator').element().getBoundingClientRect().height).toBe(8);
  await assertAccessible(page.getByRole('main').element());
});

test('Standalone Menu Item activates with keyboard but disabled actions remain inert', async () => {
  const active = vi.fn();
  const blocked = vi.fn();
  await render(<div role="menu" aria-label="Actions"><MenuItem label="Run" onSelect={active} />
    <MenuItem label="Blocked" disabled onSelect={blocked} /></div>);
  const run = page.getByRole('menuitem', { name: 'Run' });
  run.element().focus();
  await userEvent.keyboard('{Enter}');
  await userEvent.keyboard(' ');
  expect(active).toHaveBeenCalledTimes(2);
  await page.getByRole('menuitem', { name: 'Blocked' }).click({ force: true });
  expect(blocked).not.toHaveBeenCalled();
});

test('Menu arrows, Home/End, typeahead and activation skip disabled items', async () => {
  const action = vi.fn();
  const close = vi.fn();
  await render(<main className="pds-scope"><Menu label="Actions" items={items} onAction={action} onClose={close} /></main>);
  await expect.element(page.getByRole('menuitem', { name: 'Open' })).toHaveFocus();
  await userEvent.keyboard('{ArrowDown}');
  await expect.element(page.getByRole('menuitem', { name: 'Save' })).toHaveFocus();
  await userEvent.keyboard('{End}');
  await expect.element(page.getByRole('menuitem', { name: 'Delete' })).toHaveFocus();
  await userEvent.keyboard('{Home}');
  await expect.element(page.getByRole('menuitem', { name: 'Open' })).toHaveFocus();
  await userEvent.keyboard('d');
  await expect.element(page.getByRole('menuitem', { name: 'Delete' })).toHaveFocus();
  await userEvent.keyboard('{Enter}');
  expect(action).toHaveBeenCalledWith('delete');
  await userEvent.keyboard('{Escape}');
  expect(close).toHaveBeenCalledOnce();
  await assertAccessible(page.getByRole('main').element());
});

test('Tooltip attaches only while visible, has no interactive contents and Escape dismisses it', async () => {
  await render(<main className="pds-scope"><Tooltip trigger={<Button>Save</Button>} shortcut="⌘S">Save changes</Tooltip></main>);
  const button = page.getByRole('button', { name: 'Save' });
  expect(button.element().getAttribute('aria-describedby')).toBeNull();
  button.element().focus();
  const tooltip = page.getByRole('tooltip');
  await expect.element(tooltip).toBeVisible();
  await expect.element(button).toHaveAccessibleDescription('Save changes ⌘S');
  expect(tooltip.element().querySelectorAll('button,a,input,[tabindex]').length).toBe(0);
  expect(getComputedStyle(tooltip.element()).pointerEvents).toBe('none');
  await userEvent.keyboard('{Escape}');
  await expect.element(tooltip).not.toBeInTheDocument();
  await expect.element(button).toHaveFocus();
  await assertAccessible(page.getByRole('main').element());
});

test('All four approved Tooltip positions render their exact arrow sizes', async () => {
  await render(<main className="pds-scope" style={{ display: 'flex', gap: 80, padding: 100 }}>
    {(['top', 'bottom', 'left', 'right'] as const).map(position => <Tooltip key={position} position={position}
      trigger={<Button>{position}</Button>}>Hint {position}</Tooltip>)}
  </main>);
  for (const position of ['top', 'bottom', 'left', 'right'] as const) {
    const trigger = page.getByRole('button', { name: position });
    trigger.element().focus();
    await expect.element(page.getByRole('tooltip')).toBeVisible();
    const image = page.getByRole('tooltip').element().querySelector('img')!;
    expect(image.getBoundingClientRect().width).toBe(position === 'top' || position === 'bottom' ? 10 : 5);
    expect(image.getBoundingClientRect().height).toBe(position === 'top' || position === 'bottom' ? 5 : 10);
  }
});

test('Popover is a labeled dialog; Escape, close and actions return focus', async () => {
  const apply = vi.fn();
  const cancel = vi.fn();
  await render(<main className="pds-scope" style={{ padding: 250 }}><Popover triggerLabel="Open details" title="Popover Title"
    description="Details for this action" onApply={apply} onCancel={cancel}>
    <p>Popover content goes here.</p>
  </Popover></main>);
  const trigger = page.getByRole('button', { name: 'Open details' });
  await trigger.click();
  await expect.element(trigger).toHaveAttribute('aria-expanded', 'true');
  const dialog = page.getByRole('dialog', { name: 'Popover Title' });
  await expect.element(dialog).toBeVisible();
  await expect.element(dialog).toHaveAccessibleDescription('Details for this action');
  await expect.element(page.getByRole('button', { name: 'Close popover' })).toHaveFocus();
  await userEvent.keyboard('{Escape}');
  await expect.element(trigger).toHaveFocus();
  await expect.element(dialog).not.toBeInTheDocument();
  await trigger.click();
  await page.getByRole('button', { name: 'Cancel' }).click();
  expect(cancel).toHaveBeenCalledOnce();
  await expect.element(trigger).toHaveFocus();
  await trigger.click();
  await page.getByRole('button', { name: 'Apply' }).click();
  expect(apply).toHaveBeenCalledOnce();
  await expect.element(trigger).toHaveFocus();
  await assertAccessible(page.getByRole('main').element());
});

test('Dropdown trigger relationships, menu keyboard navigation and focus return', async () => {
  const selected = vi.fn();
  await render(<main className="pds-scope" style={{ padding: 48 }}><Dropdown label="Select option" items={items} onSelect={selected} />
    <Button>Outside</Button></main>);
  const trigger = page.getByRole('button', { name: 'Select option' });
  await trigger.click();
  const menu = page.getByRole('menu');
  await expect.element(trigger).toHaveAttribute('aria-expanded', 'true');
  expect(trigger.element().getAttribute('aria-controls')).toBe(menu.element().id);
  await expect.element(page.getByRole('menuitem', { name: 'Open' })).toHaveFocus();
  await userEvent.keyboard('{ArrowDown}{Enter}');
  expect(selected).toHaveBeenCalledWith('save');
  await expect.element(page.getByRole('button', { name: 'Save' })).toHaveFocus();
  await expect.element(menu).not.toBeInTheDocument();
  await page.getByRole('button', { name: 'Save' }).click();
  await userEvent.keyboard('{Escape}');
  await expect.element(page.getByRole('button', { name: 'Save' })).toHaveFocus();
  await expect.element(page.getByRole('button', { name: 'Save' })).toHaveAttribute('aria-expanded', 'false');
  await assertAccessible(page.getByRole('main').element());
});

test('Dropdown outside click preserves outside focus and disabled item cannot activate', async () => {
  const selected = vi.fn();
  await render(<main className="pds-scope" style={{ padding: 48 }}><Dropdown items={items} onSelect={selected} />
    <Button>Outside</Button><Dropdown label="Disabled dropdown" items={items} disabled /></main>);
  await page.getByRole('button', { name: 'Select option' }).click();
  await page.getByRole('menuitem', { name: 'Locked' }).click({ force: true });
  expect(selected).not.toHaveBeenCalled();
  await page.getByRole('button', { name: 'Outside' }).click();
  await expect.element(page.getByRole('button', { name: 'Outside' })).toHaveFocus();
  await expect.element(page.getByRole('menu')).not.toBeInTheDocument();
  await expect.element(page.getByRole('button', { name: 'Disabled dropdown' })).toBeDisabled();
});

test('Context Menu opens at pointer, activates then returns focus', async () => {
  const action = vi.fn();
  const contextItems: MenuEntry[] = [{ id: 'inspect', label: 'Inspect', onSelect: action }, { id: 'blocked', label: 'Blocked', disabled: true }];
  await render(<main className="pds-scope" style={{ padding: 100 }}><ContextMenu label="Canvas" items={contextItems}>
    <span>Canvas area</span></ContextMenu></main>);
  const target = page.getByRole('group', { name: 'Canvas' });
  target.element().dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true, clientX: 100, clientY: 120 }));
  await expect.element(page.getByRole('menu')).toBeVisible();
  await expect.element(target).toHaveAttribute('aria-expanded', 'true');
  await expect.element(page.getByRole('menuitem', { name: 'Inspect' })).toHaveFocus();
  await userEvent.keyboard('{Enter}');
  expect(action).toHaveBeenCalledOnce();
  await expect.element(target).toHaveFocus();
  await assertAccessible(page.getByRole('main').element());
});

test('Context Menu supports Shift+F10, submenu ArrowRight/Left, Escape and disabled items', async () => {
  const action = vi.fn();
  const entries = submenuItems.map(item => item.type === undefined && item.id === 'tools' ?
    { ...item, submenu: [{ id: 'developer', label: 'Developer Tools', onSelect: action },
      { id: 'blocked', label: 'Blocked', disabled: true }] } : item);
  await render(<main className="pds-scope" style={{ padding: 100 }}><ContextMenu label="Canvas" items={entries}>
    <span>Canvas area</span></ContextMenu></main>);
  const target = page.getByRole('group', { name: 'Canvas' });
  target.element().focus();
  target.element().dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key: 'F10', shiftKey: true }));
  await expect.element(page.getByRole('menuitem', { name: 'Share' })).toHaveFocus();
  await userEvent.keyboard('{ArrowDown}{ArrowRight}');
  await expect.element(page.getByRole('menuitem', { name: 'Developer Tools' })).toHaveFocus();
  await expect.element(page.getByRole('menuitem', { name: 'Blocked' })).toHaveAttribute('aria-disabled', 'true');
  await userEvent.keyboard('{ArrowDown}');
  await expect.element(page.getByRole('menuitem', { name: 'Developer Tools' })).toHaveFocus();
  await userEvent.keyboard('{ArrowLeft}');
  await expect.element(page.getByRole('menuitem', { name: 'More Tools' })).toHaveFocus();
  await userEvent.keyboard('{ArrowRight}{Escape}');
  await expect.element(page.getByRole('menuitem', { name: 'More Tools' })).toHaveFocus();
  await userEvent.keyboard('{ArrowRight}{Enter}');
  expect(action).toHaveBeenCalledOnce();
  await expect.element(target).toHaveFocus();
});

test('Open overlay surfaces and tooltip pass axe in both themes', async () => {
  await render(<main className="pds-scope" style={{ padding: 24, display: 'flex', gap: 24, flexWrap: 'wrap', minHeight: '100vh' }}>
    <Tooltip trigger={<Button>Help</Button>} position="right">A short hint</Tooltip>
    <Dropdown items={items} />
    <Popover triggerLabel="Details" title="Details"><p>Useful details.</p></Popover>
    <ContextMenu label="Canvas" items={submenuItems}><span>Context area</span></ContextMenu>
  </main>);
  for (const theme of ['light', 'dark']) {
    document.documentElement.dataset.theme = theme;
    page.getByRole('button', { name: 'Help' }).element().focus();
    await assertAccessible(page.getByRole('main').element());
    await page.getByRole('button', { name: 'Select option' }).click();
    await assertAccessible(document.body);
    await userEvent.keyboard('{Escape}');
    await page.getByRole('button', { name: 'Details' }).click();
    await assertAccessible(document.body);
    await userEvent.keyboard('{Escape}');
    const target = page.getByRole('group', { name: 'Canvas' });
    target.element().dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true, clientX: 250, clientY: 270 }));
    await assertAccessible(document.body);
    await userEvent.keyboard('{Escape}');
  }
});
