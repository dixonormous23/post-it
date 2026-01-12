'use client';

import React from 'react';
import { SessionProvider } from 'next-auth/react';
import { LayoutContainer, MainContent } from './AppLayout.styles';
import { NavSidebar } from '../NavSidebar/NavSidebar';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <SessionProvider>
      <LayoutContainer>
        <NavSidebar />
        <MainContent>{children}</MainContent>
      </LayoutContainer>
    </SessionProvider>
  );
};

export default AppLayout;
