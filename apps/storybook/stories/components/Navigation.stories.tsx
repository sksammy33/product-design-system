import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { useState } from 'react';
import { Copy, Download, Folder, Pencil, Share2, Trash2 } from 'lucide-react';
import { Breadcrumbs, NavigationMenu, NavigationMenuItem, Pagination, Stepper, Tabs } from '@product-design-system/react';

const meta = { title: 'Components/Navigation/Primitives', parameters: { layout: 'padded' } } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const menuItems = [
  { id: 'edit', label: 'Edit', icon: <Pencil />, shortcut: '⌘E' },
  { id: 'duplicate', label: 'Duplicate', icon: <Copy />, shortcut: '⌘D' },
  { id: 'share', label: 'Share', icon: <Share2 /> },
  { id: 'divider', label: '', divider: true },
  { id: 'download', label: 'Download', icon: <Download />, shortcut: '⌘S' },
  { id: 'move', label: 'Move to…', icon: <Folder />, submenu: [{ id: 'archive', label: 'Archive' }] },
  { id: 'delete', label: 'Delete', icon: <Trash2 />, shortcut: '⌘⌫', destructive: true },
];

export const Menu: Story = { render: () => <NavigationMenu items={menuItems} />, play: async ({ canvas, userEvent }) => {
  await userEvent.click(canvas.getByRole('menuitem', { name: 'Move to…' }));
  await expect(canvas.getByRole('menuitem', { name: 'Archive' })).toBeVisible();
} };
export const MenuItemStates: Story = { render: () => <div role="menu" aria-label="Navigation item states" style={{ width: 220 }}>
  <NavigationMenuItem id="default" label="Default" tabIndex={0} />
  <NavigationMenuItem id="hover" label="Hover" active />
  <NavigationMenuItem id="selected" label="Selected" selected />
  <NavigationMenuItem id="disabled" label="Disabled" disabled />
  <NavigationMenuItem id="destructive" label="Destructive" destructive />
  <NavigationMenuItem id="submenu" label="Submenu" submenu={[{ id: 'child', label: 'Child' }]} />
  <NavigationMenuItem id="divider" label="" divider />
  </div>, play: async ({ canvas }) => {
    await expect(canvas.getByRole('menuitemcheckbox', { name: 'Selected' })).toHaveAttribute('aria-checked', 'true');
  } };
const crumbs = [{ label: 'Home', href: '/' }, { label: 'Products', href: '/products' }, { label: 'Current Page' }];
export const BreadcrumbVariants: Story = { render: () => <div style={{ display: 'grid', gap: 24 }}>
  <Breadcrumbs items={crumbs} label="Default breadcrumb" />
  <Breadcrumbs items={crumbs} variant="home" label="Home icon breadcrumb" />
  <Breadcrumbs items={crumbs} variant="collapsed" label="Collapsed breadcrumb" />
  </div>, play: async ({ canvas, userEvent }) => {
    await expect(within(canvas.getByRole('navigation', { name: 'Default breadcrumb' })).getByText('Current Page')).toHaveAttribute('aria-current', 'page');
    await userEvent.click(canvas.getByRole('button', { name: 'Show hidden breadcrumb pages' }));
    await expect(within(canvas.getByRole('navigation', { name: 'Collapsed breadcrumb' })).getByRole('link', { name: 'Products' })).toBeVisible();
  } };
function PaginationExample({ size }: { size: 'small' | 'medium' | 'large' }) {
  const [page, setPage] = useState(3);
  return <Pagination page={page} pageCount={10} size={size} onPageChange={setPage} label={`${size} pagination`} />;
}
export const PaginationSizes: Story = { render: () => <div style={{ display: 'grid', gap: 24 }}>
  <PaginationExample size="small" /><PaginationExample size="medium" /><PaginationExample size="large" />
  </div>, play: async ({ canvas, userEvent }) => {
    const medium = within(canvas.getByRole('navigation', { name: 'medium pagination' }));
    await userEvent.click(medium.getByRole('button', { name: 'Next page' }));
    await expect(medium.getByRole('button', { name: 'Page 4' })).toHaveAttribute('aria-current', 'page');
  } };
const steps = [{ label: 'Account Setup' }, { label: 'Personal Info' }, { label: 'Confirmation' }];
export const StepperOrientations: Story = { render: () => <div style={{ display: 'grid', gap: 32 }}>
  <Stepper steps={steps} currentStep={2} orientation="horizontal" label="Horizontal progress" />
  <Stepper steps={steps} currentStep={2} orientation="vertical" label="Vertical progress" />
  </div>, play: async ({ canvas }) => {
    await expect(within(canvas.getByRole('navigation', { name: 'Vertical progress' })).getByText('Personal Info').closest('li')).toHaveAttribute('aria-current', 'step');
  } };
const tabs = [
  { id: 'general', label: 'General', content: 'General settings' },
  { id: 'billing', label: 'Billing', content: 'Billing settings' },
  { id: 'security', label: 'Security', content: 'Security settings' },
  { id: 'notifications', label: 'Notifications', content: 'Notification settings' },
];
export const TabVariants: Story = { render: () => <div style={{ display: 'grid', gap: 32 }}>
  <Tabs items={tabs} variant="underline" label="Underline tabs" />
  <Tabs items={tabs} variant="contained" label="Contained tabs" />
  </div>, play: async ({ canvas, userEvent }) => {
    const contained = within(canvas.getByRole('tablist', { name: 'Contained tabs' }));
    await userEvent.click(contained.getByRole('tab', { name: 'Billing' }));
    await expect(contained.getByRole('tab', { name: 'Billing' })).toHaveAttribute('aria-selected', 'true');
  } };
