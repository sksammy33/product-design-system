import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { CheckboxGroup } from '@product-design-system/react';
import { BatchFrame, options } from './batch-a-fixtures';
const meta = { title: 'Components/CheckboxGroup', component: CheckboxGroup, decorators: [(Story) => <BatchFrame><Story /></BatchFrame>],
 args: { label: 'Group Label', name: 'checkboxgroup', options, helperText: 'Select all that apply' } } satisfies Meta<typeof CheckboxGroup>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Vertical: Story = {};
export const Horizontal: Story = { args: { layout: 'horizontal' } };
export const Disabled: Story = { args: { disabled: true, defaultValue: ['design'] } };
export const Error: Story = { args: { error: true, errorText: 'Review your selection' } };
export const Interaction: Story = { play: async ({ canvas, userEvent }) => {
 await userEvent.click(canvas.getByRole('checkbox', { name: 'Design' }));
 await expect(canvas.getByRole('checkbox', { name: 'Design' })).toBeChecked();
} };
export const Dark: Story = { ...Horizontal, globals: { theme: 'dark' } };
