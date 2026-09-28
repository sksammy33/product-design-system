import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { ConfirmationDialog } from '@product-design-system/react';
import { ModalFrame } from './modal-fixtures';

const meta = { title: 'Components/Modal/Confirmation Dialog', component: ConfirmationDialog,
  args: { open: false, onOpenChange: () => {} },
  render: args => <ModalFrame>{(open, onOpenChange) => <ConfirmationDialog {...args} open={open} onOpenChange={onOpenChange} />}</ModalFrame>,
} satisfies Meta<typeof ConfirmationDialog>;
export default meta;
type Story = StoryObj<typeof meta>;
const play: Story['play'] = async ({ canvas, userEvent }) => {
  await userEvent.click(canvas.getByRole('button', { name: 'Open surface' }));
  await expect(within(document.body).getByRole('dialog')).toBeVisible();
};
export const Default: Story = { play };
export const Loading: Story = { args: { state: 'loading' }, play };
export const Destructive: Story = { args: { state: 'destructive' }, play };
