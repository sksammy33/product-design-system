import { useState } from 'react';
import { expect, test, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { page, userEvent } from 'vitest/browser';
import { BottomSheet, Button, ConfirmationDialog, Dialog, Drawer } from '@product-design-system/react';
import type { DialogSize, DialogState } from '@product-design-system/react';
import { assertAccessible } from './accessibility';

type ModalKind = 'dialog' | 'confirmation' | 'drawer' | 'sheet';
function Fixture({ kind, size = 'small', state = 'default', direction = 'left', onConfirm = () => {} }:
  { kind: ModalKind; size?: DialogSize; state?: DialogState; direction?: 'left' | 'right'; onConfirm?: () => void }) {
  const [open, setOpen] = useState(false);
  return <main className="pds-scope"><Button onClick={() => setOpen(true)}>Open surface</Button>
    <button type="button" onClick={onConfirm}>Background action</button>
    {kind === 'dialog' && <Dialog open={open} onOpenChange={setOpen} size={size} state={state}
      title={state === 'destructive' ? 'Delete Item' : 'Dialog Title'} description="A brief description of the dialog purpose."
      onConfirm={onConfirm}><p>Dialog content goes here.</p><button type="button">Content action</button></Dialog>}
    {kind === 'confirmation' && <ConfirmationDialog open={open} onOpenChange={setOpen} state={state} onConfirm={onConfirm} />}
    {kind === 'drawer' && <Drawer open={open} onOpenChange={setOpen} title="Drawer Title" description="Drawer description text"
      size={size} direction={direction} onConfirm={onConfirm}><p>Drawer content goes here.</p><button type="button">Content action</button></Drawer>}
    {kind === 'sheet' && <BottomSheet open={open} onOpenChange={setOpen} size={size} onConfirm={onConfirm}>
      <p>Bottom sheet content goes here.</p><button type="button">Content action</button></BottomSheet>}
  </main>;
}

test.each(['small', 'medium', 'large'] as const)('Dialog %s width and title association', async size => {
  await render(<Fixture kind="dialog" size={size} />);
  await page.getByRole('button', { name: 'Open surface' }).click();
  const dialog = page.getByRole('dialog', { name: 'Dialog Title' });
  await expect.element(dialog).toBeVisible();
  expect(Math.round(dialog.element().getBoundingClientRect().width)).toBe(Math.min({ small: 400, medium: 520, large: 640 }[size], window.innerWidth - 24));
  expect(dialog.element().getAttribute('aria-describedby')).toBeTruthy();
  await assertAccessible(document.body);
});

test('modal traps focus, blocks the background and restores focus after Escape', async () => {
  const background = vi.fn();
  await render(<Fixture kind="dialog" onConfirm={background} />);
  const trigger = page.getByRole('button', { name: 'Open surface' });
  await trigger.click();
  expect(document.querySelector('dialog')?.open).toBe(true);
  await userEvent.keyboard('{Tab}');
  expect(document.activeElement?.closest('dialog')).toBeTruthy();
  await page.getByRole('button', { name: 'Background action' }).click({ force: true }).catch(() => {});
  expect(background).not.toHaveBeenCalled();
  await userEvent.keyboard('{Escape}');
  await expect.element(trigger).toHaveFocus();
  expect(document.querySelector('dialog')?.open).toBe(false);
});

test('Dialog destructive action is clearly named and loading blocks duplicate actions', async () => {
  const confirm = vi.fn();
  await render(<Fixture kind="dialog" state="destructive" onConfirm={confirm} />);
  await page.getByRole('button', { name: 'Open surface' }).click();
  await page.getByRole('button', { name: 'Delete' }).click();
  expect(confirm).toHaveBeenCalledOnce();
  await assertAccessible(document.body);
  await page.getByRole('button', { name: 'Close dialog' }).click();
  await render(<Fixture kind="dialog" state="loading" onConfirm={confirm} />);
  await page.getByRole('button', { name: 'Open surface' }).last().click();
  await expect.element(page.getByRole('button', { name: 'Confirm in progress' })).toBeDisabled();
  await userEvent.keyboard('{Escape}');
  expect(document.querySelectorAll('dialog[open]').length).toBe(1);
  expect(confirm).toHaveBeenCalledOnce();
});

test.each(['default', 'loading', 'destructive'] as const)('Confirmation Dialog %s state is accessible', async state => {
  const confirm = vi.fn();
  await render(<Fixture kind="confirmation" state={state} onConfirm={confirm} />);
  await page.getByRole('button', { name: 'Open surface' }).click();
  const dialog = page.getByRole('dialog');
  await expect.element(dialog).toBeVisible();
  if (state === 'loading') await expect.element(page.getByRole('button', { name: 'Confirm in progress' })).toBeDisabled();
  if (state === 'destructive') await expect.element(page.getByRole('button', { name: 'Delete' })).toBeEnabled();
  await assertAccessible(document.body);
});

test.each(['left', 'right'] as const)('Drawer %s focus and width', async direction => {
  await render(<Fixture kind="drawer" size="medium" direction={direction} />);
  const trigger = page.getByRole('button', { name: 'Open surface' });
  await trigger.click();
  const dialog = page.getByRole('dialog', { name: 'Drawer Title' });
  expect(Math.round(dialog.element().getBoundingClientRect().width)).toBe(Math.min(420, window.innerWidth));
  await assertAccessible(document.body);
  await userEvent.keyboard('{Escape}');
  await expect.element(trigger).toHaveFocus();
});

test.each(['small', 'medium', 'large'] as const)('Bottom Sheet %s height and focus return', async size => {
  await render(<Fixture kind="sheet" size={size} />);
  const trigger = page.getByRole('button', { name: 'Open surface' });
  await trigger.click();
  const dialog = page.getByRole('dialog', { name: 'Bottom Sheet' });
  expect(Math.round(dialog.element().getBoundingClientRect().height)).toBe({ small: 280, medium: 360, large: 440 }[size]);
  await assertAccessible(document.body);
  await page.getByRole('button', { name: 'Close bottom sheet' }).click();
  await expect.element(trigger).toHaveFocus();
});
