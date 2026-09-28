import type { ReactNode } from 'react';
import { ClipboardPaste, Copy, Ellipsis, Redo2, Scissors, Trash2, Undo2 } from 'lucide-react';
import type { MenuEntry } from '@product-design-system/react';
export const editItems: MenuEntry[] = [
  { type: 'label', label: 'Edit' },
  { id: 'undo', label: 'Undo', icon: <Undo2 size={16} />, shortcut: '⌘Z' },
  { id: 'redo', label: 'Redo', icon: <Redo2 size={16} />, shortcut: '⌘⇧Z' },
  { type: 'separator' },
  { id: 'cut', label: 'Cut', icon: <Scissors size={16} />, shortcut: '⌘X' },
  { id: 'copy', label: 'Copy', icon: <Copy size={16} />, shortcut: '⌘C' },
  { id: 'paste', label: 'Paste', icon: <ClipboardPaste size={16} />, shortcut: '⌘V' },
  { type: 'separator' },
  { id: 'more', label: 'More Options', icon: <Ellipsis size={16} /> },
  { type: 'separator' },
  { id: 'delete', label: 'Delete', icon: <Trash2 size={16} />, shortcut: '⌫', destructive: true },
];
export const contextItems: MenuEntry[] = [
  { id: 'back', label: 'Back' }, { id: 'forward', label: 'Forward' },
  { id: 'reload', label: 'Reload', shortcut: '⌘R' }, { type: 'separator' },
  { id: 'save', label: 'Save As...', shortcut: '⌘S' },
  { id: 'print', label: 'Print', shortcut: '⌘P' }, { type: 'separator' },
  { id: 'source', label: 'View Source' }, { id: 'inspect', label: 'Inspect', shortcut: '⌘⇧I' },
];
export const submenuItems: MenuEntry[] = [
  { id: 'share', label: 'Share' },
  { id: 'more-tools', label: 'More Tools', submenu: [
    { id: 'developer-tools', label: 'Developer Tools' },
    { id: 'extensions', label: 'Extensions' },
    { id: 'task-manager', label: 'Task Manager' },
  ] },
  { id: 'settings', label: 'Settings' },
];
export function OverlayFrame({ children }: { children: ReactNode }) {
  return <div style={{ padding: 'var(--spacing-space-48)', minHeight: 360, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{children}</div>;
}
