import { afterEach, expect, test, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { page, userEvent } from 'vitest/browser';
import { Plus } from 'lucide-react';
import { Button } from '@product-design-system/react';
import type { ButtonVariant, ButtonSize } from '@product-design-system/react';
import { assertAccessible } from './accessibility';

afterEach(() => document.documentElement.removeAttribute('data-theme'));
const variants: ButtonVariant[] = ['primary', 'secondary', 'tertiary', 'ghost', 'destructive', 'destructive-secondary', 'link', 'destructive-ghost', 'destructive-link'];
const sizes: ButtonSize[] = ['xs', 'small', 'medium', 'large', 'xl'];
const color = (element: Element, token: string) => {
  const ref = document.createElement('span'); ref.style.color = `var(--${token})`; element.append(ref);
  const result = getComputedStyle(ref).color; ref.remove(); return result;
};
test('native action renders its name, defaults to non-submit and activates by mouse, Enter and Space', async () => {
  const click = vi.fn(); const submit = vi.fn((e: React.FormEvent) => e.preventDefault());
  await render(<form onSubmit={submit}><Button onClick={click}>Save</Button></form>);
  const button = page.getByRole('button', { name: 'Save' });
  await button.click(); await userEvent.keyboard('{Enter}'); await userEvent.keyboard(' ');
  expect(click).toHaveBeenCalledTimes(3); expect(submit).not.toHaveBeenCalled();
  await expect.element(button).toHaveAttribute('type', 'button');
});
test('explicit submit retains native form behavior', async () => {
  const submit = vi.fn((e: React.FormEvent) => e.preventDefault());
  await render(<form onSubmit={submit}><Button type="submit">Submit</Button></form>);
  await page.getByRole('button').click(); expect(submit).toHaveBeenCalledOnce();
});
test('disabled is native, prevents activation and uses approved opacity', async () => {
  const click = vi.fn(); await render(<Button disabled onClick={click}>Save</Button>);
  const button = page.getByRole('button').element() as HTMLButtonElement;
  expect(button.disabled).toBe(true); button.click(); expect(click).not.toHaveBeenCalled();
  expect(getComputedStyle(button).opacity).toBe('0.5');
});
test('loading preserves width, name and icon space, centers the loader and blocks repeated clicks', async () => {
  const click = vi.fn();
  const view = await render(<Button size="medium" leadingIcon={<Plus />} onClick={click}>Save changes</Button>);
  const before = page.getByRole('button', { name: 'Save changes' }).element().getBoundingClientRect();
  await view.rerender(<Button size="medium" leadingIcon={<Plus />} loading onClick={click}>Save changes</Button>);
  const button = page.getByRole('button', { name: 'Save changes' });
  await expect.element(button).toBeDisabled(); await expect.element(button).toHaveAttribute('aria-busy', 'true');
  const node = button.element() as HTMLButtonElement; node.click(); expect(click).not.toHaveBeenCalled();
  const bounds = node.getBoundingClientRect(); expect(bounds.width).toBeCloseTo(before.width, 2);
  const spinner = node.querySelector('.lucide-loader-circle')!.getBoundingClientRect();
  expect(spinner.width).toBe(18); expect(spinner.x + spinner.width / 2).toBeCloseTo(bounds.x + bounds.width / 2, 1);
  expect(spinner.y + spinner.height / 2).toBeCloseTo(bounds.y + bounds.height / 2, 1);
  await assertAccessible(node);
});
test('all size tiers consume approved height, font, icon and spacing values', async () => {
  await render(<div>{sizes.map(size => <Button key={size} size={size} leadingIcon={<Plus />}>{size}</Button>)}</div>);
  const heights = [28, 32, 40, 48, 56], icons = [14, 16, 18, 20, 24], fonts = [12, 12, 14, 16, 16];
  for (const [i, size] of sizes.entries()) {
    const node = page.getByRole('button', { name: size, exact: true }).element();
    expect(node.getBoundingClientRect().height).toBe(heights[i]);
    expect(node.querySelector('svg')!.getBoundingClientRect().width).toBe(icons[i]);
    expect(parseFloat(getComputedStyle(node).fontSize)).toBe(fonts[i]);
    expect(getComputedStyle(node).borderRadius).toBe('8px');
  }
});
test('every variant keeps approved heights with icons, including outlined XL', async () => {
  await render(<div>{variants.flatMap(variant => sizes.map(size => <Button key={variant + size} variant={variant} size={size} leadingIcon={<Plus />}>{variant} {size}</Button>))}</div>);
  for (const variant of variants) for (const [i, size] of sizes.entries()) {
    const node = page.getByRole('button', { name: `${variant} ${size}`, exact: true }).element();
    expect(node.getBoundingClientRect().height).toBe([28, 32, 40, 48, 56][i]);
  }
});
test('variant colors and Light/Dark aliases match the token package and pass axe', async () => {
  await render(<main className="pds-scope" style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-space-16)', padding: 'var(--spacing-space-24)' }}>{variants.map(variant => <Button key={variant} variant={variant}>{variant}</Button>)}</main>);
  for (const theme of ['light', 'dark']) {
    document.documentElement.dataset.theme = theme;
    const primary = page.getByRole('button', { name: 'primary', exact: true }).element();
    expect(getComputedStyle(primary).backgroundColor).toBe(color(primary, 'color-semantic-action-primary-default'));
    const danger = page.getByRole('button', { name: 'destructive', exact: true }).element();
    expect(getComputedStyle(danger).backgroundColor).toBe(color(danger, 'color-semantic-action-destructive-default'));
    const link = page.getByRole('button', { name: 'link', exact: true }).element();
    expect(getComputedStyle(link).color).toBe(color(link, 'color-semantic-text-link'));
    expect(getComputedStyle(link).paddingLeft).toBe('4px');
    await assertAccessible(page.getByRole('main').element());
  }
});
test('hover and keyboard focus use current semantic bindings', async () => {
  await render(<Button>Continue</Button>); const button = page.getByRole('button');
  await button.hover(); const node = button.element();
  expect(getComputedStyle(node).backgroundColor).toBe(color(node, 'color-semantic-action-primary-hover'));
  await userEvent.tab(); await expect.element(button).toHaveFocus();
  expect(getComputedStyle(node).outlineStyle).toBe('solid'); expect(getComputedStyle(node).outlineWidth).toBe('2px');
});
test('toggle state uses aria-pressed; icon-only has an explicit accessible name', async () => {
  await render(<><Button selected>Bold</Button><Button iconOnly aria-label="Add item"><Plus /></Button></>);
  await expect.element(page.getByRole('button', { name: 'Bold' })).toHaveAttribute('aria-pressed', 'true');
  const icon = page.getByRole('button', { name: 'Add item' }); await expect.element(icon).toBeVisible(); await assertAccessible(icon.element());
});
test('long labels remain named and wrap inside a narrow container without clipping', async () => {
  const label = 'Save all changes and continue to the next workflow step';
  await render(<div style={{ width: '128px' }}><Button>{label}</Button></div>);
  const button = page.getByRole('button', { name: label }); const node = button.element();
  expect(node.getBoundingClientRect().width).toBeLessThanOrEqual(128);
  expect(node.scrollWidth).toBeLessThanOrEqual(node.clientWidth);
  expect(node.scrollHeight).toBeLessThanOrEqual(node.clientHeight);
  await assertAccessible(node);
});
