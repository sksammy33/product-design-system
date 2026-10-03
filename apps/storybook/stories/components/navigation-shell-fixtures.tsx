import { useState } from 'react';
import { Bell, Calendar, ChartBar, Folder, Heart, House, Inbox, LogOut, Search, Settings, User, Users } from 'lucide-react';
import { MobileNavigation, NavigationBar } from '@product-design-system/react';
import type { SideNavigationGroup, SideNavigationItem } from '@product-design-system/react';

export const shellLinks = [
  { id: 'dashboard', label: 'Dashboard', href: '#dashboard' },
  { id: 'products', label: 'Products', href: '#products' },
  { id: 'analytics', label: 'Analytics', href: '#analytics' },
  { id: 'settings', label: 'Settings', href: '#settings' },
];
export const sideGroups: SideNavigationGroup[] = [
  { id: 'main', label: 'Main', items: [
    { id: 'dashboard', label: 'Dashboard', icon: <House /> },
    { id: 'inbox', label: 'Inbox', icon: <Inbox /> },
    { id: 'calendar', label: 'Calendar', icon: <Calendar /> },
  ] },
  { id: 'management', label: 'Management', items: [
    { id: 'team', label: 'Team', icon: <Users /> },
    { id: 'analytics', label: 'Analytics', icon: <ChartBar /> },
    { id: 'projects', label: 'Projects', icon: <Folder /> },
  ] },
];
export const sideUtilities: SideNavigationItem[] = [
  { id: 'settings', label: 'Settings', icon: <Settings /> },
  { id: 'logout', label: 'Log Out', icon: <LogOut /> },
];
export const mobileDestinations: SideNavigationItem[] = [
  { id: 'home', label: 'Home', icon: <House /> },
  { id: 'search', label: 'Search', icon: <Search /> },
  { id: 'favorites', label: 'Favorites', icon: <Heart /> },
  { id: 'alerts', label: 'Alerts', icon: <Bell /> },
  { id: 'profile', label: 'Profile', icon: <User /> },
];
export function MobileBarExample() {
  const [open, setOpen] = useState(false);
  return <><NavigationBar variant="mobile" onMenu={() => setOpen(!open)} menuExpanded={open}
    menuControls="shell-mobile-links" onNotifications={() => {}} />
    <div id="shell-mobile-links" hidden={!open}>The consuming app supplies the mobile menu.</div></>;
}
export function BottomBarExample() {
  const [currentId, setCurrentId] = useState('home');
  return <MobileNavigation variant="bottom" items={mobileDestinations} currentId={currentId} onNavigate={setCurrentId} />;
}
