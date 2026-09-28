import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { MultiSelect } from '@product-design-system/react';
import { BatchFrame, options } from './batch-a-fixtures';
const meta = { title: 'Components/MultiSelect', component: MultiSelect, decorators: [(Story) => <BatchFrame><Story /></BatchFrame>],
 args: { label: 'Team', options, helperText: 'Select multiple options' } } satisfies Meta<typeof MultiSelect>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {};
export const Filled: Story = { args: { defaultValue: ['design'] } };
export const Disabled: Story = { args: { disabled: true, defaultValue: ['design', 'engineering'] } };
export const Error: Story = { args: { error: true, errorText: 'Choose a team' } };
export const Open: Story = { play: async ({ canvas, userEvent }) => { await userEvent.click(canvas.getByRole('combobox', { name: 'Team' })); } };
export const Interaction: Story = { play: async ({ canvas, userEvent }) => {
 await userEvent.click(canvas.getByRole('combobox', { name: 'Team' }));
 await userEvent.click(canvas.getByRole('option', { name: 'Design' }));
 await expect(canvas.getByRole('button', { name: 'Remove Design' })).toBeVisible();
} };

export const Multiple: Story = { args: { defaultValue: ['design', 'engineering', 'marketing'] } };

export const Dark: Story = { ...Filled, globals: { theme: 'dark' } };
