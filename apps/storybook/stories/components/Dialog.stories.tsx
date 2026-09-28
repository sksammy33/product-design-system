import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Dialog } from '@product-design-system/react';
import { ModalFrame } from './modal-fixtures';

const meta = { title: 'Components/Modal/Dialog', component: Dialog,
  args: { open: false, onOpenChange: () => {}, title: 'Dialog Title', description: 'A brief description of the dialog purpose.' },
  render: args => <ModalFrame>{(open, onOpenChange) => <Dialog {...args} open={open} onOpenChange={onOpenChange} />}</ModalFrame>,
} satisfies Meta<typeof Dialog>;
export default meta;
type Story = StoryObj<typeof meta>;
const play: Story['play'] = async ({ canvas, userEvent }) => {
  await userEvent.click(canvas.getByRole('button', { name: 'Open surface' }));
  await expect(within(document.body).getByRole('dialog', { name: /Dialog Title|Delete Item/ })).toBeVisible();
};
export const SmallDefault: Story = { args: { size: 'small', children: <p>Dialog content goes here. You can place any content within this area including forms, text, or other components.</p> }, play };
export const SmallLoading: Story = { args: { size: 'small', state: 'loading' }, play };
export const SmallDestructive: Story = { args: { size: 'small', state: 'destructive', title: 'Delete Item', description: 'This action cannot be undone.' }, play };
export const MediumDefault: Story = { args: { size: 'medium' }, play };
export const MediumLoading: Story = { args: { size: 'medium', state: 'loading' }, play };
export const MediumDestructive: Story = { args: { size: 'medium', state: 'destructive', title: 'Delete Item', description: 'This action cannot be undone.' }, play };
export const LargeDefault: Story = { args: { size: 'large' }, play };
export const LargeLoading: Story = { args: { size: 'large', state: 'loading' }, play };
export const LargeDestructive: Story = { args: { size: 'large', state: 'destructive', title: 'Delete Item', description: 'This action cannot be undone.' }, play };
