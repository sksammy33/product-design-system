import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';
import { FormActions } from '@product-design-system/react';
import { BatchFrame } from './batch-a-fixtures';
const save = fn();
const meta = { title: 'Components/Forms/Form Actions', component: FormActions, decorators: [(Story) => <BatchFrame><Story /></BatchFrame>],
 args: { primaryAction: { children: 'Save', onClick: save }, secondaryAction: { children: 'Cancel' } } } satisfies Meta<typeof FormActions>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Right: Story = {};
export const Left: Story = { args: { alignment: 'left' } };
export const SpaceBetween: Story = { args: { alignment: 'space-between', primaryAction: { children: 'Continue' } } };
export const FullWidth: Story = { args: { alignment: 'full-width', primaryAction: { children: 'Submit' } } };
export const Interaction: Story = { play: async ({ canvas, userEvent }) => { await userEvent.click(canvas.getByRole('button', { name: 'Save' })); await expect(save).toHaveBeenCalled(); } };
export const Dark: Story = { ...FullWidth, globals: { theme: 'dark' } };
