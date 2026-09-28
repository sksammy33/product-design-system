import type { Meta, StoryObj } from '@storybook/react-vite';
import { File } from 'lucide-react';
import { expect } from 'storybook/test';
import { CommandItem } from '@product-design-system/react';

const meta = { title: 'Components/Command/Command Item', component: CommandItem,
  args: { id: 'new-file', label: 'New File', icon: <File size={16} />, shortcut: ['⌘', 'K'] },
  decorators: [(Story) => <div role="listbox" aria-label="Commands" style={{ width: 460, maxWidth: '100%', padding: 12 }}><Story /></div>],
} satisfies Meta<typeof CommandItem>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { play: async ({ canvas }) => { await expect(canvas.getByRole('option', { name: 'New File' })).toBeVisible(); } };
export const Selected: Story = { args: { selected: true }, play: async ({ canvas }) => { await expect(canvas.getByRole('option', { name: 'New File' })).toHaveAttribute('aria-selected', 'true'); } };
export const Disabled: Story = { args: { disabled: true }, play: async ({ canvas }) => { await expect(canvas.getByRole('option', { name: 'New File' })).toHaveAttribute('aria-disabled', 'true'); } };
