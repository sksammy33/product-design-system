import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Dropdown } from '@product-design-system/react';
import { OverlayFrame } from './overlay-fixtures';
const items = Array.from({ length: 5 }, (_, i) => ({ id: `option-${i + 1}`, label: `Option ${i + 1}` }));
const meta = { title: 'Components/Overlays/Dropdown', component: Dropdown, decorators: [(Story) => <OverlayFrame><Story /></OverlayFrame>],
 args: { items } } satisfies Meta<typeof Dropdown>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Closed: Story = {};
export const Open: Story = { play: async ({ canvas, userEvent }) => { await userEvent.click(canvas.getByRole('button', { name: 'Select option' })); await expect(within(document.body).getByRole('menu')).toBeVisible(); } };
export const Selection: Story = { play: async ({ canvas, userEvent }) => {
 await userEvent.click(canvas.getByRole('button', { name: 'Select option' }));
 await userEvent.click(within(document.body).getByRole('menuitem', { name: 'Option 2' }));
 await expect(canvas.getByRole('button', { name: 'Option 2' })).toHaveFocus();
} };
export const Disabled: Story = { args: { disabled: true } };
export const Dark: Story = { ...Open, globals: { theme: 'dark' } };
