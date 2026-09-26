import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';
import { Textarea } from '@product-design-system/react';
import type { FieldSize } from '@product-design-system/react';

const sizes: FieldSize[] = ['small', 'medium', 'large'];
const Stack = ({ children }: { children: ReactNode }) => <div style={{ display: 'grid', gap: 'var(--spacing-space-16)', padding: 'var(--spacing-space-24)', maxWidth: 'var(--spacing-space-128)' }}>{children}</div>;
const meta = {
  title: 'Components/Textarea', component: Textarea,
  args: { label: 'Notes', placeholder: 'Enter your text here...', helperText: 'Add useful context', size: 'medium' },
  decorators: [(Story) => <Stack><Story /></Stack>],
} satisfies Meta<typeof Textarea>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Sizes: Story = { render: () => <>{sizes.map(size => <Textarea key={size} size={size} label={`${size} notes`} placeholder="Enter details" helperText="Helpful context" />)}</> };
export const States: Story = { render: () => <>
  <Textarea label="Default" placeholder="Enter details" helperText="Helper text" />
  <Textarea label="Filled" defaultValue="Current details" helperText="Helper text" />
  <Textarea label="Disabled" disabled placeholder="Enter details" helperText="Helper text" />
  <Textarea label="Read only" readOnly defaultValue="Fixed details" helperText="Helper text" />
  <Textarea label="Error" validation="error" validationMessage="Details are required" />
  <Textarea label="Warning" validation="warning" validationMessage="Review these details" />
  <Textarea label="Success" validation="success" validationMessage="Details accepted" />
</> };
export const Labels: Story = { render: () => <>
  <Textarea label="Required notes" required helperText="Please enter details" />
  <Textarea label="Optional notes" optional helperText="You may leave this blank" />
</> };
export const Light: Story = { ...States, globals: { theme: 'light' } };
export const Dark: Story = { ...States, globals: { theme: 'dark' } };
export const LongNarrow: Story = { render: () => <div style={{ inlineSize: 'var(--spacing-space-128)' }}>
  <Textarea label="A long descriptive label for a multiline field" helperText="A long supporting message that wraps at narrow widths" defaultValue="Long content remains in the native editable area." />
</div> };
