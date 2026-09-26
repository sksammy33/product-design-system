import { useState } from 'react';
import type { ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Mail, Search } from 'lucide-react';
import { Input } from '@product-design-system/react';
import type { FieldSize, InputType } from '@product-design-system/react';

const sizes: FieldSize[] = ['small', 'medium', 'large'];
const Stack = ({ children }: { children: ReactNode }) => <div style={{ display: 'grid', gap: 'var(--spacing-space-16)', padding: 'var(--spacing-space-24)', maxWidth: 'var(--spacing-space-128)' }}>{children}</div>;
type PlaygroundArgs = { label: string; placeholder: string; helperText: string; size: FieldSize; type: InputType };
const meta = {
  title: 'Components/Input', render: (args: PlaygroundArgs) => <Input {...args} />,
  args: { label: 'Email', placeholder: 'you@example.com', helperText: 'Use your work address', size: 'medium', type: 'email' },
  decorators: [(Story) => <Stack><Story /></Stack>],
} satisfies Meta<PlaygroundArgs>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Sizes: Story = { render: () => <>{sizes.map(size => <Input key={size} size={size} label={`${size} input`} placeholder="Enter a value" helperText="Helpful context" />)}</> };
export const States: Story = { render: () => <>
  <Input label="Default" placeholder="Placeholder" helperText="Helper text" />
  <Input label="Filled" defaultValue="Current value" helperText="Helper text" />
  <Input label="Disabled" disabled placeholder="Placeholder" helperText="Helper text" />
  <Input label="Read only" readOnly defaultValue="Fixed value" helperText="Helper text" />
  <Input label="Error" validation="error" validationMessage="Check this value" />
  <Input label="Warning" validation="warning" validationMessage="Review this value" />
  <Input label="Success" validation="success" validationMessage="Looks good" />
</> };
export const Adornments: Story = { render: () => <>
  <Input label="Search" leadingIcon={<Search />} placeholder="Search..." />
  <Input label="Email" trailingIcon={<Mail />} placeholder="you@example.com" />
  <Input label="Amount" prefix="$" suffix="USD" placeholder="0" />
</> };
function ClearExample() {
  const [value, setValue] = useState('Search term');
  return <Input label="Clearable search" value={value} onChange={event => setValue(event.target.value)}
    clearable onClear={() => setValue('')} leadingIcon={<Search />} />;
}
export const ClearAction: Story = { render: () => <ClearExample /> };
export const Labels: Story = { render: () => <>
  <Input label="Required name" required helperText="Please enter a name" />
  <Input label="Nickname" optional helperText="You may leave this blank" />
</> };
export const Light: Story = { ...States, globals: { theme: 'light' } };
export const Dark: Story = { ...States, globals: { theme: 'dark' } };
export const LongNarrow: Story = { render: () => <div style={{ inlineSize: 'var(--spacing-space-128)' }}>
  <Input label="A long descriptive label for an important field" helperText="A long supporting message that wraps at narrow widths" defaultValue="A longer current value" />
</div> };
