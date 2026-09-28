import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { Button, Tooltip } from '@product-design-system/react';
import { OverlayFrame } from './overlay-fixtures';
const meta = { title: 'Components/Overlays/Tooltip', component: Tooltip, decorators: [(Story) => <OverlayFrame><Story /></OverlayFrame>],
 args: { trigger: <Button>Hover or focus</Button>, children: 'Tooltip text', shortcut: '⌘K' } } satisfies Meta<typeof Tooltip>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Top: Story = {};
export const Bottom: Story = { args: { position: 'bottom' } };
export const Left: Story = { args: { position: 'left' } };
export const Right: Story = { args: { position: 'right' } };
export const Focus: Story = { play: async ({ canvas, userEvent }) => { await userEvent.tab(); await expect(canvas.getByRole('tooltip')).toBeVisible(); } };
export const Dark: Story = { ...Focus, globals: { theme: 'dark' } };
