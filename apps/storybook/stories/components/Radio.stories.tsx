import type { Meta, StoryObj } from '@storybook/react-vite';
import { Radio } from '@product-design-system/react';

const meta = {
  title: 'Components/Radio',
  component: Radio,
  args: { name: 'radio-playground', label: 'Radio label', helperText: 'Helper text', disabled: false, error: false },
  decorators: [(Story) => <div style={{ display: 'grid', gap: 'var(--spacing-space-16)', padding: 'var(--spacing-space-24)' }}><Story /></div>],
} satisfies Meta<typeof Radio>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Group: Story = { render: () => <fieldset style={{ border: 0, padding: 0 }}><legend>Choose a plan</legend>
  <div style={{ display: 'grid', gap: 'var(--spacing-space-8)' }}>
    <Radio name="plan" value="basic" label="Basic" defaultChecked />
    <Radio name="plan" value="pro" label="Pro" helperText="More features" />
    <Radio name="plan" value="team" label="Team" />
  </div>
</fieldset> };
export const States: Story = { render: () => <>
  <Radio name="default" label="Unselected" />
  <Radio name="selected" label="Selected" defaultChecked />
  <Radio name="disabled-off" label="Disabled unselected" disabled />
  <Radio name="disabled-on" label="Disabled selected" defaultChecked disabled />
  <Radio name="error-off" label="Error unselected" error errorText="Choose an option" />
  <Radio name="error-on" label="Error selected" defaultChecked error errorText="Review this option" />
</> };
export const Interaction: Story = { ...Group };
export const Light: Story = { ...States, globals: { theme: 'light' } };
export const Dark: Story = { ...States, globals: { theme: 'dark' } };
