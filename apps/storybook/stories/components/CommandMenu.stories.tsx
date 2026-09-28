import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { CommandMenu } from '@product-design-system/react';
import { commandGroups, CommandOverlayExample } from './command-fixtures';

const meta = { title: 'Components/Command/Command Menu', component: CommandMenu,
  args: { groups: commandGroups },
  decorators: [(Story) => <div style={{ minHeight: 380, padding: 24, display: 'grid', placeItems: 'start center' }}><Story /></div>],
} satisfies Meta<typeof CommandMenu>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { play: async ({ canvas }) => {
  await expect(canvas.getByRole('combobox', { name: 'Search commands' })).toBeVisible();
  await expect(canvas.getAllByRole('option')).toHaveLength(7);
} };
export const Selected: Story = { play: async ({ canvas, userEvent }) => {
  const input = canvas.getByRole('combobox', { name: 'Search commands' });
  await userEvent.click(input); await userEvent.keyboard('{ArrowDown}');
  await expect(canvas.getByRole('option', { name: 'Calendar' })).toHaveAttribute('aria-selected', 'true');
} };
export const Searching: Story = { play: async ({ canvas, userEvent }) => {
  await userEvent.type(canvas.getByRole('combobox', { name: 'Search commands' }), 'cal');
  await expect(canvas.getAllByRole('option')).toHaveLength(2);
  await expect(canvas.getByRole('group', { name: 'Results' })).toBeVisible();
} };
export const Empty: Story = { play: async ({ canvas, userEvent }) => {
  await userEvent.type(canvas.getByRole('combobox', { name: 'Search commands' }), 'xyzabc');
  await expect(canvas.getByRole('status')).toHaveTextContent('No results found.');
} };
export const Overlay: Story = { render: () => <CommandOverlayExample />, play: async ({ canvas, userEvent }) => {
  await userEvent.click(canvas.getByRole('button', { name: 'Open command menu' }));
  await expect(within(document.body).getByRole('dialog', { name: 'Command menu' })).toBeVisible();
} };
