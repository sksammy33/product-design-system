import { useState } from 'react';
import { Calendar, Calculator, Mail, Moon, Search, Settings, UserRound } from 'lucide-react';
import { Button, CommandMenu } from '@product-design-system/react';
import type { CommandGroupData } from '@product-design-system/react';

export const commandGroups: CommandGroupData[] = [
  { id: 'suggestions', label: 'Suggestions', items: [
    { id: 'calendar', label: 'Calendar', icon: <Calendar size={16} />, shortcut: ['⌘', 'C'] },
    { id: 'search', label: 'Search', icon: <Search size={16} />, shortcut: ['⌘', 'S'] },
    { id: 'mail', label: 'Mail', icon: <Mail size={16} />, shortcut: ['⌘', 'M'] },
  ] },
  { id: 'settings', label: 'Settings', items: [
    { id: 'profile', label: 'Profile', icon: <UserRound size={16} />, shortcut: ['⌘', 'P'] },
    { id: 'settings', label: 'Settings', icon: <Settings size={16} />, shortcut: ['⌘', ','] },
    { id: 'theme', label: 'Theme', icon: <Moon size={16} /> },
    { id: 'calculator', label: 'Calculator', icon: <Calculator size={16} />, keywords: ['cal'] },
  ] },
];

export function CommandOverlayExample() {
  const [open, setOpen] = useState(false);
  return <div style={{ minHeight: 320, display: 'grid', placeItems: 'center' }}>
    <Button aria-haspopup="dialog" aria-controls={open ? 'storybook-command-menu' : undefined}
      aria-expanded={open} onClick={() => setOpen(true)}>Open command menu</Button>
    <CommandMenu id="storybook-command-menu" groups={commandGroups} open={open} onOpenChange={setOpen} />
  </div>;
}
