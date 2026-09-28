import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { KeyboardShortcut } from '@product-design-system/react';

const meta = { title: 'Components/Command/Keyboard Shortcut', component: KeyboardShortcut,
  args: { keys: ['⌘', 'K'] },
  decorators: [(Story) => <div style={{ padding: 24 }}><Story /></div>],
} satisfies Meta<typeof KeyboardShortcut>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { play: async ({ canvas }) => {
  await expect(canvas.getByText('⌘')).toBeVisible();
  await expect(canvas.getByText('K')).toBeVisible();
} };
