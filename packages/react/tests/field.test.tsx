import { afterEach, expect, test, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { Mail, Search } from 'lucide-react';
import { Input, Textarea } from '@product-design-system/react';
import { assertAccessible } from './accessibility';

afterEach(() => document.documentElement.removeAttribute('data-theme'));
const sizes = ['small', 'medium', 'large'] as const;
const color = (element: Element, token: string) => {
  const ref = document.createElement('span');
  ref.style.color = `var(--${token})`;
  element.append(ref);
  const result = getComputedStyle(ref).color;
  ref.remove();
  return result;
};

test('Input and Textarea have native labels, helper descriptions and keyboard editing', async () => {
  await render(<form><Input label="Email" name="email" type="email" helperText="Use your work address" />
    <Textarea label="Notes" name="notes" helperText="Add context" /></form>);
  const email = page.getByRole('textbox', { name: 'Email' });
  const notes = page.getByRole('textbox', { name: 'Notes' });
  await email.fill('a@example.com');
  await notes.fill('First line\nSecond line');
  await expect.element(email).toHaveValue('a@example.com');
  await expect.element(notes).toHaveValue('First line\nSecond line');
  await expect.element(email).toHaveAccessibleDescription('Use your work address');
  await expect.element(notes).toHaveAccessibleDescription('Add context');
  const form = document.querySelector('form')!;
  expect(new FormData(form).get('email')).toBe('a@example.com');
  expect(new FormData(form).get('notes')).toBe('First line\nSecond line');
  await assertAccessible(form);
});

test('approved size tiers, typography, padding and radius render in both controls', async () => {
  await render(<div>{sizes.map(size => <div key={size}><Input label={`Input ${size}`} size={size} />
    <Textarea label={`Textarea ${size}`} size={size} /></div>)}</div>);
  for (const [i, size] of sizes.entries()) {
    const input = page.getByRole('textbox', { name: `Input ${size}` }).element() as HTMLInputElement;
    const textarea = page.getByRole('textbox', { name: `Textarea ${size}` }).element() as HTMLTextAreaElement;
    const field = input.parentElement!, area = textarea.parentElement!;
    expect(field.getBoundingClientRect().height).toBe([32, 40, 48][i]);
    expect(area.getBoundingClientRect().height).toBe([80, 100, 120][i]);
    expect(parseFloat(getComputedStyle(input).fontSize)).toBe([14, 14, 16][i]);
    expect(parseFloat(getComputedStyle(textarea).fontSize)).toBe([14, 14, 16][i]);
    expect(getComputedStyle(field).borderRadius).toBe('8px');
    expect(getComputedStyle(field).paddingLeft).toBe(['10px', '12px', '16px'][i]);
    expect(getComputedStyle(area).paddingLeft).toBe(['10px', '12px', '16px'][i]);
  }
});

test('disabled and read-only use native behavior and source-backed colors/opacity', async () => {
  await render(<><Input label="Disabled input" disabled defaultValue="Locked" />
    <Textarea label="Disabled notes" disabled defaultValue="Locked" />
    <Input label="Read only input" readOnly defaultValue="Fixed" />
    <Textarea label="Read only notes" readOnly defaultValue="Fixed" /></>);
  const disabledInput = page.getByRole('textbox', { name: 'Disabled input' });
  const disabledArea = page.getByRole('textbox', { name: 'Disabled notes' });
  await expect.element(disabledInput).toBeDisabled();
  await expect.element(disabledArea).toBeDisabled();
  expect(getComputedStyle(disabledInput.element().parentElement!.parentElement!).opacity).toBe('0.6');
  expect(getComputedStyle(disabledArea.element().parentElement!.parentElement!).opacity).toBe('0.6');
  const input = page.getByRole('textbox', { name: 'Read only input' });
  const area = page.getByRole('textbox', { name: 'Read only notes' });
  await expect.element(input).toHaveAttribute('readonly');
  await expect.element(area).toHaveAttribute('readonly');
  expect(getComputedStyle(input.element().parentElement!).backgroundColor)
    .toBe(color(input.element().parentElement!, 'color-semantic-background-subtle'));
  await assertAccessible(page.getByRole('textbox', { name: 'Read only input' }).element().parentElement!.parentElement!);
});

test('validation messages are associated and only Error marks the control invalid', async () => {
  await render(<main className="pds-scope"><Input label="Code" validation="error" validationMessage="Invalid code" required />
    <Input label="Amount" validation="warning" validationMessage="Check amount" />
    <Input label="Reference" validation="success" validationMessage="Accepted" />
    <Textarea label="Details" validation="error" validationMessage="Details required" required /></main>);
  for (const [name, description, invalid] of [
    ['Code', 'Invalid code', true], ['Amount', 'Check amount', false],
    ['Reference', 'Accepted', false], ['Details', 'Details required', true],
  ] as const) {
    const field = page.getByRole('textbox', { name, exact: true });
    await expect.element(field).toHaveAccessibleDescription(description);
    if (invalid) await expect.element(field).toHaveAttribute('aria-invalid', 'true');
    else expect(field.element().getAttribute('aria-invalid')).not.toBe('true');
  }
  const icon = page.getByRole('textbox', { name: 'Code' }).element().parentElement!.parentElement!.querySelector('svg')!;
  expect(icon.getBoundingClientRect().width).toBe(14);
  expect(page.getByRole('textbox', { name: 'Details' }).element().parentElement!.parentElement!.querySelector('svg')).toBeNull();
  await assertAccessible(page.getByRole('main').element());
});

test('icons, prefix and suffix stay visual while meaningful units are described', async () => {
  await render(<Input label="Price" leadingIcon={<Search />} trailingIcon={<Mail />}
    prefix="$" suffix="USD" helperText="Before tax" />);
  const input = page.getByRole('textbox', { name: 'Price' });
  await expect.element(input).toHaveAccessibleDescription('$ USD Before tax');
  expect(input.element().parentElement!.querySelectorAll('svg')).toHaveLength(2);
  await assertAccessible(input.element().parentElement!.parentElement!);
});

test('clear action is supported, does not submit, clears uncontrolled value and restores focus', async () => {
  const onClear = vi.fn(), submit = vi.fn((event: FormEvent) => event.preventDefault());
  await render(<form onSubmit={submit}><Input label="Search" defaultValue="query" clearable onClear={onClear} /></form>);
  const input = page.getByRole('textbox', { name: 'Search' });
  await page.getByRole('button', { name: 'Clear Search' }).click();
  await expect.element(input).toHaveValue('');
  await expect.element(input).toHaveFocus();
  expect(onClear).toHaveBeenCalledOnce();
  expect(submit).not.toHaveBeenCalled();
  expect(document.querySelector('button[aria-label="Clear Search"]')).toBeNull();
});

test('controlled clear calls owner and native form data follows the owner value', async () => {
  function Controlled() {
    const [value, setValue] = useState('query');
    return <form><Input label="Search" name="search" value={value} onChange={event => setValue(event.target.value)}
      clearable onClear={() => setValue('')} /></form>;
  }
  await render(<Controlled />);
  await page.getByRole('button', { name: 'Clear Search' }).click();
  const input = page.getByRole('textbox', { name: 'Search' });
  await expect.element(input).toHaveValue('');
  expect(new FormData(document.querySelector('form')!).get('search')).toBe('');
});

test('Light and Dark field colors and focus shadow resolve from generated tokens', async () => {
  await render(<main className="pds-scope"><Input label="Name" helperText="Your name" />
    <Textarea label="Notes" helperText="Details" /></main>);
  for (const theme of ['light', 'dark']) {
    document.documentElement.dataset.theme = theme;
    const input = page.getByRole('textbox', { name: 'Name' });
    const field = input.element().parentElement!;
    expect(getComputedStyle(field).backgroundColor).toBe(color(field, 'color-semantic-background-default'));
    await input.click();
    expect(getComputedStyle(field).boxShadow).not.toBe('none');
    await assertAccessible(page.getByRole('main').element());
  }
});

test('long labels and content reflow inside narrow containers without losing names', async () => {
  const label = 'A long descriptive label for this form control';
  await render(<main className="pds-scope"><div style={{ width: '128px' }}><Input label={label} helperText="A long supporting message that must wrap" />
    <Textarea label="Long notes" defaultValue="A long sentence of content that stays editable" /></div></main>);
  const input = page.getByRole('textbox', { name: label });
  const textarea = page.getByRole('textbox', { name: 'Long notes' });
  expect(input.element().parentElement!.getBoundingClientRect().width).toBeLessThanOrEqual(128);
  expect(textarea.element().parentElement!.getBoundingClientRect().width).toBeLessThanOrEqual(128);
  await assertAccessible(page.getByRole('main').element());
});
