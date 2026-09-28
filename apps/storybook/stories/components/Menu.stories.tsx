import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { Menu } from '@product-design-system/react';
import { OverlayFrame, editItems, submenuItems } from './overlay-fixtures';
const meta = { title: 'Components/Overlays/Menu', component: Menu, decorators: [(Story) => <OverlayFrame><Story /></OverlayFrame>],
 args: { label: 'Edit menu', items: editItems } } satisfies Meta<typeof Menu>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Edit: Story = {};
export const WithSubmenu: Story = { args: { items: submenuItems, label: 'Tools menu' } };
export const Keyboard: Story = { play: async ({ canvas, userEvent }) => {
 await userEvent.keyboard('{ArrowDown}');
 await expect(canvas.getByRole('menuitem', { name: 'Redo' })).toHaveFocus();
} };
export const Dark: Story = { ...Edit, globals: { theme: 'dark' } };
