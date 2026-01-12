'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { StickyNote, Calendar, Settings } from 'lucide-react';
import {
  NavContainer,
  LogoContainer,
  LogoIcon,
  NavItem,
  NavDivider,
  NavSpacer,
  NavTooltip,
} from './NavSidebar.styles';

interface NavItemWithTooltipProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
}

const NavItemWithTooltip: React.FC<NavItemWithTooltipProps> = ({ href, icon, label, isActive }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <Link href={href} style={{ textDecoration: 'none' }}>
      <NavItem
        $isActive={isActive}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {icon}
        {showTooltip && (
          <NavTooltip
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.15 }}
          >
            {label}
          </NavTooltip>
        )}
      </NavItem>
    </Link>
  );
};

export const NavSidebar: React.FC = () => {
  const pathname = usePathname();

  const navItems = [
    { href: '/', icon: <StickyNote />, label: 'Notes' },
    { href: '/calendar', icon: <Calendar />, label: 'Calendar' },
  ];

  return (
    <NavContainer
      initial={{ x: -72, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <LogoContainer>
        <LogoIcon>📌</LogoIcon>
      </LogoContainer>

      {navItems.map((item) => (
        <NavItemWithTooltip
          key={item.href}
          href={item.href}
          icon={item.icon}
          label={item.label}
          isActive={pathname === item.href}
        />
      ))}

      <NavDivider />
      <NavSpacer />
      
      <NavItemWithTooltip
        href="/settings"
        icon={<Settings />}
        label="Settings"
        isActive={pathname === '/settings'}
      />
    </NavContainer>
  );
};

export default NavSidebar;
