import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { BottomSheet } from '@product-design-system/react';
import { ModalFrame } from './modal-fixtures';

const meta = { title: 'Components/Modal/Bottom Sheet', component: BottomSheet,
  args: { open: false, onOpenChange: () => {}, title: 'Bottom Sheet' },
  render: args => <ModalFrame>{(open, onOpenChange) => <BottomSheet {...args} open={open} onOpenChange={onOpenChange} />}</ModalFrame>,
} satisfies Meta<typeof BottomSheet>;
export default meta;
type Story = StoryObj<typeof meta>;
const play: Story['play'] = async ({ canvas, userEvent }) => {
  await userEvent.click(canvas.getByRole('button', { name: 'Open surface' }));
  await expect(within(document.body).getByRole('dialog', { name: 'Bottom Sheet' })).toBeVisible();
};
export const Small: Story = { args: { size: 'small' }, play };
export const Medium: Story = { args: { size: 'medium' }, play };
export const Large: Story = { args: { size: 'large' }, play };
