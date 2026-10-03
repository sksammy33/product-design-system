import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';
import { SideNavigation } from '@product-design-system/react';
import { sideGroups, sideUtilities } from './navigation-shell-fixtures';

const meta = { title: 'Components/Navigation/Side Navigation', component: SideNavigation,
  args: { groups: sideGroups, utilities: sideUtilities, currentId: 'dashboard', onNavigate: fn() },
  decorators: [(Story) => <main><Story /></main>],
} satisfies Meta<typeof SideNavigation>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Expanded: Story = { play: async ({ canvas, userEvent, args }) => {
  await expect(canvas.getByRole('button', { name: 'Dashboard' })).toHaveAttribute('aria-current', 'page');
  await userEvent.click(canvas.getByRole('button', { name: 'Inbox' }));
  await expect(args.onNavigate).toHaveBeenCalled();
} };
export const Collapsed: Story = { args: { collapsed: true }, play: async ({ canvas, userEvent, args }) => {
  const dashboard = canvas.getByRole('button', { name: 'Dashboard' });
  dashboard.focus(); await userEvent.keyboard('{Tab}');
  await expect(canvas.getByRole('button', { name: 'Inbox' })).toHaveFocus();
  await userEvent.keyboard('{Enter}'); await expect(args.onNavigate).toHaveBeenCalled();
  await expect(canvas.getByRole('button', { name: 'Log Out' })).toHaveAccessibleName('Log Out');
} };
