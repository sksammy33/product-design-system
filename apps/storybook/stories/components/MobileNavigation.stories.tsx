import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';
import { Search } from 'lucide-react';
import { MobileNavigation } from '@product-design-system/react';
import type { MobileNavigationProps } from '@product-design-system/react';
import { BottomBarExample, mobileDestinations } from './navigation-shell-fixtures';

const meta = { title: 'Components/Navigation/Mobile Navigation', component: MobileNavigation,
  decorators: [(Story) => <main><Story /></main>],
} satisfies Meta<typeof MobileNavigation>;
export default meta;
type Story = StoryObj;
const backAction = fn(), searchAction = fn(), closeAction = fn();
export const BottomBar: Story = { args: { variant: 'bottom', items: mobileDestinations, currentId: 'home' },
  render: () => <BottomBarExample />, play: async ({ canvas, userEvent }) => {
    const favorites = canvas.getByRole('button', { name: 'Favorites' });
    favorites.focus(); await userEvent.keyboard('{Enter}');
    await expect(favorites).toHaveAttribute('aria-current', 'page');
  } };
export const TopBarBack: Story = { args: { variant: 'top-back', title: 'Page Title', onBack: backAction,
  action: { label: 'Search this page', icon: <Search size={24} />, onClick: searchAction } } satisfies MobileNavigationProps,
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Go back' }));
    await expect(backAction).toHaveBeenCalledOnce();
    await userEvent.click(canvas.getByRole('button', { name: 'Search this page' }));
    await expect(searchAction).toHaveBeenCalledOnce();
  } };
export const TopBarClose: Story = { args: { variant: 'top-close', title: 'Page Title', onClose: closeAction } satisfies MobileNavigationProps,
  play: async ({ canvas, userEvent }) => {
    const close = canvas.getByRole('button', { name: 'Close' }); close.focus();
    await userEvent.keyboard('{Enter}'); await expect(closeAction).toHaveBeenCalledOnce();
  } };
