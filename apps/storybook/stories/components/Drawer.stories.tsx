import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Drawer } from '@product-design-system/react';
import { ModalFrame } from './modal-fixtures';

const meta = { title: 'Components/Modal/Drawer', component: Drawer,
  args: { open: false, onOpenChange: () => {}, title: 'Drawer Title', description: 'Drawer description text' },
  render: args => <ModalFrame>{(open, onOpenChange) => <Drawer {...args} open={open} onOpenChange={onOpenChange} />}</ModalFrame>,
} satisfies Meta<typeof Drawer>;
export default meta;
type Story = StoryObj<typeof meta>;
const play: Story['play'] = async ({ canvas, userEvent }) => {
  await userEvent.click(canvas.getByRole('button', { name: 'Open surface' }));
  await expect(within(document.body).getByRole('dialog', { name: 'Drawer Title' })).toBeVisible();
};
export const LeftSmall: Story = { args: { direction: 'left', size: 'small' }, play };
export const LeftMedium: Story = { args: { direction: 'left', size: 'medium' }, play };
export const LeftLarge: Story = { args: { direction: 'left', size: 'large' }, play };
export const RightSmall: Story = { args: { direction: 'right', size: 'small' }, play };
export const RightMedium: Story = { args: { direction: 'right', size: 'medium' }, play };
export const RightLarge: Story = { args: { direction: 'right', size: 'large' }, play };
