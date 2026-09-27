import type { Meta, StoryObj } from '@storybook/react-vite';
import { Switch } from '@product-design-system/react';
import type { SwitchSize } from '@product-design-system/react';

const sizes: SwitchSize[] = ['small', 'medium', 'large'];
const meta = {
  title: 'Components/Switch',
  component: Switch,
  args: { label: 'Switch label', size: 'small', showLabel: true, disabled: false },
  argTypes: { size: { control: 'select', options: sizes } },
  decorators: [(Story) => <div style={{ display: 'grid', gap: 'var(--spacing-space-16)', padding: 'var(--spacing-space-24)' }}><Story /></div>],
} satisfies Meta<typeof Switch>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const SizesAndValues: Story = { render: () => <>{sizes.map(size => <div key={size} style={{ display: 'flex', gap: 'var(--spacing-space-16)' }}>
  <Switch size={size} label={`${size} off`} />
  <Switch size={size} label={`${size} on`} defaultChecked />
</div>)}</> };
export const States: Story = { render: () => <>
  <Switch label="Off" />
  <Switch label="On" defaultChecked />
  <Switch label="Disabled off" disabled />
  <Switch label="Disabled on" disabled defaultChecked />
  <Switch label="Icon-style switch with hidden visual label" showLabel={false} />
</> };
export const Interaction: Story = { render: () => <Switch label="Hover, then Tab to focus" /> };
export const Light: Story = { ...SizesAndValues, globals: { theme: 'light' } };
export const Dark: Story = { ...SizesAndValues, globals: { theme: 'dark' } };
