import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';
import { NavigationBar } from '@product-design-system/react';
import { MobileBarExample, shellLinks } from './navigation-shell-fixtures';

const meta = { title: 'Components/Navigation/Navigation Bar', component: NavigationBar,
  args: { brand: { label: 'Brand' }, items: shellLinks, currentId: 'dashboard', onSearch: fn(), onNotifications: fn(), onProfile: fn() },
  decorators: [(Story) => <main style={{ maxWidth: 1280 }}><Story /></main>],
} satisfies Meta<typeof NavigationBar>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Desktop: Story = { play: async ({ canvas, userEvent, args }) => {
  await expect(canvas.getByRole('link', { name: 'Dashboard' })).toHaveAttribute('aria-current', 'page');
  await userEvent.click(canvas.getByRole('button', { name: 'Search' }));
  await expect(args.onSearch).toHaveBeenCalledOnce();
} };
export const Mobile: Story = { render: () => <MobileBarExample />, play: async ({ canvas, userEvent }) => {
  const menu = canvas.getByRole('button', { name: 'Open navigation menu' });
  menu.focus(); await userEvent.keyboard('{Enter}');
  await expect(menu).toHaveAttribute('aria-expanded', 'true');
  await expect(canvas.getByText('The consuming app supplies the mobile menu.')).toBeVisible();
} };
