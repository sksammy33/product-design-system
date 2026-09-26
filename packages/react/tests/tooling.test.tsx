import { afterEach, expect, test } from 'vitest';
import { render } from 'vitest-browser-react';
import { page, userEvent } from 'vitest/browser';
import { cssVariables } from '@product-design-system/tokens';
import type { Theme } from '@product-design-system/react';
import { ToolingFixture } from './fixtures/ToolingFixture';
import { assertAccessible } from './accessibility';

afterEach(() => document.documentElement.removeAttribute('data-theme'));

test('native fixture renders, accepts keyboard input and submits a form', async () => {
  await render(<div className="pds-scope"><ToolingFixture /></div>);
  await expect.element(page.getByRole('heading', { name: 'Tooling verification fixture' })).toBeVisible();
  const input = page.getByRole('textbox', { name: 'Message' });
  await input.click();
  await userEvent.keyboard('Tooling works');
  await expect.element(input).toHaveValue('Tooling works');
  await userEvent.tab();
  await expect.element(page.getByRole('button', { name: 'Submit fixture' })).toHaveFocus();
  await userEvent.keyboard('{Enter}');
  await expect.element(page.getByRole('status', { name: 'Submitted message' })).toHaveTextContent('Tooling works');
  await assertAccessible(page.getByRole('main').element());
});

test('generated theme CSS changes real computed colors without a second palette', async () => {
  await render(<div className="pds-scope" data-testid="scope"><ToolingFixture /></div>);
  const scope = page.getByTestId('scope').element();
  const backgrounds: string[] = [];
  for (const theme of ['Light', 'Dark'] satisfies Theme[]) {
    document.documentElement.dataset.theme = theme.toLowerCase();
    const style = getComputedStyle(scope);
    const reference = document.createElement('span');
    reference.style.backgroundColor = cssVariables[theme]['--color-semantic-background-default'];
    scope.append(reference);
    expect(style.backgroundColor).toBe(getComputedStyle(reference).backgroundColor);
    expect(style.getPropertyValue('--color-chart-series-01').trim()).not.toBe('');
    reference.style.color = cssVariables[theme]['--color-chart-series-01'];
    const chart = document.createElement('span');
    chart.style.color = 'var(--color-chart-series-01)';
    scope.append(chart);
    expect(getComputedStyle(chart).color).toBe(getComputedStyle(reference).color);
    chart.remove();
    expect(style.getPropertyValue('--spacing-inline-sm').trim()).toBe(
      getComputedStyle(scope).getPropertyValue('--spacing-space-8').trim(),
    );
    backgrounds.push(style.backgroundColor);
    reference.remove();
    await assertAccessible(page.getByRole('main').element());
  }
  expect(backgrounds[0]).not.toBe(backgrounds[1]);
});

test('axe assertion fails on a real missing-label violation', async () => {
  await render(<main><input /></main>);
  await expect(assertAccessible(page.getByRole('main').element())).rejects.toThrow('label');
});
