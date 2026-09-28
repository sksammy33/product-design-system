import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Popover } from '@product-design-system/react';
import { OverlayFrame } from './overlay-fixtures';
const meta = { title: 'Components/Overlays/Popover', component: Popover, decorators: [(Story) => <OverlayFrame><Story /></OverlayFrame>],
 args: { triggerLabel: 'Open popover', title: 'Popover Title', description: 'Optional description text',
 children: <p>Popover content goes here. You can place any content in this area.</p> } } satisfies Meta<typeof Popover>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Closed: Story = {};
export const Open: Story = { play: async ({ canvas, userEvent }) => { await userEvent.click(canvas.getByRole('button', { name: 'Open popover' })); await expect(within(document.body).getByRole('dialog')).toBeVisible(); } };
export const Dark: Story = { ...Open, globals: { theme: 'dark' } };
