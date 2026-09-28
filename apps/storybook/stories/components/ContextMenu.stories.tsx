import type { Meta, StoryObj } from '@storybook/react-vite';
import { ContextMenu } from '@product-design-system/react';
import { OverlayFrame, contextItems, submenuItems } from './overlay-fixtures';
const meta = { title: 'Components/Overlays/Context Menu', component: ContextMenu,
 decorators: [(Story) => <OverlayFrame><Story /></OverlayFrame>],
 args: { label: 'Canvas actions', children: <div style={{ padding: 32, border: '1px solid var(--color-semantic-border-default)' }}>Right-click or press Shift+F10</div>, items: contextItems } } satisfies Meta<typeof ContextMenu>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const WithSubmenu: Story = { args: { items: submenuItems } };
export const Dark: Story = { ...WithSubmenu, globals: { theme: 'dark' } };
