import type { Meta, StoryObj } from '@storybook/react-vite';
import { Checkbox } from '@product-design-system/react';

const meta = {
  title: 'Components/Checkbox',
  component: Checkbox,
  args: { label: 'Checkbox label', helperText: 'Helper text', indeterminate: false, disabled: false, error: false },
  decorators: [(Story) => <div style={{ display: 'grid', gap: 'var(--spacing-space-16)', padding: 'var(--spacing-space-24)' }}><Story /></div>],
} satisfies Meta<typeof Checkbox>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Values: Story = { render: () => <>
  <Checkbox label="Unchecked" />
  <Checkbox label="Checked" defaultChecked />
  <Checkbox label="Indeterminate" indeterminate />
</> };
export const States: Story = { render: () => <>
  <Checkbox label="Default" helperText="Select this option" />
  <Checkbox label="Checked" defaultChecked />
  <Checkbox label="Disabled unchecked" disabled />
  <Checkbox label="Disabled checked" defaultChecked disabled />
  <Checkbox label="Disabled indeterminate" indeterminate disabled />
  <Checkbox label="Error unchecked" error errorText="Selection required" />
  <Checkbox label="Error checked" defaultChecked error errorText="Review this selection" />
  <Checkbox label="Error indeterminate" indeterminate error errorText="Review this selection" />
</> };
export const Interaction: Story = { render: () => <Checkbox label="Hover, then Tab to focus" helperText="Space toggles the checkbox" /> };
export const Light: Story = { ...States, globals: { theme: 'light' } };
export const Dark: Story = { ...States, globals: { theme: 'dark' } };
