import type { Meta, StoryObj } from '@storybook/react-vite';
import { Calendar, Mail, Search } from 'lucide-react';
import { expect } from 'storybook/test';
import { CommandGroup } from '@product-design-system/react';

const meta = { title: 'Components/Command/Command Group', component: CommandGroup,
  args: { id: 'suggestions', label: 'Suggestions', items: [
    { id: 'calendar', label: 'Calendar', icon: <Calendar size={16} />, shortcut: ['⌘', 'C'] },
    { id: 'search', label: 'Search', icon: <Search size={16} />, shortcut: ['⌘', 'S'] },
    { id: 'mail', label: 'Mail', icon: <Mail size={16} />, shortcut: ['⌘', 'M'] },
  ] },
  decorators: [(Story) => <div role="listbox" aria-label="Commands" style={{ width: 460, maxWidth: '100%', padding: 12 }}><Story /></div>],
} satisfies Meta<typeof CommandGroup>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { play: async ({ canvas }) => {
  await expect(canvas.getByRole('group', { name: 'Suggestions' })).toBeVisible();
  await expect(canvas.getAllByRole('option')).toHaveLength(3);
} };
