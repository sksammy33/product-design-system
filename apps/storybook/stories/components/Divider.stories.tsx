import type { Meta, StoryObj } from '@storybook/react-vite';
import { Divider } from '@product-design-system/react';
const meta = { title: 'Components/Overlays/Divider', component: Divider, decorators: [(Story) => <div style={{ width: 240, padding: 24 }}><Story /></div>] } satisfies Meta<typeof Divider>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Dark: Story = { globals: { theme: 'dark' } };
