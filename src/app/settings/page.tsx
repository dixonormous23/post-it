'use client';

import React from 'react';
import styled from 'styled-components';
import { AppLayout } from '@/components/Layout/AppLayout';

const SettingsContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px;
  background: #FAF8F5;
`;

const SettingsCard = styled.div`
  max-width: 600px;
  width: 100%;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 40px;
  border: 1px solid rgba(0, 0, 0, 0.06);
`;

const Title = styled.h1`
  font-family: 'DM Sans', sans-serif;
  font-size: 28px;
  font-weight: 600;
  color: #2D2A26;
  margin: 0 0 8px;
`;

const Subtitle = styled.p`
  font-family: 'DM Sans', sans-serif;
  font-size: 15px;
  color: rgba(0, 0, 0, 0.5);
  margin: 0 0 32px;
`;

const ComingSoon = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 48px;
  text-align: center;
`;

const ComingSoonIcon = styled.span`
  font-size: 48px;
  margin-bottom: 16px;
`;

const ComingSoonText = styled.p`
  font-family: 'DM Sans', sans-serif;
  font-size: 16px;
  color: rgba(0, 0, 0, 0.5);
  margin: 0;
`;

export default function SettingsPage() {
  return (
    <AppLayout>
      <SettingsContainer>
        <SettingsCard>
          <Title>Settings</Title>
          <Subtitle>Customize your Sticky Notes experience</Subtitle>
          <ComingSoon>
            <ComingSoonIcon>⚙️</ComingSoonIcon>
            <ComingSoonText>Settings coming soon...</ComingSoonText>
          </ComingSoon>
        </SettingsCard>
      </SettingsContainer>
    </AppLayout>
  );
}
