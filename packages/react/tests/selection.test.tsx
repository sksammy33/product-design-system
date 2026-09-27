import { afterEach, expect, test, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { page, userEvent } from 'vitest/browser';
import { Checkbox, Radio, Switch } from '@product-design-system/react';
import type { SwitchSize } from '@product-design-system/react';
import { assertAccessible } from './accessibility';

afterEach(() => document.documentElement.removeAttribute('data-theme'));
const color = (element: Element, token: string) => {
  const probe = document.createElement('span');
  probe.style.color = `var(--${token})`;
  (element instanceof HTMLInputElement ? element.closest('label')! : element).append(probe);
  const result = getComputedStyle(probe).color;
  probe.remove();
  return result;
};

test('Checkbox uses native form behavior, label activation and a real indeterminate state', async () => {
  const change = vi.fn();
  await render(<form><Checkbox name="terms" label="Accept terms" onChange={change} />
    <Checkbox name="options" label="Partial selection" indeterminate helperText="Some options selected" /></form>);
  const terms = page.getByRole('checkbox', { name: 'Accept terms' });
  await page.getByText('Accept terms').click();
  await expect.element(terms).toBeChecked();
  expect(new FormData(document.querySelector('form')!).get('terms')).toBe('on');
  await terms.click();
  await expect.element(terms).not.toBeChecked();
  expect(change).toHaveBeenCalledTimes(2);
  const partial = page.getByRole('checkbox', { name: 'Partial selection' });
  expect((partial.element() as HTMLInputElement).indeterminate).toBe(true);
  await expect.element(partial).toHaveAccessibleDescription('Some options selected');
  await assertAccessible(document.querySelector('form')!);
});

test('Checkbox Space toggles, disabled is inert, and Error has associated text', async () => {
  await render(<main className="pds-scope"><Checkbox label="Email updates" />
    <Checkbox label="Disabled checked" defaultChecked disabled />
    <Checkbox label="Needs review" error errorText="Select a valid option" /></main>);
  const active = page.getByRole('checkbox', { name: 'Email updates' });
  await userEvent.tab();
  await expect.element(active).toHaveFocus();
  await userEvent.keyboard(' ');
  await expect.element(active).toBeChecked();
  const disabled = page.getByRole('checkbox', { name: 'Disabled checked' });
  await expect.element(disabled).toBeDisabled();
  await expect.element(disabled).toBeChecked();
  const error = page.getByRole('checkbox', { name: 'Needs review' });
  await expect.element(error).toHaveAttribute('aria-invalid', 'true');
  await expect.element(error).toHaveAccessibleDescription('Select a valid option');
  await assertAccessible(page.getByRole('main').element());
});

test('Radio groups select one native value and support arrow-key movement', async () => {
  await render(<form><fieldset><legend>Delivery</legend>
    <Radio name="delivery" value="standard" label="Standard" defaultChecked helperText="Three days" />
    <Radio name="delivery" value="express" label="Express" />
    <Radio name="delivery" value="pickup" label="Pickup" disabled />
  </fieldset></form>);
  const standard = page.getByRole('radio', { name: 'Standard' });
  const express = page.getByRole('radio', { name: 'Express' });
  await standard.click();
  await userEvent.keyboard('{ArrowDown}');
  await expect.element(express).toBeChecked();
  await expect.element(standard).not.toBeChecked();
  expect(new FormData(document.querySelector('form')!).get('delivery')).toBe('express');
  await expect.element(standard).toHaveAccessibleDescription('Three days');
  await expect.element(page.getByRole('radio', { name: 'Pickup' })).toBeDisabled();
  await assertAccessible(document.querySelector('form')!);
});

test('Radio Error exposes a message and selected state without relying on color alone', async () => {
  await render(<main className="pds-scope"><Radio name="choice" label="Invalid choice" error errorText="Choose a supported option" defaultChecked /></main>);
  const radio = page.getByRole('radio', { name: 'Invalid choice' });
  await expect.element(radio).toBeChecked();
  await expect.element(radio).toHaveAttribute('aria-invalid', 'true');
  await expect.element(radio).toHaveAccessibleDescription('Choose a supported option');
  await assertAccessible(page.getByRole('main').element());
});

test('Switch has switch semantics, native form value, label click and hidden-label name', async () => {
  await render(<form><Switch name="alerts" label="Alerts" />
    <Switch name="private" label="Private mode" showLabel={false} /></form>);
  const alerts = page.getByRole('switch', { name: 'Alerts' });
  await page.getByText('Alerts').click();
  await expect.element(alerts).toBeChecked();
  expect(new FormData(document.querySelector('form')!).get('alerts')).toBe('on');
  const privateMode = page.getByRole('switch', { name: 'Private mode' });
  await expect.element(privateMode).toHaveAccessibleName('Private mode');
  await privateMode.click();
  await expect.element(privateMode).toBeChecked();
  await assertAccessible(document.querySelector('form')!);
});

test('Switch Space toggles and disabled switches cannot activate', async () => {
  const change = vi.fn();
  await render(<main className="pds-scope"><Switch label="Notifications" onChange={change} />
    <Switch label="Locked" defaultChecked disabled /></main>);
  const active = page.getByRole('switch', { name: 'Notifications' });
  await userEvent.tab();
  await expect.element(active).toHaveFocus();
  await userEvent.keyboard(' ');
  await expect.element(active).toBeChecked();
  expect(change).toHaveBeenCalledOnce();
  const disabled = page.getByRole('switch', { name: 'Locked' });
  await expect.element(disabled).toBeDisabled();
  await expect.element(disabled).toBeChecked();
  await assertAccessible(page.getByRole('main').element());
});

test('Selection geometry follows Figma and Switch typography uses the approved override', async () => {
  const sizes: SwitchSize[] = ['small', 'medium', 'large'];
  await render(<main className="pds-scope"><Checkbox label="Geometry checkbox" defaultChecked />
    <Radio name="geo" label="Geometry radio" defaultChecked />
    {sizes.map(size => <Switch key={size} size={size} label={`${size} switch`} />)}</main>);
  for (const [role, name] of [['checkbox', 'Geometry checkbox'], ['radio', 'Geometry radio']] as const) {
    const input = page.getByRole(role, { name }).element();
    expect(input.parentElement!.getBoundingClientRect().width).toBe(24);
    expect(input.nextElementSibling!.getBoundingClientRect().width).toBe(16);
    expect(input.nextElementSibling!.getBoundingClientRect().height).toBe(16);
  }
  const check = page.getByRole('checkbox', { name: 'Geometry checkbox' }).element();
  expect(check.nextElementSibling!.querySelector('svg')!.getBoundingClientRect().width).toBe(12);
  const dot = page.getByRole('radio', { name: 'Geometry radio' }).element().nextElementSibling!.firstElementChild!;
  expect(dot.getBoundingClientRect().width).toBe(8);
  for (const [index, size] of sizes.entries()) {
    const input = page.getByRole('switch', { name: `${size} switch` }).element();
    const track = input.nextElementSibling!;
    expect(track.getBoundingClientRect().width).toBe([28, 36, 44][index]);
    expect(track.getBoundingClientRect().height).toBe([16, 20, 24][index]);
    expect(track.firstElementChild!.getBoundingClientRect().width).toBe([12, 16, 20][index]);
    expect(parseFloat(getComputedStyle(input.closest('label')!.querySelector('span[id$="-label"]')!).fontSize)).toBe(14);
  }
});

test('Light and Dark Selection colors and visible keyboard focus resolve from approved tokens', async () => {
  await render(<main className="pds-scope"><Checkbox label="Checkbox default" />
    <Checkbox label="Checkbox checked" defaultChecked />
    <Checkbox label="Checkbox error" defaultChecked error errorText="Error" />
    <Radio name="theme" label="Radio default" />
    <Radio name="theme" label="Radio selected" defaultChecked />
    <Radio name="error-theme" label="Radio selected error" defaultChecked error errorText="Review selection" />
    <Switch label="Switch off" />
    <Switch label="Switch on" defaultChecked /></main>);
  for (const theme of ['light', 'dark']) {
    document.documentElement.dataset.theme = theme;
    const checked = page.getByRole('checkbox', { name: 'Checkbox checked' }).element();
    expect(getComputedStyle(checked.nextElementSibling!).backgroundColor)
      .toBe(color(checked, 'color-semantic-background-brand'));
    const error = page.getByRole('checkbox', { name: 'Checkbox error' }).element();
    expect(getComputedStyle(error.nextElementSibling!.querySelector('svg')!).color)
      .toBe(color(error, 'color-semantic-icon-default'));
    const selected = page.getByRole('radio', { name: 'Radio selected', exact: true }).element();
    expect(getComputedStyle(selected.nextElementSibling!.firstElementChild!).backgroundColor)
      .toBe(color(selected, 'color-semantic-background-brand'));
    const selectedError = page.getByRole('radio', { name: 'Radio selected error' }).element();
    expect(getComputedStyle(selectedError.nextElementSibling!.firstElementChild!).backgroundColor)
      .toBe(color(selectedError, 'color-semantic-icon-danger'));
    const on = page.getByRole('switch', { name: 'Switch on' }).element();
    expect(getComputedStyle(on.nextElementSibling!).backgroundColor)
      .toBe(color(on, 'color-semantic-background-brand'));
    await assertAccessible(page.getByRole('main').element());
  }
  const off = page.getByRole('switch', { name: 'Switch off' });
  await off.element().focus();
  await expect.element(off).toHaveFocus();
  expect(getComputedStyle(off.element().nextElementSibling!, '::after').borderTopWidth).toBe('2px');
  expect(getComputedStyle(off.element().nextElementSibling!, '::after').borderTopColor)
    .toBe(color(off.element(), 'color-semantic-border-focus'));
});
