'use client';

import React, { useState } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import { ChevronLeft, ChevronRight, Calendar, RefreshCw } from 'lucide-react';
import { useGoogleCalendar, formatEventTime, groupEventsByDate } from '@/hooks/useGoogleCalendar';
import {
  PanelContainer,
  ToggleButton,
  PanelHeader,
  PanelTitle,
  DateDisplay,
  PanelContent,
  AuthSection,
  AuthText,
  GoogleButton,
  EventsSection,
  DateGroup,
  DateGroupTitle,
  EventsList,
  EventCard,
  EventTime,
  EventTitle,
  EmptyState,
  EmptyText,
  LoadingSpinner,
  SignOutButton,
  RefreshButton,
  HeaderRow,
} from './CalendarPanel.styles';

export const CalendarPanel: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { status } = useSession();
  const { events, isLoading, error, refresh } = useGoogleCalendar();

  const today = new Date();
  const dateString = today.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  const handleSignIn = () => {
    signIn('google', { callbackUrl: window.location.href });
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: window.location.href });
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const groupedEvents = groupEventsByDate(events);

  return (
    <PanelContainer $isCollapsed={isCollapsed}>
      <ToggleButton onClick={toggleCollapse}>
        {isCollapsed ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
      </ToggleButton>

      {!isCollapsed && (
        <>
          <PanelHeader>
            <HeaderRow>
              <div>
                <PanelTitle>Calendar</PanelTitle>
                <DateDisplay>{dateString}</DateDisplay>
              </div>
              {status === 'authenticated' && (
                <RefreshButton onClick={refresh} disabled={isLoading}>
                  <RefreshCw size={14} />
                </RefreshButton>
              )}
            </HeaderRow>
          </PanelHeader>

          <PanelContent>
            {status === 'loading' || (status === 'authenticated' && isLoading) ? (
              <LoadingSpinner
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              />
            ) : status === 'unauthenticated' ? (
              <AuthSection>
                <Calendar size={48} strokeWidth={1.5} color="rgba(0,0,0,0.2)" />
                <AuthText>
                  Connect your Google Calendar to see your upcoming events
                </AuthText>
                <GoogleButton
                  onClick={handleSignIn}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Sign in with Google
                </GoogleButton>
              </AuthSection>
            ) : error ? (
              <EmptyState>
                <EmptyText>Failed to load events. Please try again.</EmptyText>
              </EmptyState>
            ) : events.length === 0 ? (
              <EmptyState>
                <Calendar size={48} strokeWidth={1.5} color="rgba(0,0,0,0.2)" />
                <EmptyText>No upcoming events this week</EmptyText>
              </EmptyState>
            ) : (
              <EventsSection>
                {Object.entries(groupedEvents).map(([dateKey, dateEvents]) => (
                  <DateGroup key={dateKey}>
                    <DateGroupTitle>{dateKey}</DateGroupTitle>
                    <EventsList>
                      {dateEvents.map((event, index) => (
                        <EventCard
                          key={event.id}
                          $colorIndex={index}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <EventTime>{formatEventTime(event)}</EventTime>
                          <EventTitle>{event.summary}</EventTitle>
                        </EventCard>
                      ))}
                    </EventsList>
                  </DateGroup>
                ))}
              </EventsSection>
            )}
          </PanelContent>

          {status === 'authenticated' && (
            <SignOutButton onClick={handleSignOut}>
              Sign out of Google
            </SignOutButton>
          )}
        </>
      )}
    </PanelContainer>
  );
};

export default CalendarPanel;

