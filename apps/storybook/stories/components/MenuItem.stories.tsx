import type { Meta, StoryObj } from '@storybook/react-vite';
import { MenuItem } from '@product-design-system/react';
const meta = { title: 'Components/Overlays/Menu Item', component: MenuItem,
 decorators: [(Story) => <div role="menu" aria-label="Example actions" style={{ width: 240, padding: 4 }}><Story /></div>],
 args: { label: 'Menu Item', shortcut: '⌘K' } } satisfies Meta<typeof MenuItem>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Selected: Story = { args: { selected: true } };
export const Disabled: Story = { args: { disabled: true } };
export const Destructive: Story = { args: { destructive: true } };
export const Dark: Story = { ...Selected, globals: { theme: 'dark' } };
