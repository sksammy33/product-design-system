import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { Select } from '@product-design-system/react';
import { BatchFrame, options } from './batch-a-fixtures';
const meta = { title: 'Components/Select', component: Select, decorators: [(Story) => <BatchFrame><Story /></BatchFrame>],
 args: { label: 'Team', options, helperText: 'Helper text' } } satisfies Meta<typeof Select>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {};
export const Filled: Story = { args: { defaultValue: 'design' } };
export const Disabled: Story = { args: { disabled: true, defaultValue: 'design' } };
export const Error: Story = { args: { error: true, errorText: 'Choose a team' } };
export const Open: Story = { play: async ({ canvas, userEvent }) => { await userEvent.click(canvas.getByRole('combobox', { name: 'Team' })); } };
export const Interaction: Story = { play: async ({ canvas, userEvent }) => {
 await userEvent.click(canvas.getByRole('combobox', { name: 'Team' }));
 await userEvent.click(canvas.getByRole('option', { name: 'Design' }));
 await expect(canvas.getByRole('combobox', { name: 'Team' })).toHaveAttribute('aria-expanded', 'false');
} };
export const Small: Story = { args: { size: 'small' } };
export const Large: Story = { args: { size: 'large' } };


export const Dark: Story = { ...Filled, globals: { theme: 'dark' } };
